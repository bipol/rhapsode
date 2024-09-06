import { useState } from 'react';

// This should be a free text field and a button that can load a base64 encoded
// json blob, that we can render to give us the prompt, character, and transcript
// from a previous session
export default function LoadCampaign({
  loadCharacter,
  setPrompt,
  setImageUrl,
}) {
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
      const json = decodeURIComponent(escape(atob(data)));
      const { transcript, character, prompt, imageUrl } = JSON.parse(json);
      loadCharacter(character);
      setImageUrl(imageUrl);
      const newPrompt = `
    You are the Dungeon Master. Here's the current game status:

    Character: ${character.name}, a ${character.race} ${character.class} with stats: 
    ${JSON.stringify(character.stats)}.

    The character's equipment: ${character.equipment.join(', ')}.

    Here's the current transcript of the game:
    ${transcript.map((entry) => `${entry.type}: ${entry.text}`).join('\n')}

    Here is the previous prompt:
    ${prompt}

    Continue the adventure from here. You do not need to preface your statements with "Dungeon Master" or "Player". Just type what you want to say.
    `;
      setPrompt(newPrompt);
      console.log('Loaded campaign');
    };
    reader.readAsText(file);
  }

  const buttonStyles =
    'bg-rsGold text-rsText font-rsFont px-4 py-2 border-4 border-rsBorder rounded-rs shadow-rsGlow hover:shadow-lg active:shadow-sm';
  const inputStyles =
    'bg-gray-900 text-rsText border-4 border-rsGold rounded-rs p-2 text-center font-rsFont shadow-md focus:outline-none focus:ring-2 focus:ring-rsGold';

  return (
    <div className="max-w-lg mx-auto p-6 bg-rsBackground rounded-lg shadow-lg mt-10">
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl font-rsFont mb-6 text-center text-rsGold">
          Load Campaign
        </h1>
        <input type="file" className={inputStyles} onChange={handleChange} />
        <button type="submit" className={buttonStyles}>
          Load
        </button>
      </form>
    </div>
  );
}
