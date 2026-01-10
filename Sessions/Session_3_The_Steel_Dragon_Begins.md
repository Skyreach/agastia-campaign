---
date: TBD
name: Session 3 - The Steel Dragon Begins
session_number: 3
status: Planning
version: "1.0.0"
tags: [session3, travel, agastia, steel-dragon, player-hooks]
---

# Session 3: The [[Steel Dragon]] Begins - DM Guide

**Party:** Level 2 (5 PCs) | **Duration:** 3-4 hours | **Type:** Travel & City Introduction
## Session Flowchart

```mermaid
graph TD
    Start([Leave [[Meridian's Rest]]]) --> Travel1[Travel Day 1]
    Travel1 --> Encounter1[[[Geist (Bandit Lieutenant)]] Crate Discovery]
    Encounter1 --> Travel2[Travel Day 2]
    Travel2 --> Encounter2{Player Choice Encounter}
    Encounter2 --> SpiderCheck{Cleared Spider<br/>Encounter?}
    SpiderCheck -->|Yes| GhostRest[Ghost of Elaris<br/>Long Rest]
    SpiderCheck -->|No| Travel3[Travel Day 3]
    GhostRest --> Travel3
    Travel3 --> [[Agastia]][Arrive in [[Agastia]]]
    [[Agastia]] --> JobBoard[Job Board & Notoriety]
    JobBoard --> MurderScene{[[Steel Dragon]] Murder Scene}
    MurderScene --> PlayerQuests[Pursue Individual Quests]
    PlayerQuests --> End([Session 3 End])

    style SpiderCheck fill:#ffd43b,stroke:#fab005
    style GhostRest fill:#9775fa,stroke:#5f3dc4
```


## Quick Reference

**Toggle: Session Flow**
  1.  **Travel to [[Agastia]]:** 2-3 day journey with themed encounters.
  2.  **[[Kyle/Nameless]]'s Hook:** An encounter on the road that points [[Kyle/Nameless]] towards the docks and [[Geist (Bandit Lieutenant)]].
  3.  **Player Choice Encounter:** Choose from [[Lost Mastiff]], [[Wandering Druid]], or [[Goblin Ambush Site]].
  4.  **Arrival in [[Agastia]]:** First impressions of the city.
  5.  **Job Board:** Introduction to the system for gaining money and merit.
  6.  **The [[Steel Dragon]]:** The first murder scene is discovered.
  7.  **Player Quest Hooks:** Opportunities for [[Manny]] and [[Nikki]] to get involved in their quests.
**Toggle: Key NPCs**
  - **[[Corvin Tradewise]]:** [[Merchant Caravan]] leader who can provide information about [[Quest: Geist Investigation]].
  - **Dead Smuggler:** Victim at crate scene, provides hook to [[Quest: Geist Investigation]]'s operation and Starfall Anchors.
  - **[[Mira Saltwind]]:** [[Merchant District]] proprietor, extortion victim with evidence against [[Quest: Geist Investigation]].
  - **Job Board Clerk:** An NPC who explains the job board and merit system.
  - **City Guard Captain:** The NPC who is investigating the first [[Steel Dragon]] murder.
  - **Ghost of Elaris:** (Conditional) Spirit of noble elf's child, appears if spider encounter cleared.
**Toggle: Important Items & Locations**
  - **Starfall Anchor Crate:** Damaged crate containing Feywild packing materials, points to Warehouse 7.
  - **Warehouse 7:** [[Geist Investigation]]'s distribution hub in [[Dock District]].
  - **[[Agastia]] Job Board:** A central location for quests and gaining merit.
  - **The Murder Scene:** An alley in the [[Merchant District]] where the first victim of the [[Steel Dragon]] is found.

## Travel to [[Agastia]] (2-3 Days)

**Route:** [[Meridian's Rest]] → [[Agastia Region]]
**Distance:** ~48 miles (2 hexes at 24mi/hex world scale)
**Travel Time:** 2-3 days at normal pace (24 mi/day)
**Terrain:** Temperate Forests
**Encounter Table:** See [[Inspiring Tables#Temperate Forests (Tier 1)]]
### Day 1: The Starfall Anchor Crate ([[Kyle/Nameless]]'s Hook)

**Encounter:** The party comes across an overturned cart on the roadside. A dead smuggler lies nearby, his body bearing strange shadow burns.
> The road ahead is partially blocked by an overturned cart, its contents spilled across the dirt. A damaged wooden crate lies a short distance away, shimmering faintly with residual magic. Scattered around it are torn silks and strange moss that seems to glow in the shadows. A body lies face-down near the tree line, unmoving.
**Read-aloud (Upon Investigation):**
> The man is dead, his skin marked with dark, writhing burns that seem to move when you're not looking directly at them. His valuables are untouched—this wasn't a robbery. Near his outstretched hand, a crumpled note peeks from his coat pocket.
**The Scene:**
**The Dead Smuggler:**
- Shadow burns across body (Feywild magic? [[Chaos Cult]] retaliation? Artifact accident?)
- Valuables untouched (coin purse, decent boots, silver ring)
- Not a robbery—something else killed him
- **Investigation DC 12:** Death occurred within last 6 hours, burns are magical in nature
- **Arcana DC 15:** Burns consistent with planar/dimensional magic, not standard evocation
**The Damaged Crate:**
- **Stenciled label:** "W7-DD-B3" (Warehouse 7, [[Dock District]], Bay 3)
- **Contents:** Empty anchor-shaped indentations in packing material (two items removed)
- **Packing materials scattered:**
  - Moonpetal Moss (shimmers faintly, smells of ozone and wildflowers - Feywild preservative)
  - Torn silk wrapping (still glowing with faint magic)
  - Professional packing job (not criminal, looks official)
- **Nature/Survival DC 13:** Moss is Feywild in origin, used to preserve delicate magical items
- **Investigation DC 14:** Two identical indentations, approximately 18 inches long, tapered cylinder shape
**The Smuggler's Note:**
- Crumpled paper in coat pocket
- Reads: *"Final delivery - 2 anchors to Saltwind Imports by midnight. The Architect wants all six. -H"*
- Reveals: Partial shipment (2 items), buyer name ("The Architect"), urgency, someone named "H"
**The Business Card:**
- Found near body (dropped? Or clue for investigators?)
- Reads: *"Saltwind Imports - [[Mira Saltwind]], Proprietor - [[Merchant District]], [[Agastia]]"*
- High-quality cardstock, professional
**Clue Summary (3-Clue Rule):**
1. **Warehouse 7 label** (LEAD) → Points to Warehouse 7 as origin/hub
2. **Feywild packing materials** (REVELATION) → Expensive Feywild artifacts being smuggled
3. **Smuggler's note** (LEAD + REVELATION) → Buyer "The Architect" wants 6 total, Saltwind Imports connection
4. **Business card** (LEAD) → [[Mira Saltwind]] in [[Merchant District]]
5. **Shadow burns** (REVELATION) → Dangerous magical cargo OR targeted killing
**DM Notes:**
- This is Entry Point 1 for [[Quest: Geist Investigation]]
- Dead smuggler was transporting final 2 Starfall Anchors (4 already sold to [[Chaos Cult]])
- Cause of death intentionally ambiguous (Cult silencing? Artifact backfire? Monster?)
- Multiple leads prevent single-path railroading
- [[Kyle]]/Lord Zaos connection: Anchors stolen from Zaos's vault ([[Kyle]] will learn this later)
- Full investigation details in Quest_Geist_Investigation.md
**If players ask NPCs in [[Agastia]] about the moss/materials:**
- Augury researchers will recognize Feywild preservation techniques (if shown)
- [[Merchant District]] traders: "That's expensive Feywild packing. Whatever was in there cost a fortune."
- Dock workers: "Warehouse 7? That's [[Merit Council]] property. Inspection storage."

### Day 2: Player's Choice (Point Crawl Encounters)

**Road Navigation:** The party travels along the main road toward [[Agastia Region]]. Present the following encounter nodes as points of interest along the way. Players can choose which to investigate or bypass.
**Encounter Nodes:**
**Forest Clearing - [[Lost Mastiff]]**
- **What:** A well-bred mastiff with a noble family crest collar, separated from its owner
- **Choice:** Investigate the clearing, track the dog's trail, or continue on
- **Reward:** Non-combat encounter, potential loyal animal companion
**Druid's Grove - [[Wandering Druid]]**
- **What:** Ancient oak grove with signs of druidic presence
- **Choice:** Approach the grove, observe from distance, or bypass
- **Reward:** Healing, forest information, potential side quest
**Abandoned Cart - [[Goblin Ambush Site]]**
- **What:** Overturned cart with goblin tracks nearby
- **Choice:** Investigate the ambush site, set counter-ambush, or avoid
- **Reward:** Classic combat encounter with loot
**Shortcut Through the Woods** (Optional fast travel)
- **What:** Game trail cutting through dense forest
- **Choice:** Take the shortcut (saves 2 hours, DC 13 Survival to navigate) or stay on road
- **Risk:** May miss encounters, risk getting lost
**DM Notes:**
- Players choose which nodes to engage with
- Can investigate all, some, or none
- Bypassing encounters doesn't prevent arrival at [[Agastia Region]]
- Time of day matters (arrive late = miss job board hours)

### Day 3: Arrival in [[Agastia]]

> The road crests a hill, and the city of [[Agastia Region]] unfolds before you. A tiered metropolis of stone and ambition, with the towering Northern Wall and the sky-piercing Inverse Tower. Airships drift lazily from the upper docks, their magical sails aglow.


## Welcome to [[Agastia]]

**The party arrives at [[Agastia]]**, the campaign's central city and seat of power in the region.
**City Overview:** See [[Agastia Region]] for complete city details, tier structure, all nine districts, key locations, and navigation.
### Locations Visited This Session

The party will visit or hear about these locations during Session 3, organized by [[Agastia]]'s tier system:
**Toggle: **Tier 2 - **[[Noble Quarter]]**
  **Overview:** Upper-tier district housing wealthy families and estates.
  **House Moonwhisper**
  - **What:** Lord Thalorien Moonwhisper's residence
  - **Connection:** Reward location for completing Ghost of Elaris quest
  - **Reward:** 150 gp + invitation to noble house (opens Tier 2 access)
**Toggle: **Tier 3 - **[[Scholar Quarter]]**
  **Overview:** Academic district with libraries, archives, and research institutions.
  [[Archive of Lost Histories]]
  - **What:** Repository of ancient texts and forgotten lore
  - **Hook:** Job board request from scholar to retrieve rare book from dangerous ruin
  - **Connection:** [[Manny]]'s [[The Codex Search]] quest lead
  **[[Veridian Scrollkeeper]]'s Location**
  - **What:** Rumored expert on [[Agastia Region]]'s history
  - **Hook:** Tavern rumor about ancient elf who "knows everything"
  - **Connection:** Another potential [[Codex of Peace]] lead for [[Manny]]
**Toggle: **Tier 4 - **[[Merchant District]]**
  **Overview:** Mid-tier commercial hub, accessible to most citizens and visitors. Where the session's main activities occur.
  **Central Plaza - Job Board**
  - **What:** Large, well-maintained board displaying available jobs and rewards
  - **Who:** [[Merit Council]] clerk manages postings (bored but efficient)
  - **System:** Complete jobs → earn gold + merit → unlock higher tier access
  - **Clerk's Pitch:** *"Welcome to [[Agastia]]. If you're looking for work, you've come to the right place. Complete a job, get paid, and earn merit. The more merit you have, the higher you climb. Simple as that."*
  **Sample Jobs:**
  **Rat Extermination (Tier 5)** - 10gp, 1 Merit
  - **What:** Baker reports aggressive rats in cellar (Goldwheat Bakery, 2 blocks south)
  - **Creatures:** 6 Giant Rats (AC 12, HP 7) + 1 Wererat Spy (AC 12, HP 33, shapechanger)
  - **Hook ([[Manny]]):** Baker introduces party to a regular customer - an ancient elf scholar (rumored to know everything about [[Agastia]]'s history)
  - **Clock:** [[Chaos Cult]] corruption spreading from [[The Depths]] (Tier 7 → Tier 5). Wererat is cult infiltrator establishing foothold. If ignored, infestation spreads (+1 tick every 3 days → disease outbreak → cult ritual site → mass transformation crisis)
  - **Escalation:** Missing wererat ticks clock +2. Captured wererat reveals cult tunnel map + connection to [[Steel Dragon]] murders
  **Guard a Caravan (Tier 4)** - 50gp, 5 Merit
  - **What:** Protect book merchant Aldric Scrollwise on 3-day trip to [[Meridian's Rest]]
  - **Creatures:** 1 Bandit Captain (AC 15, HP 65) + 4 Bandits + 2 Thugs (hit-and-run tactics)
  - **Hook ([[Manny]]):** Aldric carries journal mentioning [[The Codex Search]]'s last known location (offers to sell for 100gp after trip)
  - **Hook ([[Kyle]]):** Bandits mention "someone at the docks" protecting their operation (oblique [[Geist Investigation]] reference)
  - **Clock:** [[Bandit Network ([[Geist (Bandit Lieutenant)]] & [[Kaelborn (Bandit Boss)]])]] [2/8 ticks]. Success weakens bandits. Failure → bandits control western trade routes
  - **Escalation:** Captured bandit knows about "corrupt inspector at docks who looks the other way"
  **Investigate Missing Person (Tier 3)** - 100gp, 10 Merit
  - **What:** Scholar Elorith Silvervein missing 3 days, last seen near [[Archive of Lost Histories]]
  - **Full Quest Details:** See [[Quest: Missing Person Investigation]] for complete investigation point crawl with map, clues, and timing-based encounters
  - **Quick Summary:**
    - **Creatures:** 3 Shadows + 1 [[Chaos Cult]] Initiate (Day 1-2) OR Shadow Demon CR 4 (Day 5+)
    - **Hook ([[Manny]]):** Elorith knows about [[The Codex Search]] and [[Professor Zero]]'s Archive visit
    - **Hook (All):** [[Steel Dragon]] vs [[Chaos Cult]] faction conflict over same victim
    - **Clock:** Time-sensitive rescue (Day 1-2 = save, Day 5+ = tragedy + dragon confrontation)
    - **Reward:** Base 100gp + 10 Merit. Bonus: Restricted Archive access if rescued
  **Murder Scene Alleyway - [[Steel Dragon]] Investigation**
  - **What:** Quiet alleyway near Job Board, crime scene of latest [[Steel Dragon]] murder
  - **Victim:** Wealthy merchant in fine silks, single clean throat cut, blood used to paint draconic symbol
  - **Investigator:** Captain Valerius (grizzled city guard veteran)
  - **Captain's Notes:** *"Another one. Third this month. Same symbol, same clean cut. This one is different though... more... artistic."*
  - **Opportunity:** Captain will deputize competent party members (can be job board quest)
  **[[Il Drago Rosso]] - [[Nikki]]'s Family Restaurant**
  - **What:** [[Nikki]]'s family establishment, information hub and safe haven
  - **Hook:** Job board posting about aggressive faction threatening businesses in district (see [[Quest: Nikki Family Protection]])
  - **Connection:** Potential threat to [[Nikki]]'s family restaurant
  **DM Notes:**
  - First "artistic" [[Steel Dragon]] murder (step up from previous work)
  - Motive clearly not robbery (coin purse untouched)
  - Symbol is killer's signature
**Toggle: **Tier 6 - **[[Dock District]]**
  **Overview:** Lowest tier, waterfront district with smuggling and criminal activity.
  **Smuggling Operations**
  - **What:** [[Geist Investigation]]'s criminal network operating under guise of [[Merit Council]] authority
  - **Hook:** Starfall Anchor crate from Day 1 points to Warehouse 7 in [[Dock District]]
  - **Connection:** [[Kyle/Nameless]]'s personal quest to track down [[Geist Investigation]] (and [[Kaelborn]])
  - **Investigation:** See [[Quest: Geist Investigation]] for full 3-3-3-1 mystery structure
  - **Key locations:** Warehouse 7 (distribution hub), Mira Saltwind's shop (evidence), Underground Market ([[Kex the Fence]])

### Navigation & Connections

**Point Crawl System:** See `Resources/Point_Crawl_Network.md` for complete network with all connections and path descriptions.
**[[Merchant District]] Map:**
```mermaid
graph TD
    JobBoard[Central Plaza<br/>Job Board]

    JobBoard -->|2 blocks south<br/>Past silk merchant & bakery| MurderAlley[Murder Scene Alley]
    JobBoard -->|3 blocks west<br/>Market Street| IlDrago[[[Il Drago Rosso]]]
    JobBoard -->|4 blocks east<br/>Descending| Warehouse[Warehouse 7<br/>[[Dock District]]]
    JobBoard -->|5 blocks north<br/>Academy Avenue| Archive[[[Archive of Lost Histories]]<br/>[[Scholar Quarter]]]

    style JobBoard fill:#ffeb3b,stroke:#f57c00,stroke-width:4px
    style MurderAlley fill:#f44336,stroke:#b71c1c,stroke-width:3px
    style IlDrago fill:#4caf50,stroke:#2e7d32,stroke-width:3px
    style Archive fill:#2196f3,stroke:#1565c0,stroke-width:3px
    style Warehouse fill:#9c27b0,stroke:#6a1b9a,stroke-width:3px
```

**Key Navigation Nodes:**
**At Central Plaza (Job Board):**
> "Standing in Central Plaza where the Job Board is posted, you look around at the bustling [[Merchant District]]. Do you: - Walk south past the silk merchant and bakery (2 blocks)? - Go west on Market Street toward the restaurant district (3 blocks, past armory and tavern)? - Head east toward the docks (4 blocks, descending on Merchant's Way)? - Travel north toward Scholar's Gate (5 blocks on Academy Avenue)?"
**Moving from Job Board to [[Il Drago Rosso]]:**
> "You walk west on Market Street. You pass [[Shadow's Edge Armory]] where a blacksmith hammers at an anvil, then a curiosity dealer's window full of strange trinkets, and finally a crowded tavern where laughter spills into the street. Three blocks from the plaza, you spot the red dragon banner hanging above a warm, inviting doorway."
**Moving from Job Board to South (Discovery Path):**
> "You walk south past the silk merchant's colorful awnings and the warm smell of fresh bread from Goldwheat Bakery. Between them, a narrow alley opens to your right - dark and quiet compared to the busy street."
**After Discovering the Murder Scene:**
Once players have discovered the crime scene (either by exploring the alley or hearing about it from guards/NPCs), use these navigation prompts:
**At Central Plaza (Job Board) - Post-Discovery:**
> "Standing in Central Plaza, do you: - Return to the murder scene investigation (2 blocks south, alley between silk merchant and bakery)? - Go west on Market Street to [[Il Drago Rosso]] (3 blocks)? - Head east toward the docks (4 blocks)? - Travel north toward Scholar's Gate (5 blocks)?"
**Moving to Active Murder Scene:**
> "You walk south past the silk merchant's awnings and Goldwheat Bakery. Yellow guard tape marks the alley entrance where Captain Valerius and his investigators work the scene."
**Between Districts (City Scale):**
**From [[Merchant District]] to [[Scholar Quarter]]:**
> "You walk north on Academy Avenue, passing bookbinders and cartographers as the shops shift toward academic trades. The street narrows and quietens. Ahead, worn stone steps rise through Scholar's Gate, an archway adorned with carved books. You climb into the academic district, where the air smells of parchment and ink."
**From [[Merchant District]] to [[Dock District]]:**
> "Harbor Road slopes downward toward the waterfront. The smell of salt and fish grows stronger as merchant stalls give way to warehouses and chandleries. You descend three tiers of switchback streets, each level rougher than the last."
**From [[Merchant District]] to [[Noble Quarter]]:**
> "You cross the Gold Bridge, an elegant stone span over the Inner Canal. Guards in ceremonial armor watch from both ends, noting your presence. The architecture becomes more ornate as you enter the estates district."
**DM Note:** Use these descriptions when players move between locations. Full point crawl network in `Resources/Point_Crawl_Network.md` includes all connections, distances, landmarks, and path descriptions for improvisation.


## Player Quest Hooks

### The Ghost of Elaris (Conditional - Requires Spider Encounter)

**Trigger:** IF the party encountered and cleared the [[Spider's Hunting Ground]] during Day 2 travel, this quest activates during their next long rest.
**Setup:** During the long rest after saving the noble elf from the [[Spider's Hunting Ground]], the party is visited by the ghost of the young elf found dead in the cocoons.
> As you settle into your rest, the temperature drops sharply. A translucent figure materializes near the fire—a young elf, their form flickering like candlelight. They look at you with desperate, hollow eyes.
**The Ghost's Plea:**
- Name: **Elaris Moonwhisper**, child of the noble elf **Lord Thalorien Moonwhisper** (whom the party rescued)
- Elaris was traveling with their father when the spiders attacked
- Before dying, Elaris saw something disturbing: "The spiders... they weren't hunting. They were herding us. Driving us toward the old hollow."
- **Quest Goal:** Investigate the "old hollow" and discover what was controlling the spiders
**Investigation Path:**
1. **Track the Pattern:** DC 14 Survival check reveals the spider webs formed a deliberate funnel, driving travelers west
2. **The Old Hollow:** A [[Corrupted Grove]] 1 hour west of the road
   - Ancient oak split and oozing shadow (similar to encounter #14 but more advanced)
   - A **Wood Woad** corrupted by shadow magic guards the tree
   - At the tree's base: A ritual circle and evidence someone has been feeding the tree victims
1. **The Culprit:** Investigation reveals signs of a robed figure visiting regularly ([[Chaos Cult]] member experimenting with corruption magic)
**Rewards:**
- **Elaris's Blessing:** Once per long rest, a character can call upon Elaris for advantage on a death saving throw
- **Lord Thalorien's Gratitude:** 150 gp reward and an invitation to House Moonwhisper in [[Agastia]] (Tier 2 [[Noble Quarter]])
- **Information:** Evidence of [[Chaos Cult]] activity in the forest (connects to larger campaign)
**DM Notes:**
- This quest can be completed before or after arriving in [[Agastia]]
- Lord Thalorien will not know his child is dead until the party tells him (emotional scene)
- The [[Chaos Cult]] connection can be discovered via Religion/Arcana DC 15 on the ritual circle
- Wood Woad stats: AC 18, HP 75, resistant to bludgeoning/piercing

### [[Manny]] ([[Monomi]]) - [[The Codex Search]] Quest

- The Job Board has a request from a scholar in the [[Scholar Quarter]] (Tier 3) to retrieve a rare book from a dangerous ruin. This could be a lead to the [[Archive of Lost Histories]].
- A rumor overheard in a tavern mentions a strange, ancient elf named [[Veridian Scrollkeeper]] who knows everything about [[Agastia Region]]'s history.

### [[Nikki]] ([[Biago]]) - Family and Friends

- [[Nikki]]'s family restaurant, [[Il Drago Rosso]], is a source of information and a safe haven.
- A job on the board asks for someone to discreetly investigate a new, aggressive faction trying to strong-arm businesses in the [[Merchant District]], potentially threatening her family's restaurant. See [[Quest: Nikki Family Protection]].


## Session End

The session ends with the party in [[Agastia Region]], with several open threads:
- Investigating the [[Steel Dragon]]'s murder.
- Following the lead to [[Geist Investigation]] and the [[Dock District]].
- Taking a job from the job board.
- Pursuing their personal quests.


**Toggle: Gameplay notes**
  Okay! The group was awoken by the ghost of Elaris. She provided them with a magical Electrum piece that while in moonlight would show the footprints of ghosts. Nothing else happened that night. I'm the morning, they were awoken by two people on horseback rushing to the site of the destroyed caravan wagon.
  They found the chest containing the missing fey artifacts, opened another chest which was containing a crown (that would be appointed to a person who newly became high noble, but not knowing who), and some magic items. They were joined by a guest character, Jhalnir (Jordan), who was pulled from town to try and heal anyone from the site (they all passed sadly) and investigate what happened.
  The group discovered that someone approached on friendly terms, got into a quarrel with the driver, then stole the artifacts and tried to cover their tracks.  Brand investigated the driver and found a parchment containing “W7B3 - Docks”, a business card saying “Saltwind Imports - [[Mira Saltwind]], Proprietor - [[Merchant District]], [[Agastia]]”, but hasn't investigated it further.  Being unable to get an immediate pursuit of this person, the group decided to go to the caves guided by the ghost coin.
  They started in the deep woods at the site of the cocoons, and tracked the ghostly footsteps to the site of a cave, where a draconic text (those who know may enter) allowed them to enter by giving up the ghostly coin.
  They traveled into the caves, finding a crystal that could mind control it's dwellers; frogs to act as scouts, spiders to act as guards. At its end they found a mind controlled green dragon trying to protect the further entrance to the under dark (leading to Barrel's Falls) and the mind control crystal (used by the people to stop unwanted visitors). In smashing the crystal, the dragon drank the nearby water, during which the group learned of its maddening and healing properties.
  On the next session, the group is going to go further into the under dark.
  Action items:
  - Garrek’s Falls
  - Why were mind controlled spiders herding people?
  - Why did they kill Elaris? How did she get a coin?
  - Encounters in the falls