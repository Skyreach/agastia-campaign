#!/bin/bash
# Batch sync all encounter pages to Notion

echo "🔄 Starting batch sync of 124 encounter pages to Notion..."
echo ""

# Counter for progress tracking
total=0
success=0
failed=0

# Sync all encounter .md files except Inspiring_Tables.md
for encounter_file in Encounters/*.md; do
    # Skip Inspiring_Tables.md (already synced)
    if [[ "$encounter_file" == "Encounters/Inspiring_Tables.md" ]]; then
        continue
    fi

    total=$((total + 1))
    filename=$(basename "$encounter_file")

    echo "[$total/124] Syncing: $filename"

    # Sync the encounter file
    if python3 sync_notion.py "$encounter_file" encounter > /dev/null 2>&1; then
        success=$((success + 1))
        echo "  ✅ Success"
    else
        failed=$((failed + 1))
        echo "  ❌ Failed"
    fi

    # Small delay to avoid rate limiting
    sleep 0.5
done

echo ""
echo "========================================="
echo "📊 Batch Sync Complete!"
echo "========================================="
echo "Total encounters: $total"
echo "✅ Successful: $success"
echo "❌ Failed: $failed"
echo ""
