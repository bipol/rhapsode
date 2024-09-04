import React from 'react';

const Header = ({ character }) => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{character.name}</h1>
          <p className="text-sm text-gray-400">
            {character.race} {character.class}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm uppercase font-semibold text-gray-300">
            Health
          </p>
          <p className="text-xl font-bold">{character.health}</p>
        </div>
        {/* Character stats */}
        <div className="flex space-x-6">
          {Object.entries(character.stats).map(([statName, statValue]) => (
            <div key={statName} className="text-center">
              <p className="text-sm uppercase font-semibold text-gray-300">
                {statName}
              </p>
              <p className="text-xl font-bold">{statValue}</p>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
