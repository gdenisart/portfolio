import { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {

  // Empêche le scroll de la page quand la modale est ouverte
    useEffect(() => {
      if (isOpen) {
        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = original; };
      }
    }, [isOpen]);

    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
  <div className="bg-slate-900 w-[80vw] h-[80vh] relative animate-fade-in p-0 m-0 rounded-none shadow-none flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-4 right-6 text-slate-400 hover:text-red-400 text-3xl font-bold z-10"
            aria-label="Fermer la modale"
          >
            ×
          </button>
          <div className="flex-1 overflow-auto p-8">{children}</div>
        </div>
      </div>
    );
}
