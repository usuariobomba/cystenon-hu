import crypto from 'crypto';

export default async function handler(req, res) {
  const data = req.method === 'POST' ? req.body : req.query;

  // --- CONFIGURAÇÃO TERRALEADS (CYSTENON HU) ---
  const CONFIG = {
    user_id: "82140",
    api_key: "757ab9210f59d298e6a6713117b7137a",
    offer_id: "6879",
    stream_id: "373351",
    country: "HU"
  };

  try {
    // 1. Dados do Lead
    const leadData = {
      name: data.name || 'Vevő', // Cliente em Húngaro
      phone: data.phone || '',
      country: CONFIG.country,
      offer_id: CONFIG.offer_id,
      stream_id: CONFIG.stream_id,
      ip: req.headers['x-forwarded-for'] || '127.0.0.1',
      sub_id: data.subacc || '' // ClickID do Google
    };

    // 2. Checksum SHA1 (Obrigatório)
    const payload = { user_id: parseInt(CONFIG.user_id), data: leadData };
    const jsonString = JSON.stringify(payload);
    const checkSum = crypto.createHash('sha1').update(jsonString + CONFIG.api_key).digest('hex');

    console.log("Enviando para TerraLeads HU...", payload);

    // 3. Envio
    const response = await fetch(`https://t-api.org/api/lead/create?check_sum=${checkSum}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Node.js/Vercel)'
      },
      body: jsonString
    });

    const result = await response.json();

    // 4. Resposta
    if (result.status === 'ok') {
      // SUCESSO: Redireciona para Home com parâmetro
      return res.redirect(302, '/?status=success');
    } else {
      // ERRO: Mostra na tela
      return res.status(400).json({ ERRO: "TerraLeads Recusou", DETALHES: result, DADOS: leadData });
    }
  } catch (error) {
    return res.status(500).json({ erro_interno: error.message });
  }
}
