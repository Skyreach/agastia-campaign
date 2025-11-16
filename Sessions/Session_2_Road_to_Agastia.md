---
date: TBD
name: Session 2 - Road to Agastia
session_number: 2
status: Planning
version: "1.0.0"
tags: [session2, meridians-rest, thorne-kallister, garreks-falls, downtime, crafting]
---

# Session 2: Road to Agastia - DM Guide

**Party:** Level 2 (5 PCs, corruption cleared) | **Duration:** 3-4 hours | **Type:** Quest hub + downtime

## Session Flowchart

```mermaid
graph TD
    Start([Arrive at Meridian's Rest]) --> Payment[Thava Pays 500gp<br/>Mission Complete]

    Payment --> Torvin[Meet Torvin<br/>Letter to Agastia]

    Torvin --> Downtime1[Downtime Period 1<br/>Crafting/Rest]

    Downtime1 --> Quest1{Quest 1: Monster Hunt<br/>50gp Reward}

    Quest1 --> Downtime2[Downtime Period 2<br/>2-3 days]

    Downtime2 --> Quest2[Quest 2: Moon's Assault<br/>Town Defense]

    Quest2 --> ThornesTrust[Earn Thorne's Trust]

    ThornesTrust --> Quest3Unlock[Quest 3 Unlocks<br/>Garrek's Journal]

    Quest3Unlock --> Downtime3[Downtime Period 3<br/>Study Journal]

    Downtime3 --> Quest3[Quest 3: Garrek's Falls<br/>Investigation]

    Quest3 --> Discovery[Discover Codex Location<br/>Temporal Bloodline]

    Discovery --> NextSession{Travel to Agastia?}

    NextSession -->|Yes| Agastia[Journey to Agastia]
    NextSession -->|No| Falls[Explore Garrek's Falls]

    Agastia --> End([Session 2 Complete])
    Falls --> End
```

## Quick Reference

**Toggle: Session Flow**
  1. **Opening:** Thava pays 500gp, party meets Torvin (letter to Agastia)
  2. **Quest 1:** Monster Hunt on trade road (50gp, combat test)
  3. **Quest 2:** Defend town from Moon's Assault (no pay, earn trust)
  4. **Quest 3:** Investigate Garrek's Falls (100gp + artifacts, unlocks Codex quest)
  5. **Downtime:** Crafting, investigation, personal quests between missions

**Toggle: Key NPCs**
  - **Torvin Greycask (they):** Goblin messenger from Agastia with letter for party
  - **Brian Thornscale (Mayor):** Human patron who hired party for corruption quest
  - **Thorne "The Bear" Kallister:** Retired adventurer, quest giver, Garrek's friend
  - **Assistant Bellweather:** Mayor's assistant
  - **Greta Moss:** Apothecary (15-20% discount on materials)
  - **Aldwin Quill:** Scribe (15-20% discount on scrolls)

**Toggle: Quest Rewards**
  - **Opening:** 500gp from Thava for clearing corruption
  - **Quest 1:** 50gp for monster hunt
  - **Quest 2:** Thorne's trust and respect (no gold)
  - **Quest 3:** 100gp + "whatever Garrek left behind" + Garrek's journal
  - **Downtime:** Crafting discounts from grateful townsfolk

**Toggle: Important Items & Locations**
  - **Garrek's Journal:** Map fragment, warnings about addictive water, mentions "book" and "time seems wrong"
  - **Codex of Peace:** 7-page artifact at Garrek's Falls (referenced in journal)
  - **Garrek's Falls:** Hidden Underdark sanctuary with healing waters (HIGHLY addictive)
  - **Temporal Bloodline Tribe:** Guardians of the Falls (potential allies)

**Toggle: Player Hints (Distribute During Downtime)**
  - **Kyle/Nameless:** Rumors about Geist's smuggling operation in Agastia
  - **Manny:** Garrek's journal mentions ancient book at the Falls
  - **Nikki:** Journal notes "time seems wrong" near Falls (temporal magic)
  - **Josh/Brand:** Thorne's war stories may reference elemental ancestors
  - **Ian/Rakash:** Storm Giant information from Thorne's adventuring days

## Nodes

### Opening: Payment & Introductions

**Thava's Payment:**

> The Merit Council representative arrives at Meridian's Rest, accompanied by guards. Thava Thornscale, a dragonborn official, approaches your group with a formal bow.
>
> "The corruption is cleared. The town is safe. The Merit Council honors its contracts."
>
> They produce a heavy coin purse. "500 gold pieces, as agreed."

**Meeting Torvin:**

After payment, a goblin messenger approaches - Torvin Greycask.

**Torvin (they):**
- From Agastia, not wealthy district
- Came from Cantel
- Carries letter for the party: "Heard you might be traveling to Agastia. I have a letter that needs delivering to [patron name]. Pay well if you take it."
- Payment: 5gp for delivering letter + basic intel about Agastia

**DM Notes:**
- Party now has substantial gold (500gp + leftover from Session 1)
- Torvin provides hook for eventual Agastia travel
- Mayor Brian Thornscale and Thorne Kallister are separate NPCs

---

### Quest 1: Monster Hunt

**Quest Giver:** Thorne "The Bear" Kallister

**Hook:**

> Thorne approaches you at the tavern. Broad-shouldered with a thick salt-and-pepper beard, weathered face, and a slight limp from an old injury.
>
> "You handled that corruption well. The town's grateful. But we've got another problem - creature on the trade road. Merchants won't travel until it's gone. 50 gold if you take care of it."

**Objective:** Kill/drive off creature threatening trade road

**Combat Encounter:**

**Toggle: Creature Options (Choose One)**
  - **Displacer Beast:** CR 3 (challenging for level 2)
  - **Owlbear:** CR 3 (classic dangerous beast)
  - **Young Basilisk:** CR 2 (petrification danger)

**DM Notes:**
- Thorne is evaluating party's combat capability
- He watches how they work together, handle tactics
- Success earns his respect (prerequisite for Quest 3)

---

### Quest 2: Defend Against Moon's Assault

**Quest Giver:** Thorne "The Bear" Kallister

**Hook:**

> Thorne finds you after Quest 1. He's more serious this time.
>
> "You fight well. Good. Because in two nights, we'll need every blade. The Moon's Assault - happens every few months. Lycanthropes and berserkers come down from the hills. We defend the walls or people die."
>
> "There's no pay for this. Just survival."

**Objective:** Defend Meridian's Rest from attacking forces

**Combat Encounter:**

**Toggle: Enemy Composition**
  - **Wave 1:** 6 Berserkers (CR 2 total) attacking east gate
  - **Wave 2:** 2 Werewolves (CR 3 each) + 4 Wolves attacking north gate
  - **Final Wave:** 1 Werebear (CR 5) leading final push

**Thorne's Role:**
- Fights alongside party (limited due to old injury - limp)
- Provides tactical advice during battle
- Shields weaker party members if they're in danger

**DM Notes:**
- **Success Condition:** Prevent breaches, minimize civilian casualties
- Earns Thorne's deep trust (unlocks Quest 3)
- Thorne shares personal story after battle (Garrek, his old party)
- No gold reward - this is about community defense

---

### Quest 3: Investigate Garrek's Falls

**Quest Giver:** Thorne "The Bear" Kallister (Unlocks After Quests 1 & 2)

**Hook:**

> After the Moon's Assault, Thorne takes you aside. He seems conflicted.
>
> "You've earned my trust. So I'll share something personal. Twenty years ago, my party explored the Underdark. My friend Garrek found a waterfall - said it had healing properties. Miraculous healing. But he died before we could return."
>
> He hands you a partially burned journal.
>
> "I want to know what happened to him. What he found. 100 gold for the truth. Plus... whatever Garrek left behind is yours."

**Garrek's Journal (Handout):**

**Toggle: Journal Contents**
  - **Map Fragment:** Partial route to Garrek's Falls from Meridian's Rest
  - **Entry 1:** "The waters heal anything. Regrew Torvan's finger in minutes."
  - **Entry 2:** "Strange. Time seems... wrong near the Falls. Clocks run backward."
  - **Entry 3:** "Found a book. Seven pages, metal, bound to a pedestal. Can't read it."
  - **Entry 4:** "Torvan tried to drink more water. Had to drag him away. ADDICTIVE."
  - **Entry 5 (burned):** "...tribe guards it... temporal... don't trust..."

**Objective:** Travel to Garrek's Falls, discover what happened, report back

**Location:** Garrek's Falls (Underdark)

**Toggle: Garrek's Falls Features**

**Healing Aura:**
- Continuous *lesser restoration* effect from moisture in air
- Removes diseases, poisons, curses passively

**Healing Waters (DANGER):**
- Single draught: Regrows limbs, restores all HP, cures diseases, raises dead (<72hrs)
- **DC 12 Wisdom Save:** On failure, compelled to drink more (will drown trying)
- **Evidence:** Skeletal remains in pool (DC 20 Perception to notice before drinking)

**The Codex of Peace:**
- 7 metal pages bound to stone pedestal
- Protected by Temporal Bloodline Tribe
- Zone prevents violence, ill will, evil acts
- Removal without keyword → explosion (pages scatter as blue energy)

**Temporal Bloodline Tribe:**
- Guardians of the Falls and Codex
- Possess temporal magic abilities
- May recognize Nikki's interest in temporal power
- Potential allies if approached peacefully

**DM Notes:**
- Party can discover Codex location without removing it
- Temporal Bloodline connection for Nikki's arc
- Manny's artifact quest hook
- Josh/Brand may learn about elemental ancestors
- This location becomes important for future sessions

---

### Downtime Activities

**Available Between Quests**

**Timeline:**
- **Period 1:** After opening, before Quest 1 (1-2 days)
- **Period 2:** Between Quest 1 and Quest 2 (2-3 days)
- **Period 3:** After Quest 2, before Quest 3 (1-2 days)
- **Period 4:** After Quest 3 (variable - party choice)

**Toggle: Crafting System**

**Meridian's Rest as Crafting Hub:**
- Population ~2000 (half transient travelers)
- Function: Resupply hub for Agastia-bound adventurers
- Grateful townsfolk offer 15-20% discounts

**NPCs:**
- **Greta Moss (Apothecary):** Potions, poisons, ingredients
- **Aldwin Quill (Scribe):** Scrolls, inks, paper

**Crafting Options:**
- **Healing Potion:** 1 day, 25gp (or 12gp if gather moonbell flowers)
- **Greater Healing:** 2 days, 100gp (or 50gp if gather silverleaf + cave crystals)
- **Spell Scrolls:** 1-3 days, 15-250gp depending on spell level
- **Antitoxin:** 1 day, 50gp (or 25gp with ingredients)
- **Alchemist's Fire:** 1 day, 50gp

**Gathering Ingredients:**
- **Moonbell Flowers:** Medicine/Nature DC 12, 1d4 hours, nearby forest
- **Silverleaf:** Survival DC 14, 2d4 hours, deep forest
- **Cave Crystals:** Investigation DC 13, 2d4 hours, local caves

**Toggle: Personal Investigations**

**Kyle/Nameless:**
- Investigate Geist rumors (Persuasion/Investigation DC 12)
- Learn Geist has Merit Council position in Agastia
- Rumors of smuggling operation in dock district

**Manny:**
- Study Garrek's journal (Investigation DC 10)
- Identify references to ancient book (Codex)
- Map fragment points to Underdark location

**Nikki:**
- Study journal's temporal references (Arcana DC 13)
- "Time seems wrong" suggests temporal magic or anomaly
- Temporal Bloodline Tribe may have answers

**Josh/Brand:**
- Talk with Thorne about his adventuring days (no check)
- Thorne mentions elemental phenomenon in Underdark
- Old legends about civilization with elemental powers

**Ian/Rakash:**
- Ask Thorne about Storm Giants (History/Persuasion DC 10)
- Thorne heard of Storm Giant brigade near coastal regions
- May have information about Rakash's revenge quest

---

### Travel to Agastia (If Party Chooses)

**Route:** Meridian's Rest → Agastia
**Distance:** ~48 miles (2 hexes at 24mi/hex world scale)
**Travel Time:** 2 days at normal pace (24 mi/day)

**Terrain:** Temperate Forests
**Table Reference:** agastia-campaign/Resources/Tables/Tier1_Inspiring_Table.md - Temperate Forests (2d8)

## TEMPERATE FORESTS (Tier 1)
**Roll 2d8**

| 2d8 | Encounter Theme |
|-----|-----------------|
| **2** | **Helpful Sprite Circle** |
| | A ring of mushrooms glows faintly in a moonlit glade where sprites feast on honeyed cakes and fermented berry wine. They're jovial and welcoming—offering the party rest, food, and magical guidance in exchange for stories or songs. The sprites can point toward nearby points of interest, warn of dangers ahead, or grant a minor blessing (advantage on next Survival check). **Variation:** One sprite is actually a disguised pixie with access to polymorph and confusion, testing the party's worthiness. **Non-Combat:** The sprites offer to become allies if the party plants enchanted acorns at three specific locations, creating new faerie rings across the forest. |
| **3** | **Lost Mastiff** |
| | A skeletal, starving mastiff watches the party from the undergrowth, too scared to approach. It wears a rotted leather collar with a noble family's crest. If offered food, it bonds with whoever feeds it first and becomes fiercely loyal. **Variation:** The dog is being tracked by a bugbear who wants to eat it—the bugbear arrives in 1d4 rounds after the party encounters the dog. **Non-Combat:** Following the collar's crest leads to a ruined estate where the dog's original owners were killed by bandits; treasure remains hidden in the wreckage. |
| **4** | **Awakened Shrub Choir** |
| | The party stumbles into a clearing where awakened shrubs sway and sing in terrible, off-key harmony. They're practicing for the Seasonal Celebration and desperately want an audience. The shrubs are harmless but incredibly annoying. **Variation:** One shrub is actually a twig blight spy sent by a gulthias tree—it tries to lead the party into a trap. **Non-Combat:** If the party gives honest (even critical) feedback and helps them practice, the shrubs share knowledge of a nearby hidden spring that grants temporary hit points when drunk (1d8+1 temp HP, lasts until next rest). |
| **5** | **Pseudodragon Quarrel** |
| | Two pseudodragons are locked in an aerial squabble over a shiny object (a silver locket). They dive and snap at each other, occasionally crashing into trees. Neither wants to back down from this territorial dispute. **Variation:** The locket is actually cursed—whoever touches it becomes the next target of their conflict until it's returned to its resting place (an old grave nearby). **Non-Combat:** The party can adjudicate the dispute; the grateful winner becomes a temporary companion for 1d4 days, or both pseudodragons flee, dropping the locket (worth 25 gp, or more if returned to rightful owner's family). |
| **6** | **Wandering Druid** |
| | An elderly druid sits by a babbling brook, smoking a pipe carved from oak root. She's monitoring the health of the forest and notes that "something dark stirs in the old hollow." She can provide healing, identify plants, and share rumors. **Variation:** She's actually a green hag in disguise, testing the party's intentions—if they're cruel to nature, she becomes hostile. **Non-Combat:** If the party helps her gather medicinal herbs or clear corruption from a nearby grove, she grants them a charm that allows one free casting of *speak with animals*. |
| **7** | **Unicorn Sighting** |
| | A flash of silver-white catches the corner of someone's eye—a unicorn stands at the forest's edge, watching the party with intelligent eyes. It bolts immediately, but those who saw it feel blessed (advantage on their next saving throw). **Variation:** If the party can track it (DC 16 Survival check with disadvantage—it's very fast), they find it wounded by goblin arrows, creating a moral choice. **Non-Combat:** Healing the unicorn (or choosing not to pursue it) grants a more powerful blessing: the unicorn's horn glows and leaves behind a single silver hair that can cure one disease or poison (no action required). |
| **8** | **Goblin Ambush Site** |
| | The forest goes silent. Worg tracks and goblin footprints surround a freshly dug pit covered with branches and leaves. Crude wooden spikes line the bottom (2d6 piercing damage, DC 12 Dex save to avoid). Goblins watch from the bushes, hoping their trap succeeds. **Variation:** Instead of a few goblins, a bugbear leads the ambush party, using the goblins as expendable shock troops. **Non-Combat:** Keen-eyed characters (DC 14 Perception) spot the trap before triggering it and can either avoid it, disarm it, or turn it against pursuers. |
| **9** | **Spider's Hunting Ground** |
| | Massive webs stretch between ancient oaks, glistening with dew. Giant wolf spiders lurk in the canopy, and cocooned corpses dangle from branches—some still twitching. An ettercap commands the spiders from a higher perch, chittering orders. **Variation:** One cocoon contains a still-living noble who will pay handsomely for rescue (or the spiders are defending egg sacs that will hatch in days, flooding the forest). **Non-Combat:** Sneaking through (DC 15 Stealth group check) or using fire to clear a safe path avoids the fight; investigating cocoons yields 2d20 gp in valuables. |
| **10** | **Territorial Owlbear** |
| | The earth shakes with heavy footfalls. An owlbear crashes through the underbrush, feathers bristling and beak clacking. It's protecting its nearby nest and views all intruders as threats. **Variation:** The owlbear is diseased or maddened by corrupted water, making it even more aggressive and unpredictable (add 10 HP, disadvantage to calm it). **Non-Combat:** A successful DC 16 Animal Handling check or offering 3 days of rations as a peace offering makes it back down; the party can choose to investigate the nest (containing a shiny obsidian egg worth 50 gp to collectors). |
| **11** | **Stirge Storm** |
| | A high-pitched buzzing fills the air as a thirst of stirges drops from the canopy like a crimson cloud. They're ravenous, having fed on a dying deer nearby. Blood frenzy makes them fearless. **Variation:** So many stirges descend that they count as two swarms instead of individual creatures; or they're fleeing from something even worse (a young green dragon arrives in 1d6 rounds). **Non-Combat:** Characters who immediately drop prone and cover themselves can avoid the initial assault (DC 13 Dex save); smoke or fire drives them off without a fight. |
| **12** | **Grick Ambush** |
| | Stone outcroppings line the forest path—except they're not stone. Gricks slither from rocky crevices, their tentacles probing for prey. They've been starving and desperate for weeks. **Variation:** One grick is much larger (use grick alpha stats if available, or double HP), the alpha of the pack. **Non-Combat:** Tossing fresh meat (3 rations worth) into the rocks distracts them long enough to flee; following their trails leads to a cave filled with bones and 3d20 gp in coins. |
| **13** | **Hobgoblin Hunting Party** |
| | The crack of branches and barked orders in Goblin heralds the approach of disciplined hobgoblin scouts. They're tracking a thief who stole from their war band—an urchin who nabbed food to feed his starving siblings. **Variation:** The hobgoblins are led by a captain who carries a banner marked with the symbol of a distant warlord—killing him draws attention from a larger force. **Non-Combat:** The party can negotiate (hobgoblins respect strength and honesty), hand over the thief, hide the thief and bluff (DC 15 Deception), or learn the thief's location is in a nearby hollow tree. |
| **14** | **Corrupted Grove** |
| | A massive oak dominates a darkened grove, its trunk split and oozing shadow. Needle blights, twig blights, and vine blights emerge from the corruption, attacking mindlessly. At the center, liquid shadow bubbles from the tree's wound. **Variation:** The corruption is spreading—a young gulthias tree is taking root, and if not destroyed, will spawn more blights weekly. **Non-Combat:** A DC 14 Nature or Religion check reveals the corruption can be cleansed with holy water and fire; doing so without fighting requires stealth (DC 16) but destroys the threat permanently. |
| **15** | **Ankheg Eruption** |
| | The ground trembles and explodes upward as an ankheg bursts from below, mandibles clacking. Its carapace bears strange metal tags—someone has been studying it. **Variation:** The ankheg is protecting its burrowed eggs (3 eggs worth 100 gp each to scholars or tamers). **Non-Combat:** Investigations reveal the tags bear a wizard's mark; following the trail leads to an eccentric researcher who will pay 50 gp for information on the ankheg's behavior and location. |
| **16** | **Green Dragon's Domain** |
| | The forest grows unnaturally quiet and dark. Acrid fog rolls between the trees. A green dragon wyrmling watches from a high branch, studying the party with ancient, intelligent eyes. It speaks, offering a "trade"—information for secrets, or safe passage for tribute. **Variation:** The wyrmling is genuinely curious and might become a recurring NPC if treated well, or it's setting up an ambush with goblin allies hidden nearby. **Non-Combat:** Clever negotiation, offering valuable information (secrets about local politics, treasure locations), or appealing to its vanity can result in the wyrmling letting the party pass or even granting a warning about nearby dangers. The wyrmling might demand one magic item or 50 gp in tribute. |

**Notable NPCs on Route:**
- **Corvin Tradewise:** Merchant caravan leader (see NPCs/Location_NPCs/NPC_Corvin_Tradewise.md)
  - Leads caravan of 5 wagons with 4 guards (Veterans)
  - Traveling toward Meridian's Rest when party encounters him
  - Willing to trade supplies at normal prices (potions, rope, rations, etc.)
  - Offers information: "Roads safe near Agastia, but bandit trouble up north"
  - Can be hired for future transport (50gp round trip to Meridian's Rest)
  - **If Kyle asks about dock inspections/Geist:** "Yeah, 'Inspector G' they call him. Real piece of work. Merit Council badge, but everyone knows he's crooked. Protection fees, delayed shipments... Can't prove it though. He's got the Council's backing."

---

### Agastia Arrival

**Day 2, Evening:**

> The road climbs a gentle rise, and suddenly Agastia sprawls before you. The city rises in tiers—districts stacked like a wedding cake, each level connected by broad staircases and ramps. Enormous stone statues of ancient heroes tower over streets and plazas, their weathered faces watching all who enter.
>
> The Northern Wall dominates the skyline—a massive fortification protecting the city from threats emerging from the distant Infinite Forest. Guard towers dot the wall, and Merit Council soldiers stand watch.
>
> To the north, you see airship docks perched on the upper tiers—magical vessels tethered like ships at harbor, their sails glowing with arcane energy.
>
> The city gates stand open. Guards check travelers' identification and merit papers, but the process moves quickly. You're here.

**Gate Entry:**
- Guards ask for names and purpose of visit (routine check)
- No merit papers required for entry, just identification
- Torvin's letter destination: [Patron name to be determined]
- Party can enter freely—Agastia is open to travelers

---

### Agastia: City Layout

**Tiered Structure (Top to Bottom):**

**Tier 1 (Top): Airship Docks**
- Engineering marvel, magical vessels
- Upper tier access requires wealth or merit

**Tier 2: Government Complex**
- Inverse Tower (extends downward)
- Merit Council chambers
- Administrative offices

**Tier 3: Scholar Quarter & Residential (Merit)**
- **Archive of Lost Histories:** Veridian Scrollkeeper's workplace
- Public libraries, research facilities
- Universities and academies
- Testing centers for merit advancement
- Housing for successful citizens

**Tier 4: Merchant District (Main Entry Point)**
- **Stonemark Antiquities:** Mirella's artifact shop
- **The Gilded Gryphon Inn:** Quality lodging (5gp/night)
- **Il Drago Rosso (The Red Dragon):** Nikki's family restaurant
- Markets, shops, equipment vendors
- Torvin's letter destination [TBD]

**Tier 5: Residential (Lower) & Artisan Workshops**
- Basic housing for working class
- Craftspeople and artisans
- Less affluent but respectable

**Tier 6: Docks/Warehouse District**
- **Warehouse 7, Pier District:** Geist's smuggling operation
- Import docks, trade ships
- Fishmonger's Row
- Sailor taverns (rough clientele, good information)
- **The Rusty Anchor:** Dock worker tavern (Harren drinks here)

**Tier 7 (Bottom): The Depths**
- **Dispossessed Housing:** Overcrowded, poor conditions
- Underground/black market goods
- **Storm Shrine:** Small temple to elemental gods
- Resistance hideouts (secret meeting places)
- **Informant networks:** Kex the Fence operates here

**Navigation:**
- **Lifts (Paid):** 1cp per tier, Merit Council operated
- **Staircases (Free):** 15 minutes per tier at normal pace
- **Carts/Horses:** Not allowed on upper tiers (too crowded)

---

### Agastia: Player Quest Nodes

#### Manny's Quest: Finding the Codex

**Objective:** Locate information about the Dominion Evolution Codex

**Entry Points:**

**Toggle: Option 1 - Visit Veridian Scrollkeeper (Free)**
- **Location:** Archive of Lost Histories, Scholar Quarter (Tier 3)
- **How to Find:** DC 12 Investigation in Scholar Quarter, or ask at any library about "artifact experts"
- **What He Shares:**
  > "Ah, the Dominion Evolution Codex! A fascinating legend. Seven metal pages, bound to stone, supposedly capable of enforcing peace itself. The old texts say it was placed in a sanctuary where time flows... strangely. Healing waters, if the stories are true. Look for the Temporal Bloodline—they were the guardians, last I heard."
- **Information Provided:**
  - Studied "peace-binding artifacts" for 40 years
  - References to Seven-Page Codex in fragmentary texts
  - Believes it was hidden in Underdark by temporal tribe
  - Points toward Temporal Bloodline legends
  - Mentions "healing sanctuaries" in old explorer journals

**Toggle: Option 2 - Visit Mirella Stonemark (25gp or Trade)**
- **Location:** Stonemark Antiquities, Merchant District (Tier 4)
- **How to Find:** DC 10 Investigation (well-known shop), any merchant can direct party
- **What She Offers:**
  > "The Codex? Interesting choice. I don't have the artifact itself, but I DO have journal pages from an adventurer who found something like it. Twenty years old, from a dwarf named Garrek. Mentions a metal book bound to stone, wouldn't budge. Near underground waterfalls. Time got 'weird' there, he said. I'll part with copies for... let's say 25 gold. Or if you've got something INTERESTING to trade..."
- **Information Provided (if purchased):**
  - 2 pages from Garrek's journal (same journal Thorne will give in Quest 3)
  - One mentions "metal book that won't open" near waterfalls
  - Another references "temporal anomalies in the deep"
- **DM Note:** Buying now gives HEAD START on Codex quest; waiting gets it free from Thorne later

**Toggle: Option 3 - Wait for Quest 3 (Free, Later)**
- Thorne gives Garrek's full journal after Quest 2
- Contains map fragment and more details
- No cost but requires completing quests at Meridian's Rest first

**Revelation:**
- Codex is at Garrek's Falls (Underdark)
- Guarded by Temporal Bloodline Tribe
- Location has healing waters (dangerous—addictive)
- Seven metal pages bound to stone pedestal

---

#### Kyle's Quest: Kaelborn/Geist Investigation

**Quest State from Meridian's Rest:**
- Kyle knows: "Kaelborn is easy to find but hard to access"
- Kyle knows: "Geist is hard to find but easy to access"

**The Correct Dynamic:**
- **Kaelborn** = Public Merit Council official (known location, requires rank/leverage to access)
- **Geist** = Hidden enforcer (must locate, but easy to approach once found)

**Kyle can pursue either path:**

---

##### Path 1: Access Kaelborn (Direct Route)

**Objective:** Gain access to Kaelborn, a high-ranking Merit Council official

**Revelation:** Kyle needs access to Kaelborn, who runs an illicit smuggling network under official cover. Kaelborn is publicly known but protected by rank and bureaucracy.

**Access Options:**
1. Gain credentials/rank to meet him officially
2. Find leverage to force a meeting
3. Locate Geist and use him as a route to Kaelborn

###### Entry Node 1: Merit Council Clerk

**Location:** Government Complex (Tier 2), Public Records Office
**Skill Check:** Persuasion DC 10

**Hook:**
> A harried clerk shuffles papers behind a desk. When asked about accessing high officials, they sigh.

**What They Share:**
- Kaelborn's official role: Trade Oversight Division
- Public record: Spotless, highly ranked in Merit system
- Access requirements: "You'll need an appointment. His schedule is booked months in advance."
- Alternative: "Unless you have urgent official business... or significant Merit rank yourself."

**Leads To:** Location 1 (Kaelborn's Office - Bureaucratic Route)

###### Entry Node 2: Dock Merchants

**Location:** Merchant District (Tier 4) or Docks (Tier 6)
**Skill Check:** Investigation DC 12

**Hook:**
> Several merchants, when asked about dock trade issues, exchange nervous glances. One eventually speaks quietly.

**What They Share:**
- "Kaelborn controls all dock trade. Nothing moves without his approval."
- "We pay... extra fees. Kaelborn's people collect them."
- "There's someone who handles the collections - we don't know his name, but he's dangerous."
- "Complain to the Merit Council? Kaelborn IS the Merit Council!"

**Leads To:** Location 2 (Merchant Network - Evidence Gathering)

###### Entry Node 3: Underground Informant

**Location:** The Depths (Tier 7), black market contacts
**Skill Check:** Streetwise DC 13

**Hook:**
> An underground informant, when asked about illicit trade, mentions a name: Geist.

**What They Share:**
- "Geist is Kaelborn's shadow - does the dirty work while the boss stays clean."
- Geist runs protection rackets, smuggling, enforcement
- "Operates out of somewhere in the dock district. Hidden. You'll have to search."
- "Get to Geist, you might get to Kaelborn. Maybe."

**Leads To:** Location 3 (Find Geist - Alternative Route)

###### Investigation Location 1: Kaelborn's Office (Bureaucratic Route)

**3 Clues Available:**

**Toggle: Clue 1 (Observation) - DC 12 Perception**
- Kaelborn's office in Government Complex is well-guarded
- Appointment book is FULL for months (deliberately)
- Guards turn away visitors without proper credentials
- "Emergencies" are denied unless you have significant rank

**Toggle: Clue 2 (Records) - DC 14 Investigation**
- Kaelborn's public record is suspiciously perfect
- All trade disputes resolved "in favor of efficiency"
- Complaints against dock inspections dismissed systematically
- Pattern suggests corruption, but no proof

**Toggle: Clue 3 (Insider Info) - DC 16 Persuasion (bribe clerk 10gp)**
- "Kaelborn only sees people with Merit Rank 5+ or official summons"
- "Or... if you have information he wants. Something valuable."
- "I've heard he meets people privately sometimes. Different location. But I don't know where."

**Revelation:** Direct access to Kaelborn requires high Merit rank or leverage

###### Investigation Location 2: Merchant Network (Evidence Gathering)

**3 Clues Available:**

**Toggle: Clue 1 (Testimonial) - DC 11 Persuasion**
- Multiple merchants confirm "unofficial fees" to Kaelborn's operation
- Payments go to collectors, not Kaelborn directly
- Pattern of extortion across entire dock district
- No merchant will testify (too afraid, too connected)

**Toggle: Clue 2 (Documentary) - DC 13 Investigation**
- Merchant ledgers show payments to "Trade Office" beyond official taxes
- Amounts are 10-15% of shipment value (systematic)
- One ledger mentions "K's fees" - likely Kaelborn
- Evidence of organized racket

**Toggle: Clue 3 (Collector Identity) - DC 14 Investigation**
- Collectors mention someone called "Geist"
- Geist works for Kaelborn (confirmed by multiple sources)
- Operates from hidden location in dock district
- Finding Geist might provide route to Kaelborn

**Revelation:** Kaelborn runs protection racket through hidden enforcer (Geist)

###### Investigation Location 3: Find Geist (Alternative Route to Kaelborn)

**The Challenge:** Geist is HIDDEN - must be found

**Search Methods:**

**Method 1: Ask Dock Workers (DC 12 Investigation)**
- Workers have seen Geist but don't know where he's based
- "Warehouse district, somewhere. But which warehouse?"
- Descriptions: Human, wears inspector's uniform sometimes

**Method 2: Follow the Money (DC 14 Investigation)**
- Track where "fees" are delivered
- Pattern suggests Warehouse 7, Pier District
- Requires stakeout to confirm

**Method 3: Underground Intel (DC 13 Streetwise)**
- Black market knows about Geist
- "Warehouse 7, Pier District - that's his base"
- "Easy to approach once you know where. Just walk in."

**3 Clues Available (Once Geist Found):**

**Toggle: Clue 1 (Surveillance) - DC 12 Stealth**
- Geist operates from Warehouse 7, Pier District
- Mentions "Kaelborn's orders" when giving instructions

**Toggle: Clue 2 (Confrontation) - Intimidation DC 14 or Combat**
- If intimidated or captured: "I work for Kaelborn!"
- "You want to meet him? You'll need leverage. He doesn't just talk to anyone."

**Toggle: Clue 3 (Documents) - DC 15 Investigation (search warehouse)**
- Shipping manifests reference "K's approval"
- Correspondence mentions meeting locations
- Evidence of their criminal partnership

**Revelation:** Geist is the route to Kaelborn if you have leverage

###### Final Options to Access Kaelborn:

**Option 1: Gain Merit Rank**
- Achieve Rank 5+ through official testing/deeds
- TIME: Months of effort
- RESULT: Legitimate access, but Kaelborn prepared

**Option 2: Gather Evidence, Force Meeting**
- Collect proof of Kaelborn's corruption
- Threaten exposure unless he meets
- RISK: Kaelborn may strike first

**Option 3: Through Geist**
- Find Geist, capture/intimidate/negotiate
- Use Geist to arrange meeting
- RESULT: Meeting happens, but Kaelborn controls terms

**Option 4: Infiltrate Operation**
- Pose as smuggler/corrupt official
- Get recruited into network
- RISK: Deep cover, dangerous

**Option 5: Report to Merit Council**
- Present evidence to Council authorities
- DOWNSIDE: Kaelborn may escape through connections

---

##### Path 2: Investigate Geist (Enforcer Route)

**Objective:** Locate and investigate Geist's smuggling operation

**Revelation:** Geist operates smuggling safehouse under cover of Merit Council Trade Inspector position.

**Key Details:**
- Geist = Merit Council Trade Inspector (uses position as cover)
- Kaelborn = The real boss (Geist takes orders from him)
- Safehouse = Warehouse 7, disguised as "confiscated goods warehouse"

###### Entry Node 1: Harren (Dock Worker)

**Location:** The Rusty Anchor tavern, Dock District (Tier 6)
**Skill Check:** Persuasion DC 10 (easy—first clue should be accessible)

**Hook:**
> A weathered dock worker named Harren sits at the bar, nursing ale. If approached and asked about "inspections" or "dock corruption," he'll talk after 1-2 drinks (2gp).

**What He Shares:**
- "Inspector Geist? Yeah, I seen him. Takes 'fees' from smugglers."
- "Warehouse 7, down by Pier District—that's where he does business."
- "Got the Council badge, so nobody touches him. Protected."

**Leads To:** Location 1 (Warehouse District investigation)

##### Entry Node 2: Mira Saltwind (Extorted Merchant)

**Location:** Saltwind Imports, Merchant District (Tier 4)
**Skill Check:** Investigation DC 13 (moderate—hidden ledger)

**Hook:**
> Mira runs a legitimate import business but looks perpetually stressed. Her ledgers show mysterious "inspection fees" paid monthly to "Inspector G."

**What She Shares (if persuaded):**
- "Inspector G comes every month. 'Inspection fees,' he calls it."
- "Pay or he shuts down my shipments—claims 'irregularities.'"
- "Other merchants pay too. We can't fight him—he's Merit Council."
- "He works out of a warehouse near the docks."

**Leads To:** Location 2 (Merit Council Records Office)

##### Entry Node 3: Kex the Fence (Rival Smuggler)

**Location:** Underground informant network / black market (The Depths, Tier 7)
**Skill Check:** Intimidation OR Persuasion DC 13

**Hook:**
> Kex is a small-time smuggler operating in the black market. Geist shut down his competition using Merit authority. He's bitter and willing to talk.

**What He Shares:**
- "Geist ain't just corrupt—he's the BOSS of smuggling here."
- "Uses his Merit Council position to eliminate rivals like me."
- "Works with someone higher up—never seen him, but Geist takes orders."
- "Warehouse 7, Pier District. That's the safehouse."

**Leads To:** Location 3 (Black Market / Informant Network)

##### Investigation Location 1: Warehouse District (Pier 7)

**3 Clues Available:**

**Toggle: Clue 1 (Environmental) - DC 12 Perception**
- Observe workers moving crates at odd hours (night operations)
- Crates marked "Merit Council—Confiscated Goods"
- But workers are too nervous, look like criminals, not officials

**Toggle: Clue 2 (Physical) - DC 14 Stealth to get close**
- Geist himself is present, wearing Merit Council inspector uniform
- Directing smugglers, collecting payments
- "Make sure the shipment gets through—Council inspection is covered."

**Toggle: Clue 3 (Documentary) - DC 15 Investigation (break-in or bribe)**
- Shipping manifests show contraband (weapons, drugs, forbidden goods)
- Schedules indicate when inspections are "bypassed"
- One manifest references "K's orders"—Kaelborn

**Revelation:** Geist is using his official position as cover for smuggling operation. Warehouse 7 is the safehouse.

##### Investigation Location 2: Merit Council Records Office

**3 Clues Available:**

**Toggle: Clue 1 (Documentary) - DC 13 Investigation (public records)**
- Geist IS officially a Trade Inspector (legitimate position)
- Assigned to Dock District inspections
- Records show suspiciously clean inspection history (too perfect)

**Toggle: Clue 2 (Property Records) - DC 14 Investigation**
- Warehouse 7 is registered as "Merit Council Confiscated Goods Storage"
- Lease holder: Trade Inspector Geist
- Officially sanctioned facility (explains why no one questions it)

**Toggle: Clue 3 (Financial) - DC 16 Investigation (bribe clerk 10gp)**
- "Inspection fees" collected by Geist are NOT reported to Council
- Personal enrichment, not official revenue
- Amounts suggest protection racket (merchants paying bribes)

**Revelation:** Geist holds legitimate Merit Council position, which he's abusing for smuggling and extortion.

##### Investigation Location 3: Black Market / Informant Network

**3 Clues Available:**

**Toggle: Clue 1 (Social/Testimonial) - DC 11 Persuasion (street contacts)**
- Multiple witnesses confirm Geist runs protection racket
- "Pay him or your goods 'disappear' during inspection"
- Everyone knows, but he's untouchable (Merit Council badge)

**Toggle: Clue 2 (Rumors) - DC 13 Investigation (ask around)**
- Geist works for someone called "Kaelborn"
- "Kaelborn's the real boss—Geist is just the front man"
- No one's seen Kaelborn, but he gives the orders

**Toggle: Clue 3 (Location Intel) - DC 12 Streetwise (informants)**
- Warehouse 7 is definitely the safehouse
- "Geist is there most evenings, managing operations"
- Best time to catch him: Night, when shipments arrive

**Revelation:** Geist is the public face of a smuggling operation run by the mysterious Kaelborn.

##### Confronting Geist (If Party Acts)

**Geist's Stats:** Use Bandit Captain (CR 2)
**Location:** Warehouse 7 (can be infiltrated or approached openly)
**Guards:** 2d4 Thugs (CR 1/2 each)

**Approach Options:**

**Toggle: Option 1 - Gather Evidence First**
- Collect 3+ clues from investigation
- Report to Merit Council with proof
- Council investigates, Geist arrested (bureaucratic solution)
- **Result:** Geist removed, but Kaelborn escapes

**Toggle: Option 2 - Confront Geist Directly**
- Combat encounter (Geist + thugs)
- Geist tries to flee if losing
- Can be captured and interrogated
- **Result:** Learn Kaelborn's location (next quest hook)

**Toggle: Option 3 - Infiltrate and Steal Evidence**
- Stealth mission (DC 15 group Stealth check)
- Steal manifests, ledgers, proof of corruption
- Geist doesn't know who did it (anonymous justice)
- **Result:** Evidence delivered to Council or rivals

**Geist's Information (If Interrogated):**
- "Kaelborn pays me to run this operation."
- "I don't know where he is—we communicate through drops."
- "He's got connections high up in the Merit Council."
- "You can't touch him—he's protected."

**DM Note:** Geist doesn't know Kaelborn's location (he's insulated). Finding Kaelborn requires further investigation (future session).

---

#### Ian's Quest: Storm Giant Intelligence

**Objective:** Learn more about the Storm Giant warband

**Entry Points:**

**Toggle: Option 1 - Military Contacts (DC 12 Persuasion)**
- Merit Council soldiers know of Storm Giant raids
- "Warband operating from Lonely Mountain"
- "They've fortified a position—can't just walk in"
- "Raiding coastal towns for supplies and slaves"

**Toggle: Option 2 - Mercenary Guilds (DC 10 Investigation)**
- Bounty board notice: "Storm Giant Brigade—DO NOT ENGAGE ALONE"
- Reward: 500gp for information leading to warband's destruction
- Contact: Captain Torrhen, Merit Council Military

**Toggle: Option 3 - Tavern Rumors (DC 13 Persuasion + Drinks 5gp)**
- Retired adventurers know the Storm Giant
- "Name's Krythak the Stormbringer—he's got a whole militia"
- "Maybe 20-30 giants and smaller races serving him"
- "They've got siege weapons, fortifications—it's a WAR CAMP"

**Revelation:**
- Storm Giant's name: Krythak the Stormbringer (see NPCs/Major_NPCs/NPC_Krythak_Stormbringer.md)
- Location: Lonely Mountain (specific peak to be mapped)
- Force Size: ~25-30 combatants (giants + humanoids)
- Fortified Position: Requires planning to assault

**Next Steps:**
- Gather allies (can't solo this)
- Scout the location first
- Build reputation to attract help

---

#### Josh's Quest: Ancestor Group

**Objective:** Discover which group sheltered his ancestors

**Entry Points:**

**Toggle: Option 1 - Scholar Quarter Research (DC 14 History)**
- Ancient records mention Elemental Orders
- Civilization with thunder/lightning magic
- Protected by "guardians" during a cataclysm
- References to Lyria's people (not named directly)

**Toggle: Option 2 - Thorne's War Stories (During Meridian's Rest Downtime)**
- Thorne mentions legends of elemental civilizations
- "Met a woman once—silver hair, lightning in her veins"
- "She spoke of protecting 'the last of the storm-marked'"
- Thorne doesn't know her name, but matches Lyria's description

**Toggle: Option 3 - Temple of the Storm (DC 12 Religion)**
- Small shrine in The Depths (Tier 7)
- Priest knows legends of "The Storm Guardians"
- "Protectors of those marked by elemental power"
- "They're said to still exist, watching over descendants"

**Revelation:**
- Josh's ancestors were protected by an Elemental Order
- The Storm Guardians (Lyria's people) sheltered them
- Lyria herself may have been involved (she's ancient)
- The markings on Josh are inherited protections

**Next Steps:**
- Find the Storm Guardians (requires investigation)
- Seek out Lyria (she knows the truth)
- Learn why ancestors needed protection

---

## Post-Session Debrief

**Toggle: Debrief Questions**

**Ask player/DM after session:**
1. Which quests did the party complete?
2. Did anyone die/nearly die during Moon's Assault?
3. Did party discover Garrek's Falls? What did they do with the Codex?
4. What did players craft during downtime?
5. Which personal investigations did PCs pursue?
6. Did anyone drink the healing waters? (CRITICAL - addiction check)
7. What's the party's next move - Agastia or deeper investigation?

**Then update:**
- PC knowledge sections with new discoveries
- Codex location now known (if Quest 3 completed)
- Temporal Bloodline Tribe relationship status
- Track any addictions to healing waters
- Prepare Session 3 based on party choice (Agastia vs Garrek's Falls)
