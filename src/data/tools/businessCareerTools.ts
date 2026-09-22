import { ToolDefinition } from '../../types';

export const BUSINESS_CAREER_TOOLS: ToolDefinition[] = [
  {
    id: 'break-even',
    slug: 'business-break-even-analysis-calculator',
    aliases: ['break-even-calculator', 'margin-of-safety', 'contribution-margin', 'breakeven-point'],
    number: '83',
    category: 'Business',
    title: 'Break-Even Analysis & Margin of Safety Calculator',
    shortDescription: 'Calculate the exact unit sales and gross revenue required to cover fixed overhead costs, plus contribution margin and safety buffer.',
    searchVolumeBadge: 'Small Business & Startup #1',
    accentColor: 'from-emerald-500 to-teal-500',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
    iconName: 'TrendingUp',
    seoTitle: 'Free Break-Even Analysis Calculator Online - Unit Sales & Revenue',
    seoDescription: 'Calculate the break-even point in units and revenue dollars. Determine contribution margin ratio, fixed overhead coverage, and margin of safety.',
    seoKeywords: [
      'break even calculator',
      'break even analysis',
      'contribution margin calculator',
      'margin of safety formula',
      'how to calculate break even point',
      'fixed cost variable cost calculator'
    ],
    longTailKeywords: [
      'how to calculate break even point in units and sales dollars',
      'contribution margin per unit formula price minus variable cost',
      'margin of safety percentage calculation for small businesses',
      'break even analysis for coffee shop or subscription business'
    ],
    longTailUseCases: [
      {
        query: 'Fixed monthly overhead is $8,000, selling price is $50/unit, variable cost is $20/unit',
        title: 'Retail Product Break-Even Feasibility',
        summary: 'Contribution margin is $30/unit (60%). Break-even is 267 units ($13,350 revenue) per month to cover all fixed expenses.',
        presetValues: {
          fixedCosts: '8000',
          pricePerUnit: '50',
          variableCostPerUnit: '20',
          projectedSales: '400'
        }
      }
    ],
    presets: [
      { label: 'E-commerce Brand ($8,000 rent/payroll, $50 price, $20 cost)', values: { fixedCosts: '8000', pricePerUnit: '50', variableCostPerUnit: '20', projectedSales: '400' } },
      { label: 'SaaS Startup ($25,000 servers/staff, $100/mo, $10 COGS)', values: { fixedCosts: '25000', pricePerUnit: '100', variableCostPerUnit: '10', projectedSales: '500' } }
    ],
    inputs: [
      { id: 'fixedCosts', label: 'Monthly Fixed Costs ($ Rent, Salaries, Software)', type: 'number', defaultValue: '8000' },
      { id: 'pricePerUnit', label: 'Selling Price Per Unit ($)', type: 'number', defaultValue: '50' },
      { id: 'variableCostPerUnit', label: 'Variable Cost Per Unit ($ Materials, Shipping)', type: 'number', defaultValue: '20' },
      { id: 'projectedSales', label: 'Estimated Monthly Unit Sales', type: 'number', defaultValue: '400' }
    ],
    quickCompute: (vals) => {
      const fixed = parseFloat(vals.fixedCosts || '8000');
      const price = parseFloat(vals.pricePerUnit || '50');
      const variable = parseFloat(vals.variableCostPerUnit || '20');
      const projectedUnits = parseFloat(vals.projectedSales || '400');

      const contributionMargin = price - variable;
      if (contributionMargin <= 0) {
        return { error: 'Selling price must exceed variable costs to ever break even.' };
      }

      const cmRatio = (contributionMargin / price) * 100;
      const breakEvenUnits = Math.ceil(fixed / contributionMargin);
      const breakEvenRevenue = breakEvenUnits * price;

      const projectedRevenue = projectedUnits * price;
      const marginOfSafetyUnits = projectedUnits - breakEvenUnits;
      const marginOfSafetyPct = projectedUnits > 0 ? (marginOfSafetyUnits / projectedUnits) * 100 : 0;
      const projectedProfit = projectedUnits * contributionMargin - fixed;

      return {
        mainResult: `${breakEvenUnits.toLocaleString()} Units`,
        mainLabel: 'Break-Even Volume Required',
        secondaryMetrics: [
          { label: 'Break-Even Gross Revenue', value: `$${breakEvenRevenue.toLocaleString()}` },
          { label: 'Contribution Margin / Unit', value: `$${contributionMargin.toFixed(2)} (${cmRatio.toFixed(1)}%)` },
          { label: 'Projected Monthly Net Profit', value: `$${projectedProfit.toLocaleString()}` },
          { label: 'Margin of Safety Buffer', value: `${marginOfSafetyPct.toFixed(1)}% (${marginOfSafetyUnits} units)` }
        ],
        summary: `You must sell ${breakEvenUnits} units ($${breakEvenRevenue.toLocaleString()} revenue) per month to break even. At ${projectedUnits} units, estimated monthly profit is $${projectedProfit.toLocaleString()}.`
      };
    },
    aiTaskType: 'analysis',
    promptTemplate: `Act as a senior Chief Financial Officer (CFO) and management consultant.
Fixed Costs: ${'{fixedCosts}'}
Price Per Unit: ${'{pricePerUnit}'}
Variable Cost Per Unit: ${'{variableCostPerUnit}'}
Projected Sales: {projectedSales} units

Provide:
1. Complete Break-Even Analysis breakdown with Contribution Margin Ratio.
2. Sensitivity Analysis: What happens if variable costs rise by 15% (inflation) or price is discounted by 10%?
3. Strategic levers to reduce the break-even threshold (fixed cost restructuring, vendor renegotiation, premium tiered pricing).
4. Executive summary slide bullet points formatted for investor presentations or bank loan applications.`,
    howToSteps: [
      { step: 1, title: 'Enter Fixed Overhead', description: 'Total your monthly rent, payroll, insurance, and SaaS tools.' },
      { step: 2, title: 'Enter Unit Economics', description: 'Specify the customer price and unit production/shipping costs.' },
      { step: 3, title: 'View Target Volume & Safety', description: 'Review the break-even unit count and margin of safety buffer.' }
    ],
    faqs: [
      { question: 'What is Margin of Safety in business finance?', answer: 'Margin of safety is the cushion between your projected sales and your break-even point. A 30% margin of safety means sales could decline by 30% before the business begins losing money.' }
    ],
    features: [
      'Contribution margin per unit and CM ratio percentage',
      'Margin of safety cushion calculations',
      'Net profit forecasting above break-even volume'
    ]
  },
  {
    id: 'profit-margin',
    slug: 'profit-margin-markup-calculator',
    aliases: ['margin-calculator', 'markup-calculator', 'gross-margin', 'cogs-calculator'],
    number: '84',
    category: 'Finance',
    title: 'Gross Margin, Markup & Cost-of-Goods-Sold (COGS) Calculator',
    shortDescription: 'Calculate the difference between Margin % and Markup %, determine optimal retail pricing, and analyze gross profit dollars.',
    searchVolumeBadge: 'Retail & E-commerce #1',
    accentColor: 'from-green-500 to-emerald-500',
    badgeColor: 'text-green-400 border-green-500/30 bg-green-950/40',
    iconName: 'DollarSign',
    seoTitle: 'Free Profit Margin & Markup Calculator - Gross Margin & Retail Price',
    seoDescription: 'Calculate gross profit margin, markup percentage, cost of goods sold (COGS), and optimal selling price. Understand the key difference between margin and markup.',
    seoKeywords: [
      'profit margin calculator',
      'margin vs markup calculator',
      'gross margin calculator',
      'markup percentage formula',
      'retail pricing calculator',
      'cost of goods sold calculator'
    ],
    longTailKeywords: [
      'difference between margin and markup with formula and examples',
      'how to calculate selling price for 40 percent gross margin',
      'markup formula cost of goods sold to retail price',
      'calculate gross profit dollars from revenue and cost'
    ],
    longTailUseCases: [
      {
        query: 'An item costs $40 to manufacture. What selling price is needed for a 60% gross profit margin?',
        title: 'Direct-to-Consumer (DTC) Retail Pricing',
        summary: 'To achieve a 60% gross margin on a $40 cost, the retail price must be $100.00 (a 150% markup over cost), generating $60.00 gross profit.',
        presetValues: {
          calcMode: 'cost_margin',
          cost: '40',
          margin: '60',
          price: ''
        }
      }
    ],
    presets: [
      { label: '$40 Cost with 60% Margin Goal', values: { calcMode: 'cost_margin', cost: '40', margin: '60', price: '' } },
      { label: 'Buy for $25, Sell for $65', values: { calcMode: 'cost_price', cost: '25', margin: '', price: '65' } }
    ],
    inputs: [
      {
        id: 'calcMode',
        label: 'Calculation Method',
        type: 'select',
        defaultValue: 'cost_margin',
        options: [
          { label: 'Enter Cost & Target Margin % -> Find Price & Markup', value: 'cost_margin' },
          { label: 'Enter Cost & Selling Price -> Find Margin & Markup', value: 'cost_price' }
        ]
      },
      { id: 'cost', label: 'Cost of Goods Sold (COGS) ($)', type: 'number', defaultValue: '40' },
      { id: 'margin', label: 'Desired Gross Margin (%)', type: 'number', defaultValue: '60' },
      { id: 'price', label: 'Selling Price ($)', type: 'number', defaultValue: '100' }
    ],
    quickCompute: (vals) => {
      const cost = parseFloat(vals.cost || '40');
      const mode = vals.calcMode || 'cost_margin';

      if (cost <= 0) return { error: 'Cost of Goods Sold must be greater than zero.' };

      let price = 0;
      let marginPct = 0;
      let markupPct = 0;
      let profit = 0;

      if (mode === 'cost_margin') {
        marginPct = parseFloat(vals.margin || '60');
        if (marginPct >= 100) return { error: 'Margin cannot be 100% or greater.' };
        price = cost / (1 - marginPct / 100);
        profit = price - cost;
        markupPct = (profit / cost) * 100;
      } else {
        price = parseFloat(vals.price || '100');
        if (price <= cost) return { error: 'Selling price should exceed cost for positive profit.' };
        profit = price - cost;
        marginPct = (profit / price) * 100;
        markupPct = (profit / cost) * 100;
      }

      return {
        mainResult: `$${price.toFixed(2)}`,
        mainLabel: 'Recommended Retail Price',
        secondaryMetrics: [
          { label: 'Gross Profit ($)', value: `$${profit.toFixed(2)}` },
          { label: 'Gross Margin (%)', value: `${marginPct.toFixed(1)}%` },
          { label: 'Markup on Cost (%)', value: `${markupPct.toFixed(1)}%` },
          { label: 'Cost-to-Price Ratio', value: `${((cost / price) * 100).toFixed(1)}%` }
        ],
        summary: `At cost $${cost.toFixed(2)} and price $${price.toFixed(2)}, gross profit is $${profit.toFixed(2)}. Gross margin is ${marginPct.toFixed(1)}% (which requires a ${markupPct.toFixed(1)}% markup on cost).`
      };
    },
    aiTaskType: 'analysis',
    promptTemplate: `Act as a senior pricing strategist and retail merchandise planner.
Cost of Goods Sold: ${'{cost}'}
Selling Price: ${'{price}'}
Target Margin: {margin}%

Provide:
1. Complete mathematical breakdown of Margin vs Markup differences.
2. Competitive benchmarking across retail categories (Apparel ~60-70%, Grocery ~2-5%, SaaS ~80%, Consumer Electronics ~20-30%).
3. Psychological pricing recommendations (e.g. $99.95 vs $100.00 charm pricing).
4. Volume discount tier strategy (Wholesale, Distributor, Direct-to-Consumer MSRP).`,
    howToSteps: [
      { step: 1, title: 'Choose Mode', description: 'Calculate price from target margin, or audit existing margin from price.' },
      { step: 2, title: 'Enter COGS & Target', description: 'Input item manufacturing/wholesale cost and desired margin percentage.' },
      { step: 3, title: 'Inspect Pricing & Markup', description: 'See the required retail price, gross profit dollars, and markup ratio.' }
    ],
    faqs: [
      { question: 'Why is Markup always higher than Margin?', answer: 'Margin is calculated as profit divided by Selling Price (a larger denominator), whereas Markup is profit divided by Cost (a smaller denominator). A 50% margin requires a 100% markup over cost.' }
    ],
    features: [
      'Clear differentiation between Gross Margin % and Markup %',
      'Bidirectional pricing solver',
      'Industry category pricing benchmarks'
    ]
  },
  {
    id: 'mortgage-refinance',
    slug: 'mortgage-refinance-savings-break-even-calculator',
    aliases: ['refinance-calculator', 'mortgage-refi', 'refinance-break-even', 'home-loan-refinance'],
    number: '85',
    category: 'Finance',
    title: 'Mortgage Refinance Savings & Break-Even Calculator',
    shortDescription: 'Calculate monthly payment reduction, total lifetime interest saved, and exact break-even months to recoup refinance closing costs.',
    searchVolumeBadge: 'Real Estate & Mortgage #1',
    accentColor: 'from-blue-600 to-cyan-500',
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-950/40',
    iconName: 'Home',
    seoTitle: 'Free Mortgage Refinance Calculator - Savings & Break-Even Month',
    seoDescription: 'Calculate if refinancing your home mortgage is worth it. Compare monthly payment savings, total interest saved, and closing cost break-even timeline.',
    seoKeywords: [
      'mortgage refinance calculator',
      'refinance break even calculator',
      'home loan refinance savings',
      'refinance closing costs payback',
      'mortgage interest savings calculator',
      'should i refinance my mortgage'
    ],
    longTailKeywords: [
      'how to calculate break even month for mortgage refinance closing costs',
      'refinancing from 6.5 percent to 5.25 percent on 400k balance',
      'is it worth refinancing if i plan to move in 4 years',
      'closing costs roll into loan vs paying out of pocket refinance'
    ],
    longTailUseCases: [
      {
        query: '$400,000 balance currently at 6.75%, refinancing to 5.25% with $5,000 closing costs',
        title: 'Rate-and-Term Mortgage Refinance',
        summary: 'Monthly payment drops by $385/mo. Closing costs are fully recouped in 13 months, saving over $92,000 in total interest over 30 years.',
        presetValues: {
          currentBalance: '400000',
          currentRate: '6.75',
          newRate: '5.25',
          newTermYears: '30',
          closingCosts: '5000'
        }
      }
    ],
    presets: [
      { label: 'Refinance $400k (6.75% to 5.25%, $5k fees)', values: { currentBalance: '400000', currentRate: '6.75', newRate: '5.25', newTermYears: '30', closingCosts: '5000' } },
      { label: 'Drop 1.0% on $600k Loan', values: { currentBalance: '600000', currentRate: '7.00', newRate: '6.00', newTermYears: '30', closingCosts: '6500' } }
    ],
    inputs: [
      { id: 'currentBalance', label: 'Remaining Mortgage Balance ($)', type: 'number', defaultValue: '400000' },
      { id: 'currentRate', label: 'Current Interest Rate (%)', type: 'number', defaultValue: '6.75' },
      { id: 'newRate', label: 'New Refinanced Rate (%)', type: 'number', defaultValue: '5.25' },
      { id: 'newTermYears', label: 'New Loan Term (Years)', type: 'select', defaultValue: '30', options: [{ label: '30 Years Fixed', value: '30' }, { label: '20 Years Fixed', value: '20' }, { label: '15 Years Fixed', value: '15' }] },
      { id: 'closingCosts', label: 'Total Refinance Closing Costs & Fees ($)', type: 'number', defaultValue: '5000' }
    ],
    quickCompute: (vals) => {
      const balance = parseFloat(vals.currentBalance || '400000');
      const curRate = parseFloat(vals.currentRate || '6.75') / 100 / 12;
      const newRate = parseFloat(vals.newRate || '5.25') / 100 / 12;
      const n = parseInt(vals.newTermYears || '30', 10) * 12;
      const costs = parseFloat(vals.closingCosts || '5000');

      const pmtCur = (balance * curRate * Math.pow(1 + curRate, n)) / (Math.pow(1 + curRate, n) - 1);
      const pmtNew = (balance * newRate * Math.pow(1 + newRate, n)) / (Math.pow(1 + newRate, n) - 1);

      const monthlySavings = pmtCur - pmtNew;
      if (monthlySavings <= 0) {
        return { error: 'The new rate and term does not reduce your monthly payment.' };
      }

      const breakEvenMonths = Math.ceil(costs / monthlySavings);
      const lifetimeSavings = monthlySavings * n - costs;

      return {
        mainResult: `${breakEvenMonths} Months`,
        mainLabel: 'Break-Even Payback Period',
        secondaryMetrics: [
          { label: 'Monthly Payment Savings', value: `$${monthlySavings.toFixed(2)} / mo` },
          { label: 'New Monthly Principal & Interest', value: `$${pmtNew.toFixed(2)}` },
          { label: 'Total 30-Year Net Savings', value: `$${lifetimeSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Closing Cost Recouped In', value: `${(breakEvenMonths / 12).toFixed(1)} years` }
        ],
        summary: `Refinancing lowers your monthly mortgage payment from $${pmtCur.toFixed(2)} to $${pmtNew.toFixed(2)} (saving $${monthlySavings.toFixed(2)}/mo). You will break even on the $${costs.toLocaleString()} closing costs in ${breakEvenMonths} months.`
      };
    },
    aiTaskType: 'analysis',
    promptTemplate: `Act as a certified mortgage underwriter and financial planner.
Mortgage Balance: ${'{currentBalance}'}
Current Rate: {currentRate}%
New Rate: {newRate}%
New Term: {newTermYears} Years
Closing Costs: ${'{closingCosts}'}

Provide:
1. Complete financial feasibility evaluation: Break-even timeline vs typical homeowner residency duration.
2. Comparison: 30-year fixed vs 15-year accelerated payoff interest savings.
3. No-cost refinance vs paying points upfront analysis.
4. Closing document checklist to request from lenders (Loan Estimate, Closing Disclosure fee audit).`,
    howToSteps: [
      { step: 1, title: 'Enter Current Loan Details', description: 'Type your remaining mortgage balance and current interest rate.' },
      { step: 2, title: 'Input New Offer & Closing Costs', description: 'Enter the new quoted interest rate and estimated closing fees.' },
      { step: 3, title: 'Check Break-Even Timeline', description: 'See the exact month when your accumulated savings exceed the closing fees.' }
    ],
    faqs: [
      { question: 'What is a good break-even timeline for a mortgage refinance?', answer: 'Most financial planners consider a break-even period of 24 months or less to be an excellent financial decision, provided you plan to stay in the home beyond that threshold.' }
    ],
    features: [
      'Exact break-even month countdown to recoup closing costs',
      'Monthly principal and interest savings comparison',
      'Full lifetime interest savings projection'
    ]
  },
  {
    id: 'cold-call-script',
    slug: 'b2b-cold-calling-script-objection-generator',
    aliases: ['cold-call-script', 'sales-script-generator', 'b2b-sales-outreach', 'objection-handler'],
    number: '86',
    category: 'Business',
    title: 'B2B Cold Calling Script & Objection Playbook',
    shortDescription: 'Generate high-converting 60-second phone scripts, pattern interrupts, gatekeeper bypass techniques, and objection handles.',
    searchVolumeBadge: 'B2B Sales & SDRs #1',
    accentColor: 'from-blue-600 to-indigo-600',
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-950/40',
    iconName: 'Zap',
    seoTitle: 'Free B2B Cold Calling Script Generator - Pattern Interrupt & Objections',
    seoDescription: 'Generate high-converting B2B cold call sales scripts, pattern interrupt openers, objection handling rebuttals, and discovery question frameworks.',
    seoKeywords: [
      'cold call script generator',
      'b2b cold calling script',
      'sales objection handling script',
      'pattern interrupt cold call',
      'sdr cold call template',
      'gatekeeper bypass script'
    ],
    longTailKeywords: [
      'how to handle we already have a vendor sales objection on cold call',
      'best 30 second cold call opener for b2b saas decision makers',
      'how to get past the executive assistant gatekeeper politely',
      'chris voss tactical empathy objection handling for sales reps'
    ],
    longTailUseCases: [
      {
        query: 'Selling AI-powered invoice reconciliation software to CFOs and Controllers',
        title: 'CFO Cold Calling Script',
        summary: 'Focuses on pattern-interrupt opener, highlighting that AP teams spend 35% of their month fixing manual 3-way match errors, leading to a low-friction 15-minute demo ask.',
        presetValues: {
          productName: 'LedgerFlow AI',
          targetPersona: 'CFO / VP of Finance',
          painPoint: 'Manual AP invoice reconciliation errors and late payment penalties',
          primaryBenefit: 'Eliminates 90% of manual data entry and prevents duplicate billing'
        }
      }
    ],
    presets: [
      {
        label: 'FinTech / CFO Script',
        values: { productName: 'LedgerFlow AI', targetPersona: 'CFO / VP of Finance', painPoint: 'Manual invoice reconciliation taking 40 hours per month', primaryBenefit: 'Cuts reconciliation time by 85% with zero human data entry' }
      },
      {
        label: 'Cybersecurity / CISO Script',
        values: { productName: 'SentinelGuard', targetPersona: 'Chief Information Security Officer (CISO)', painPoint: 'Third-party vendor API security blind spots', primaryBenefit: 'Continuous automated compliance audit and breach prevention' }
      }
    ],
    inputs: [
      { id: 'productName', label: 'Your Product / Service Name', type: 'text', defaultValue: 'LedgerFlow AI' },
      { id: 'targetPersona', label: 'Target Decision Maker (Title/Role)', type: 'text', defaultValue: 'CFO / VP of Finance' },
      { id: 'painPoint', label: 'Core Problem / Burning Pain Point', type: 'text', defaultValue: 'Manual invoice reconciliation taking 40 hours per month' },
      { id: 'primaryBenefit', label: 'Measurable Outcome / Value Prop', type: 'text', defaultValue: 'Cuts reconciliation time by 85% with automated ERP matching' }
    ],
    quickCompute: (vals) => {
      const opener = `“Hi [First Name], I know I’m interrupting your day—got 30 seconds to tell you why I called, and if it’s not relevant, you can hang up?”`;
      const pitch = `“We help ${vals.targetPersona || 'leaders'} who are frustrated by ${vals.painPoint || 'inefficiencies'}. With ${vals.productName || 'our platform'}, teams achieve ${vals.primaryBenefit || 'results'}.`;
      const ask = `“Are you open to seeing how other teams in your space are handling this next Tuesday at 2 PM?”`;

      return {
        mainResult: 'Pattern-Interrupt Script Ready',
        mainLabel: '60-Second Sales Call Framework',
        secondaryMetrics: [
          { label: 'Target Role', value: vals.targetPersona },
          { label: 'Hook Type', value: 'Permission-Based Opener (PBO)' },
          { label: 'Call-to-Action', value: 'Low-Friction 15-min Discovery' }
        ],
        summary: `Cold call script structured for ${vals.targetPersona}: Opener -> Pain point validation -> ${vals.productName} value prop -> Friction-free calendar ask.`
      };
    },
    aiTaskType: 'creative',
    promptTemplate: `Act as a top 1% enterprise Sales Development Representative (SDR) director.
Product: {productName}
Target Persona: {targetPersona}
Pain Point: {painPoint}
Value Metric: {primaryBenefit}

Generate:
1. Two high-converting 30-to-45 second call scripts:
   a. Permission-Based Pattern Interrupt ("I know you weren't expecting my call...").
   b. Peer-Referencing Trigger Event ("Saw your company just expanded into...").
2. Gatekeeper Bypass Technique: Specific phrasing when speaking to executive assistants.
3. Top 4 Cold Call Objection Rebuttals (word-for-word responses):
   - "We already have a vendor for this."
   - "Just send me an email."
   - "We don't have budget right now."
   - "I'm heading into a meeting."
4. Voicemail Script (under 18 seconds) designed for immediate callbacks.`,
    howToSteps: [
      { step: 1, title: 'Define Target & Pain Point', description: 'Enter the job title of your ideal customer and their primary daily bottleneck.' },
      { step: 2, title: 'Review 60-Second Flow', description: 'Study the permission-based opener and concise value hook.' },
      { step: 3, title: 'Generate Full Playbook', description: 'Get word-for-word rebuttals for "send an email", "no budget", and "have a vendor".' }
    ],
    faqs: [
      { question: 'Why does the permission-based opener work so well?', answer: 'Acknowledging that you are interrupting their day disarms defensive sales resistance immediately, giving the prospect autonomy to grant 30 seconds of attention.' }
    ],
    features: [
      'Permission-based opener (PBO) structure backed by sales research',
      'Word-for-word scripts for the 4 most common phone brush-offs',
      'Short 18-second curiosity-gap voicemail templates'
    ]
  },
  {
    id: 'press-release',
    slug: 'company-press-release-pr-newswire-writer',
    aliases: ['press-release-generator', 'pr-writer', 'newswire-generator', 'media-announcement'],
    number: '87',
    category: 'Marketing',
    title: 'Company Press Release & Newswire Writer',
    shortDescription: 'Format AP Style press releases with compelling headlines, datelines, executive quotes, company boilerplate, and media contact blocks.',
    searchVolumeBadge: 'PR & Media Relations #1',
    accentColor: 'from-indigo-600 to-violet-600',
    badgeColor: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/40',
    iconName: 'FileText',
    seoTitle: 'Free Press Release Generator Online - AP Style Newswire Format',
    seoDescription: 'Generate professional, AP Style press releases ready for PR Newswire or Business Wire. Includes dateline, executive quotes, boilerplate, and media contacts.',
    seoKeywords: [
      'press release generator',
      'ap style press release',
      'pr newswire format',
      'business wire release template',
      'company announcement writer',
      'press release template free'
    ],
    longTailKeywords: [
      'how to write a press release for new product launch ap style',
      'press release executive quote format ceo statement',
      'company boilerplate example for about us section',
      'for immediate release dateline format city state date'
    ],
    longTailUseCases: [
      {
        query: 'SaaS startup raises $5M Seed round to expand AI analytics platform',
        title: 'Funding Announcement Press Release',
        summary: 'Structures an AP Style announcement with lead investor quotes, hiring expansion plans, and corporate boilerplate ready for TechCrunch or PR Newswire distribution.',
        presetValues: {
          companyName: 'DataPulse Analytics',
          announcementType: 'funding',
          newsHeadline: 'DataPulse Closes $5M Seed Round Led by Apex Ventures to Accelerate Enterprise AI Telemetry',
          keyHighlights: 'Over 120 enterprise clients, 300% YoY ARR growth, expanding engineering team by 25 engineers',
          cityState: 'SAN FRANCISCO, CA'
        }
      }
    ],
    presets: [
      {
        label: 'Funding Round ($5M Seed)',
        values: { companyName: 'DataPulse Analytics', announcementType: 'funding', newsHeadline: 'DataPulse Closes $5M Seed Round Led by Apex Ventures', keyHighlights: '300% YoY growth, hiring 25 engineers, expanding AI telemetry platform', cityState: 'SAN FRANCISCO, CA' }
      },
      {
        label: 'New Product Launch',
        values: { companyName: 'OmniCloud', announcementType: 'product', newsHeadline: 'OmniCloud Unveils Zero-Latency Edge Database Engine', keyHighlights: 'Under 5ms global read latency, enterprise SOC2 compliance, available today', cityState: 'AUSTIN, TX' }
      }
    ],
    inputs: [
      { id: 'companyName', label: 'Company Name', type: 'text', defaultValue: 'DataPulse Analytics' },
      { id: 'cityState', label: 'City, State (Dateline)', type: 'text', defaultValue: 'SAN FRANCISCO, CA' },
      {
        id: 'announcementType',
        label: 'Type of News',
        type: 'select',
        defaultValue: 'funding',
        options: [
          { label: 'Funding & Investment Round', value: 'funding' },
          { label: 'New Product / Major Feature Launch', value: 'product' },
          { label: 'Executive Leadership Appointment', value: 'executive' },
          { label: 'Strategic Partnership / Merger', value: 'partnership' }
        ]
      },
      { id: 'newsHeadline', label: 'Core Headline / Title', type: 'text', defaultValue: 'DataPulse Closes $5M Seed Round Led by Apex Ventures' },
      { id: 'keyHighlights', label: 'Key Facts, Statistics & Milestones', type: 'textarea', defaultValue: 'Over 120 enterprise clients, 300% YoY growth, expanding engineering team by 25 engineers' }
    ],
    quickCompute: (vals) => {
      const headline = vals.newsHeadline || 'Company Announces Major Milestone';
      const city = vals.cityState || 'NEW YORK, NY';
      const dateline = `FOR IMMEDIATE RELEASE\n${city} — [Date]`;

      return {
        mainResult: headline,
        mainLabel: 'AP Style Press Release Headline',
        secondaryMetrics: [
          { label: 'Dateline Format', value: `${city} — [Date]` },
          { label: 'Wire Length Standard', value: '~450 - 650 words' },
          { label: 'Media Distribution', value: 'PR Newswire / Business Wire ready' }
        ],
        summary: `Press release structured for ${vals.companyName}: Dateline, inverted pyramid lead paragraph, CEO quote, key bullet highlights, and company boilerplate.`
      };
    },
    aiTaskType: 'creative',
    promptTemplate: `Act as a senior public relations (PR) director and former journalist.
Company: {companyName}
Location: {cityState}
Type: {announcementType}
Headline: {newsHeadline}
Key Metrics: {keyHighlights}

Generate a complete, publication-ready AP Style Press Release containing:
1. FOR IMMEDIATE RELEASE header with Dateline ({cityState} — [Current Date]).
2. Inverted Pyramid Lead Paragraph answering Who, What, When, Where, and Why.
3. Authentic CEO / Founder Quote highlighting market vision and customer impact.
4. Partner / Investor Supporting Quote validating the announcement.
5. Bulleted list of tangible product capabilities or milestones.
6. Professional "About {companyName}" Corporate Boilerplate.
7. Media Contact Information Block (Name, Title, Media Email, Phone, Website).`,
    howToSteps: [
      { step: 1, title: 'Fill In Company & News', description: 'Enter your company name, dateline location, and the core announcement.' },
      { step: 2, title: 'Add Proof Points', description: 'List key metrics, customer growth stats, or funding figures.' },
      { step: 3, title: 'Generate AP Release', description: 'Copy the formatted press release directly into PR Newswire, Business Wire, or email to journalists.' }
    ],
    faqs: [
      { question: 'What is AP Style in a press release?', answer: 'Associated Press (AP) style is the standard format used by newsrooms worldwide, featuring an inverted pyramid structure (most important facts first), standardized datelines, and objective tone.' }
    ],
    features: [
      'Standardized AP Style Inverted Pyramid journalistic architecture',
      'Natural-sounding executive and investor quotes',
      'Complete corporate About Us boilerplate and media contact block'
    ]
  },
  {
    id: 'job-resignation',
    slug: 'professional-job-resignation-letter-generator',
    aliases: ['resignation-letter', 'two-week-notice', 'quit-job-letter', 'formal-resignation'],
    number: '88',
    category: 'Career',
    title: 'Job Resignation Letter & Two-Week Notice Writer',
    shortDescription: 'Draft courteous, professional resignation letters offering two weeks’ notice, gratitude for mentorship, and seamless transition handover plans.',
    searchVolumeBadge: 'Career & Workplace #1',
    accentColor: 'from-slate-700 to-zinc-900',
    badgeColor: 'text-zinc-300 border-zinc-500/30 bg-zinc-900/60',
    iconName: 'Mail',
    seoTitle: 'Free Job Resignation Letter Generator - Professional Two-Week Notice',
    seoDescription: 'Generate a polite, professional job resignation letter and two-week notice. Ensures a positive exit, expresses gratitude, and offers a smooth handover plan.',
    seoKeywords: [
      'resignation letter generator',
      'two week notice letter',
      'job resignation letter template',
      'formal resignation letter',
      'how to write resignation letter',
      'polite resignation letter'
    ],
    longTailKeywords: [
      'how to write professional two week notice letter to manager',
      'resignation letter with gratitude for growth and mentorship',
      'short simple one paragraph resignation letter example',
      'how to state last working day in formal resignation email'
    ],
    longTailUseCases: [
      {
        query: 'Resigning as Senior Product Manager to accept a new role, effective in 2 weeks',
        title: 'Senior Professional Career Transition',
        summary: 'Creates a polished, gracious letter stating final employment date, thanking leadership for mentorship, and detailing a transition plan for active project handoffs.',
        presetValues: {
          employeeName: 'Jordan Taylor',
          jobTitle: 'Senior Product Manager',
          managerName: 'Sarah Jenkins',
          companyName: 'Acme Technologies',
          lastDay: 'October 15, 2026',
          tone: 'warm_grateful'
        }
      }
    ],
    presets: [
      {
        label: 'Warm & Grateful (Standard 2 Weeks)',
        values: { employeeName: 'Jordan Taylor', jobTitle: 'Senior Product Manager', managerName: 'Sarah Jenkins', companyName: 'Acme Technologies', lastDay: 'October 15, 2026', tone: 'warm_grateful' }
      },
      {
        label: 'Short & Direct Formal',
        values: { employeeName: 'Alex Reed', jobTitle: 'Financial Analyst', managerName: 'David Vance', companyName: 'Global Capital', lastDay: 'November 1, 2026', tone: 'formal_direct' }
      }
    ],
    inputs: [
      { id: 'employeeName', label: 'Your Full Name', type: 'text', defaultValue: 'Jordan Taylor' },
      { id: 'jobTitle', label: 'Your Current Job Title', type: 'text', defaultValue: 'Senior Product Manager' },
      { id: 'managerName', label: 'Manager / Supervisor Name', type: 'text', defaultValue: 'Sarah Jenkins' },
      { id: 'companyName', label: 'Company Name', type: 'text', defaultValue: 'Acme Technologies' },
      { id: 'lastDay', label: 'Official Last Working Day', type: 'text', defaultValue: 'October 15, 2026' },
      {
        id: 'tone',
        label: 'Letter Tone',
        type: 'select',
        defaultValue: 'warm_grateful',
        options: [
          { label: 'Warm & Grateful (Positive Mentorship)', value: 'warm_grateful' },
          { label: 'Formal & Direct (Neutral & Professional)', value: 'formal_direct' },
          { label: 'Short & Concise (Simple 2 Paragraphs)', value: 'short_simple' }
        ]
      }
    ],
    quickCompute: (vals) => {
      const subject = `Resignation Notice - ${vals.employeeName || 'Your Name'} (${vals.jobTitle || 'Role'})`;

      return {
        mainResult: subject,
        mainLabel: 'Formal Resignation Subject Line',
        secondaryMetrics: [
          { label: 'Effective Last Day', value: vals.lastDay || '2 Weeks Notice' },
          { label: 'Tone Mode', value: vals.tone?.replace('_', ' ').toUpperCase() },
          { label: 'Primary Focus', value: 'Bridge Preservation & Handover' }
        ],
        summary: `Resignation letter ready for ${vals.managerName} at ${vals.companyName}. Formatted with date of departure (${vals.lastDay}) and transition support.`
      };
    },
    aiTaskType: 'creative',
    promptTemplate: `Act as an executive career coach and HR director.
Employee: {employeeName}
Current Role: {jobTitle}
Manager: {managerName}
Company: {companyName}
Last Working Day: {lastDay}
Tone: {tone}

Generate:
1. Complete formal resignation letter (printable format with date, header, signature).
2. Email version with clear, professional subject line.
3. Suggested 2-week transition checklist (documentation, handover meetings, training colleagues).
4. Advice for the 1-on-1 resignation verbal conversation (what to say and what never to say).`,
    howToSteps: [
      { step: 1, title: 'Fill In Role & Dates', description: 'Enter your title, supervisor name, company, and your official final working day.' },
      { step: 2, title: 'Select Tone', description: 'Choose warm gratitude for close mentors or neutral directness for standard departures.' },
      { step: 3, title: 'Copy Letter & Email', description: 'Copy the letter for printed HR signature or email submission.' }
    ],
    faqs: [
      { question: 'Do I need to state my reason for leaving in a resignation letter?', answer: 'No, you are not legally or professionally required to state your reason or name your new employer. Stating your final date and expressing appreciation is all that is required.' }
    ],
    features: [
      'Clean formal header and signature formatting',
      'Preserves professional relationships and avoids burning bridges',
      'Includes practical 2-week handover transition checklist'
    ]
  },
  {
    id: 'performance-review',
    slug: 'employee-performance-review-self-evaluation-writer',
    aliases: ['performance-review-writer', 'self-evaluation-generator', 'annual-review-helper', 'okr-evaluator'],
    number: '89',
    category: 'Career',
    title: 'Performance Review & Self-Evaluation Writer',
    shortDescription: 'Transform bullet points of your yearly accomplishments into executive-ready performance self-evaluations highlighting impact and growth.',
    searchVolumeBadge: 'Corporate Career & HR #1',
    accentColor: 'from-blue-500 to-indigo-600',
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-950/40',
    iconName: 'Award',
    seoTitle: 'Free Performance Review & Self-Evaluation Writer - Annual Review',
    seoDescription: 'Turn your achievements and OKRs into compelling self-evaluations for performance reviews. Highlights business impact, leadership, and growth goals.',
    seoKeywords: [
      'performance review writer',
      'self evaluation generator',
      'annual performance review phrases',
      'employee self assessment',
      'how to write self evaluation',
      'okr achievement summary'
    ],
    longTailKeywords: [
      'how to write self evaluation for software engineer promotion review',
      'performance review accomplishments examples with business impact numbers',
      'areas for growth and development professional self evaluation phrases',
      'star method self assessment for quarterly performance review'
    ],
    longTailUseCases: [
      {
        query: 'Senior Software Engineer annual review: led migration to microservices, mentored 2 juniors, reduced page load time by 40%',
        title: 'Engineering Promotion Self-Assessment',
        summary: 'Translates raw accomplishments into quantified business impact (revenue retention, system uptime, and team velocity multiplier effects).',
        presetValues: {
          jobTitle: 'Senior Software Engineer',
          accomplishments: '- Led migration to microservices architecture\n- Mentored 2 junior engineers through code reviews\n- Reduced core dashboard load times by 40%',
          growthAreas: 'Delegating architectural design docs earlier, cross-functional alignment with Product',
          ratingGoal: 'exceeds'
        }
      }
    ],
    presets: [
      {
        label: 'Senior Engineer Promotion',
        values: { jobTitle: 'Senior Software Engineer', accomplishments: '- Reduced API latency by 45%\n- Led zero-downtime database migration\n- Mentored 2 junior engineers', growthAreas: 'Earlier stakeholder alignment on technical roadmap', ratingGoal: 'exceeds' }
      },
      {
        label: 'Marketing Manager Review',
        values: { jobTitle: 'Demand Generation Manager', accomplishments: '- Grew inbound pipeline by 32% YoY\n- Reduced customer acquisition cost (CAC) by 18%\n- Launched new weekly webinar series', growthAreas: 'Deepening enterprise account-based marketing (ABM) strategy', ratingGoal: 'exceeds' }
      }
    ],
    inputs: [
      { id: 'jobTitle', label: 'Your Job Title / Level', type: 'text', defaultValue: 'Senior Software Engineer' },
      { id: 'accomplishments', label: 'Key Accomplishments & Metrics (Bullets)', type: 'textarea', defaultValue: '- Reduced API latency by 45%\n- Led zero-downtime database migration\n- Mentored 2 junior engineers' },
      { id: 'growthAreas', label: 'Areas of Growth / Future Development', type: 'text', defaultValue: 'Deepening cross-functional stakeholder alignment' },
      {
        id: 'ratingGoal',
        label: 'Target Performance Tier',
        type: 'select',
        defaultValue: 'exceeds',
        options: [
          { label: 'Exceeds Expectations / Top Performer', value: 'exceeds' },
          { label: 'Consistently Meets / Solid Contributor', value: 'meets' }
        ]
      }
    ],
    quickCompute: (vals) => {
      return {
        mainResult: `${vals.jobTitle} Evaluation`,
        mainLabel: 'Self-Assessment Structure',
        secondaryMetrics: [
          { label: 'Performance Tier', value: vals.ratingGoal === 'exceeds' ? 'Exceeds Expectations' : 'Meets Expectations' },
          { label: 'Core Framework', value: 'Impact -> Collaboration -> Future OKRs' }
        ],
        summary: `Self-evaluation draft created for ${vals.jobTitle}. Quantifies business impact and pairs achievements with humble self-awareness of growth opportunities.`
      };
    },
    aiTaskType: 'creative',
    promptTemplate: `Act as a Fortune 500 VP and executive talent review committee director.
Role: {jobTitle}
Target Tier: {ratingGoal}
Accomplishments:
{accomplishments}
Growth Focus: {growthAreas}

Write a comprehensive, compelling Performance Review Self-Evaluation including:
1. Executive Summary: High-level narrative framing the year's impact.
2. Core Accomplishments: Detailed paragraphs translating raw bullets into measurable business revenue, speed, and organizational impact (using the X-Y-Z formula: "Accomplished [X] as measured by [Y] by doing [Z]").
3. Leadership & Collaboration: How you acted as a force multiplier for teammates.
4. Constructive Growth & Next Year OKRs: Thoughtful self-awareness demonstrating proactive ambition without undermining credibility.`,
    howToSteps: [
      { step: 1, title: 'Enter Role & Achievements', description: 'Paste the rough bullet points of projects you completed over the past year.' },
      { step: 2, title: 'Specify Growth Focus', description: 'Identify one or two genuine skills you look forward to strengthening.' },
      { step: 3, title: 'Generate Executive Review', description: 'Get publication-grade self-evaluations that demonstrate strategic impact for promotions.' }
    ],
    faqs: [
      { question: 'How should I talk about my weaknesses in a self-evaluation?', answer: 'Frame weaknesses as proactive "growth horizons" or strategic focus areas for the upcoming quarter, paired with concrete steps you are already taking to develop that skill.' }
    ],
    features: [
      'Transforms rough notes into quantified business impact language',
      'Applies the Google X-Y-Z accomplishment formula',
      'Balances leadership confidence with authentic growth self-awareness'
    ]
  },
  {
    id: 'letter-of-recommendation',
    slug: 'letter-of-recommendation-endorsement-writer',
    aliases: ['recommendation-letter', 'reference-letter-generator', 'endorsement-writer', 'lor-generator'],
    number: '90',
    category: 'Career',
    title: 'Letter of Recommendation & Reference Writer',
    shortDescription: 'Draft heartfelt, authoritative letters of recommendation for former employees, students, interns, or colleagues applying for jobs or graduate school.',
    searchVolumeBadge: 'Academic & Professional Reference #1',
    accentColor: 'from-amber-600 to-yellow-500',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
    iconName: 'Award',
    seoTitle: 'Free Letter of Recommendation Writer - Employee & Student Reference',
    seoDescription: 'Generate professional, compelling letters of recommendation for job applications, graduate school, or promotions. Highlight strengths, work ethic, and achievements.',
    seoKeywords: [
      'letter of recommendation generator',
      'reference letter writer',
      'recommendation letter for employee',
      'academic recommendation letter graduate school',
      'character reference letter',
      'recommendation letter template free'
    ],
    longTailKeywords: [
      'how to write a strong letter of recommendation for former employee',
      'sample letter of recommendation for masters degree program',
      'positive recommendation letter highlighting work ethic and leadership',
      'letter of reference from manager for software engineer'
    ],
    longTailUseCases: [
      {
        query: 'Manager recommending a Marketing Specialist applying for a Senior Director role at a major agency',
        title: 'Executive Career Endorsement',
        summary: 'Articulates candidate’s analytical rigor, campaign ROI track record, and collaborative demeanor with unequivocal endorsement.',
        presetValues: {
          candidateName: 'Emily Chang',
          relationship: 'Direct Supervisor for 3 years',
          targetOpportunity: 'Senior Director of Brand Strategy',
          keyStrengths: 'Data-driven creativity, led 140% viral campaign reach, exceptional poise under deadline pressure'
        }
      }
    ],
    presets: [
      {
        label: 'Employee Job Reference',
        values: { candidateName: 'Emily Chang', relationship: 'Direct Supervisor for 3 years', targetOpportunity: 'Senior Director role', keyStrengths: 'Data-driven creativity, managed $2M budget, elevated team morale' }
      },
      {
        label: 'Student Graduate School',
        values: { candidateName: 'Liam Davis', relationship: 'Professor of Computer Science', targetOpportunity: 'M.S. in Artificial Intelligence at Stanford', keyStrengths: 'Top 2% of class, published peer-reviewed research paper' }
      }
    ],
    inputs: [
      { id: 'candidateName', label: 'Candidate’s Full Name', type: 'text', defaultValue: 'Emily Chang' },
      { id: 'relationship', label: 'Your Relationship to Candidate', type: 'text', defaultValue: 'Direct Supervisor for 3 years' },
      { id: 'targetOpportunity', label: 'Target Job, University, or Award', type: 'text', defaultValue: 'Senior Director role' },
      { id: 'keyStrengths', label: 'Key Strengths, Anecdotes & Achievements', type: 'textarea', defaultValue: 'Data-driven creativity, managed $2M budget, elevated team morale' }
    ],
    quickCompute: (vals) => {
      return {
        mainResult: `Recommendation for ${vals.candidateName}`,
        mainLabel: 'Formal Endorsement Draft',
        secondaryMetrics: [
          { label: 'Opportunity', value: vals.targetOpportunity },
          { label: 'Endorsement Level', value: 'Highest Possible Recommendation' },
          { label: 'Relationship', value: vals.relationship }
        ],
        summary: `Letter of recommendation drafted for ${vals.candidateName} for their pursuit of ${vals.targetOpportunity}. Authoritative and persuasive.`
      };
    },
    aiTaskType: 'creative',
    promptTemplate: `Act as an executive leader and distinguished academic mentor.
Candidate Name: {candidateName}
Relationship: {relationship}
Opportunity: {targetOpportunity}
Key Strengths: {keyStrengths}

Write an eloquent, authoritative, and persuasive Letter of Recommendation containing:
1. Formal header and salutation ("Dear Hiring Committee" or "To Whom It May Concern").
2. Strong opening statement offering an unequivocal, enthusiastic recommendation.
3. Context of your professional relationship and tenure working together.
4. Two distinct substantive body paragraphs detailing specific accomplishments, character traits, and problem-solving examples.
5. Soft skills assessment (culture fit, resilience, emotional intelligence).
6. Closing invitation to contact you directly for further references.`,
    howToSteps: [
      { step: 1, title: 'Enter Candidate Info', description: 'Type the candidate’s name and specify the position or university they are applying for.' },
      { step: 2, title: 'Add Specific Anecdotes', description: 'Briefly note their standout achievements and character strengths.' },
      { step: 3, title: 'Generate Formal Letter', description: 'Receive an authoritative, persuasive letter ready for signature on letterhead.' }
    ],
    faqs: [
      { question: 'What makes a letter of recommendation stand out?', answer: 'Specificity. Generalized praise ("she is hard working") is weak. Concrete anecdotes showing how the candidate solved an ambiguous problem or elevated teammates carry immense weight.' }
    ],
    features: [
      'Unequivocal top-tier endorsement phrasing',
      'Dual modes for corporate employment and graduate academic admissions',
      'Ready for formal company or university letterhead'
    ]
  },
  {
    id: 'customer-retention',
    slug: 'nps-customer-retention-cohort-calculator',
    aliases: ['nps-calculator', 'net-promoter-score', 'customer-retention-rate', 'cohort-analyzer'],
    number: '91',
    category: 'Business',
    title: 'Net Promoter Score (NPS) & Customer Retention Calculator',
    shortDescription: 'Calculate Net Promoter Score (NPS) from Promoters, Passives, and Detractors, plus Customer Retention Rate (CRR) and Churn percentages.',
    searchVolumeBadge: 'Customer Success & Product #1',
    accentColor: 'from-teal-500 to-emerald-500',
    badgeColor: 'text-teal-400 border-teal-500/30 bg-teal-950/40',
    iconName: 'UserCheck',
    seoTitle: 'Free Net Promoter Score (NPS) & Retention Rate Calculator',
    seoDescription: 'Calculate Net Promoter Score (NPS = % Promoters - % Detractors), Customer Retention Rate (CRR), and annual cohort churn percentage.',
    seoKeywords: [
      'nps calculator',
      'net promoter score calculator',
      'customer retention rate calculator',
      'customer churn calculator',
      'how to calculate nps score',
      'promoters detractors passives'
    ],
    longTailKeywords: [
      'how to calculate net promoter score formula promoters minus detractors',
      'customer retention rate formula crr start customers end customers new customers',
      'what is considered a good nps score in b2b saas industry benchmark',
      'difference between passives and detractors in customer feedback surveys'
    ],
    longTailUseCases: [
      {
        query: 'Survey had 120 Promoters (9-10), 40 Passives (7-8), and 20 Detractors (0-6)',
        title: 'B2B Customer Satisfaction Audit',
        summary: 'NPS is +56 (66.7% Promoters - 11.1% Detractors), considered "World-Class" according to Bain & Company standards.',
        presetValues: {
          promoters: '120',
          passives: '40',
          detractors: '20'
        }
      }
    ],
    presets: [
      { label: 'Healthy SaaS (120 Promoters, 40 Passives, 20 Detractors)', values: { promoters: '120', passives: '40', detractors: '20' } },
      { label: 'Needs Improvement (50 Promoters, 60 Passives, 70 Detractors)', values: { promoters: '50', passives: '60', detractors: '70' } }
    ],
    inputs: [
      { id: 'promoters', label: 'Promoters (Score 9-10)', type: 'number', defaultValue: '120' },
      { id: 'passives', label: 'Passives (Score 7-8)', type: 'number', defaultValue: '40' },
      { id: 'detractors', label: 'Detractors (Score 0-6)', type: 'number', defaultValue: '20' }
    ],
    quickCompute: (vals) => {
      const p = parseFloat(vals.promoters || '120');
      const pass = parseFloat(vals.passives || '40');
      const d = parseFloat(vals.detractors || '20');

      const total = p + pass + d;
      if (total === 0) return { error: 'Please enter at least one survey response.' };

      const pctP = (p / total) * 100;
      const pctD = (d / total) * 100;
      const pctPass = (pass / total) * 100;
      const nps = Math.round(pctP - pctD);

      let rating = '';
      if (nps >= 70) rating = 'World Class (Apple, Ritz-Carlton level)';
      else if (nps >= 50) rating = 'Excellent (High Organic Word-of-Mouth)';
      else if (nps >= 30) rating = 'Good (Solid Customer Loyalty)';
      else if (nps >= 0) rating = 'Acceptable (Room for Experience Gains)';
      else rating = 'Critical Attention Required (Detractors Outnumber Promoters)';

      return {
        mainResult: `${nps > 0 ? '+' : ''}${nps}`,
        mainLabel: 'Net Promoter Score (NPS)',
        secondaryMetrics: [
          { label: 'Promoters % (9-10)', value: `${pctP.toFixed(1)}% (${p})` },
          { label: 'Detractors % (0-6)', value: `${pctD.toFixed(1)}% (${d})` },
          { label: 'Passives % (7-8)', value: `${pctPass.toFixed(1)}% (${pass})` },
          { label: 'Benchmark Tier', value: rating }
        ],
        summary: `Based on ${total} customer responses, your NPS is ${nps > 0 ? '+' : ''}${nps} (${pctP.toFixed(1)}% Promoters minus ${pctD.toFixed(1)}% Detractors). Tier: ${rating}.`
      };
    },
    aiTaskType: 'analysis',
    promptTemplate: `Act as a VP of Customer Experience (CX) and product growth leader.
Promoters: {promoters}
Passives: {passives}
Detractors: {detractors}

Provide:
1. Complete NPS evaluation and industry benchmark comparisons (SaaS benchmark is +41, Healthcare +38, Retail +58).
2. Action plan for Detractors: Closing the feedback loop within 24 hours to prevent churn.
3. Converting Passives (7-8) into active Promoters: Identifying product gaps and friction points.
4. Mobilizing Promoters for referral marketing, case studies, and G2/Capterra reviews.`,
    howToSteps: [
      { step: 1, title: 'Input Survey Counts', description: 'Enter the count of respondents who rated 9-10 (Promoters), 7-8 (Passives), and 0-6 (Detractors).' },
      { step: 2, title: 'Instant Score Calculation', description: 'See your net score on the standard -100 to +100 scale.' },
      { step: 3, title: 'Analyze Loyalty Benchmarks', description: 'Evaluate your performance tier against industry standards.' }
    ],
    faqs: [
      { question: 'What does a good NPS score look like?', answer: 'Any positive NPS score (>0) means you have more advocates than detractors. A score above +50 is considered excellent, and +70 or higher is world-class.' }
    ],
    features: [
      'Standard Fred Reichheld (Bain & Co) NPS formula',
      'Percentage distribution breakdown of Promoters, Passives, and Detractors',
      'Automated customer journey and retention playbooks'
    ]
  }
];
