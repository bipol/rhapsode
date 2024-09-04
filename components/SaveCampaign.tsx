// This component will provide a button that can save the current state of the campaign to a base64 encoded json blob. This will include the prompt, character, and transcript from the current session.
export default function SaveCampaign({
  character,
  transcript,
  prompt,
  onComplete,
}) {
  function handleSave() {
    const data = JSON.stringify({ character, transcript, prompt });
    const json = btoa(data);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // date - character name
    const fileName = `${new Date().toISOString()}-${character.name}.json`;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    onComplete();
  }

  const buttonStyles =
    'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200';
  return (
    <button className={buttonStyles} onClick={handleSave}>
      Save
    </button>
  );
}
