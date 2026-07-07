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
        model: 'gpt-image-2',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        output_format: 'jpeg'
      })
    });
    const data = await response.json();
    if (data.data && data.data[0]) {
      const url = `data:image/jpeg;base64,${data.data[0].b64_json}`;
      return res.status(200).json({ url });
    } else {
      return res.status(500).json({ error: data.error?.message || 'Erreur API' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
