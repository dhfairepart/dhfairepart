export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, description } = req.body;

  if (!amount || amount < 1) {
    return res.status(400).json({ error: 'Montant invalide' });
  }

  try {
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        amount: Math.round(amount * 100), // en centimes
        currency: 'eur',
        description: description || 'DH Faire-Part — Commande',
        'payment_method_types[]': 'card'
      })
    });

    const data = await response.json();

    if (data.client_secret) {
      return res.status(200).json({ clientSecret: data.client_secret });
    } else {
      return res.status(500).json({ error: data.error?.message || 'Erreur Stripe' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
