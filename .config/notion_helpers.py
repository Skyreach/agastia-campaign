#!/usr/bin/env python3
"""
Universal helpers for Notion integration scripts.
Handles path resolution and client initialization automatically.
"""

import sys
from pathlib import Path

# Dynamically add site-packages for pip --user installations
try:
    from notion_client import Client
    import frontmatter
    import yaml
except ImportError:
    import site
    user_site = site.getusersitepackages()
    if user_site not in sys.path:
        sys.path.insert(0, user_site)
    from notion_client import Client
    import frontmatter
    import yaml

# Constants
DB_ID = '281693f0-c6b4-80be-87c3-f56fef9cc2b9'
LANDING_PAGE_ID = '281693f0c6b480369eadc2ba40e70f77'

def get_campaign_root():
    """Get campaign root directory - hardcoded to prevent nested directory issues"""
    return Path("/mnt/e/dnd/agastia-campaign")

def get_config_dir():
    """Get .config directory path - hardcoded to prevent nested directory issues"""
    return Path("/mnt/e/dnd/agastia-campaign/.config")

def load_notion_key():
    """Load Notion API key from .config/notion_key.txt"""
    key_file = get_config_dir() / 'notion_key.txt'

    if not key_file.exists():
        raise FileNotFoundError(
            f"Notion API key not found at {key_file}\n"
            f"Please create the file with your Notion API key."
        )

    return key_file.read_text().strip()

def load_notion_client():
    """Load and return authenticated Notion client"""
    key = load_notion_key()
    return Client(auth=key)

def load_database_id():
    """Load database ID from .config/database_id.txt or use default"""
    db_file = get_config_dir() / 'database_id.txt'

    if db_file.exists():
        return db_file.read_text().strip()

    return DB_ID

def log_error(message, exit_code=None):
    """Log error message to stderr"""
    print(f"ERROR: {message}", file=sys.stderr)
    if exit_code is not None:
        sys.exit(exit_code)

def log_success(message):
    """Log success message"""
    print(f"✅ {message}")

def log_warning(message):
    """Log warning message"""
    print(f"⚠️  {message}")

def log_info(message):
    """Log info message"""
    print(f"ℹ️  {message}")
