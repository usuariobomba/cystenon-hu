import crypto from 'crypto';

export default async function handler(req, res) {
  const data = req.method === 'POST' ? req.body : req.query;

  // --- CONFIGURAÇÃO TERRALEADS ---
  const CONFIG = {
    user_id: 82140, // Inteiro
    api_key: '757ab9210f59d298e6a6713117b7137a', // String
    offer_id: 6879, // Inteiro
    country: 'HU' // String
  };

  try {
    // 1. Montar dados do lead
    const leadData = {
      name: data.name || 'Cliente',
      phone: data.phone || '',
      country: CONFIG.country,
      offer_id: CONFIG.offer_id,
      ip: req.headers['x-forwarded-for'] || '127.0.0.1',
      sub_id: data.subacc || '' // ClickID do Google
    };

    // 2. Montar pacote para criptografia
    const payload = {
      user_id: CONFIG.user_id,
      data: leadData
    };

    // 3. Gerar Checksum (SHA1)
    const jsonString = JSON.stringify(payload);
    const checkSum = crypto
      .createHash('sha1')
      .update(jsonString + CONFIG.api_key)
      .digest('hex');

    console.log("Enviando para TerraLeads...", payload);

    // 4. Enviar Requisição
    const response = await fetch(`https://t-api.org/api/lead/create?check_sum=${checkSum}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Node.js/Vercel)'
      },
      body: jsonString
    });

    const result = await response.json();

    // 5. Tratar Resposta
    if (result.status === 'ok') {
      // SUCESSO: Redireciona para Home com flag
      return res.redirect(302, '/?status=success');
    } else {
      // ERRO: Mostra na tela
      return res.status(400).json({
        ERRO: "TerraLeads recusou",
        RESPOSTA: result,
        DADOS_ENVIADOS: leadData
      });
    }
  } catch (error) {
    return res.status(500).json({ erro_interno: error.message });
  }
}
