#!/usr/bin/env python3
"""Fix hardcoded paths in all .config Python scripts"""

from pathlib import Path
import re

CONFIG_DIR = Path(__file__).parent

# Pattern replacements
FIXES = [
    # Remove hardcoded site-packages
    (r"sys\.path\.insert\(0, '/home/matt-bourque/\.local/lib/python3\.10/site-packages'\)", ""),
    (r"sys\.path\.insert\(0, '/home/\w+/\.local/lib/python[\d\.]+/site-packages'\)", ""),

    # Fix hardcoded notion key path
    (r"Path\('/mnt/c/dnd/\.config/notion_key\.txt'\)", "Path(__file__).parent / 'notion_key.txt'"),

    # Fix DB_ID definition to use helper
    (r"^DB_ID = '[\w-]+'", "# DB_ID loaded from notion_helpers"),
]

# Scripts to fix (exclude helpers and this script)
EXCLUDE = {'notion_helpers.py', 'fix_all_scripts.py', 'query_notion_schema.py'}

def fix_script(filepath):
    """Fix a single script file"""
    print(f"Processing {filepath.name}...")

    try:
        content = filepath.read_text()
        original = content

        # Apply all fixes
        for pattern, replacement in FIXES:
            content = re.sub(pattern, replacement, content, flags=re.MULTILINE)

        # Add helper imports if script uses Notion
        if 'from notion_client import Client' in content or 'import frontmatter' in content:
            # Check if helpers already imported
            if 'from notion_helpers import' not in content:
                # Find the imports section and add helper import
                import_block = "from pathlib import Path\\nimport sys\\nsys.path.insert(0, str(Path(__file__).parent))\\nfrom notion_helpers import load_notion_client, load_database_id, log_error, log_success, log_warning\\n"

                # Add after shebang and docstring
                lines = content.split('\\n')
                insert_idx = 0
                in_docstring = False

                for i, line in enumerate(lines):
                    if i == 0 and line.startswith('#!'):
                        continue
                    if '"""' in line or "'''" in line:
                        in_docstring = not in_docstring
                        if not in_docstring:
                            insert_idx = i + 1
                            break
                    if not in_docstring and (line.startswith('import ') or line.startswith('from ')):
                        insert_idx = i
                        break

                if insert_idx > 0:
                    lines.insert(insert_idx, import_block)
                    content = '\\n'.join(lines)

        # Replace load_notion_client() definitions with helper usage
        if 'def load_notion_client():' in content:
            # Remove the function definition
            content = re.sub(
                r'def load_notion_client\(\):.*?return Client\(auth=key\)',
                '# load_notion_client() now imported from notion_helpers',
                content,
                flags=re.DOTALL
            )

        # Only write if changes were made
        if content != original:
            # Create backup
            backup = filepath.with_suffix(filepath.suffix + '.bak')
            backup.write_text(original)

            filepath.write_text(content)
            print(f"  ✅ Fixed {filepath.name}")
            return True
        else:
            print(f"  ℹ️  No changes needed for {filepath.name}")
            return False

    except Exception as e:
        print(f"  ❌ Error fixing {filepath.name}: {e}")
        return False

def main():
    """Fix all Python scripts in .config"""
    print("=" * 60)
    print("Fixing Hardcoded Paths in .config Scripts")
    print("=" * 60)
    print()

    scripts = [f for f in CONFIG_DIR.glob('*.py') if f.name not in EXCLUDE]

    fixed_count = 0
    for script in sorted(scripts):
        if fix_script(script):
            fixed_count += 1

    print()
    print("=" * 60)
    print(f"✅ Fixed {fixed_count}/{len(scripts)} scripts")
    print(f"📦 Backups saved as *.py.bak")
    print("=" * 60)

if __name__ == '__main__':
    main()
