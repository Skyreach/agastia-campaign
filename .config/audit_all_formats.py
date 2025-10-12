#!/usr/bin/env python3
"""
Bulk Format Audit Script

Scans all entity files in the campaign and generates a comprehensive compliance report.
Identifies format violations and prioritizes files needing fixes.
"""

import pathlib
import sys
from collections import defaultdict
from format_compliance_check import validate_file, detect_entity_type, parse_frontmatter

# Entity directories to audit
ENTITY_DIRS = [
    'Player_Characters',
    'NPCs',
    'Factions',
    'Locations',
    'Quests',
    'Campaign_Core',
    'Dungeon_Ecologies',
    'Items',
    'Sessions'
]

# Excluded patterns
EXCLUDED_PATTERNS = [
    '.config/',
    '.working/',
    'README.md',
    'CLAUDE.md',
    'COMMANDS.md',
    'NOTION.md',
    'archive/',
    '_notes.md',
    '_private.md'
]

def should_exclude(file_path: str) -> bool:
    """Check if file should be excluded from audit"""
    return any(pattern in str(file_path) for pattern in EXCLUDED_PATTERNS)

def find_all_entity_files() -> list:
    """Find all entity markdown files in campaign directories"""
    campaign_root = pathlib.Path('.')
    entity_files = []

    for entity_dir in ENTITY_DIRS:
        dir_path = campaign_root / entity_dir
        if dir_path.exists():
            for md_file in dir_path.rglob('*.md'):
                if not should_exclude(str(md_file)):
                    entity_files.append(md_file)

    return sorted(entity_files)

def categorize_by_severity(errors: list, warnings: list) -> str:
    """Categorize file by severity of issues"""
    if not errors and not warnings:
        return 'COMPLIANT'
    elif not errors and len(warnings) <= 2:
        return 'MINOR_WARNINGS'
    elif not errors:
        return 'MULTIPLE_WARNINGS'
    elif len(errors) <= 2:
        return 'MINOR_ERRORS'
    else:
        return 'MAJOR_ERRORS'

def main():
    """Main entry point for bulk audit"""
    print("=" * 70)
    print("📋 BULK FORMAT AUDIT - Agastia Campaign")
    print("=" * 70)
    print()

    # Find all files
    print("🔍 Scanning for entity files...")
    entity_files = find_all_entity_files()
    print(f"   Found {len(entity_files)} entity files to audit")
    print()

    # Statistics
    stats = {
        'total': len(entity_files),
        'compliant': 0,
        'has_warnings': 0,
        'has_errors': 0,
        'by_severity': defaultdict(int),
        'by_entity_type': defaultdict(lambda: {'total': 0, 'errors': 0, 'warnings': 0}),
        'common_errors': defaultdict(int),
        'common_warnings': defaultdict(int)
    }

    # Results by severity
    results_by_severity = {
        'COMPLIANT': [],
        'MINOR_WARNINGS': [],
        'MULTIPLE_WARNINGS': [],
        'MINOR_ERRORS': [],
        'MAJOR_ERRORS': []
    }

    # Audit each file
    print("🔍 Auditing files...")
    for i, file_path in enumerate(entity_files, 1):
        if i % 10 == 0:
            print(f"   Progress: {i}/{len(entity_files)}")

        is_valid, errors, warnings = validate_file(str(file_path))

        # Update statistics
        severity = categorize_by_severity(errors, warnings)
        stats['by_severity'][severity] += 1
        results_by_severity[severity].append((file_path, errors, warnings))

        if errors:
            stats['has_errors'] += 1
            for error in errors:
                # Extract error type (first part before colon)
                error_type = error.split(':')[0] if ':' in error else error[:50]
                stats['common_errors'][error_type] += 1
        else:
            if not warnings:
                stats['compliant'] += 1

        if warnings:
            stats['has_warnings'] += 1
            for warning in warnings:
                warning_type = warning.split(':')[0] if ':' in warning else warning[:50]
                stats['common_warnings'][warning_type] += 1

        # Entity type stats
        try:
            content = file_path.read_text()
            frontmatter = parse_frontmatter(content)
            entity_type = detect_entity_type(str(file_path), frontmatter)
        except:
            entity_type = 'Unknown'

        stats['by_entity_type'][entity_type]['total'] += 1
        if errors:
            stats['by_entity_type'][entity_type]['errors'] += 1
        if warnings:
            stats['by_entity_type'][entity_type]['warnings'] += 1

    print("   Audit complete!")
    print()

    # Print summary statistics
    print("=" * 70)
    print("📊 AUDIT SUMMARY")
    print("=" * 70)
    print()
    print(f"Total Files Audited: {stats['total']}")
    print(f"  ✅ Fully Compliant:  {stats['compliant']} ({stats['compliant']/stats['total']*100:.1f}%)")
    print(f"  ⚠️  Has Warnings:     {stats['has_warnings']} ({stats['has_warnings']/stats['total']*100:.1f}%)")
    print(f"  ❌ Has Errors:       {stats['has_errors']} ({stats['has_errors']/stats['total']*100:.1f}%)")
    print()

    print("By Severity:")
    for severity in ['COMPLIANT', 'MINOR_WARNINGS', 'MULTIPLE_WARNINGS', 'MINOR_ERRORS', 'MAJOR_ERRORS']:
        count = stats['by_severity'][severity]
        if count > 0:
            icon = '✅' if severity == 'COMPLIANT' else ('⚠️' if 'WARNING' in severity else '❌')
            print(f"  {icon} {severity.replace('_', ' ').title():20} {count:3} files")
    print()

    print("By Entity Type:")
    for entity_type, type_stats in sorted(stats['by_entity_type'].items()):
        total = type_stats['total']
        errors = type_stats['errors']
        warnings = type_stats['warnings']
        compliant = total - errors
        print(f"  {entity_type:15} {total:3} files  (✅ {compliant}  ⚠️ {warnings}  ❌ {errors})")
    print()

    # Most common issues
    if stats['common_errors']:
        print("Most Common Errors:")
        for error_type, count in sorted(stats['common_errors'].items(), key=lambda x: -x[1])[:5]:
            print(f"  • {error_type}: {count} occurrences")
        print()

    if stats['common_warnings']:
        print("Most Common Warnings:")
        for warning_type, count in sorted(stats['common_warnings'].items(), key=lambda x: -x[1])[:5]:
            print(f"  • {warning_type}: {count} occurrences")
        print()

    # Priority files to fix
    print("=" * 70)
    print("🔧 PRIORITY FIXES NEEDED")
    print("=" * 70)
    print()

    if results_by_severity['MAJOR_ERRORS']:
        print(f"❌ HIGH PRIORITY - Major Errors ({len(results_by_severity['MAJOR_ERRORS'])} files):")
        print("   These files have 3+ errors and should be fixed immediately.")
        print()
        for file_path, errors, warnings in results_by_severity['MAJOR_ERRORS'][:10]:
            print(f"   • {file_path}")
            for error in errors[:3]:
                print(f"     - {error}")
            if len(errors) > 3:
                print(f"     ... and {len(errors)-3} more errors")
        if len(results_by_severity['MAJOR_ERRORS']) > 10:
            print(f"   ... and {len(results_by_severity['MAJOR_ERRORS'])-10} more files")
        print()

    if results_by_severity['MINOR_ERRORS']:
        print(f"❌ MEDIUM PRIORITY - Minor Errors ({len(results_by_severity['MINOR_ERRORS'])} files):")
        print("   These files have 1-2 errors.")
        print()
        for file_path, errors, warnings in results_by_severity['MINOR_ERRORS'][:5]:
            print(f"   • {file_path}")
            for error in errors:
                print(f"     - {error}")
        if len(results_by_severity['MINOR_ERRORS']) > 5:
            print(f"   ... and {len(results_by_severity['MINOR_ERRORS'])-5} more files")
        print()

    if results_by_severity['MULTIPLE_WARNINGS']:
        print(f"⚠️  LOW PRIORITY - Multiple Warnings ({len(results_by_severity['MULTIPLE_WARNINGS'])} files):")
        print("   These files have 3+ warnings (non-blocking but should be addressed).")
        print()
        for file_path, errors, warnings in results_by_severity['MULTIPLE_WARNINGS'][:3]:
            print(f"   • {file_path}")
            for warning in warnings[:2]:
                print(f"     - {warning}")
        if len(results_by_severity['MULTIPLE_WARNINGS']) > 3:
            print(f"   ... and {len(results_by_severity['MULTIPLE_WARNINGS'])-3} more files")
        print()

    # Recommendations
    print("=" * 70)
    print("💡 RECOMMENDATIONS")
    print("=" * 70)
    print()

    total_issues = stats['has_errors'] + stats['has_warnings']
    if total_issues == 0:
        print("🎉 Excellent! All files are format-compliant.")
        print("   No action needed.")
    else:
        print("Next Steps:")
        print()
        if results_by_severity['MAJOR_ERRORS']:
            print("1. Fix high-priority files with major errors:")
            print("   python3 .config/auto_fix_format.py Player_Characters/PC_Example.md")
            print("   (Review auto-fixes, then manually address remaining issues)")
            print()
        if results_by_severity['MINOR_ERRORS']:
            print("2. Fix medium-priority files with minor errors:")
            print("   python3 .config/auto_fix_format.py --dry-run Factions/Faction_Example.md")
            print("   (Check what would be fixed before applying)")
            print()
        if stats['has_warnings']:
            print("3. Review and address warnings:")
            print("   Most warnings can be auto-fixed or are just recommendations")
            print("   python3 .config/auto_fix_format.py <file>")
            print()
        print(f"4. Re-run audit after fixes:")
        print(f"   python3 .config/audit_all_formats.py")
        print()

    print("=" * 70)
    print("📋 For detailed format specs: .config/ENTITY_FORMAT_SPECS.md")
    print("=" * 70)
    print()

    # Exit code based on errors
    sys.exit(1 if stats['has_errors'] > 0 else 0)

if __name__ == '__main__':
    main()
