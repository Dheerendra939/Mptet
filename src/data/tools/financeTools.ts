import { ToolDefinition } from '../../types';

export const FINANCE_TOOLS: ToolDefinition[] = [
  {
    id: 'compound-interest',
    slug: 'compound-interest-calculator',
    aliases: ['compound-interest', 'fire-calculator', 'wealth-growth', 'investment-calculator'],
    number: '13',
    category: 'Finance',
    title: 'Compound Interest & FIRE Calculator',
    shortDescription: 'Simulates exponential compound interest growth over time with annual contributions and financial independence (FIRE) metrics.',
    searchVolumeBadge: 'Financial Independence #1',
    accentColor: 'from-emerald-500 to-green-400',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
    iconName: 'PiggyBank',
    seoTitle: 'Free Compound Interest & FIRE Calculator Online - Exponential Growth Chart',
    seoDescription: 'Calculate compound interest growth, annual return compounding, and FIRE financial independence age. Free interactive wealth forecasting tool.',
    seoKeywords: [
      'compound interest calculator',
      'fire calculator online',
      'investment growth calculator',
      'exponential compound interest',
      'financial independence retirement early',
      'wealth compounder tool'
    ],
    longTailKeywords: [
      'how to calculate compound interest with monthly deposits',
      'fire retirement age calculator with 4 percent safe withdrawal rate',
      'compound interest formula for 1000 dollars a month at 8 percent',
      'sp500 compound growth calculator 30 years'
    ],
    longTailUseCases: [
      {
        query: 'How much will $500 invested monthly at 8% grow to in 25 years?',
        title: 'Monthly Dollar Cost Averaging Forecast',
        summary: 'At 8% historical index fund returns, $500/month generates over $478,000, with over $328,000 derived entirely from compounding interest rather than principal deposits.',
        presetValues: {
          principal: '10000',
          monthlyContribution: '500',
          rate: '8',
          years: '25'
        }
      }
    ],
    presets: [
      {
        label: 'S&P 500 Index ($500/mo, 8%, 25 Yrs)',
        values: { principal: '10000', monthlyContribution: '500', rate: '8', years: '25' }
      },
      {
        label: 'Aggressive FIRE Plan ($2,000/mo, 10%, 15 Yrs)',
        values: { principal: '25000', monthlyContribution: '2000', rate: '10', years: '15' }
      }
    ],
    fields: [
      { name: 'principal', label: 'Initial Starting Balance ($ / ₹ / €)', type: 'text', defaultValue: '10000', required: true },
      { name: 'monthlyContribution', label: 'Monthly Recurring Contribution', type: 'text', defaultValue: '500', required: true },
      { name: 'rate', label: 'Estimated Annual Rate of Return (%)', type: 'text', defaultValue: '8', required: true },
      { name: 'years', label: 'Investment Time Horizon (Years)', type: 'text', defaultValue: '20', required: true }
    ],
    calculatePreview: (values) => {
      const p = parseFloat(String(values.principal || '0').replace(/,/g, '')) || 0;
      const pmt = parseFloat(String(values.monthlyContribution || '0').replace(/,/g, '')) || 0;
      const r = (parseFloat(String(values.rate || '8')) || 8) / 100 / 12;
      const n = (parseInt(String(values.years || '20'), 10) || 20) * 12;
      
      const futureValue = p * Math.pow(1 + r, n) + pmt * ((Math.pow(1 + r, n) - 1) / r);
      const totalContributed = p + pmt * n;
      const totalInterest = futureValue - totalContributed;

      return [
        { label: 'Total Future Balance', value: `$${Math.round(futureValue).toLocaleString()}`, highlight: true },
        { label: 'Total Principal Invested', value: `$${Math.round(totalContributed).toLocaleString()}` },
        { label: 'Total Interest Earned', value: `$${Math.round(totalInterest).toLocaleString()}` }
      ];
    },
    compilePrompt: (values) => {
      return `Act as a certified financial planner. Analyze this compound interest scenario: Initial: ${values.principal}, Monthly Contribution: ${values.monthlyContribution}, Annual Return: ${values.rate}%, Duration: ${values.years} years. Detail: 1. Final balance breakdown with purchasing power adjusted for 2.5% inflation. 2. Safe withdrawal rate (4% rule) annual retirement income. 3. Asset allocation recommendations (Index funds, bonds, cash buffer).`;
    },
    howToSteps: [
      { name: 'Enter Initial Capital', text: 'Input what you currently have invested or saved in your portfolio.' },
      { name: 'Set Monthly Contribution', text: 'Specify how much fresh savings you can inject each month.' },
      { name: 'View Future Millions', text: 'Click Search via AI Mode to evaluate inflation-adjusted retirement dates.' }
    ],
    faqs: [
      { question: 'What is the Rule of 72?', answer: 'Divide 72 by your annual interest rate to find roughly how many years it takes for your money to double.' }
    ],
    keyFeatures: ['Interactive Dynamic Math Preview', 'Inflation Adjustments', '4% FIRE Safe Withdrawal Analysis'],
    whyAIMode: 'AI Search analyzes current real inflation rates and stock market historical drawdown cycles.'
  },
  {
    id: 'sip-calculator',
    slug: 'sip-calculator',
    aliases: ['sip', 'mutual-fund-sip', 'sip-return-calculator'],
    number: '14',
    category: 'Finance',
    title: 'SIP & Mutual Fund Growth Planner',
    shortDescription: 'Calculates expected maturity returns for systematic monthly mutual fund investments with step-up annual increases.',
    searchVolumeBadge: 'Everyday Investor Top 3',
    accentColor: 'from-blue-600 to-indigo-500',
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-950/40',
    iconName: 'Coins',
    seoTitle: 'Free SIP Calculator Online - Systematic Investment Plan Maturity Returns',
    seoDescription: 'Calculate maturity value of your monthly SIP in equity mutual funds. Compare step-up SIP vs regular SIP with accurate inflation modeling.',
    seoKeywords: ['sip calculator', 'mutual fund sip calculator', 'step up sip calculator', 'equity returns online'],
    longTailKeywords: ['how much will 5000 sip give in 10 years at 12 percent', 'best mutual fund sip portfolio split'],
    presets: [
      { label: '₹10,000 / mo @ 12% for 15 Yrs', values: { monthlyInvestment: '10000', returnRate: '12', tenureYears: '15', stepUp: '10' } },
      { label: '₹25,000 / mo @ 14% for 20 Yrs', values: { monthlyInvestment: '25000', returnRate: '14', tenureYears: '20', stepUp: '5' } }
    ],
    fields: [
      { name: 'monthlyInvestment', label: 'Monthly SIP Installment (₹ / $)', type: 'text', defaultValue: '10000', required: true },
      { name: 'returnRate', label: 'Expected Annual Return (%)', type: 'text', defaultValue: '12', required: true },
      { name: 'tenureYears', label: 'Investment Horizon (Years)', type: 'text', defaultValue: '15', required: true },
      { name: 'stepUp', label: 'Annual Step-Up (% increase per year)', type: 'text', defaultValue: '10' }
    ],
    calculatePreview: (values) => {
      const pmt = parseFloat(String(values.monthlyInvestment || '0')) || 0;
      const i = (parseFloat(String(values.returnRate || '12')) || 12) / 100 / 12;
      const n = (parseInt(String(values.tenureYears || '15'), 10) || 15) * 12;
      const fv = pmt * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      const invested = pmt * n;
      return [
        { label: 'Estimated Maturity Value', value: `₹${Math.round(fv).toLocaleString()}`, highlight: true },
        { label: 'Total Amount Invested', value: `₹${Math.round(invested).toLocaleString()}` },
        { label: 'Wealth Gain', value: `₹${Math.round(fv - invested).toLocaleString()}` }
      ];
    },
    compilePrompt: (values) => `Act as an expert wealth manager. Provide a comprehensive SIP return breakdown for ₹${values.monthlyInvestment}/month at ${values.returnRate}% over ${values.tenureYears} years with ${values.stepUp}% step-up. Give portfolio distribution advice across Large Cap, Flexi Cap, and Mid Cap mutual funds.`,
    howToSteps: [
      { name: 'Set Monthly SIP', text: 'Enter the recurring sum you deposit into mutual funds each month.' },
      { name: 'Set Growth Expectation', text: 'Select realistic long-term market rates between 11% and 14%.' },
      { name: 'Simulate Wealth in AI', text: 'Click Search via AI Mode to review tax harvesting strategies.' }
    ],
    faqs: [
      { question: 'What is a Step-Up SIP?', answer: 'A step-up SIP increases your monthly contribution annually as your salary increases, boosting your maturity pool by 40-60%.' }
    ],
    keyFeatures: ['Step-Up Annual Compounding', 'Wealth Gain vs Capital Invested', 'Tax Optimization Guidance'],
    whyAIMode: 'AI Search Mode factors in capital gains tax (LTCG / STCG) rates and optimal asset allocation.'
  },
  {
    id: 'currency-ppp',
    slug: 'currency-ppp-converter',
    aliases: ['ppp-calculator', 'purchasing-power-parity', 'remote-salary-converter'],
    number: '15',
    category: 'Finance',
    title: 'Currency & Purchasing Power Parity (PPP) Converter',
    shortDescription: 'Converts salaries and living costs between countries based on real economic purchasing power parity rather than nominal forex.',
    searchVolumeBadge: 'Digital Nomad Trend',
    accentColor: 'from-amber-500 to-yellow-400',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
    iconName: 'Globe',
    seoTitle: 'Free PPP Salary Converter Online - Purchasing Power Parity Calculator',
    seoDescription: 'Convert salary and cost of living between US, India, UK, Germany, and 150+ countries using real purchasing power parity (PPP) indices.',
    seoKeywords: ['ppp salary converter', 'purchasing power parity calculator', 'cost of living comparison', 'remote work salary parity'],
    longTailKeywords: ['what is 100k usd salary equivalent to in india ppp', 'software engineer salary purchasing power parity us vs europe'],
    presets: [
      { label: '$120,000 USD to INR (India)', values: { baseAmount: '120000', sourceCountry: 'United States (USD)', targetCountry: 'India (INR)' } },
      { label: '£75,000 GBP to EUR (Germany)', values: { baseAmount: '75000', sourceCountry: 'United Kingdom (GBP)', targetCountry: 'Germany (EUR)' } }
    ],
    fields: [
      { name: 'baseAmount', label: 'Base Annual Income / Cost', type: 'text', defaultValue: '100000', required: true },
      { name: 'sourceCountry', label: 'Source Country / Currency', type: 'text', defaultValue: 'United States (USD)', required: true },
      { name: 'targetCountry', label: 'Target Country / Currency', type: 'text', defaultValue: 'India (INR)', required: true }
    ],
    compilePrompt: (values) => `Calculate the exact Purchasing Power Parity (PPP) equivalent for ${values.baseAmount} from ${values.sourceCountry} to ${values.targetCountry}. Compare housing, groceries, healthcare, and taxation to show what standard of living this buys in the target location.`,
    howToSteps: [
      { name: 'Input Salary', text: 'Enter your current or offered base annual salary.' },
      { name: 'Select Countries', text: 'Choose your home country and destination comparison country.' },
      { name: 'Analyze PPP Equivalence', text: 'Click Search via AI Mode for deep cost-of-living basket breakdowns.' }
    ],
    faqs: [
      { question: 'Why does PPP differ from foreign exchange rate?', answer: 'Nominal FX rates only reflect currency trading; PPP compares the actual basket of everyday goods, housing, and food you can buy.' }
    ],
    keyFeatures: ['World Bank PPP Index Analysis', 'Rent & Living Cost Multipliers', 'Real Standard-of-Living Metrics'],
    whyAIMode: 'AI Search brings up the latest World Bank Big Mac Index and Numbeo city-by-city rental datasets.'
  },
  {
    id: 'salary-tax',
    slug: 'salary-tax-calculator',
    aliases: ['salary-calculator', 'take-home-pay', 'paycheck-calculator', 'income-tax-calculator'],
    number: '16',
    category: 'Finance',
    title: 'Salary Take-Home & Income Tax Breakdown',
    shortDescription: 'Calculates net take-home paycheck, effective tax brackets, deductions, and statutory pension contributions.',
    searchVolumeBadge: 'Global Career Search',
    accentColor: 'from-teal-500 to-cyan-400',
    badgeColor: 'text-teal-400 border-teal-500/30 bg-teal-950/40',
    iconName: 'DollarSign',
    seoTitle: 'Free Salary Take-Home Paycheck Calculator - Net Pay & Tax Brackets',
    seoDescription: 'Calculate net take-home salary after income tax, social security, 401k/PF deductions, and health insurance. Accurate tax bracket simulation.',
    seoKeywords: ['salary calculator', 'take home pay calculator', 'income tax breakdown', 'paycheck tax calculator'],
    longTailKeywords: ['how much is 150k after taxes in california', 'take home salary for 25 lpa in india new tax regime'],
    presets: [
      { label: '$120,000 / yr (USA - Single)', values: { grossSalary: '120000', country: 'United States', filingStatus: 'Single', retirementContribution: '6' } },
      { label: '₹24,00,000 / yr (India - New Regime)', values: { grossSalary: '2400000', country: 'India', filingStatus: 'New Tax Regime', retirementContribution: '12' } }
    ],
    fields: [
      { name: 'grossSalary', label: 'Gross Annual Salary (CTC)', type: 'text', defaultValue: '100000', required: true },
      { name: 'country', label: 'Country & State / Jurisdiction', type: 'text', defaultValue: 'United States (Federal + State)', required: true },
      { name: 'filingStatus', label: 'Tax Regime / Filing Status', type: 'select', defaultValue: 'Single', options: [
        { label: 'Single / Individual', value: 'Single' },
        { label: 'Married Filing Jointly', value: 'Married Joint' },
        { label: 'India: New Tax Regime (Default)', value: 'India New' },
        { label: 'India: Old Tax Regime (With Deductions)', value: 'India Old' }
      ]},
      { name: 'retirementContribution', label: 'Retirement / 401k / EPF Contribution (%)', type: 'text', defaultValue: '5' }
    ],
    compilePrompt: (values) => `Act as a certified tax accountant. Provide a detailed paycheck breakdown for a gross salary of ${values.grossSalary} in ${values.country} under ${values.filingStatus} status with ${values.retirementContribution}% retirement savings. Show: 1. Monthly Gross vs Net Take-Home. 2. Income tax brackets and effective tax rate. 3. Legal strategies to optimize tax savings.`,
    howToSteps: [
      { name: 'Enter Gross CTC', text: 'Input your total annual pre-tax compensation package.' },
      { name: 'Choose Jurisdiction', text: 'Specify federal, state, or national tax rules.' },
      { name: 'Review Paycheck in AI', text: 'Click Search via AI Mode to view monthly net take-home pay.' }
    ],
    faqs: [
      { question: 'What is effective tax rate vs marginal tax rate?', answer: 'Your marginal rate is the tax paid on your last dollar earned; your effective rate is total taxes divided by total income.' }
    ],
    keyFeatures: ['Monthly & Bi-weekly Pay Breakdown', 'Tax Bracket Progression', 'Pre-tax Deduction Optimizers'],
    whyAIMode: 'AI Search Mode fetches real-time updated tax brackets for the current fiscal tax year.'
  },
  {
    id: 'crypto-dca',
    slug: 'crypto-dca-calculator',
    aliases: ['crypto-dca', 'bitcoin-dca', 'crypto-profit-calculator'],
    number: '17',
    category: 'Finance',
    title: 'Crypto DCA & Profit Planner',
    shortDescription: 'Models dollar-cost-averaging accumulation strategies, break-even price points, and profit-taking targets for digital assets.',
    searchVolumeBadge: 'Crypto Trader Utility',
    accentColor: 'from-amber-400 to-orange-500',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
    iconName: 'TrendingUp',
    seoTitle: 'Free Crypto DCA Calculator Online - Bitcoin & Altcoin Profit Targets',
    seoDescription: 'Simulate Dollar Cost Averaging (DCA) into Bitcoin and Ethereum. Calculate average entry price, total tokens accumulated, and profit targets.',
    seoKeywords: ['crypto dca calculator', 'bitcoin dca planner', 'crypto profit calculator', 'crypto accumulation strategy'],
    longTailKeywords: ['how much profit if i bought 50 dollars bitcoin every week for 3 years', 'crypto dca vs lump sum return'],
    presets: [
      { label: '$100 / week into Bitcoin for 2 Yrs', values: { asset: 'Bitcoin (BTC)', frequency: 'Weekly', amount: '100', horizon: '2 Years' } }
    ],
    fields: [
      { name: 'asset', label: 'Cryptocurrency Ticker', type: 'text', defaultValue: 'Bitcoin (BTC)', required: true },
      { name: 'amount', label: 'Recurring Purchase Amount ($)', type: 'text', defaultValue: '100', required: true },
      { name: 'frequency', label: 'DCA Frequency', type: 'select', defaultValue: 'Weekly', options: [
        { label: 'Daily', value: 'Daily' },
        { label: 'Weekly', value: 'Weekly' },
        { label: 'Bi-Weekly', value: 'Bi-Weekly' },
        { label: 'Monthly', value: 'Monthly' }
      ]},
      { name: 'horizon', label: 'Investment Timeframe', type: 'text', defaultValue: '2 Years' }
    ],
    compilePrompt: (values) => `Analyze a Dollar Cost Averaging (DCA) strategy for ${values.asset} allocating $${values.amount} ${values.frequency} over ${values.horizon}. Detail historical backtest performance, risk mitigation compared to lump-sum timing, and tiered profit-taking rules during bull market tops.`,
    howToSteps: [
      { name: 'Pick Token', text: 'Enter Bitcoin, Ethereum, Solana, or any crypto asset.' },
      { name: 'Set Allocation', text: 'Specify recurring dollar amount and schedule.' },
      { name: 'Inspect DCA Results', text: 'Click Search via AI Mode for historical accumulation simulations.' }
    ],
    faqs: [
      { question: 'Why does DCA beat market timing in crypto?', answer: 'Crypto volatility makes tops and bottoms unpredictable; DCA smooths out emotional panic and lowers average entry prices.' }
    ],
    keyFeatures: ['Volatility Smoothing Simulation', 'Multi-Year Cycle Modeling', 'Exit Profit Targets'],
    whyAIMode: 'AI Search Mode incorporates historical Bitcoin 4-year halving cycle dynamics.'
  },
  {
    id: 'tip-split',
    slug: 'tip-split-calculator',
    aliases: ['tip-calculator', 'bill-splitter', 'split-bill-online'],
    number: '18',
    category: 'Finance',
    title: 'Tip, Bill Split & Group Expense Calculator',
    shortDescription: 'Splits restaurant bills, calculates custom tip percentages, and divides shared expenses evenly or unevenly among group members.',
    searchVolumeBadge: 'Everyday Consumer Tool',
    accentColor: 'from-pink-500 to-rose-400',
    badgeColor: 'text-pink-400 border-pink-500/30 bg-pink-950/40',
    iconName: 'Percent',
    seoTitle: 'Free Tip Calculator & Bill Splitter Online - Fair Per-Person Shares',
    seoDescription: 'Quickly calculate dining tips and split restaurant checks evenly or unevenly. Fast mobile-friendly bill splitter with tax inclusion.',
    seoKeywords: ['tip calculator', 'bill splitter online', 'split check calculator', 'restaurant tip calculator'],
    longTailKeywords: ['how much to tip on 150 dollar restaurant bill for 4 people', 'tip calculation before or after sales tax'],
    presets: [
      { label: '$140 Bill, 18% Tip, 4 People', values: { totalBill: '140', tipPercentage: '18', numberOfPeople: '4' } },
      { label: '$85 Bill, 20% Tip, 2 People', values: { totalBill: '85', tipPercentage: '20', numberOfPeople: '2' } }
    ],
    fields: [
      { name: 'totalBill', label: 'Total Pre-Tip Bill Amount ($ / ₹ / €)', type: 'text', defaultValue: '120', required: true },
      { name: 'tipPercentage', label: 'Tip Percentage (%)', type: 'text', defaultValue: '18', required: true },
      { name: 'numberOfPeople', label: 'Number of People Splitting', type: 'text', defaultValue: '4', required: true }
    ],
    calculatePreview: (values) => {
      const b = parseFloat(String(values.totalBill || '0')) || 0;
      const t = parseFloat(String(values.tipPercentage || '18')) || 0;
      const p = parseInt(String(values.numberOfPeople || '1'), 10) || 1;
      const tipAmount = b * (t / 100);
      const totalWithTip = b + tipAmount;
      const perPerson = totalWithTip / (p > 0 ? p : 1);
      return [
        { label: 'Amount Per Person', value: `$${perPerson.toFixed(2)}`, highlight: true },
        { label: 'Total Tip Added', value: `$${tipAmount.toFixed(2)}` },
        { label: 'Final Total Check', value: `$${totalWithTip.toFixed(2)}` }
      ];
    },
    compilePrompt: (values) => `Calculate the fair bill split for a total of $${values.totalBill} with an ${values.tipPercentage}% tip divided among ${values.numberOfPeople} guests. Provide international etiquette guidelines on tipping in the US, Europe, and Asia.`,
    howToSteps: [
      { name: 'Enter Total Bill', text: 'Type the total check from your receipt.' },
      { name: 'Select Tip & Headcount', text: 'Adjust tip percentage and number of friends.' },
      { name: 'Instant Share Math', text: 'Share the exact amount per person with one click.' }
    ],
    faqs: [
      { question: 'Should tips be calculated on the subtotal or post-tax total?', answer: 'Standard etiquette recommends tipping on the pre-tax food and beverage subtotal.' }
    ],
    keyFeatures: ['Instant Live Per-Person Preview', 'Global Tipping Etiquette Advice', 'Tax-Excluded Option'],
    whyAIMode: 'AI Search brings up localized tipping customs across 50+ countries.'
  },
  {
    id: 'freelance-rate',
    slug: 'freelance-rate-calculator',
    aliases: ['freelance-rate', 'hourly-rate-calculator', 'consulting-rate-calculator'],
    number: '19',
    category: 'Finance',
    title: 'Freelance Hourly Rate & Project Pricing Calculator',
    shortDescription: 'Calculates the exact billable hourly and project rates required to hit your desired net income after business overhead and taxes.',
    searchVolumeBadge: 'Solopreneur Essential',
    accentColor: 'from-indigo-500 to-purple-400',
    badgeColor: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/40',
    iconName: 'Calculator',
    seoTitle: 'Free Freelance Hourly Rate Calculator - Consulting & Project Pricing',
    seoDescription: 'Calculate what hourly consulting rate to charge based on annual income goals, billable hours, non-billable overhead, and taxes.',
    seoKeywords: ['freelance hourly rate calculator', 'consultant pricing calculator', 'how to calculate freelance rate', 'day rate calculator'],
    longTailKeywords: ['how to calculate hourly rate to make 100k freelancing', 'formula for converting full time salary to freelance contract rate'],
    presets: [
      { label: '$100k Net Target (25 billable hrs/wk)', values: { desiredIncome: '100000', annualExpenses: '12000', billableHoursPerWeek: '25', taxRate: '25' } }
    ],
    fields: [
      { name: 'desiredIncome', label: 'Desired Net Annual Take-Home ($)', type: 'text', defaultValue: '90000', required: true },
      { name: 'annualExpenses', label: 'Annual Business Overhead (Software, Health, Gear)', type: 'text', defaultValue: '12000' },
      { name: 'billableHoursPerWeek', label: 'Realistic Billable Hours per Week (typically 20-30)', type: 'text', defaultValue: '25', required: true },
      { name: 'taxRate', label: 'Estimated Self-Employment Tax (%)', type: 'text', defaultValue: '25' }
    ],
    calculatePreview: (values) => {
      const inc = parseFloat(String(values.desiredIncome || '90000')) || 90000;
      const exp = parseFloat(String(values.annualExpenses || '12000')) || 0;
      const tax = (parseFloat(String(values.taxRate || '25')) || 25) / 100;
      const hoursPerWeek = parseFloat(String(values.billableHoursPerWeek || '25')) || 25;
      const totalPreTaxRequired = (inc / (1 - tax)) + exp;
      const annualBillableHours = hoursPerWeek * 48; // 4 weeks vacation
      const hourly = totalPreTaxRequired / (annualBillableHours || 1);
      return [
        { label: 'Minimum Billable Hourly Rate', value: `$${Math.round(hourly)}/hr`, highlight: true },
        { label: 'Daily Contract Rate (8 hrs)', value: `$${Math.round(hourly * 8)}/day` },
        { label: 'Target Gross Revenue Needed', value: `$${Math.round(totalPreTaxRequired).toLocaleString()}` }
      ];
    },
    compilePrompt: (values) => `Act as an executive business coach for solo consultants. Calculate the required hourly rate for target take-home income of $${values.desiredIncome} with overhead of $${values.annualExpenses} and ${values.billableHoursPerWeek} billable hours/week. Provide value-based pricing and retainer models to transition away from trading time for money.`,
    howToSteps: [
      { name: 'Set Personal Income Goal', text: 'Enter what you need to live comfortably after taxes.' },
      { name: 'Estimate Overhead & Billable Time', text: 'Factor in marketing, administrative time, and software licenses.' },
      { name: 'Discover Ideal Day Rate', text: 'Click Search via AI Mode for industry pricing benchmarks.' }
    ],
    faqs: [
      { question: 'Why shouldn’t freelancers calculate rates based on 40 billable hours?', answer: 'Freelancers spend 30-40% of their time on unbillable tasks: sales pitches, admin, invoicing, and professional development.' }
    ],
    keyFeatures: ['Vacation & Sick Days Built-in', 'Self-Employment Tax Shielding', 'Retainer vs Hourly Conversion'],
    whyAIMode: 'AI Search benchmarks real market rates for software engineers, designers, and copywriters.'
  },
  {
    id: 'rental-yield',
    slug: 'rental-yield-calculator',
    aliases: ['rental-yield', 'cap-rate-calculator', 'real-estate-roi'],
    number: '20',
    category: 'Finance',
    title: 'Real Estate Rental Yield & Cap Rate Calculator',
    shortDescription: 'Evaluates gross and net rental yields, capitalization (Cap) rates, and cash-on-cash returns for investment properties.',
    searchVolumeBadge: 'Real Estate Investor #1',
    accentColor: 'from-cyan-500 to-blue-500',
    badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40',
    iconName: 'BarChart3',
    seoTitle: 'Free Rental Yield & Cap Rate Calculator - Real Estate Property ROI',
    seoDescription: 'Calculate gross rental yield, net yield, and capitalization rate for residential and commercial investment properties. Free real estate investor tool.',
    seoKeywords: ['rental yield calculator', 'cap rate calculator', 'real estate roi calculator', 'cash on cash return'],
    longTailKeywords: ['how to calculate gross rental yield vs net rental yield formula', 'what is a good cap rate for rental property in 2026'],
    presets: [
      { label: '$350,000 Property, $2,400/mo Rent', values: { purchasePrice: '350000', monthlyRent: '2400', annualExpenses: '6500' } }
    ],
    fields: [
      { name: 'purchasePrice', label: 'Property Purchase Price ($ / ₹)', type: 'text', defaultValue: '300000', required: true },
      { name: 'monthlyRent', label: 'Expected Monthly Rental Income', type: 'text', defaultValue: '2200', required: true },
      { name: 'annualExpenses', label: 'Annual Operating Costs (Taxes, Insurance, HOA, Repairs)', type: 'text', defaultValue: '5000' }
    ],
    calculatePreview: (values) => {
      const price = parseFloat(String(values.purchasePrice || '0')) || 1;
      const rent = parseFloat(String(values.monthlyRent || '0')) || 0;
      const exp = parseFloat(String(values.annualExpenses || '0')) || 0;
      const annualGross = rent * 12;
      const noi = annualGross - exp;
      const grossYield = (annualGross / price) * 100;
      const netYield = (noi / price) * 100;
      return [
        { label: 'Net Rental Yield (Cap Rate)', value: `${netYield.toFixed(2)}%`, highlight: true },
        { label: 'Gross Rental Yield', value: `${grossYield.toFixed(2)}%` },
        { label: 'Annual Net Operating Income (NOI)', value: `$${Math.round(noi).toLocaleString()}` }
      ];
    },
    compilePrompt: (values) => `Act as a real estate investment analyst. Analyze this rental property deal: Purchase Price: $${values.purchasePrice}, Monthly Rent: $${values.monthlyRent}, Annual Expenses: $${values.annualExpenses}. Calculate Cap Rate, cash flow after mortgage assumptions, and evaluate risks (vacancy allowance, maintenance reserves).`,
    howToSteps: [
      { name: 'Enter Property Price', text: 'Input purchase price plus expected closing renovation costs.' },
      { name: 'Input Rent & Costs', text: 'Add projected monthly tenant rental and annual maintenance.' },
      { name: 'Evaluate ROI with AI', text: 'Click Search via AI Mode to review historical market yield benchmarks.' }
    ],
    faqs: [
      { question: 'What is a good Cap Rate for a rental property?', answer: 'A Cap Rate between 5% and 8% is generally considered healthy in stable residential metropolitan markets.' }
    ],
    keyFeatures: ['Net vs Gross Yield Comparison', 'Net Operating Income (NOI) Metric', 'Vacancy Buffer Modeling'],
    whyAIMode: 'AI Search brings up current regional cap rates and landlord tenant laws.'
  },
  {
    id: 'fuel-cost',
    slug: 'fuel-cost-calculator',
    aliases: ['fuel-cost', 'gas-trip-calculator', 'road-trip-mileage'],
    number: '21',
    category: 'Finance',
    title: 'Road Trip Fuel Cost & Mileage Planner',
    shortDescription: 'Calculates the exact petrol/diesel/gasoline expenditure for any driving distance and vehicle fuel efficiency rating.',
    searchVolumeBadge: 'Travel Savings',
    accentColor: 'from-orange-500 to-amber-400',
    badgeColor: 'text-orange-400 border-orange-500/30 bg-orange-950/40',
    iconName: 'Truck',
    seoTitle: 'Free Road Trip Fuel Cost Calculator Online - Gas & Mileage Estimator',
    seoDescription: 'Calculate driving fuel costs for road trips and daily commutes. Compute total gas expenses, liters/gallons required, and per-passenger travel cost.',
    seoKeywords: ['fuel cost calculator', 'gas trip calculator', 'mileage cost calculator', 'road trip gas budget'],
    longTailKeywords: ['how to calculate gas cost for 500 mile road trip', 'fuel expense split for carpool passengers'],
    presets: [
      { label: '600 Mile Trip @ 30 MPG ($3.50/gal)', values: { distance: '600', fuelEfficiency: '30', fuelPrice: '3.50', passengers: '3' } }
    ],
    fields: [
      { name: 'distance', label: 'Trip Distance (Miles or Km)', type: 'text', defaultValue: '500', required: true },
      { name: 'fuelEfficiency', label: 'Vehicle Efficiency (MPG or Km/L)', type: 'text', defaultValue: '30', required: true },
      { name: 'fuelPrice', label: 'Fuel Price per Gallon / Liter ($ / ₹)', type: 'text', defaultValue: '3.60', required: true },
      { name: 'passengers', label: 'Number of Passengers (for splitting)', type: 'text', defaultValue: '2' }
    ],
    calculatePreview: (values) => {
      const dist = parseFloat(String(values.distance || '0')) || 0;
      const mpg = parseFloat(String(values.fuelEfficiency || '30')) || 30;
      const price = parseFloat(String(values.fuelPrice || '3.5')) || 0;
      const pass = parseInt(String(values.passengers || '1'), 10) || 1;
      const fuelNeeded = dist / mpg;
      const totalCost = fuelNeeded * price;
      const perPerson = totalCost / (pass > 0 ? pass : 1);
      return [
        { label: 'Total Trip Fuel Cost', value: `$${totalCost.toFixed(2)}`, highlight: true },
        { label: 'Cost Per Passenger', value: `$${perPerson.toFixed(2)}` },
        { label: 'Total Fuel Consumed', value: `${fuelNeeded.toFixed(1)} units` }
      ];
    },
    compilePrompt: (values) => `Calculate fuel expenses for a ${values.distance} trip with ${values.fuelEfficiency} fuel economy at ${values.fuelPrice} per unit for ${values.passengers} passengers. Provide driving tips to maximize fuel economy and save up to 20% on gas.`,
    howToSteps: [
      { name: 'Enter Total Distance', text: 'Enter one-way or round-trip mileage from your GPS.' },
      { name: 'Input Vehicle MPG', text: 'Check your dashboard highway fuel economy rating.' },
      { name: 'Split Gas Costs', text: 'Click Search via AI Mode for toll fee estimations along popular routes.' }
    ],
    faqs: [
      { question: 'Does speeding significantly increase fuel consumption?', answer: 'Yes! Driving at 75 mph consumes roughly 15-20% more fuel than driving at 60 mph due to aerodynamic drag.' }
    ],
    keyFeatures: ['Passenger Cost Splitter', 'Gallon & Liter Support', 'Fuel Saving Efficiency Tips'],
    whyAIMode: 'AI Search references live highway gas station prices and route toll estimates.'
  },
  {
    id: 'net-worth',
    slug: 'net-worth-debt-calculator',
    aliases: ['net-worth-calculator', 'debt-snowball', 'debt-payoff-planner'],
    number: '22',
    category: 'Finance',
    title: 'Net Worth & Debt Snowball Payoff Planner',
    shortDescription: 'Calculates total personal net worth (Assets minus Liabilities) and maps accelerated debt snowball/avalanche payoff dates.',
    searchVolumeBadge: 'Financial Freedom Plan',
    accentColor: 'from-emerald-400 to-teal-500',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
    iconName: 'Scale',
    seoTitle: 'Free Net Worth & Debt Snowball Calculator - Balance Sheet & Payoff',
    seoDescription: 'Calculate personal net worth and create a debt snowball/avalanche acceleration plan to become debt-free. Free online financial planner.',
    seoKeywords: ['net worth calculator', 'debt snowball calculator', 'debt avalanche payoff', 'personal balance sheet'],
    longTailKeywords: ['how to calculate personal net worth assets minus liabilities', 'debt snowball vs debt avalanche which is faster'],
    presets: [
      { label: '$250k Assets, $80k Debt ($1,000/mo payoff)', values: { totalAssets: '250000', totalDebts: '80000', monthlyDebtPayoff: '1000' } }
    ],
    fields: [
      { name: 'totalAssets', label: 'Total Assets (Savings, Investments, Home Equity, Vehicles)', type: 'text', defaultValue: '200000', required: true },
      { name: 'totalDebts', label: 'Total Liabilities (Mortgage, Loans, Credit Cards)', type: 'text', defaultValue: '75000', required: true },
      { name: 'monthlyDebtPayoff', label: 'Dedicated Monthly Debt Payoff Budget', type: 'text', defaultValue: '1200' }
    ],
    calculatePreview: (values) => {
      const a = parseFloat(String(values.totalAssets || '0')) || 0;
      const d = parseFloat(String(values.totalDebts || '0')) || 0;
      const net = a - d;
      return [
        { label: 'Current Net Worth', value: `$${net.toLocaleString()}`, highlight: true },
        { label: 'Total Assets', value: `$${a.toLocaleString()}` },
        { label: 'Total Debts', value: `$${d.toLocaleString()}` }
      ];
    },
    compilePrompt: (values) => `Act as an executive debt elimination coach. Analyze this balance sheet: Total Assets: $${values.totalAssets}, Total Debts: $${values.totalDebts}, Monthly Payoff Budget: $${values.monthlyDebtPayoff}. Contrast Debt Snowball (lowest balance first) vs Debt Avalanche (highest interest first) to outline an accelerated roadmap to a positive net worth.`,
    howToSteps: [
      { name: 'Tally Assets', text: 'Sum your retirement accounts, emergency savings, and property value.' },
      { name: 'Tally Liabilities', text: 'Add student loans, credit cards, auto loans, and mortgages.' },
      { name: 'Map Payoff in AI', text: 'Click Search via AI Mode for psychological debt freedom milestones.' }
    ],
    faqs: [
      { question: 'What is the difference between Debt Snowball and Debt Avalanche?', answer: 'Snowball pays off smallest debts first for psychological wins; Avalanche targets highest interest rates first to minimize mathematical interest.' }
    ],
    keyFeatures: ['Assets vs Liabilities Snapshot', 'Snowball vs Avalanche Comparison', 'Debt Freedom Target Timeline'],
    whyAIMode: 'AI Search Mode compiles customized debt amortization tables and emotional psychology frameworks.'
  }
];
