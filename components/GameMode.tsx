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

const status_text = {
  idle: 'Initializing...',
  initializing: 'Initializing...',
  initialized: 'Start',
  authenticating: 'Requesting bot...',
  connecting: 'Connecting...',
};

export default function GameMode({ character, loadCharacter, prompt }) {
  const [transcript, setTranscript] = useState([]);
  const [appState, setAppState] = useState('idle'); // ['idle', 'listening', 'processing'
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
    useCallback((data) => {
      if (data.final) {
        setTranscript((prev) => {
          // remove duplicates
          prev.filter((t) => t.text !== data.text);
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

  async function handleStart() {
    await voiceClient.start();
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header character={character} />
      <SaveCampaign
        character={character}
        transcript={transcript}
        prompt=""
        onComplete={() => {}}
      />
      <div className="flex-1 overflow-y-auto mt-20">
        {appState === 'idle' && (
          <button
            onClick={handleStart}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Start Game
          </button>
        )}
        {status_text[transportState as keyof typeof status_text]}
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex-row">
            <EquipmentList equipment={character.equipment} />
            <SpellList spells={character.skills} />
          </div>
          {transcript.length > 0 && <Transcript transcript={transcript} />}
        </div>
      </div>
    </div>
  );
}
