// ═══════════════════════════════════════════════════
// config.js — All your personal data in one file
// Edit this file to update any info site-wide
// ═══════════════════════════════════════════════════

export const CONFIG = {
  // ── Personal ──
  name:        'Manoz Jinagal',
  nameFirst:   'Manoz',
  nameLast:    'Jinagal',
  title:       'Associate Implementation Consultant',
  roles:       ['UI/UX Designer', 'Web Developer', 'Java Developer', 'Chess Player'],
  location:    'Mohali, India',
  locationCoords: '26.9157° N · 73.8770° E',
  institution: 'NIT Kurukshetra',
  birthday:    '10 January',
  bio:         'MCA graduate from NIT Kurukshetra, currently working as an Associate Implementation Consultant at Edifecs, Mohali. Passionate about technology — from DSA and enterprise systems to web design, photography, and chess. 500+ LeetCode problems solved. Inter-NIT coding competition podium finisher.',

  // ── Contact ──
  email:     'manozjinagal@gmail.com',
  phone:     '+91 85619-08667',
  whatsapp:  'https://wa.me/918561908667',
  freelance: true,

  // ── Social Links (orbit satellites) ──
  socials: [
    { id: 'github',    label: 'GitHub',    href: 'https://manozjinagal.github.io/',       ring: 0, phase: 0,              speed:  0.42, color: 'rgba(200,220,255,1)', glow: 'rgba(200,220,255,0.5)' },
    { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/manozjinagal',    ring: 1, phase: Math.PI,         speed:  0.30, color: 'rgba(220,80,150,1)',  glow: 'rgba(220,80,150,0.5)'  },
    { id: 'whatsapp',  label: 'WhatsApp',  href: 'https://wa.me/918561908667',            ring: 1, phase: 0,              speed: -0.30, color: 'rgba(37,211,102,1)', glow: 'rgba(37,211,102,0.5)'  },
    { id: 'linkedin',  label: 'LinkedIn',  href: 'https://linkedin.com/in/manozjinagal', ring: 2, phase: Math.PI * 0.5,   speed:  0.20, color: 'rgba(10,150,255,1)', glow: 'rgba(10,150,255,0.5)'  },
    { id: 'email',     label: 'Email',     href: 'mailto:manozjinagal@gmail.com',         ring: 2, phase: Math.PI * 1.5,   speed:  0.20, color: 'rgba(255,110,60,1)', glow: 'rgba(255,110,60,0.5)'  },
    { id: 'leetcode',  label: 'LeetCode',  href: 'https://leetcode.com/manozjinagal',     ring: 3, phase: Math.PI * 0.3,   speed: -0.14, color: 'rgba(255,161,22,1)', glow: 'rgba(255,161,22,0.5)'  },
    { id: 'phone',     label: 'Phone',     href: 'tel:+918561908667',                    ring: 3, phase: Math.PI * 1.3,   speed: -0.14, color: 'rgba(137,196,255,1)',glow: 'rgba(137,196,255,0.5)'  },
  ],

  // ── EmailJS (visitor notifications) ──
  emailjs: {
    publicKey:  'P',
    serviceId:  'S',
    templateId: 'T',
    toEmail:    'manozjinagal@gmail.com’,
  },

  // ── Skills ──
  skills: [
    { name: 'Java',                       pct: 80, cls: 'sf-2' },
    { name: 'Data Structures & Algorithms',pct: 85, cls: 'sf-3' },
    { name: 'Spring Boot / OAuth 2',       pct: 75, cls: 'sf-1' },
    { name: 'Groovy Scripting',            pct: 75, cls: 'sf-4' },
    { name: 'SpecBuilder / EAM / XEngine', pct: 80, cls: 'sf-5' },
    { name: 'HTML / Web Design',           pct: 90, cls: 'sf-1' },
    { name: 'Dart / System Design',        pct: 55, cls: 'sf-6' },
  ],

  // ── Experience ──
  experience: [
    {
      role:    'Associate Implementation Consultant',
      company: 'Edifecs',
      location:'Mohali, India',
      period:  'Jan 2022 — Present',
      projects: [
        {
          name: 'AlohaCare',
          bullets: [
            'Developed a custom utility for processing DFF file formats, generating ECF files for encounter management.',
            'Integrated EAM components including Velocity templates, Queue, Timer, and email systems.',
            'Leveraged database operations and Groovy scripting to handle file processing efficiently.',
            'Optimized Groovy script with multithreading, significantly improving processing speed.',
          ],
        },
        {
          name: 'ILS — Independent Living System',
          bullets: [
            'Developed routes and business rules per client needs for MAO/FL KP.',
            'Improved historical data load efficiency using a custom route for multiple providers.',
          ],
        },
        {
          name: 'NAAMCAL Encounter Management',
          bullets: [
            'Implemented partner setup, custom rules, and routes ensuring alignment with business requirements.',
          ],
        },
      ],
    },
  ],

  // ── Education ──
  education: [
    {
      degree:  'Master of Computer Applications',
      school:  'National Institute of Technology, Kurukshetra, Haryana',
      period:  '2019 — 2022',
      note:    'One of India\'s most prestigious institutions. NIRF ranking #39.',
    },
    {
      degree:  'Bachelor of Computer Applications',
      school:  'Dr. B.R. Ambedkar Govt. College, Sri Ganganagar, Rajasthan',
      period:  '2015 — 2018',
      note:    'First contact with the cosmos of computing.',
    },
  ],

  // ── Certifications ──
  certifications: [
    { name: 'Algorithmic Toolbox',                         issuer: 'Coursera', date: 'Apr 2021', url: 'https://www.coursera.org/account/accomplishments/certificate/MX6UHRE9MJH9' },
    { name: 'Machine Learning Pipelines with Azure ML',    issuer: 'Coursera', date: 'Apr 2021', url: 'https://coursera.org/share/cf4aa1691a3daaeb1c735994613fbeca' },
    { name: 'Google Analytics for Beginners',              issuer: 'Google Analytics Academy', date: 'Apr 2021', url: 'https://analytics.google.com/analytics/academy/certificate/hWUMoEKWT-WyhhSHXPqb-Q' },
  ],

  // ── Projects ──
  projects: [
    { name: 'OAuth 2 Security Schema', desc: 'Spring Boot app with OAuth 2.0 authorization server, resource server, access token flow.', tags: ['Spring Boot', 'MySQL', 'Java'] },
    { name: 'Online Book Store',       desc: 'Full-stack online bookstore built for MCA students.',                                       tags: ['Java', 'HTML', 'MySQL'] },
    { name: 'Electronic Voting Machine',desc:'EVM implementation written in C++.',                                                       tags: ['C++'] },
    { name: 'Algorithm Toolbox',       desc: 'UC San Diego Coursera — sorting, greedy, divide & conquer algorithms.',                    tags: ['Java', 'DSA'] },
    { name: 'Online Exam Portal',      desc: 'Platform for online exams, test series and MCQ-based assessments.',                        tags: ['HTML', 'Java', 'MySQL'] },
    { name: 'LeetCode — 500+ Solved',  desc: '500+ DSA problems solved across arrays, trees, graphs, DP and more.',                     tags: ['DSA', 'Java', 'LeetCode'] },
  ],

  // ── Achievements ──
  achievements: [
    { year: '2019', title: 'TECH-SPARDA — 2nd Place',        desc: 'Inter-NIT coding competition podium finish.' },
    { year: '2016', title: 'Chess Team Champion',             desc: 'Champion, Dr. B.R. Ambedkar College.' },
    { year: '2015', title: 'Chess Team Runner-Up',            desc: 'Runner-up, Dr. B.R. Ambedkar College.' },
    { year: '500+', title: 'LeetCode DSA Problems',           desc: 'Solved across all major DSA topics on LeetCode.' },
    { year: '2020', title: 'Confluence — M-Expert Society',   desc: 'Organized NIT\'s annual cultural fest strategy game, 200+ entries.' },
    { year: '2022', title: 'Edifecs — Campus Placement',      desc: 'Joined Edifecs directly from NIT Kurukshetra campus.' },
  ],

  // ── Photography categories ──
  photoCategories: ['All', 'Nature', 'Travel', 'Portrait', 'Street'],

  // ── Nav links ──
  navLinks: [
    { label: 'About',       href: '#about' },
    { label: 'Experience',  href: '#experience' },
    { label: 'Skills',      href: '#skills' },
    { label: 'Projects',    href: '#projects' },
    { label: 'Connect',     href: '#orbit-section' },
    { label: 'Contact',     href: '#contact' },
    { label: 'Photography', href: 'photography.html', external: true },
    { label: 'Blog',        href: 'blog.html', external: true },
  ],
};
