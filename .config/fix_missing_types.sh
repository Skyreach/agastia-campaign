#!/bin/bash
# Fix missing 'type' field in YAML frontmatter

cd /mnt/c/dnd

echo "🔧 Fixing missing 'type' fields in frontmatter..."
echo ""

# Fix Location files (add type: Location after name:)
echo "📍 Locations:"
find Locations -name "*.md" -type f | while read file; do
    # Check if file has 'name:' but not 'type:'
    if grep -q "^name:" "$file" && ! grep -q "^type:" "$file"; then
        # Insert 'type: Location' after the 'name:' line
        sed -i '/^name:/a type: Location' "$file"
        echo "  ✅ Fixed: $file"
    fi
done

# Fix Session files (add type: Session after name:)
echo ""
echo "📅 Sessions:"
find Sessions -name "*.md" -type f | while read file; do
    if grep -q "^name:" "$file" && ! grep -q "^type:" "$file"; then
        sed -i '/^name:/a type: Session' "$file"
        echo "  ✅ Fixed: $file"
    fi
done

# Fix Campaign_Core artifact files (add type: Artifact after name:)
echo ""
echo "📜 Artifacts:"
for file in Campaign_Core/Giant_Axe_Artifact.md Campaign_Core/The_Codex.md; do
    if [ -f "$file" ]; then
        if grep -q "^name:" "$file" && ! grep -q "^type:" "$file"; then
            sed -i '/^name:/a type: Artifact' "$file"
            echo "  ✅ Fixed: $file"
        fi
    fi
done

echo ""
echo "✅ Type fields added! Re-syncing to Notion..."
echo ""

# Re-sync all entities
bash .config/safe_resync_all.sh
