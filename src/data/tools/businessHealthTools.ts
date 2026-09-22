import { ToolDefinition } from '../../types';

export const BUSINESS_HEALTH_TOOLS: ToolDefinition[] = [
  {
    id: 'saas-ltv-churn',
    slug: 'saas-churn-ltv-calculator',
    aliases: ['saas-metrics', 'ltv-calculator', 'churn-rate-calculator', 'cac-ratio'],
    number: '53',
    category: 'Business',
    title: 'SaaS Churn Rate & Customer Lifetime Value (LTV)',
    shortDescription: 'Calculates monthly/annual churn rates, customer lifetime value (LTV), and LTV:CAC payback ratios for subscription businesses.',
    searchVolumeBadge: 'Startup Metric #1',
    accentColor: 'from-blue-600 to-indigo-500',
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-950/40',
    iconName: 'PieChart',
    seoTitle: 'Free SaaS Churn Rate & LTV Calculator - Customer Lifetime Value',
    seoDescription: 'Calculate customer churn rate, Lifetime Value (LTV), average customer lifespan, and LTV to CAC ratios for SaaS subscription businesses.',
    seoKeywords: ['saas churn calculator', 'customer lifetime value calculator', 'saas ltv to cac ratio', 'subscription revenue metrics'],
    longTailKeywords: ['how to calculate customer lifetime value with monthly churn rate', 'what is a healthy ltv to cac ratio for b2b saas'],
    presets: [
      { label: 'B2B SaaS ($120/mo ARPU, 3% churn, $800 CAC)', values: { arpu: '120', grossMargin: '80', churnRate: '3', cac: '800' } },
      { label: 'Consumer App ($15/mo ARPU, 6% churn, $45 CAC)', values: { arpu: '15', grossMargin: '75', churnRate: '6', cac: '45' } }
    ],
    fields: [
      { name: 'arpu', label: 'Average Revenue Per User / Mo (ARPU in $)', type: 'text', defaultValue: '100', required: true },
      { name: 'grossMargin', label: 'Gross Margin Percentage (%)', type: 'text', defaultValue: '80', required: true },
      { name: 'churnRate', label: 'Monthly Customer Churn Rate (%)', type: 'text', defaultValue: '3.5', required: true },
      { name: 'cac', label: 'Customer Acquisition Cost (CAC in $)', type: 'text', defaultValue: '650' }
    ],
    calculatePreview: (values) => {
      const arpu = parseFloat(String(values.arpu || '100')) || 100;
      const margin = (parseFloat(String(values.grossMargin || '80')) || 80) / 100;
      const churn = (parseFloat(String(values.churnRate || '3.5')) || 3.5) / 100;
      const cac = parseFloat(String(values.cac || '650')) || 0;

      const lifespanMonths = churn > 0 ? 1 / churn : 0;
      const ltv = churn > 0 ? (arpu * margin) / churn : 0;
      const ratio = cac > 0 ? (ltv / cac).toFixed(1) : 'N/A';

      return [
        { label: 'Customer Lifetime Value (LTV)', value: `$${Math.round(ltv).toLocaleString()}`, highlight: true },
        { label: 'Average Customer Lifespan', value: `${lifespanMonths.toFixed(1)} Months` },
        { label: 'LTV : CAC Health Ratio', value: `${ratio}:1` }
      ];
    },
    compilePrompt: (values) => `Act as a venture capital SaaS partner. Analyze these unit economics: ARPU: $${values.arpu}/mo, Gross Margin: ${values.grossMargin}%, Monthly Churn: ${values.churnRate}%, CAC: $${values.cac}.\n1. Calculate LTV, Average Lifespan, and LTV:CAC ratio.\n2. Benchmark against median B2B SaaS industry health metrics.\n3. Recommend 3 concrete expansion revenue tactics (usage tiers, seat expansion) and churn reduction playbooks.`,
    howToSteps: [
      { name: 'Input Monthly ARPU', text: 'Enter average revenue billed per customer per month.' },
      { name: 'Set Margin & Churn', text: 'Input software gross margin and monthly cancellation rate.' },
      { name: 'Analyze Unit Economics', text: 'Click Search via AI Mode for investor benchmarks and payback periods.' }
    ],
    faqs: [
      { question: 'What is a good LTV:CAC ratio for startups?', answer: 'A 3:1 or higher ratio is standard; anything above 4:1 indicates strong capital efficiency, while under 2:1 burns money too fast.' }
    ],
    keyFeatures: ['Interactive LTV & Lifespan Math Preview', 'Gross-Margin Adjusted Valuation', 'LTV:CAC Investor Benchmarking'],
    whyAIMode: 'AI Search brings up latest Bessemer and OpenView venture capital SaaS benchmark reports.'
  },
  {
    id: 'nda-contract-gen',
    slug: 'nda-clause-generator',
    aliases: ['nda-generator', 'legal-clause-maker', 'non-disclosure-agreement', 'confidentiality-clause'],
    number: '54',
    category: 'Legal',
    title: 'Non-Disclosure Agreement (NDA) & Clause Generator',
    shortDescription: 'Drafts mutual or unilateral Non-Disclosure Agreements (NDAs), non-solicitation, and IP assignment clauses tailored by jurisdiction.',
    searchVolumeBadge: 'Legal Utility',
    accentColor: 'from-slate-400 to-indigo-500',
    badgeColor: 'text-slate-300 border-slate-700 bg-slate-900/60',
    iconName: 'Shield',
    seoTitle: 'Free AI NDA & Contract Clause Generator - Mutual Non-Disclosure Agreement',
    seoDescription: 'Draft mutual or unilateral NDA confidentiality agreements. Generate non-solicitation, trade secret, and intellectual property protection clauses.',
    seoKeywords: ['nda generator free', 'non disclosure agreement generator', 'confidentiality clause generator', 'draft mutual nda online'],
    longTailKeywords: ['how to draft unilateral nda for startup contractor', 'standard non solicitation clause duration and geographical scope'],
    presets: [
      { label: 'Unilateral NDA for Freelance Developer', values: { agreementType: 'Unilateral (Discloser protects secrets from Recipient)', parties: 'Startup Founder (Discloser) and Freelance Senior Developer (Recipient)', scopeOfSecrets: 'Software source code, product roadmap, proprietary algorithms, and user database', termYears: '2 Years' } }
    ],
    fields: [
      { name: 'agreementType', label: 'Agreement Structure', type: 'select', defaultValue: 'Mutual (Both parties share confidential information)', options: [
        { label: 'Mutual (Both parties share confidential information)', value: 'Mutual' },
        { label: 'Unilateral (One party discloses secrets to recipient)', value: 'Unilateral' }
      ]},
      { name: 'parties', label: 'Disclosing & Receiving Entities', type: 'text', defaultValue: 'Acme Technologies Inc. (Delaware Corp) and Partner Studio LLC', required: true },
      { name: 'scopeOfSecrets', label: 'Types of Confidential Information Protected', type: 'textarea', defaultValue: 'Proprietary software algorithms, customer lists, pricing structures, and unreleased product roadmaps.', required: true },
      { name: 'termYears', label: 'Confidentiality Duration / Survival Period', type: 'select', defaultValue: '2 Years after Termination', options: [
        { label: '1 Year after Termination', value: '1 Year' },
        { label: '2 Years after Termination', value: '2 Years' },
        { label: '5 Years after Termination', value: '5 Years' },
        { label: 'Indefinite for Trade Secrets', value: 'Indefinite Trade Secrets' }
      ]}
    ],
    compilePrompt: (values) => `Act as an expert corporate technology attorney. Draft a professional ${values.agreementType} Non-Disclosure Agreement (NDA) between ${values.parties}.\nCovering: ${values.scopeOfSecrets} for a duration of ${values.termYears}.\nInclude standard legal clauses:\n1. Clear Definition of Confidential Information and Standard Exclusions (public domain, prior knowledge).\n2. Standard of Care obligations.\n3. Return or Destruction of Materials.\n4. Governing Law and Injunctive Relief.\n*Note: Add legal disclaimer that this draft should be reviewed by licensed counsel.*`,
    howToSteps: [
      { name: 'Choose Agreement Type', text: 'Select mutual exchange or unilateral disclosure.' },
      { name: 'Define Protected Data', text: 'Specify source code, financials, or customer contacts.' },
      { name: 'Generate Contract Draft', text: 'Click Search via AI Mode for full contract language with standard legal exceptions.' }
    ],
    faqs: [
      { question: 'What is the most important exclusion in an NDA?', answer: 'Information already in the public domain or independently developed without reference to the disclosed secrets must be excluded to maintain enforceability.' }
    ],
    keyFeatures: ['Standard Exclusions Clause Built-In', 'Injunctive Relief Provisions', 'Trade Secret Survival Formatting'],
    whyAIMode: 'AI Search brings up jurisdiction-specific non-compete and enforceability precedents.'
  },
  {
    id: 'tdee-calorie',
    slug: 'tdee-calorie-calculator',
    aliases: ['tdee-calculator', 'calorie-deficit-calculator', 'macro-calculator', 'weight-loss-planner'],
    number: '55',
    category: 'Health',
    title: 'Daily Calorie Deficit & TDEE Planner',
    shortDescription: 'Calculates Total Daily Energy Expenditure (TDEE), Basal Metabolic Rate (BMR), and healthy calorie targets for fat loss or lean muscle gain.',
    searchVolumeBadge: 'Fitness Essential #1',
    accentColor: 'from-emerald-400 to-green-500',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
    iconName: 'Dumbbell',
    seoTitle: 'Free TDEE Calculator Online - Calorie Deficit & Macro Split for Fat Loss',
    seoDescription: 'Calculate Total Daily Energy Expenditure (TDEE) and BMR using the Mifflin-St Jeor formula. Customized calorie deficit targets and protein macros.',
    seoKeywords: ['tdee calculator online', 'calorie deficit calculator', 'bmr calculator free', 'macro calculator for fat loss'],
    longTailKeywords: ['how to calculate calorie deficit for 1 pound fat loss per week', 'mifflin st jeor formula tdee calculator with activity level'],
    presets: [
      { label: 'Male 30yr (80kg, 180cm, Moderately Active, Fat Loss)', values: { gender: 'Male', age: '30', weightKg: '80', heightCm: '180', activity: 'Moderate (Exercise 3-5 days/week)', goal: 'Fat Loss (500 calorie daily deficit / 1 lb per week)' } }
    ],
    fields: [
      { name: 'gender', label: 'Biological Sex', type: 'select', defaultValue: 'Male', options: [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' }
      ]},
      { name: 'age', label: 'Age (Years)', type: 'text', defaultValue: '28', required: true },
      { name: 'weightKg', label: 'Current Weight (kg)', type: 'text', defaultValue: '75', required: true },
      { name: 'heightCm', label: 'Height (cm)', type: 'text', defaultValue: '175', required: true },
      { name: 'activity', label: 'Daily Activity Level', type: 'select', defaultValue: 'Moderate (Exercise 3-5 days/week)', options: [
        { label: 'Sedentary (Desk job, little exercise)', value: 'Sedentary (1.2)' },
        { label: 'Lightly Active (Exercise 1-2 days/week)', value: 'Light (1.375)' },
        { label: 'Moderately Active (Exercise 3-5 days/week)', value: 'Moderate (1.55)' },
        { label: 'Very Active (Intense training 6-7 days/week)', value: 'Heavy (1.725)' }
      ]},
      { name: 'goal', label: 'Primary Fitness Goal', type: 'select', defaultValue: 'Fat Loss (500 calorie daily deficit)', options: [
        { label: 'Maintenance (Maintain current bodyweight)', value: 'Maintenance' },
        { label: 'Fat Loss (500 calorie daily deficit / 1 lb per week)', value: 'Fat Loss (-500 kcal)' },
        { label: 'Lean Bulk / Muscle Gain (250 calorie surplus)', value: 'Lean Bulk (+250 kcal)' }
      ]}
    ],
    calculatePreview: (values) => {
      const isMale = String(values.gender || 'Male') === 'Male';
      const age = parseFloat(String(values.age || '28')) || 28;
      const weight = parseFloat(String(values.weightKg || '75')) || 75;
      const height = parseFloat(String(values.heightCm || '175')) || 175;
      
      // Mifflin-St Jeor
      const bmr = 10 * weight + 6.25 * height - 5 * age + (isMale ? 5 : -161);
      
      const actStr = String(values.activity || '');
      let mult = 1.375;
      if (actStr.includes('Sedentary')) mult = 1.2;
      else if (actStr.includes('Light')) mult = 1.375;
      else if (actStr.includes('Moderate')) mult = 1.55;
      else if (actStr.includes('Heavy')) mult = 1.725;

      const tdee = Math.round(bmr * mult);
      const isFatLoss = String(values.goal || '').includes('Fat Loss');
      const isBulk = String(values.goal || '').includes('Bulk');
      const targetCalories = isFatLoss ? tdee - 500 : (isBulk ? tdee + 250 : tdee);

      return [
        { label: 'Daily Target Calorie Intake', value: `${targetCalories} kcal`, highlight: true },
        { label: 'Total Daily Energy (TDEE)', value: `${tdee} kcal` },
        { label: 'Basal Metabolic Rate (BMR)', value: `${Math.round(bmr)} kcal` }
      ];
    },
    compilePrompt: (values) => `Act as an evidence-based clinical sports nutritionist. Analyze: Sex: ${values.gender}, Age: ${values.age}, Weight: ${values.weightKg}kg, Height: ${values.heightCm}cm, Activity: ${values.activity}, Goal: ${values.goal}.\n1. Calculate exact BMR and TDEE using Mifflin-St Jeor formula.\n2. Daily target calorie recommendation.\n3. Exact macronutrient split (Protein at 2.0g/kg bodyweight, Fats at 25-30% of calories, remaining in complex carbohydrates).\n4. Sample 1-day meal timing plan to preserve muscle mass.`,
    howToSteps: [
      { name: 'Enter Body Metrics', text: 'Input age, weight in kg, height in cm, and sex.' },
      { name: 'Select Activity & Goal', text: 'Choose your weekly workout frequency and fat loss or muscle target.' },
      { name: 'Get Calorie & Protein Targets', text: 'Click Search via AI Mode for protein grams and evidence-based meal plans.' }
    ],
    faqs: [
      { question: 'Why is a 500-calorie daily deficit recommended for fat loss?', answer: 'One pound of adipose body fat contains roughly 3,500 calories; a 500-calorie deficit per day produces exactly 1 pound of sustainable fat loss per week.' }
    ],
    keyFeatures: ['Interactive BMR & TDEE Live Preview', 'Mifflin-St Jeor Clinical Formula', 'Protein Preservation Target Metrics'],
    whyAIMode: 'AI Search Mode factors in sports science guidelines on metabolic adaptation.'
  },
  {
    id: 'sleep-cycle',
    slug: 'sleep-cycle-calculator',
    aliases: ['sleep-calculator', 'wake-up-time', 'rem-sleep-calculator', 'circadian-clock'],
    number: '56',
    category: 'Health',
    title: 'Sleep Cycle & Circadian REM Wake-Up Calculator',
    shortDescription: 'Calculates optimal bedtimes and wake-up alarms based on natural 90-minute REM sleep cycles to prevent morning grogginess.',
    searchVolumeBadge: 'Wellness Favorite',
    accentColor: 'from-indigo-500 to-purple-600',
    badgeColor: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/40',
    iconName: 'Moon',
    seoTitle: 'Free Sleep Cycle Calculator Online - Optimal Wake-Up Times & REM Cycles',
    seoDescription: 'Calculate what time to sleep or wake up based on 90-minute REM sleep cycles. Wake up energized between sleep cycles without sleep inertia.',
    seoKeywords: ['sleep cycle calculator', 'wake up time calculator', 'rem sleep calculator online', 'what time should i go to sleep'],
    longTailKeywords: ['what time should i sleep to wake up refreshed at 6 30 am', 'how many 90 minute sleep cycles do adults need'],
    presets: [
      { label: 'Need to wake up at 06:30 AM', values: { targetTime: '06:30 AM', calculationDirection: 'I need to wake up at this time (Find Bedtime)' } },
      { label: 'Going to bed now at 11:00 PM', values: { targetTime: '11:00 PM', calculationDirection: 'I am going to sleep now (Find Wake-up Alarms)' } }
    ],
    fields: [
      { name: 'targetTime', label: 'Anchor Time (e.g. 06:30 AM)', type: 'text', defaultValue: '06:30 AM', required: true },
      { name: 'calculationDirection', label: 'Calculation Mode', type: 'select', defaultValue: 'I need to wake up at this time (Find Bedtime)', options: [
        { label: 'I need to wake up at this time (Find Bedtime)', value: 'Wake-Up Anchor' },
        { label: 'I am going to sleep now (Find Wake-up Alarms)', value: 'Bedtime Anchor' }
      ]}
    ],
    compilePrompt: (values) => `Calculate the optimal sleep cycles for an anchor time of: ${values.targetTime} under the condition: ${values.calculationDirection}.\nRules:\n1. Factor in 14 minutes average sleep latency (time to fall asleep).\n2. Calculate 4 cycles (6h), 5 cycles (7.5h - ideal), and 6 cycles (9h) of 90-minute REM intervals.\n3. Explain the neurobiology of sleep inertia (why waking in the middle of Deep Stage 3 sleep causes brain fog).\n4. Provide 3 evidence-based sleep hygiene tips (temperature, light, caffeine half-life).`,
    howToSteps: [
      { name: 'Enter Your Anchor Time', text: 'Type when you need to wake up or when your head hits the pillow.' },
      { name: 'Select Calculation Mode', text: 'Calculate backward for bedtime or forward for alarm times.' },
      { name: 'Review REM Alarms', text: 'Click Search via AI Mode for exact cycle alarms and caffeine cutoff rules.' }
    ],
    faqs: [
      { question: 'Why does waking up after 7.5 hours feel better than after 8 hours?', answer: '7.5 hours corresponds to exactly five 90-minute sleep cycles, allowing you to wake from light sleep rather than deep Stage 3 delta-wave sleep.' }
    ],
    keyFeatures: ['14-Minute Latency Inclusion', '5-Cycle (7.5h) Golden Window Indicator', 'Caffeine Half-Life Cutoff Calculator'],
    whyAIMode: 'AI Search integrates circadian biology research on blue-light melatonin suppression.'
  },
  {
    id: 'water-hydration',
    slug: 'water-intake-calculator',
    aliases: ['water-calculator', 'hydration-calculator', 'daily-water-intake', 'electrolyte-planner'],
    number: '57',
    category: 'Health',
    title: 'Water Intake & Electrolyte Hydration Planner',
    shortDescription: 'Computes customized daily water and electrolyte intake based on body weight, climate humidity, and workout sweat loss.',
    searchVolumeBadge: 'Daily Health Tool',
    accentColor: 'from-cyan-400 to-blue-500',
    badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40',
    iconName: 'Droplet',
    seoTitle: 'Free Daily Water Intake & Hydration Calculator - Liters & Ounces',
    seoDescription: 'Calculate how much water you should drink daily based on body weight, climate, and exercise sweat loss. Includes sodium and potassium electrolyte guidelines.',
    seoKeywords: ['water intake calculator', 'daily hydration calculator', 'how much water to drink a day', 'electrolyte hydration calculator'],
    longTailKeywords: ['how many ounces of water should an 80kg person drink daily', 'electrolyte replacement for intense summer sweat sessions'],
    presets: [
      { label: 'Active Athlete (75kg, 60min workout, Hot Climate)', values: { weightKg: '75', workoutMinutes: '60', climate: 'Hot / Humid Summer Weather' } }
    ],
    fields: [
      { name: 'weightKg', label: 'Body Weight (kg or lbs)', type: 'text', defaultValue: '70', required: true },
      { name: 'workoutMinutes', label: 'Daily Exercise Duration (Minutes)', type: 'text', defaultValue: '45' },
      { name: 'climate', label: 'Environment & Climate', type: 'select', defaultValue: 'Moderate / Air-conditioned', options: [
        { label: 'Moderate / Air-conditioned', value: 'Moderate' },
        { label: 'Hot / Humid Summer Weather', value: 'Hot Summer' },
        { label: 'Dry / High Altitude or Cold Winter', value: 'Dry Cold' }
      ]}
    ],
    calculatePreview: (values) => {
      const weight = parseFloat(String(values.weightKg || '70')) || 70;
      const workout = parseFloat(String(values.workoutMinutes || '45')) || 0;
      // Base: ~35ml per kg + 12ml per workout minute
      const baseMl = weight * 35;
      const workoutMl = workout * 12;
      const totalMl = Math.round(baseMl + workoutMl);
      const liters = (totalMl / 1000).toFixed(2);
      const ounces = Math.round(totalMl * 0.033814);

      return [
        { label: 'Total Recommended Daily Water', value: `${liters} Liters (${ounces} oz)`, highlight: true },
        { label: 'Base Metabolic Water', value: `${(baseMl / 1000).toFixed(2)} Liters` },
        { label: 'Exercise Sweat Replacement', value: `${(workoutMl / 1000).toFixed(2)} Liters` }
      ];
    },
    compilePrompt: (values) => `Act as an endurance sports physiologist. Calculate daily hydration for weight: ${values.weightKg}kg with ${values.workoutMinutes} minutes of training in ${values.climate}.\n1. Exact daily fluid volume in Liters and Fluid Ounces.\n2. Electrolyte replacement plan (Sodium, Potassium, Magnesium mg).\n3. Hourly drinking pacing schedule from waking to sleep to avoid middle-of-the-night bathroom awakenings.\n4. Signs of hyponatremia vs dehydration.`,
    howToSteps: [
      { name: 'Enter Body Weight', text: 'Input your weight in kilograms.' },
      { name: 'Add Workout Sweat Loss', text: 'Specify daily minutes of cardio or weight training.' },
      { name: 'Follow Pacing Schedule', text: 'Click Search via AI Mode for hourly hydration and electrolyte targets.' }
    ],
    faqs: [
      { question: 'Can drinking plain water without electrolytes cause dehydration?', answer: 'Yes! Sweating heavily expels sodium; chugging pure water without replacing sodium can dilute blood plasma and cause cramping.' }
    ],
    keyFeatures: ['Interactive Liters & Ounces Live Preview', 'Sweat Loss Formula', 'Nighttime Sleep Interruption Protection'],
    whyAIMode: 'AI Search references clinical sports hydration guidelines (ACSM).'
  },
  {
    id: 'customer-persona',
    slug: 'customer-persona-builder',
    aliases: ['customer-persona', 'icp-builder', 'ideal-customer-profile', 'buyer-persona'],
    number: '58',
    category: 'Marketing',
    title: 'Customer Persona & Ideal Customer Profile (ICP) Builder',
    shortDescription: 'Builds comprehensive B2B/B2C buyer personas: demographics, urgent pain points, emotional triggers, and objections.',
    searchVolumeBadge: 'Marketing Standard',
    accentColor: 'from-purple-500 to-indigo-500',
    badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-950/40',
    iconName: 'UserCheck',
    seoTitle: 'Free Customer Persona & Ideal Customer Profile (ICP) Builder',
    seoDescription: 'Generate comprehensive B2B and B2C buyer personas. Detail demographic profiles, hair-on-fire pain points, buying objections, and trigger events.',
    seoKeywords: ['customer persona builder', 'icp generator online', 'buyer persona maker free', 'ideal customer profile template'],
    longTailKeywords: ['how to define ideal customer profile for b2b enterprise software', 'buyer persona pain points and objections template'],
    presets: [
      { label: 'VP of Engineering at Series B Startup', values: { productDescription: 'An automated code security scanner that catches API secret leaks in GitHub pull requests before deployment', marketType: 'B2B Enterprise SaaS' } }
    ],
    fields: [
      { name: 'productDescription', label: 'What product/service do you sell and what problem does it solve?', type: 'textarea', defaultValue: 'An AI-powered client onboarding portal for boutique marketing agencies that cuts onboarding delays from 3 weeks to 2 days.', required: true },
      { name: 'marketType', label: 'Business Model', type: 'select', defaultValue: 'B2B SMB & Agencies', options: [
        { label: 'B2B SMB & Agencies', value: 'B2B SMB' },
        { label: 'B2B Mid-Market / Enterprise', value: 'B2B Enterprise' },
        { label: 'B2C Direct-to-Consumer / Mass Market', value: 'B2C D2C' },
        { label: 'Solopreneur & Creator Economy', value: 'Solopreneur' }
      ]}
    ],
    compilePrompt: (values) => `Act as a VP of Product Marketing. Build an exhaustive, actionable Ideal Customer Profile (ICP) and Buyer Persona for: "${values.productDescription}" in the ${values.marketType} category.\n1. Demographic & Firmographic Profile (Title, company size, budget authority).\n2. "Hair-on-Fire" Pain Points & Daily Frustrations.\n3. The Trigger Event (What happens that forces them to search for a solution today).\n4. Top 3 Buying Objections and specific counter-arguments.\n5. Exact vocabulary and emotional phrases they use during sales calls.`,
    howToSteps: [
      { name: 'Describe Your Product', text: 'Explain the core solution you offer.' },
      { name: 'Select Market Tier', text: 'Choose B2B Enterprise, SMB, or B2C.' },
      { name: 'Receive Persona Dossier', text: 'Click Search via AI Mode for buying triggers and sales call objection scripts.' }
    ],
    faqs: [
      { question: 'What is a "Trigger Event" in sales?', answer: 'A catalytic moment (like a key employee quitting, an audit failure, or a funding round) that elevates a latent problem into an urgent purchase priority.' }
    ],
    keyFeatures: ['Trigger Event Identification', 'Objection Handling Playbook', 'Authentic Voice-of-Customer Vocabulary'],
    whyAIMode: 'AI Search Mode studies customer forum discussions (Reddit, G2, LinkedIn) for real customer pain points.'
  },
  {
    id: 'elevator-pitch',
    slug: 'elevator-pitch-generator',
    aliases: ['elevator-pitch', 'pitch-generator', 'startup-pitch', '30-second-pitch'],
    number: '59',
    category: 'Business',
    title: 'Elevator Pitch & 30-Second Founder Script',
    shortDescription: 'Generates 3 punchy 30-second elevator pitches using the proven Problem-Solution-Traction framework for networking and investor intros.',
    searchVolumeBadge: 'Startup Founder Utility',
    accentColor: 'from-amber-400 to-orange-500',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
    iconName: 'Send',
    seoTitle: 'Free Elevator Pitch Generator - 30-Second Startup Pitch Scripts',
    seoDescription: 'Generate high-impact 30-second elevator pitches for founders, job seekers, and consultants. Problem, solution, traction, and hook formula.',
    seoKeywords: ['elevator pitch generator', '30 second pitch script', 'startup pitch generator', 'how to write elevator pitch'],
    longTailKeywords: ['how to write 30 second elevator pitch for seed stage investor demo day', 'elevator pitch formula problem solution proof'],
    presets: [
      { label: 'Fintech for Remote Freelancers', values: { companyProduct: 'Global invoicing and automated tax withholding for cross-border software freelancers', audience: 'Angel Investors and Venture Capitalists' } }
    ],
    fields: [
      { name: 'companyProduct', label: 'Company / Project Name & What It Does', type: 'textarea', defaultValue: 'DocuSync: A collaborative document editor that automatically generates Figma UI mockups from markdown user stories.', required: true },
      { name: 'audience', label: 'Who is listening to this pitch?', type: 'select', defaultValue: 'Angel Investors & Venture Capitalists', options: [
        { label: 'Angel Investors & Venture Capitalists', value: 'Investors' },
        { label: 'Potential Paying Customers (Discovery Call)', value: 'Customers' },
        { label: 'Casual Networking Event (Cocktail Party)', value: 'Networking' },
        { label: 'Job Interview / Career Introduction', value: 'Career Interview' }
      ]}
    ],
    compilePrompt: (values) => `Act as a Y Combinator pitch coach. Craft 3 distinct 30-second elevator pitches for: "${values.companyProduct}" tailored to ${values.audience}.\n1. The "X for Y" High-Concept Analogy Pitch.\n2. The Problem-Solution-Metric Pitch (Under 75 words, spoken in 30 seconds).\n3. The Story-Driven Hook Pitch.\nEnsure zero buzzwords (no "synergy", "paradigm shift", or "revolutionize"). Include a crisp conversational closing ask.`,
    howToSteps: [
      { name: 'Explain What You Build', text: 'Enter your product concept and unique insight.' },
      { name: 'Select Target Listener', text: 'Choose investors, prospective customers, or peers.' },
      { name: 'Memorize 30-Second Script', text: 'Click Search via AI Mode for buzzword-free, spoken-cadence scripts.' }
    ],
    faqs: [
      { question: 'How many words can a human speak comfortably in 30 seconds?', answer: 'Approximately 60 to 75 words at a relaxed, confident cadence without rushing.' }
    ],
    keyFeatures: ['Strict 75-Word Spoken Ceiling', 'Y Combinator Clarity Standard', 'High-Concept Analogy Formula'],
    whyAIMode: 'AI Search benchmarks successful seed-stage Demo Day pitch decks.'
  },
  {
    id: 'privacy-policy',
    slug: 'privacy-policy-checklist',
    aliases: ['privacy-policy-generator', 'gdpr-checklist', 'terms-of-service', 'ccpa-compliance'],
    number: '60',
    category: 'Legal',
    title: 'Privacy Policy & Terms Checklist Generator',
    shortDescription: 'Audits web and mobile apps for GDPR, CCPA, and cookie compliance, generating required policy disclosure clauses.',
    searchVolumeBadge: 'Web Compliance Standard',
    accentColor: 'from-slate-400 to-teal-400',
    badgeColor: 'text-slate-300 border-slate-700 bg-slate-900/60',
    iconName: 'Shield',
    seoTitle: 'Free Privacy Policy & Terms of Service Checklist - GDPR & CCPA Compliance',
    seoDescription: 'Audit your website or mobile app for GDPR, CCPA, and COPPA data privacy compliance. Generate required cookie disclosures and terms clauses.',
    seoKeywords: ['privacy policy generator', 'gdpr compliance checklist', 'terms of service generator', 'website privacy audit free'],
    longTailKeywords: ['what clauses are required in a privacy policy for mobile app analytics', 'gdpr cookie consent banner requirements 2026'],
    presets: [
      { label: 'SaaS Web App with Stripe & Google Analytics', values: { dataCollected: 'User email, names, IP addresses, Google Analytics events, Stripe payment tokens (no raw credit cards), user-uploaded images', platformType: 'Web SaaS Application' } }
    ],
    fields: [
      { name: 'platformType', label: 'Platform Type', type: 'select', defaultValue: 'Web Application (SaaS)', options: [
        { label: 'Web Application (SaaS)', value: 'Web SaaS' },
        { label: 'Mobile App (iOS App Store & Google Play)', value: 'Mobile App' },
        { label: 'E-commerce Store (Shopify / WooCommerce)', value: 'E-commerce' }
      ]},
      { name: 'dataCollected', label: 'What user data and third-party tools do you utilize?', type: 'textarea', defaultValue: 'User account emails, passwords (hashed), session cookies, Google Analytics 4, Stripe payment processing, and customer support chat widget.', required: true }
    ],
    compilePrompt: (values) => `Act as an international internet privacy counsel. Create an audit checklist and drafted policy clauses for a ${values.platformType} collecting: "${values.dataCollected}".\n1. Required GDPR Clauses (Right to Access, Right to Erasure, Legal Basis for Processing).\n2. CCPA / CPRA "Do Not Sell My Personal Information" disclosure.\n3. Third-party vendor data-sharing disclosure list.\n4. Recommended Cookie Consent Banner wording.\n*Include standard legal disclaimer that this is educational guidance, not formal legal representation.*`,
    howToSteps: [
      { name: 'Select Platform', text: 'Choose SaaS web app, mobile app, or e-commerce shop.' },
      { name: 'List Analytics & Services', text: 'Specify cookies, Stripe, Google Analytics, or auth providers.' },
      { name: 'Review Compliance Clauses', text: 'Click Search via AI Mode for GDPR and CCPA disclosure blocks.' }
    ],
    faqs: [
      { question: 'Does a small personal blog need a Privacy Policy?', answer: 'Yes! If you use Google Analytics, advertising pixels, or an email newsletter signup form, privacy regulations legally mandate a disclosed privacy policy.' }
    ],
    keyFeatures: ['GDPR Article 13 & 14 Disclosures', 'CCPA/CPRA Consumer Rights Clauses', 'Third-Party Vendor Disclosures'],
    whyAIMode: 'AI Search incorporates the latest EU and California regulatory enforcement rulings.'
  },
  {
    id: 'recipe-macros',
    slug: 'recipe-scaler-macros',
    aliases: ['recipe-scaler', 'recipe-macro-calculator', 'ingredient-substitutions', 'kitchen-math'],
    number: '61',
    category: 'Health',
    title: 'Recipe Serving Scaler & Macro Calculator',
    shortDescription: 'Scales culinary ingredients up or down for any party size while calculating estimated calories, protein, carbs, and fat per serving.',
    searchVolumeBadge: 'Cooking Utility #1',
    accentColor: 'from-orange-400 to-amber-500',
    badgeColor: 'text-orange-400 border-orange-500/30 bg-orange-950/40',
    iconName: 'Utensils',
    seoTitle: 'Free Recipe Scaler & Macro Calculator - Serving Size & Nutrition',
    seoDescription: 'Scale ingredient quantities from 2 servings to 20 servings automatically. Calculates calories, macros per serving, and allergen-friendly swaps.',
    seoKeywords: ['recipe scaler online', 'recipe macro calculator', 'scale ingredient servings', 'cooking measurement multiplier'],
    longTailKeywords: ['how to scale a recipe from 4 servings to 12 servings with math', 'calculate calories and macros per serving from recipe ingredients'],
    presets: [
      { label: 'Scale Chili from 4 to 10 Servings', values: { originalServings: '4', targetServings: '10', ingredientList: '1 lb ground turkey, 1 can black beans (15 oz), 1 can diced tomatoes (14 oz), 1 chopped onion, 2 tbsp chili powder, 1 tsp cumin, 1 cup chicken broth' } }
    ],
    fields: [
      { name: 'originalServings', label: 'Original Recipe Servings', type: 'text', defaultValue: '4', required: true },
      { name: 'targetServings', label: 'Desired Scaled Servings', type: 'text', defaultValue: '8', required: true },
      { name: 'ingredientList', label: 'List Ingredients with Quantities', type: 'textarea', defaultValue: '2 cups rolled oats, 1 cup Greek yogurt, 1/2 cup almond milk, 2 tbsp honey, 1 scoop vanilla whey protein powder, 1/2 cup blueberries', required: true }
    ],
    compilePrompt: (values) => `Act as a culinary chef and sports nutritionist. Scale this recipe from ${values.originalServings} servings to ${values.targetServings} servings:\n\n${values.ingredientList}\n\n1. Scaled ingredient measurements with fractions and metric (grams/ml) equivalents.\n2. Nutrition Facts Breakdown per serving (Estimated Calories, Protein, Carbohydrates, Dietary Fiber, Fats).\n3. 3 smart allergen ingredient substitutions (e.g. dairy-free, gluten-free, low-carb options).`,
    howToSteps: [
      { name: 'Enter Original & New Servings', text: 'Specify scaling from 4 to 8, or 12 to 2.' },
      { name: 'Paste Ingredient List', text: 'Enter your cups, ounces, grams, or tablespoons.' },
      { name: 'View Scaled Measurements', text: 'Click Search via AI Mode for converted quantities and per-serving macros.' }
    ],
    faqs: [
      { question: 'Do spices and leavening agents scale 1-to-1 in large batches?', answer: 'Not always. In large batches (over 4x), salt, intense spices, and baking powder often need to be scaled at roughly 1.5x to 2x rather than directly multiplied to prevent overpowering.' }
    ],
    keyFeatures: ['Exact Ingredient Scaling Fractions', 'Estimated Macros Per Serving', 'Allergen-Free Substitution Guide'],
    whyAIMode: 'AI Search brings up USDA FoodData Central nutritional values for accurate macros.'
  },
  {
    id: 'coffee-ratio',
    slug: 'coffee-ratio-calculator',
    aliases: ['coffee-ratio', 'pourover-calculator', 'coffee-water-ratio', 'barista-calculator'],
    number: '62',
    category: 'Utilities',
    title: 'Coffee Brewing Ratio & Water Calculator',
    shortDescription: 'Calculates the golden coffee-to-water ratio, grind size, water brew temperature, and pour milestones for V60, French Press, and AeroPress.',
    searchVolumeBadge: 'Coffee Geek Favorite',
    accentColor: 'from-amber-600 to-yellow-600',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
    iconName: 'Coffee',
    seoTitle: 'Free Coffee Brewing Ratio & Water Calculator - Golden Cup Standard',
    seoDescription: 'Calculate coffee beans and water weights using Specialty Coffee Association (SCA) golden ratios (1:15 to 1:17) for V60, French Press, Chemex, and Aeropress.',
    seoKeywords: ['coffee brewing ratio calculator', 'coffee to water ratio', 'v60 water ratio calculator', 'golden cup standard coffee'],
    longTailKeywords: ['how many grams of coffee beans for 500ml water v60 pour over', 'coffee ratio 1 to 16 calculation in grams'],
    presets: [
      { label: 'Hario V60 (1:16 Ratio, 300g Water)', values: { brewMethod: 'Hario V60 Pour Over', brewRatio: '1:16 (Balanced Specialty Standard)', targetWaterGrams: '300' } },
      { label: 'French Press (1:15 Ratio, 600g Water)', values: { brewMethod: 'French Press (Full Immersion)', brewRatio: '1:15 (Rich & Full-Bodied)', targetWaterGrams: '600' } }
    ],
    fields: [
      { name: 'brewMethod', label: 'Brewing Method', type: 'select', defaultValue: 'Hario V60 Pour Over', options: [
        { label: 'Hario V60 Pour Over (Percolation)', value: 'Hario V60' },
        { label: 'French Press (Full Immersion)', value: 'French Press' },
        { label: 'AeroPress (Inverted / Standard)', value: 'AeroPress' },
        { label: 'Chemex (Thick Filter Clean Cup)', value: 'Chemex' },
        { label: 'Cold Brew (Concentrate 1:8)', value: 'Cold Brew' }
      ]},
      { name: 'brewRatio', label: 'Coffee to Water Brew Ratio', type: 'select', defaultValue: '1:16 (Balanced Specialty Standard)', options: [
        { label: '1:15 (Rich, Intense & Full-Bodied)', value: '1:15' },
        { label: '1:16 (Balanced Specialty Standard)', value: '1:16' },
        { label: '1:17 (Bright, Clean & Delicate Acidity)', value: '1:17' }
      ]},
      { name: 'targetWaterGrams', label: 'Total Water to Brew (Grams or ml)', type: 'text', defaultValue: '350', required: true }
    ],
    calculatePreview: (values) => {
      const water = parseFloat(String(values.targetWaterGrams || '350')) || 350;
      const ratioStr = String(values.brewRatio || '1:16');
      let divisor = 16;
      if (ratioStr.includes('1:15')) divisor = 15;
      else if (ratioStr.includes('1:17')) divisor = 17;
      else if (ratioStr.includes('1:8')) divisor = 8;
      
      const coffeeGrams = water / divisor;
      const bloomWater = coffeeGrams * 3;

      return [
        { label: 'Required Coffee Grounds', value: `${coffeeGrams.toFixed(1)}g`, highlight: true },
        { label: 'Total Brew Water', value: `${water}g (ml)` },
        { label: 'Initial Bloom Pour (45s)', value: `${Math.round(bloomWater)}g` }
      ];
    },
    compilePrompt: (values) => `Act as a world champion specialty barista. Detail the perfect brewing protocol for: Method: ${values.brewMethod}, Ratio: ${values.brewRatio}, Water: ${values.targetWaterGrams}g.\n1. Exact dry coffee dose in grams.\n2. Recommended grind size (microns and sensory analogy like kosher salt or table sand).\n3. Water temperature in Celsius and Fahrenheit (e.g. 93°C / 200°F for light roasts).\n4. Timestamped pour schedule (0:00 Bloom, 0:45 First Pour, 1:30 Second Pour, Drawdown target).`,
    howToSteps: [
      { name: 'Choose Brew Method', text: 'Select V60, French Press, Chemex, or AeroPress.' },
      { name: 'Set Desired Water', text: 'Enter how many grams/ml of water you want to brew.' },
      { name: 'Follow Pour Routine', text: 'Click Search via AI Mode for water temperatures and timestamped pour schedules.' }
    ],
    faqs: [
      { question: 'Why is the "Bloom" step important in coffee brewing?', answer: 'Hot water releases trapped carbon dioxide gas from freshly roasted beans; without blooming, CO2 prevents water from properly extracting flavor compounds.' }
    ],
    keyFeatures: ['Live Gram & Bloom Math Preview', 'Specialty Coffee Association (SCA) Standard', 'Timestamped Pour Schedule'],
    whyAIMode: 'AI Search references roast-level extraction profiles and water mineral hardness.'
  }
];
