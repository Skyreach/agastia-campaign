---
name: Test Sync Sample
type: Session
---

# Test Sync Sample

## Quick Reference

**Toggle: Session Flow**
  1. **Travel to [[Agastia]]:** 2-3 day journey with themed encounters.
  2. [[Kyle/Nameless]]**'s Hook:** An encounter on the road.
  3. **Player Choice Encounter:** Choose from [[Lost Mastiff]], [[Wandering Druid]], or [[Goblin Ambush Site]].

**Toggle: Key NPCs**
  - [[Corvin Tradewise]]**:** [[Merchant Caravan]] leader who can provide information about [[Quest: Geist Investigation]].
  - **Dead Smuggler:** Victim at crate scene.
  - [[Mira Saltwind]]**:** [[Merchant District]] proprietor.

**Toggle: Locations**
  [[Il Drago Rosso]]** - [[Nikki]]'s Family Restaurant**
  - **What:** [[Nikki]]'s family establishment.
  [[Veridian Scrollkeeper]]**'s Location**
  - **What:** Rumored expert on history.

## Encounter Nodes

**Forest Clearing - **[[Lost Mastiff]]
- **What:** A well-bred mastiff.

**Druid's Grove - **[[Wandering Druid]]
- **What:** Ancient oak grove.

**Abandoned Cart - **[[Goblin Ambush Site]]
- **What:** Overturned cart with goblin tracks.

## Expected Patterns After Normalization

The above should normalize to:
  2. **[[Kyle/Nameless]]'s Hook:** An encounter on the road.
  - **[[Corvin Tradewise]]:** [[Merchant Caravan]] leader who can provide information about [[Quest: Geist Investigation]].
  - **[[Mira Saltwind]]:** [[Merchant District]] proprietor.
  **[[Il Drago Rosso]] - [[Nikki]]'s Family Restaurant**
  **[[Veridian Scrollkeeper]]'s Location**
  **Forest Clearing - [[Lost Mastiff]]**
  **Druid's Grove - [[Wandering Druid]]**
  **Abandoned Cart - [[Goblin Ambush Site]]**
