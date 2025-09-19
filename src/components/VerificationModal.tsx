import { motion } from 'framer-motion';
import { X, Mail, Shield, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<boolean>;
  email: string;
  isLoading?: boolean;
}

export default function VerificationModal({ 
  isOpen, 
  onClose, 
  onVerify, 
  email,
  isLoading = false
}: VerificationModalProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 8) {
      setError('Le code doit contenir 8 chiffres');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const success = await onVerify(code);
      if (success) {
        setCode('');
        onClose();
      } else {
        setError('Code incorrect ou expiré');
      }
    } catch {
      setError('Erreur lors de la vérification');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
    setCode(value);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-slate-800 rounded-2xl p-8 w-full max-w-md border border-slate-700"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Vérification</h2>
              <p className="text-slate-400 text-sm">Code de sécurité</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            disabled={isVerifying || isLoading}
          >
            <X size={24} />
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Loader2 className="text-purple-500 animate-spin" size={24} />
              <Mail className="text-slate-400" size={20} />
            </div>
            <h3 className="text-white font-semibold mb-2">Envoi du code...</h3>
            <p className="text-slate-300 text-sm">
              Un code de vérification est en cours d&apos;envoi à<br />
              <span className="text-purple-400 font-medium">{email}</span>
            </p>
          </div>
        ) : (
          <>
            {/* Instructions */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Mail className="text-purple-400" size={18} />
                <p className="text-white font-medium">Code envoyé par e-mail</p>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Un code de vérification à 8 chiffres a été envoyé à{' '}
                <span className="text-purple-400 font-medium">{email}</span>.
                Veuillez le saisir ci-dessous.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-3">
                  Code de vérification
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="12345678"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 text-center text-2xl font-mono tracking-widest focus:border-purple-500 focus:outline-none transition-colors"
                  maxLength={8}
                  autoFocus
                />
                {error && (
                  <motion.p
                    className="text-red-400 text-sm mt-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors font-medium"
                  disabled={isVerifying}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={code.length !== 8 || isVerifying}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Vérification...</span>
                    </>
                  ) : (
                    <span>Vérifier</span>
                  )}
                </button>
              </div>
            </form>

            {/* Footer info */}
            <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <p className="text-slate-400 text-xs text-center">
                ⏰ Le code expire dans 10 minutes
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}