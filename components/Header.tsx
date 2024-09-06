import React from 'react';
import { Character } from './context';

const Header = ({ character }: { character: Character }) => {
  return (
    <header className="bg-gray-800 text-rsText p-4 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-rsFont">{character.name}</h1>
          <p className="text-sm text-rsText font-rsFont">
            {character.race} {character.class}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm uppercase text-rsGold font-rsFont">Health</p>
          <p className="text-xl font-bold">{character.health}</p>
        </div>
        {/* Character stats */}
        <div className="flex space-x-6">
          {Object.entries(character.stats).map(([statName, statValue]) => (
            <div key={statName} className="text-center">
              <p className="text-sm uppercase text-rsGold font-rsFont">
                {statName}
              </p>
              <p className="text-xl font-rsFont">{statValue}</p>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
