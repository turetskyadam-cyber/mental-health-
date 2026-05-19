export const ZONES = {
  hyper: {
    id: 'hyper',
    name: 'Hyperarousal',
    subtitle: 'Mobilized & Activated',
    emoji: '🔥',
    tagline: 'Your system is running hot.',
    description: "Your nervous system is in high gear — that's your body protecting you. Let's bring it down gently.",
    fromColor: '#FF6B6B',
    toColor: '#FF8E53',
    textColor: '#7B2D00',
    bgClass: 'from-[#FF6B6B] to-[#FF8E53]',
    lightBg: 'bg-[#FFF0EE]',
    borderColor: 'border-[#FF6B6B]',
    mind: ['Racing thoughts', 'Hyper-vigilance', 'Irritability', 'Panic'],
    body: ['Shallow breathing', 'Elevated heart rate', 'Muscle tension', 'Restlessness'],
  },
  window: {
    id: 'window',
    name: 'Window of Tolerance',
    subtitle: 'Grounded & Present',
    emoji: '🌊',
    tagline: 'Your sweet spot.',
    description: "You're in the zone where learning, connecting, and healing happen. Let's keep you here and widen it.",
    fromColor: '#4ECDC4',
    toColor: '#88D8B0',
    textColor: '#0D4A40',
    bgClass: 'from-[#4ECDC4] to-[#88D8B0]',
    lightBg: 'bg-[#F0FDFB]',
    borderColor: 'border-[#4ECDC4]',
    mind: ['Clear thinking', 'Connected to self & others', 'Curious', 'Calm'],
    body: ['Steady, natural breathing', 'Relaxed but present posture', 'Warm & open'],
  },
  hypo: {
    id: 'hypo',
    name: 'Hypoarousal',
    subtitle: 'Under-Activated & Heavy',
    emoji: '💤',
    tagline: 'Your system has powered down.',
    description: "Your nervous system is in rest mode. Let's gently wake it back up with softness and care.",
    fromColor: '#A8B4D4',
    toColor: '#C3A6D4',
    textColor: '#2D1F5E',
    bgClass: 'from-[#A8B4D4] to-[#C3A6D4]',
    lightBg: 'bg-[#F5F3FF]',
    borderColor: 'border-[#A8B4D4]',
    mind: ['Numbness', 'Disconnection', 'Hopelessness', 'Fatigue', 'Brain fog'],
    body: ['Heavy limbs', 'Very shallow breath', 'Desire to isolate', 'Low energy'],
  },
}

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'My mind feels like…',
    options: [
      { emoji: '🐝', text: 'Buzzing', zone: 'hyper' },
      { emoji: '🌊', text: 'Flowing', zone: 'window' },
      { emoji: '🪨', text: 'Heavy', zone: 'hypo' },
    ],
  },
  {
    id: 2,
    question: 'My body right now…',
    options: [
      { emoji: '⚡', text: 'Wired tight', zone: 'hyper' },
      { emoji: '🧘', text: 'Pretty good', zone: 'window' },
      { emoji: '🪵', text: 'Really heavy', zone: 'hypo' },
    ],
  },
  {
    id: 3,
    question: 'My breathing is…',
    options: [
      { emoji: '😤', text: 'Short & fast', zone: 'hyper' },
      { emoji: '😌', text: 'Natural', zone: 'window' },
      { emoji: '😶', text: 'Barely there', zone: 'hypo' },
    ],
  },
  {
    id: 4,
    question: 'My thoughts are…',
    options: [
      { emoji: '🌪️', text: 'Spiraling', zone: 'hyper' },
      { emoji: '💡', text: 'Clear', zone: 'window' },
      { emoji: '🌫️', text: 'Foggy', zone: 'hypo' },
    ],
  },
  {
    id: 5,
    question: 'I feel like…',
    options: [
      { emoji: '🚀', text: 'Running away', zone: 'hyper' },
      { emoji: '🌿', text: 'Staying present', zone: 'window' },
      { emoji: '🛌', text: 'Disappearing', zone: 'hypo' },
    ],
  },
]

export const TOOLKIT = {
  hyper: [
    {
      id: 'elongated-exhale',
      icon: '🌬️',
      name: 'Elongated Exhale',
      subtitle: 'Down-regulate with breath',
      steps: [
        'Breathe in through your nose for 4 counts',
        'Hold gently for 1 count',
        'Exhale slowly through your mouth for 8 counts',
        'Repeat 3–5 times',
      ],
      action: 'breathing',
      mode: 'down',
    },
    {
      id: 'room-orientation',
      icon: '👁️',
      name: 'Room Orientation',
      subtitle: 'Ground through your senses',
      steps: [
        'Look around the room slowly',
        'Name 5 things you can see',
        'Notice their colors and textures',
        'Feel both feet flat on the floor',
      ],
    },
    {
      id: 'weight-bearing',
      icon: '🏋️',
      name: 'Weight-Bearing Movement',
      subtitle: 'Ground through your body',
      steps: [
        'Press your feet firmly into the floor',
        'Do 10 slow wall push-ups',
        'Or press your palms together firmly for 10s',
        'Notice the resistance — feel your strength',
      ],
    },
  ],
  window: [
    {
      id: 'lifestyle-rhythms',
      icon: '🔄',
      name: 'Consistent Rhythms',
      subtitle: 'Anchor your nervous system',
      steps: [
        'Keep wake/sleep times consistent',
        'Eat meals at regular times',
        'Build small daily rituals you enjoy',
        'Predictability tells your body: you\'re safe',
      ],
    },
    {
      id: 'connections',
      icon: '🤝',
      name: 'Supportive Connections',
      subtitle: 'Co-regulate with others',
      steps: [
        'Reach out to someone who feels safe',
        'Even a short, warm conversation helps',
        'You don\'t need to share everything — presence counts',
        'Nervous systems sync with each other',
      ],
    },
    {
      id: 'mindfulness',
      icon: '🧘',
      name: 'Mindfulness Practice',
      subtitle: 'Stay in the present moment',
      steps: [
        'Take 3 conscious breaths right now',
        'Notice 3 sensations in your body',
        'Observe thoughts without judgment',
        'Return to your senses whenever you drift',
      ],
    },
  ],
  hypo: [
    {
      id: 'sensory-activation',
      icon: '🖐️',
      name: 'Sensory Activation',
      subtitle: 'Wake up your senses gently',
      steps: [
        'Find 3 different textures to touch slowly',
        'Smell something strong — coffee, citrus, or mint',
        'Listen and name 3 distinct sounds',
        'Let your senses pull you back to now',
      ],
    },
    {
      id: 'dynamic-stretch',
      icon: '🤸',
      name: 'Dynamic Stretching',
      subtitle: 'Move your body into aliveness',
      steps: [
        'Roll your shoulders back 5 times',
        'Shake your hands out vigorously for 10s',
        'Do 5 slow, gentle neck rolls',
        'March in place for 30 seconds',
      ],
    },
    {
      id: 'crisp-inhale',
      icon: '💨',
      name: 'Crisp Inhalation',
      subtitle: 'Energize with breath',
      steps: [
        'Take a sharp, crisp 2-count breath in through your nose',
        'Normal 2-count exhale through your mouth',
        'Repeat 5–8 times',
        'Notice a gentle energy shift in your body',
      ],
      action: 'breathing',
      mode: 'up',
    },
  ],
}

export const CARD_SORT_ITEMS = [
  { id: 1,  text: 'Consistent lifestyle rhythms', icon: '🔄', correct: 'expand',
    explanation: 'Regular sleep, meals, and routines signal safety to your nervous system — predictability lowers your baseline stress.' },
  { id: 2,  text: 'Supportive connections',       icon: '🤝', correct: 'expand',
    explanation: 'Co-regulating with safe people literally calms your nervous system. Their calm signals yours to follow.' },
  { id: 3,  text: 'Boundaries',                  icon: '🛡️', correct: 'expand',
    explanation: 'Clear limits protect your energy and reduce resentment — both of which are major nervous system drains.' },
  { id: 4,  text: 'Mindfulness',                 icon: '🧘', correct: 'expand',
    explanation: 'Staying present activates your prefrontal cortex, which helps regulate your stress response from the top down.' },
  { id: 5,  text: 'Titration',                   icon: '💧', correct: 'expand',
    explanation: 'Taking challenges in small doses lets your window expand gradually — without tipping into overwhelm.' },
  { id: 6,  text: 'Chronic stress',              icon: '😰', correct: 'constrict',
    explanation: 'Ongoing stress keeps cortisol elevated, which shrinks the zone where you can stay regulated over time.' },
  { id: 7,  text: 'Poor sleep',                  icon: '😴', correct: 'constrict',
    explanation: 'Sleep is when your nervous system resets. Without enough of it, your window narrows significantly each day.' },
  { id: 8,  text: 'Hidden triggers',             icon: '⚡', correct: 'constrict',
    explanation: "Unidentified triggers keep you reactive — you can't prepare or respond to what you haven't named yet." },
  { id: 9,  text: 'Unvoiced boundaries',         icon: '🤐', correct: 'constrict',
    explanation: 'Swallowing your needs builds resentment and internal pressure — both are deeply dysregulating over time.' },
  { id: 10, text: 'Burnout',                     icon: '🔥', correct: 'constrict',
    explanation: "Burnout is your system's forced shutdown after chronic overdraw. The window collapses when reserves run dry." },
  { id: 11, text: 'Unhealed trauma',             icon: '💔', correct: 'constrict',
    explanation: 'Unprocessed trauma keeps your threat-detection system hyperactive, narrowing your window from the inside.' },
]

export const WIDENERS = [
  { icon: '🔄', text: 'Consistent lifestyle rhythms' },
  { icon: '🤝', text: 'Supportive connections' },
  { icon: '🛡️', text: 'Boundaries' },
  { icon: '🧘', text: 'Mindfulness' },
  { icon: '💧', text: 'Titration' },
]

export const CONSTRICTORS = [
  { icon: '😰', text: 'Chronic stress' },
  { icon: '😴', text: 'Poor sleep' },
  { icon: '⚡', text: 'Hidden triggers' },
  { icon: '🤐', text: 'Unvoiced boundaries' },
  { icon: '🔥', text: 'Burnout' },
  { icon: '💔', text: 'Unhealed trauma' },
]

export const ONBOARDING_SLIDES = [
  {
    emoji: '👋',
    title: 'Welcome!',
    text: 'This is your nervous system toolkit — a playful guide to understanding and regulating how you feel.',
  },
  {
    emoji: '🎯',
    title: 'How it works',
    text: 'Start by checking your vibe. A 5-question quiz takes about 30 seconds and opens your personal toolkit.',
  },
  {
    emoji: '🔒',
    title: 'Totally private',
    text: 'Everything you fill in stays right here on your device. No accounts, no data sent anywhere.',
  },
  {
    emoji: '👤',
    title: 'Make it yours',
    text: null, // rendered as input fields
  },
]

export const BREATHING_MODES = {
  down: {
    id: 'down',
    name: '🌊 Down-Regulate',
    label: 'Long Exhale',
    description: '4-1-8 · Activates your rest system',
    color: '#4ECDC4',
    phases: [
      { name: 'Breathe In',  duration: 4000, targetScale: 1.55 },
      { name: 'Hold…',       duration: 1000, targetScale: 1.55 },
      { name: 'Breathe Out', duration: 8000, targetScale: 1.0  },
    ],
  },
  up: {
    id: 'up',
    name: '⚡ Up-Regulate',
    label: 'Crisp Inhale',
    description: '2-2 · Energizing & activating',
    color: '#FF8E53',
    phases: [
      { name: 'Sharp Inhale', duration: 2000, targetScale: 1.55 },
      { name: 'Exhale',       duration: 2000, targetScale: 1.0  },
    ],
  },
}

export const HARBOR_PLACEHOLDERS = [
  'My shoulders start creeping up toward my ears…',
  'I get quiet and stop making eye contact…',
  'I notice I\'m holding my breath…',
  'My jaw feels tight and clenched…',
  'I start talking faster than usual…',
]
