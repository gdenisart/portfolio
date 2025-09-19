import { motion } from 'framer-motion';
import type { Experience } from '@/types';
import { Calendar, MapPin, Briefcase } from 'lucide-react';

interface ExperienceProps {
  experiences: Experience[];
}

export default function Experience({ experiences }: ExperienceProps) {
  const parseTechnologies = (techString?: string): string[] => {
    if (!techString) return [];
    try {
      return JSON.parse(techString);
    } catch {
      return [];
    }
  };

  const parseAchievements = (achievementsString?: string): string[] => {
    if (!achievementsString) return [];
    try {
      return JSON.parse(achievementsString);
    } catch {
      return [];
    }
  };

  const formatDate = (date: Date, isCurrent: boolean): string => {
    if (isCurrent) return 'Présent';
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short'
    }).format(new Date(date));
  };

  const calculateDuration = (startDate: Date, endDate?: Date, current?: boolean): string => {
    const start = new Date(startDate);
    const end = current ? new Date() : (endDate ? new Date(endDate) : new Date());
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                   (end.getMonth() - start.getMonth());
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) {
      return `${remainingMonths} mois`;
    } else if (remainingMonths === 0) {
      return `${years} an${years > 1 ? 's' : ''}`;
    } else {
      return `${years} an${years > 1 ? 's' : ''} ${remainingMonths} mois`;
    }
  };

  return (
    <section id="experience" className="py-20 bg-slate-900/50">
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
            Mon parcours
          </motion.p>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Expérience{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              professionnelle
            </span>
          </motion.h2>
          <motion.p
            className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Un aperçu de mon évolution professionnelle et des défis que j&apos;ai relevés
          </motion.p>
        </motion.div>

        {/* Experience Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 via-blue-500 to-purple-500 transform md:-translate-x-1/2"></div>

          {experiences.map((experience, index) => {
            const technologies = parseTechnologies(experience.technologies);
            const achievements = parseAchievements(experience.achievements);
            const duration = calculateDuration(experience.startDate, experience.endDate, experience.current);
            
            return (
              <motion.div
                key={experience.id}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                {/* Timeline Node */}
                <motion.div
                  className="absolute left-4 md:left-1/2 w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full border-4 border-slate-900 transform md:-translate-x-1/2 z-10"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.2 }}
                />

                {/* Experience Card */}
                <motion.div
                  className={`w-full md:w-5/12 ml-12 md:ml-0 ${
                    index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
                    {/* Header */}
                    <div className="mb-4">
                      {/* Current Badge */}
                      {experience.current && (
                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold rounded-full mb-3">
                          En cours
                        </span>
                      )}
                      
                      <h3 className="text-xl font-bold text-white mb-2">
                        {experience.title}
                      </h3>
                      
                      <div className="flex items-center space-x-4 text-slate-300 mb-2">
                        <div className="flex items-center space-x-2">
                          <Briefcase size={16} />
                          <span className="font-medium">{experience.company}</span>
                        </div>
                        {experience.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin size={14} />
                            <span className="text-sm">{experience.location}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 text-purple-400 text-sm">
                        <Calendar size={14} />
                        <span>
                          {formatDate(experience.startDate, false)} - {formatDate(experience.endDate || new Date(), experience.current)}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{duration}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 mb-4 leading-relaxed">
                      {experience.description}
                    </p>

                    {/* Technologies */}
                    {technologies.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-white font-medium text-sm mb-2">Technologies utilisées :</h4>
                        <div className="flex flex-wrap gap-2">
                          {technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded border border-slate-600/50"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Achievements */}
                    {achievements.length > 0 && (
                      <div>
                        <h4 className="text-white font-medium text-sm mb-2">Réalisations :</h4>
                        <ul className="space-y-1">
                          {achievements.map((achievement, achIndex) => (
                            <li
                              key={achIndex}
                              className="text-slate-300 text-sm flex items-start space-x-2"
                            >
                              <span className="text-purple-400 mt-1">•</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.a
            href="/cv.pdf"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Télécharger mon CV complet</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}