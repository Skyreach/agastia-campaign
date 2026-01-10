#!/usr/bin/env python3
"""
Frontmatter Format Preservation

Preserves YAML frontmatter formatting during Notion sync to prevent spurious
git diffs from format changes.

Issues this solves:
- version: "1.0.0" → version: 1.0.0 (quotes removed)
- tags: [a, b] → tags:\n- a\n- b (inline array → multiline)

Strategy:
1. Parse original frontmatter to detect format style
2. Update values without changing format
3. Reconstruct frontmatter matching original style
"""

import re
from pathlib import Path
from typing import Dict, Any, Optional
import frontmatter


class FrontmatterStyle:
    """Tracks formatting style for a frontmatter field."""

    def __init__(self, field_name: str, raw_value: str):
        self.field_name = field_name
        self.raw_value = raw_value.strip()

        # Detect quote style
        self.is_quoted = self.raw_value.startswith('"') or self.raw_value.startswith("'")
        if self.is_quoted:
            self.quote_char = self.raw_value[0]
        else:
            self.quote_char = None

        # Detect array style
        self.is_inline_array = self.raw_value.startswith('[')
        self.is_multiline_array = False  # Detected by lack of value on same line

    def format_value(self, value: Any) -> str:
        """Format a value matching the original style."""
        if value is None:
            return ''

        # String values - preserve quote style
        if isinstance(value, str):
            if self.is_quoted:
                # Preserve original quote style
                return f'{self.quote_char}{value}{self.quote_char}'
            else:
                # No quotes in original, keep unquoted if safe
                # Add quotes if value contains special chars
                if ':' in value or '#' in value or value.startswith('-'):
                    return f'"{value}"'
                return value

        # Number values - check if originally quoted
        elif isinstance(value, (int, float)):
            # Convert to string
            str_value = str(value)
            # If original was quoted, preserve quotes even for numbers
            if self.is_quoted:
                return f'{self.quote_char}{str_value}{self.quote_char}'
            return str_value

        # List values - preserve array style
        elif isinstance(value, list):
            if self.is_inline_array:
                # Inline array format: [a, b, c]
                formatted_items = []
                for item in value:
                    if isinstance(item, str):
                        # Keep items unquoted in arrays unless they have spaces
                        if ' ' in item:
                            formatted_items.append(f'"{item}"')
                        else:
                            formatted_items.append(item)
                    else:
                        formatted_items.append(str(item))
                return f"[{', '.join(formatted_items)}]"
            else:
                # Multiline array - will be handled differently
                return value

        # Other types - use default YAML representation
        else:
            return str(value)


class FrontmatterPreserver:
    """
    Preserves frontmatter formatting during updates.
    """

    def __init__(self, original_content: str):
        """
        Initialize with original file content.

        Args:
            original_content: Original markdown file content with frontmatter
        """
        self.original_content = original_content
        self.styles: Dict[str, FrontmatterStyle] = {}
        self._parse_original_styles()

    def _parse_original_styles(self):
        """Parse original frontmatter to detect formatting styles."""
        # Extract frontmatter block
        match = re.match(r'^---\s*\n(.*?)\n---\s*\n', self.original_content, re.DOTALL)
        if not match:
            return

        frontmatter_text = match.group(1)

        # Parse each line to detect style
        for line in frontmatter_text.split('\n'):
            if ':' not in line:
                continue

            # Split on first colon
            parts = line.split(':', 1)
            if len(parts) != 2:
                continue

            field_name = parts[0].strip()
            raw_value = parts[1].strip()

            if raw_value:  # Has value on same line
                self.styles[field_name] = FrontmatterStyle(field_name, raw_value)

    def preserve_format(self, post: frontmatter.Post) -> str:
        """
        Format frontmatter preserving original styles.

        Args:
            post: frontmatter.Post object with potentially updated metadata

        Returns:
            Formatted markdown with preserved frontmatter styles
        """
        # Build frontmatter lines
        fm_lines = ['---']

        # Preserve field order from original if possible
        original_fields = list(self.styles.keys())
        all_fields = set(original_fields) | set(post.metadata.keys())

        # Sort: original fields first (in original order), then new fields
        sorted_fields = []
        for field in original_fields:
            if field in post.metadata:
                sorted_fields.append(field)
        for field in sorted(post.metadata.keys()):
            if field not in sorted_fields:
                sorted_fields.append(field)

        # Format each field
        for field_name in sorted_fields:
            value = post.metadata[field_name]

            # Use preserved style if available
            if field_name in self.styles:
                style = self.styles[field_name]
                formatted_value = style.format_value(value)

                # Check if multiline array (list but not inline)
                if isinstance(value, list) and not style.is_inline_array:
                    # Multiline array format
                    fm_lines.append(f'{field_name}:')
                    for item in value:
                        fm_lines.append(f'- {item}')
                else:
                    fm_lines.append(f'{field_name}: {formatted_value}')
            else:
                # New field - use safe defaults
                if isinstance(value, str):
                    # Quote if contains special chars
                    if ':' in value or '#' in value:
                        fm_lines.append(f'{field_name}: "{value}"')
                    else:
                        fm_lines.append(f'{field_name}: {value}')
                elif isinstance(value, list):
                    # Default to inline array for new fields
                    formatted_items = [str(item) for item in value]
                    fm_lines.append(f'{field_name}: [{", ".join(formatted_items)}]')
                else:
                    fm_lines.append(f'{field_name}: {value}')

        fm_lines.append('---')

        # Combine frontmatter + body
        frontmatter_str = '\n'.join(fm_lines)
        return f'{frontmatter_str}\n\n{post.content}'


def merge_with_preserved_frontmatter(
    local_file_path: Path,
    notion_content: str
) -> str:
    """
    Merge Notion content with local file, preserving frontmatter format.

    Args:
        local_file_path: Path to local markdown file
        notion_content: Body content from Notion (without frontmatter)

    Returns:
        Complete markdown with preserved frontmatter formatting
    """
    # Load original file
    with open(local_file_path, 'r') as f:
        original_content = f.read()

    # Parse original frontmatter
    with open(local_file_path, 'r') as f:
        local_post = frontmatter.load(f)

    # Create preserverto track original styles
    preserver = FrontmatterPreserver(original_content)

    # Update content while keeping metadata
    local_post.content = notion_content

    # Format with preserved styles
    return preserver.preserve_format(local_post)


# Example usage
if __name__ == '__main__':
    # Test case
    original = """---
date: TBD
name: Session 3 - The Steel Dragon Begins
session_number: 3
status: Planning
version: "1.0.0"
tags: [session3, travel, agastia, steel-dragon, player-hooks]
---

# Original Content
This is the body.
"""

    # Parse and modify
    post = frontmatter.loads(original)
    post.content = "# Modified Content\nThis is new body."

    # Preserve format
    preserver = FrontmatterPreserver(original)
    result = preserver.preserve_format(post)

    print("Original frontmatter:")
    print(original.split('---')[1])
    print("\nPreserved frontmatter:")
    print(result.split('---')[1])

    # Check if quotes and inline array preserved
    assert 'version: "1.0.0"' in result, "Quotes not preserved!"
    assert 'tags: [' in result, "Inline array not preserved!"

    print("\n✅ Format preservation test passed!")
