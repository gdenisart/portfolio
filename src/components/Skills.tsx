import { motion } from 'framer-motion';
import { Skill } from '@/types';

interface SkillsProps {
  skills: Skill[];
}

const skillCategories = {
  frontend: { label: 'Frontend', color: 'from-purple-500 to-pink-500' },
  backend: { label: 'Backend', color: 'from-blue-500 to-cyan-500' },
  database: { label: 'Base de données', color: 'from-green-500 to-teal-500' },
  tools: { label: 'Outils & DevOps', color: 'from-orange-500 to-red-500' }
};

export default function Skills({ skills }: SkillsProps) {
  // Organiser les compétences par catégorie
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category as keyof typeof skillCategories;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section id="skills" className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.p
            className="text-purple-400 text-lg mb-4 font-medium"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Mes compétences
          </motion.p>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Technologies et{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              expertise
            </span>
          </motion.h2>
          <motion.p
            className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Voici un aperçu de mes compétences techniques et des technologies que je maîtrise
          </motion.p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {Object.entries(skillsByCategory).map(([categoryKey, categorySkills], categoryIndex) => {
            const category = skillCategories[categoryKey as keyof typeof skillCategories];
            if (!category || !categorySkills?.length) return null;

            return (
              <motion.div
                key={categoryKey}
                className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                viewport={{ once: true }}
              >
                {/* Category Header */}
                <motion.div
                  className="flex items-center space-x-3 mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.2 + 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${category.color}`}></div>
                  <h3 className="text-xl font-semibold text-white">{category.label}</h3>
                </motion.div>

                {/* Skills List */}
                <div className="space-y-4">
                  {categorySkills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.id}
                      className="group"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: categoryIndex * 0.2 + 0.3 + skillIndex * 0.1 
                      }}
                      viewport={{ once: true }}
                    >
                      {/* Skill Name and Level */}
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-300 font-medium group-hover:text-white transition-colors">
                          {skill.name}
                        </span>
                        <span className="text-purple-400 text-sm font-semibold">
                          {skill.level}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ 
                            duration: 1.5, 
                            delay: categoryIndex * 0.2 + 0.5 + skillIndex * 0.1,
                            ease: "easeOut"
                          }}
                          viewport={{ once: true }}
                        />
                      </div>

                      {/* Description (if available) */}
                      {skill.description && (
                        <motion.p
                          className="text-slate-400 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ opacity: 0, height: 0 }}
                          whileInView={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3, delay: 1 }}
                          viewport={{ once: true }}
                        >
                          {skill.description}
                        </motion.p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Skills Cloud */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white mb-8">
            Et bien d&apos;autres technologies...
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Docker', 'AWS', 'Vercel', 'Figma', 'Git', 'Webpack', 
              'Vite', 'Jest', 'Cypress', 'GraphQL', 'Redis', 'Nginx'
            ].map((tech, index) => (
              <motion.span
                key={tech}
                className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full text-slate-300 text-sm hover:border-purple-500/50 hover:text-purple-300 transition-all duration-300 cursor-default"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}