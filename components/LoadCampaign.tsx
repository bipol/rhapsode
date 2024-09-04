import { useState } from 'react';

// This should be a free text field and a button that can load a base64 encoded
// json blob, that we can render to give us the prompt, character, and transcript
// from a previous session
export default function LoadCampaign({ loadCharacter, setPrompt }) {
  const [file, setFile] = useState();

  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  function handleSubmit(event) {
    event.preventDefault();
    // read the file, base 64 decode, parse the json, and set the state
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const json = atob(data);
      const { transcript, character, prompt } = JSON.parse(json);
      loadCharacter(character);
      const newPrompt = `
    You are the Dungeon Master. Here's the current game status:

    Character: ${character.name}, a ${character.race} ${character.class} with stats: 
    ${JSON.stringify(character.stats)}.

    The character's equipment: ${character.equipment.join(', ')}.

    Here's the current transcript of the game:
    ${transcript.map((entry) => `${entry.type}: ${entry.text}`).join('\n')}

    Here is the previous prompt:
    ${prompt}

    Continue the adventure from here.
    `;
      setPrompt(newPrompt);
      console.log('Loaded campaign');
    };
    reader.readAsText(file);
  }

  const buttonStyles =
    'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200';
  const inputStyles = 'w-full p-2 border border-gray-300 rounded mt-1 mb-4';

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-6 text-center">Load Campaign</h1>
        <input type="file" className={inputStyles} onChange={handleChange} />
        <button type="submit" className={buttonStyles}>
          Load
        </button>
      </form>
    </div>
  );
}
