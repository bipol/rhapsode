import { CharacterContext, Character } from './context';
import { useContext, useState, useEffect } from 'react';
import CharacterCreation from './CharacterCreation';
import GameMode from './GameMode';
import { DailyVoiceClient } from 'realtime-ai-daily';
import { VoiceClientAudio, VoiceClientProvider } from 'realtime-ai-react';
import { LLMHelper, FunctionCallParams } from 'realtime-ai';
import LoadCampaign from './LoadCampaign';

export default function App() {
  const { character, loadCharacter } = useContext(CharacterContext);
  const [voiceClient, setVoiceClient] = useState<DailyVoiceClient | null>(null); // State to store voiceClient
  const [prompt, setPrompt] = useState('');
  const [diceRolls, setDiceRolls] = useState<Array<Array<string | number>>>([]); // State to store dice rolls
  const [imageUrl, setImageUrl] = useState({});

  useEffect(() => {
    if (character && !voiceClient) {
      const currentPrompt =
        prompt === ''
          ? `You are a dungeon master. A player has created the following character:
  Name: ${character.name}
  Race: ${character.race}
  Class: ${character.class}
  Stats: ${JSON.stringify(character.stats, null, 2)}
  Equipment: ${character.equipment.join(', ')}
  Health: ${character.health}
  Level: ${character.level}
  Experience: ${character.experience}
  Skills: ${character.skills.join(', ')}

  Run a novel d&d adventure with this character. Respond as an expert Dungeon Master, like Critical Role. Be concise and clear, but also creative. Be an engaging storyteller, but use short punchy sentences to keep the player in the driving seat. Do not complement the player as that is unneeded, keep the story moving. The player will be able to interact with the story and make decisions. You will need to respond to the player's actions and choices. The text you produce will be read aloud, so do not write anything that could be mispronounced, such as symbols. This will be a theater of mind kind of experience, because we will not have a battle map presented. You must keep track of the players experience, and increment their level when it is the correct time to do it. Add experience to the player as they succeed on tasks, as a dungeon master would do. Begin by describing the scene. You do not need to describe the player's character, as they will do that themselves. You may roll on behalf of the character, using their stats and the Dungeon and Dragons ruleset to determine the outcome of the roll. Be very brief when describing how the rolls are made. Do not describe long lists, or be overly wordy. Keep the story moving forward. If the player is in combat, keep the descriptions short. Use the generate image function to generate character portraits for NPCs or other pieces of the setting. Generate an image whenever the character meets someone new, or enters a new area. It's very important to generate images to keep things interesting. You do not need to write out that you are generating an image. Do not emote with *, but instead, just describe the sound or make the sound using onomatopoeia. Do not use modern terms or concepts, as this is a fantasy setting. Do not use modern slang or references. Do not use modern technology or concepts. Do not say "Generate image". Do not make decisions for the player, but ask them what they would like to do. Very long winded passages can be boring for the player, if they do not feel that they can contribute.

Here are some guidelines on how to generate the text, as this will be read by a TTS provider:
Add punctuation where appropriate and at the end of each transcript whenever possible.
To insert pauses, insert “-” where you need the pause.
Use continuations if generating audio that should sound contiguous in separate chunks.
To emphasize a question, using double question marks instead of a single one can help. (i.e. “Are you here??” vs. “Are you here?”)
Avoid using quotation marks in your input text unless you intend to refer to a quote.

Begin by describing the scene.
        `
          : prompt;

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
                  stop_secs: 1.0,
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
                    name: 'roll_dice',
                    description:
                      'As a dungeon master, you will sometimes need to roll dice to determine the outcome of an action. This function rolls a dice with the specified number of sides. You can use this function to determine the outcome of an action, such as an attack or a skill check. You would take the result of this function, and compare it to the difficulty of the action to determine if the action is successful. You will need to add the player characters stats to the result of this function to determine the final result. You may need to execute this function multiple times to get the total amount of rolls required. This will return an array of the results of the dice rolls.',
                    input_schema: {
                      type: 'object',
                      properties: {
                        dice_side_count: {
                          type: 'number',
                          description:
                            "The number of sides on the dice to roll. For example, if you're rolling a 20-sided dice, this value would be 20.",
                        },
                        roll_count: {
                          type: 'number',
                          description:
                            'The number of times to roll the dice. For example, if you want to roll the dice twice, this value would be 2.',
                        },
                      },
                      required: ['dice_side_count', 'roll_count'],
                    },
                  },
                  {
                    name: 'get_character_state',
                    description:
                      'As a dungeon master, you will sometimes need to get the current state of the character. This function returns the current state of the character. You can use this to see the players current skills, items, level, health, or any other character information.',
                    input_schema: {
                      type: 'object',
                      properties: {
                        character_name: {
                          type: 'string',
                          description: "The character's name.",
                        },
                      },
                      required: ['character_name'],
                    },
                  },
                  {
                    name: 'change_health',
                    description:
                      'As a dungeon master, you will sometimes need to remove or add health to the character. This function changes the characters health to this number. You should use this function when the character takes damage or heals.',
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
                      'As a dungeon master, you will sometimes need to remove or add level to the character. This function changes the characters level to this number. When a character gains enough experience, you should increment the level. You should reset the experience to 0 when the player levels up.',
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
                      'As a dungeon master, you will sometimes need to remove or add experience to the character. This function changes the characters experience to this number. You should increment the experience as the player succeeds on tasks. You should reset the experience to 0 when the player levels up.',
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
                      'As a dungeon master, you will sometimes need to add equipment to the character. This function adds the equipment to the character. If a character finds an item, you should use this function to add the item to the character. If a character buys an item, you should use this function to add the item to the character.',
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
                    name: 'generate_image',
                    description:
                      'As a dungeon master, you will sometimes need to generate an image to show the player, an npc, or an item. This function generates an image based on the input parameters. You can use this function to show the player a map, a character portrait, or any other image you need to show the player. Use this as needed to add flair to a scene. The prompt must include text that will generate an image in the fantasy style, so avoid using modern terms or concepts. The image should be fantasy inspired in style. You should generate images whenever a new character is met, or a new area is entered. This will help to keep the game interesting and engaging.',
                    input_schema: {
                      type: 'object',
                      properties: {
                        image_prompt: {
                          type: 'string',
                          description:
                            'A description of the image to generate. This can be a description of a character, a map, or any other image you need to show the player. It should be a short description of the image, and always try to generate images that are fantasy inspired in style.',
                        },
                        title: {
                          type: 'string',
                          description:
                            'A title for the image. This will be displayed above the image. It could be a name of the character, or the name of the place. This should often be a noun or pronoun.',
                        },
                      },
                      required: ['image_prompt', 'title'],
                    },
                  },
                  {
                    name: 'remove_equipment',
                    description:
                      'As a dungeon master, you will sometimes need to remove equipment from the character. This function removes the equipment from the character. You should use this if an item is used during the game, or if the character sells an item.',
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
          },
        },
      });
      const llmHelper = new LLMHelper({
        callbacks: {
          onLLMFunctionCall: (fn: any) => {},
        },
      });
      console.log('Registering LLM helper');
      vc.registerHelper('llm', llmHelper);

      llmHelper.handleFunctionCall(async (fn: FunctionCallParams) => {
        console.log('Function call', fn);
        const args = fn.arguments as any;
        if (fn.functionName === 'change_health' && args.new_health) {
          loadCharacter((prev: Character) => ({
            ...prev,
            health: args.new_health as number,
          }));
        }
        if (fn.functionName === 'add_equipment' && args.items) {
          loadCharacter((prev: Character) => ({
            ...prev,
            equipment: [...prev.equipment, ...args.items],
          }));
        }
        if (fn.functionName === 'remove_equipment' && args.item) {
          loadCharacter((prev: Character) => {
            prev.equipment = prev.equipment.filter(
              (item) => item !== args.item,
            );
            return {
              ...prev,
            };
          });
        }
        if (fn.functionName === 'change_level' && args.new_level) {
          loadCharacter((prev: Character) => ({
            ...prev,
            level: args.new_level,
          }));
        }
        if (fn.functionName === 'change_experience' && args.new_experience) {
          loadCharacter((prev: Character) => ({
            ...prev,
            experience: args.new_experience,
          }));
        }
        if (fn.functionName === 'add_skills' && args.skills) {
          loadCharacter((prev: Character) => ({
            ...prev,
            skills: [...prev.skills, ...args.skills],
          }));
        }
        if (fn.functionName === 'get_character_state') {
          return {
            status: 'success',
            character,
          };
        }
        if (
          fn.functionName === 'roll_dice' &&
          args.dice_side_count &&
          args.roll_count
        ) {
          const rolls: number[] = [];
          for (let i = 0; i < args.roll_count; i++) {
            rolls.push(Math.floor(Math.random() * args.dice_side_count) + 1);
          }
          // rolls should be the type, value
          const diceType = `d${args.dice_side_count}`;
          setDiceRolls((prev: any) => [...rolls.map((r) => [diceType, r])]);
          return {
            status: 'success',
            rolls,
          };
        }
        if (fn.functionName === 'generate_image' && args.image_prompt) {
          console.log('Generating image', args.image_prompt);
          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: args.image_prompt }),
          });

          const data = await response.json();

          if (response.ok) {
            const image = { imageUrl: data.imageUrl, title: args.title };
            setImageUrl(image);
          } else {
            console.error(data);
          }
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
    <div className="min-h-screen flex-col items-center justify-center">
      {!character ? (
        <div>
          <CharacterCreation onComplete={loadCharacter} />
          <LoadCampaign
            loadCharacter={loadCharacter}
            setPrompt={setPrompt}
            setImageUrl={setImageUrl}
          />
        </div>
      ) : (
        voiceClient && (
          // Render game mode if the character is created
          <VoiceClientProvider voiceClient={voiceClient}>
            <GameMode
              character={character}
              loadCharacter={loadCharacter}
              prompt={prompt}
              diceRolls={diceRolls}
              setDiceRolls={setDiceRolls}
              imageUrl={imageUrl}
            />
            <VoiceClientAudio />
          </VoiceClientProvider>
        )
      )}
      <div className="bg-rsPanel border-rsGold border-4 p-4 rounded-rs shadow-md max-w-md mx-auto">
        <h2 className="text-lg font-bold text-rsGold mb-2 font-rsFont">
          Dungeon Music (https://sonatina.itch.io/)
        </h2>
        <audio
          controls
          autoPlay
          loop
          className="w-full rounded-rs bg-gray-800 p-2"
        >
          <source src="/output.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
}
