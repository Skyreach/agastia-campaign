# Notion Database Setup

## 1. Create Integration
1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Name: "D&D Campaign Sync"
4. Select your workspace
5. Copy the Internal Integration Token
6. Save to `.config/notion_key.txt`

## 2. Create Database
Create a single database with these properties:

### Properties:
- **Name** (Title) - Entity name
- **Type** (Select) - PC, NPC, Faction, Location, Item, Quest
- **Tags** (Multi-select) - Flexible tagging
- **Status** (Select) - Active, Inactive, Dead, Unknown
- **Relations** (Text) - Free-form relationship notes
- **Location** (Text) - Current location
- **Faction** (Text) - Faction affiliation
- **Goals** (Text) - Current goals/motivations
- **Secrets** (Text) - Hidden information
- **Notes** (Text) - General notes
- **Last Seen** (Date) - Last session appearance
- **Created** (Date) - When added to campaign

### Views to Create:
1. **PCs** - Filter: Type = PC
2. **NPCs** - Filter: Type = NPC
3. **Factions** - Filter: Type = Faction
4. **Locations** - Filter: Type = Location
5. **Active Quests** - Filter: Type = Quest, Status = Active
6. **By Location** - Group by Location property
7. **By Faction** - Group by Faction property

## 3. Share Database with Integration
1. Open your database
2. Click "..." menu → "Add connections"
3. Search for your integration name
4. Click "Confirm"

## 4. Update sync_notion.py
Replace `YOUR_DATABASE_ID_HERE` with your database ID:
- Open database as page
- Copy ID from URL: notion.so/[workspace]/[DATABASE_ID]?v=...

## 5. Security Notes
- ⚠️ **NEVER commit your API key to git**
- The key file is in .gitignore for safety
- **Clear your Claude chat history after providing the API key**
- Keys can be regenerated at https://www.notion.so/my-integrations