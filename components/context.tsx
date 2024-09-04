import { createContext, useState, useContext } from 'react';

interface Character {
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
}

// Character context
export const CharacterContext = createContext<{
  character: Character | null;
  loadCharacter: (character: Character) => void;
}>({
  character: null,
  loadCharacter: () => {},
});

export const CharacterProvider = ({ children }) => {
  const [character, setCharacter] = useState(null);

  const loadCharacter = (newCharacter) => {
    setCharacter(newCharacter);
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
