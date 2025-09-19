import { NextApiRequest, NextApiResponse } from 'next';
import { sendGmail } from '@/lib/sendGmail';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  }

  try {
    const { messageId, replyContent } = req.body;

    if (!messageId || !replyContent) {
      return res.status(400).json({ error: 'ID du message et contenu de la réponse requis' });
    }

    // Récupérer le message original
    const originalMessage = await prisma.message.findUnique({
      where: { id: parseInt(messageId) }
    });

    if (!originalMessage) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    // Préparer le contenu de l'e-mail de réponse
    const replySubject = `Re: ${originalMessage.subject}`;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 10px; text-align: center; margin-bottom: 25px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Réponse à votre message</h1>
          <p style="color: #e0e7ff; margin: 8px 0 0 0;">Portfolio - Contact</p>
        </div>
        
        <div style="background: #f8fafc; padding: 25px; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
          <h2 style="color: #1e293b; margin-top: 0;">Bonjour ${originalMessage.name},</h2>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Merci pour votre message. Voici ma réponse :
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <div style="color: #1e293b; line-height: 1.7; white-space: pre-line;">${replyContent}</div>
          </div>
        </div>
        
        <div style="background: #f1f5f9; padding: 20px; border-radius: 10px; border: 1px solid #cbd5e1;">
          <h3 style="color: #475569; margin-top: 0; font-size: 16px;">📧 Votre message original :</h3>
          <div style="background: white; padding: 15px; border-radius: 6px; margin-top: 10px;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #1e293b;">Sujet : ${originalMessage.subject}</p>
            <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">Envoyé le ${new Date(originalMessage.createdAt).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <div style="color: #475569; line-height: 1.6; margin-top: 12px; white-space: pre-line; font-size: 14px;">${originalMessage.content}</div>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 25px; color: #94a3b8; font-size: 12px;">
          <p>Cet e-mail a été envoyé automatiquement depuis le portfolio.</p>
          <p>Vous pouvez répondre directement à cet e-mail pour continuer la conversation.</p>
        </div>
      </div>
    `;

    const emailText = `
Bonjour ${originalMessage.name},

Merci pour votre message. Voici ma réponse :

${replyContent}

---
Votre message original :
Sujet : ${originalMessage.subject}
Envoyé le ${new Date(originalMessage.createdAt).toLocaleDateString('fr-FR')}

${originalMessage.content}

---
Cet e-mail a été envoyé automatiquement depuis le portfolio.
Vous pouvez répondre directement à cet e-mail pour continuer la conversation.
    `;

    // Envoyer l'e-mail de réponse
    await sendGmail({
      to: originalMessage.email,
      subject: replySubject,
      html: emailHtml,
      text: emailText
    });

    res.status(200).json({ 
      success: true, 
      message: 'Réponse envoyée avec succès' 
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi de la réponse:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de la réponse' });
  }
}