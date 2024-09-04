'use client';

import { DailyVoiceClient } from 'realtime-ai-daily';
import { VoiceClientAudio, VoiceClientProvider } from 'realtime-ai-react';
import App from '../components/App';
import { CharacterProvider, CharacterContext } from '../components/context';

export default function Home() {
  return (
    <CharacterProvider>
      <App />
    </CharacterProvider>
  );
}
