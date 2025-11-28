export interface Chemical {
  id: string;
  name: string;
  formula: string;
  color: string; // hsla format for easy manipulation
  state: 'solid' | 'liquid' | 'gas';
}


export interface Reaction {
  reagents: string[];
  isDangerous: boolean;
  product: {
    name: string;
    color: string;
  };
  quiz: {
    question: string;
    options: string[];
    correctAnswer: string;
  } | null;
}

export const chemicals: Chemical[] = [
  // Liquids
  { id: 'h2o', name: 'Water', formula: 'H₂O', color: 'hsla(200, 80%, 70%, 0.5)', state: 'liquid' },
  { id: 'vinegar', name: 'Vinegar', formula: 'CH₃COOH', color: 'hsla(60, 20%, 80%, 0.4)', state: 'liquid' },
  { id: 'hcl', name: 'Hydrochloric Acid', formula: 'HCl', color: 'hsla(50, 60%, 80%, 0.4)', state: 'liquid' },
  { id: 'br', name: 'Bromine', formula: 'Br₂', color: 'hsla(15, 70%, 40%, 0.6)', state: 'liquid' },
  
  // Solids
  { id: 'na', name: 'Sodium', formula: 'Na', color: 'hsla(0, 0%, 80%, 1)', state: 'solid' },
  { id: 'k', name: 'Potassium', formula: 'K', color: 'hsla(0, 0%, 70%, 1)', state: 'solid' },
  { id: 'li', name: 'Lithium', formula: 'Li', color: 'hsla(0, 0%, 85%, 1)', state: 'solid' },
  { id: 'fe', name: 'Iron', formula: 'Fe', color: 'hsla(20, 20%, 50%, 1)', state: 'solid' },
  { id: 'cu', name: 'Copper', formula: 'Cu', color: 'hsla(25, 80%, 60%, 1)', state: 'solid' },
  { id: 'zn', name: 'Zinc', formula: 'Zn', color: 'hsla(220, 10%, 70%, 1)', state: 'solid' },
  { id: 'au', name: 'Gold', formula: 'Au', color: 'hsla(50, 100%, 50%, 1)', state: 'solid' },
  { id: 'ag', name: 'Silver', formula: 'Ag', color: 'hsla(210, 20%, 90%, 1)', state: 'solid' },
  { id: 'baking_soda', name: 'Baking Soda', formula: 'NaHCO₃', color: 'hsla(0, 0%, 100%, 0.8)', state: 'solid' },
  { id: 'unobtanium', name: 'Unobtanium', formula: 'Un', color: 'hsla(220, 100%, 50%, 0.7)', state: 'solid' },
  { id: 'vibranium', name: 'Vibranium', formula: 'Vb', color: 'hsla(300, 100%, 50%, 0.7)', state: 'solid' },
  
  // Gases
  { id: 'cl', name: 'Chlorine', formula: 'Cl₂', color: 'hsla(60, 100%, 50%, 0.3)', state: 'gas' },
  { id: 'h', name: 'Hydrogen', formula: 'H₂', color: 'hsla(210, 100%, 95%, 0.2)', state: 'gas' },
  { id: 'o', name: 'Oxygen', formula: 'O₂', color: 'hsla(200, 100%, 95%, 0.2)', state: 'gas' },
];

export const reactions: Reaction[] = [
  {
    reagents: ['na', 'h2o'],
    isDangerous: true,
    product: { name: 'Sodium Hydroxide Solution', color: 'hsla(200, 80%, 70%, 0.5)' },
    quiz: {
      question: 'What flammable gas is produced when Sodium reacts with water?',
      options: ['Oxygen', 'Hydrogen', 'Nitrogen', 'Chlorine'],
      correctAnswer: 'Hydrogen',
    },
  },
  {
    reagents: ['k', 'h2o'],
    isDangerous: true,
    product: { name: 'Potassium Hydroxide Solution', color: 'hsla(280, 80%, 70%, 0.5)' },
    quiz: {
      question: 'The reaction between Potassium and water is more vigorous than with Sodium because...',
      options: ['Potassium is less reactive', 'Potassium is in a different group', 'Potassium is more reactive', 'Potassium is heavier'],
      correctAnswer: 'Potassium is more reactive',
    },
  },
  {
    reagents: ['li', 'h2o'],
    isDangerous: true,
    product: { name: 'Lithium Hydroxide Solution', color: 'hsla(0, 80%, 70%, 0.5)' },
    quiz: {
      question: 'Lithium is an alkali metal. What is a common characteristic of alkali metals?',
      options: ['They are poor conductors', 'They are very unreactive', 'They are soft and have low density', 'They are noble gases'],
      correctAnswer: 'They are soft and have low density',
    },
  },
  {
    reagents: ['unobtanium', 'vibranium'],
    isDangerous: true,
    product: { name: 'Cosmic Energy', color: 'hsla(0, 100%, 100%, 1)' },
    quiz: {
      question: 'Mixing Unobtanium and Vibranium is a bad idea because it violates which fictional law?',
      options: ['The Stark Treaty of Element Mixing', 'The Asimov Law of Metallurgy', 'The Sokovia Accords', 'The Pym Particle Principle'],
      correctAnswer: 'The Stark Treaty of Element Mixing',
    },
  },
  {
    reagents: ['baking_soda', 'vinegar'],
    isDangerous: false,
    product: { name: 'Fizz (CO₂ and Water)', color: 'hsla(60, 20%, 80%, 0.6)' },
    quiz: null,
  },
  {
    reagents: ['na', 'cl'],
    isDangerous: false,
    product: { name: 'Salt Water', color: 'hsla(200, 40%, 60%, 0.5)' },
    quiz: null,
  },
  {
    reagents: ['zn', 'hcl'],
    isDangerous: false,
    product: { name: 'Zinc Chloride', color: 'hsla(220, 10%, 75%, 0.5)' },
    quiz: null,
  },
];
