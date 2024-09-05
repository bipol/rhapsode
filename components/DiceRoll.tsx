import React, { useState } from 'react';

export default function DiceRoll({ diceRolls, setDiceRolls }) {
  // if clicked, we remove the dice roll
  const removeDiceRoll = (index) => {
    // remove this specific index from the array
    const newDiceRolls = diceRolls.filter((_, i) => i !== index);
    setDiceRolls(newDiceRolls);
  };
  return (
    (diceRolls.length > 0 && (
      <div className="bg-rsPanel border-rsGold border-4 shadow-md rounded-rs mb-4">
        {diceRolls.map(([type, value], index) => (
          <div
            className="px-4 py-5 border-b border-rsGold"
            key={index}
            onClick={() => removeDiceRoll(index)}
          >
            <DiceFace type={type} value={value} />
            <p className="text-sm mt-2 text-center text-rsGold font-rsFont">
              {type}: {value}
            </p>
          </div>
        ))}
      </div>
    )) || <div></div>
  );
}

// Helper component to render a styled dice face
function DiceFace({ type, value }) {
  const diceStyles = {
    d6: 'bg-red-500 text-white',
    d20: 'bg-blue-500 text-white',
    d10: 'bg-green-500 text-white',
    d8: 'bg-purple-500 text-white',
    d4: 'bg-orange-500 text-white',
    // Add other dice types if needed
  };

  // Set default dice color or style based on dice type
  const diceStyle = diceStyles[type] || 'bg-gray-500 text-white';

  return (
    <div
      className={`dice-face ${diceStyle} w-16 h-16 flex items-center justify-center rounded-md shadow-lg`}
    >
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}
