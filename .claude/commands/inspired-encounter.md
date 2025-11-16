Roll on the inspiring encounter tables and present the result, with optional re-theming for current location.

⚠️ CRITICAL: Read .config/ENCOUNTER_EXPECTATIONS.md before using this command
- NEVER suggest when or how often to use this
- Present encounter as option only, DM decides if/when to roll
- Respect DM authority over gameplay decisions

Tables Location:
- Tier 1: Resources/Tables/Tier1_Inspiring_Table.md
- Tier 2: Resources/Tables/Tier2_Inspiring_Table.md

Parameters available (all optional):
- tier: 1 | 2 (defaults to party level from campaign state)
- terrain: temperate_forests | arctic_tundra | mountains | deserts | jungles | swamps | coastal | urban
- roll: Specific roll number (otherwise roll dice)
- current_location: Where the party currently is (for re-theming check)
- auto_accept: true | false (if true, inject as-is; if false, ask for approval)

Process:
1. Determine Tier and Terrain:
   - If tier not specified, use party level (1-4 = Tier 1, 5-10 = Tier 2)
   - If terrain not specified, ask user to select or infer from current location
   - Get current_location from campaign state or user parameter

2. Roll on Table:
   - If roll specified, use that number
   - Otherwise, roll appropriate dice for terrain:
     - Temperate Forests: 2d8
     - Arctic/Tundra: 2d6
     - Mountains: 2d10
     - Deserts: 2d8
     - Jungles: 2d10
     - Swamps: 2d6
     - Coastal: 2d8
     - Urban: 2d10

3. Read and Present Encounter:
   - Read from appropriate table file
   - Find the rolled result
   - Present the full encounter text:
     - **Encounter Name**
     - Core scenario
     - **Variation:** option
     - **Non-Combat:** option

4. Check for Re-theming Need:
   - If current_location terrain matches table terrain: Present as-is
   - If terrain doesn't match:
     - Present original encounter
     - Generate 3-4 re-themed variations for current location
     - Preserve core mechanics, difficulty, and encounter structure
     - Only re-skin the flavor/theme
     - Ask user which version to use

5. Example Re-theming (Temperate Forest → Ratterdan Ruins):
   Original: "Helpful Sprite Circle - A ring of mushrooms glows faintly..."

   Re-themed options:
   a) "Helpful Ghost Circle - A ring of rusted weapons glows faintly in moonlight where spirits of fallen soldiers feast on memories..."
   b) "Helpful Kobold Circle - A ring of crude totems marks where kobolds feast on scavenged food..."
   c) "Helpful Elemental Circle - A ring of crumbling stones pulses with magic where dust mephits celebrate..."

6. Integration:
   - If auto_accept=true: Inject encounter into current session/encounter workflow
   - If auto_accept=false (default): Show encounter and ask for approval
   - If called from /session or /encounter commands: Offer to inject directly
   - Otherwise: Present as standalone inspiration

7. Format Output:
   ```
   🎲 Inspired Encounter Roll
   **Terrain:** [Original terrain]
   **Roll:** [Dice result]
   **Tier:** [1 or 2]

   ## [Encounter Name]

   [Full encounter text from table]

   [If re-themed:]

   ## Re-themed Options for [Current Location]:

   1. [Option 1]
   2. [Option 2]
   3. [Option 3]
   4. Use original as-is

   Which version would you like to use?
   ```

Important Notes:
- **Never solve the encounter** - this is inspiration for DM to handle at table
- Preserve all mechanics (DCs, damage, stats, rewards)
- Only re-skin flavor text when re-theming
- Always show original encounter even when re-theming
- Three-part structure must remain: Core + Variation + Non-Combat
