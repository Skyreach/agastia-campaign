// ============================================================================
// 🕵️ Revelation Generator - Three Clue Rule Implementation
// Build dynamic, varied, node-based discovery systems
// ============================================================================

const rand = arr => arr[Math.floor(Math.random() * arr.length)];
const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

// ============================================================================
// Variant Pools - Five Categories
// ============================================================================

const variantPools = {
  physical: {
    object: ["dagger","map","amulet","scroll","ring","idol","statue","charm","key","locket","tool","bottle","coin","badge","mask"],
    modifier: ["bloodstained","engraved","broken","rusty","ornate","ancient","foul-smelling","gleaming","cracked","mysterious","burned","fragile"],
    action: ["found","buried","discarded","hidden","embedded","nailed","left behind","wedged","hanging","stuffed","uncovered","scratched"],
    detail: ["beneath the tavern","behind the altar","under a loose floorboard","inside a chest","within the ruins","beside the forge","near the docks","in the graveyard","at the market","under the bridge","inside the temple","under a pile of debris"],
    relevance: ["marked with {{mark}}","bearing the seal of {{entity}}","showing signs of struggle","hinting toward {{revelation}}","connected to {{subject}}","matching the description from witnesses","found next to {{person}}'s belongings","etched with {{symbol}}","still warm to the touch","covered in strange residue"]
  },

  social: {
    object: ["merchant","priest","guard","beggar","sailor","noble","bard","child","informant","spy","hermit","apprentice","scholar","clerk","servant"],
    modifier: ["nervous","talkative","suspicious","sleep-deprived","injured","drunk","friendly","arrogant","secretive","fearful","excited","oblivious"],
    action: ["spoke of","warned about","boasted of","muttered something about","denied knowing","gossiped about","begged to forget","sang a song about","cried over","revealed knowledge of","hinted at","feared"],
    detail: ["at the tavern","in the marketplace","on the road","during a festival","at the docks","in the temple","near the city gates","outside the courthouse","in the thieves' den","in a dark alley","by the riverbank","near the stables"],
    relevance: ["mentioning {{revelation}}","claiming involvement in {{revelation}}","speaking of {{entity}}","describing {{subject}}'s disappearance","repeating a rumor about {{revelation}}","contradicting earlier testimony","dropping the name {{person}}","linking {{object}} to {{entity}}"]
  },

  environmental: {
    object: ["tracks","ashes","footprints","blood splatter","claw marks","scorch marks","broken glass","mud trail","feathers","drag marks","burned grass","rubble pattern"],
    modifier: ["fresh","old","smudged","partial","deep","erratic","singed","strange","wet","bloody","unmistakable","uneven"],
    action: ["lead toward","end near","circle around","fade beside","start near","point to","snake across","emerge from","cross over","spiral around","descend into","climb toward"],
    detail: ["the temple ruins","the forest edge","the catacombs","the docks","the warehouse","the city walls","the watchtower","a nearby river","a burned camp","the guildhouse","the cemetery","a hidden tunnel"],
    relevance: ["suggesting {{revelation}}","matching known monster prints","hinting at {{entity}} activity","leading toward {{subject}}","revealing path to {{location}}","corresponding with earlier findings","confirming movement toward {{revelation}}"]
  },

  magical: {
    object: ["sigil","rune","glyph","charm","aura","illusion","spirit echo","shadow mark","arcane thread","fading ward","curse seal","dream fragment"],
    modifier: ["glowing","faint","unstable","shifting","fractured","ancient","recent","ominous","pulsing","iridescent","whispering","frozen"],
    action: ["radiates","resonates with","anchors","conceals","reveals","echoes","projects","distorts around","rejects","amplifies","binds to","feeds from"],
    detail: ["the relic","a summoning circle","the doorframe","a broken altar","a shattered idol","the cobblestones","the mirror","a pool of water","a cracked gemstone","the old runestone","a magical focus","a statue"],
    relevance: ["connected to {{revelation}}","flaring when {{object}} is near","echoing the presence of {{entity}}","confirming the use of forbidden magic","aligning with divine energy patterns","mirroring visions of {{subject}}","resonating with {{object}}"]
  },

  documentary: {
    object: ["ledger","letter","invoice","permit","record","contract","journal","shipping manifest","decree","petition","archive entry","scroll fragment"],
    modifier: ["old","crumbling","official","stained","sealed","forged","annotated","unsigned","embossed","faded","smudged","freshly written"],
    action: ["mentions","lists","confirms","authenticates","cross-references","questions","records","details","omits","corroborates","links to","attributes"],
    detail: ["in the archives","in a desk drawer","inside a chest","filed at city hall","found in a ledger room","among trade documents","pinned to a notice board","in a courier's bag","among temple scrolls","hidden under ledgers"],
    relevance: ["about {{revelation}}","signed by {{person}}","referring to {{entity}}","bearing {{mark}}","referencing {{object}}","outlining the terms of {{revelation}}","omitting key details about {{subject}}","connecting {{entity}} to {{location}}"]
  }
};

// ============================================================================
// Context Weights
// ============================================================================

const contextWeights = {
  city: { physical: 0.2, social: 0.3, environmental: 0.1, magical: 0.2, documentary: 0.2 },
  travel: { physical: 0.2, social: 0.3, environmental: 0.4, magical: 0.05, documentary: 0.05 },
  dungeon: { physical: 0.3, environmental: 0.3, magical: 0.3, social: 0.05, documentary: 0.05 },
  mixed: { physical: 0.2, social: 0.2, environmental: 0.2, magical: 0.2, documentary: 0.2 }
};

const sceneTypes = {
  city: ["Location", "Person", "Organization", "Event", "Activity"],
  travel: ["Location", "Person", "Event", "Environmental"],
  dungeon: ["Location", "Environmental", "Activity"],
  mixed: ["Location", "Person", "Organization", "Event", "Activity"]
};

// ============================================================================
// Skill Assignment
// ============================================================================

const skillsByCategory = {
  physical: ["Investigation", "Perception"],
  social: ["Insight", "Persuasion", "Intimidation", "Deception"],
  environmental: ["Perception", "Survival", "Nature"],
  magical: ["Arcana", "Religion", "Investigation"],
  documentary: ["Investigation", "History", "Insight"]
};

const dcLevels = {
  obvious: { dc: null, label: "Automatic" },
  easy: { dc: 10, label: "Easy" },
  moderate: { dc: 13, label: "Moderate" },
  hard: { dc: 16, label: "Hard" },
  veryHard: { dc: 19, label: "Very Hard" }
};

// ============================================================================
// Proactive Backup Templates
// ============================================================================

const proactiveBackups = {
  city: {
    combat: "{{antagonist}}'s thugs attack party, carrying {{clue_item}}",
    social: "{{npc}} seeks out party with urgent warning about {{revelation}}",
    event: "{{antagonist}} makes next move: {{escalation}}, creating new crime scene",
    environmental: "Fire/explosion at {{location}} draws attention, reveals {{clue}}"
  },
  travel: {
    combat: "Ambush by {{antagonist}}'s forces on the road",
    environmental: "Weather/natural disaster reveals hidden {{clue}}",
    social: "Fleeing refugee warns party about {{revelation}}",
    event: "Caravan/travelers discuss {{revelation}} around campfire"
  },
  dungeon: {
    combat: "{{antagonist}} sends monsters to eliminate party (carrying evidence)",
    environmental: "Trap triggers, revealing hidden passage with {{clue}}",
    magical: "Ancient ward activates, projects vision of {{revelation}}",
    event: "Dungeon denizens panic and flee, can be intercepted/questioned"
  },
  mixed: {
    combat: "{{antagonist}} confronts party directly (last resort)",
    social: "Ally NPC pieces together clues and seeks out party",
    event: "{{antagonist}}'s plan advances to next stage (new investigation site)",
    environmental: "Cosmic event (eclipse, earthquake) triggers revelation"
  }
};

// ============================================================================
// Clue Builder
// ============================================================================

function buildClue(category, revelation, campaignEntities = {}) {
  const pool = variantPools[category];
  const data = {
    object: rand(pool.object),
    modifier: rand(pool.modifier),
    action: rand(pool.action),
    detail: rand(pool.detail),
    relevance: rand(pool.relevance)
  };

  // Replace tokens with campaign entities or generic fallbacks
  const entities = {
    entity: campaignEntities.factions?.length ? rand(campaignEntities.factions) : rand(["the Brotherhood","the Crimson Hand","the Royal Guild","a forgotten cult"]),
    mark: rand(["a serpent","a crown","a skull","a sunburst","a spider"]),
    symbol: rand(["a burning eye","a broken chain","a blood moon"]),
    person: campaignEntities.npcs?.length ? rand(campaignEntities.npcs) : rand(["Lord Denton","Captain Mira","Archivist Rune"]),
    location: campaignEntities.locations?.length ? rand(campaignEntities.locations) : rand(["the docks","the temple","the forest edge","the city walls"])
  };

  let filledRelevance = data.relevance
    .replace(/{{revelation}}/g, revelation)
    .replace(/{{object}}/g, data.object)
    .replace(/{{subject}}/g, data.object)
    .replace(/{{entity}}/g, entities.entity)
    .replace(/{{mark}}/g, entities.mark)
    .replace(/{{symbol}}/g, entities.symbol)
    .replace(/{{person}}/g, entities.person)
    .replace(/{{location}}/g, entities.location);

  const sentence = capitalize(`a ${data.modifier} ${data.object} ${data.action} ${data.detail}, ${filledRelevance}.`);
  return { category, data, clue: sentence, entities };
}

// ============================================================================
// Strategy Generators
// ============================================================================

function generateStrategyExamples(revelation) {
  return {
    optionA: {
      name: "All Direct (Simple Discovery)",
      progression: `Clue 1 → Revelation, Clue 2 → Revelation, Clue 3 → Revelation`,
      description: "3 independent clues, all point directly to the answer"
    },
    optionB: {
      name: "Mixed Web (Complex Investigation)",
      progression: `Clue 1 → Revelation, Clue 2 → Scene 4 → Revelation, Clue 3 → Revelation`,
      description: "Some clues direct, some lead to intermediate scenes"
    },
    optionC: {
      name: "Chain Structure (Linear Path)",
      progression: `Clue 1 → Scene 4 → Scene 5 → Revelation`,
      description: "Guided progression through connected scenes"
    }
  };
}

// ============================================================================
// DC Assignment
// ============================================================================

function assignDC(category, clueIndex, totalClues, context) {
  // At least one should be easy/automatic
  if (clueIndex === 0) {
    return Math.random() < 0.5 ? 'obvious' : 'easy';
  }

  // Variety in DCs
  const dcOptions = ['easy', 'moderate', 'hard'];
  return rand(dcOptions);
}

// ============================================================================
// Main Generator
// ============================================================================

export function generateRevelationStructure(revelation, clueCount, context, campaignEntities) {
  const categories = Object.keys(variantPools);
  const used = new Set();
  const nodes = [];

  // Ensure variety - no monoclonal pattern
  while (nodes.length < clueCount) {
    const available = categories.filter(c => !used.has(c));
    if (!available.length && used.size < clueCount) {
      // Allow reuse if we need more clues than categories
      used.clear();
      continue;
    }
    if (!available.length) break;

    const category = rand(available);
    used.add(category);

    const clueData = buildClue(category, revelation, campaignEntities);
    const sceneType = rand(sceneTypes[context] || sceneTypes.mixed);
    const dcLevel = assignDC(category, nodes.length, clueCount, context);
    const skill = rand(skillsByCategory[category]);

    nodes.push({
      id: `Node ${nodes.length + 1}`,
      category,
      sceneType,
      clue: clueData.clue,
      skill,
      dcLevel,
      dc: dcLevels[dcLevel].dc,
      dcLabel: dcLevels[dcLevel].label,
      entities: clueData.entities
    });
  }

  return {
    revelation,
    context,
    nodes,
    categoriesUsed: [...used],
    sceneTypes: nodes.map(n => n.sceneType)
  };
}

export { variantPools, contextWeights, proactiveBackups, generateStrategyExamples };
