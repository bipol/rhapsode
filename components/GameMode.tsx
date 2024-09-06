import { useState, useEffect, useCallback } from 'react';
import {
  useVoiceClient,
  useVoiceClientEvent,
  useVoiceClientTransportState,
} from 'realtime-ai-react';
import Transcript from './Transcript';
import Header from './Header';
import { VoiceEvent } from 'realtime-ai';
import EquipmentList from './Equipment';
import SaveCampaign from './SaveCampaign';
import SpellList from './Spells';
import DiceRoll from './DiceRoll';
import { Character } from './context';

const status_text = {
  idle: '',
  initializing: 'Initializing...',
  initialized: 'Start',
  authenticating: 'Requesting bot...',
  connecting: 'Connecting...',
};

export default function GameMode({
  character,
  loadCharacter,
  prompt,
  diceRolls,
  setDiceRolls,
  imageUrl,
  loadingImage,
}: {
  character: Character;
  loadCharacter: any;
  prompt: string;
  diceRolls: any;
  setDiceRolls: any;
  imageUrl: any;
  loadingImage: boolean;
}) {
  const [transcript, setTranscript] = useState<
    { type: string; text: string }[]
  >([]);
  const [appState, setAppState] = useState('idle'); // ['idle', 'listening', 'processing'
  const [muted, setMuted] = useState(false);
  const transportState = useVoiceClientTransportState();
  const voiceClient = useVoiceClient();

  useVoiceClientEvent(
    VoiceEvent.BotTranscript,
    useCallback((text: string) => {
      setTranscript((prev) => [...prev, { type: 'Dungeon Master', text }]);
    }, []),
  );

  useVoiceClientEvent(
    VoiceEvent.UserTranscript,
    useCallback((data: { final: boolean; text: string }) => {
      if (data.final) {
        setTranscript((prev) => {
          // remove duplicates
          prev = prev.filter((t) => t.text !== data.text);
          return [...prev, { type: character.name, text: data.text }];
        });
      }
    }, []),
  );

  useEffect(() => {
    // Update app state based on voice client transport state.
    // We only need a subset of states to determine the ui state,
    // so this effect helps avoid excess inline conditionals.
    switch (transportState) {
      case 'initialized':
        setAppState('ready');
        break;
      case 'authenticating':
      case 'connecting':
        setAppState('connecting');
        break;
      case 'connected':
      case 'ready':
        setAppState('connected');
        break;
      default:
        setAppState('idle');
    }
  }, [transportState]);

  const isReady = appState === 'ready';

  const buttonStyles =
    'bg-rsGold text-rsText font-rsFont px-4 py-2 border-4 border-rsBorder rounded-rs shadow-rsGlow hover:shadow-lg active:shadow-sm';

  function toggleMute() {
    voiceClient?.enableMic(muted);
    setMuted(!muted);
  }

  async function handleStart() {
    await voiceClient?.start();
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header character={character} />
      <SaveCampaign
        character={character}
        transcript={transcript}
        prompt={prompt}
        imageUrl={imageUrl}
        onComplete={() => {}}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex flex-row space-x-4">
            <EquipmentList equipment={character.equipment} />
            <SpellList spells={character.skills} />
            <DiceRoll diceRolls={diceRolls} setDiceRolls={setDiceRolls} />{' '}
            {(imageUrl.imageUrl || loadingImage) && (
              <div className="bg-rsPanel border-rsGold border-4 p-4 shadow-md rounded-rs">
                <div className="flex-col justify-center">
                  <h1 className="text-2xl font-rsFont mb-6 text-center text-rsGold">
                    {loadingImage && (
                      <div className="flex justify-center text-center">
                        <img
                          src="/skull.gif"
                          alt="spinning skull"
                          className="w-16 h-16"
                        />
                        'Thinking...'
                        <img
                          src="/skull.gif"
                          alt="spinning skull"
                          className="w-16 h-16"
                        />
                      </div>
                    )}
                    {imageUrl.title}
                  </h1>
                  {imageUrl.imageUrl && (
                    <img
                      src={imageUrl.imageUrl}
                      alt={imageUrl.title}
                      className="mt-4 border-4 border-rsGold rounded-md w-full max-w-lg"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          {transcript.length > 0 && <Transcript transcript={transcript} />}
        </div>
        {appState === 'idle' && (
          <div className="flex justify-center text-center">
            <button onClick={handleStart} className={buttonStyles}>
              Begin your journey
            </button>
          </div>
        )}
        {status_text[transportState as keyof typeof status_text]}
        <div className="flex justify-center text-center">
          <button
            onClick={toggleMute}
            className={`bg-rsGold text-rsText font-rsFont border-4 border-rsBorder rounded-rs px-4 py-2 mt-4 
        hover:bg-rsPanel hover:text-rsGold hover:shadow-rsGlow transition-all duration-150 ease-in-out
        ${muted ? 'bg-red-500' : 'bg-green-500'}`}
          >
            <div>
              <img
                src={muted ? '/spinning-skull.gif' : '/skull_chattering.gif'}
                alt={muted ? 'Microphone is muted' : 'Microphone is unmuted'}
                className="w-16 h-16"
              />
              <p>{muted ? 'Unmute' : 'Mute'}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
