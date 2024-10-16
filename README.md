## Rhapsode - a virtual dungeon master

This is a virtual dungeon master I created hastily for a hackathon project at Daily. It's quite messy, but achieved my goal of creating an interactive dungeon master for solo questing. It handles character creation, portrait and setting generation, as well as inventory management. 

## Run it locally

### Grab a Daily Bots API key

Sign-up here: [https://bots.daily.co](https://bots.daily.co)

### Configure your local environment

```shell
cp env.example .env.local
```

`DAILY_BOTS_URL` URL of the Daily Bots `start` endpoint (https://api.daily.co/v1/bots/start)

`DAILY_BOTS_API_KEY` your Daily API key obtained by registering at https://bots.daily.co.

`OPEN_API_KEY` your open ai key, which is used to generate character portraits

### Install dependencies

```shell
yarn 
```

### Run the project

```shell
yarn run dev
```

## How does this work?

Daily Bots is built on two open-source technologies:

- [Pipecat](https://www.pipecat.ai) - Python library for building real-time agent
- [RTVI](https://github.com/rtvi-ai) - Open-standard for Real-Time Voice [and Video] Inference

Learn more about the RTVI web client libraries [on the docs](https://docs.rtvi.ai).

The application itself guides a player through character creation, and loads that into a beefy prompt. This prompt has a set of functions that control the state of the game. All of this logic is located in [App.tsx](components/App.tsx). The game is "saved" by encoding a big json blob intoa base64 text file, which is really just a transcript of the entire play session last time. 

This works pretty well, but is very expensive in terms of tokens. 

The LLM I used mostly was claude, but I opted for llama 3.1 8B for the demo, for cost reasons. Additionally, I have a timeout of 5 minutes to limit usage as well. 

### Configuration

The majority of the RTVI configuration can be found in [App.tsx](components/App.tsx). Here, we set up our prompt, which is built upon the bits of information we gathered during character creation.

### API routes

This project exposes three server-side routes:

- [api/route.ts](app/api/route.ts)
- [api/generate/route.ts](app/api/generate/route.ts)

The routes project a secure way to pass any required secrets or configuration directly to the Daily Bots API. Your `NEXT_PUBLIC_BASE_URL` must point to your `/api` route and passed to the `VoiceClient`. 

The routes are passed a `config` array and `services` map, which can be passed to the Daily Bots REST API, or modified securely.

Daily Bots `https://api.daily.co/v1/bots/start` has some required properties, which you can read more about [here](https://docs.dailybots.ai/api-reference/endpoint/startBot). You must set:

- `bot_profile`
- `max_duration`
- `config`
- `services`
- Optional, if using OpenAI: `api_keys`
