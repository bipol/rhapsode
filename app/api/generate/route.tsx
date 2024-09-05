import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(req, res) {
  let { prompt } = await req.json();

  if (!prompt) {
    return new Response(`Prompt not found on request body`, {
      status: 400,
    });
  }

  // we should add "in a fantasy style", or other text, to the prompt
  // to make the image generation more accurate
  prompt +=
    ' in a high fantasy style. Should be illustrated. The portraits should be pleasing to the eye.';
  try {
    const image = await openai.images.generate({
      prompt: prompt,
      size: '256x256',
    });

    const imageUrl = image.data[0].url;
    return Response.json({ imageUrl });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
