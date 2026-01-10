#!/usr/bin/env python3
"""
Hash-Based Differential Sync Utilities

Provides utilities for comparing content blocks between local files and Notion
using content hashing. This enables efficient differential sync that only
processes changed blocks.

Key Features:
- Content normalization for consistent hashing
- Block-level change detection
- Efficient O(1) hash lookups
- Preserves formatting for unchanged content

Usage:
    from hash_utilities import hash_block_content, build_block_hashmap, find_changed_blocks
"""

import hashlib
import re
from typing import Dict, List, Set, Tuple, Optional


def normalize_text(text: str, aggressive: bool = True) -> str:
    """
    Normalize text for consistent hashing.

    Args:
        text: Raw text content
        aggressive: If True, aggressively normalize (case-insensitive, whitespace-collapsed)
                   If False, preserve more formatting

    Returns:
        Normalized text suitable for hashing
    """
    if not text:
        return ""

    normalized = text.strip()

    if aggressive:
        # Collapse whitespace
        normalized = re.sub(r'\s+', ' ', normalized)

        # Case-insensitive comparison
        normalized = normalized.lower()

        # Remove markdown formatting for comparison
        # (we want "**bold**" and "bold" to match as same content)
        normalized = re.sub(r'\*\*([^\*]+)\*\*', r'\1', normalized)  # Bold
        normalized = re.sub(r'\*([^\*]+)\*', r'\1', normalized)  # Italic
        normalized = re.sub(r'`([^`]+)`', r'\1', normalized)  # Code

    return normalized


def hash_block_content(
    text: str,
    normalize: bool = True,
    aggressive_normalization: bool = True
) -> str:
    """
    Generate SHA-256 hash of block content.

    Args:
        text: Block text content
        normalize: Whether to normalize text before hashing
        aggressive_normalization: Use aggressive normalization (whitespace, case)

    Returns:
        Hex string of SHA-256 hash
    """
    if normalize:
        text = normalize_text(text, aggressive=aggressive_normalization)

    return hashlib.sha256(text.encode('utf-8')).hexdigest()


def extract_text_from_markdown_block(block_text: str) -> str:
    """
    Extract plain text from a markdown block for hashing.

    Removes formatting markers but preserves semantic content.

    Args:
        block_text: Raw markdown block text

    Returns:
        Extracted text content
    """
    # Remove heading markers but keep text
    text = re.sub(r'^#+\s+', '', block_text)

    # Remove list markers but keep text
    text = re.sub(r'^\s*[-*]\s+', '', text)
    text = re.sub(r'^\s*\d+\.\s+', '', text)

    # Remove toggle markers
    text = re.sub(r'\*\*Toggle:\s*', '', text)
    text = re.sub(r'\*\*$', '', text)

    return text.strip()


class BlockHashMap:
    """
    Hashmap of content blocks for efficient differential comparison.

    Stores both raw content and normalized hashes to enable:
    - Fast change detection (O(1) hash lookups)
    - Preservation of original formatting for unchanged blocks
    """

    def __init__(self):
        self.hash_to_block: Dict[str, dict] = {}
        self.block_order: List[str] = []  # Preserve block order

    def add_block(
        self,
        block_text: str,
        block_type: str,
        block_metadata: Optional[dict] = None
    ) -> str:
        """
        Add a block to the hashmap.

        Args:
            block_text: Raw block text
            block_type: Block type (heading_1, paragraph, etc.)
            block_metadata: Optional metadata (line number, notion_id, etc.)

        Returns:
            Hash of the block
        """
        # Extract semantic content for hashing
        semantic_text = extract_text_from_markdown_block(block_text)

        # Generate hash
        block_hash = hash_block_content(semantic_text)

        # Store block data
        self.hash_to_block[block_hash] = {
            'raw_text': block_text,
            'semantic_text': semantic_text,
            'block_type': block_type,
            'hash': block_hash,
            'metadata': block_metadata or {}
        }

        self.block_order.append(block_hash)

        return block_hash

    def get_block(self, block_hash: str) -> Optional[dict]:
        """Retrieve block data by hash."""
        return self.hash_to_block.get(block_hash)

    def contains(self, block_hash: str) -> bool:
        """Check if hash exists in map."""
        return block_hash in self.hash_to_block

    def __len__(self) -> int:
        return len(self.hash_to_block)


def build_local_block_hashmap(markdown_lines: List[str]) -> BlockHashMap:
    """
    Build hashmap from local markdown file.

    Args:
        markdown_lines: List of markdown lines from local file

    Returns:
        BlockHashMap of all blocks in file
    """
    hashmap = BlockHashMap()

    current_block = []
    current_type = 'paragraph'
    line_num = 0

    for line in markdown_lines:
        line_num += 1

        # Detect block type from markdown
        if line.startswith('# '):
            # Flush previous block
            if current_block:
                block_text = '\n'.join(current_block)
                hashmap.add_block(block_text, current_type, {'line': line_num - len(current_block)})
                current_block = []

            current_type = 'heading_1'
            current_block = [line]

        elif line.startswith('## '):
            if current_block:
                block_text = '\n'.join(current_block)
                hashmap.add_block(block_text, current_type, {'line': line_num - len(current_block)})
                current_block = []

            current_type = 'heading_2'
            current_block = [line]

        elif line.startswith('### '):
            if current_block:
                block_text = '\n'.join(current_block)
                hashmap.add_block(block_text, current_type, {'line': line_num - len(current_block)})
                current_block = []

            current_type = 'heading_3'
            current_block = [line]

        elif line.startswith('**Toggle:'):
            if current_block:
                block_text = '\n'.join(current_block)
                hashmap.add_block(block_text, current_type, {'line': line_num - len(current_block)})
                current_block = []

            current_type = 'toggle'
            current_block = [line]

        elif line.strip() == '':
            # Empty line - might be block boundary
            if current_block:
                block_text = '\n'.join(current_block)
                hashmap.add_block(block_text, current_type, {'line': line_num - len(current_block)})
                current_block = []
            current_type = 'paragraph'

        else:
            # Continue current block
            current_block.append(line)

    # Flush final block
    if current_block:
        block_text = '\n'.join(current_block)
        hashmap.add_block(block_text, current_type, {'line': line_num - len(current_block) + 1})

    return hashmap


def build_notion_block_hashmap(notion_blocks: List[dict]) -> BlockHashMap:
    """
    Build hashmap from Notion blocks.

    Args:
        notion_blocks: List of Notion API block objects

    Returns:
        BlockHashMap of all blocks from Notion
    """
    hashmap = BlockHashMap()

    def extract_notion_text(block_data: dict) -> str:
        """Extract plain text from Notion rich_text array."""
        rich_text = block_data.get('rich_text', [])
        return ''.join([segment.get('plain_text', '') for segment in rich_text])

    for block in notion_blocks:
        block_type = block['type']
        block_id = block['id']

        # Extract text based on block type
        if block_type in ['heading_1', 'heading_2', 'heading_3']:
            text = extract_notion_text(block[block_type])
            block_text = f"{'#' * int(block_type[-1])} {text}"

        elif block_type == 'paragraph':
            text = extract_notion_text(block[block_type])
            block_text = text

        elif block_type == 'toggle':
            text = extract_notion_text(block[block_type])
            block_text = f"**Toggle: {text}**"

        elif block_type in ['bulleted_list_item', 'numbered_list_item']:
            text = extract_notion_text(block[block_type])
            block_text = text

        elif block_type == 'quote':
            text = extract_notion_text(block[block_type])
            block_text = f"> {text}"

        else:
            # Unsupported block type, skip
            continue

        hashmap.add_block(
            block_text,
            block_type,
            {'notion_id': block_id}
        )

    return hashmap


def find_changed_blocks(
    local_hashmap: BlockHashMap,
    notion_hashmap: BlockHashMap
) -> dict:
    """
    Compare two hashmaps to identify changed, added, and removed blocks.

    Args:
        local_hashmap: Hashmap of local file blocks
        notion_hashmap: Hashmap of Notion blocks

    Returns:
        Dict with keys:
        - unchanged: Set of block hashes present in both
        - added_in_notion: Set of hashes only in Notion (new content)
        - removed_in_notion: Set of hashes only in local (deleted in Notion)
        - local_blocks: Dict mapping hash → local block data
        - notion_blocks: Dict mapping hash → Notion block data
    """
    local_hashes = set(local_hashmap.hash_to_block.keys())
    notion_hashes = set(notion_hashmap.hash_to_block.keys())

    unchanged = local_hashes & notion_hashes
    added_in_notion = notion_hashes - local_hashes
    removed_in_notion = local_hashes - notion_hashes

    return {
        'unchanged': unchanged,
        'added': added_in_notion,
        'removed': removed_in_notion,
        'local_blocks': local_hashmap.hash_to_block,
        'notion_blocks': notion_hashmap.hash_to_block,
        'stats': {
            'total_local': len(local_hashes),
            'total_notion': len(notion_hashes),
            'unchanged_count': len(unchanged),
            'added_count': len(added_in_notion),
            'removed_count': len(removed_in_notion)
        }
    }


def print_diff_stats(diff_result: dict):
    """
    Print human-readable statistics about block differences.

    Args:
        diff_result: Result from find_changed_blocks()
    """
    stats = diff_result['stats']

    print("\n" + "="*80)
    print("BLOCK DIFFERENTIAL ANALYSIS")
    print("="*80)
    print(f"Local Blocks:     {stats['total_local']}")
    print(f"Notion Blocks:    {stats['total_notion']}")
    print(f"Unchanged:        {stats['unchanged_count']} blocks")
    print(f"Added in Notion:  {stats['added_count']} blocks (new content)")
    print(f"Removed:          {stats['removed_count']} blocks (deleted in Notion)")
    print("="*80 + "\n")

    # Show added blocks (if any)
    if stats['added_count'] > 0:
        print("NEW BLOCKS FROM NOTION:")
        for block_hash in list(diff_result['added'])[:5]:  # Show first 5
            block = diff_result['notion_blocks'][block_hash]
            text_preview = block['semantic_text'][:60]
            print(f"  + {text_preview}...")
        if stats['added_count'] > 5:
            print(f"  ... and {stats['added_count'] - 5} more")
        print()


# Example usage
if __name__ == '__main__':
    # Test hashing
    text1 = "**Toggle: Session Flow**"
    text2 = "**Toggle: Session Flow**  "  # Extra whitespace
    text3 = "Toggle: Session Flow"  # No bold

    hash1 = hash_block_content(text1)
    hash2 = hash_block_content(text2)
    hash3 = hash_block_content(text3)

    print("Hash Comparison Test:")
    print(f"Text 1: '{text1}' → {hash1[:12]}...")
    print(f"Text 2: '{text2}' → {hash2[:12]}...")
    print(f"Text 3: '{text3}' → {hash3[:12]}...")
    print(f"Hash 1 == Hash 2: {hash1 == hash2} (should be True - whitespace normalized)")
    print(f"Hash 1 == Hash 3: {hash1 == hash3} (should be True - formatting normalized)")
