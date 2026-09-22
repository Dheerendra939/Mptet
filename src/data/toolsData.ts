import { ToolDefinition } from '../types';
import { FINANCE_TOOLS } from './tools/financeTools';
import { DEV_TOOLS } from './tools/devTools';
import { CONTENT_TOOLS } from './tools/contentTools';
import { PRODUCTIVITY_TOOLS } from './tools/productivityTools';
import { BUSINESS_HEALTH_TOOLS } from './tools/businessHealthTools';
import { STEM_TOOLS } from './tools/stemTools';
import { UTILITY_TOOLS } from './tools/utilityTools';
import { BUSINESS_CAREER_TOOLS } from './tools/businessCareerTools';
import { LIFESTYLE_FINANCE_TOOLS } from './tools/lifestyleFinanceTools';

const INITIAL_TOOLS: ToolDefinition[] = [
  {
    id: 'emi',
    slug: 'emi-loan-calculator',
    aliases: ['emi', 'loan-calculator', 'home-loan-emi', 'mortgage-calculator'],
    number: '01',
    category: 'Finance',
    title: 'Dynamic EMI & Loan Planner',
    shortDescription: 'Generates detailed monthly amortization schedules, interest breakdowns, and aggressive interest-saving pre-payment strategies.',
    searchVolumeBadge: 'Worldwide #1 in Finance',
    accentColor: 'from-blue-500 to-cyan-400',
    badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40',
    iconName: 'Calculator',
    seoTitle: 'Free EMI & Loan Calculator Online - Monthly Amortization & Prepayment Savings',
    seoDescription: 'Calculate monthly loan EMI, total interest, and amortization schedule with smart AI pre-payment analysis. Free online home, car, and personal loan planner.',
    seoKeywords: [
      'EMI calculator',
      'loan calculator',
      'home loan emi calculator online',
      'car loan emi calculator',
      'amortization schedule generator',
      'prepayment loan savings calculator',
      'personal loan emi planner'
    ],
    longTailKeywords: [
      'how to calculate home loan emi with prepayment',
      'car loan emi reduction tips formula',
      'monthly amortization schedule with extra 10 percent payment',
      'sbi hdfc bank home loan interest savings calculator',
      'personal loan foreclosure charges vs interest savings',
      'how much tenure reduces by paying 1 extra emi each year',
      'flat interest rate vs reducing balance interest emi formula',
      'calculate mortgage payoff date with extra monthly principal'
    ],
    longTailUseCases: [
      {
        query: 'How to calculate home loan savings with an extra 10% annual prepayment?',
        title: 'Annual 10% Extra Prepayment Strategy',
        summary: 'Making a 10% prepayment towards your principal once a year can chop 6-7 years off a 20-year mortgage and save over 35% in total interest payable.',
        presetValues: {
          loanAmount: '5000000',
          tenure: '20 Years',
          interestRate: '8.5',
          prepaymentStrategy: true
        }
      },
      {
        query: 'How does reducing balance EMI compare to flat interest rate loans?',
        title: 'Reducing Balance Amortization Analysis',
        summary: 'Banks charge interest only on the remaining balance rather than original principal. This planner shows true monthly interest compounding.',
        presetValues: {
          loanAmount: '1500000',
          tenure: '7 Years',
          interestRate: '9.5',
          prepaymentStrategy: true
        }
      },
      {
        query: 'How much interest can I save by paying 1 extra EMI every year?',
        title: 'The 13th EMI Annual Acceleration Rule',
        summary: 'Paying 13 EMIs in a 12-month calendar year attacks principal directly when compounding is highest, cutting total loan cost by up to 22%.',
        presetValues: {
          loanAmount: '3500000',
          tenure: '15 Years',
          interestRate: '8.75',
          prepaymentStrategy: true
        }
      }
    ],
    presets: [
      {
        label: 'Home Loan (₹50L @ 8.5% 20 Yrs)',
        description: 'Standard residential mortgage plan',
        values: {
          loanAmount: '5000000',
          tenure: '20 Years',
          interestRate: '8.5',
          prepaymentStrategy: true
        }
      },
      {
        label: 'Car Loan (₹10L @ 9.0% 5 Yrs)',
        description: 'Automobile vehicle financing',
        values: {
          loanAmount: '1000000',
          tenure: '5 Years',
          interestRate: '9.0',
          prepaymentStrategy: true
        }
      },
      {
        label: 'Personal Loan (₹3L @ 11.5% 3 Yrs)',
        description: 'Short-term flexible credit',
        values: {
          loanAmount: '300000',
          tenure: '3 Years',
          interestRate: '11.5',
          prepaymentStrategy: false
        }
      }
    ],
    fields: [
      {
        name: 'loanAmount',
        label: 'Loan Amount (Principal Currency / ₹ / $)',
        type: 'text',
        placeholder: 'e.g., 2500000 or 50000',
        defaultValue: '1000000',
        helpText: 'Enter total amount borrowed from the bank or lender.',
        required: true
      },
      {
        name: 'interestRate',
        label: 'Annual Interest Rate (%)',
        type: 'text',
        placeholder: 'e.g., 8.5',
        defaultValue: '8.5',
        helpText: 'Current annual floating or fixed rate of interest.',
        required: true
      },
      {
        name: 'tenure',
        label: 'Repayment Tenure',
        type: 'select',
        defaultValue: '5 Years',
        options: [
          { label: '1 Year (12 Months)', value: '1 Year' },
          { label: '2 Years (24 Months)', value: '2 Years' },
          { label: '3 Years (36 Months)', value: '3 Years' },
          { label: '5 Years (60 Months)', value: '5 Years' },
          { label: '7 Years (84 Months)', value: '7 Years' },
          { label: '10 Years (120 Months)', value: '10 Years' },
          { label: '15 Years (180 Months)', value: '15 Years' },
          { label: '20 Years (240 Months)', value: '20 Years' },
          { label: '25 Years (300 Months)', value: '25 Years' },
          { label: '30 Years (360 Months)', value: '30 Years' }
        ],
        required: true
      },
      {
        name: 'prepaymentStrategy',
        label: 'Include Early Foreclosure & Pre-payment Optimization',
        type: 'toggle',
        defaultValue: true,
        helpText: 'Simulates compounding savings achieved by making a 5-10% annual extra payment.'
      }
    ],
    calculatePreview: (values) => {
      const p = parseFloat(String(values.loanAmount || '0').replace(/,/g, ''));
      const r = parseFloat(String(values.interestRate || '8.5')) / 12 / 100;
      const years = parseInt(String(values.tenure || '5 Years').split(' ')[0], 10) || 5;
      const n = years * 12;

      if (!p || p <= 0 || !r || r <= 0 || !n || n <= 0) {
        return [
          { label: 'Estimated Monthly EMI', value: '--' },
          { label: 'Total Interest Payable', value: '--' },
          { label: 'Total Payment', value: '--' }
        ];
      }

      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayment = emi * n;
      const totalInterest = totalPayment - p;

      return [
        {
          label: 'Estimated Monthly EMI',
          value: `₹${Math.round(emi).toLocaleString()}`,
          detail: `For ${n} monthly installments`,
          highlight: true
        },
        {
          label: 'Total Interest Payable',
          value: `₹${Math.round(totalInterest).toLocaleString()}`,
          detail: `${Math.round((totalInterest / totalPayment) * 100)}% of total repayment`
        },
        {
          label: 'Total Loan Outflow',
          value: `₹${Math.round(totalPayment).toLocaleString()}`,
          detail: 'Principal + All Interest Charges'
        }
      ];
    },
    compilePrompt: (values) => {
      const p = values.loanAmount || '1,000,000';
      const rate = values.interestRate || '8.5%';
      const tenure = values.tenure || '5 Years';
      const prepay = values.prepaymentStrategy;

      return `Act as an expert financial planner and mortgage analyst. Provide a comprehensive loan calculation, monthly amortization schedule, and financial analysis for a loan of ${p} at an annual interest rate of ${rate}% with a repayment tenure of ${tenure}. Detail estimated monthly EMI, total interest payable, and total repayment amount based on current benchmark rates. ${
        prepay
          ? 'Include aggressive pre-payment and early foreclosure strategies showing exactly how much interest and tenure can be saved with an extra 10% annual or monthly prepayment.'
          : 'Include sensible repayment and risk management tips.'
      } Format the output with clear tables, mathematical breakdown, and actionable savings advice.`;
    },
    howToSteps: [
      { name: 'Enter Loan Details', text: 'Input your principal loan amount, agreed annual interest rate, and chosen tenure duration.' },
      { name: 'Enable Prepayment Toggle', text: 'Keep the early foreclosure toggle turned on to calculate compounding interest savings through small extra contributions.' },
      { name: 'Launch AI Search Mode', text: 'Click "Search via AI Mode" to trigger Google AI Overviews with personalized amortization charts, tax deduction analysis, and bank comparison.' }
    ],
    faqs: [
      {
        question: 'How is the monthly EMI calculated?',
        answer: 'Monthly EMI is calculated using the standard mathematical formula: E = P × r × (1 + r)^n / ((1 + r)^n - 1), where P is principal loan amount, r is monthly interest rate, and n is total number of monthly payments.'
      },
      {
        question: 'How does prepaying 1 extra EMI every year help?',
        answer: 'Prepaying just 1 additional monthly EMI each year can reduce a 20-year home loan by 3 to 4 years and save upwards of 15% to 25% of the total interest paid over the life of the loan.'
      },
      {
        question: 'Can I calculate Home, Car, and Personal loans with this tool?',
        answer: 'Yes! Select any of our pre-built presets or adjust the tenure from 1 to 30 years and rate from 5% to 20% to calculate any loan type worldwide.'
      }
    ],
    keyFeatures: [
      'Standard Mathematical & AI Amortization Simulation',
      'Early Foreclosure & Compound Interest Savings Estimator',
      'Instant Monthly Payment & Total Outflow Breakdown',
      'Direct Integration with Google Search AI Overviews'
    ],
    whyAIMode: 'Standard online calculators only give you static numbers. When you click Search via AI Mode, Google AI evaluates real-world bank interest variations, tax benefit provisions under local tax codes, and custom repayment schedules.'
  },
  {
    id: 'insta-hook',
    slug: 'instagram-reels-hook-generator',
    aliases: ['insta-hook', 'reels-hook-generator', 'viral-hooks', 'tiktok-hook-generator'],
    number: '02',
    category: 'Social',
    title: 'Instagram & Reels Hook Generator',
    shortDescription: 'Creates 5 viral, high-CTR opening hooks with psychological curiosity gaps for high-retention video content.',
    searchVolumeBadge: 'Viral Creator Trend',
    accentColor: 'from-purple-500 to-pink-500',
    badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-950/40',
    iconName: 'Sparkles',
    seoTitle: 'Viral Instagram Reels & Shorts Hook Generator - 5 High-CTR Video Hooks',
    seoDescription: 'Generate scroll-stopping viral hooks for Instagram Reels, YouTube Shorts, and TikTok. Psychological curiosity gaps that increase 3-second retention.',
    seoKeywords: [
      'instagram reels hook generator',
      'viral video hooks generator',
      'tiktok hook ideas',
      'youtube shorts hooks',
      'curiosity gap video scripts',
      'social media hook writer'
    ],
    longTailKeywords: [
      'curiosity gap opening hooks for instagram reels passive income',
      'first 3 seconds video hooks to stop scrolling on youtube shorts',
      'how to write viral tiktok hooks that get comments',
      'pattern interrupt script ideas for short form video creators',
      'high retention opening lines for educational reels',
      'contrarian hooks for personal finance and investing videos',
      'how to increase 3 second hook retention rate algorithm'
    ],
    longTailUseCases: [
      {
        query: 'What are the best curiosity-gap hooks for finance and investing Reels?',
        title: 'Curiosity-Gap Investing Script',
        summary: 'Hooks that highlight little-known money loopholes or debunk common myths force the viewer subconscious to stop scrolling within 1.5 seconds.',
        presetValues: {
          niche: 'Index Funds & Hidden Bank Fees',
          tone: 'Curiosity-Driven & Contrarian',
          includeCta: true
        }
      },
      {
        query: 'How to write viral TikTok hooks that trigger high comment debate?',
        title: 'Contrarian Pattern-Interrupt Trigger',
        summary: 'Opens with a controversial, counter-intuitive statement that challenges standard industry advice, forcing comments and shares.',
        presetValues: {
          niche: 'Why Doing 10,000 Steps A Day Might Be Wasting Your Time',
          tone: 'Curiosity-Driven & Contrarian',
          includeCta: true
        }
      },
      {
        query: 'How to script the first 3 seconds of a YouTube Shorts tutorial?',
        title: 'Instant Value Promise Script',
        summary: 'Delivers the end payoff in under 2 seconds before the viewer can swipe away, followed by an immediate visual transition.',
        presetValues: {
          niche: 'Free AI Website Design in 60 Seconds',
          tone: 'High-Energy & Urgent',
          includeCta: true
        }
      }
    ],
    presets: [
      {
        label: 'AI & Online Business',
        values: {
          niche: 'AI Tools & Passive Income for Solopreneurs',
          tone: 'Curiosity-Driven & Contrarian',
          includeCta: true
        }
      },
      {
        label: 'Fitness & Fat Loss',
        values: {
          niche: 'Sustainable Weight Loss without Boring Cardio',
          tone: 'Energetic & Punchy',
          includeCta: true
        }
      },
      {
        label: 'Personal Finance & Investing',
        values: {
          niche: 'Index Funds & Real Estate for Beginners',
          tone: 'Educational & Analytical',
          includeCta: true
        }
      }
    ],
    fields: [
      {
        name: 'niche',
        label: 'Content Topic / Niche',
        type: 'text',
        placeholder: 'e.g., AI productivity hacks, High-ticket sales, Vegan baking',
        defaultValue: 'AI Tools & Passive Income',
        helpText: 'What is your video about?',
        required: true
      },
      {
        name: 'tone',
        label: 'Delivery Tone & Energy',
        type: 'select',
        defaultValue: 'Educational & Analytical',
        options: [
          { label: 'Educational & Analytical', value: 'Educational & Analytical' },
          { label: 'Curiosity-Driven & Contrarian', value: 'Curiosity-Driven & Contrarian' },
          { label: 'High-Energy & Urgent', value: 'High-Energy & Urgent' },
          { label: 'Humorous & Relatable', value: 'Humorous & Relatable' },
          { label: 'Storytelling & Vulnerable', value: 'Storytelling & Vulnerable' }
        ],
        required: true
      },
      {
        name: 'includeCta',
        label: 'Include Viral Comment-Bait CTA & Caption Trigger',
        type: 'toggle',
        defaultValue: true,
        helpText: 'Appends a closing Call-to-Action designed to trigger algorithm saves, shares, and comment loops.'
      }
    ],
    compilePrompt: (values) => {
      const niche = values.niche || 'Digital Marketing';
      const tone = values.tone || 'Curiosity-Driven';
      const cta = values.includeCta;

      return `Act as a top viral social media strategist. Generate 5 viral, high-CTR opening hooks for short-form videos (Instagram Reels, YouTube Shorts, TikTok) for the niche: "${niche}". Content Tone: ${tone}. Ensure each hook stops the scroll within the first 2 seconds using psychological curiosity gaps, contrarian viewpoints, or high-impact pattern interrupts. ${
        cta
          ? 'For each hook, also provide a compelling Call-to-Action (CTA) and engagement caption designed to trigger comments, saves, and shares.'
          : 'Provide framing notes and visual pacing tips for each hook.'
      }`;
    },
    howToSteps: [
      { name: 'Define Your Niche', text: 'Enter your video topic or choose a trending preset like AI, Fitness, or Finance.' },
      { name: 'Select Your Tone', text: 'Choose the psychological angle that best fits your target audience persona.' },
      { name: 'Get 5 Scroll-Stopping Hooks', text: 'Click "Search via AI Mode" to retrieve 5 tested video hooks with visual pacing and viral caption hooks.' }
    ],
    faqs: [
      {
        question: 'Why are the first 3 seconds of a Reel so critical?',
        answer: 'Algorithms on Instagram, YouTube Shorts, and TikTok reward viewer retention percentage. If a viewer swipes away within the first 3 seconds, the algorithm flags the content as unengaging and ceases distribution.'
      },
      {
        question: 'What is a "pattern interrupt" hook?',
        answer: 'A pattern interrupt disrupts the subconscious scrolling trance through unexpected visual motion, shocking contrasting statements, or questions that challenge conventional wisdom.'
      }
    ],
    keyFeatures: [
      '5 Algorithm-Optimized Short-Form Video Hooks',
      'Psychological Curiosity Gap & Pattern Interrupts',
      'Viral Comment-Trigger Call-To-Action (CTA) Generator',
      'Compatible with Reels, TikTok, and YouTube Shorts'
    ],
    whyAIMode: 'Google AI analyzes millions of top-performing viral short-form videos in real-time to generate fresh, non-cliché hooks customized specifically to today’s trending social algorithms.'
  },
  {
    id: 'code-debugger',
    slug: 'ai-code-debugger',
    aliases: ['code-debugger', 'debugger', 'fix-code', 'code-explainer'],
    number: '03',
    category: 'Development',
    title: 'AI Code Debugger & Explainer',
    shortDescription: 'Diagnoses runtime errors, explains the root failure cause in plain terms, and provides optimized, production-ready code.',
    searchVolumeBadge: 'Top Developer Choice',
    accentColor: 'from-emerald-500 to-teal-400',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
    iconName: 'Code2',
    seoTitle: 'Free AI Code Debugger & Error Explainer Online - Fix Bugs & Optimize Big-O',
    seoDescription: 'Debug, fix, and explain code online in Python, JavaScript, TypeScript, C++, and Go. Explains root cause bugs and optimizes Big-O performance instantly.',
    seoKeywords: [
      'ai code debugger',
      'debug python online',
      'javascript error fixer',
      'code bug fixer online',
      'explain code online',
      'code optimizer big o',
      'free programming debugger'
    ],
    longTailKeywords: [
      'how to debug python async memory leak online free',
      'fix javascript array reduce TypeError cannot read property',
      'optimize sql query slow execution join order big o',
      'explain c++ segmentation fault core dumped online',
      'debug react infinite re-render useEffect dependency array',
      'how to fix CORS policy No Access Control Allow Origin header',
      'optimize python code time complexity from ON2 to ON'
    ],
    longTailUseCases: [
      {
        query: 'How to fix TypeError: Cannot read properties of undefined in JavaScript reduce?',
        title: 'JavaScript Undefined Accumulator Bug',
        summary: 'Occurs when the initial accumulator parameter is omitted or when a callback forgets to return a value. Debugger provides safe optional chaining and fallback syntax.',
        presetValues: {
          code: 'function calculateTotal(items) {\n  return items.reduce((acc, item) => acc + (item?.price || 0), 0);\n}',
          language: 'JavaScript / TypeScript',
          optimize: true
        }
      },
      {
        query: 'How to resolve memory leaks in Python asyncio background workers?',
        title: 'Python Unbounded Task Collection Leak',
        summary: 'Background tasks accumulating references in global arrays prevent garbage collection. Debugger refactors into bounded asyncio.Queue and task workers.',
        presetValues: {
          code: 'import asyncio\n\ncache = []\nasync def fetch_data(id):\n    data = await get_record(id)\n    cache.append(data)\n    return data',
          language: 'Python',
          optimize: true
        }
      },
      {
        query: 'How to fix React infinite loop in useEffect with object dependency?',
        title: 'React Unstable Dependency Re-render',
        summary: 'Objects or functions created inside functional components recreate every render cycle, triggering infinite useEffect loops. Solved via useMemo or primitive extraction.',
        presetValues: {
          code: 'import { useEffect, useState } from "react";\n\nfunction UserProfile() {\n  const [data, setData] = useState(null);\n  const options = { filter: "active" };\n  useEffect(() => {\n    fetchUser(options).then(setData);\n  }, [options]);\n}',
          language: 'JavaScript / TypeScript',
          optimize: true
        }
      }
    ],
    presets: [
      {
        label: 'Array Reduce / Object Mutation Bug',
        values: {
          code: 'function calculateTotal(items) {\n  return items.reduce((acc, item) => acc + item.price, 0);\n}',
          language: 'JavaScript / TypeScript',
          optimize: true
        }
      },
      {
        label: 'Python Async Memory Leak',
        values: {
          code: 'import asyncio\n\ncache = []\nasync def fetch_data(id):\n    data = await get_record(id)\n    cache.append(data)\n    return data',
          language: 'Python',
          optimize: true
        }
      },
      {
        label: 'SQL Query Slow Performance',
        values: {
          code: 'SELECT * FROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE o.created_at > NOW() - INTERVAL 30 DAY\nORDER BY u.created_at DESC;',
          language: 'SQL',
          optimize: true
        }
      }
    ],
    fields: [
      {
        name: 'language',
        label: 'Programming Language',
        type: 'select',
        defaultValue: 'JavaScript / TypeScript',
        options: [
          { label: 'JavaScript / TypeScript', value: 'JavaScript / TypeScript' },
          { label: 'Python', value: 'Python' },
          { label: 'Java', value: 'Java' },
          { label: 'C++ / C', value: 'C++' },
          { label: 'Go (Golang)', value: 'Go' },
          { label: 'Rust', value: 'Rust' },
          { label: 'PHP', value: 'PHP' },
          { label: 'SQL', value: 'SQL' },
          { label: 'HTML / CSS / Tailwind', value: 'HTML/CSS' }
        ],
        required: true
      },
      {
        name: 'code',
        label: 'Paste Broken Code or Stack Trace',
        type: 'textarea',
        placeholder: 'Paste the failing snippet, error message, or stack trace here...',
        defaultValue: 'function calculateTotal(items) {\n  return items.reduce((acc, item) => acc + item.price, 0);\n}',
        helpText: 'Include relevant function context or error logs for optimal accuracy.',
        required: true
      },
      {
        name: 'optimize',
        label: 'Optimize Runtime Performance & Big-O Complexity',
        type: 'toggle',
        defaultValue: true,
        helpText: 'Requests time complexity (O(N)) and space memory optimization benchmarks.'
      }
    ],
    compilePrompt: (values) => {
      const lang = values.language || 'Code';
      const snippet = values.code || '';
      const opt = values.optimize;

      return `Act as a senior software architect. Debug, explain, and fix the following ${lang} code:\n\n\`\`\`${lang.toLowerCase()}\n${snippet}\n\`\`\`\n\n1. Explain the root cause of the error or bottleneck in plain English.\n2. Provide the corrected, production-ready code with clean syntax.\n${
        opt
          ? '3. Optimize runtime performance and memory efficiency, explaining Big-O time and space complexity improvements.'
          : '3. List unit test cases to verify the fix.'
      }`;
    },
    howToSteps: [
      { name: 'Paste Your Code', text: 'Paste your snippet or stack trace and select your programming language.' },
      { name: 'Toggle Big-O Optimization', text: 'Keep optimization active if you want algorithmic efficiency upgrades.' },
      { name: 'Run Debugger via AI', text: 'Click Search via AI Mode to view root cause diagnosis, patched syntax, and edge-case tests.' }
    ],
    faqs: [
      {
        question: 'Which programming languages are supported?',
        answer: 'Every major language including Python, JavaScript, TypeScript, C++, Rust, Go, Java, PHP, Ruby, SQL, and HTML/CSS.'
      },
      {
        question: 'Can this debugger explain why an error happened?',
        answer: 'Yes! The prompt explicitly instructs the AI to break down the architectural root cause in plain English before delivering clean, bug-free replacement code.'
      }
    ],
    keyFeatures: [
      'Multi-Language Code Synthesis & Bug Detection',
      'Plain English Root Cause Explanations',
      'Algorithmic Big-O Time & Space Complexity Improvements',
      'Edge Case Unit Testing Recommendations'
    ],
    whyAIMode: 'AI Search Mode pulls updated documentation from GitHub issues, language specifications, and Stack Overflow to verify modern syntax and avoid deprecated workarounds.'
  },
  {
    id: 'fitness-macro',
    slug: 'fitness-macro-calculator',
    aliases: ['macro-calculator', 'fitness-calculator', 'calorie-calculator', 'protein-calculator'],
    number: '04',
    category: 'Health',
    title: 'Fitness Macro & Calorie Calculator',
    shortDescription: 'Calculates tailored macronutrient splits and structures actionable meal plans with optional Indian diet customization.',
    searchVolumeBadge: 'Global Health Trend',
    accentColor: 'from-amber-500 to-orange-400',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
    iconName: 'Dumbbell',
    seoTitle: 'Free Macro & Calorie Calculator Online - Protein, Carbs & Fats Split',
    seoDescription: 'Calculate daily calories and exact macro splits (protein, carbs, fats) for fat loss, muscle gain, or maintenance. Includes custom Indian diet options.',
    seoKeywords: [
      'macro calculator online',
      'calorie deficit calculator',
      'daily protein requirement calculator',
      'bodybuilding macros calculator',
      'indian diet macro plan',
      'weight loss macros'
    ],
    longTailKeywords: [
      'how to calculate protein intake for vegetarian indian diet',
      'calorie deficit macro split for lean muscle and fat loss',
      'macro ratio for bodybuilding cut 2000 calories',
      'how many grams of protein in paneer dal soya chunks',
      'macro calculation for endomorph body type weight loss',
      'intermittent fasting daily macro split calculation'
    ],
    longTailUseCases: [
      {
        query: 'How to hit 130g protein daily on a pure vegetarian Indian diet without whey?',
        title: 'Vegetarian High-Protein Indian Meal Split',
        summary: 'Combines low-fat paneer, sprouted green gram, soya chunks (52% protein), Greek yogurt, and roasted chana to deliver 130g+ complete protein daily.',
        presetValues: {
          calories: '2100',
          goal: 'Fat Loss & Lean Muscle',
          dietaryPreference: true
        }
      },
      {
        query: 'What is the optimal macro split for a 500 calorie cut while preserving muscle?',
        title: 'Lean Muscle Preservation Deficit',
        summary: 'Allocates 2.2g of protein per kg of bodyweight, moderate healthy fats for hormonal health, and places carbohydrates around workout windows.',
        presetValues: {
          calories: '1900',
          goal: 'Aggressive Fat Loss (Cut)',
          dietaryPreference: false
        }
      },
      {
        query: 'How to calculate clean bulk macros for skinny beginners (hardgainers)?',
        title: 'Clean Hypertrophy 300 kcal Surplus',
        summary: 'Structures a 45% Carb, 25% Protein, 30% Fat split that provides ample glycogen without excessive visceral fat accumulation.',
        presetValues: {
          calories: '2800',
          goal: 'Muscle Hypertrophy & Strength',
          dietaryPreference: true
        }
      }
    ],
    presets: [
      {
        label: 'Fat Loss & Lean Muscle (2000 kcal)',
        values: {
          calories: '2000',
          goal: 'Fat Loss & Lean Muscle',
          dietaryPreference: true
        }
      },
      {
        label: 'Muscle Hypertrophy / Bulking (2800 kcal)',
        values: {
          calories: '2800',
          goal: 'Muscle Hypertrophy & Strength',
          dietaryPreference: true
        }
      },
      {
        label: 'Weight Maintenance & Longevity (2200 kcal)',
        values: {
          calories: '2200',
          goal: 'Weight Maintenance & Energy',
          dietaryPreference: false
        }
      }
    ],
    fields: [
      {
        name: 'calories',
        label: 'Daily Calorie Target (kcal)',
        type: 'text',
        placeholder: 'e.g., 2000 or 2500',
        defaultValue: '2200',
        helpText: 'Your estimated total daily energy expenditure or deficit target.',
        required: true
      },
      {
        name: 'goal',
        label: 'Primary Fitness Goal',
        type: 'select',
        defaultValue: 'Fat Loss & Lean Muscle',
        options: [
          { label: 'Fat Loss & Lean Muscle', value: 'Fat Loss & Lean Muscle' },
          { label: 'Muscle Hypertrophy & Strength', value: 'Muscle Hypertrophy & Strength' },
          { label: 'Aggressive Fat Loss (Cut)', value: 'Aggressive Fat Loss' },
          { label: 'Weight Maintenance & Energy', value: 'Weight Maintenance & Energy' },
          { label: 'Endurance & Athletic Performance', value: 'Endurance & Athletic Performance' }
        ],
        required: true
      },
      {
        name: 'dietaryPreference',
        label: 'Include Indian Dietary Staples (Paneer, Dal, Soya, Eggs)',
        type: 'toggle',
        defaultValue: true,
        helpText: 'Structures meal plans around easily accessible regional high-protein foods.'
      }
    ],
    calculatePreview: (values) => {
      const cal = parseFloat(String(values.calories || '2200').replace(/,/g, '')) || 2200;
      const isMuscle = String(values.goal || '').includes('Muscle');
      const isAggressiveCut = String(values.goal || '').includes('Aggressive');

      let proteinPct = 0.30;
      let fatPct = 0.25;
      let carbPct = 0.45;

      if (isMuscle) {
        proteinPct = 0.30;
        fatPct = 0.20;
        carbPct = 0.50;
      } else if (isAggressiveCut) {
        proteinPct = 0.35;
        fatPct = 0.25;
        carbPct = 0.40;
      }

      const proteinGrams = Math.round((cal * proteinPct) / 4);
      const fatGrams = Math.round((cal * fatPct) / 9);
      const carbGrams = Math.round((cal * carbPct) / 4);

      return [
        { label: 'Protein Target', value: `${proteinGrams}g`, detail: `${Math.round(proteinPct * 100)}% of calories (4 kcal/g)`, highlight: true },
        { label: 'Carbohydrates', value: `${carbGrams}g`, detail: `${Math.round(carbPct * 100)}% of calories (4 kcal/g)` },
        { label: 'Healthy Fats', value: `${fatGrams}g`, detail: `${Math.round(fatPct * 100)}% of calories (9 kcal/g)` }
      ];
    },
    compilePrompt: (values) => {
      const cal = values.calories || '2200';
      const goal = values.goal || 'Fat Loss';
      const indian = values.dietaryPreference;

      return `Act as an elite certified sports nutritionist. Calculate an optimal daily macronutrient breakdown (exact grams and percentages of Protein, Carbohydrates, and Fats) for a target of ${cal} calories per day, designed for ${goal}. ${
        indian
          ? 'Provide a practical, nutritious 1-day meal plan featuring wholesome Indian dietary staples (including high-protein vegetarian and non-vegetarian choices such as paneer, dal, soya chunks, sprouts, curd, eggs, or chicken) with meal timings and portion sizes.'
          : 'Provide a clean, whole-food 1-day meal plan with portion sizes and nutrient timing.'
      } Include hydration and workout nutrition guidelines.`;
    },
    howToSteps: [
      { name: 'Enter Calorie Target', text: 'Specify your daily target calories based on your maintenance or deficit.' },
      { name: 'Choose Your Goal', text: 'Select whether you are cutting fat, gaining lean mass, or sustaining endurance.' },
      { name: 'Generate Macro Breakdown', text: 'Click Search via AI Mode to receive exact grams, meal timing schedules, and grocery lists.' }
    ],
    faqs: [
      {
        question: 'How much protein do I need per pound of body weight?',
        answer: 'Scientific consensus recommends between 0.7 to 1.0 grams of protein per pound of body weight (1.6 to 2.2 grams per kg) for optimal muscle protein synthesis.'
      },
      {
        question: 'Can vegetarians get sufficient protein on an Indian diet?',
        answer: 'Yes! Combining staples like low-fat paneer, tofu, soya chunks (52% protein by weight), Greek yogurt, whey protein, lentils, and sprouted pulses provides complete essential amino acid profiles.'
      }
    ],
    keyFeatures: [
      'Instant Macro Grams & Caloric Ratio Breakdown',
      'Goal-Specific Caloric Deficit / Surplus Splits',
      'Whole-Food Regional Dietary Substitutions',
      'Structured 1-Day Timing Schedule'
    ],
    whyAIMode: 'AI Search Mode considers whole-food bioavailability, thermic effect of food (TEF), and realistic grocery swaps rather than generic, unhelpful numbers.'
  },
  {
    id: 'cold-email',
    slug: 'cold-email-writer',
    aliases: ['cold-email', 'sales-pitch', 'b2b-email-generator', 'outreach-email'],
    number: '05',
    category: 'Marketing',
    title: 'Cold Email & Pitch Writer',
    shortDescription: 'Crafts high-converting B2B cold email pitches with compelling subject lines, proof points, and low-friction CTAs.',
    searchVolumeBadge: 'B2B Sales Essential',
    accentColor: 'from-violet-500 to-indigo-400',
    badgeColor: 'text-violet-400 border-violet-500/30 bg-violet-950/40',
    iconName: 'Mail',
    seoTitle: 'B2B Cold Email Generator & Sales Pitch Writer - High Reply Rate Templates',
    seoDescription: 'Write high-converting B2B cold outreach emails in seconds. Irresistible subject lines, sharp value propositions, and under 100-word pitches.',
    seoKeywords: [
      'cold email generator',
      'b2b sales email writer',
      'cold outreach email template',
      'sales pitch generator',
      'cold email subject line generator',
      'b2b lead generation email'
    ],
    longTailKeywords: [
      'how to write a cold email to vp of sales under 100 words',
      'b2b outreach email template with low friction cta',
      'cold pitch subject lines with highest reply rates 2026',
      'outbound email framework to book enterprise demo',
      'how to pitch seo and web design to ecommerce founders',
      'cold email follow up sequence day 3 and day 7'
    ],
    longTailUseCases: [
      {
        query: 'What is a low-friction cold email call-to-action for busy executives?',
        title: 'Interest-Based Low-Friction CTA',
        summary: 'Asking for 30 minutes on a cold email has an abysmal reply rate. Asking "Mind if I send over a 60-second video walkthrough?" hits 8.4%+ reply rates.',
        presetValues: {
          recipientRole: 'VP of Engineering',
          productOffer: 'Automated CI/CD security scanner that cuts deployment test cycles from 45 mins to 3 mins',
          conciseConstraint: true
        }
      },
      {
        query: 'How to write a cold email that looks natural on mobile under 75 words?',
        title: 'Mobile-Optimized 3-Sentence Pitch',
        summary: 'Presents one specific problem observation, one social proof metric, and one casual low-friction ask that fits on a single smartphone screen without scrolling.',
        presetValues: {
          recipientRole: 'Chief Marketing Officer (Retail D2C)',
          productOffer: 'Turn abandoned cart emails into 1-click WhatsApp checkout links with 38% recovery',
          conciseConstraint: true
        }
      },
      {
        query: 'What are cold email subject lines with 60%+ open rates?',
        title: 'Curiosity & Peer Benchmark Subject Lines',
        summary: 'Uses all-lowercase, informal wording like "quick question re: onboarding" or "thoughts on churn?" that feel like internal peer emails rather than vendor pitches.',
        presetValues: {
          recipientRole: 'Founder & CEO (Seed Stage)',
          productOffer: 'Fractional Head of Sales to close your first $500k in ARR',
          conciseConstraint: true
        }
      }
    ],
    presets: [
      {
        label: 'SaaS Demo Pitch to VP of Sales',
        values: {
          recipientRole: 'VP of Sales at Mid-Market SaaS',
          productOffer: 'AI SDR software that books 15+ qualified pipeline demos per rep every month without manual prospecting',
          conciseConstraint: true
        }
      },
      {
        label: 'SEO Agency Pitch to E-commerce Founder',
        values: {
          recipientRole: 'Founder / Head of E-commerce (D2C)',
          productOffer: 'Programmatic SEO architecture that grew a competitor organic revenue by 240% in 90 days',
          conciseConstraint: true
        }
      }
    ],
    fields: [
      {
        name: 'recipientRole',
        label: 'Target Recipient Role & Industry',
        type: 'text',
        placeholder: 'e.g., Head of Talent, VP of Engineering, Chief Marketing Officer',
        defaultValue: 'VP of Growth & Marketing',
        helpText: 'Who will receive and read this email?',
        required: true
      },
      {
        name: 'productOffer',
        label: 'Core Offer / Solution & Value Metric',
        type: 'textarea',
        placeholder: 'e.g., We automate invoice reconciliation, saving finance teams 20 hours per week...',
        defaultValue: 'AI-powered workflow that cuts sales prospecting by 70% and increases outbound reply rates by 3x',
        helpText: 'What problem are you solving and what quantifiable benefit do they get?',
        required: true
      },
      {
        name: 'conciseConstraint',
        label: 'Strict Constraint: Under 100 Words (Maximum Mobile Readability)',
        type: 'toggle',
        defaultValue: true,
        helpText: 'Short emails (<100 words) achieve dramatically higher reply rates on executive smartphone inboxes.'
      }
    ],
    compilePrompt: (values) => {
      const role = values.recipientRole || 'Decision Maker';
      const offer = values.productOffer || 'Our enterprise software';
      const short = values.conciseConstraint;

      return `Act as a world-class B2B copywriter. Write a high-converting cold outreach email pitching the following offer: "${offer}" to a "${role}". The email must include an irresistible subject line, a personalized hook, a sharp value proposition with proof points, and a low-friction call-to-action (CTA). ${
        short
          ? 'Strict constraint: Keep the body strictly under 100 words with zero fluff, high scannability, and a confident tone.'
          : 'Also include 2 brief follow-up email drafts for Day 3 and Day 7.'
      }`;
    },
    howToSteps: [
      { name: 'Specify Your Buyer Persona', text: 'Enter the exact job title and company profile of your ideal prospect.' },
      { name: 'State Your Concrete Value', text: 'Describe your offer with tangible numbers and saved hours or revenue.' },
      { name: 'Generate Pitch & Subject Lines', text: 'Click Search via AI Mode to generate subject line variations and a crisp outreach email.' }
    ],
    faqs: [
      {
        question: 'Why are cold emails under 100 words more effective?',
        answer: 'More than 70% of B2B decision-makers read cold emails on mobile devices. Short emails allow the recipient to digest the entire pitch in one screen without scrolling, leading to higher response rates.'
      },
      {
        question: 'What is a low-friction call-to-action (CTA)?',
        answer: 'Instead of asking for a demanding "30-minute demo", a low-friction CTA asks for interest: "Mind if I send over a 90-second video walkthrough?" or "Worth a short conversation next Tuesday?"'
      }
    ],
    keyFeatures: [
      'Irresistible Subject Lines with High Open Rates',
      'Scannable Mobile-First Body Copy (<100 words)',
      'Low-Friction Interest-Based Call to Actions',
      'Follow-Up Multi-Touch Sequences'
    ],
    whyAIMode: 'AI Search Mode analyzes modern spam trigger filters and evolving executive email habits to craft messages that land in Primary Inboxes rather than spam folders.'
  },
  {
    id: 'market-sentiment',
    slug: 'market-sentiment-analyzer',
    aliases: ['market-sentiment', 'stock-analyzer', 'crypto-sentiment', 'ticker-analysis'],
    number: '06',
    category: 'Finance',
    title: 'Crypto & Stock Market Sentiment Analyzer',
    shortDescription: 'Delivers technical and fundamental sentiment summaries, key support/resistance zones, and risk mitigation warnings.',
    searchVolumeBadge: 'Financial Intelligence',
    accentColor: 'from-rose-500 to-red-400',
    badgeColor: 'text-rose-400 border-rose-500/30 bg-rose-950/40',
    iconName: 'TrendingUp',
    seoTitle: 'Stock & Crypto Market Sentiment Analyzer - Technical & Fundamental Overview',
    seoDescription: 'Get real-time market sentiment, support/resistance levels, technical indicators, and risk mitigation summaries for any stock or cryptocurrency ticker.',
    seoKeywords: [
      'stock market sentiment analyzer',
      'crypto sentiment online',
      'technical analysis ai',
      'stock support and resistance levels',
      'market sentiment tool',
      'trading sentiment overview'
    ],
    longTailKeywords: [
      'how to analyze stock market sentiment before earnings call',
      'bitcoin support and resistance levels ai technical analysis',
      'evaluate downside risk and stop loss for swing trade',
      'nvidia stock fundamental valuation and sentiment overview',
      'crypto market fear and greed index trading implications',
      'how to identify institutional accumulation and distribution zones',
      'technical breakout confirmation vs false breakout risk'
    ],
    longTailUseCases: [
      {
        query: 'How to analyze stock sentiment and volatility ahead of an earnings release?',
        title: 'Pre-Earnings Volatility & Sentiment Scan',
        summary: 'Examines implied volatility (IV) crush risk, options market positioning, analyst revisions, and historical post-earnings move averages.',
        presetValues: {
          ticker: 'NVDA (Nvidia Corp)',
          horizon: 'Short-term (Swing / 1-4 Weeks)',
          includeRisks: true
        }
      },
      {
        query: 'What are the key technical support and resistance levels for Bitcoin?',
        title: 'Bitcoin Order Block & Liquidity Map',
        summary: 'Synthesizes 200-day moving averages, Fibonacci retracements, and major order-book liquidity clusters into clear price boundaries.',
        presetValues: {
          ticker: 'BTC / Bitcoin',
          horizon: 'Medium-term (1-6 Months)',
          includeRisks: true
        }
      },
      {
        query: 'How to calculate a trailing stop loss to protect profits on a growth stock?',
        title: 'Capital Preservation Stop-Loss Strategy',
        summary: 'Calculates Average True Range (ATR) multiples to set a volatility-adjusted trailing stop that avoids getting shaken out during normal intraday noise.',
        presetValues: {
          ticker: 'TSLA (Tesla)',
          horizon: 'Short-term (Swing / 1-4 Weeks)',
          includeRisks: true
        }
      }
    ],
    presets: [
      {
        label: 'Nvidia (NVDA) - Swing Trade',
        values: {
          ticker: 'NVDA (Nvidia Corp)',
          horizon: 'Short-term (Swing / 1-4 Weeks)',
          includeRisks: true
        }
      },
      {
        label: 'Bitcoin (BTC) - Medium Term',
        values: {
          ticker: 'BTC / Bitcoin',
          horizon: 'Medium-term (1-6 Months)',
          includeRisks: true
        }
      },
      {
        label: 'Apple (AAPL) - Long Term Investor',
        values: {
          ticker: 'AAPL (Apple Inc)',
          horizon: 'Long-term (1-3+ Years)',
          includeRisks: false
        }
      }
    ],
    fields: [
      {
        name: 'ticker',
        label: 'Asset Ticker or Company Name',
        type: 'text',
        placeholder: 'e.g., TSLA, BTC, ETH, RELIANCE, SPY',
        defaultValue: 'NVDA (Nvidia)',
        helpText: 'Enter stock symbol, cryptocurrency ticker, or index ETF.',
        required: true
      },
      {
        name: 'horizon',
        label: 'Investment Time Horizon',
        type: 'select',
        defaultValue: 'Short-term (Swing / 1-4 Weeks)',
        options: [
          { label: 'Intraday (Day Trading / Scalp)', value: 'Intraday (Day Trading)' },
          { label: 'Short-term (Swing / 1-4 Weeks)', value: 'Short-term (Swing / 1-4 Weeks)' },
          { label: 'Medium-term (1-6 Months)', value: 'Medium-term (1-6 Months)' },
          { label: 'Long-term (1-3+ Years)', value: 'Long-term (1-3+ Years)' }
        ],
        required: true
      },
      {
        name: 'includeRisks',
        label: 'Include Downside Risk Factors & Prudent Stop-Loss Scenarios',
        type: 'toggle',
        defaultValue: true,
        helpText: 'Evaluates macroeconomic headwinds, earnings dates, and capital preservation thresholds.'
      }
    ],
    compilePrompt: (values) => {
      const ticker = values.ticker || 'SPY';
      const horizon = values.horizon || 'Medium-term';
      const risks = values.includeRisks;

      return `Act as a seasoned financial analyst. Provide a comprehensive market sentiment and investment analysis for ${ticker} across a ${horizon} investment horizon. Analyze:\n1. Current market sentiment, macro drivers, and catalyst events.\n2. Key technical levels: primary support, resistance, and volume profile.\n3. Fundamental health and valuation overview.\n${
        risks
          ? '4. Major downside risk factors, volatility metrics, and prudent stop-loss or capital preservation guidelines.'
          : '4. Potential upside price targets and bullish indicators.'
      }\nPresent findings objectively with transparent market disclaimers.`;
    },
    howToSteps: [
      { name: 'Enter Ticker Symbol', text: 'Type in any global stock, crypto token, or commodity symbol.' },
      { name: 'Pick Your Time Frame', text: 'Select whether you are day trading, swing trading, or holding long-term.' },
      { name: 'Analyze Real-Time Sentiment', text: 'Click Search via AI Mode to open live technical charts, news sentiment, and support/resistance summaries.' }
    ],
    faqs: [
      {
        question: 'Does this provide guaranteed financial advice?',
        answer: 'No. This tool generates analytical prompts that summarize public market data, sentiment indices, and technical chart metrics for educational and research purposes.'
      },
      {
        question: 'Can I analyze Indian stocks (NSE/BSE) as well as US stocks?',
        answer: 'Yes! Google Search AI processes both international exchanges (NYSE, NASDAQ, LSE) and Indian markets (NSE, BSE).'
      }
    ],
    keyFeatures: [
      'Real-Time News & Social Sentiment Synthesis',
      'Key Technical Support & Resistance Levels',
      'Macro Risk Warning & Stop-Loss Guidelines',
      'Fundamental Health & Valuation Ratios'
    ],
    whyAIMode: 'By searching via Google AI Mode, you tap into live trading feeds, earnings call transcripts, and breaking news released in the last hour.'
  },
  {
    id: 'pdf-summarizer',
    slug: 'pdf-text-summarizer',
    aliases: ['pdf-summarizer', 'text-summarizer', 'tldr-generator', 'document-summarizer'],
    number: '07',
    category: 'Productivity',
    title: 'PDF & Long Text Summarizer',
    shortDescription: 'Transforms dense reports, articles, and documents into structured executive summaries and actionable key takeaways.',
    searchVolumeBadge: 'Everyday Productivity',
    accentColor: 'from-sky-500 to-blue-400',
    badgeColor: 'text-sky-400 border-sky-500/30 bg-sky-950/40',
    iconName: 'FileText',
    seoTitle: 'Free AI PDF & Text Summarizer Online - TL;DR Executive Briefing',
    seoDescription: 'Summarize long PDFs, research papers, articles, and documents into clear bullet points and executive summaries. Fast, accurate, and free online.',
    seoKeywords: [
      'pdf summarizer online',
      'text summarizer ai',
      'tldr generator free',
      'summarize article online',
      'executive summary generator',
      'long text to bullet points'
    ],
    longTailKeywords: [
      'how to summarize 50 page research paper into executive brief',
      'extract quantifiable metrics and financial data from quarterly report',
      'turn long legal terms and conditions into bullet points',
      'free online text summarizer without word limit',
      'ai tool to extract key takeaways from meeting transcript',
      'condense scientific paper methodology and conclusion'
    ],
    longTailUseCases: [
      {
        query: 'How to summarize a 50-page financial quarterly report in 3 minutes?',
        title: 'Executive Financial Metric Extraction',
        summary: 'Pulls revenue figures, year-over-year percentage variances, gross margins, and forward guidance notes into a concise 1-page table.',
        presetValues: {
          text: 'The company reported Q3 revenue of $14.2 billion, representing an 18% year-over-year growth, driven by enterprise cloud renewals and international market expansion. Operating margin expanded by 240 basis points to 31.5%, while free cash flow reached $3.8 billion.',
          depth: 'Executive Briefing with Key Metrics',
          includeExecutiveSummary: true
        }
      },
      {
        query: 'How to extract actionable takeaways from a technical research paper?',
        title: 'Methodology & Outcome Synthesis',
        summary: 'Separates abstract hypotheses from practical experimental results, highlighting benchmark accuracy scores and real-world limitations.',
        presetValues: {
          text: 'Artificial Intelligence models in 2026 are shifting from raw chat interfaces toward multi-agent workflow orchestrators that operate tools, coordinate tasks, and deliver autonomous outputs with verified guardrails.',
          depth: 'Actionable Bullet Points',
          includeExecutiveSummary: true
        }
      }
    ],
    presets: [
      {
        label: 'AI & Autonomous Systems Briefing',
        values: {
          text: 'Artificial Intelligence models in 2026 are shifting from raw chat interfaces toward multi-agent workflow orchestrators that operate tools, coordinate tasks, and deliver autonomous outputs with verified guardrails. Enterprise adoption has surged across legal, customer engineering, and supply chain logistics.',
          depth: 'Actionable Bullet Points',
          includeExecutiveSummary: true
        }
      },
      {
        label: 'Quarterly Financial Report Excerpt',
        values: {
          text: 'The company reported Q3 revenue of $14.2 billion, representing an 18% year-over-year growth, driven by enterprise cloud renewals and international market expansion. Operating margin expanded by 240 basis points to 31.5%, while free cash flow reached $3.8 billion.',
          depth: 'Deep Dive & Nuance Analysis',
          includeExecutiveSummary: true
        }
      }
    ],
    fields: [
      {
        name: 'text',
        label: 'Paste Document, Article, or PDF Text',
        type: 'textarea',
        placeholder: 'Paste the article text, study excerpt, or legal document here...',
        defaultValue: 'Artificial Intelligence models in 2026 are shifting from raw chat interfaces toward multi-agent workflow orchestrators that operate tools, coordinate tasks, and deliver autonomous outputs with verified guardrails.',
        helpText: 'Paste any text length from paragraphs to full whitepapers.',
        required: true
      },
      {
        name: 'depth',
        label: 'Summary Format & Depth',
        type: 'select',
        defaultValue: 'Actionable Bullet Points',
        options: [
          { label: 'Actionable Bullet Points', value: 'Actionable Bullet Points' },
          { label: 'One-Paragraph TL;DR', value: 'One-Paragraph TL;DR' },
          { label: 'Executive Briefing with Key Metrics', value: 'Executive Briefing with Key Metrics' },
          { label: 'Deep Dive & Nuance Analysis', value: 'Deep Dive & Nuance Analysis' }
        ],
        required: true
      },
      {
        name: 'includeExecutiveSummary',
        label: 'Include Top Executive Summary (TL;DR) with Highlighted Numbers',
        type: 'toggle',
        defaultValue: true,
        helpText: 'Extracts critical statistics, percentage changes, and strategic implications into an instant top banner.'
      }
    ],
    compilePrompt: (values) => {
      const text = values.text || '';
      const depth = values.depth || 'Bullet Points';
      const exec = values.includeExecutiveSummary;

      return `Act as an expert research summarizer. Synthesize and analyze the following text with high clarity:\n\n"""\n${text}\n"""\n\nRequirements:\n- Output style: ${depth}.\n${
        exec
          ? '- Include a high-impact Executive Summary (TL;DR) at the top summarizing the core thesis and key quantifiable metrics.'
          : ''
      }\n- Extract primary takeaways, critical evidence, and strategic implications in clean bullet points.\n- Remove all redundant filler words.`;
    },
    howToSteps: [
      { name: 'Paste Text or Notes', text: 'Copy and paste the text from your PDF, article, or meeting notes.' },
      { name: 'Choose Summary Style', text: 'Select between bullet points, a quick 1-paragraph TL;DR, or an executive brief.' },
      { name: 'Summarize with AI', text: 'Click Search via AI Mode to extract core conclusions and metric highlights instantly.' }
    ],
    faqs: [
      {
        question: 'Can this summarize technical research papers and legal terms?',
        answer: 'Yes! The prompt specifies extracting critical evidence and strategic implications while cutting through dense jargon.'
      }
    ],
    keyFeatures: [
      'Instant Noise & Filler Word Elimination',
      'Actionable Key Findings & Quantitative Metrics',
      'Executive TL;DR Overview for Fast Reading',
      'Scalable from Short Articles to Dense Reports'
    ],
    whyAIMode: 'AI Search Mode can cross-reference the summarized text against source citations, author credentials, and broader industry context.'
  },
  {
    id: 'business-name',
    slug: 'business-name-generator',
    aliases: ['business-name', 'brand-name-generator', 'domain-finder', 'company-name-ideas'],
    number: '08',
    category: 'Business',
    title: 'Business Name & Domain Finder',
    shortDescription: 'Brainstorms 10 catchy, brandable business name ideas with available .com concepts and organic search SEO potential.',
    searchVolumeBadge: 'Entrepreneur Favorite',
    accentColor: 'from-fuchsia-500 to-purple-400',
    badgeColor: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-950/40',
    iconName: 'Briefcase',
    seoTitle: 'Free AI Business Name Generator & Domain Finder - 10 Catchy Brand Names',
    seoDescription: 'Generate unique, memorable business names with available .com domain ideas. AI brand name finder for startups, online stores, and agencies.',
    seoKeywords: [
      'business name generator free',
      'brand name ideas ai',
      'company name generator',
      'startup name generator',
      'domain name finder',
      'catchy brand name ideas'
    ],
    longTailKeywords: [
      'how to find available dot com domain name for tech startup',
      'catchy minimalist brand names for ecommerce eco friendly store',
      'trademark clearance check and organic search seo domain ideas',
      'two syllable memorable company name generator free',
      'creative modern names for artificial intelligence agency'
    ],
    longTailUseCases: [
      {
        query: 'How to invent a 2-syllable tech brand name with an available .com?',
        title: 'Two-Syllable Invented Word Archetype',
        summary: 'Combines Greek and Latin roots to create distinctive neologisms (like Vercel, Figma, Stripe) that are easy to spell and trademark.',
        presetValues: {
          idea: 'AI automated customer support agent for Shopify stores',
          style: 'Short & Punchy (One Word / 2 Syllables)',
          seoPotential: true
        }
      },
      {
        query: 'What are catchy brand names for an eco-friendly consumer goods brand?',
        title: 'Sustainable Lifestyle Brand Positioning',
        summary: 'Evokes natural elements, cleanliness, and responsibility without relying on overused cliches like Eco-, Bio-, or Green-.',
        presetValues: {
          idea: 'Zero-waste bamboo oral care and compostable dental floss',
          style: 'Modern & Minimalist',
          seoPotential: true
        }
      }
    ],
    presets: [
      {
        label: 'Eco-Friendly E-commerce Packaging',
        values: {
          idea: 'Eco-friendly automated packaging and biodegradable mailers for e-commerce brands',
          style: 'Modern & Minimalist',
          seoPotential: true
        }
      },
      {
        label: 'Fintech Mobile Savings App',
        values: {
          idea: 'Micro-investing mobile app for college students to invest spare change into index funds',
          style: 'Short & Punchy (One Word / 2 Syllables)',
          seoPotential: true
        }
      }
    ],
    fields: [
      {
        name: 'idea',
        label: 'Core Business Concept & Value',
        type: 'text',
        placeholder: 'e.g., Specialty coffee subscription, AI marketing analytics, Pet grooming van',
        defaultValue: 'Eco-friendly automated packaging for e-commerce deliveries',
        helpText: 'What does your company do and what is unique about it?',
        required: true
      },
      {
        name: 'style',
        label: 'Desired Brand Personality',
        type: 'select',
        defaultValue: 'Modern & Minimalist',
        options: [
          { label: 'Modern & Minimalist', value: 'Modern & Minimalist' },
          { label: 'Short & Punchy (One Word / 2 Syllables)', value: 'Short & Punchy' },
          { label: 'Tech & Futuristic', value: 'Tech & Futuristic' },
          { label: 'Luxury & Elegant', value: 'Luxury & Elegant' },
          { label: 'Playful & Creative', value: 'Playful & Creative' }
        ],
        required: true
      },
      {
        name: 'seoPotential',
        label: 'Evaluate Organic Search SEO & Domain Memorability',
        type: 'toggle',
        defaultValue: true,
        helpText: 'Checks search intent volume, Google spell-check traps, and phonetic pronunciation.'
      }
    ],
    compilePrompt: (values) => {
      const idea = values.idea || 'Startup concept';
      const style = values.style || 'Modern';
      const seo = values.seoPotential;

      return `Act as a creative branding director and domain specialist. Generate 10 catchy, unique, and memorable business name ideas for the following concept: "${idea}". Desired Brand Style: ${style}. For each name:\n1. Suggest a clean, available .com domain variation.\n2. Explain the branding psychology and reason why it works.\n${
        seo
          ? '3. Evaluate organic SEO search potential and trademark clearance viability.'
          : '3. Provide an accompanying 1-sentence brand slogan/tagline.'
      }`;
    },
    howToSteps: [
      { name: 'Describe Your Concept', text: 'Enter what your business will sell or offer.' },
      { name: 'Pick a Naming Archetype', text: 'Select minimalist, punchy, tech, or luxury.' },
      { name: 'Discover 10 Names & Domains', text: 'Click Search via AI Mode to review brand names, available domain concepts, and logo slogans.' }
    ],
    faqs: [
      {
        question: 'What makes a business name legally defensible and brandable?',
        answer: 'Invented or suggestive names (like Spotify, Uber, or Airbnb) are far easier to trademark and build organic SEO authority around than generic, descriptive terms.'
      }
    ],
    keyFeatures: [
      '10 Creative & Brandable Business Names',
      'Realistic .COM Domain Extensions & Prefixes',
      'Psychological Association & Positioning Notes',
      'Organic Search Trademark & Confusion Check'
    ],
    whyAIMode: 'AI Search checks real-time domain registrar listings and existing web entities to avoid suggesting names already dominated by global incumbents.'
  },
  {
    id: 'product-description',
    slug: 'product-description-generator',
    aliases: ['product-description', 'shopify-description', 'amazon-listing-generator', 'ecommerce-copywriter'],
    number: '09',
    category: 'E-commerce',
    title: 'Product Description Generator for E-commerce',
    shortDescription: 'Produces persuasive, benefit-driven Amazon and Shopify copy using emotional storytelling and conversion copywriting.',
    searchVolumeBadge: 'E-Commerce Growth',
    accentColor: 'from-cyan-500 to-teal-400',
    badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40',
    iconName: 'ShoppingBag',
    seoTitle: 'AI Product Description Generator for Shopify & Amazon - High Conversion Copy',
    seoDescription: 'Create high-converting e-commerce product descriptions for Shopify, Amazon, and D2C stores. Compelling benefits, SEO keywords, and clear call-to-actions.',
    seoKeywords: [
      'product description generator',
      'shopify product description generator',
      'amazon product listing copywriter',
      'ecommerce copy generator',
      'benefit driven product copy',
      'free product description writer'
    ],
    longTailKeywords: [
      'how to write high converting amazon bullet points for electronics',
      'shopify product description storytelling conversion formula',
      'seo optimized product listing title and benefits format',
      'write d2c product copy that justifies premium pricing',
      'bullet points format for dropshipping product page'
    ],
    longTailUseCases: [
      {
        query: 'How to write Amazon bullet points that convert traffic into sales?',
        title: '5-Point Feature-to-Benefit Amazon Formula',
        summary: 'Starts every bullet with a capitalized 2-4 word emotional benefit, followed by technical specifications and guarantees.',
        presetValues: {
          features: 'Ultra-light titanium ergonomic wireless mouse with silent mechanical switches, 90-day battery, and Bluetooth 5.4 multi-device pairing',
          targetAudience: 'Remote software engineers, graphic designers & desk workers',
          storytelling: true
        }
      },
      {
        query: 'How to write luxury D2C brand copy that justifies 3x market pricing?',
        title: 'Sensory Storytelling & Craftsmanship Copy',
        summary: 'Focuses on artisanal sourcing, obsessive quality standards, and the sophisticated feeling of ownership.',
        presetValues: {
          features: 'Ceremonial grade Japanese matcha powder, rich in L-theanine and antioxidants, zero sugar, stone-ground in Uji Kyoto',
          targetAudience: 'Health enthusiasts seeking calm, sustained energy without caffeine jitters',
          storytelling: true
        }
      }
    ],
    presets: [
      {
        label: 'Ergonomic Titanium Wireless Mouse',
        values: {
          features: 'Ultra-light titanium ergonomic wireless mouse with silent mechanical switches, 90-day battery, and Bluetooth 5.4 multi-device pairing',
          targetAudience: 'Remote software engineers, graphic designers & desk workers',
          storytelling: true
        }
      },
      {
        label: 'Organic Matcha Green Tea Powder',
        values: {
          features: 'Ceremonial grade Japanese matcha powder, rich in L-theanine and antioxidants, zero sugar, stone-ground in Uji Kyoto',
          targetAudience: 'Health enthusiasts seeking calm, sustained energy without caffeine jitters',
          storytelling: true
        }
      }
    ],
    fields: [
      {
        name: 'features',
        label: 'Product Specs & Core Features',
        type: 'textarea',
        placeholder: 'List material, dimensions, battery life, unique selling points...',
        defaultValue: 'Ultra-light titanium ergonomic wireless mouse with silent mechanical switches, 90-day battery, and Bluetooth 5.4 multi-device pairing',
        helpText: 'What is the product and what are its physical or software specs?',
        required: true
      },
      {
        name: 'targetAudience',
        label: 'Target Buyer Persona',
        type: 'text',
        placeholder: 'e.g., Busy moms, College students, Crossfit athletes',
        defaultValue: 'Remote software engineers & digital creators',
        helpText: 'Who is most excited to purchase this product?',
        required: true
      },
      {
        name: 'storytelling',
        label: 'Use Emotional Storytelling & Pain-to-Pleasure Transformation',
        type: 'toggle',
        defaultValue: true,
        helpText: 'Connects the raw features to emotional relief, saved time, and upgraded lifestyle.'
      }
    ],
    compilePrompt: (values) => {
      const feat = values.features || 'Product features';
      const aud = values.targetAudience || 'Consumers';
      const story = values.storytelling;

      return `Act as an e-commerce conversion copywriter. Write a persuasive, high-converting product description (for Amazon / Shopify / D2C storefront) for: "${feat}". Target Audience: "${aud}". ${
        story
          ? 'Use an engaging storytelling approach that paints a vivid picture of the customer problem and shows how this product transforms their daily life.'
          : 'Focus on bold, benefit-driven bullet points with capitalized benefit headers.'
      } Include an SEO-optimized title, 5 benefit bullets, technical specifications, and a compelling urgency-driven Call to Action.`;
    },
    howToSteps: [
      { name: 'List Product Specs', text: 'Input materials, key specs, and what makes your item unique.' },
      { name: 'Define Customer Persona', text: 'Name who buys this and what pain point they are solving.' },
      { name: 'Generate Storefront Copy', text: 'Click Search via AI Mode to generate Amazon bullet points, Shopify descriptions, and SEO meta tags.' }
    ],
    faqs: [
      {
        question: 'Will this copy rank on Google and Amazon search engines?',
        answer: 'Yes! The prompt structures the response with high-intent keywords in the title and the first 100 words of description for high organic indexing.'
      }
    ],
    keyFeatures: [
      'High-CTR Amazon & Shopify Ready Copy',
      'Pain-to-Pleasure Psychological Benefit Bullets',
      'Built-in Urgency & Clear Call to Actions',
      'SEO Keyword Rich Title & Feature Tags'
    ],
    whyAIMode: 'AI Search Mode applies proven direct-response conversion copywriting principles used by 7-figure e-commerce brands.'
  },
  {
    id: 'interview-prep',
    slug: 'interview-prep-generator',
    aliases: ['interview-prep', 'mock-interview', 'star-method-interview', 'interview-questions'],
    number: '10',
    category: 'Career',
    title: 'Interview Prep & Mock Question Generator',
    shortDescription: 'Prepares top 5 expected technical and behavioral interview questions with model STAR-method answers for any job role.',
    searchVolumeBadge: 'Career Accelerator',
    accentColor: 'from-indigo-500 to-blue-400',
    badgeColor: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/40',
    iconName: 'UserCheck',
    seoTitle: 'Free AI Interview Prep & Mock Question Generator - STAR Method Answers',
    seoDescription: 'Prepare for any job interview with top role-specific questions and model STAR-method answers. Practice technical and behavioral questions for free.',
    seoKeywords: [
      'interview question generator',
      'mock interview prep online',
      'star method interview answers',
      'behavioral interview questions',
      'job interview preparation ai',
      'free interview practice'
    ],
    longTailKeywords: [
      'how to answer behavioral interview questions using star method',
      'senior software engineer technical interview questions model answers',
      'tough curveball interview questions for product managers',
      'what strategic questions should candidate ask hiring manager',
      'tell me about a time you failed interview answer template'
    ],
    longTailUseCases: [
      {
        query: 'How to structure a STAR method answer for "Tell me about a time you had a conflict with a team member"?',
        title: 'Conflict Resolution STAR Framework',
        summary: 'De-escalates personal tension, focuses on shared business goals, and shows emotional maturity and active listening.',
        presetValues: {
          jobRole: 'Product Manager (B2B Enterprise SaaS)',
          experience: 'Mid-Level (2-5 yrs)',
          includeCurveballs: true
        }
      },
      {
        query: 'What are smart questions to ask a VP of Engineering at the end of an interview?',
        title: 'Reverse-Interview Questions for Engineering Leaders',
        summary: 'Probes technical debt management, engineering KPIs, on-call rotation balance, and architectural decision freedom.',
        presetValues: {
          jobRole: 'Senior Full-Stack Software Engineer (React / Node / Cloud)',
          experience: 'Senior / Lead (5-8 yrs)',
          includeCurveballs: false
        }
      }
    ],
    presets: [
      {
        label: 'Senior Full-Stack Engineer',
        values: {
          jobRole: 'Senior Full-Stack Software Engineer (React / Node / Cloud)',
          experience: 'Senior / Lead (5-8 yrs)',
          includeCurveballs: true
        }
      },
      {
        label: 'Product Manager (B2B SaaS)',
        values: {
          jobRole: 'Product Manager (B2B Enterprise SaaS)',
          experience: 'Mid-Level (2-5 yrs)',
          includeCurveballs: true
        }
      },
      {
        label: 'Data Scientist / Machine Learning Engineer',
        values: {
          jobRole: 'Machine Learning Engineer (LLMs & Computer Vision)',
          experience: 'Senior / Lead (5-8 yrs)',
          includeCurveballs: true
        }
      }
    ],
    fields: [
      {
        name: 'jobRole',
        label: 'Target Job Role / Title',
        type: 'text',
        placeholder: 'e.g., Senior Full-Stack Engineer, Product Manager, Financial Analyst',
        defaultValue: 'Senior Full-Stack Engineer',
        helpText: 'What position are you interviewing for?',
        required: true
      },
      {
        name: 'experience',
        label: 'Seniority Level',
        type: 'select',
        defaultValue: 'Senior / Lead (5-8 yrs)',
        options: [
          { label: 'Entry Level / New Graduate (0-2 yrs)', value: 'Entry Level (0-2 yrs)' },
          { label: 'Mid-Level Specialist (2-5 yrs)', value: 'Mid-Level (2-5 yrs)' },
          { label: 'Senior / Lead (5-8 yrs)', value: 'Senior / Lead (5-8 yrs)' },
          { label: 'Staff / Principal / Director (8+ yrs)', value: 'Staff / Director (8+ yrs)' }
        ],
        required: true
      },
      {
        name: 'includeCurveballs',
        label: 'Include 3 Tough Behavioral Curveballs (STAR Method Model Answers)',
        type: 'toggle',
        defaultValue: true,
        helpText: 'Generates crisis management and conflict resolution questions designed to test composure.'
      }
    ],
    compilePrompt: (values) => {
      const role = values.jobRole || 'Professional';
      const exp = values.experience || 'Experienced';
      const curve = values.includeCurveballs;

      return `Act as a discerning hiring manager and interview coach at a top global firm. Prepare an interview preparation guide for a candidate applying for the role of "${role}" at the "${exp}" experience level. Provide:\n1. The top 5 most critical, highly-expected technical and domain interview questions with model answers structured using the STAR method (Situation, Task, Action, Result).\n${
        curve
          ? '2. 3 tough behavioral and situational curveball questions designed to test crisis resolution and decision-making under stress, with tips to avoid common candidate red flags.'
          : '2. Top strategic questions the candidate should ask the interviewers to impress them.'
      }\n3. Actionable negotiation and confidence tips for this seniority level.`;
    },
    howToSteps: [
      { name: 'Specify Your Target Position', text: 'Enter the exact job title and select your career seniority level.' },
      { name: 'Enable STAR Method Responses', text: 'Keep behavioral curveballs enabled to see model answers with Situation, Task, Action, and Result framing.' },
      { name: 'Run Mock Session via AI', text: 'Click Search via AI Mode to practice your answers against real hiring rubric standards.' }
    ],
    faqs: [
      {
        question: 'What is the STAR method for interview answers?',
        answer: 'STAR stands for Situation (context), Task (your responsibility), Action (the specific steps you executed), and Result (the quantifiable outcome achieved). It is the gold standard evaluated by global employers.'
      }
    ],
    keyFeatures: [
      'Top 5 Role-Specific Technical & Domain Questions',
      'STAR-Method Model Answer Frameworks',
      'Behavioral Curveball & Conflict Resolution Scenarios',
      'Reverse-Interview Questions to Ask the Hiring Team'
    ],
    whyAIMode: 'AI Search Mode analyzes recent interview debriefs and Glassdoor / Levels.fyi interview trends to predict the exact questions being asked this quarter.'
  },
  {
    id: 'youtube-script',
    slug: 'youtube-title-script-generator',
    aliases: ['youtube-script', 'youtube-title-generator', 'video-script-generator'],
    number: '11',
    category: 'Content',
    title: 'YouTube Title & Video Script Outline Generator',
    shortDescription: 'Brainstorms 10 high-CTR clickable YouTube titles and outlines structured 8-minute retention scripts.',
    searchVolumeBadge: 'Worldwide Creator Suite',
    accentColor: 'from-red-500 to-amber-500',
    badgeColor: 'text-red-400 border-red-500/30 bg-red-950/40',
    iconName: 'Sparkles',
    seoTitle: 'Free YouTube Title & Script Outline Generator - High CTR Video Ideas',
    seoDescription: 'Generate clickable, high-CTR YouTube titles and retention-optimized video script outlines. Maximize YouTube algorithm click-through-rate and watch time.',
    seoKeywords: [
      'youtube title generator',
      'youtube script generator',
      'viral youtube title ideas',
      'video outline generator',
      'youtube ctr optimizer',
      'script writer for youtube'
    ],
    longTailKeywords: [
      'how to write clickable youtube titles that get over 10 percent ctr',
      '8 minute youtube video script outline structure for retention',
      'how to create curiosity gap thumbnail concepts and title pairing',
      'open story loops formula to increase average view duration',
      'youtube intro hooks to prevent 30 second audience dropoff'
    ],
    longTailUseCases: [
      {
        query: 'How to structure an 8-minute YouTube video script to prevent 30-second audience dropoff?',
        title: 'Retention-Engineered 8-Minute Pacing',
        summary: 'Opens with a 15-second teaser of the climax, introduces an open story loop before minute 2, and places dynamic pattern interrupts every 90 seconds.',
        presetValues: {
          topic: 'How I built a profitable micro-SaaS with AI tools in 30 days',
          format: 'Documentary & Case Study',
          includeThumbnailConcept: true
        }
      },
      {
        query: 'How to write high-CTR YouTube titles without misleading clickbait?',
        title: 'Expectation-Matched Curiosity Titles',
        summary: 'Balances an intense emotional or counter-intuitive premise with authentic content fulfillment that avoids comment backlash.',
        presetValues: {
          topic: 'Daily morning habits that secretly drain your dopamine and productivity',
          format: 'Listicle / Top 10 Countdown',
          includeThumbnailConcept: true
        }
      }
    ],
    presets: [
      {
        label: 'How I Built a $10k/mo Micro-SaaS',
        values: {
          topic: 'How I built a profitable micro-SaaS with zero coding using AI tools in 30 days',
          format: 'Documentary & Case Study',
          includeThumbnailConcept: true
        }
      },
      {
        label: '10 Habit Mistakes Ruining Your Energy',
        values: {
          topic: 'Daily morning habits that secretly drain your dopamine and productivity',
          format: 'Listicle / Top 10 Countdown',
          includeThumbnailConcept: true
        }
      }
    ],
    fields: [
      {
        name: 'topic',
        label: 'Video Topic or Core Premise',
        type: 'text',
        placeholder: 'e.g., Why Apple Vision Pro failed, How to learn to code in 2026',
        defaultValue: 'How I built a profitable micro-SaaS with AI tools in 30 days',
        helpText: 'What is the main subject of your YouTube video?',
        required: true
      },
      {
        name: 'format',
        label: 'Video Style & Pacing',
        type: 'select',
        defaultValue: 'Documentary & Case Study',
        options: [
          { label: 'Documentary & Case Study', value: 'Documentary & Case Study' },
          { label: 'Listicle / Top 5 or 10 Countdown', value: 'Listicle' },
          { label: 'Step-by-Step Educational Tutorial', value: 'Tutorial' },
          { label: 'Storytelling & Personal Transformation', value: 'Storytelling' }
        ],
        required: true
      },
      {
        name: 'includeThumbnailConcept',
        label: 'Include High-CTR Thumbnail Design Concepts (Image + 3-Word Text)',
        type: 'toggle',
        defaultValue: true,
        helpText: 'Generates visual packaging ideas that pair with the titles for maximum Click-Through-Rate (CTR).'
      }
    ],
    compilePrompt: (values) => {
      const topic = values.topic || 'Video topic';
      const format = values.format || 'Tutorial';
      const thumb = values.includeThumbnailConcept;

      return `Act as a top YouTube algorithm consultant and script doctor. For the video topic: "${topic}" formatted as a "${format}", provide:\n1. 10 clickable, curiosity-driven YouTube titles designed to achieve >10% Click-Through-Rate (CTR) without sensational deceptive clickbait.\n2. A comprehensive 8-minute video script outline structured into:\n   - 0:00-0:30 Hook & Pattern Interrupt (Stops swipe away)\n   - 0:30-2:00 The Stakes / Why it matters\n   - 2:00-6:30 Core Content delivery with open story loops\n   - 6:30-8:00 Climax, Key Takeaway, and End-Screen Binge Watch CTA.\n${
        thumb
          ? '3. 3 paired Thumbnail Concepts describing visual composition, foreground subject expression, and a 3-word bold punchline text.'
          : ''
      }`;
    },
    howToSteps: [
      { name: 'Enter Your Video Concept', text: 'Type what you want to teach or talk about.' },
      { name: 'Select Your Pacing', text: 'Pick a documentary, tutorial, or listicle format.' },
      { name: 'Generate Titles & Script Breakdown', text: 'Click Search via AI Mode to receive 10 titles, thumbnail pairing, and timestamped script beats.' }
    ],
    faqs: [
      {
        question: 'How do titles and thumbnails interact on YouTube?',
        answer: 'The thumbnail sparks initial curiosity while the title confirms the topic and provides context. Never repeat the exact same words in both the thumbnail and title.'
      }
    ],
    keyFeatures: [
      '10 Algorithm-Optimized High CTR Titles',
      'Timestamped 8-Minute Retention Script Structure',
      'Open Story Loops to Maximize Average View Duration',
      'Visual Thumbnail Direction & Text Pairing'
    ],
    whyAIMode: 'AI Search Mode factors in current YouTube title trend structures (e.g. MrBeast, Ali Abdaal, Veritasium pacing) for modern viewers.'
  },
  {
    id: 'resume-builder',
    slug: 'resume-bullet-improver',
    aliases: ['resume-builder', 'resume-improver', 'ats-resume', 'resume-bullet-points'],
    number: '12',
    category: 'Career',
    title: 'ATS Resume Bullet Point & Impact Improver',
    shortDescription: 'Rewrites weak resume job bullets into high-impact, metric-driven statements that pass corporate ATS screening.',
    searchVolumeBadge: 'Job Search Must-Have',
    accentColor: 'from-teal-500 to-emerald-400',
    badgeColor: 'text-teal-400 border-teal-500/30 bg-teal-950/40',
    iconName: 'UserCheck',
    seoTitle: 'Free ATS Resume Bullet Point Improver - Metric & Action Verb Generator',
    seoDescription: 'Upgrade weak resume bullets into high-impact, ATS-friendly achievement statements using Google X-Y-Z formula: Accomplished [X], measured by [Y], by doing [Z].',
    seoKeywords: [
      'resume bullet point generator',
      'ats resume optimizer',
      'rewrite resume bullets online',
      'resume action verbs generator',
      'google xyz resume formula',
      'improve resume bullet points free'
    ],
    longTailKeywords: [
      'how to use google xyz formula for software engineer resume',
      'rewrite weak resume bullets to pass workday ats screening',
      'action verbs for marketing manager resume bullet points',
      'quantifiable achievement metrics for resume bullet points',
      'how to beat applicant tracking system filters with keyword density',
      'transform passive resume duty statements into measurable achievements'
    ],
    longTailUseCases: [
      {
        query: 'How to rewrite a software engineering bullet point with Google XYZ formula?',
        title: 'Google XYZ Engineering Impact Transformation',
        summary: 'Turns passive lines like "Fixed bugs and wrote code" into "Reduced client checkout latency by 34% (Y) by rewriting legacy Redux actions with async worker caches (Z), unblocking 120k daily active users (X)".',
        presetValues: {
          draftBullets: 'Built web pages using React and CSS. Fixed bugs in the codebase. Made pages load faster and improved user experience.',
          targetRole: 'Staff Frontend Engineer at Growth Tech Company',
          xyzFormula: true
        }
      },
      {
        query: 'How to pass Workday and Greenhouse automated ATS resume scanners?',
        title: 'Keyword Density & Power Action Verb Formula',
        summary: 'Replaces generic verbs like "assisted", "responsible for", and "handled" with active leadership verbs ("Spearheaded", "Architected", "Engineered") and inserts hard skill keywords.',
        presetValues: {
          draftBullets: 'Managed email marketing campaigns for our products. Increased sales and improved open rates. Worked with designers to create newsletters.',
          targetRole: 'Senior Email & Lifecycle Marketing Manager',
          xyzFormula: true
        }
      }
    ],
    presets: [
      {
        label: 'Marketing Campaign Manager',
        values: {
          draftBullets: 'Managed email marketing campaigns for our products. Increased sales and improved open rates. Worked with designers to create newsletters.',
          targetRole: 'Senior Email & Lifecycle Marketing Manager',
          xyzFormula: true
        }
      },
      {
        label: 'Frontend Web Developer',
        values: {
          draftBullets: 'Built web pages using React and CSS. Fixed bugs in the codebase. Made pages load faster and improved user experience.',
          targetRole: 'Staff Frontend Engineer at Growth Tech Company',
          xyzFormula: true
        }
      }
    ],
    fields: [
      {
        name: 'draftBullets',
        label: 'Paste Your Current Resume Bullets',
        type: 'textarea',
        placeholder: 'Paste 2-4 rough bullet points from your current resume or job history...',
        defaultValue: 'Managed email marketing campaigns for our products. Increased sales and improved open rates. Worked with designers to create newsletters.',
        helpText: 'Even rough, informal descriptions of what you did work great.',
        required: true
      },
      {
        name: 'targetRole',
        label: 'Target Job Position',
        type: 'text',
        placeholder: 'e.g., Product Marketing Manager, DevOps Architect',
        defaultValue: 'Senior Lifecycle Marketing Manager',
        helpText: 'What position do you want your resume tailored toward?',
        required: true
      },
      {
        name: 'xyzFormula',
        label: 'Enforce Google XYZ Formula: Accomplished [X] measured by [Y] by doing [Z]',
        type: 'toggle',
        defaultValue: true,
        helpText: 'The rigorous impact formula preferred by top Fortune 500 recruiters and ATS scanners.'
      }
    ],
    compilePrompt: (values) => {
      const bullets = values.draftBullets || '';
      const role = values.targetRole || 'Professional';
      const xyz = values.xyzFormula;

      return `Act as an elite executive resume writer and ATS optimization specialist. Rewrite the following resume bullet points for a candidate targeting the position of "${role}":\n\n"""\n${bullets}\n"""\n\nRequirements:\n1. Transform each rough bullet into 3 high-impact, professional variations.\n${
        xyz
          ? '2. Strictly apply Google’s acclaimed XYZ formula: "Accomplished [X], as measured by [Y], by doing [Z]" incorporating dynamic power action verbs and estimated quantifiable metrics (% growth, dollars saved, hours reduced).'
          : '2. Emphasize quantifiable business outcomes and leadership scope.'
      }\n3. Optimize keywords to score >95% on modern Applicant Tracking Systems (ATS) like Workday, Greenhouse, and Lever.\n4. Highlight which corporate buzzwords to permanently remove.`;
    },
    howToSteps: [
      { name: 'Paste Your Draft Bullets', text: 'Enter your raw or informal job responsibilities.' },
      { name: 'Set Your Dream Role', text: 'Enter the job title you are applying for.' },
      { name: 'Get ATS-Optimized Bullet Points', text: 'Click Search via AI Mode to generate quantifiable XYZ statements that impress hiring managers.' }
    ],
    faqs: [
      {
        question: 'What is the Google XYZ formula?',
        answer: 'Google’s recruiting formula states: "Accomplished [X], as measured by [Y], by doing [Z]". It anchors your achievements to tangible business metrics rather than passive task descriptions.'
      },
      {
        question: 'How do ATS filters screen resumes?',
        answer: 'Applicant Tracking Systems parse text for role-specific hard skills, strong action verbs, and numerical metrics while discarding tables, graphic icons, and vague fluff.'
      }
    ],
    keyFeatures: [
      'Strict Google XYZ Formula Application',
      'Applicant Tracking System (ATS) Keyword Density',
      'Action Verb Replacement for Passive Phrasing',
      'Elimination of Cliche Corporate Jargon'
    ],
    whyAIMode: 'AI Search Mode analyzes current job descriptions across top employers to inject the exact keywords required by automated recruiting filters.'
  }
];

export const TOOLS_DATA: ToolDefinition[] = [
  ...INITIAL_TOOLS,
  ...FINANCE_TOOLS,
  ...DEV_TOOLS,
  ...CONTENT_TOOLS,
  ...PRODUCTIVITY_TOOLS,
  ...BUSINESS_HEALTH_TOOLS,
  ...STEM_TOOLS,
  ...UTILITY_TOOLS,
  ...BUSINESS_CAREER_TOOLS,
  ...LIFESTYLE_FINANCE_TOOLS
];

export function findToolBySlugOrId(identifier: string): ToolDefinition | undefined {
  if (!identifier) return undefined;
  const clean = identifier.toLowerCase().trim();

  return TOOLS_DATA.find(tool => {
    if (tool.id.toLowerCase() === clean) return true;
    if (tool.slug.toLowerCase() === clean) return true;
    if (tool.aliases && tool.aliases.some(alias => alias.toLowerCase() === clean)) return true;
    return false;
  });
}
