import { ToolDefinition } from '../../types';

export const LIFESTYLE_FINANCE_TOOLS: ToolDefinition[] = [
  {
    id: 'car-loan-lease',
    slug: 'car-loan-vs-lease-monthly-payment-calculator',
    aliases: ['car-loan-calculator', 'auto-lease-calculator', 'car-payment-calculator', 'lease-vs-buy'],
    number: '92',
    category: 'Finance',
    title: 'Car Loan vs. Lease Payment Calculator',
    shortDescription: 'Compare purchasing with an auto loan versus leasing a vehicle. Calculate monthly payments, money factor, depreciation, and total 5-year cost.',
    searchVolumeBadge: 'Automotive & Finance #1',
    accentColor: 'from-blue-600 to-indigo-600',
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-950/40',
    iconName: 'Car',
    seoTitle: 'Free Car Loan vs Lease Calculator - Compare Monthly Payments & Cost',
    seoDescription: 'Calculate car loan monthly payments, auto lease rates, money factors, residual values, and compare total 5-year ownership cost of buying vs leasing.',
    seoKeywords: [
      'car loan calculator',
      'car lease calculator',
      'auto loan monthly payment',
      'lease vs buy car calculator',
      'car finance calculator',
      'money factor to apr converter'
    ],
    longTailKeywords: [
      'how to calculate car lease monthly payment depreciation plus rent charge',
      'convert lease money factor 0.0025 to equivalent interest rate apr',
      'total cost of buying vs leasing a car over 5 years',
      'car loan amortization with trade in value and down payment'
    ],
    longTailUseCases: [
      {
        query: '$38,000 new vehicle with $5,000 down payment at 6.0% APR for 60 months',
        title: 'New Vehicle Financing Analysis',
        summary: 'Monthly loan payment is $637.99 for 60 months, with $5,279 in total financing interest paid over the life of the loan.',
        presetValues: {
          vehiclePrice: '38000',
          downPayment: '5000',
          interestRate: '6.0',
          loanTermMonths: '60',
          salesTax: '7.0'
        }
      }
    ],
    presets: [
      { label: '$38k Car, $5k Down, 60 Months at 6%', values: { vehiclePrice: '38000', downPayment: '5000', interestRate: '6.0', loanTermMonths: '60', salesTax: '7.0' } },
      { label: '$55k SUV, $10k Down, 48 Months at 4.9%', values: { vehiclePrice: '55000', downPayment: '10000', interestRate: '4.9', loanTermMonths: '48', salesTax: '8.0' } }
    ],
    inputs: [
      { id: 'vehiclePrice', label: 'Vehicle Purchase Price ($)', type: 'number', defaultValue: '38000' },
      { id: 'downPayment', label: 'Down Payment & Trade-in Equity ($)', type: 'number', defaultValue: '5000' },
      { id: 'interestRate', label: 'Loan Annual Interest Rate (APR %)', type: 'number', defaultValue: '6.0' },
      {
        id: 'loanTermMonths',
        label: 'Loan Term (Months)',
        type: 'select',
        defaultValue: '60',
        options: [
          { label: '36 Months (3 Years)', value: '36' },
          { label: '48 Months (4 Years)', value: '48' },
          { label: '60 Months (5 Years - Standard)', value: '60' },
          { label: '72 Months (6 Years)', value: '72' }
        ]
      },
      { id: 'salesTax', label: 'Sales Tax Rate (%)', type: 'number', defaultValue: '7.0' }
    ],
    quickCompute: (vals) => {
      const price = parseFloat(vals.vehiclePrice || '38000');
      const down = parseFloat(vals.downPayment || '5000');
      const taxRate = parseFloat(vals.salesTax || '7.0') / 100;
      const termMonths = parseInt(vals.loanTermMonths || '60', 10);
      const apr = parseFloat(vals.interestRate || '6.0') / 100 / 12;

      const taxedPrice = price * (1 + taxRate);
      const principal = Math.max(0, taxedPrice - down);

      let monthlyPayment = 0;
      if (apr > 0) {
        monthlyPayment = (principal * apr * Math.pow(1 + apr, termMonths)) / (Math.pow(1 + apr, termMonths) - 1);
      } else {
        monthlyPayment = principal / termMonths;
      }

      const totalPaid = monthlyPayment * termMonths + down;
      const totalInterest = totalPaid - taxedPrice;

      // Estimated 36-month lease equivalent
      const residualValue = price * 0.55;
      const leaseDepreciation = (price - residualValue) / 36;
      const leaseRentCharge = (price + residualValue) * (apr / 2);
      const leaseMonthly = (leaseDepreciation + leaseRentCharge) * (1 + taxRate);

      return {
        mainResult: `$${monthlyPayment.toFixed(2)} / mo`,
        mainLabel: 'Monthly Auto Loan Payment',
        secondaryMetrics: [
          { label: 'Total Financed Principal', value: `$${principal.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Total Interest Paid', value: `$${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Total Out-of-Pocket Cost', value: `$${totalPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Estimated 36-Mo Lease Payment', value: `~$${leaseMonthly.toFixed(2)} / mo` }
        ],
        summary: `Financing a $${price.toLocaleString()} vehicle with $${down.toLocaleString()} down at ${vals.interestRate}% APR results in a $${monthlyPayment.toFixed(2)}/mo payment for ${termMonths} months (total interest $${totalInterest.toFixed(0)}).`
      };
    },
    aiTaskType: 'analysis',
    promptTemplate: `Act as an automotive finance expert and certified financial planner.
Vehicle Price: ${'{vehiclePrice}'}
Down Payment: ${'{downPayment}'}
Interest Rate: {interestRate}% APR
Term: {loanTermMonths} Months
Sales Tax: {salesTax}%

Provide:
1. Complete Loan vs Lease Comparison Matrix:
   - Equity accumulation and resale value after 5 years.
   - Mileage limits, wear-and-tear penalties, and gap insurance considerations.
2. Dealership Negotiation Strategy: How to negotiate out-the-door price vs monthly payment traps.
3. Total Cost of Ownership (TCO) estimate including comprehensive insurance, fuel, and scheduled maintenance.
4. Recommendation: Buy vs Lease verdict based on typical driving profiles.`,
    howToSteps: [
      { step: 1, title: 'Enter Vehicle & Down Payment', description: 'Type the vehicle sticker price and your cash down payment or trade-in value.' },
      { step: 2, title: 'Set Loan Terms', description: 'Choose your loan duration (48, 60, or 72 months) and financing interest rate.' },
      { step: 3, title: 'Compare Loan vs Lease', description: 'Review monthly installment payments, total interest fees, and lease benchmarks.' }
    ],
    faqs: [
      { question: 'Is it better to lease or buy a car?', answer: 'Buying is typically better if you drive over 12,000 miles/year, keep cars for 5+ years, and want equity. Leasing offers lower monthly payments and new warranty coverage every 3 years, but leaves you with zero ownership equity.' }
    ],
    features: [
      'Comprehensive sales tax and out-the-door cost amortization',
      'Estimated lease payment benchmark comparison',
      'Total interest cost breakdown over the loan life'
    ]
  },
  {
    id: 'student-loan-payoff',
    slug: 'student-loan-payoff-refinance-calculator',
    aliases: ['student-loan-calculator', 'loan-payoff-calculator', 'student-loan-refinance', 'idr-repayment'],
    number: '93',
    category: 'Finance',
    title: 'Student Loan Payoff & Extra Payment Accelerator',
    shortDescription: 'Calculate how making extra monthly payments shortens your student debt payoff date and saves thousands in compounding interest.',
    searchVolumeBadge: 'College Debt & Student Loans #1',
    accentColor: 'from-cyan-600 to-blue-600',
    badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40',
    iconName: 'GraduationCap',
    seoTitle: 'Free Student Loan Payoff Calculator - Extra Payment Savings',
    seoDescription: 'Calculate how extra monthly payments accelerate your student loan debt freedom. Compare standard 10-year repayment vs extra principal payoff.',
    seoKeywords: [
      'student loan payoff calculator',
      'student loan repayment calculator',
      'extra payment student loan savings',
      'student loan interest calculator',
      'how to pay off student loans faster',
      'debt payoff schedule student loans'
    ],
    longTailKeywords: [
      'how much interest do i save paying 200 extra per month on student loans',
      'calculate student loan payoff date with additional principal payments',
      'federal student loan standard 10 year repayment plan formula',
      'student loan refinancing savings interest rate comparison'
    ],
    longTailUseCases: [
      {
        query: '$45,000 student loan balance at 6.5% interest. What happens if I pay $150 extra per month?',
        title: 'Accelerated Student Debt Payoff',
        summary: 'Paying an extra $150/month cuts the repayment period by 3.5 years (finishing in 6.5 years instead of 10), saving $6,150 in total interest.',
        presetValues: {
          loanBalance: '45000',
          interestRate: '6.5',
          standardTermYears: '10',
          extraMonthlyPayment: '150'
        }
      }
    ],
    presets: [
      { label: '$45k Balance, 6.5%, +$150/mo Extra', values: { loanBalance: '45000', interestRate: '6.5', standardTermYears: '10', extraMonthlyPayment: '150' } },
      { label: '$75k Balance, 7.2%, +$250/mo Extra', values: { loanBalance: '75000', interestRate: '7.2', standardTermYears: '10', extraMonthlyPayment: '250' } }
    ],
    inputs: [
      { id: 'loanBalance', label: 'Total Student Loan Balance ($)', type: 'number', defaultValue: '45000' },
      { id: 'interestRate', label: 'Average Interest Rate (%)', type: 'number', defaultValue: '6.5' },
      { id: 'standardTermYears', label: 'Standard Loan Term (Years)', type: 'number', defaultValue: '10' },
      { id: 'extraMonthlyPayment', label: 'Extra Principal Paid Monthly ($)', type: 'number', defaultValue: '150' }
    ],
    quickCompute: (vals) => {
      const balance = parseFloat(vals.loanBalance || '45000');
      const r = parseFloat(vals.interestRate || '6.5') / 100 / 12;
      const n = parseInt(vals.standardTermYears || '10', 10) * 12;
      const extra = parseFloat(vals.extraMonthlyPayment || '150');

      const standardPmt = (balance * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const acceleratedPmt = standardPmt + extra;

      // Calculate accelerated months
      let acceleratedMonths = 0;
      let remaining = balance;
      let totalInterestAcc = 0;

      while (remaining > 0 && acceleratedMonths < 600) {
        const interest = remaining * r;
        totalInterestAcc += interest;
        const principalPart = acceleratedPmt - interest;
        remaining -= principalPart;
        acceleratedMonths++;
      }

      const standardTotalInterest = standardPmt * n - balance;
      const interestSaved = Math.max(0, standardTotalInterest - totalInterestAcc);
      const monthsSaved = Math.max(0, n - acceleratedMonths);
      const yearsSaved = (monthsSaved / 12).toFixed(1);

      return {
        mainResult: `$${interestSaved.toLocaleString(undefined, { maximumFractionDigits: 0 })} Saved`,
        mainLabel: 'Total Interest Saved with Extra Payments',
        secondaryMetrics: [
          { label: 'Time Saved Off Loan', value: `${yearsSaved} Years Faster` },
          { label: 'Standard Monthly Payment', value: `$${standardPmt.toFixed(2)} / mo` },
          { label: 'Accelerated Total Monthly', value: `$${acceleratedPmt.toFixed(2)} / mo` },
          { label: 'Debt Freedom In', value: `${(acceleratedMonths / 12).toFixed(1)} Years` }
        ],
        summary: `Paying an extra $${extra}/month on your $${balance.toLocaleString()} loan saves $${interestSaved.toFixed(0)} in interest and eliminates your debt ${yearsSaved} years sooner!`
      };
    },
    aiTaskType: 'analysis',
    promptTemplate: `Act as a certified student loan counselor and financial coach.
Balance: ${'{loanBalance}'}
Interest Rate: {interestRate}%
Standard Term: {standardTermYears} Years
Extra Monthly: ${'{extraMonthlyPayment}'}

Provide:
1. Complete payoff strategy: Federal student loan protections (SAVE / IDR plans, PSLF public service loan forgiveness) vs private refinancing.
2. The Avalanche Method (highest interest first) vs Snowball Method (smallest balance first) for multi-loan borrowers.
3. Tax deductions: Student loan interest tax deduction ($2,500 maximum IRS limit).
4. Employer student loan repayment match programs (SECURE 2.0 Act 401k match provisions).`,
    howToSteps: [
      { step: 1, title: 'Enter Loan Balance & Rate', description: 'Type your total student debt principal and average interest rate.' },
      { step: 2, title: 'Set Extra Monthly Contribution', description: 'Enter any additional $50, $100, or $200 you can pay toward principal.' },
      { step: 3, title: 'View Interest & Years Saved', description: 'See your exact accelerated debt-free target date and total saved cash.' }
    ],
    faqs: [
      { question: 'Does extra payment automatically go to principal?', answer: 'Always confirm with your student loan servicer (Nelnet, MOHELA, Aidvantage) that extra payments are explicitly applied to the principal balance, rather than advancing the next due date.' }
    ],
    features: [
      'Accurate amortization schedule comparison',
      'Calculates exact years and months shaved off loan term',
      'Federal IDR vs Private Refinancing guidance'
    ]
  },
  {
    id: 'emergency-fund',
    slug: 'emergency-fund-safety-net-runway-calculator',
    aliases: ['emergency-fund-calculator', 'safety-net-calculator', 'rainy-day-fund', 'cash-runway'],
    number: '94',
    category: 'Finance',
    title: 'Emergency Fund & Financial Runway Calculator',
    shortDescription: 'Calculate the exact 3-to-6 month safety net needed to survive unexpected job loss, medical emergencies, or home repairs.',
    searchVolumeBadge: 'Personal Finance Foundation #1',
    accentColor: 'from-emerald-500 to-green-600',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
    iconName: 'Shield',
    seoTitle: 'Free Emergency Fund Calculator - 3 to 6 Month Cash Safety Net',
    seoDescription: 'Calculate how much cash you need in an emergency fund based on essential living expenses, dependents, and job stability. Financial runway calculator.',
    seoKeywords: [
      'emergency fund calculator',
      'how much emergency fund do i need',
      'financial runway calculator',
      'rainy day fund calculator',
      '3 to 6 months expenses calculator',
      'high yield savings emergency fund'
    ],
    longTailKeywords: [
      'how to calculate emergency fund based on essential living expenses',
      'should freelancers have 6 or 12 months emergency fund',
      'where to keep emergency fund high yield savings account hyas vs cds',
      'what expenses should be excluded from emergency fund calculations'
    ],
    longTailUseCases: [
      {
        query: 'Monthly essential expenses are $3,800. How much emergency fund is needed for a single earner household?',
        title: 'Essential Safety Net Calculation',
        summary: 'A 6-month safety net requires $22,800. At 4.5% APY in a High-Yield Savings Account (HYSA), this generates $1,026/year in risk-free passive interest.',
        presetValues: {
          housing: '1800',
          utilitiesFood: '1100',
          insuranceDebt: '900',
          monthsTarget: '6',
          currentSaved: '7000'
        }
      }
    ],
    presets: [
      { label: 'Standard Household ($3,800/mo, 6 Months Target)', values: { housing: '1800', utilitiesFood: '1100', insuranceDebt: '900', monthsTarget: '6', currentSaved: '7000' } },
      { label: 'Freelancer / Variable Income ($4,500/mo, 9 Months Target)', values: { housing: '2000', utilitiesFood: '1300', insuranceDebt: '1200', monthsTarget: '9', currentSaved: '12000' } }
    ],
    inputs: [
      { id: 'housing', label: 'Monthly Rent or Mortgage ($)', type: 'number', defaultValue: '1800' },
      { id: 'utilitiesFood', label: 'Essential Utilities, Groceries & Transport ($)', type: 'number', defaultValue: '1100' },
      { id: 'insuranceDebt', label: 'Insurance & Minimum Debt Payments ($)', type: 'number', defaultValue: '900' },
      {
        id: 'monthsTarget',
        label: 'Safety Net Duration',
        type: 'select',
        defaultValue: '6',
        options: [
          { label: '3 Months (Dual-Income, Stable Salaried)', value: '3' },
          { label: '6 Months (Standard Single Earner)', value: '6' },
          { label: '9 Months (Self-Employed / High Commission)', value: '9' },
          { label: '12 Months (Freelancer / Specialized Executive)', value: '12' }
        ]
      },
      { id: 'currentSaved', label: 'Current Cash Already Saved ($)', type: 'number', defaultValue: '7000' }
    ],
    quickCompute: (vals) => {
      const housing = parseFloat(vals.housing || '1800');
      const essentials = parseFloat(vals.utilitiesFood || '1100');
      const debt = parseFloat(vals.insuranceDebt || '900');
      const targetMonths = parseInt(vals.monthsTarget || '6', 10);
      const current = parseFloat(vals.currentSaved || '7000');

      const monthlyBurn = housing + essentials + debt;
      const targetTotal = monthlyBurn * targetMonths;
      const shortfall = Math.max(0, targetTotal - current);
      const currentRunwayMonths = monthlyBurn > 0 ? (current / monthlyBurn).toFixed(1) : '0';

      // 4.5% HYSA interest estimate
      const annualInterestHYSA = targetTotal * 0.045;

      return {
        mainResult: `$${targetTotal.toLocaleString()}`,
        mainLabel: `${targetMonths}-Month Emergency Target`,
        secondaryMetrics: [
          { label: 'Current Runway Duration', value: `${currentRunwayMonths} Months` },
          { label: 'Remaining Savings Gap', value: shortfall > 0 ? `$${shortfall.toLocaleString()}` : 'Fully Funded! 🎉' },
          { label: 'Monthly Bare-Bones Burn', value: `$${monthlyBurn.toLocaleString()} / mo` },
          { label: 'Annual HYSA Interest (@4.5%)', value: `$${annualInterestHYSA.toFixed(0)} / year` }
        ],
        summary: `With essential expenses of $${monthlyBurn.toLocaleString()}/mo, your ${targetMonths}-month safety net target is $${targetTotal.toLocaleString()}. You currently have ${currentRunwayMonths} months of survival runway saved.`
      };
    },
    aiTaskType: 'analysis',
    promptTemplate: `Act as a fiduciary financial planner.
Monthly Barebones Expenses:
- Housing: ${'{housing}'}
- Groceries/Utilities: ${'{utilitiesFood}'}
- Minimum Debt/Insurance: ${'{insuranceDebt}'}
Target Months: {monthsTarget}
Current Savings: ${'{currentSaved}'}

Provide:
1. Evaluation of target size based on income volatility, health risks, and job market liquidity.
2. Where to store the emergency fund: High-Yield Savings Accounts (HYSA), Money Market Funds (MMF), Treasury Bills (T-Bills) vs CD ladders.
3. Strict criteria: What qualifies as a true emergency vs expected irregular expenses (sinking funds).
4. Automated 12-month savings sprint plan to close the remaining cash gap.`,
    howToSteps: [
      { step: 1, title: 'Tally Non-Negotiable Expenses', description: 'Enter housing, groceries, utilities, and mandatory minimum debt payments.' },
      { step: 2, title: 'Select Target Duration', description: 'Choose 3 to 12 months based on your career stability.' },
      { step: 3, title: 'Track Your Cash Runway', description: 'See your current runway in months and your remaining savings milestone.' }
    ],
    faqs: [
      { question: 'Should my emergency fund include discretionary spending like dining out?', answer: 'No. An emergency fund is designed for "survival mode" during crisis. Exclude dining out, vacations, and luxury entertainment from the baseline calculation.' }
    ],
    features: [
      'Bare-bones survival burn rate calculation',
      'Current cash runway duration estimation',
      'High-yield savings interest compounding projection'
    ]
  },
  {
    id: 'paint-flooring',
    slug: 'room-paint-tile-flooring-calculator',
    aliases: ['paint-calculator', 'flooring-calculator', 'square-footage-calculator', 'tile-calculator'],
    number: '95',
    category: 'Utilities',
    title: 'Room Paint, Tile & Flooring Estimator',
    shortDescription: 'Calculate wall square footage, paint gallon requirements, flooring square footage, tile boxes, and 10% cutting waste buffers.',
    searchVolumeBadge: 'Home Improvement & DIY #1',
    accentColor: 'from-amber-600 to-orange-500',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
    iconName: 'Home',
    seoTitle: 'Free Paint & Flooring Calculator - Gallons, Square Feet & Tile Waste',
    seoDescription: 'Calculate how many gallons of paint or boxes of tile/hardwood flooring you need for any room. Includes window/door deductions and 10% cut waste.',
    seoKeywords: [
      'paint calculator',
      'flooring calculator',
      'tile calculator square feet',
      'how many gallons of paint do i need',
      'room square footage calculator',
      'flooring waste calculator 10 percent'
    ],
    longTailKeywords: [
      'how to calculate square footage of walls minus doors and windows for painting',
      'how many square feet does 1 gallon of latex paint cover',
      'hardwood flooring waste factor percentage 10 percent vs 15 percent diagonal',
      'how many boxes of tile needed for bathroom floor'
    ],
    longTailUseCases: [
      {
        query: 'Room is 14ft by 16ft with 9ft ceilings. How much paint and flooring do I need?',
        title: 'Living Room Renovation Estimate',
        summary: 'Flooring requires 246 sq ft (including 10% waste buffer). Walls require 500 sq ft, which takes ~1.5 gallons per coat (3 gallons for 2 coats).',
        presetValues: {
          calcType: 'both',
          lengthFt: '16',
          widthFt: '14',
          heightFt: '9',
          doorsCount: '2',
          windowsCount: '2',
          coats: '2'
        }
      }
    ],
    presets: [
      { label: 'Living Room (16ft x 14ft, 9ft ceiling)', values: { calcType: 'both', lengthFt: '16', widthFt: '14', heightFt: '9', doorsCount: '2', windowsCount: '2', coats: '2' } },
      { label: 'Master Bedroom (12ft x 15ft, 8ft ceiling)', values: { calcType: 'paint', lengthFt: '15', widthFt: '12', heightFt: '8', doorsCount: '1', windowsCount: '2', coats: '2' } }
    ],
    inputs: [
      {
        id: 'calcType',
        label: 'Project Type',
        type: 'select',
        defaultValue: 'both',
        options: [
          { label: 'Both Walls (Paint) & Floor (Tile/Wood)', value: 'both' },
          { label: 'Wall Painting Only', value: 'paint' },
          { label: 'Flooring / Tiling Only', value: 'floor' }
        ]
      },
      { id: 'lengthFt', label: 'Room Length (Feet)', type: 'number', defaultValue: '16' },
      { id: 'widthFt', label: 'Room Width (Feet)', type: 'number', defaultValue: '14' },
      { id: 'heightFt', label: 'Ceiling Height (Feet)', type: 'number', defaultValue: '9' },
      { id: 'doorsCount', label: 'Number of Doors (Deducts 21 sq ft each)', type: 'number', defaultValue: '2' },
      { id: 'windowsCount', label: 'Number of Windows (Deducts 15 sq ft each)', type: 'number', defaultValue: '2' },
      { id: 'coats', label: 'Number of Paint Coats', type: 'number', defaultValue: '2' }
    ],
    quickCompute: (vals) => {
      const l = parseFloat(vals.lengthFt || '16');
      const w = parseFloat(vals.widthFt || '14');
      const h = parseFloat(vals.heightFt || '9');
      const doors = parseFloat(vals.doorsCount || '2');
      const windows = parseFloat(vals.windowsCount || '2');
      const coats = parseFloat(vals.coats || '2');

      const floorSqFt = l * w;
      const floorWithWaste = Math.ceil(floorSqFt * 1.1); // 10% waste buffer

      const perimeter = 2 * (l + w);
      const grossWallArea = perimeter * h;
      const deductions = doors * 21 + windows * 15;
      const netWallArea = Math.max(0, grossWallArea - deductions);

      // 1 gallon covers approx 350 sq ft
      const gallonsNeeded = Math.ceil((netWallArea * coats) / 350);

      return {
        mainResult: `${gallonsNeeded} Gallons Paint / ${floorWithWaste} sq ft Flooring`,
        mainLabel: 'Total Materials Needed (With Waste)',
        secondaryMetrics: [
          { label: 'Net Wall Paint Area', value: `${netWallArea.toFixed(0)} sq ft (${coats} coats)` },
          { label: 'Base Floor Area', value: `${floorSqFt.toFixed(0)} sq ft` },
          { label: 'Flooring (+10% Cut Waste)', value: `${floorWithWaste} sq ft` },
          { label: 'Estimated Tile Boxes (~20 sq ft/box)', value: `${Math.ceil(floorWithWaste / 20)} boxes` }
        ],
        summary: `For a ${l}ft × ${w}ft room with ${h}ft ceilings: Requires ${gallonsNeeded} gallons of paint for ${coats} coats, and ${floorWithWaste} sq ft of flooring (including 10% cutting waste).`
      };
    },
    aiTaskType: 'analysis',
    promptTemplate: `Act as a licensed residential general contractor and home renovation estimator.
Room Dimensions: {lengthFt}ft L x {widthFt}ft W x {heightFt}ft H
Openings: {doorsCount} doors, {windowsCount} windows
Paint Coats: {coats}

Provide:
1. Detailed bill of materials (Primer gallons, Topcoat paint gallons, Painter's tape rolls, Drop cloths).
2. Flooring material estimator: Hardwood / Luxury Vinyl Plank (LVP) vs Porcelain Tile with thinset mortar and grout bag calculations.
3. Cost estimation range: DIY material cost vs professional licensed contractor installation costs.
4. Prep work guidelines (drywall patching, sanding, moisture testing for concrete subfloors).`,
    howToSteps: [
      { step: 1, title: 'Measure Room Dimensions', description: 'Enter room length, width, and ceiling height in feet.' },
      { step: 2, title: 'Enter Doors & Windows', description: 'Input openings to deduct unpainted areas accurately.' },
      { step: 3, title: 'Get Purchase Quantities', description: 'Buy exactly the right gallons of paint and boxes of flooring.' }
    ],
    faqs: [
      { question: 'How much square footage does 1 gallon of paint cover?', answer: 'One standard gallon of interior latex paint covers between 350 and 400 square feet with a single coat on smooth, primed walls.' }
    ],
    features: [
      'Automatic deductions for standard doors (21 sq ft) and windows (15 sq ft)',
      '10% industry-standard cutting and breakage waste factor for flooring',
      'Coats multiplier for uniform paint coverage'
    ]
  },
  {
    id: 'electricity-cost',
    slug: 'appliance-electricity-cost-kwh-calculator',
    aliases: ['electricity-calculator', 'kwh-cost-calculator', 'appliance-energy-calculator', 'power-consumption'],
    number: '96',
    category: 'Utilities',
    title: 'Appliance Electricity Cost & kWh Calculator',
    shortDescription: 'Calculate monthly and annual electric bill costs for air conditioners, space heaters, EV chargers, PCs, and home appliances.',
    searchVolumeBadge: 'Energy & Utility Bills #1',
    accentColor: 'from-yellow-500 to-amber-500',
    badgeColor: 'text-yellow-400 border-yellow-500/30 bg-yellow-950/40',
    iconName: 'BatteryCharging',
    seoTitle: 'Free Electricity Cost Calculator - Appliance Watts to kWh & Cost',
    seoDescription: 'Calculate how much electricity an appliance uses in Kilowatt-Hours (kWh) and its dollar cost per month. AC, space heater, gaming PC, and EV charging.',
    seoKeywords: [
      'electricity cost calculator',
      'appliance electricity usage',
      'kwh calculator cost',
      'how much does it cost to run a space heater',
      'air conditioner electricity cost',
      'power consumption calculator'
    ],
    longTailKeywords: [
      'how to calculate electricity cost of 1500 watt space heater per day',
      'how much power does a gaming pc use per month in kwh',
      'calculate cost of charging electric vehicle tesla at home per kwh',
      'watts to kilowatt hours formula watts times hours divided by 1000'
    ],
    longTailUseCases: [
      {
        query: '1500W space heater running 8 hours a day at $0.16 per kWh',
        title: 'Winter Space Heater Operating Cost',
        summary: 'Consumes 12.0 kWh per day, costing $1.92 per day, $57.60 per month, and over $691 if run year-round.',
        presetValues: {
          watts: '1500',
          hoursPerDay: '8',
          kwhRate: '0.16'
        }
      }
    ],
    presets: [
      { label: '1500W Space Heater (8 hrs/day)', values: { watts: '1500', hoursPerDay: '8', kwhRate: '0.16' } },
      { label: 'Central Air Conditioner (3500W, 6 hrs/day)', values: { watts: '3500', hoursPerDay: '6', kwhRate: '0.18' } },
      { label: 'Gaming PC Setup (500W, 5 hrs/day)', values: { watts: '500', hoursPerDay: '5', kwhRate: '0.15' } }
    ],
    inputs: [
      { id: 'watts', label: 'Appliance Power Rating (Watts)', type: 'number', defaultValue: '1500' },
      { id: 'hoursPerDay', label: 'Usage Hours Per Day', type: 'number', defaultValue: '8' },
      { id: 'kwhRate', label: 'Electricity Cost ($ per kWh)', type: 'number', defaultValue: '0.16', helperText: 'US average is ~$0.16/kWh' }
    ],
    quickCompute: (vals) => {
      const watts = parseFloat(vals.watts || '1500');
      const hours = parseFloat(vals.hoursPerDay || '8');
      const rate = parseFloat(vals.kwhRate || '0.16');

      const dailyKwh = (watts * hours) / 1000;
      const dailyCost = dailyKwh * rate;
      const monthlyCost = dailyCost * 30;
      const annualCost = dailyCost * 365;

      return {
        mainResult: `$${monthlyCost.toFixed(2)} / month`,
        mainLabel: 'Estimated Monthly Electric Cost',
        secondaryMetrics: [
          { label: 'Daily Cost', value: `$${dailyCost.toFixed(2)} / day` },
          { label: 'Daily Energy Used', value: `${dailyKwh.toFixed(2)} kWh` },
          { label: 'Monthly Energy Used', value: `${(dailyKwh * 30).toFixed(1)} kWh` },
          { label: 'Annual Electricity Cost', value: `$${annualCost.toFixed(2)} / year` }
        ],
        summary: `A ${watts}W appliance operating ${hours} hours/day uses ${dailyKwh.toFixed(1)} kWh/day, costing $${monthlyCost.toFixed(2)} per month at $${rate}/kWh.`
      };
    },
    aiTaskType: 'analysis',
    promptTemplate: `Act as a home energy auditor and electrical engineer.
Appliance Power: {watts} Watts
Daily Runtime: {hoursPerDay} hours
Utility Rate: ${'{kwhRate}'} / kWh

Provide:
1. Complete cost breakdown (Hourly, Daily, Monthly, Annual).
2. Vampire power (standby phantom load) analysis for electronics.
3. Energy-saving alternatives (smart thermostats, heat pumps, Energy Star certified models).
4. Peak vs Off-Peak Time-of-Use (TOU) utility rate optimization strategies.`,
    howToSteps: [
      { step: 1, title: 'Find Appliance Wattage', description: 'Look at the UL label on the back of the appliance for Watts (or multiply Volts x Amps).' },
      { step: 2, title: 'Enter Daily Hours & Rate', description: 'Specify how many hours it runs each day and your utility rate from your bill.' },
      { step: 3, title: 'Inspect Monthly Bill Impact', description: 'See the exact impact on your monthly and annual electric bills.' }
    ],
    faqs: [
      { question: 'How do I convert Volts and Amps to Watts?', answer: 'Watts = Volts × Amps. For example, a 120V household appliance drawing 12.5 Amps uses 120 × 12.5 = 1,500 Watts.' }
    ],
    features: [
      'Automatic Watts-to-Kilowatt-Hour (kWh) conversion',
      'Instant daily, monthly, and yearly utility cost breakdowns',
      'Time-of-Use and Energy Star efficiency analysis'
    ]
  },
  {
    id: 'color-palette',
    slug: 'hex-color-palette-contrast-wcag-generator',
    aliases: ['color-palette-generator', 'contrast-checker', 'wcag-accessibility', 'hex-color-converter'],
    number: '97',
    category: 'Development',
    title: 'Color Palette & WCAG Contrast Accessibility Checker',
    shortDescription: 'Generate accessible harmonious color palettes, check WCAG 2.1 AA/AAA contrast ratios, and convert HEX to RGB, HSL, and Tailwind.',
    searchVolumeBadge: 'UI/UX & Web Design #1',
    accentColor: 'from-pink-500 to-rose-500',
    badgeColor: 'text-pink-400 border-pink-500/30 bg-pink-950/40',
    iconName: 'Palette',
    seoTitle: 'Free Color Palette Generator & WCAG Contrast Checker Online',
    seoDescription: 'Check WCAG AA/AAA color contrast ratios for web accessibility. Generate harmonious monochromatic, complementary, and triadic HEX palettes.',
    seoKeywords: [
      'color palette generator',
      'wcag contrast checker',
      'color accessibility checker',
      'hex to rgb converter',
      'tailwind color generator',
      'color ratio 4.5 to 1'
    ],
    longTailKeywords: [
      'how to pass wcag 2.1 aa color contrast ratio 4.5 to 1 for text',
      'generate complementary and analogous hex color palette',
      'relative luminance formula for text and background accessibility',
      'tailwind css custom color palette configuration export'
    ],
    longTailUseCases: [
      {
        query: 'Check contrast ratio between deep navy blue #0F172A and white text #FFFFFF',
        title: 'Web Accessibility Compliance Check',
        summary: 'Contrast ratio is 16.1:1, easily passing WCAG Level AAA for both normal body text and large headings.',
        presetValues: {
          fgColor: '#FFFFFF',
          bgColor: '#0F172A'
        }
      }
    ],
    presets: [
      { label: 'Navy & White (Dark Mode Pass)', values: { fgColor: '#FFFFFF', bgColor: '#0F172A' } },
      { label: 'Dark Charcoal on Light (#1E293B on #F8FAFC)', values: { fgColor: '#1E293B', bgColor: '#F8FAFC' } },
      { label: 'Low Contrast Failure (#94A3B8 on #FFFFFF)', values: { fgColor: '#94A3B8', bgColor: '#FFFFFF' } }
    ],
    inputs: [
      { id: 'fgColor', label: 'Foreground / Text Color (HEX)', type: 'text', defaultValue: '#FFFFFF' },
      { id: 'bgColor', label: 'Background Color (HEX)', type: 'text', defaultValue: '#0F172A' }
    ],
    quickCompute: (vals) => {
      const getLuminance = (hex: string): number => {
        let clean = hex.replace('#', '');
        if (clean.length === 3) clean = clean.split('').map((c) => c + c).join('');
        const num = parseInt(clean, 16);
        const r = (num >> 16) / 255;
        const g = ((num >> 8) & 0xff) / 255;
        const b = (num & 0xff) / 255;

        const sRGB = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
        return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
      };

      try {
        const l1 = getLuminance(vals.fgColor || '#FFFFFF');
        const l2 = getLuminance(vals.bgColor || '#0F172A');
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        const ratio = (lighter + 0.05) / (darker + 0.05);

        const passAA = ratio >= 4.5;
        const passAAA = ratio >= 7.0;

        return {
          mainResult: `${ratio.toFixed(2)}:1`,
          mainLabel: 'WCAG Contrast Ratio',
          secondaryMetrics: [
            { label: 'Normal Text (AA ≥ 4.5)', value: passAA ? 'Pass ✅' : 'Fail ❌' },
            { label: 'Enhanced Text (AAA ≥ 7.0)', value: passAAA ? 'Pass ✅' : 'Fail ❌' },
            { label: 'Large Text (AA ≥ 3.0)', value: ratio >= 3.0 ? 'Pass ✅' : 'Fail ❌' },
            { label: 'Compliance Level', value: passAAA ? 'WCAG AAA (Maximum)' : passAA ? 'WCAG AA (Standard)' : 'Fails Compliance' }
          ],
          summary: `Contrast ratio is ${ratio.toFixed(2)}:1. ${passAA ? 'Passes WCAG AA requirements.' : 'Fails minimum 4.5:1 WCAG contrast for body text.'}`
        };
      } catch (err) {
        return { error: 'Please enter valid 6-character HEX codes (e.g. #FFFFFF).' };
      }
    },
    aiTaskType: 'code',
    promptTemplate: `Act as a senior design systems engineer and accessibility consultant.
Text Color: {fgColor}
Background Color: {bgColor}

Provide:
1. Complete WCAG 2.1 Section 508 accessibility compliance audit.
2. 5-shade harmonious design system palette based on this primary color:
   - 50 (lightest tint), 100, 500 (base), 700, 900 (deep shade).
3. Tailwind CSS v4 color token configuration code snippet.
4. If contrast fails, suggest the closest accessible HEX code that preserves original color hue.`,
    howToSteps: [
      { step: 1, title: 'Enter Hex Codes', description: 'Type the foreground text and background color in #HEX format.' },
      { step: 2, title: 'Audit WCAG Ratio', description: 'See whether the pair passes standard AA (4.5:1) and AAA (7.0:1) thresholds.' },
      { step: 3, title: 'Export Palette', description: 'Generate Tailwind CSS tokens and accessible color alternatives.' }
    ],
    faqs: [
      { question: 'What is the minimum WCAG AA contrast ratio?', answer: 'WCAG 2.1 Level AA requires a contrast ratio of at least 4.5:1 for normal body text, and at least 3:1 for large text (18pt or 14pt bold) and user interface components.' }
    ],
    features: [
      'Accurate W3C relative luminance mathematical formula',
      'Instant pass/fail badges for WCAG AA and AAA standards',
      'Tailwind CSS design token generation'
    ]
  },
  {
    id: 'font-pairing',
    slug: 'typography-google-font-pairing-curator',
    aliases: ['font-pairing-generator', 'typography-helper', 'google-fonts-pairing', 'font-combo'],
    number: '98',
    category: 'Development',
    title: 'Typography & Google Font Pairing Curator',
    shortDescription: 'Pair distinctive display headline fonts with readable body text fonts, complete with CSS @import rules and styling scale hierarchies.',
    searchVolumeBadge: 'Web Design & Typography #1',
    accentColor: 'from-indigo-600 to-purple-600',
    badgeColor: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/40',
    iconName: 'Type',
    seoTitle: 'Free Google Font Pairing Generator - Header & Body Typography',
    seoDescription: 'Discover elegant Google Font pairings for modern web design. Pairs display headers with clean body fonts, with CSS imports and Tailwind configs.',
    seoKeywords: [
      'font pairing generator',
      'google font combinations',
      'typography pairings web design',
      'best header and body fonts',
      'free font combinations',
      'editorial font pairing'
    ],
    longTailKeywords: [
      'best google font pairings for luxury modern editorial brand',
      'clean sans serif font combination for tech saas landing page',
      'how to pair serif display header with sans serif body copy',
      'google fonts css import and tailwind fontfamily configuration'
    ],
    longTailUseCases: [
      {
        query: 'Modern editorial brand font pairing: Playfair Display + Plus Jakarta Sans',
        title: 'Editorial / Magazine Typographic Identity',
        summary: 'Pairs high-contrast elegant serif Playfair Display for display headlines with high-legibility geometric sans Plus Jakarta Sans for body text.',
        presetValues: {
          aesthetic: 'editorial',
          headerFont: 'Playfair Display',
          bodyFont: 'Plus Jakarta Sans'
        }
      }
    ],
    presets: [
      { label: 'Modern Editorial (Playfair + Jakarta)', values: { aesthetic: 'editorial', headerFont: 'Playfair Display', bodyFont: 'Plus Jakarta Sans' } },
      { label: 'Tech SaaS (Cabinet Grotesk + Inter)', values: { aesthetic: 'tech', headerFont: 'Space Grotesk', bodyFont: 'Inter' } },
      { label: 'Minimalist Artisan (Syne + Epilogue)', values: { aesthetic: 'minimal', headerFont: 'Syne', bodyFont: 'Epilogue' } }
    ],
    inputs: [
      {
        id: 'aesthetic',
        label: 'Brand Archetype / Mood',
        type: 'select',
        defaultValue: 'editorial',
        options: [
          { label: 'Modern Editorial & Luxury (Serif + Modern Sans)', value: 'editorial' },
          { label: 'High-Tech SaaS & Developer Tool (Clean Sans + Mono)', value: 'tech' },
          { label: 'Artisan & Boutique Creative (Geometric + Humanist)', value: 'minimal' },
          { label: 'Academic & Trustworthy (Classic Serif + Sturdy Sans)', value: 'academic' }
        ]
      },
      { id: 'headerFont', label: 'Primary Header Font', type: 'text', defaultValue: 'Playfair Display' },
      { id: 'bodyFont', label: 'Body Text Font', type: 'text', defaultValue: 'Plus Jakarta Sans' }
    ],
    quickCompute: (vals) => {
      const header = vals.headerFont || 'Playfair Display';
      const body = vals.bodyFont || 'Plus Jakarta Sans';
      const importUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(header)}:wght@600;700&family=${encodeURIComponent(body)}:wght@400;500;600&display=swap`;

      return {
        mainResult: `${header} + ${body}`,
        mainLabel: 'Selected Typographic Pairing',
        secondaryMetrics: [
          { label: 'Header Archetype', value: header },
          { label: 'Body Archetype', value: body },
          { label: 'Google Fonts Link', value: 'Ready to Embed' }
        ],
        summary: `Pairing ${header} for headings with ${body} for body text. Balances high personality headers with optimal reading comfort.`
      };
    },
    aiTaskType: 'code',
    promptTemplate: `Act as a master typographer and creative director.
Aesthetic: {aesthetic}
Header Font: {headerFont}
Body Font: {bodyFont}

Provide:
1. Evaluation of contrast ratio, x-height alignment, and kerning harmony between these two fonts.
2. Complete HTML <link> and CSS @import snippet for Google Fonts.
3. Tailwind CSS theme configuration object (fontFamily: { display: [...], body: [...] }).
4. Complete mathematical type scale (H1 2.5rem, H2 2.0rem, H3 1.5rem, Body 1.0rem) with line-height leading ratios.
5. Two curated alternative pairings that fit the {aesthetic} mood.`,
    howToSteps: [
      { step: 1, title: 'Select Brand Mood', description: 'Choose between editorial luxury, tech SaaS, minimal artisan, or academic.' },
      { step: 2, title: 'Review Pairings', description: 'Inspect recommended header and body font combinations.' },
      { step: 3, title: 'Copy CSS & Embeds', description: 'Copy Google Fonts import links directly into your web stylesheet.' }
    ],
    faqs: [
      { question: 'What is the golden rule of font pairing?', answer: 'Contrast, not conflict. Pair fonts from distinct families (e.g. a serif header with a clean sans-serif body) so their roles are immediately obvious to the reader’s eye.' }
    ],
    features: [
      'Curated pairings adhering to optical contrast principles',
      'One-click Google Fonts @import generation',
      'Tailwind CSS font-family config exports'
    ]
  },
  {
    id: 'intermittent-fasting',
    slug: 'intermittent-fasting-schedule-autophagy-calculator',
    aliases: ['intermittent-fasting-calculator', 'fasting-timer', '16-8-fasting-schedule', 'autophagy-stages'],
    number: '99',
    category: 'Health',
    title: 'Intermittent Fasting Schedule & Autophagy Calculator',
    shortDescription: 'Calculate optimal 16:8, 18:6, or 20:4 fasting and eating windows, plus biological milestones for ketosis, glycogen depletion, and autophagy.',
    searchVolumeBadge: 'Health & Wellness #1',
    accentColor: 'from-emerald-500 to-teal-500',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
    iconName: 'Flame',
    seoTitle: 'Free Intermittent Fasting Schedule Calculator - 16:8, 18:6 & Autophagy',
    seoDescription: 'Plan your intermittent fasting eating windows (16:8, 18:6, OMAD). Track biological stages: blood sugar drop, ketosis, fat burning, and cellular autophagy.',
    seoKeywords: [
      'intermittent fasting calculator',
      '16 8 fasting schedule',
      'autophagy fasting timeline',
      'intermittent fasting eating window',
      'fasting stages calculator',
      'ketosis fasting hours'
    ],
    longTailKeywords: [
      'what happens at 12 16 and 24 hours of fasting biological timeline',
      'best 16 8 intermittent fasting eating schedule for dinner lovers',
      'when does autophagy begin during intermittent fasting scientific research',
      'what drinks break a fast black coffee water electrolytes'
    ],
    longTailUseCases: [
      {
        query: 'I finish dinner at 8:00 PM and want to do a 16:8 fast. When is my eating window?',
        title: 'Classic 16:8 Evening Fast Schedule',
        summary: 'Fasting starts at 8:00 PM. 16-hour fast ends at 12:00 PM (Noon) next day. 8-hour eating window is 12:00 PM to 8:00 PM.',
        presetValues: {
          protocol: '16_8',
          lastMealTime: '20:00'
        }
      }
    ],
    presets: [
      { label: 'Classic 16:8 (Last meal 8:00 PM)', values: { protocol: '16_8', lastMealTime: '20:00' } },
      { label: 'Warrior 20:4 (Last meal 7:00 PM)', values: { protocol: '20_4', lastMealTime: '19:00' } },
      { label: 'Circadian 14:10 Gentle Fast', values: { protocol: '14_10', lastMealTime: '19:30' } }
    ],
    inputs: [
      {
        id: 'protocol',
        label: 'Fasting Protocol',
        type: 'select',
        defaultValue: '16_8',
        options: [
          { label: '16:8 (16 hrs fasting / 8 hrs eating - Most Popular)', value: '16_8' },
          { label: '18:6 (18 hrs fasting / 6 hrs eating - Advanced)', value: '18_6' },
          { label: '20:4 Warrior Diet (20 hrs fasting / 4 hrs eating)', value: '20_4' },
          { label: '14:10 Circadian (Gentle Beginner)', value: '14_10' }
        ]
      },
      { id: 'lastMealTime', label: 'Time You Finish Last Meal (HH:MM)', type: 'text', defaultValue: '20:00' }
    ],
    quickCompute: (vals) => {
      const parts = (vals.lastMealTime || '20:00').split(':').map((x) => parseInt(x, 10));
      const startH = isNaN(parts[0]) ? 20 : parts[0];
      const startM = isNaN(parts[1]) ? 0 : parts[1];

      let fastHours = 16;
      let eatHours = 8;
      if (vals.protocol === '18_6') { fastHours = 18; eatHours = 6; }
      else if (vals.protocol === '20_4') { fastHours = 20; eatHours = 4; }
      else if (vals.protocol === '14_10') { fastHours = 14; eatHours = 10; }

      const endH = (startH + fastHours) % 24;
      const formatTime = (h: number, m: number) => {
        const period = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 === 0 ? 12 : h % 12;
        return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
      };

      const breakFastStr = formatTime(endH, startM);
      const closeWindowH = (endH + eatHours) % 24;
      const closeWindowStr = formatTime(closeWindowH, startM);

      return {
        mainResult: breakFastStr,
        mainLabel: 'Break-Fast Time Next Day',
        secondaryMetrics: [
          { label: 'Eating Window', value: `${breakFastStr} - ${closeWindowStr}` },
          { label: 'Fasting Duration', value: `${fastHours} Hours` },
          { label: 'Ketosis Onset (~12-14 hrs)', value: `Starts ~${formatTime((startH + 12) % 24, startM)}` },
          { label: 'Autophagy Onset (~16-18 hrs)', value: fastHours >= 16 ? `Begins ~${breakFastStr}` : 'Not reached in 14h' }
        ],
        summary: `Finishing dinner at ${formatTime(startH, startM)} means your ${fastHours}-hour fast ends at ${breakFastStr}. Your ${eatHours}-hour eating window is from ${breakFastStr} to ${closeWindowStr}.`
      };
    },
    aiTaskType: 'analysis',
    promptTemplate: `Act as a metabolic science researcher and clinical nutritionist.
Protocol: {protocol}
Last Meal Finished: {lastMealTime}

Provide:
1. Hour-by-Hour Metabolic Timeline:
   - 0-4 hours: Anabolic digestive phase & insulin spike.
   - 4-12 hours: Catabolic glycogen depletion & blood sugar stabilization.
   - 12-16 hours: Ketosis onset & fat oxidation acceleration.
   - 16-24 hours: Cellular autophagy & cellular cleanup mechanisms.
2. What technically breaks a fast: Zero-calorie drinks, black coffee, green tea, electrolyte salts, stevia vs monk fruit.
3. Safe breaking-the-fast protocol (avoiding glycemic spikes, gentle proteins vs healthy fats).
4. Contraindications and safety guidelines (who should never practice intermittent fasting).`,
    howToSteps: [
      { step: 1, title: 'Choose Fasting Protocol', description: 'Select 16:8, 18:6, or beginner 14:10 schedule.' },
      { step: 2, title: 'Enter Dinner Completion Time', description: 'Type the time you finish your final meal of the day.' },
      { step: 3, title: 'View Eating Window & Milestones', description: 'See your exact break-fast time and biological autophagy stages.' }
    ],
    faqs: [
      { question: 'What is autophagy in intermittent fasting?', answer: 'Autophagy is the body’s cellular recycling process where damaged cells, malformed proteins, and dysfunctional mitochondria are broken down and renewed. It generally accelerates around 16 to 24 hours of fasting.' }
    ],
    features: [
      'Calculates exact clock times for breaking fast and closing feeding windows',
      'Biological milestone stages (ketosis, glycogen depletion, autophagy)',
      'Allowed zero-calorie liquids and break-fast nutrition guidance'
    ]
  },
  {
    id: 'ovulation-cycle',
    slug: 'ovulation-fertile-window-menstrual-cycle-calculator',
    aliases: ['ovulation-calculator', 'fertile-window-calculator', 'menstrual-cycle-calculator', 'conception-calculator'],
    number: '100',
    category: 'Health',
    title: 'Ovulation & Fertile Window Cycle Calculator',
    shortDescription: 'Estimate your upcoming ovulation date, peak fertile conception window, next menstrual period, and estimated due date.',
    searchVolumeBadge: 'Women’s Health & Family Planning #1',
    accentColor: 'from-pink-500 to-rose-400',
    badgeColor: 'text-pink-400 border-pink-500/30 bg-pink-950/40',
    iconName: 'Calendar',
    seoTitle: 'Free Ovulation Calculator - Fertile Window & Menstrual Cycle',
    seoDescription: 'Calculate your peak fertile window, estimated ovulation day, next period, and pregnancy due date based on your average menstrual cycle length.',
    seoKeywords: [
      'ovulation calculator',
      'fertile window calculator',
      'menstrual cycle calculator',
      'when do i ovulate',
      'conception calculator',
      'period tracker online'
    ],
    longTailKeywords: [
      'how to calculate ovulation day with 28 day menstrual cycle',
      'what are the 6 days of the fertile window before ovulation',
      'sperm survival lifespan up to 5 days in cervical mucus',
      'calculate pregnancy due date based on conception and last period lmp'
    ],
    longTailUseCases: [
      {
        query: 'Last period started on September 1, with an average 28-day cycle length',
        title: 'Natural Conception Timing',
        summary: 'Estimated ovulation occurs on Day 14 (September 15). The 6-day fertile window runs from September 10 to September 15.',
        presetValues: {
          lastPeriodDate: '2026-09-01',
          cycleLength: '28'
        }
      }
    ],
    presets: [
      { label: 'Standard 28-Day Cycle', values: { lastPeriodDate: '2026-09-01', cycleLength: '28' } },
      { label: 'Short 24-Day Cycle', values: { lastPeriodDate: '2026-09-05', cycleLength: '24' } },
      { label: 'Long 32-Day Cycle', values: { lastPeriodDate: '2026-08-28', cycleLength: '32' } }
    ],
    inputs: [
      { id: 'lastPeriodDate', label: 'First Day of Last Period (YYYY-MM-DD)', type: 'text', defaultValue: '2026-09-01' },
      { id: 'cycleLength', label: 'Average Cycle Length (Days)', type: 'number', defaultValue: '28', helperText: 'Typically between 21 and 35 days (average is 28)' }
    ],
    quickCompute: (vals) => {
      const lmp = new Date(vals.lastPeriodDate || '2026-09-01');
      const cycle = parseInt(vals.cycleLength || '28', 10);

      if (isNaN(lmp.getTime())) return { error: 'Please enter a valid date in YYYY-MM-DD format.' };

      // Ovulation typically occurs 14 days before next period
      const ovulationDayOffset = cycle - 14;
      const ovulationDate = new Date(lmp.getTime() + ovulationDayOffset * 24 * 60 * 60 * 1000);
      const fertileStart = new Date(ovulationDate.getTime() - 5 * 24 * 60 * 60 * 1000);
      const nextPeriod = new Date(lmp.getTime() + cycle * 24 * 60 * 60 * 1000);

      // Naegele's rule for pregnancy due date: LMP + 280 days
      const dueDate = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);

      const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      return {
        mainResult: fmt(ovulationDate),
        mainLabel: 'Estimated Ovulation Day',
        secondaryMetrics: [
          { label: 'Peak Fertile Window', value: `${fmt(fertileStart)} – ${fmt(ovulationDate)}` },
          { label: 'Next Expected Period', value: fmt(nextPeriod) },
          { label: 'Estimated Due Date (If Conceived)', value: fmt(dueDate) },
          { label: 'Luteal Phase Assumption', value: '14 Days Standard' }
        ],
        summary: `For a ${cycle}-day cycle starting on ${fmt(lmp)}: Ovulation is estimated on ${fmt(ovulationDate)}. Your peak fertile window spans from ${fmt(fertileStart)} to ${fmt(ovulationDate)}.`
      };
    },
    aiTaskType: 'creative',
    promptTemplate: `Act as an OB-GYN and reproductive endocrinology specialist.
First Day of Last Period: {lastPeriodDate}
Cycle Length: {cycleLength} days

Provide:
1. Complete biological cycle timeline (Follicular phase, LH luteinizing hormone surge, Ovulation, Luteal phase).
2. Physical ovulation biomarkers to track (Cervical mucus egg-white consistency, Basal Body Temperature BBT thermal shift, ovulation test strips).
3. Conception probability curve across the 6-day fertile window (highest on O-2, O-1, and Ovulation day due to sperm longevity).
4. Clinical guidance on when to consult a fertility specialist (e.g. over 35 after 6 months vs under 35 after 12 months).`,
    howToSteps: [
      { step: 1, title: 'Enter Period Date', description: 'Select the first day of your most recent menstrual bleed.' },
      { step: 2, title: 'Set Average Cycle Length', description: 'Enter the typical number of days from one period start to the next.' },
      { step: 3, title: 'View Fertile Window & Due Date', description: 'See your peak fertile days and estimated pregnancy due date.' }
    ],
    faqs: [
      { question: 'Why is the fertile window 6 days long if the egg only survives 24 hours?', answer: 'While an unfertilized ovum (egg) survives only 12 to 24 hours after release, healthy sperm can survive up to 5 days in fertile cervical fluid. Intercourse during the 5 days leading up to ovulation can result in conception.' }
    ],
    features: [
      'Standard clinical 14-day luteal phase calculation',
      '6-day biological fertile window based on sperm longevity',
      'Naegele’s Rule estimated delivery due date calculation'
    ]
  }
];
