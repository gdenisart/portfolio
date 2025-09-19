import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    {
      href: 'https://github.com/gdenisart',
      icon: Github,
      label: 'GitHub'
    },
    {
      href: 'https://linkedin.com/in/guillaume-denisart-811801a8/',
      icon: Linkedin,
      label: 'LinkedIn'
    },
    {
      href: 'mailto:guillaume.denisart@gmail.com',
      icon: Mail,
      label: 'Email'
    }
  ];

  return (
    <footer className="bg-slate-900/50 border-t border-slate-700/50 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo et description */}
          <div className="flex flex-col items-center md:items-start">
            <motion.div
              className="flex items-center space-x-2 mb-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-md flex items-center justify-center font-bold text-white">
                GD
              </div>
              <span className="font-bold text-lg text-white">Guillaume DENISART</span>
            </motion.div>
            <motion.p
              className="text-slate-400 text-sm text-center md:text-left max-w-md"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Développeur passionné créant des expériences web modernes et innovantes
            </motion.p>
          </div>

          {/* Liens sociaux */}
          <motion.div
            className="flex space-x-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {socialLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-purple-400 transition-colors p-2 rounded-lg hover:bg-slate-700/50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  aria-label={link.label}
                >
                  <IconComponent size={20} />
                </motion.a>
              );
            })}
          </motion.div>
        </div>

        {/* Ligne de séparation */}
        <motion.div
          className="border-t border-slate-700/50 my-6"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />

        {/* Copyright */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Guillaume DENISART. Tous droits réservés. <br />
            Ce site comprend du code généré par une intelligence artificielle.
          </p>
          <div className="flex items-center space-x-1 text-slate-400 text-sm">
            <span>Créé avec</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              <Heart className="text-red-500 fill-current" size={16} />
            </motion.div>
            <span>et Next.js</span>
          </div>
        </motion.div>

        {/* Navigation rapide */}
        <motion.div
          className="flex justify-center mt-6 space-x-6 text-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <a
            href="#about"
            className="text-slate-400 hover:text-purple-400 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#about')?.scrollIntoView({
                behavior: 'smooth'
              });
            }}
          >
            À propos
          </a>
          <span className="text-slate-600">•</span>
          <a
            href="#projects"
            className="text-slate-400 hover:text-purple-400 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#projects')?.scrollIntoView({
                behavior: 'smooth'
              });
            }}
          >
            Projets
          </a>
          <span className="text-slate-600">•</span>
          <a
            href="#contact"
            className="text-slate-400 hover:text-purple-400 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({
                behavior: 'smooth'
              });
            }}
          >
            Contact
          </a>
        </motion.div>
      </div>
    </footer>
  );
}