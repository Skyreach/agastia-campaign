# Wikilink Fix Tracker

**Status:** ✅ **COMPLETED** - All 77 files fixed (2026-01-04)

**Issue:** Wikilinks were showing as plain text `[[Page Name]]` instead of clickable Notion links
**Root Cause:** Pages were synced before sync_notion.py had proper wikilink support
**Solution:** Re-synced all 77 files using sync_notion.py with proper wikilink parsing

---

## Summary

- **Total Files Scanned:** 219 pages in Notion database
- **Files with Broken Wikilinks:** 77 files (35% of database)
- **Successfully Fixed:** 77/77 (100%)
- **Time to Complete:** ~50 minutes (with rate limit delays)

All wikilinks now render as proper Notion page mentions that are clickable.

---

## Original Status (Before Fix)

**Status:** 77 pages need fixing

## Pages with Broken Wikilinks

- [ ] **Tidecaller Armory**
  - File: `Locations/Cities/Agastia/Shop_Tidecaller_Armory.md`
  - Notion: https://notion.so/2d8693f0c6b48101b926cef91b39dba1

- [ ] **Quincy (Subject**
  - File: `NPCs/Faction_NPCs/NPC_Quincy_Subject5.md`
  - Notion: https://notion.so/2d8693f0c6b481058f6fe96d61893391

- [ ] **Shadow's Edge Armory**
  - File: `Locations/Cities/Agastia/Shop_Shadows_Edge_Armory.md`
  - Notion: https://notion.so/2d8693f0c6b481099b34c194a36898e4

- [ ] **Octavia (Subject**
  - File: `NPCs/Faction_NPCs/NPC_Octavia_Subject8.md`
  - Notion: https://notion.so/2d8693f0c6b4810cab6bc3bc1c5f4ac8

- [ ] **Giant's Axe**
  - File: `Campaign_Core/Giant_Axe_Artifact.md`
  - Notion: https://notion.so/2d8693f0c6b4810f9ed3c3e6c4b675cc

- [ ] **Lower Residential District**
  - File: `Locations/Districts/Lower_Residential_District.md`
  - Notion: https://notion.so/2d8693f0c6b4811192c8ca496e8cbfe4

- [ ] **Stonewick Herbalist**
  - File: `Locations/Cities/Agastia/Shop_Stonewick_Herbalist.md`
  - Notion: https://notion.so/2d8693f0c6b4811581e9e33e0620e1f1

- [ ] **The Wanderer's Pack**
  - File: `Locations/Cities/Agastia/Shop_The_Wanderers_Pack.md`
  - Notion: https://notion.so/2d8693f0c6b4811aae26d1f34440fad0

- [ ] **Blades of Glory**
  - File: `Locations/Cities/Agastia/Shop_Blades_of_Glory.md`
  - Notion: https://notion.so/2d8693f0c6b4811bb6acc266b2c7443c

- [ ] **Harren**
  - File: `NPCs/Location_NPCs/NPC_Harren_Dock_Worker.md`
  - Notion: https://notion.so/2d8693f0c6b48122aaa4e914149c5912

- [ ] **The Grand Cathedral**
  - File: `Locations/Cities/Agastia/Shop_The_Grand_Cathedral.md`
  - Notion: https://notion.so/2d8693f0c6b481258a9ec15c35c21e2a

- [ ] **Kex "The Fence"**
  - File: `NPCs/Location_NPCs/NPC_Kex_the_Fence.md`
  - Notion: https://notion.so/2d8693f0c6b4812b81a7cc19fc7babac

- [ ] **Scholar Quarter**
  - File: `Locations/Districts/Scholar_Quarter.md`
  - Notion: https://notion.so/2d8693f0c6b4812ba3bec384dec32a5c

- [ ] **Hexus "Tex" (Subject**
  - File: `NPCs/Faction_NPCs/NPC_Hexus_Subject6.md`
  - Notion: https://notion.so/2d8693f0c6b4812fbe64c817b9a86d39

- [ ] **Brightcoin Emergency Supplies**
  - File: `Locations/Cities/Agastia/Shop_Brightcoin_Emergency_Supplies.md`
  - Notion: https://notion.so/2d8693f0c6b481309eb5f17699335c53

- [ ] **Saltwind General Supply**
  - File: `Locations/Cities/Agastia/Shop_Saltwind_General_Supply.md`
  - Notion: https://notion.so/2d8693f0c6b48130a2eed071ab2d4f8e

- [ ] **Manny**
  - File: `Player_Characters/PC_Manny.md`
  - Notion: https://notion.so/2d8693f0c6b48133afb3c754750048a7

- [ ] **Il Drago Rosso**
  - File: `Locations/Cities/Agastia/Shop_Il_Drago_Rosso.md`
  - Notion: https://notion.so/2d8693f0c6b48138ba65eebcaff06221

- [ ] **Research Quarter**
  - File: `Locations/Districts/Research_Quarter.md`
  - Notion: https://notion.so/2d8693f0c6b4813abd03e3d69135a4de

- [ ] **Kaelborn**
  - File: `NPCs/Faction_NPCs/NPC_Kaelborn_Bandit_Boss.md`
  - Notion: https://notion.so/2d8693f0c6b4813eb552d3b4e953eeeb

- [ ] **Agastia Region**
  - File: `Locations/Regions/Agastia_Region.md`
  - Notion: https://notion.so/2d8693f0c6b4814a8353d3a47515a223

- [ ] **Working-Class Armory**
  - File: `Locations/Cities/Agastia/Shop_Working_Class_Armory.md`
  - Notion: https://notion.so/2d8693f0c6b4814e94e9e3392137eb55

- [ ] **Inkwell & Quill**
  - File: `Locations/Cities/Agastia/Shop_Inkwell_and_Quill.md`
  - Notion: https://notion.so/2d8693f0c6b48151a44ee076bd305c32

- [ ] **Blood Target (Unknown)**
  - File: `NPCs/Mystery_NPCs/Blood_Target_Unknown.md`
  - Notion: https://notion.so/2d8693f0c6b48151ac06d77d51f5144d

- [ ] **Storm Giant Warband (Octavia's Tool)**
  - File: `Factions/Faction_Storm_Giant_Warband.md`
  - Notion: https://notion.so/2d8693f0c6b481549d36d7cab814551c

- [ ] **Mirella Stonemark**
  - File: `NPCs/Location_NPCs/NPC_Mirella_Stonemark.md`
  - Notion: https://notion.so/2d8693f0c6b48156b625f82340c6e7ba

- [ ] **The Depths**
  - File: `Locations/Districts/The_Depths.md`
  - Notion: https://notion.so/2d8693f0c6b4815fadcfcc5d4fe692c9

- [ ] **Infinite Forest**
  - File: `Locations/Wilderness/Infinite_Forest.md`
  - Notion: https://notion.so/2d8693f0c6b48163bc17f611a1f9d792

- [ ] **Sawbones Surgery**
  - File: `Locations/Cities/Agastia/Shop_Sawbones_Surgery.md`
  - Notion: https://notion.so/2d8693f0c6b48165816ec0e8acba34dd

- [ ] **Geist Investigation**
  - File: `Quests/Quest_Geist_Investigation.md`
  - Notion: https://notion.so/2d8693f0c6b4816a9763e4e47513de07

- [ ] **The Giant's Axe**
  - File: `Quests/Quest_Giant_Axe.md`
  - Notion: https://notion.so/2d8693f0c6b4816bbd99de3faa0ef2c9

- [ ] **The Dispossessed**
  - File: `Factions/Faction_Dispossessed.md`
  - Notion: https://notion.so/2d8693f0c6b481718968dbf00a267d17

- [ ] **Professor Zero**
  - File: `NPCs/Major_NPCs/Professor_Zero.md`
  - Notion: https://notion.so/2d8693f0c6b48172bb57f1447a41a5fa

- [ ] **Nona (Subject**
  - File: `NPCs/Faction_NPCs/NPC_Nona_Subject9.md`
  - Notion: https://notion.so/2d8693f0c6b48175b243f1fff73e515c

- [ ] **Session 1 - Ratterdan Investigation**
  - File: `Sessions/Session_1_Caravan_to_Ratterdan.md`
  - Notion: https://notion.so/2d8693f0c6b4817b90b4fe31bee237ed

- [ ] **Veridian Scrollkeeper**
  - File: `NPCs/Location_NPCs/NPC_Veridian_Scrollkeeper.md`
  - Notion: https://notion.so/2d8693f0c6b4817eafacdd3630416da5

- [ ] **The Copper Mug**
  - File: `Locations/Cities/Agastia/Tavern_The_Copper_Mug.md`
  - Notion: https://notion.so/2d8693f0c6b4817fa699cf4ab01fe11b

- [ ] **Geist**
  - File: `NPCs/Faction_NPCs/NPC_Geist_Bandit_Lieutenant.md`
  - Notion: https://notion.so/2d8693f0c6b481829f28ce5523c75237

- [ ] **Dock District**
  - File: `Locations/Districts/Dock_District.md`
  - Notion: https://notion.so/2d8693f0c6b4818a849ad762f49622da

- [ ] **The Hidden Door**
  - File: `Locations/Cities/Agastia/Inn_The_Hidden_Door.md`
  - Notion: https://notion.so/2d8693f0c6b481a0bbb8e92b21b8caa3

- [ ] **The Dominion Evolution Codex**
  - File: `Campaign_Core/The_Codex.md`
  - Notion: https://notion.so/2d8693f0c6b481a19fa0d04415d3e8d8

- [ ] **Meridian's Rest**
  - File: `Locations/Towns/Meridians_Rest.md`
  - Notion: https://notion.so/2d8693f0c6b481a38711ed46f07bfa73

- [ ] **Nikki**
  - File: `Player_Characters/PC_Nikki.md`
  - Notion: https://notion.so/2d8693f0c6b481a4838ddf6362813f02

- [ ] **Septimus (Subject**
  - File: `NPCs/Faction_NPCs/NPC_Septimus_Subject7.md`
  - Notion: https://notion.so/2d8693f0c6b481a6af5cc83b58baedf5

- [ ] **Rakash "Ian"**
  - File: `Player_Characters/PC_Ian_Rakash.md`
  - Notion: https://notion.so/2d8693f0c6b481aaae54e148905483cc

- [ ] **Archive of Lost Histories**
  - File: `Locations/Cities/Agastia/Location_Archive_of_Lost_Histories.md`
  - Notion: https://notion.so/2d8693f0c6b481af96e3fcc7e21a51c9

- [ ] **Torvin Greycask**
  - File: `NPCs/Location_NPCs/NPC_Torvin_Greycask.md`
  - Notion: https://notion.so/2d8693f0c6b481b0a5fdf52d87d7e2c0

- [ ] **Ratterdan**
  - File: `Locations/Wilderness/Ratterdan_Ruins.md`
  - Notion: https://notion.so/2d8693f0c6b481b29ba5c1c1df5c3e95

- [ ] **Merit Council**
  - File: `Factions/Faction_Merit_Council.md`
  - Notion: https://notion.so/2d8693f0c6b481b2b209d3677440fe12

- [ ] **Brand Al'Thor "Josh"**
  - File: `Player_Characters/PC_Josh.md`
  - Notion: https://notion.so/2d8693f0c6b481b39ef9dcac8a40aeb4

- [ ] **Tetran (Subject**
  - File: `NPCs/Faction_NPCs/NPC_Tetran_Subject4.md`
  - Notion: https://notion.so/2d8693f0c6b481b59ceeffa018c700c7

- [ ] **The Codex Search**
  - File: `Quests/Quest_Codex_Search.md`
  - Notion: https://notion.so/2d8693f0c6b481c0a958e49860591899

- [ ] **Decimate Project**
  - File: `Factions/Faction_Decimate_Project.md`
  - Notion: https://notion.so/2d8693f0c6b481c2b4a6eb5b559676e5

- [ ] **Session 0 - Character Creation & Campaign Setup**
  - File: `Sessions/Session_0_Character_Creation.md`
  - Notion: https://notion.so/2d8693f0c6b481c3bf23f0827dead9e7

- [ ] **Thava Thornscale**
  - File: `NPCs/Location_NPCs/NPC_Thava_Thornscale.md`
  - Notion: https://notion.so/2d8693f0c6b481c781bcdaacb284c234

- [ ] **Animated Heartstone**
  - File: `Campaign_Core/Animated_Heartstone_Artifact.md`
  - Notion: https://notion.so/2d8693f0c6b481cda6f1ec0f87878c09

- [ ] **Stonemark Antiquities**
  - File: `Locations/Cities/Agastia/Shop_Stonemark_Antiquities.md`
  - Notion: https://notion.so/2d8693f0c6b481cfb6e3e736fa3ad36b

- [ ] **Krythak the Stormbringer**
  - File: `NPCs/Major_NPCs/NPC_Krythak_Stormbringer.md`
  - Notion: https://notion.so/2d8693f0c6b481da94b1e9e15230092e

- [ ] **Mira Saltwind**
  - File: `NPCs/Location_NPCs/NPC_Mira_Saltwind.md`
  - Notion: https://notion.so/2d8693f0c6b481dba0b9f5f76ed7f85e

- [ ] **Corvin Tradewise**
  - File: `NPCs/Location_NPCs/NPC_Corvin_Tradewise.md`
  - Notion: https://notion.so/2d8693f0c6b481e1b06af39bdcc0ed4f

- [ ] **Session 2 - Road to Agastia**
  - File: `Sessions/Session_2_Road_to_Agastia.md`
  - Notion: https://notion.so/2d8693f0c6b481e2946cf8ee7ecbb4d5

- [ ] **Decimate Project Subjects Reference**
  - File: `NPCs/Faction_NPCs/Decimate_Project_Subjects.md`
  - Notion: https://notion.so/2d8693f0c6b481e39a8cc26b7579f0a1

- [ ] **Chaos Cult**
  - File: `Factions/Faction_Chaos_Cult.md`
  - Notion: https://notion.so/2d8693f0c6b481e49224dbdf4279c464

- [ ] **The Desperate's Refuge**
  - File: `Locations/Cities/Agastia/Shop_The_Desperates_Refuge.md`
  - Notion: https://notion.so/2d8693f0c6b481e884f0d65920b41bfe

- [ ] **The House of Many Faiths**
  - File: `Locations/Cities/Agastia/Shop_Public_Temple.md`
  - Notion: https://notion.so/2d8693f0c6b481e8ba22ca1eafc9a925

- [ ] **The Patron**
  - File: `NPCs/Major_NPCs/The_Patron.md`
  - Notion: https://notion.so/2d8693f0c6b481eb8b5acc5579e171d6

- [ ] **Kyle/Nameless**
  - File: `Player_Characters/PC_Kyle_Nameless.md`
  - Notion: https://notion.so/2d8693f0c6b481ec94fec5e30a01a165

- [ ] **Agastia Campaign Overview**
  - File: `Campaign_Core/Campaign_Overview.md`
  - Notion: https://notion.so/2d8693f0c6b481f1a97fe6b54aaaf4e3

- [ ] **Government Complex**
  - File: `Locations/Districts/Government_Complex.md`
  - Notion: https://notion.so/2d8693f0c6b481f2870dcedecc71da0d

- [ ] **Geist & Kaelborn's Bandit Network**
  - File: `Factions/Faction_Bandit_Network_Geist_Kaelborn.md`
  - Notion: https://notion.so/2d8693f0c6b481f987aed9c59baf6634

- [ ] **Merchant District**
  - File: `Locations/Districts/Merchant_District.md`
  - Notion: https://notion.so/2d8693f0c6b481f98874eaec4cd4d508

- [ ] **Steel Dragon**
  - File: `NPCs/Major_NPCs/Steel_Dragon.md`
  - Notion: https://notion.so/2d8693f0c6b481fcae7ecb7cf71145f9

- [ ] **The Gilded Scale**
  - File: `Locations/Cities/Agastia/Shop_The_Gilded_Scale.md`
  - Notion: https://notion.so/2d8693f0c6b481fead5eda92d56281eb

- [ ] **Session 3 - The Steel Dragon Begins**
  - File: `Sessions/Session_3_The_Steel_Dragon_Begins.md`
  - Notion: https://notion.so/2d9693f0c6b48116a89ec5397dd339e7

- [ ] **Agastia**
  - File: `Locations/Cities/Agastia_City.md`
  - Notion: https://notion.so/2d9693f0c6b48181a922fa18ec8b9ff2

- [ ] **Missing Person Investigation**
  - File: `Quests/Quest_Missing_Person_Investigation.md`
  - Notion: https://notion.so/2dd693f0c6b481028beec747b60c63d1

- [ ] **The Blood Target**
  - File: `Quests/Quest_Blood_Target.md`
  - Notion: https://notion.so/2dd693f0c6b481c19ca7ede41b16ffa5

