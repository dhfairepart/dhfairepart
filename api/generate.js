export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt required' });
  }
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: 'dall-e-3-preview',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard'
      })
    });
    const data = await response.json();
    if (data.data && data.data[0]) {
      return res.status(200).json({ url: data.data[0].url });
    } else {
      return res.status(500).json({ error: data.error?.message || 'Erreur API' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
