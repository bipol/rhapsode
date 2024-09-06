import { createContext, useState } from 'react';

export interface Character {
  name: string;
  race: string;
  class: string;
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  skills: string[];
  equipment: string[];
  health: number;
  level: number;
  experience: number;
}

// Character context
export const CharacterContext = createContext<{
  character: Character | undefined;
  loadCharacter: (
    character: Character | ((prev: Character) => Character),
  ) => void;
}>({
  character: undefined,
  loadCharacter: () => {},
});

export const CharacterProvider = ({ children }: { children: any }) => {
  const [character, setCharacter] = useState<Character | undefined>();

  const loadCharacter = (
    character: Character | ((prev: Character) => Character),
  ) => {
    if (typeof character === 'function') {
      setCharacter((prev) => character(prev as Character));
    } else {
      setCharacter(character);
    }
  };

  return (
    <CharacterContext.Provider value={{ character, loadCharacter }}>
      {children}
    </CharacterContext.Provider>
  );
};

export const classes = [
  { id: 'barbarian', name: 'Barbarian' },
  { id: 'bard', name: 'Bard' },
  { id: 'cleric', name: 'Cleric' },
  { id: 'druid', name: 'Druid' },
  { id: 'fighter', name: 'Fighter' },
  { id: 'monk', name: 'Monk' },
  { id: 'paladin', name: 'Paladin' },
  { id: 'ranger', name: 'Ranger' },
  { id: 'rogue', name: 'Rogue' },
  { id: 'sorcerer', name: 'Sorcerer' },
  { id: 'warlock', name: 'Warlock' },
  { id: 'wizard', name: 'Wizard' },
];

export const races = [
  { id: 'human', name: 'Human' },
  { id: 'elf', name: 'Elf' },
  { id: 'dwarf', name: 'Dwarf' },
  { id: 'halfling', name: 'Halfling' },
  { id: 'orc', name: 'Orc' },
  { id: 'gnome', name: 'Gnome' },
  { id: 'tiefling', name: 'Tiefling' },
  { id: 'dragonborn', name: 'Dragonborn' },
  { id: 'half-elf', name: 'Half-Elf' },
  { id: 'half-orc', name: 'Half-Orc' },
];

export const startingEquipment = {
  barbarian: ['Greataxe', 'Two Handaxes', "Explorer's Pack", 'Javelin (x4)'],
  bard: ['Rapier', "Diplomat's Pack", 'Lute', 'Leather Armor', 'Dagger'],
  cleric: ['Mace', 'Shield', 'Scale Mail', 'Holy Symbol', "Adventurer's Pack"],
  druid: ['Quarterstaff', 'Leather Armor', "Explorer's Pack", 'Druidic Focus'],
  fighter: [
    'Chain Mail',
    'Longsword',
    'Shield',
    'Light Crossbow',
    '20 Crossbow Bolts',
    "Dungeoneer's Pack",
  ],
  monk: ['Shortsword', "Dungeoneer's Pack", '10 Darts'],
  paladin: [
    'Longsword',
    'Shield',
    'Chain Mail',
    'Holy Symbol',
    "Explorer's Pack",
  ],
  ranger: [
    'Longbow',
    'Quiver of 20 Arrows',
    'Leather Armor',
    'Two Shortswords',
    "Explorer's Pack",
  ],
  rogue: [
    'Leather Armor',
    'Two Daggers',
    'Shortsword',
    "Thieves' Tools",
    "Burglar's Pack",
  ],
  sorcerer: [
    'Quarterstaff',
    'Component Pouch',
    'Arcane Focus',
    "Explorer's Pack",
    'Dagger',
  ],
  warlock: [
    'Light Crossbow',
    'Arcane Focus',
    'Leather Armor',
    "Dungeoneer's Pack",
    'Dagger',
  ],
  wizard: ['Spellbook', 'Quarterstaff', 'Component Pouch', "Scholar's Pack"],
};

export const startingSkillsAndSpells = {
  barbarian: ['Rage', 'Unarmored Defense'],
  bard: [
    'Bardic Inspiration',
    'Vicious Mockery',
    'Cure Wounds',
    'Charm Person',
  ],
  cleric: ['Cure Wounds', 'Guiding Bolt', 'Bless', 'Sacred Flame'],
  druid: ['Druidcraft', 'Entangle', 'Cure Wounds', 'Thunderwave'],
  fighter: ['Second Wind', 'Fighting Style (Choose One)'],
  monk: ['Martial Arts', 'Unarmored Defense'],
  paladin: ['Divine Sense', 'Lay on Hands'],
  ranger: ['Favored Enemy', 'Natural Explorer'],
  rogue: ['Sneak Attack', "Thieves' Cant"],
  sorcerer: ['Fire Bolt', 'Mage Armor', 'Magic Missile', 'Shield'],
  warlock: ['Eldritch Blast', 'Hex', 'Armor of Agathys'],
  wizard: ['Mage Hand', 'Fire Bolt', 'Magic Missile', 'Shield'],
};
