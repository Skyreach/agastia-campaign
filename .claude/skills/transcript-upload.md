# Transcript Upload Skill

Upload audio transcription files to Notion as part of D&D session documentation.

## When to Use

Invoke this skill when:
- User asks to upload a transcript
- User mentions transcript files from `tools/transcription/outputs/`
- User wants to add session transcription to Notion

## Task

You are a transcript integration specialist. Your job is to:

1. **Locate Transcript Files**
   - Check `tools/transcription/outputs/` for transcript files
   - List available transcripts (JSON, Markdown, TXT)
   - Ask user which transcript to upload if multiple exist

2. **Read Transcript Content**
   - Read the Markdown (.md) version for best formatting
   - Extract metadata (date, speakers, duration)
   - Parse speaker segments

3. **Prepare for Notion**
   - Format content for Notion blocks
   - Organize by speaker sections
   - Add timestamps as needed
   - Create proper heading structure

4. **Upload to Notion**
   - Ask user which Notion page to append to (or create new)
   - Use Notion sync tools to upload
   - Verify upload succeeded

5. **Clean Up**
   - Optionally archive uploaded transcripts
   - Update session notes with transcript link

## Input

- Transcript file path (or latest in outputs/)
- Target Notion page (Session_N or create new)

## Output

- Notion page URL with transcript
- Summary of upload (speakers, duration, segment count)

## Example Usage

```
User: Upload the latest session transcript to Notion
Assistant: I'll help you upload the transcript. Let me check what's available...
```

## Process

### Step 1: Find Transcripts
```python
# List transcripts in outputs directory
transcripts = glob("tools/transcription/outputs/*.md")
```

### Step 2: Read and Parse
```python
# Read markdown file
# Extract metadata from frontmatter
# Parse speaker sections
```

### Step 3: Format for Notion
```python
# Convert markdown to Notion blocks
# Organize with toggles for each speaker
# Add timestamp references
```

### Step 4: Upload
```python
# Use sync_notion.py or similar
# Append to existing session page
# Or create new page in Sessions/
```

### Step 5: Confirm
```python
# Return Notion URL
# Summarize upload
```

## Important Notes

- **Preserve Speaker Labels**: Keep SPEAKER_00, SPEAKER_01, etc. until user can identify
- **Timestamp Format**: Use `[MM:SS]` format for easy reference
- **Collapsible Sections**: Use Notion toggles for long speaker segments
- **Metadata Block**: Include audio file name, date, language, speaker count
- **Privacy**: Transcripts may contain sensitive campaign information
- **File Organization**: Move uploaded transcripts to `outputs/archived/`

## Integration with Session Workflow

When uploading a session transcript:

1. **Link to Session Document**
   - Add transcript to appropriate `Sessions/Session_N.md`
   - Create "Transcript" section
   - Link to full transcript in Notion

2. **Update Session Notes**
   - Extract key moments/quotes
   - Add to session summary
   - Tag important NPCs/locations mentioned

3. **Create Action Items**
   - Scan for player decisions
   - Extract questions/unresolved items
   - Add to session TODO

## Error Handling

- **File Not Found**: List available transcripts, ask user to specify
- **Notion Upload Fails**: Offer to retry or save formatted output locally
- **No HF Token**: Explain that speaker diarization requires HuggingFace token
- **Malformed Transcript**: Validate JSON/Markdown format before upload

## Future Enhancements

- [ ] Auto-identify speakers by voice patterns
- [ ] Extract NPC dialogue automatically
- [ ] Generate session summary from transcript
- [ ] Link transcript segments to campaign wiki entries
- [ ] Create combat encounter timelines from transcript
