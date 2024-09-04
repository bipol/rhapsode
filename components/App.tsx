import { CharacterContext } from './context';
import { useContext, useState, useEffect } from 'react';
import CharacterCreation from './CharacterCreation';
import GameMode from './GameMode';
import { DailyVoiceClient } from 'realtime-ai-daily';
import { VoiceClientAudio, VoiceClientProvider } from 'realtime-ai-react';
import { LLMHelper, FunctionCallParams } from 'realtime-ai';
import LoadCampaign from './LoadCampaign';

export default function App() {
  const { character, loadCharacter } = useContext(CharacterContext);
  const [voiceClient, setVoiceClient] = useState(null); // State to store voiceClient
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    if (character && !voiceClient) {
      const currentPrompt =
        prompt ??
        `You are a dungeon master. A player has created the following character:
  Name: ${character.name}
  Race: ${character.race}
  Class: ${character.class}
  Stats: ${JSON.stringify(character.stats, null, 2)}
  Equipment: ${character.equipment.join(', ')}
  Health: ${character.health}

  Run the adventure "Descent into Avernus" with this character. Respond as an expert Dungeon Master, like Critical Role. Be concise and clear, but also creative. Be an engaging storyteller, using your voice to bring the adventure to life. Keep in mind that this will be a collaborative storytelling experience. The player will be able to interact with the story and make decisions. You will need to respond to the player's actions and choices. The text you produce will be read aloud, so do not write anything that could be mispronounced, such as symbols. This will be a theater of mind kind of experience, because we will not have a battle map presented. You must keep track of the players experience, and increment their level when it is the correct time to do it. Add experience to the player as they succeed on tasks, as a dungeon master would do. Begin by describing the scene. You do not need to describe the player's character, as they will do that themselves. You may roll on behalf of the character, using their stats and the Dungeon and Dragons ruleset to determine the outcome of the roll. Begin by looking at the characters class, and adding starter gear as well as starter skills (spells) if needed.`;
      const vc = new DailyVoiceClient({
        baseUrl: '/api',
        enableMic: true,
        enableCam: false,
        services: {
          stt: 'deepgram',
          tts: 'cartesia',
          llm: 'anthropic',
        },
        config: [
          {
            service: 'vad',
            options: [
              {
                name: 'params',
                value: {
                  stop_secs: 0.3,
                },
              },
            ],
          },
          {
            service: 'tts',
            options: [
              {
                name: 'voice',
                value: '79a125e8-cd45-4c13-8a67-188112f4dd22',
              },
              {
                name: 'model',
                value: 'sonic-english',
              },
              {
                name: 'language',
                value: 'en',
              },
            ],
          },
          {
            service: 'llm',
            options: [
              {
                name: 'model',
                value: 'claude-3-5-sonnet-20240620',
              },
              {
                name: 'initial_messages',
                value: [
                  {
                    role: 'user',
                    content: [
                      {
                        type: 'text',
                        text: currentPrompt,
                      },
                    ],
                  },
                ],
              },
              {
                name: 'run_on_config',
                value: true,
              },
              {
                name: 'tools',
                value: [
                  {
                    name: 'change_health',
                    description:
                      'As a dungeon master, you will sometimes need to remove or add health to the character. This function changes the characters health to this number.',
                    input_schema: {
                      type: 'object',
                      properties: {
                        new_health: {
                          type: 'number',
                          description: "The player's new health value.",
                        },
                      },
                      required: ['new_health'],
                    },
                  },
                  {
                    name: 'add_skills',
                    description:
                      'As a dungeon master, you will sometimes need to add skills to the character. This function adds the skills to the character. Skills may also be spells.',
                    input_schema: {
                      type: 'object',
                      properties: {
                        skills: {
                          type: 'array',
                          items: {
                            type: 'string',
                          },
                          description:
                            "A description of the skills to add to the character's skills.",
                        },
                      },
                      required: ['skills'],
                    },
                  },
                  {
                    name: 'change_level',
                    description:
                      'As a dungeon master, you will sometimes need to remove or add level to the character. This function changes the characters level to this number.',
                    input_schema: {
                      type: 'object',
                      properties: {
                        new_level: {
                          type: 'number',
                          description: "The player's new level.",
                        },
                      },
                      required: ['new_level'],
                    },
                  },
                  {
                    name: 'change_experience',
                    description:
                      'As a dungeon master, you will sometimes need to remove or add experience to the character. This function changes the characters experience to this number.',
                    input_schema: {
                      type: 'object',
                      properties: {
                        new_experience: {
                          type: 'number',
                          description: "The player's new experience value.",
                        },
                      },
                      required: ['new_experience'],
                    },
                  },
                  {
                    name: 'add_equipment',
                    description:
                      'As a dungeon master, you will sometimes need to add equipment to the character. This function adds the equipment to the character.',
                    input_schema: {
                      type: 'object',
                      properties: {
                        items: {
                          type: 'array',
                          items: {
                            type: 'string',
                          },
                          description:
                            "A description of the items to add to the character's equipment.",
                        },
                      },
                      required: ['items'],
                    },
                  },
                  {
                    name: 'remove_equipment',
                    description:
                      'As a dungeon master, you will sometimes need to remove equipment from the character. This function removes the equipment from the character.',
                    input_schema: {
                      type: 'object',
                      properties: {
                        item: {
                          type: 'string',
                          description:
                            "A description of the item to remove from the character's equipment.",
                        },
                      },
                      required: ['item'],
                    },
                  },
                ],
              },
            ],
          },
          {
            service: 'stt',
            options: [
              {
                name: 'model',
                value: 'nova-2-conversationalai',
              },
              {
                name: 'language',
                value: 'en',
              },
            ],
          },
        ],
        callbacks: {
          onBotReady: () => {
            console.log('Bot is ready!');
            setBotState('ready');
          },
        },
      });
      const llmHelper = new LLMHelper({
        callbacks: {
          onLLMFunctionCall: (fn) => {},
        },
      });
      console.log('Registering LLM helper');
      vc.registerHelper('llm', llmHelper);

      llmHelper.handleFunctionCall(async (fn: FunctionCallParams) => {
        console.log('Function call', fn);
        const args = fn.arguments as any;
        if (fn.functionName === 'change_health' && args.new_health) {
          loadCharacter((prev) => ({ ...prev, health: args.new_health }));
        }
        if (fn.functionName === 'add_equipment' && args.items) {
          loadCharacter((prev) => ({
            ...prev,
            equipment: [...prev.equipment, ...args.items],
          }));
        }
        if (fn.functionName === 'remove_equipment' && args.item) {
          prev.equipment = prev.equipment.filter((item) => item !== args.item);
          loadCharacter((prev) => ({
            ...prev,
          }));
        }
        if (fn.functionName === 'change_level' && args.new_level) {
          loadCharacter((prev) => ({ ...prev, level: args.new_level }));
        }
        if (fn.functionName === 'change_experience' && args.new_experience) {
          loadCharacter((prev) => ({
            ...prev,
            experience: args.new_experience,
          }));
        }
        if (fn.functionName === 'add_skills' && args.skills) {
          loadCharacter((prev) => ({
            ...prev,
            skills: [...prev.skills, ...args.skills],
          }));
        }
        return {
          status: 'success',
        };
      });

      setVoiceClient(vc);
      setPrompt(prompt);
    }
  }, [character, voiceClient]); // Only run this when the character changes

  return (
    <div className="min-h-screen flex items-center justify-center">
      {!character ? (
        // Render character creation if no character is set
        <div>
          <CharacterCreation onComplete={loadCharacter} />
          <LoadCampaign loadCharacter={loadCharacter} setPrompt={setPrompt} />
        </div>
      ) : (
        // Render game mode if the character is created
        <VoiceClientProvider voiceClient={voiceClient}>
          <GameMode
            character={character}
            loadCharacter={loadCharacter}
            prompt={prompt}
          />
          <VoiceClientAudio />
        </VoiceClientProvider>
      )}
    </div>
  );
}
