#!/usr/bin/env python3
"""Query Notion database to get actual schema"""

import json
from notion_client import Client

# Read API key and database ID
with open('.config/notion_key.txt', 'r') as f:
    notion_key = f.read().strip()

with open('.config/database_id.txt', 'r') as f:
    database_id = f.read().strip()

# Initialize Notion client
notion = Client(auth=notion_key)

# Query database schema
try:
    database = notion.databases.retrieve(database_id=database_id)

    print("="*80)
    print("NOTION DATABASE SCHEMA")
    print("="*80)
    print(f"\nDatabase: {database.get('title', [{}])[0].get('plain_text', 'Unknown')}")
    print(f"Database ID: {database_id}")
    print("\n" + "="*80)
    print("AVAILABLE PROPERTIES:")
    print("="*80)

    properties = database.get('properties', {})

    for prop_name, prop_details in properties.items():
        prop_type = prop_details.get('type', 'unknown')
        print(f"\n  '{prop_name}':")
        print(f"    Type: {prop_type}")

        # Show additional details for specific types
        if prop_type == 'select':
            options = prop_details.get('select', {}).get('options', [])
            if options:
                print(f"    Options: {[opt['name'] for opt in options]}")
        elif prop_type == 'multi_select':
            options = prop_details.get('multi_select', {}).get('options', [])
            if options:
                print(f"    Options: {[opt['name'] for opt in options]}")
        elif prop_type == 'relation':
            database_id = prop_details.get('relation', {}).get('database_id')
            print(f"    Related to: {database_id}")

    print("\n" + "="*80)
    print("FULL SCHEMA (JSON):")
    print("="*80)
    print(json.dumps(properties, indent=2))

    # Save schema to file
    with open('.config/notion_schema_current.json', 'w') as f:
        json.dump(properties, f, indent=2)

    print("\n" + "="*80)
    print("Schema saved to: .config/notion_schema_current.json")
    print("="*80)

except Exception as e:
    print(f"ERROR querying Notion database: {e}")
    import traceback
    traceback.print_exc()
