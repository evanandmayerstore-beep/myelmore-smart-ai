export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: 'Invalid response from OpenAI' });
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'AI error', details: error.message });
  }
}
