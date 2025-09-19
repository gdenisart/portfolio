import { NextApiRequest, NextApiResponse } from 'next';
import { sendGmail } from '@/lib/sendGmail';

// Stockage temporaire des codes de vérification (en production, utiliser Redis)
const verificationCodes: Record<string, {
  code: string;
  expiresAt: number;
  messageData: {
    name: string;
    email: string;
    subject: string;
    content: string;
  };
}> = {};

// Fonction pour générer un code à 8 chiffres
function generateVerificationCode(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  }

  try {
    const { name, email, subject, content } = req.body;

    if (!name || !email || !subject || !content) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Générer le code de vérification
    const code = generateVerificationCode();
    const sessionId = `${email}_${Date.now()}`;
    
    // Stocker temporairement (expire dans 10 minutes)
    verificationCodes[sessionId] = {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      messageData: { name, email, subject, content }
    };

    // Envoyer l'e-mail avec le code
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Code de Vérification</h1>
          <p style="color: #e0e7ff; margin: 10px 0 0 0;">Portfolio Contact</p>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border-radius: 10px; border: 1px solid #e2e8f0;">
          <h2 style="color: #1e293b; margin-top: 0;">Bonjour ${name},</h2>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Merci d'avoir pris contact avec moi ! Pour finaliser l'envoi de votre message, 
            veuillez utiliser le code de vérification ci-dessous :
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; border: 2px solid #667eea;">
            <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px;">Code de vérification :</p>
            <h1 style="color: #667eea; margin: 0; font-size: 32px; letter-spacing: 4px; font-weight: bold;">${code}</h1>
          </div>
          
          <p style="color: #475569; font-size: 14px; margin: 20px 0 0 0;">
            <strong>⏰ Ce code expire dans 10 minutes.</strong><br>
            Si vous n'avez pas demandé ce code, vous pouvez ignorer cet e-mail.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px;">
          <p>Cet e-mail a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
      </div>
    `;

    await sendGmail({
      to: email,
      subject: 'Code de vérification - Portfolio Contact',
      html: emailHtml,
      text: `Code de vérification : ${code}\n\nCe code expire dans 10 minutes.`
    });

    res.status(200).json({ 
      success: true, 
      sessionId,
      message: 'Code de vérification envoyé par e-mail' 
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi du code:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du code de vérification' });
  }
}

// Export des codes pour l'API de vérification
export { verificationCodes };