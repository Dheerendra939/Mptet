import { ToolDefinition } from '../../types';

export const PRODUCTIVITY_TOOLS: ToolDefinition[] = [
  {
    id: 'pomodoro-scheduler',
    slug: 'pomodoro-deep-work-planner',
    aliases: ['pomodoro-planner', 'deep-work-timer', 'time-blocking-planner', 'focus-intervals'],
    number: '43',
    category: 'Productivity',
    title: 'Pomodoro Focus & Deep Work Planner',
    shortDescription: 'Calculates optimal focus blocks, short/long rest breaks, and time-block agendas to achieve 4+ hours of uninterrupted deep work.',
    searchVolumeBadge: 'Productivity Top Pick',
    accentColor: 'from-rose-500 to-amber-500',
    badgeColor: 'text-rose-400 border-rose-500/30 bg-rose-950/40',
    iconName: 'Clock',
    seoTitle: 'Free Pomodoro Focus & Deep Work Interval Planner - Time Blocking',
    seoDescription: 'Plan your day using scientific Pomodoro cycles and Cal Newport Deep Work time blocks. Prevent burnout with balanced rest and high-energy intervals.',
    seoKeywords: ['pomodoro planner online', 'deep work interval scheduler', 'time blocking planner', 'focus break calculator'],
    longTailKeywords: ['how to schedule 4 hours of deep work with pomodoro technique', 'optimal rest break duration between 50 minute focus blocks'],
    presets: [
      { label: '4-Hour Deep Work Sprint (50 min work / 10 min break)', values: { totalTimeAvailable: '4 Hours', taskGoal: 'Finish writing technical architecture document and review pull requests', cycleStyle: '50 min Deep Work / 10 min Break' } }
    ],
    fields: [
      { name: 'totalTimeAvailable', label: 'Total Available Focus Time', type: 'select', defaultValue: '4 Hours', options: [
        { label: '2 Hours (Quick Sprint)', value: '2 Hours' },
        { label: '4 Hours (Optimal Deep Work Block)', value: '4 Hours' },
        { label: '6 Hours (Full Day Schedule)', value: '6 Hours' },
        { label: '8 Hours (Comprehensive Daily Agenda)', value: '8 Hours' }
      ]},
      { name: 'taskGoal', label: 'Primary Focus Objective', type: 'text', defaultValue: 'Write chapter 1 of my book and outline the key characters', required: true },
      { name: 'cycleStyle', label: 'Focus / Rest Interval Ratio', type: 'select', defaultValue: '50 min Deep Work / 10 min Break (High Depth)', options: [
        { label: '25 min Work / 5 min Rest (Classic Pomodoro)', value: 'Classic 25/5' },
        { label: '50 min Work / 10 min Rest (High Depth & Flow)', value: 'Flow 50/10' },
        { label: '90 min Work / 20 min Rest (Ultradian Rhythm)', value: 'Ultradian 90/20' }
      ]}
    ],
    calculatePreview: (values) => {
      const hours = parseInt(String(values.totalTimeAvailable || '4'), 10) || 4;
      const totalMinutes = hours * 60;
      const cycleStyle = String(values.cycleStyle || '');
      const is50 = cycleStyle.includes('50');
      const is90 = cycleStyle.includes('90');
      const workLen = is90 ? 90 : (is50 ? 50 : 25);
      const breakLen = is90 ? 20 : (is50 ? 10 : 5);
      const totalCycle = workLen + breakLen;
      const cycles = Math.floor(totalMinutes / totalCycle);
      const totalWorkTime = cycles * workLen;
      const totalBreakTime = cycles * breakLen;

      return [
        { label: 'Complete Focus Cycles', value: `${cycles} Cycles`, highlight: true },
        { label: 'Pure Productive Focus Time', value: `${totalWorkTime} Minutes` },
        { label: 'Restorative Break Time', value: `${totalBreakTime} Minutes` }
      ];
    },
    compilePrompt: (values) => `Act as an executive productivity coach. Build a timestamped daily deep work agenda for ${values.totalTimeAvailable} dedicated to: "${values.taskGoal}" using the ${values.cycleStyle} methodology.\n1. Exact timestamped schedule (09:00 - 09:50 Work, etc.).\n2. Neurobiology-based rules for break periods (avoid dopamine doomscrolling, hydration, physical movement).\n3. Tactics to overcome task resistance and enter flow state within 3 minutes.`,
    howToSteps: [
      { name: 'Choose Focus Duration', text: 'Select how many hours you have available today.' },
      { name: 'Pick Rhythm', text: 'Choose classic 25/5, high-depth 50/10, or ultradian 90/20.' },
      { name: 'Get Timestamped Plan', text: 'Click Search via AI Mode for a structured deep work agenda.' }
    ],
    faqs: [
      { question: 'Why is 90 minutes considered the natural human focus limit?', answer: 'The human brain operates on 90-minute ultradian cycles during both sleep (REM) and waking alertness before energy naturally dips.' }
    ],
    keyFeatures: ['Interactive Cycle & Rest Math Preview', 'Ultradian Rhythm Compatibility', 'Dopamine-Safe Break Protocols'],
    whyAIMode: 'AI Search integrates cognitive science research on cognitive fatigue mitigation.'
  },
  {
    id: 'meeting-minutes',
    slug: 'meeting-minutes-action-item-extractor',
    aliases: ['meeting-minutes', 'action-items', 'meeting-summary', 'meeting-notes-organizer'],
    number: '44',
    category: 'Productivity',
    title: 'Meeting Minutes & Action Item Extractor',
    shortDescription: 'Transforms unstructured meeting notes or transcripts into executive summaries, decisions made, and assigned action item lists.',
    searchVolumeBadge: 'Workplace Essential',
    accentColor: 'from-blue-500 to-teal-400',
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-950/40',
    iconName: 'CheckSquare',
    seoTitle: 'Free Meeting Minutes & Action Item Extractor - Clean Meeting Notes',
    seoDescription: 'Convert rough meeting notes and call transcripts into clear minutes. Extracts key decisions, owner-assigned action items, and next steps.',
    seoKeywords: ['meeting minutes generator', 'action item extractor', 'meeting summary tool', 'executive meeting notes maker'],
    longTailKeywords: ['how to turn messy meeting transcript into clear action items with owners and deadlines', 'board meeting minutes executive format'],
    presets: [
      { label: 'Weekly Product Sprint Standup Notes', values: { rawNotes: 'Alex says auth bug is fixed and in QA. Maya needs review on Figma checkout flow by Wednesday. David confirmed Stripe fees increase next month. We decided to delay Android launch by 1 week to fix push notifications. Alex will message DevOps.', meetingTitle: 'Product & Engineering Sprint Alignment' } }
    ],
    fields: [
      { name: 'meetingTitle', label: 'Meeting Title & Purpose', type: 'text', defaultValue: 'Q3 Product Roadmap & Budget Review', required: true },
      { name: 'rawNotes', label: 'Paste Rough Meeting Notes or Transcript', type: 'textarea', defaultValue: 'Discussed marketing budget. Sarah proposed shifting $10k from Google Ads to LinkedIn. Tom agreed if CPA stays under $45. We approved the shift starting Nov 1. Sarah will update the spreadsheet by Friday. Tom to inform the agency.', required: true }
    ],
    compilePrompt: (values) => `Act as an executive chief of staff. Transform these rough notes from "${values.meetingTitle}":\n\n"""\n${values.rawNotes}\n"""\n\nOutput in a clean corporate briefing format:\n1. 2-sentence Executive Summary.\n2. Official Decisions Made.\n3. Action Items Table with columns: [Action Item, Assigned Owner, Target Deadline, Priority].\n4. Open Questions or Topics deferred to the next meeting.`,
    howToSteps: [
      { name: 'Paste Rough Jottings', text: 'Enter bullet points, scribbles, or raw speech-to-text transcripts.' },
      { name: 'Add Meeting Context', text: 'Provide the title and meeting objectives.' },
      { name: 'Export Executive Minutes', text: 'Click Search via AI Mode for owner-assigned action item tables.' }
    ],
    faqs: [
      { question: 'Why are clear action item owners critical for meetings?', answer: 'Without a single named owner and deadline, action items suffer from the bystander effect and rarely get executed.' }
    ],
    keyFeatures: ['Owner & Deadline Table Extraction', 'Official Decision Log', 'Deferred Questions Section'],
    whyAIMode: 'AI Search Mode disambiguates informal spoken references into formal business accountability.'
  },
  {
    id: 'habit-builder',
    slug: 'habit-routine-builder',
    aliases: ['habit-tracker', 'routine-builder', 'atomic-habits-planner', 'habit-stacking'],
    number: '45',
    category: 'Productivity',
    title: 'Daily Habit Tracker & 21-Day Routine Builder',
    shortDescription: 'Designs friction-free morning/evening routines and habit stacking loops based on James Clear’s Atomic Habits methodology.',
    searchVolumeBadge: 'Personal Development Trend',
    accentColor: 'from-amber-400 to-emerald-500',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
    iconName: 'Target',
    seoTitle: 'Free Daily Habit Routine Builder - Atomic Habits Habit Stacking Planner',
    seoDescription: 'Build sticky daily habits using habit stacking: "After [Current Habit], I will [New Habit]". 21-day progressive habit calendar generator.',
    seoKeywords: ['habit routine builder', 'atomic habits planner', 'habit stacking generator', 'daily morning routine planner'],
    longTailKeywords: ['how to build morning routine for high energy atomic habits', 'habit stacking examples for busy working professionals'],
    presets: [
      { label: 'Energizing Morning Routine (30 Minutes)', values: { desiredHabits: 'Drink 500ml water with electrolytes, 10 minutes sunlight walking, 5 minutes box breathing, no phone for first 30 minutes', routineWindow: 'Morning Routine' } }
    ],
    fields: [
      { name: 'desiredHabits', label: 'What habits do you want to build or replace?', type: 'textarea', defaultValue: 'Read 15 pages of a book every night, journal 3 gratitudes, and stop scrolling social media in bed.', required: true },
      { name: 'routineWindow', label: 'Time of Day', type: 'select', defaultValue: 'Evening / Wind-Down Routine', options: [
        { label: 'Morning Routine (Awakening & Focus)', value: 'Morning Routine' },
        { label: 'Workday Transition / Shutdown Routine', value: 'Work Shutdown' },
        { label: 'Evening / Wind-Down Routine (Sleep Prep)', value: 'Evening Routine' }
      ]}
    ],
    compilePrompt: (values) => `Act as a behavioral psychologist and habit formation coach (Atomic Habits framework). Build a 21-day routine for: "${values.desiredHabits}" during the ${values.routineWindow}.\n1. Apply Habit Stacking: Formulate statements: "After [Established Anchor], I will [Micro-Habit]".\n2. The 2-Minute Rule version to overcome initial starting friction.\n3. Environment design tweaks (make good habits obvious, bad habits invisible).\n4. A 21-day progressive milestone tracker.`,
    howToSteps: [
      { name: 'List Desired Habits', text: 'Specify habits like hydration, reading, stretching, or meditation.' },
      { name: 'Pick Routine Window', text: 'Select morning, work shutdown, or evening wind-down.' },
      { name: 'Receive Stacking System', text: 'Click Search via AI Mode for anchored habit loops and 2-minute starter versions.' }
    ],
    faqs: [
      { question: 'What is the "2-Minute Rule" in habit building?', answer: 'Scale down any habit until it takes less than 2 minutes to do (e.g. "Read 1 page" instead of "Read 30 minutes"), making failure impossible.' }
    ],
    keyFeatures: ['Anchor Habit Stacking Formulas', '2-Minute Starter Rule Variants', 'Environment Friction Optimization'],
    whyAIMode: 'AI Search balances psychological friction to prevent the common day-4 routine collapse.'
  },
  {
    id: 'language-coach',
    slug: 'language-translation-coach',
    aliases: ['language-coach', 'idiomatic-translation', 'slang-explainer', 'polyglot-helper'],
    number: '46',
    category: 'Education',
    title: 'Language Translation & Idiomatic Phrasing Coach',
    shortDescription: 'Translates text beyond word-for-word literal phrasing into authentic local idioms, cultural nuances, and conversational dialect.',
    searchVolumeBadge: 'Language Learning Top Pick',
    accentColor: 'from-cyan-400 to-blue-500',
    badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40',
    iconName: 'Globe',
    seoTitle: 'Free AI Idiomatic Language Translator & Culture Coach - Natural Phrasing',
    seoDescription: 'Translate text into natural, native-sounding idioms in Spanish, French, German, Japanese, and 50+ languages. Explains cultural etiquette.',
    seoKeywords: ['idiomatic language translator', 'natural language phrasing coach', 'slang translator online', 'conversational translation tool'],
    longTailKeywords: ['how to translate english idiom naturally into conversational spanish', 'business etiquette email translation japanese formal'],
    presets: [
      { label: 'English to Conversational Spanish (Latin America)', values: { phraseToTranslate: 'Let us cut to the chase and get straight to the point.', sourceLanguage: 'English', targetLanguage: 'Spanish (Latin America)', contextSetting: 'Casual Business Negotiation' } }
    ],
    fields: [
      { name: 'phraseToTranslate', label: 'Phrase, Idiom, or Paragraph to Translate', type: 'textarea', defaultValue: 'I am feeling under the weather today so I will probably take a rain check on dinner tonight.', required: true },
      { name: 'targetLanguage', label: 'Target Language & Regional Dialect', type: 'text', defaultValue: 'Spanish (Castilian / Spain)', required: true },
      { name: 'contextSetting', label: 'Social Context / Formality', type: 'select', defaultValue: 'Friendly & Informal (Casual Peers)', options: [
        { label: 'Friendly & Informal (Casual Peers)', value: 'Casual Peers' },
        { label: 'Polite Business Professional', value: 'Business Professional' },
        { label: 'High Formal & Diplomatic', value: 'High Formal' },
        { label: 'Local Street Slang & Youth Dialect', value: 'Street Slang' }
      ]}
    ],
    compilePrompt: (values) => `Act as an expert native linguist and cultural translator. Translate: "${values.phraseToTranslate}" into ${values.targetLanguage} for a ${values.contextSetting} setting.\n1. Provide the most authentic, natural native translation (avoiding robotic word-for-word translation).\n2. Explain cultural nuances, literal meanings, and local idioms used.\n3. Provide pronunciation phonetic guide.\n4. Give 1 formal alternative and 1 ultra-casual slang alternative.`,
    howToSteps: [
      { name: 'Enter Idiom or Text', text: 'Type any phrase with metaphors or colloquial expressions.' },
      { name: 'Select Target Dialect', text: 'Specify country or region (e.g. Mexican Spanish vs Spain Spanish).' },
      { name: 'Get Native Phrasing', text: 'Click Search via AI Mode for cultural context and pronunciation guides.' }
    ],
    faqs: [
      { question: 'Why do standard translators fail on idioms?', answer: 'Literal translation translates individual words rather than the cultural concept, often producing absurd or offensive phrases.' }
    ],
    keyFeatures: ['Regional Dialect Specialization', 'Cultural Etiquette Notes', 'Phonetic Pronunciation Aid'],
    whyAIMode: 'AI Search captures modern conversational slang evolving on social media.'
  },
  {
    id: 'study-flashcards',
    slug: 'study-flashcards-generator',
    aliases: ['study-flashcards', 'active-recall', 'quiz-generator', 'spaced-repetition'],
    number: '47',
    category: 'Education',
    title: 'Study Flashcard & Active Recall Question Generator',
    shortDescription: 'Converts lecture notes, textbook chapters, or articles into spaced-repetition Q&A flashcards and active recall test prompts.',
    searchVolumeBadge: 'Student #1 Utility',
    accentColor: 'from-indigo-400 to-purple-500',
    badgeColor: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/40',
    iconName: 'BookOpen',
    seoTitle: 'Free AI Study Flashcard & Active Recall Generator - Anki Compatible',
    seoDescription: 'Transform study notes into active recall flashcards and quiz questions. Compatible with Anki and Quizlet spaced-repetition formats.',
    seoKeywords: ['study flashcard generator', 'active recall question maker', 'anki card generator online', 'quizlet flashcard maker ai'],
    longTailKeywords: ['how to turn biology lecture notes into anki flashcards with cloze deletions', 'active recall questions for medical exam study'],
    presets: [
      { label: 'Cellular Respiration Biology Notes', values: { studyMaterial: 'Cellular respiration consists of Glycolysis in the cytoplasm (anaerobic, produces 2 ATP and 2 NADH), the Krebs cycle in the mitochondrial matrix (produces 2 ATP, 6 NADH, 2 FADH2), and the Electron Transport Chain in the inner membrane (produces ~34 ATP via ATP synthase).', cardFormat: 'Anki Front / Back Q&A Pairs' } }
    ],
    fields: [
      { name: 'studyMaterial', label: 'Paste Lecture Notes, Study Guide, or Book Excerpt', type: 'textarea', defaultValue: 'The US Federal Reserve conducts monetary policy primarily through three tools: Open Market Operations (buying and selling government bonds to affect the Federal Funds Rate), the Discount Rate (interest rate charged to commercial banks), and Reserve Requirements.', required: true },
      { name: 'cardFormat', label: 'Flashcard Style', type: 'select', defaultValue: 'Front / Back Question & Answer (Direct Recall)', options: [
        { label: 'Front / Back Question & Answer (Direct Recall)', value: 'Front/Back Q&A' },
        { label: 'Cloze Deletion (Fill in the blanks: {{c1::keyword}})', value: 'Cloze Deletion' },
        { label: 'Multiple Choice Concept Test with Distractors', value: 'Multiple Choice' }
      ]}
    ],
    compilePrompt: (values) => `Act as an elite cognitive science tutor. Transform this study material into high-yield spaced repetition flashcards in ${values.cardFormat} format:\n\n"""\n${values.studyMaterial}\n"""\n\nRules:\n1. Adhere to the Minimum Information Principle (one bite-sized concept per card to avoid recognition illusion).\n2. Write questions that force active recall retrieval rather than passive recognition.\n3. Include a memorable mnemonic or analogy for difficult concepts.`,
    howToSteps: [
      { name: 'Paste Study Text', text: 'Enter slides, notes, or textbook definitions.' },
      { name: 'Choose Flashcard Format', text: 'Select traditional Q&A, Cloze deletion, or multiple choice.' },
      { name: 'Copy to Anki / Quizlet', text: 'Click Search via AI Mode for clean, export-ready flashcard decks.' }
    ],
    faqs: [
      { question: 'What is the "Minimum Information Principle" in flashcards?', answer: 'Formulated by SuperMemo creator Piotr Wozniak: flashcards must be as simple as possible to maximize memory consolidation speed.' }
    ],
    keyFeatures: ['Minimum Information Principle', 'Anki Cloze Deletion Formatting', 'Mnemonic Generation Engine'],
    whyAIMode: 'AI Search Mode prioritizes concepts most frequently tested on standardized exams (MCAT, USMLE, SAT).'
  },
  {
    id: 'book-summarizer',
    slug: 'book-summary-extractor',
    aliases: ['book-summarizer', 'book-key-ideas', 'non-fiction-summary', 'blinkist-style'],
    number: '48',
    category: 'Productivity',
    title: 'Book Summary & Main Concept Extractor',
    shortDescription: 'Distills popular non-fiction books and biographies into 5 core mental models, memorable stories, and actionable implementation habits.',
    searchVolumeBadge: 'Reading Booster',
    accentColor: 'from-emerald-500 to-teal-400',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
    iconName: 'BookOpen',
    seoTitle: 'Free AI Book Summary Generator - 5 Core Mental Models & Key Takeaways',
    seoDescription: 'Get instant 5-minute executive summaries of best-selling business, psychology, and personal development books. Actionable habits and core thesis.',
    seoKeywords: ['book summary generator', 'book key ideas ai', 'blinkist style summary free', 'non fiction book summary online'],
    longTailKeywords: ['summary of thinking fast and slow core mental models', '5 key takeaways from principles by ray dalio'],
    presets: [
      { label: 'Thinking, Fast and Slow (Daniel Kahneman)', values: { bookTitle: 'Thinking, Fast and Slow by Daniel Kahneman', focusArea: 'Cognitive biases affecting financial and leadership decisions' } },
      { label: 'The Psychology of Money (Morgan Housel)', values: { bookTitle: 'The Psychology of Money by Morgan Housel', focusArea: 'Timeless lessons on wealth, greed, and happiness' } }
    ],
    fields: [
      { name: 'bookTitle', label: 'Book Title and Author', type: 'text', defaultValue: 'Atomic Habits by James Clear', required: true },
      { name: 'focusArea', label: 'Specific Focus or Practical Application', type: 'text', defaultValue: 'How to apply the 4 laws of behavior change to career productivity' }
    ],
    compilePrompt: (values) => `Act as an executive book analyst. Provide a master-level distillation of "${values.bookTitle}" with focus on "${values.focusArea}".\n1. The One Big Idea (Core Thesis in 2 sentences).\n2. 5 Primary Mental Models / Frameworks explained with illustrative examples from the book.\n3. 3 Unconventional or Counter-Intuitive Insights.\n4. A 1-Week Actionable Implementation Checklist.`,
    howToSteps: [
      { name: 'Enter Book & Author', text: 'Type any famous business, science, or self-help book.' },
      { name: 'Specify Your Interest', text: 'Focus on leadership, investing, habits, or psychology.' },
      { name: 'Read Executive Brief', text: 'Click Search via AI Mode for mental models and implementation checklists.' }
    ],
    faqs: [
      { question: 'Does this summarize fiction as well as non-fiction?', answer: 'Yes, but it is especially powerful for non-fiction where it extracts actionable frameworks and decision heuristics.' }
    ],
    keyFeatures: ['Core Thesis Distillation', '5 Mental Model Deconstructions', 'Actionable 1-Week Habit Checklist'],
    whyAIMode: 'AI Search synthesizes author podcast interviews and updated lectures alongside the book text.'
  },
  {
    id: 'timezone-planner',
    slug: 'timezone-meeting-planner',
    aliases: ['timezone-planner', 'world-clock-meeting', 'remote-team-meeting', 'time-zone-converter'],
    number: '49',
    category: 'Productivity',
    title: 'Time Zone Meeting Planner & World Clock',
    shortDescription: 'Finds optimal overlapping business hours across global cities (San Francisco, London, Tokyo, Bangalore) to schedule fair meetings.',
    searchVolumeBadge: 'Remote Work Utility',
    accentColor: 'from-blue-400 to-indigo-500',
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-950/40',
    iconName: 'Clock',
    seoTitle: 'Free Global Time Zone Meeting Planner - Overlapping Business Hours',
    seoDescription: 'Find fair meeting overlap times across multiple time zones. Plan calls across US, Europe, India, and Asia without anyone waking up at 3 AM.',
    seoKeywords: ['timezone meeting planner', 'world clock meeting scheduler', 'cross timezone call planner', 'remote team overlap hours'],
    longTailKeywords: ['best meeting time between san francisco london and bangalore', 'how to find fair working hours overlap across 3 timezones'],
    presets: [
      { label: 'San Francisco (PST) + London (GMT) + India (IST)', values: { cities: 'San Francisco (US PST), London (UK GMT), Bengaluru (India IST)', preferredWindow: 'Normal Business Working Hours (08:00 - 18:00 local)' } }
    ],
    fields: [
      { name: 'cities', label: 'Participant Cities or Time Zones', type: 'text', defaultValue: 'New York (EST), London (GMT), Tokyo (JST)', required: true },
      { name: 'preferredWindow', label: 'Scheduling Constraint', type: 'select', defaultValue: 'Fair Overlap (No one meeting before 07:00 or after 21:00)', options: [
        { label: 'Fair Overlap (No one meeting before 07:00 or after 21:00)', value: 'Fair Overlap' },
        { label: 'Strict Business Hours Only (09:00 - 17:00 for all)', value: 'Strict Business' },
        { label: 'Asynchronous Alternative (Recommend Loom or Slack update)', value: 'Async Alternative' }
      ]}
    ],
    compilePrompt: (values) => `Act as an international operations coordinator. Find optimal meeting slots across: ${values.cities} with constraint: ${values.preferredWindow}.\n1. Calculate current UTC offsets including Daylight Saving Time differences.\n2. Present a side-by-side time comparison table (Hour by Hour from 07:00 UTC to 23:00 UTC).\n3. Recommend the 2 best "Golden Overlap Windows" and identify which participant makes the smallest sacrifice.\n4. If impossible, propose an asynchronous collaboration format.`,
    howToSteps: [
      { name: 'Enter Cities', text: 'Type cities like New York, London, Tokyo, Sydney.' },
      { name: 'Choose Constraint', text: 'Select fair overlap or strict 9-to-5 bounds.' },
      { name: 'See Overlap Table', text: 'Click Search via AI Mode for hour-by-hour cross-timezone conversion.' }
    ],
    faqs: [
      { question: 'How do Daylight Saving Time (DST) shifts affect meetings?', answer: 'Countries shift clocks on different Sundays in March and October/November, temporarily changing offsets by 1-2 hours.' }
    ],
    keyFeatures: ['Daylight Saving Time (DST) Awareness', 'Golden Overlap Hour Highlighting', 'Async Collaboration Recommendations'],
    whyAIMode: 'AI Search verifies current live timezone offsets and exact DST transition calendar dates.'
  },
  {
    id: 'unit-converter-analogies',
    slug: 'unit-converter-analogies',
    aliases: ['unit-converter', 'metric-imperial-converter', 'measurement-converter'],
    number: '50',
    category: 'Utilities',
    title: 'Unit Converter with Real-World Analogies',
    shortDescription: 'Converts metric to imperial units (kg to lbs, meters to feet, Celsius to Fahrenheit) with relatable real-world physical comparisons.',
    searchVolumeBadge: 'Everyday Calculator',
    accentColor: 'from-teal-400 to-sky-500',
    badgeColor: 'text-teal-400 border-teal-500/30 bg-teal-950/40',
    iconName: 'Wrench',
    seoTitle: 'Free Unit Converter with Real-World Analogies - Metric to Imperial',
    seoDescription: 'Convert kilometers, kilograms, Celsius, and square feet instantly. Features relatable physical analogies (football fields, elephants, Boeing 747s).',
    seoKeywords: ['unit converter online', 'metric to imperial calculator', 'relatable unit conversion', 'meters to feet with analogy'],
    longTailKeywords: ['how much is 100 square meters in square feet with visual analogy', 'celsius to fahrenheit conversion mental math trick'],
    presets: [
      { label: '85 Kilograms to Pounds', values: { inputValue: '85', fromUnit: 'Kilograms (kg)', toUnit: 'Pounds (lbs)' } },
      { label: '3500 Square Feet to Square Meters', values: { inputValue: '3500', fromUnit: 'Square Feet (sq ft)', toUnit: 'Square Meters (sq m)' } }
    ],
    fields: [
      { name: 'inputValue', label: 'Value to Convert', type: 'text', defaultValue: '100', required: true },
      { name: 'fromUnit', label: 'Source Unit', type: 'text', defaultValue: 'Kilometers (km)', required: true },
      { name: 'toUnit', label: 'Target Unit', type: 'text', defaultValue: 'Miles (mi)', required: true }
    ],
    compilePrompt: (values) => `Perform an exact mathematical unit conversion from ${values.inputValue} ${values.fromUnit} to ${values.toUnit}.\n1. Exact numerical result with step-by-step conversion formula.\n2. A quick mental-math approximation trick to calculate this in your head.\n3. 3 vivid, relatable real-world physical analogies (e.g. "equivalent to the weight of 3 adult grizzly bears" or "the length of 12 city buses").`,
    howToSteps: [
      { name: 'Enter Number', text: 'Type the value you want to convert.' },
      { name: 'Set Units', text: 'Specify source and target measurement systems.' },
      { name: 'See Relatable Analogy', text: 'Click Search via AI Mode for exact numbers and mental math tricks.' }
    ],
    faqs: [
      { question: 'What is a quick mental math trick for Celsius to Fahrenheit?', answer: 'Double the Celsius figure and add 30 for a quick rough estimation in your head (e.g., 20°C × 2 = 40 + 30 ≈ 70°F, actual is 68°F).' }
    ],
    keyFeatures: ['Mental Math Shortcut Formulas', 'Physical Real-World Analogies', 'Metric and Imperial Universal Support'],
    whyAIMode: 'AI Search provides physical benchmarks based on verified architectural and biological data.'
  },
  {
    id: 'travel-itinerary',
    slug: 'travel-itinerary-packing-generator',
    aliases: ['travel-itinerary', 'trip-planner', 'packing-checklist', 'vacation-planner'],
    number: '51',
    category: 'Productivity',
    title: 'Travel Itinerary & Packing Checklist Generator',
    shortDescription: 'Generates hour-by-hour destination travel itineraries, weather-optimized packing lists, and local hidden gem recommendations.',
    searchVolumeBadge: 'Travel Trend',
    accentColor: 'from-amber-400 to-rose-400',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
    iconName: 'Compass',
    seoTitle: 'Free AI Travel Itinerary & Packing List Generator - Day-by-Day Plan',
    seoDescription: 'Plan your trip with day-by-day itineraries, morning/afternoon/evening routing, localized packing lists, and hidden culinary gems.',
    seoKeywords: ['travel itinerary generator', 'trip planner ai', 'packing checklist generator', 'vacation day by day itinerary'],
    longTailKeywords: ['5 day tokyo itinerary with food recommendations and train pass guide', 'minimalist carry on packing list for 2 weeks in europe'],
    presets: [
      { label: '5 Days in Tokyo, Japan (Culture & Food)', values: { destination: 'Tokyo, Japan', durationDays: '5 Days', travelStyle: 'Foodie & Cultural Explorer', season: 'Autumn (October - November)' } },
      { label: '7 Days in Amalfi Coast, Italy', values: { destination: 'Amalfi Coast, Italy', durationDays: '7 Days', travelStyle: 'Scenic Relaxation & Coastal Walks', season: 'Summer (June)' } }
    ],
    fields: [
      { name: 'destination', label: 'Destination City or Region', type: 'text', defaultValue: 'Barcelona, Spain', required: true },
      { name: 'durationDays', label: 'Trip Duration', type: 'select', defaultValue: '4 Days', options: [
        { label: '3 Days (Weekend Getaway)', value: '3 Days' },
        { label: '4 Days (City Break)', value: '4 Days' },
        { label: '7 Days (Full Week Experience)', value: '7 Days' },
        { label: '14 Days (Grand Tour)', value: '14 Days' }
      ]},
      { name: 'travelStyle', label: 'Travel Personality', type: 'select', defaultValue: 'Culture, Architecture & Local Gastronomy', options: [
        { label: 'Culture, Architecture & Local Gastronomy', value: 'Culture & Food' },
        { label: 'Budget Backpacker & Public Transit', value: 'Budget Explorer' },
        { label: 'Luxury & Boutique Relaxation', value: 'Luxury Relaxation' },
        { label: 'Adventure & Outdoor Hiking', value: 'Adventure' }
      ]},
      { name: 'season', label: 'Travel Season / Month', type: 'text', defaultValue: 'Spring (May)' }
    ],
    compilePrompt: (values) => `Act as an expert local travel concierge. Create a detailed travel plan for ${values.durationDays} in ${values.destination} for a ${values.travelStyle} trip during ${values.season}.\n1. Day-by-day itinerary (Morning, Afternoon, Evening) geographically grouped to minimize commute.\n2. 3 authentic local culinary dishes and restaurant neighborhoods (avoiding tourist traps).\n3. Practical local transit advice (passes, metro cards).\n4. Tailored packing checklist categorized by Clothing, Gear, and Documents.`,
    howToSteps: [
      { name: 'Choose Destination', text: 'Enter any city, national park, or island.' },
      { name: 'Select Duration & Style', text: 'Pick your vacation length and travel vibe.' },
      { name: 'Explore Itinerary', text: 'Click Search via AI Mode for neighborhood-clustered routes and packing lists.' }
    ],
    faqs: [
      { question: 'Why does geographic clustering save travel time?', answer: 'Grouping attractions by neighborhood avoids spending hours zigzagging across town on public transit.' }
    ],
    keyFeatures: ['Geographic Transit Clustering', 'Tourist Trap Avoidance Guide', 'Weather-Specific Packing Matrix'],
    whyAIMode: 'AI Search brings up current museum opening hours, reservation deadlines, and local transit tips.'
  },
  {
    id: 'smart-goals',
    slug: 'smart-goal-planner',
    aliases: ['smart-goals', 'goal-setting', 'milestone-planner', 'okr-generator'],
    number: '52',
    category: 'Productivity',
    title: 'SMART Goal Setter & Milestone Breakdown',
    shortDescription: 'Transforms vague aspirations into Specific, Measurable, Achievable, Relevant, and Time-bound (SMART) goals with weekly sprint milestones.',
    searchVolumeBadge: 'Success Framework',
    accentColor: 'from-emerald-400 to-cyan-500',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
    iconName: 'Target',
    seoTitle: 'Free SMART Goal Planner & OKR Generator - Milestone Breakdown',
    seoDescription: 'Turn abstract ambitions into actionable SMART goals and OKRs (Objectives and Key Results). Weekly milestones and obstacle mitigation plans.',
    seoKeywords: ['smart goal planner', 'smart goal generator online', 'okr generator free', 'goal breakdown milestone tool'],
    longTailKeywords: ['how to write a smart goal for increasing sales revenue', 'turn fitness goal into smart goal with milestones'],
    presets: [
      { label: 'Run a Half Marathon in 6 Months', values: { rawAspiration: 'I want to get fit and finish my first half marathon without stopping to walk.', timeframe: '6 Months' } },
      { label: 'Launch SaaS and hit $2,000 MRR', values: { rawAspiration: 'Build and launch my micro-SaaS software tool and acquire 40 paying subscribers.', timeframe: '90 Days' } }
    ],
    fields: [
      { name: 'rawAspiration', label: 'What is your goal or aspiration in your own words?', type: 'textarea', defaultValue: 'I want to read more books this year and stop wasting time on my phone.', required: true },
      { name: 'timeframe', label: 'Target Completion Timeframe', type: 'select', defaultValue: '90 Days (Quarterly Sprints)', options: [
        { label: '30 Days (Immediate Sprint)', value: '30 Days' },
        { label: '90 Days (Quarterly Sprint - Recommended)', value: '90 Days' },
        { label: '6 Months (Mid-term transformation)', value: '6 Months' },
        { label: '1 Year (Annual Big Rock)', value: '1 Year' }
      ]}
    ],
    compilePrompt: (values) => `Act as an executive executive performance coach. Transform this aspiration: "${values.rawAspiration}" over a ${values.timeframe} timeframe into a rigorous SMART goal system:\n1. Specific: Crisp, unambiguous objective statement.\n2. Measurable: Exact numerical Key Performance Indicators (KPIs).\n3. Achievable: Reality-check validation.\n4. Relevant: Core "Why" connection.\n5. Time-bound: Hard calendar deadline.\n6. Week-by-Week Milestone Roadmap.\n7. Pre-Mortem: Anticipate the top 3 obstacles and define If-Then mitigation rules.`,
    howToSteps: [
      { name: 'State Aspiration', text: 'Write down your health, financial, or career ambition.' },
      { name: 'Select Horizon', text: 'Choose 30 days, 90 days, or 1 year.' },
      { name: 'Get SMART Roadmap', text: 'Click Search via AI Mode for weekly sprints and obstacle pre-mortems.' }
    ],
    faqs: [
      { question: 'What is a "Pre-Mortem" in goal planning?', answer: 'Assuming in advance that the goal has failed 3 months from now, identifying what caused that failure, and preventing it proactively.' }
    ],
    keyFeatures: ['SMART 5-Pillar Deconstruction', 'Pre-Mortem Obstacle Defense', 'Weekly Sprint Milestone Tracking'],
    whyAIMode: 'AI Search Mode models proven milestone pacing from high-performing case studies.'
  }
];
