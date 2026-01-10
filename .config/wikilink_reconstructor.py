#!/usr/bin/env python3
"""
Wikilink Reconstruction for Notion Sync

Reconstructs [[Entity Name]] wikilink syntax from Notion blocks using a hybrid approach:
1. Direct reconstruction from Notion mentions (most reliable)
2. Tokenization fallback using entity database (for corrupted mentions)

This solves the critical issue where wikilinks are stripped during Notion→Repo sync.

Usage:
    from wikilink_reconstructor import WikilinkReconstructor

    reconstructor = WikilinkReconstructor(notion_client, entity_database)
    text = reconstructor.reconstruct_text_with_wikilinks(notion_rich_text)
"""

import re
import json
from pathlib import Path
from typing import Dict, List, Optional, Set
from notion_client import Client


class WikilinkReconstructor:
    """
    Reconstructs wikilinks from Notion rich text using hybrid approach.
    """

    def __init__(self, notion_client: Client, entity_database: Optional[dict] = None):
        """
        Initialize reconstructor.

        Args:
            notion_client: Authenticated Notion client
            entity_database: Entity database dict (loaded from entity_database.json)
        """
        self.notion = notion_client
        self.entity_db = entity_database or self._load_entity_database()

        # Build quick lookup structures
        self._build_lookup_structures()

        # Cache for page titles (avoid redundant API calls)
        self.page_title_cache: Dict[str, str] = {}

    def _load_entity_database(self) -> dict:
        """Load entity database from .config/entity_database.json."""
        db_path = Path(__file__).parent / 'entity_database.json'
        if not db_path.exists():
            print("⚠️  Entity database not found. Run discover_entities.py --build first.")
            return {'entities': {}}

        with open(db_path, 'r') as f:
            return json.load(f)

    def _build_lookup_structures(self):
        """
        Build optimized lookup structures from entity database.

        Creates:
        - variant_to_canonical: Map variant names → canonical entity name
        - sorted_variants: Variants sorted by length (longest first)
        """
        self.variant_to_canonical: Dict[str, str] = {}

        for entity_name, entity_data in self.entity_db.get('entities', {}).items():
            variants = entity_data.get('variants', [entity_name])

            # Map all variants back to canonical name
            for variant in variants:
                self.variant_to_canonical[variant.lower()] = entity_name

        # Sort by length (longest first) to avoid partial matches
        self.sorted_variants = sorted(
            self.variant_to_canonical.keys(),
            key=len,
            reverse=True
        )

    def fetch_page_title(self, page_id: str) -> Optional[str]:
        """
        Fetch page title from Notion API with caching.

        Args:
            page_id: Notion page ID

        Returns:
            Page title or None if not found
        """
        # Check cache first
        if page_id in self.page_title_cache:
            return self.page_title_cache[page_id]

        try:
            page = self.notion.pages.retrieve(page_id=page_id)

            # Extract title from page properties
            # Try multiple property names (Name, name, title, Title)
            for prop_name in ['Name', 'name', 'Title', 'title']:
                prop = page['properties'].get(prop_name)
                if prop and prop.get('type') == 'title':
                    title_text = prop['title']
                    if title_text:
                        title = title_text[0]['plain_text']
                        self.page_title_cache[page_id] = title
                        return title

            # If no title found, try to get from URL or other fields
            print(f"⚠️  Could not extract title for page {page_id}")
            return None

        except Exception as e:
            print(f"⚠️  Error fetching page {page_id}: {e}")
            return None

    def reconstruct_from_mention(self, mention_obj: dict) -> Optional[str]:
        """
        Reconstruct wikilink from Notion mention object.

        Args:
            mention_obj: Notion mention object from rich_text

        Returns:
            Wikilink string [[Entity Name]] or None if can't reconstruct
        """
        mention_type = mention_obj.get('type')

        if mention_type == 'page':
            page_id = mention_obj.get('page', {}).get('id')
            if page_id:
                title = self.fetch_page_title(page_id)
                if title:
                    return f"[[{title}]]"

        # TODO: Handle other mention types (user, database, date, etc.)
        return None

    def tokenize_and_wikify(self, plain_text: str, preserve_existing: bool = True) -> str:
        """
        Convert plain text to wikilinked text using entity database.

        Args:
            plain_text: Plain text to process
            preserve_existing: Don't wikify text that's already wikilinked

        Returns:
            Text with wikilinks added
        """
        if not plain_text:
            return ""

        result = plain_text

        # If preserving existing wikilinks, skip if already contains [[
        if preserve_existing and '[[' in result:
            return result

        # Match entities (longest first to avoid partial matches)
        for variant in self.sorted_variants:
            canonical = self.variant_to_canonical[variant]

            # Create word boundary pattern (case-insensitive)
            # Escape special regex characters in variant
            escaped_variant = re.escape(variant)
            pattern = r'\b' + escaped_variant + r'\b'

            # Check if match exists
            if re.search(pattern, result, re.IGNORECASE):
                # Replace with wikilink, but only if not already wikilinked
                def replace_fn(match):
                    # Check if already inside wikilink
                    start = match.start()
                    if start >= 2 and result[start-2:start] == '[[':
                        return match.group(0)  # Already wikilinked
                    return f"[[{canonical}]]"

                result = re.sub(pattern, replace_fn, result, flags=re.IGNORECASE)

        return result

    def reconstruct_rich_text(
        self,
        rich_text_array: List[dict],
        use_tokenization: bool = True
    ) -> str:
        """
        Reconstruct text with wikilinks from Notion rich_text array.

        Uses hybrid approach:
        1. Direct mention reconstruction (primary method)
        2. Tokenization fallback (if mentions missing)

        Args:
            rich_text_array: Notion rich_text array from block
            use_tokenization: Whether to apply tokenization fallback

        Returns:
            Reconstructed text with wikilinks and formatting
        """
        text_parts = []

        for segment in rich_text_array:
            segment_type = segment.get('type')

            # Method 1: Direct mention reconstruction
            if segment_type == 'mention':
                wikilink = self.reconstruct_from_mention(segment.get('mention', {}))
                if wikilink:
                    # Apply formatting to wikilink if needed
                    annotations = segment.get('annotations', {})
                    formatted_link = self._apply_formatting(wikilink, annotations)
                    text_parts.append(formatted_link)
                else:
                    # Fallback to plain_text if mention reconstruction fails
                    text_parts.append(segment.get('plain_text', ''))

            # Method 2: Regular text (apply formatting + tokenization)
            elif segment_type == 'text':
                text = segment['text']['content']
                annotations = segment.get('annotations', {})

                # Apply markdown formatting
                formatted_text = self._apply_formatting(text, annotations)

                # Apply tokenization if enabled
                if use_tokenization:
                    formatted_text = self.tokenize_and_wikify(formatted_text)

                text_parts.append(formatted_text)

            else:
                # Unknown type, use plain_text
                text_parts.append(segment.get('plain_text', ''))

        return ''.join(text_parts)

    def _apply_formatting(self, text: str, annotations: dict) -> str:
        """
        Apply markdown formatting based on Notion annotations.

        Args:
            text: Text to format
            annotations: Notion annotations dict

        Returns:
            Text with markdown formatting applied
        """
        # Apply in order: code, bold, italic, strikethrough
        # (innermost to outermost)

        if annotations.get('code'):
            text = f"`{text}`"

        if annotations.get('bold'):
            text = f"**{text}**"

        if annotations.get('italic'):
            text = f"*{text}*"

        if annotations.get('strikethrough'):
            text = f"~~{text}~~"

        return text


# Helper function for backwards compatibility
def reconstruct_wikilinks_from_block(
    notion_client: Client,
    block_data: dict,
    entity_database: Optional[dict] = None
) -> str:
    """
    Convenience function to reconstruct text from a Notion block.

    Args:
        notion_client: Authenticated Notion client
        block_data: Notion block dict containing rich_text
        entity_database: Optional entity database

    Returns:
        Reconstructed text with wikilinks
    """
    reconstructor = WikilinkReconstructor(notion_client, entity_database)

    block_type = block_data.get('type')
    if block_type in ['paragraph', 'heading_1', 'heading_2', 'heading_3',
                      'bulleted_list_item', 'numbered_list_item', 'toggle', 'quote']:
        rich_text = block_data.get(block_type, {}).get('rich_text', [])
        return reconstructor.reconstruct_rich_text(rich_text)

    return ""


# Example usage and testing
if __name__ == '__main__':
    print("Wikilink Reconstructor - Test Mode")
    print("="*80)

    # Test tokenization without Notion client
    class MockReconstructor(WikilinkReconstructor):
        def __init__(self, entity_database):
            self.entity_db = entity_database
            self._build_lookup_structures()
            self.page_title_cache = {}

    # Create test entity database
    test_db = {
        'entities': {
            'Kyle/Nameless': {
                'variants': ['Kyle/Nameless', 'Kyle', 'Nameless'],
                'type': 'PC'
            },
            'Geist': {
                'variants': ['Geist', 'Geist Investigation'],
                'type': 'NPC'
            },
            'Manny': {
                'variants': ['Manny'],
                'type': 'PC'
            }
        }
    }

    reconstructor = MockReconstructor(test_db)

    # Test cases
    test_texts = [
        "Kyle went to see Manny at the tavern",
        "The Geist Investigation is ongoing",
        "Nameless spoke with Kyle about the mission"
    ]

    print("\nTokenization Test:")
    for text in test_texts:
        result = reconstructor.tokenize_and_wikify(text)
        print(f"  Input:  {text}")
        print(f"  Output: {result}")
        print()
