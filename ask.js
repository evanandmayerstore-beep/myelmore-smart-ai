export default async function handler(req, res) {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ reply: 'Missing prompt.' });

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content?.trim() || "Sorry, no response.";

  res.status(200).json({ reply });
}