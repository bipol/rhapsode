'use client';

import App from '../components/App';
import { CharacterProvider } from '../components/context';

export default function Home() {
  return (
    <CharacterProvider>
      <App />
    </CharacterProvider>
  );
}
