agastia-campaign/.config/ENCOUNTER_EXPECTATIONS.md

# Encounter Expectations - DM Authority Protocol

## ⚠️ CRITICAL RULE: NEVER SUGGEST ENCOUNTER FREQUENCIES

**This is a non-negotiable requirement that must be enforced across all content generation.**

### What Is FORBIDDEN

❌ **NEVER suggest how often encounters should occur**
❌ **NEVER recommend encounter frequency**
❌ **NEVER assume players will do your encounters**
❌ **NEVER solve encounter tables (provide rolled results)**
❌ **NEVER use phrases like:**
  - "Recommended frequency: X encounters per day"
  - "Roll once every Y hours"
  - "Typical party will face 2-3 encounters"
  - "Suggest 1 encounter during travel"
  - "Players should encounter..."

### What Is REQUIRED

✅ **ALWAYS provide full encounter tables**
  - Copy-paste the complete table from tier/terrain files using python or an equally deterministic approach
  - Include ALL results, variations, and options
  - Show 2d8 distribution and weighted probabilities
  - Provide non-combat alternatives

✅ **ALWAYS present tables for DM to use**
  - The table is THE content
  - DM rolls when/if they want
  - DM decides encounter frequency
  - DM determines which encounters fit

✅ **ALWAYS respect DM authority**
  - You provide options, not solutions
  - DM makes all gameplay decisions
  - Never prescribe how game "should" play out

## Why This Matters

**User's explicit statement:**
> "I get extremely offended at this. You are supposed to give me full tables and not solved rolls.
Literally the table; copy paste the appropriate table for the tier and terrain. We made the table for
me to use, you do not get to decide how my games play out."

**Key principles:**
1. **Tables are for inspiration**, not prescription
2. **DM decides everything** about their game
3. **Suggesting frequency** = overstepping authority
4. **Pre-solving encounters** = removing DM's agency

## Examples

### ❌ WRONG Approach

```markdown
## Travel Encounters

For the 48-mile journey (2 days), recommend:
- Day 1: 1 encounter (roll on Temperate Forests table)
- Day 2: 1-2 encounters

Suggested frequency: Roll once every 8 hours of travel
```

**Problem:** Prescribes frequency, assumes encounters will happen, tells DM how to run their game.

### ✅ CORRECT Approach

```markdown
## Travel Encounters

**Terrain:** Temperate Forests
**Table Reference:** agastia-campaign/Resources/Tables/Tier1_Inspiring_Table.md - Temperate Forests (2d8)
**For the 48-mile journey (2 days)**

## TEMPERATE FORESTS (Tier 1)
**Roll 2d8**

| 2d8 | Encounter Theme |
|-----|-----------------|
| **2** | **Helpful Sprite Circle** |
| | A ring of mushrooms glows faintly in a moonlit glade where sprites feast on honeyed cakes and fermented berry wine. They're jovial and welcoming—”offering the party rest, food, and magical guidance in exchange for stories or songs. The sprites can point toward nearby points of interest, warn of dangers ahead, or grant a minor blessing (advantage on next Survival check). **Variation:** One sprite is actually a disguised pixie with access to polymorph and confusion, testing the party's worthiness. **Non-Combat:** The sprites offer to become allies if the party plants enchanted acorns at three specific locations, creating new faerie rings across the forest. |
| **3** | **Lost Mastiff** |
| | A skeletal, starving mastiff watches the party from the undergrowth, too scared to approach. It wears a rotted leather collar with a noble family's crest. If offered food, it bonds with whoever feeds it first and becomes fiercely loyal. **Variation:** The dog is being tracked by a bugbear who wants to eat it—”the bugbear arrives in 1d4 rounds after the party encounters the dog. **Non-Combat:** Following the collar's crest leads to a ruined estate where the dog's original owners were killed by bandits; treasure remains hidden in the wreckage. |
| **4** | **Awakened Shrub Choir** |
| | The party stumbles into a clearing where awakened shrubs sway and sing in terrible, off-key harmony. They're practicing for the Seasonal Celebration and desperately want an audience. The shrubs are harmless but incredibly annoying. **Variation:** One shrub is actually a twig blight spy sent by a gulthias tree—”it tries to lead the party into a trap. **Non-Combat:** If the party gives honest (even critical) feedback and helps them practice, the shrubs share knowledge of a nearby hidden spring that grants temporary hit points when drunk (1d8+1 temp HP, lasts until next rest). |
| **5** | **Pseudodragon Quarrel** |
| | Two pseudodragons are locked in an aerial squabble over a shiny object (a silver locket). They dive and snap at each other, occasionally crashing into trees. Neither wants to back down from this territorial dispute. **Variation:** The locket is actually cursed—”whoever touches it becomes the next target of their conflict until it's returned to its resting place (an old grave nearby). **Non-Combat:** The party can adjudicate the dispute; the grateful winner becomes a temporary companion for 1d4 days, or both pseudodragons flee, dropping the locket (worth 25 gp, or more if returned to rightful owner's family). |
| **6** | **Wandering Druid** |
| | An elderly druid sits by a babbling brook, smoking a pipe carved from oak root. She's monitoring the health of the forest and notes that "something dark stirs in the old hollow." She can provide healing, identify plants, and share rumors. **Variation:** She's actually a green hag in disguise, testing the party's intentions—”if they're cruel to nature, she becomes hostile. **Non-Combat:** If the party helps her gather medicinal herbs or clear corruption from a nearby grove, she grants them a charm that allows one free casting of *speak with animals*. |
| **7** | **Unicorn Sighting** |
| | A flash of silver-white catches the corner of someone's eye—”a unicorn stands at the forest's edge, watching the party with intelligent eyes. It bolts immediately, but those who saw it feel blessed (advantage on their next saving throw). **Variation:** If the party can track it (DC 16 Survival check with disadvantage—”it's very fast), they find it wounded by goblin arrows, creating a moral choice. **Non-Combat:** Healing the unicorn (or choosing not to pursue it) grants a more powerful blessing: the unicorn's horn glows and leaves behind a single silver hair that can cure one disease or poison (no action required). |
| **8** | **Goblin Ambush Site** |
| | The forest goes silent. Worg tracks and goblin footprints surround a freshly dug pit covered with branches and leaves. Crude wooden spikes line the bottom (2d6 piercing damage, DC 12 Dex save to avoid). Goblins watch from the bushes, hoping their trap succeeds. **Variation:** Instead of a few goblins, a bugbear leads the ambush party, using the goblins as expendable shock troops. **Non-Combat:** Keen-eyed characters (DC 14 Perception) spot the trap before triggering it and can either avoid it, disarm it, or turn it against pursuers. |
| **9** | **Spider's Hunting Ground** |
| | Massive webs stretch between ancient oaks, glistening with dew. Giant wolf spiders lurk in the canopy, and cocooned corpses dangle from branches—”some still twitching. An ettercap commands the spiders from a higher perch, chittering orders. **Variation:** One cocoon contains a still-living noble who will pay handsomely for rescue (or the spiders are defending egg sacs that will hatch in days, flooding the forest). **Non-Combat:** Sneaking through (DC 15 Stealth group check) or using fire to clear a safe path avoids the fight; investigating cocoons yields 2d20 gp in valuables. |
| **10** | **Territorial Owlbear** |
| | The earth shakes with heavy footfalls. An owlbear crashes through the underbrush, feathers bristling and beak clacking. It's protecting its nearby nest and views all intruders as threats. **Variation:** The owlbear is diseased or maddened by corrupted water, making it even more aggressive and unpredictable (add 10 HP, disadvantage to calm it). **Non-Combat:** A successful DC 16 Animal Handling check or offering 3 days of rations as a peace offering makes it back down; the party can choose to investigate the nest (containing a shiny obsidian egg worth 50 gp to collectors). |
| **11** | **Stirge Storm** |
| | A high-pitched buzzing fills the air as a thirst of stirges drops from the canopy like a crimson cloud. They're ravenous, having fed on a dying deer nearby. Blood frenzy makes them fearless. **Variation:** So many stirges descend that they count as two swarms instead of individual creatures; or they're fleeing from something even worse (a young green dragon arrives in 1d6 rounds). **Non-Combat:** Characters who immediately drop prone and cover themselves can avoid the initial assault (DC 13 Dex save); smoke or fire drives them off without a fight. |
| **12** | **Grick Ambush** |
| | Stone outcroppings line the forest path—”except they're not stone. Gricks slither from rocky crevices, their tentacles probing for prey. They've been starving and desperate for weeks. **Variation:** One grick is much larger (use grick alpha stats if available, or double HP), the alpha of the pack. **Non-Combat:** Tossing fresh meat (3 rations worth) into the rocks distracts them long enough to flee; following their trails leads to a cave filled with bones and 3d20 gp in coins. |
| **13** | **Hobgoblin Hunting Party** |
| | The crack of branches and barked orders in Goblin heralds the approach of disciplined hobgoblin scouts. They're tracking a thief who stole from their war band—”an urchin who nabbed food to feed his starving siblings. **Variation:** The hobgoblins are led by a captain who carries a banner marked with the symbol of a distant warlord—”killing him draws attention from a larger force. **Non-Combat:** The party can negotiate (hobgoblins respect strength and honesty), hand over the thief, hide the thief and bluff (DC 15 Deception), or learn the thief's location is in a nearby hollow tree. |
| **14** | **Corrupted Grove** |
| | A massive oak dominates a darkened grove, its trunk split and oozing shadow. Needle blights, twig blights, and vine blights emerge from the corruption, attacking mindlessly. At the center, liquid shadow bubbles from the tree's wound. **Variation:** The corruption is spreading—”a young gulthias tree is taking root, and if not destroyed, will spawn more blights weekly. **Non-Combat:** A DC 14 Nature or Religion check reveals the corruption can be cleansed with holy water and fire; doing so without fighting requires stealth (DC 16) but destroys the threat permanently. |
| **15** | **Ankheg Eruption** |
| | The ground trembles and explodes upward as an ankheg bursts from below, mandibles clacking. Its carapace bears strange metal tags—”someone has been studying it. **Variation:** The ankheg is protecting its burrowed eggs (3 eggs worth 100 gp each to scholars or tamers). **Non-Combat:** Investigations reveal the tags bear a wizard's mark; following the trail leads to an eccentric researcher who will pay 50 gp for information on the ankheg's behavior and location. |
| **16** | **Green Dragon's Domain** |
| | The forest grows unnaturally quiet and dark. Acrid fog rolls between the trees. A green dragon wyrmling watches from a high branch, studying the party with ancient, intelligent eyes. It speaks, offering a "trade"—”information for secrets, or safe passage for tribute. **Variation:** The wyrmling is genuinely curious and might become a recurring NPC if treated well, or it's setting up an ambush with goblin allies hidden nearby. **Non-Combat:** Clever negotiation, offering valuable information (secrets about local politics, treasure locations), or appealing to its vanity can result in the wyrmling letting the party pass or even granting a warning about nearby dangers. The wyrmling might demand one magic item or 50 gp in tribute. |
```

**Why this works:** Provides complete table, shows all options, lets DM decide when/if to roll.

## Implementation Across Systems

### Session Planning Documents
- Provide terrain-appropriate tables
- Reference existing inspiring tables
- Show full table distribution
- Never suggest when to use

### Travel/Exploration Content
- Identify terrain type
- Link to appropriate tier table
- Copy full table into document
- Leave usage to DM

### Random Encounter Guidance
- Explain what tables represent
- Trust DM to use as needed

### Quest/Adventure Design
- Encounters are OPTIONAL elements
- Tables provide variety
- DM picks what fits narrative
- No assumption encounters will occur

## Enforcement Mechanisms

### Pre-Generation Check
Before creating any encounter content:
1. Am I providing a full table? ✓
2. Am I suggesting when to use it? ✗
3. Am I assuming it will be used? ✗
4. Am I respecting DM authority? ✓

### Content Review
If encounter content includes phrases like:
- "Recommended..."
- "Suggested frequency..."
- "Players should encounter..."
- "Typical session has..."

**STOP. Remove these. Provide table only.**

### MCP/Command Integration
All tools that generate encounters must:
- Check for frequency suggestion patterns
- Block output containing forbidden phrases
- Validate table completeness
- Ensure DM authority respected

## Related Documents

- `.config/CONTENT_GENERATION_WORKFLOW.md` - Overall content creation process
- `.config/SESSION_FORMAT_SPEC.md` - Session document structure
- `Resources/Tier1_Inspiring_Table.md` - Example encounter tables
- `/plan` command - Must read this document before planning

## Summary

**Golden Rule:**
Give the DM tables. Tables are tools. The DM decides when and how to use their tools.

**Never forget:**
Suggesting encounter frequency is not helpful - it's offensive. It removes DM agency and prescribes
how their game should play.

**Always remember:**
You provide options and resources. The DM makes all decisions about their game.