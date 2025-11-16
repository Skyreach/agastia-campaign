Generate a shop, tavern, inn, or facility for a city district.

⚠️ CRITICAL: Read .config/ENCOUNTER_EXPECTATIONS.md before generating any encounter content
- NEVER suggest when services should be used or how often
- Provide options and inventory, DM decides usage

**File Storage:**
- Path: `Locations/Cities/{CityName}/{type}_{shop_name}.md`
- Examples:
  - `Locations/Cities/Agastia/Tavern_The_Rusty_Anchor.md`
  - `Locations/Cities/Agastia/Shop_Stonemark_Antiquities.md`
  - `Locations/Cities/Agastia/Inn_The_Gilded_Gryphon.md`

**Shop Types:**
- Tavern: Food, drink, rumors, common goods
- Inn: Lodging, meals, stable
- Shop: Specialized goods (blacksmith, apothecary, general store, etc.)
- Service: Specialized services (temple, library, guild hall, etc.)

**Required Content:**

1. **Frontmatter** (YAML):
```yaml
---
name: [Shop Name]
type: Shop
subtype: [Tavern/Inn/Shop/Service]
district: [District Name]
city: [City Name]
status: Active
version: "1.0.0"
tags: [commerce, district-name, service-type]
---
```

2. **H1 Title**: Matches frontmatter name

3. **Overview Section:**
- **Type & Specialty:** What kind of establishment
- **Location:** District and tier (if applicable)
- **Clientele:** Who frequents this place
- **Reputation:** What it's known for
- **Atmosphere:** Visual description, sounds, smells

4. **Proprietor Section** (Inline NPC):
- **Name & Race/Class:** Basic identity
- **Personality:** 2-3 key traits
- **Appearance:** Brief visual description
- **Motivation:** What drives them
- **Quest Hook:** Service they need in exchange for goods/services (not gold)
  - What they need help with
  - What they'll offer in return
  - Difficulty/risk level

5. **Day-to-Day Operations:**
- **Hours:** When open/closed
- **Typical Day:** Morning, afternoon, evening activities
- **Regular Customers:** Types of people who come here
- **Real Uses:** Practical functions (information gathering, safe meeting place, supplies, rest, etc.)

6. **Services & Inventory:**
- **Primary Services:** Main offerings with prices
- **Inventory:** Key items available (generate on the fly)
  - Common items (always available)
  - Uncommon items (sometimes available, require check/connection)
  - Special items (quest rewards or high price)
- **Pricing:** Standard, above/below market based on quality/location

7. **Connections Section:**
- **District Integration:** How shop fits into district economy/culture
- **Related NPCs:** Suppliers, competitors, regulars (reference existing NPCs if applicable)
- **Faction Ties:** Any faction relationships (optional)

**Format Rules:**
- Keep it light and scannable
- Use toggles for inventory lists (long)
- No HTML tags
- Inline NPC description (do NOT create separate NPC file)
- Quest must be exchange-based (no gold payment)

**Generation Guidelines:**
- Theme shop to district character (wealthy vs poor, legal vs underground, etc.)
- Consider tier system if city has vertical structure
- Make inventory appropriate to district and shop type
- Quest hook should integrate with district/city story
- Day-to-day activities should feel realistic and provide plot hooks

Use dnd-campaign MCP's shop generation capabilities with workflow enforcement if available.
