import { FaReact, FaNodeJs, FaDatabase, FaHtml5, FaCss3Alt, FaJs, FaGitAlt, FaFigma } from 'react-icons/fa';

const skillCategories = [
  {
    title: 'Frontend Development',
    skills: [
      { name: 'React.js', level: 90, icon: FaReact },
      { name: 'JavaScript', level: 85, icon: FaJs },
      { name: 'HTML5', level: 95, icon: FaHtml5 },
      { name: 'CSS3', level: 90, icon: FaCss3Alt },
      { name: 'Tailwind CSS', level: 85, icon: FaCss3Alt },
      { name: 'Redux', level: 75, icon: FaReact },
    ],
  },
  {
    title: 'Backend Development',
    skills: [
      { name: 'Node.js', level: 85, icon: FaNodeJs },
      { name: 'Express.js', level: 80, icon: FaNodeJs },
      { name: 'MongoDB', level: 85, icon: FaDatabase },
      { name: 'REST APIs', level: 90, icon: FaDatabase },
    ],
  },
  {
    title: 'Tools & Technologies',
    skills: [
      { name: 'Git & GitHub', level: 85, icon: FaGitAlt },
      { name: 'VS Code', level: 90, icon: FaJs },
      { name: 'Postman', level: 80, icon: FaDatabase },
      { name: 'Figma', level: 70, icon: FaFigma },
    ],
  },
];

const Skills = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Skills</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">Technologies and tools I work with</p>
        </div>

        {skillCategories.map((category, idx) => (
          <div key={idx} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">{category.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.skills.map((skill, i) => {
                const Icon = skill.icon;
                return (
                  <div key={i} className="flex items-center gap-4 p-4 card">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="text-sm text-primary">{skill.level}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/30 dark:bg-slate-700/30">
                        <div
                          className="h-2 rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mt-16 p-8 card text-center">
          <h2 className="text-3xl font-bold mb-4">Always Learning</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Technology evolves rapidly, and I'm committed to continuous learning. I regularly explore new frameworks, tools, and best practices to stay current and deliver the best solutions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Skills;