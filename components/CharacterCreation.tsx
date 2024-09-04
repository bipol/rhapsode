import { useState } from 'react';
import { classes, races } from './context';
import { CubeIcon } from '@heroicons/react/20/solid';

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
  health: number;
  level: number;
  experience: number;
}

export default function CharacterCreation({ onComplete }) {
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [character, setCharacter] = useState({
    name: '',
    race: '',
    class: '',
    stats: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    skills: [],
    equipment: [],
    health: 10,
    level: 1,
    experience: 0,
  });

  const nextStep = () => {
    if (step === 1 && !validateStep1()) {
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const validateStep1 = () => {
    const newErrors = {};

    if (!character.name) {
      newErrors.name = 'Character name is required';
    }
    if (!character.race) {
      newErrors.race = 'Please select a race';
    }
    if (!character.class) {
      newErrors.class = 'Please select a class';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCharacter({ ...character, [name]: value });
  };

  const handleStatChange = (stat, value) => {
    // if constitution is changed, update health
    setCharacter((prev) => {
      let health = prev.health;
      if (stat === 'constitution') {
        health = value * 2;
      }
      return {
        ...prev,
        stats: {
          ...prev.stats,
          [stat]: value,
        },
        health,
      };
    });
  };

  const handleStatRoll = (stat) => {
    const roll = rollDice(6, 4); // Roll a D6 four times and sum the results
    handleStatChange(stat, roll);
  };

  // Dice rolling function (D6 rolling 4 times, keep the top 3 rolls)
  const rollDice = (sides, rolls) => {
    let result = [];
    for (let i = 0; i < rolls; i++) {
      result.push(Math.floor(Math.random() * sides) + 1);
    }
    result.sort((a, b) => b - a); // Sort rolls in descending order
    return result.slice(0, 3).reduce((a, b) => a + b, 0); // Sum top 3 rolls
  };

  const completeCharacterCreation = () => {
    console.log('Character created:', character);
    onComplete(character);
  };

  const buttonStyles =
    'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200';
  const inputStyles = 'w-full p-2 border border-gray-300 rounded mt-1 mb-4';

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Create Your Character
      </h1>
      {step === 1 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Step 1: Race, Class, Name
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Character Name
            </label>
            <input
              type="text"
              name="name"
              value={character.name}
              onChange={handleInputChange}
              className={`mt-1 p-2 border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } rounded w-full`}
              placeholder="Enter character name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Select Race
            </label>
            <select
              name="race"
              value={character.race}
              onChange={handleInputChange}
              className={`mt-1 p-2 border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } rounded w-full`}
            >
              <option value="">-- Select a Race --</option>
              {races.map((race) => (
                <option key={race.id} value={race.id}>
                  {race.name}
                </option>
              ))}
            </select>
            {errors.race && (
              <p className="text-red-500 text-sm mt-1">{errors.race}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Select Class
            </label>
            <select
              name="class"
              value={character.class}
              onChange={handleInputChange}
              className={`mt-1 p-2 border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } rounded w-full`}
            >
              <option value="">-- Select a Class --</option>
              {classes.map((classOption) => (
                <option key={classOption.id} value={classOption.id}>
                  {classOption.name}
                </option>
              ))}
            </select>
            {errors.class && (
              <p className="text-red-500 text-sm mt-1">{errors.class}</p>
            )}
          </div>
          <div className="flex justify-between">
            <button
              disabled
              className="px-4 py-2 bg-gray-300 text-white rounded cursor-not-allowed"
            >
              Back
            </button>
            <button onClick={nextStep} className={buttonStyles}>
              Next
            </button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Step 2: Assign Stats</h2>
          {Object.keys(character.stats).map((stat) => (
            <div key={stat} className="flex items-center mb-4">
              <label className="w-32 text-sm font-medium text-gray-700">
                {stat.charAt(0).toUpperCase() + stat.slice(1)}
              </label>
              <input
                type="number"
                value={character.stats[stat]}
                name={stat}
                className="p-2 border border-gray-300 rounded w-20 mr-4"
                disabled
              />
              <button
                onClick={() => handleStatRoll(stat)}
                className="text-blue-600 hover:text-blue-800"
              >
                <CubeIcon className="h-6 w-6" />
              </button>
            </div>
          ))}
          <div className="flex justify-between">
            <button onClick={prevStep} className={buttonStyles}>
              Back
            </button>
            <button onClick={nextStep} className={buttonStyles}>
              Next
            </button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Step 3: Select Skills</h2>
          {/* Add skill selection here */}
          <div className="flex justify-between">
            <button onClick={prevStep} className={buttonStyles}>
              Back
            </button>
            <button
              onClick={completeCharacterCreation}
              className={buttonStyles}
            >
              Finish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
