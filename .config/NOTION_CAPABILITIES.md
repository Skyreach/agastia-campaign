# Notion API Capabilities Reference

**Purpose:** Track tested Notion API capabilities to avoid wasted effort and broken implementations.

**Last Updated:** 2025-10-04

---

## ✅ CONFIRMED WORKING

### Database Operations
- **Create new pages in database** ✓
  - Tested: 2025-10-04
  - Details: Can create pages with properties via API
  - Limitations: Must provide database ID

- **Update existing pages** ✓
  - Tested: 2025-10-04
  - Details: Can modify properties and page content
  - Limitations: Requires page ID

- **Add properties to database** ✓
  - Tested: 2025-10-04
  - Details: Can programmatically add new properties to schema
  - Limitations: Cannot modify property types after creation

### Relations
- **Bidirectional relations** ✓
  - Tested: 2025-10-04
  - Details: Can link entities using relation properties
  - Example: NPC → Faction, Faction → NPCs

- **Self-referencing relations** ✓
  - Tested: 2025-10-04
  - Details: "Related Entities" property can link to same database
  - Use case: Any entity can link to any other entity

### Content Formatting
- **Rich text blocks** ✓
  - Tested: 2025-10-04
  - Details: Can add paragraphs, headings, lists, code blocks
  - Supports: Bold, italic, links, mentions

- **Toggle blocks** ✓
  - Tested: 2025-10-04
  - Details: Can create collapsible sections for DM Notes
  - Use case: Hide spoilers/secrets from quick view

### Page Mentions
- **Link to other pages via mentions** ✓
  - Tested: 2025-10-04
  - Details: Can reference other database entries in content
  - Example: "Linked to @Manny" creates clickable link

---

## ❌ CONFIRMED LIMITATIONS

### Database Views
- **Cannot create filtered views programmatically** ✗
  - Tested: 2025-10-04
  - Reason: View configuration not exposed in API
  - Workaround: Manually create views in Notion UI (see NOTION_SETUP_GUIDE.md)

- **Cannot modify view filters via API** ✗
  - Tested: 2025-10-04
  - Reason: Same as above
  - Workaround: One-time manual setup per database

### Page Organization
- **Cannot create page hierarchies outside database** ✗
  - Tested: 2025-10-04
  - Details: API can only create database pages, not nested child pages
  - Workaround: Use "Parent Location" relations for hierarchy

### Property Types
- **Cannot change property type after creation** ✗
  - Tested: 2025-10-04
  - Details: Must delete and recreate property to change type
  - Impact: Be careful when initially creating properties

- **Formula properties are read-only** ✗
  - Tested: 2025-10-04
  - Details: Cannot set formula values via API (computed automatically)
  - Example: "Full Path" formula auto-generates location hierarchy

### Content Limitations
- **No native markdown import** ✗
  - Tested: 2025-10-04
  - Details: Must convert markdown to Notion blocks manually
  - Workaround: Parse markdown and construct block arrays

---

## ⚠️ NEEDS TESTING

### Advanced Relations
- **Multi-select relation filters** ?
  - Status: Untested
  - Use case: Query "NPCs in Faction X at Location Y"
  - Priority: Medium

### Rollup Properties
- **Aggregating related entity data** ?
  - Status: Untested
  - Use case: Count NPCs per faction automatically
  - Priority: Low (can query manually)

### Permissions
- **Page-level visibility controls** ?
  - Status: Untested
  - Use case: Hide DM Notes from player-shared databases
  - Priority: Low (using toggle blocks instead)

---

## 📋 RECOMMENDED PATTERNS

### Page Creation Flow
1. Check if page already exists (search by name or file path)
2. If exists: Update properties and content
3. If new: Create with full property set
4. Always set version property for tracking

### Relation Building
1. Create all individual entities first (PCs, NPCs, Locations, etc.)
2. Then run second pass to build relations
3. Use page IDs (not names) for reliable linking
4. Verify bidirectional relations are auto-created

### Content Organization
```
Page Structure:
- Properties (database columns)
- Player Summary (rich text blocks, visible)
- DM Notes (toggle block, collapsed by default)
- Additional sections (as needed)
```

### Error Handling
- **Duplicate names:** Append file path or type to disambiguate
- **Missing relations:** Log warnings, create page anyway
- **Rate limits:** Implement exponential backoff (3 requests/second limit)

---

## 🔧 TESTING CHECKLIST

When testing new Notion features:
1. Test on a **new dummy page first** (never modify production data)
2. Document the **exact API call** used (include parameters)
3. Record **response structure** for future reference
4. Note any **error messages** and what caused them
5. Update this file with results
6. Commit changes to track history

---

## 📚 REFERENCE LINKS

- [Notion API Documentation](https://developers.notion.com/reference/intro)
- [Database Property Types](https://developers.notion.com/reference/property-object)
- [Block Types Reference](https://developers.notion.com/reference/block)
- [Rate Limits & Best Practices](https://developers.notion.com/reference/request-limits)

---

## 📝 CHANGELOG

### 2025-10-04
- Initial documentation created
- Added confirmed working features (database CRUD, relations, formatting)
- Added confirmed limitations (views, hierarchies, property changes)
- Established testing protocol
