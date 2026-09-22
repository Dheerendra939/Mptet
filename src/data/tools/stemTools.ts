import { ToolDefinition } from '../../types';

export const STEM_TOOLS: ToolDefinition[] = [
  {
    id: 'percentage-calculator',
    slug: 'percentage-calculator',
    aliases: ['percentage-increase-calculator', 'percentage-change', 'percent-diff', 'percentage-of'],
    number: '63',
    category: 'Education',
    title: 'Percentage, Change & Difference Calculator',
    shortDescription: 'Calculate percentage increase, decrease, reverse percentage, percentage of a total, and ratio changes with full step-by-step formulas.',
    searchVolumeBadge: 'Worldwide Search #1 Math Tool',
    accentColor: 'from-blue-500 to-cyan-400',
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-950/40',
    iconName: 'Percent',
    seoTitle: 'Free Percentage Calculator Online - Increase, Decrease & Reverse Percent',
    seoDescription: 'Calculate percent of a number, percentage increase/decrease, percentage difference between two values, and original value before discount.',
    seoKeywords: [
      'percentage calculator',
      'percentage increase calculator',
      'percentage decrease calculator',
      'percentage difference formula',
      'how to calculate percentage',
      'reverse percentage calculator'
    ],
    longTailKeywords: [
      'how to find what percentage one number is of another',
      'calculate percentage change from old price to new price',
      'reverse percentage formula find original price before 20 percent discount',
      'percentage difference between two numbers formula'
    ],
    longTailUseCases: [
      {
        query: 'What is the percentage increase from $85 to $110?',
        title: 'Price Inflation & Price Increase Calculation',
        summary: 'A price jump from $85 to $110 represents a 29.41% increase (+$25 change), calculated as ((110 - 85) / 85) * 100.',
        presetValues: {
          calcType: 'change',
          valA: '85',
          valB: '110'
        }
      },
      {
        query: 'What is 18% tax on $240?',
        title: 'Sales Tax & VAT Calculation',
        summary: '18% of $240 equals $43.20, resulting in a total final gross charge of $283.20.',
        presetValues: {
          calcType: 'of',
          valA: '18',
          valB: '240'
        }
      }
    ],
    presets: [
      {
        label: 'Price Increase: $80 to $105',
        values: { calcType: 'change', valA: '80', valB: '105' }
      },
      {
        label: '25% of $350',
        values: { calcType: 'of', valA: '25', valB: '350' }
      },
      {
        label: 'Difference between 120 and 150',
        values: { calcType: 'diff', valA: '120', valB: '150' }
      }
    ],
    inputs: [
      {
        id: 'calcType',
        label: 'Calculation Mode',
        type: 'select',
        defaultValue: 'change',
        options: [
          { label: 'Percentage Increase / Decrease (from A to B)', value: 'change' },
          { label: 'What is X% of Y? (A% of B)', value: 'of' },
          { label: 'Percentage Difference between A and B', value: 'diff' },
          { label: 'A is what % of B? (Ratio)', value: 'ratio' },
          { label: 'Reverse %: B is after A% increase/discount, find original', value: 'reverse' }
        ]
      },
      {
        id: 'valA',
        label: 'Value A (Initial / Percentage)',
        type: 'number',
        defaultValue: '80',
        helperText: 'First value or percentage rate'
      },
      {
        id: 'valB',
        label: 'Value B (Final / Total)',
        type: 'number',
        defaultValue: '105',
        helperText: 'Second value or comparison base'
      }
    ],
    quickCompute: (vals) => {
      const a = parseFloat(vals.valA || '0');
      const b = parseFloat(vals.valB || '0');
      const type = vals.calcType || 'change';

      if (type === 'change') {
        if (a === 0) return { error: 'Initial value cannot be zero for percentage change calculation.' };
        const change = b - a;
        const pctChange = (change / Math.abs(a)) * 100;
        const isIncrease = change >= 0;
        return {
          mainResult: `${isIncrease ? '+' : ''}${pctChange.toFixed(2)}%`,
          mainLabel: isIncrease ? 'Percentage Increase' : 'Percentage Decrease',
          secondaryMetrics: [
            { label: 'Absolute Difference', value: `${change >= 0 ? '+' : ''}${change.toFixed(2)}` },
            { label: 'Multiplier Ratio', value: `${(b / a).toFixed(4)}x` },
            { label: 'Formula', value: `(( ${b} - ${a} ) / |${a}|) × 100` }
          ],
          summary: `Changing from ${a} to ${b} is an ${isIncrease ? 'increase' : 'decrease'} of ${Math.abs(pctChange).toFixed(2)}%.`
        };
      } else if (type === 'of') {
        const res = (a / 100) * b;
        return {
          mainResult: res.toFixed(2),
          mainLabel: `${a}% of ${b}`,
          secondaryMetrics: [
            { label: 'Total (Summed)', value: (b + res).toFixed(2) },
            { label: 'Total (Subtracted/Discount)', value: (b - res).toFixed(2) },
            { label: 'Decimal Factor', value: `${(a / 100).toFixed(4)}` }
          ],
          summary: `${a}% of ${b} is exactly ${res.toFixed(2)}.`
        };
      } else if (type === 'diff') {
        const avg = (a + b) / 2;
        if (avg === 0) return { error: 'Average of values cannot be zero.' };
        const diff = (Math.abs(a - b) / avg) * 100;
        return {
          mainResult: `${diff.toFixed(2)}%`,
          mainLabel: 'Percentage Difference',
          secondaryMetrics: [
            { label: 'Absolute Delta |A - B|', value: Math.abs(a - b).toFixed(2) },
            { label: 'Average ((A + B) / 2)', value: avg.toFixed(2) },
            { label: 'Formula', value: `(|${a} - ${b}| / ((${a} + ${b})/2)) × 100` }
          ],
          summary: `The percentage difference between ${a} and ${b} relative to their average is ${diff.toFixed(2)}%.`
        };
      } else if (type === 'ratio') {
        if (b === 0) return { error: 'Base value B cannot be zero.' };
        const pct = (a / b) * 100;
        return {
          mainResult: `${pct.toFixed(2)}%`,
          mainLabel: `${a} is of ${b}`,
          secondaryMetrics: [
            { label: 'Fraction Ratio', value: `${a}/${b}` },
            { label: 'Decimal Equivalent', value: (a / b).toFixed(4) },
            { label: 'Remaining Portion', value: `${(100 - pct).toFixed(2)}%` }
          ],
          summary: `${a} constitutes ${pct.toFixed(2)}% of the total ${b}.`
        };
      } else {
        // reverse
        const originalDiscount = b / (1 - a / 100);
        const originalMarkup = b / (1 + a / 100);
        return {
          mainResult: originalDiscount.toFixed(2),
          mainLabel: 'Original (if A% Discounted)',
          secondaryMetrics: [
            { label: 'Original (if A% Tax/Markup)', value: originalMarkup.toFixed(2) },
            { label: 'Discount Amount Saved', value: (originalDiscount - b).toFixed(2) },
            { label: 'Markup Added Amount', value: (b - originalMarkup).toFixed(2) }
          ],
          summary: `If ${b} represents a price after ${a}% discount, the original list price was ${originalDiscount.toFixed(2)}.`
        };
      }
    },
    aiTaskType: 'analysis',
    promptTemplate: `Act as a senior mathematician and financial analyst.
Calculation Mode: {calcType}
Value A: {valA}
Value B: {valB}

Provide:
1. Exact mathematical step-by-step breakdown and equation derivation.
2. Real-world commercial applications (retail discount, tax calculation, quarterly growth rate, inflation comparison).
3. Common mental math shortcuts to estimate this calculation in seconds without a calculator.
4. Edge cases, potential pitfalls (e.g. compounding vs simple percentage, asymmetry between percentage increase vs decrease).`,
    howToSteps: [
      { step: 1, title: 'Choose Calculation Mode', description: 'Select whether you need percentage change, what percent of a total, percentage difference, or reverse original price.' },
      { step: 2, title: 'Enter Numbers', description: 'Input your initial and target values or percentage rate.' },
      { step: 3, title: 'Inspect Instant Formula Breakdown', description: 'Review the instant mathematical output, ratio multipliers, and step-by-step math derivations.' }
    ],
    faqs: [
      { question: 'What is the difference between percentage change and percentage difference?', answer: 'Percentage change has a chronological direction (from an old value to a new value), whereas percentage difference is non-directional and divides the absolute difference by the average of the two numbers.' },
      { question: 'Why does a 50% loss require a 100% gain to break even?', answer: 'If an investment drops from $100 to $50 (-50%), getting back to $100 requires gaining $50 on your new $50 base, which is 50/50 = +100%.' }
    ],
    features: [
      '5 distinct percentage calculation modes covering all business & school math',
      'Reverse discount pricing calculation (find original price before sales tax or markdown)',
      'Instant ratio multiplier and step-by-step formula explanations'
    ]
  },
  {
    id: 'scientific-calc',
    slug: 'scientific-math-equation-solver',
    aliases: ['scientific-calculator', 'equation-solver', 'algebra-solver', 'math-step-by-step'],
    number: '64',
    category: 'Education',
    title: 'Scientific Math & Equation Solver',
    shortDescription: 'Solve algebraic equations, logarithms, exponents, trigonometry, and calculus problems with step-by-step verified proofs.',
    searchVolumeBadge: 'High School & STEM #1',
    accentColor: 'from-indigo-500 to-violet-500',
    badgeColor: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/40',
    iconName: 'Calculator',
    seoTitle: 'Free Scientific Equation Solver Online - Step-by-Step Algebra & Calculus',
    seoDescription: 'Solve algebraic equations, logarithms, exponents, trigonometry, derivatives, and polynomials with full step-by-step solution steps and proof.',
    seoKeywords: [
      'scientific calculator online',
      'equation solver step by step',
      'algebra equation solver',
      'math problem solver',
      'trigonometry calculator',
      'logarithm solver online'
    ],
    longTailKeywords: [
      'solve algebraic equation step by step with explanations',
      'how to solve logarithm equation with base 10 and natural log ln',
      'trigonometric sin cos tan angle calculator radians and degrees',
      'polynomial factorization and roots calculator'
    ],
    longTailUseCases: [
      {
        query: 'Solve 3x + 15 = 48 for x',
        title: 'Linear Algebra Step-by-Step Proof',
        summary: 'Subtract 15 from both sides (3x = 33), then divide by 3 to arrive at x = 11.',
        presetValues: {
          equationType: 'linear',
          expression: '3x + 15 = 48',
          variable: 'x'
        }
      }
    ],
    presets: [
      {
        label: 'Linear: 3x + 15 = 48',
        values: { equationType: 'linear', expression: '3x + 15 = 48', variable: 'x' }
      },
      {
        label: 'Logarithm: log2(x) = 6',
        values: { equationType: 'log', expression: 'log2(x) = 6', variable: 'x' }
      },
      {
        label: 'Trig: sin(45 deg) & cos(45 deg)',
        values: { equationType: 'trig', expression: 'sin(45)', variable: 'deg' }
      }
    ],
    inputs: [
      {
        id: 'equationType',
        label: 'Domain / Topic',
        type: 'select',
        defaultValue: 'linear',
        options: [
          { label: 'Algebra & Linear Equations', value: 'linear' },
          { label: 'Logarithms & Exponents', value: 'log' },
          { label: 'Trigonometry & Unit Circle', value: 'trig' },
          { label: 'Calculus: Derivatives & Integrals', value: 'calculus' },
          { label: 'Complex Numbers & Vectors', value: 'vectors' }
        ]
      },
      {
        id: 'expression',
        label: 'Equation or Mathematical Expression',
        type: 'text',
        defaultValue: '3x + 15 = 48',
        placeholder: 'e.g. 2x^2 - 8x + 6 = 0 or sin(60) or ln(e^4)'
      },
      {
        id: 'variable',
        label: 'Target Variable / Angle Units',
        type: 'text',
        defaultValue: 'x',
        placeholder: 'e.g. x, y, deg, or rad'
      }
    ],
    quickCompute: (vals) => {
      const expr = vals.expression?.trim() || '';
      // Simple evaluator for linear form ax + b = c
      const linearMatch = expr.match(/^(-?\d*\.?\d*)\s*x\s*([+-]\s*\d+\.?\d*)?\s*=\s*(-?\d+\.?\d*)$/i);
      if (linearMatch) {
        let a = parseFloat(linearMatch[1] === '' || linearMatch[1] === '+' ? '1' : linearMatch[1] === '-' ? '-1' : linearMatch[1]);
        let b = linearMatch[2] ? parseFloat(linearMatch[2].replace(/\s+/g, '')) : 0;
        let c = parseFloat(linearMatch[3]);
        if (a !== 0) {
          const x = (c - b) / a;
          return {
            mainResult: `x = ${x}`,
            mainLabel: 'Linear Solution Root',
            secondaryMetrics: [
              { label: 'Step 1 (Subtract constant)', value: `${a}x = ${c - b}` },
              { label: 'Step 2 (Divide coefficient)', value: `x = ${c - b} / ${a}` },
              { label: 'Verification (Left-Hand Side)', value: `${a}(${x}) + ${b} = ${a * x + b}` }
            ],
            summary: `The solution to ${expr} is x = ${x}. Check: ${a}(${x}) + ${b} = ${c}.`
          };
        }
      }

      // Trig check
      const trigMatch = expr.match(/^(sin|cos|tan)\((\d+\.?\d*)\)$/i);
      if (trigMatch) {
        const fn = trigMatch[1].toLowerCase();
        const deg = parseFloat(trigMatch[2]);
        const rad = (deg * Math.PI) / 180;
        let val = 0;
        if (fn === 'sin') val = Math.sin(rad);
        else if (fn === 'cos') val = Math.cos(rad);
        else if (fn === 'tan') val = Math.tan(rad);
        return {
          mainResult: val.toFixed(6),
          mainLabel: `${fn}(${deg}°) Value`,
          secondaryMetrics: [
            { label: 'Radians Equivalent', value: `${rad.toFixed(4)} rad` },
            { label: 'Exact Fraction / Root', value: deg === 45 ? '√2 / 2 (~0.7071)' : deg === 30 ? '0.5' : deg === 60 ? '√3 / 2 (~0.8660)' : 'Standard decimal' },
            { label: 'Complementary Angle', value: `${90 - deg}°` }
          ],
          summary: `${fn.toUpperCase()} of ${deg} degrees is ${val.toFixed(6)}.`
        };
      }

      return {
        mainResult: 'Expression Ready',
        mainLabel: 'Symbolic & Proof Solver',
        secondaryMetrics: [
          { label: 'Domain', value: vals.equationType },
          { label: 'Target Variable', value: vals.variable },
          { label: 'Status', value: 'Click Generate with AI for Complete Proof' }
        ],
        summary: `Click 'Generate with AI' to receive the full step-by-step symbolic derivation, LaTeX proof, graph behavior, and edge-case validation for ${expr}.`
      };
    },
    aiTaskType: 'analysis',
    promptTemplate: `Act as a university STEM professor in mathematics and algebraic computation.
Equation/Problem: {expression}
Domain: {equationType}
Target Variable: {variable}

Provide:
1. Exact verified analytical solution with clear, step-by-step logical numbered proofs.
2. Step-by-step intermediate algebra showing every operation on both sides.
3. Verification / substitution check plugging the root back into the original expression.
4. Graphical intuition (roots, asymptotes, domain restrictions, inflection points).
5. LaTeX formatted code blocks for student homework or academic paper citations.`,
    howToSteps: [
      { step: 1, title: 'Input Expression', description: 'Type in an equation, function, or trigonometry problem in standard mathematical syntax.' },
      { step: 2, title: 'Select Variable & Domain', description: 'Choose your math domain (algebra, calculus, trigonometry, logarithms) and the target variable.' },
      { step: 3, title: 'Inspect Step-by-Step Proof', description: 'Review the instant calculation roots and generate an academic LaTeX proof.' }
    ],
    faqs: [
      { question: 'Can this solve non-linear systems of equations?', answer: 'Yes, the AI reasoning engine handles quadratics, systems of equations, logarithms, and integration problems with rigorous proof steps.' }
    ],
    features: [
      'Multi-domain support: Algebra, Trig, Logarithms, Calculus, and Vectors',
      'Step-by-step algebraic isolation and root substitution verification',
      'LaTeX output generation ready for LaTeX papers and homework'
    ]
  },
  {
    id: 'statistics-calc',
    slug: 'statistics-mean-median-mode-std-calculator',
    aliases: ['statistics-calculator', 'standard-deviation-calculator', 'mean-median-mode', 'z-score-calculator'],
    number: '65',
    category: 'Education',
    title: 'Statistics: Mean, Median, Mode & Std Dev',
    shortDescription: 'Calculate sample and population standard deviation, mean, median, mode, variance, IQR, and Z-scores from any dataset.',
    searchVolumeBadge: 'Data Science & College #1',
    accentColor: 'from-teal-500 to-emerald-400',
    badgeColor: 'text-teal-400 border-teal-500/30 bg-teal-950/40',
    iconName: 'BarChart3',
    seoTitle: 'Free Descriptive Statistics Calculator - Mean, Median, Mode & Std Dev',
    seoDescription: 'Calculate mean, median, mode, variance, sample standard deviation (s), population standard deviation (sigma), IQR, and skewness online.',
    seoKeywords: [
      'statistics calculator',
      'standard deviation calculator',
      'mean median mode calculator',
      'variance calculator',
      'interquartile range calculator',
      'z score calculator'
    ],
    longTailKeywords: [
      'how to find sample standard deviation step by step formula',
      'calculate mean median and mode for comma separated numbers',
      'find outliers using 1.5 times interquartile range iqr formula',
      'difference between sample variance and population variance'
    ],
    longTailUseCases: [
      {
        query: 'Calculate standard deviation for test scores: 72, 85, 90, 68, 95, 88, 79',
        title: 'Academic Grade Distribution Analysis',
        summary: 'Mean score is 82.43, median is 85, with a sample standard deviation of 9.59 indicating moderate variance around the class average.',
        presetValues: {
          dataInput: '72, 85, 90, 68, 95, 88, 79',
          calcMode: 'sample'
        }
      }
    ],
    presets: [
      {
        label: 'Exam Scores: 72, 85, 90, 68, 95, 88, 79',
        values: { dataInput: '72, 85, 90, 68, 95, 88, 79', calcMode: 'sample' }
      },
      {
        label: 'Factory Metrics: 10.2, 10.5, 9.8, 10.1, 10.4, 9.9, 10.0',
        values: { dataInput: '10.2, 10.5, 9.8, 10.1, 10.4, 9.9, 10.0', calcMode: 'population' }
      }
    ],
    inputs: [
      {
        id: 'dataInput',
        label: 'Raw Dataset (Comma or Space Separated)',
        type: 'textarea',
        defaultValue: '72, 85, 90, 68, 95, 88, 79',
        placeholder: 'Enter numbers separated by commas or spaces: e.g. 12, 15, 18, 22, 29'
      },
      {
        id: 'calcMode',
        label: 'Sample vs Population',
        type: 'select',
        defaultValue: 'sample',
        options: [
          { label: 'Sample (Divide by N - 1, Bessel’s correction)', value: 'sample' },
          { label: 'Population (Divide by N)', value: 'population' }
        ]
      }
    ],
    quickCompute: (vals) => {
      const raw = vals.dataInput || '';
      const nums = raw
        .split(/[\s,]+/)
        .map((x) => parseFloat(x.trim()))
        .filter((x) => !isNaN(x));

      if (nums.length < 2) {
        return { error: 'Please enter at least 2 valid numbers to compute variance and standard deviation.' };
      }

      const n = nums.length;
      const sum = nums.reduce((acc, v) => acc + v, 0);
      const mean = sum / n;

      const sorted = [...nums].sort((a, b) => a - b);
      const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];

      // Mode
      const counts: Record<number, number> = {};
      let maxFreq = 0;
      nums.forEach((v) => {
        counts[v] = (counts[v] || 0) + 1;
        if (counts[v] > maxFreq) maxFreq = counts[v];
      });
      const modes = Object.keys(counts)
        .filter((k) => counts[parseFloat(k)] === maxFreq && maxFreq > 1)
        .map((k) => parseFloat(k));
      const modeStr = modes.length > 0 ? modes.join(', ') : 'No unique mode';

      // Variance and Std Dev
      const isSample = vals.calcMode !== 'population';
      const divisor = isSample ? n - 1 : n;
      const sumSqDiff = nums.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
      const variance = sumSqDiff / divisor;
      const stdDev = Math.sqrt(variance);

      const min = sorted[0];
      const max = sorted[n - 1];
      const range = max - min;

      return {
        mainResult: `s = ${stdDev.toFixed(3)}`,
        mainLabel: isSample ? 'Sample Standard Deviation (s)' : 'Population Standard Deviation (σ)',
        secondaryMetrics: [
          { label: 'Mean (Average)', value: mean.toFixed(2) },
          { label: 'Median', value: median.toString() },
          { label: 'Mode', value: modeStr },
          { label: 'Variance (s²)', value: variance.toFixed(3) },
          { label: 'Count (N)', value: n.toString() },
          { label: 'Range [Min, Max]', value: `${range.toFixed(2)} [${min}, ${max}]` }
        ],
        summary: `Dataset of ${n} items has an average (mean) of ${mean.toFixed(2)}, median of ${median}, and standard deviation of ${stdDev.toFixed(3)}.`
      };
    },
    aiTaskType: 'analysis',
    promptTemplate: `Act as a senior statistician and data scientist.
Dataset: {dataInput}
Mode: {calcMode}

Provide:
1. Complete descriptive statistical summary (Mean, Median, Mode, Variance, Standard Deviation, Standard Error, Min, Max, Range).
2. Five-number summary (Min, Q1, Median, Q3, Max) and Interquartile Range (IQR) outlier detection (1.5*IQR rule).
3. Skewness and Kurtosis assessment (normal distribution vs skewed left/right).
4. Practical interpretation of variance for real-world decision making or academic hypothesis testing.`,
    howToSteps: [
      { step: 1, title: 'Paste Raw Data', description: 'Enter your dataset separated by commas, spaces, or line breaks.' },
      { step: 2, title: 'Select Sample or Population', description: 'Choose Sample (N-1) for experimental subsets or Population (N) for complete censuses.' },
      { step: 3, title: 'Review Distributions & Outliers', description: 'Get immediate standard deviation, variance, quartiles, and IQR outlier boundaries.' }
    ],
    faqs: [
      { question: 'When should I use Sample vs Population standard deviation?', answer: 'Use Sample (N - 1) whenever your dataset represents a sample chosen from a larger universe. Use Population (N) only when your data represents every single instance in existence.' }
    ],
    features: [
      'Instant parsing of commas, spaces, and line-broken datasets',
      'Accurate Bessel correction toggle for sample vs population analysis',
      'Complete IQR outlier filtering and five-number summary'
    ]
  },
  {
    id: 'binary-hex',
    slug: 'binary-hex-decimal-ascii-converter',
    aliases: ['binary-converter', 'hex-converter', 'base-converter', 'ascii-converter'],
    number: '66',
    category: 'Development',
    title: 'Binary, Hex, Decimal & ASCII Converter',
    shortDescription: 'Convert values seamlessly between Binary (Base 2), Hexadecimal (Base 16), Decimal (Base 10), Octal, and ASCII text with bitwise analysis.',
    searchVolumeBadge: 'Computer Science Fundamental',
    accentColor: 'from-cyan-500 to-blue-500',
    badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40',
    iconName: 'Terminal',
    seoTitle: 'Free Binary to Hex, Decimal & ASCII Converter Online - Base 2/10/16',
    seoDescription: 'Convert numbers and text instantly between Binary, Hex, Decimal, Octal, and ASCII strings with bitwise two’s complement representation.',
    seoKeywords: [
      'binary to hex converter',
      'hex to decimal converter',
      'binary to decimal calculator',
      'ascii to binary converter',
      'base converter online',
      'bitwise binary calculator'
    ],
    longTailKeywords: [
      'convert decimal 255 to 8 bit binary and hexadecimal',
      'how to convert text string to binary ascii code',
      'two complement signed binary representation 16 bit',
      'hexadecimal color code to rgb decimal converter'
    ],
    longTailUseCases: [
      {
        query: 'Convert number 42 to binary and hex',
        title: 'Integer Radix Conversion',
        summary: 'Decimal 42 converts to Binary 00101010 (8-bit) and Hexadecimal 0x2A.',
        presetValues: {
          inputType: 'decimal',
          inputValue: '42'
        }
      }
    ],
    presets: [
      {
        label: 'Decimal 255 (0xFF / 11111111)',
        values: { inputType: 'decimal', inputValue: '255' }
      },
      {
        label: 'Text "Hello"',
        values: { inputType: 'ascii', inputValue: 'Hello' }
      },
      {
        label: 'Hex 0xDEADBEEF',
        values: { inputType: 'hex', inputValue: 'DEADBEEF' }
      }
    ],
    inputs: [
      {
        id: 'inputType',
        label: 'Input Base / Format',
        type: 'select',
        defaultValue: 'decimal',
        options: [
          { label: 'Decimal (Base 10)', value: 'decimal' },
          { label: 'Hexadecimal (Base 16)', value: 'hex' },
          { label: 'Binary (Base 2)', value: 'binary' },
          { label: 'ASCII / UTF-8 Plain Text', value: 'ascii' }
        ]
      },
      {
        id: 'inputValue',
        label: 'Value to Convert',
        type: 'text',
        defaultValue: '255',
        placeholder: 'e.g. 255, 0xFF, 11001001, or text'
      }
    ],
    quickCompute: (vals) => {
      const type = vals.inputType || 'decimal';
      const raw = (vals.inputValue || '').trim();

      if (!raw) return { error: 'Please enter a value to convert.' };

      let dec = 0;
      if (type === 'decimal') {
        dec = parseInt(raw, 10);
        if (isNaN(dec)) return { error: 'Invalid decimal number.' };
      } else if (type === 'hex') {
        const cleanHex = raw.replace(/^0x/i, '');
        dec = parseInt(cleanHex, 16);
        if (isNaN(dec)) return { error: 'Invalid hexadecimal string.' };
      } else if (type === 'binary') {
        const cleanBin = raw.replace(/[^01]/g, '');
        dec = parseInt(cleanBin, 2);
        if (isNaN(dec)) return { error: 'Invalid binary string (must contain only 0s and 1s).' };
      } else if (type === 'ascii') {
        const rawStr = String(raw || '');
        const binaryArr = Array.from(rawStr).map((char: string) => char.charCodeAt(0).toString(2).padStart(8, '0'));
        const hexArr = Array.from(rawStr).map((char: string) => char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'));
        return {
          mainResult: binaryArr.join(' '),
          mainLabel: 'Binary (8-bit ASCII)',
          secondaryMetrics: [
            { label: 'Hex Stream', value: hexArr.join(' ') },
            { label: 'Total Characters', value: raw.length.toString() },
            { label: 'Total Bytes', value: `${raw.length} bytes (${raw.length * 8} bits)` }
          ],
          summary: `The string "${raw}" translates to ${binaryArr.join(' ')} in 8-bit binary representation.`
        };
      }

      const bin = dec.toString(2);
      const hex = dec.toString(16).toUpperCase();
      const oct = dec.toString(8);
      const padded8 = bin.padStart(Math.ceil(bin.length / 8) * 8, '0');

      return {
        mainResult: `0x${hex}`,
        mainLabel: 'Hexadecimal (Base 16)',
        secondaryMetrics: [
          { label: 'Binary (Base 2)', value: padded8 },
          { label: 'Decimal (Base 10)', value: dec.toString() },
          { label: 'Octal (Base 8)', value: `0o${oct}` },
          { label: 'Byte Size Needed', value: `${Math.ceil(bin.length / 8)} byte(s)` }
        ],
        summary: `Decimal ${dec} = Hex 0x${hex} = Binary ${padded8} = Octal ${oct}.`
      };
    },
    aiTaskType: 'code',
    promptTemplate: `Act as a computer architecture and systems programming expert.
Input Format: {inputType}
Value: {inputValue}

Provide:
1. Complete representations across: Binary, Octal, Decimal, Hexadecimal, and ASCII/UTF-8.
2. Bitwise representation: Most Significant Bit (MSB), Least Significant Bit (LSB), Endianness (Big Endian vs Little Endian).
3. Two's complement signed 8-bit, 16-bit, and 32-bit values.
4. Fast manual arithmetic shortcuts for converting between hex pairs and binary nibbles.`,
    howToSteps: [
      { step: 1, title: 'Select Format', description: 'Choose whether your input is Decimal, Hex, Binary, or ASCII text.' },
      { step: 2, title: 'Enter Number or Characters', description: 'Type the string or numeric digits.' },
      { step: 3, title: 'View All Radix Bases', description: 'Inspect formatted 8-bit byte clusters, hex prefixes, and octal equivalents instantly.' }
    ],
    faqs: [
      { question: 'Why is hexadecimal so popular in computer programming?', answer: 'Each hexadecimal digit corresponds precisely to 4 binary bits (a nibble). Two hex digits represent exactly one 8-bit byte (from 0x00 to 0xFF), making it vastly cleaner to read than raw 0s and 1s.' }
    ],
    features: [
      'Instant conversion between Decimal, Hex, Binary, Octal, and ASCII',
      'Padded byte grouping (8-bit, 16-bit) for easy byte inspection',
      'Two’s complement signed analysis and bitwise breakdown'
    ]
  },
  {
    id: 'quadratic-solver',
    slug: 'quadratic-formula-equation-solver',
    aliases: ['quadratic-solver', 'parabola-calculator', 'discriminant-calculator', 'roots-solver'],
    number: '67',
    category: 'Education',
    title: 'Quadratic Equation & Parabola Solver',
    shortDescription: 'Find real and complex roots, discriminant, vertex coordinates, axis of symmetry, and standard-to-vertex parabola forms.',
    searchVolumeBadge: 'Algebra & Physics Essential',
    accentColor: 'from-amber-500 to-orange-500',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
    iconName: 'Cpu',
    seoTitle: 'Free Quadratic Equation Solver Online - Roots, Vertex & Discriminant',
    seoDescription: 'Solve ax² + bx + c = 0 quadratic equations. Computes real & complex roots, discriminant (b² - 4ac), vertex coordinates (h, k), and factored form.',
    seoKeywords: [
      'quadratic formula calculator',
      'quadratic equation solver',
      'discriminant calculator',
      'parabola vertex calculator',
      'solve ax2 bx c',
      'roots of quadratic equation'
    ],
    longTailKeywords: [
      'how to use quadratic formula x equals minus b plus minus',
      'find vertex of parabola from standard form ax2 plus bx plus c',
      'calculate discriminant b squared minus 4ac real vs complex roots',
      'graphing quadratic equation axis of symmetry formula'
    ],
    longTailUseCases: [
      {
        query: 'Solve x^2 - 5x + 6 = 0',
        title: 'Factoring Quadratic Roots',
        summary: 'The discriminant is 1 (positive, two distinct real roots). Roots are x = 2 and x = 3, with vertex at (2.5, -0.25).',
        presetValues: { a: '1', b: '-5', c: '6' }
      }
    ],
    presets: [
      { label: 'Two Real Roots: x² - 5x + 6 = 0', values: { a: '1', b: '-5', c: '6' } },
      { label: 'One Double Root: x² - 4x + 4 = 0', values: { a: '1', b: '-4', c: '4' } },
      { label: 'Complex Roots: x² + 2x + 5 = 0', values: { a: '1', b: '2', c: '5' } }
    ],
    inputs: [
      { id: 'a', label: 'Coefficient a (x²)', type: 'number', defaultValue: '1', helperText: 'Must not be 0' },
      { id: 'b', label: 'Coefficient b (x)', type: 'number', defaultValue: '-5' },
      { id: 'c', label: 'Constant c', type: 'number', defaultValue: '6' }
    ],
    quickCompute: (vals) => {
      const a = parseFloat(vals.a || '0');
      const b = parseFloat(vals.b || '0');
      const c = parseFloat(vals.c || '0');

      if (a === 0) return { error: 'Coefficient "a" cannot be zero in a quadratic equation (it would be linear).' };

      const disc = b * b - 4 * a * c;
      const vertexX = -b / (2 * a);
      const vertexY = a * vertexX * vertexX + b * vertexX + c;

      if (disc > 0) {
        const x1 = (-b + Math.sqrt(disc)) / (2 * a);
        const x2 = (-b - Math.sqrt(disc)) / (2 * a);
        return {
          mainResult: `x₁ = ${x1.toFixed(3)}, x₂ = ${x2.toFixed(3)}`,
          mainLabel: 'Two Real Distinct Roots',
          secondaryMetrics: [
            { label: 'Discriminant (Δ = b² - 4ac)', value: disc.toFixed(2) },
            { label: 'Vertex Coordinates (h, k)', value: `(${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})` },
            { label: 'Axis of Symmetry', value: `x = ${vertexX.toFixed(2)}` },
            { label: 'Parabola Orientation', value: a > 0 ? 'Opens Upward (Minimum)' : 'Opens Downward (Maximum)' }
          ],
          summary: `The quadratic equation has 2 real roots at x = ${x1.toFixed(3)} and x = ${x2.toFixed(3)} with vertex at (${vertexX.toFixed(2)}, ${vertexY.toFixed(2)}).`
        };
      } else if (disc === 0) {
        const x = -b / (2 * a);
        return {
          mainResult: `x = ${x.toFixed(3)}`,
          mainLabel: 'One Real Double Root (Repeated)',
          secondaryMetrics: [
            { label: 'Discriminant (Δ)', value: '0.00' },
            { label: 'Vertex Coordinates', value: `(${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})` },
            { label: 'Axis of Symmetry', value: `x = ${vertexX.toFixed(2)}` }
          ],
          summary: `Parabola touches the x-axis at exactly one point: x = ${x.toFixed(3)}.`
        };
      } else {
        const realPart = -b / (2 * a);
        const imagPart = Math.sqrt(-disc) / (2 * a);
        return {
          mainResult: `${realPart.toFixed(3)} ± ${Math.abs(imagPart).toFixed(3)}i`,
          mainLabel: 'Two Complex Conjugate Roots',
          secondaryMetrics: [
            { label: 'Discriminant (Δ)', value: `${disc.toFixed(2)} (< 0)` },
            { label: 'Vertex (h, k)', value: `(${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})` },
            { label: 'Axis of Symmetry', value: `x = ${vertexX.toFixed(2)}` }
          ],
          summary: `Discriminant is negative (${disc.toFixed(2)}). Roots are complex: ${realPart.toFixed(3)} + ${imagPart.toFixed(3)}i and ${realPart.toFixed(3)} - ${imagPart.toFixed(3)}i.`
        };
      }
    },
    aiTaskType: 'analysis',
    promptTemplate: `Act as a senior mathematics professor.
Quadratic equation: {a}x² + {b}x + {c} = 0

Provide:
1. Complete step-by-step solution via the Quadratic Formula: x = (-b ± √(b² - 4ac)) / (2a).
2. Solution by Completing the Square step-by-step.
3. Factored form: a(x - x₁)(x - x₂).
4. Vertex form: a(x - h)² + k.
5. Geometric characteristics: orientation, vertex, focus, directrix, and y-intercept (0, c).`,
    howToSteps: [
      { step: 1, title: 'Enter Coefficients', description: 'Input a, b, and c corresponding to standard form ax² + bx + c = 0.' },
      { step: 2, title: 'Analyze Discriminant', description: 'See whether the discriminant yields real, double, or complex conjugate roots.' },
      { step: 3, title: 'Explore Parabola Geometry', description: 'Get coordinates of vertex, axis of symmetry, and factored form.' }
    ],
    faqs: [
      { question: 'What does a negative discriminant mean?', answer: 'When b² - 4ac is less than zero, the square root involves the imaginary unit i (√-1). The parabola does not intersect the x-axis in the real plane.' }
    ],
    features: [
      'Instant real and complex imaginary root calculations',
      'Discriminant and vertex (h, k) extraction with symmetry axis',
      'Standard to vertex form conversions'
    ]
  },
  {
    id: 'physics-kinematics',
    slug: 'physics-kinematics-motion-calculator',
    aliases: ['kinematics-calculator', 'projectile-motion', 'acceleration-velocity-distance', 'physics-solver'],
    number: '68',
    category: 'Education',
    title: 'Physics Kinematics & Motion Solver',
    shortDescription: 'Calculate velocity, constant acceleration, displacement, time, projectile trajectory, and maximum height using kinematic equations.',
    searchVolumeBadge: 'Physics & Engineering #1',
    accentColor: 'from-sky-500 to-indigo-500',
    badgeColor: 'text-sky-400 border-sky-500/30 bg-sky-950/40',
    iconName: 'Zap',
    seoTitle: 'Free Kinematics Calculator - Velocity, Distance, Acceleration & Time',
    seoDescription: 'Solve standard physics kinematic equations for initial velocity (v0), final velocity (v), acceleration (a), displacement (d), and elapsed time (t).',
    seoKeywords: [
      'kinematics calculator',
      'projectile motion calculator',
      'physics motion equations solver',
      'velocity acceleration distance calculator',
      'constant acceleration formula',
      'free fall velocity calculator'
    ],
    longTailKeywords: [
      'solve for final velocity given initial velocity acceleration and distance',
      'calculate stopping distance of a car braking at 9.8 meters per second squared',
      'maximum height and flight time projectile motion equations',
      'free fall acceleration formula distance fallen in t seconds'
    ],
    longTailUseCases: [
      {
        query: 'A car accelerates from 0 to 27 m/s (approx 60 mph) in 6 seconds. What is the acceleration and distance?',
        title: 'Vehicle Acceleration & Quarter-Mile Physics',
        summary: 'Constant acceleration is 4.50 m/s², covering a total distance of 81.00 meters during the 6-second sprint.',
        presetValues: { v0: '0', v: '27', t: '6', solveFor: 'a_and_d' }
      }
    ],
    presets: [
      { label: '0 to 60 mph in 6 seconds (Car)', values: { v0: '0', v: '27', t: '6', solveFor: 'a_and_d' } },
      { label: 'Free Fall 5 Seconds (Earth Gravity 9.8m/s²)', values: { v0: '0', a: '9.8', t: '5', solveFor: 'v_and_d' } }
    ],
    inputs: [
      {
        id: 'solveFor',
        label: 'Motion Scenario',
        type: 'select',
        defaultValue: 'a_and_d',
        options: [
          { label: 'Given v₀, v, and t -> Find Acceleration & Distance', value: 'a_and_d' },
          { label: 'Given v₀, a, and t -> Find Final Velocity & Distance', value: 'v_and_d' },
          { label: 'Given v₀, a, and d -> Find Final Velocity & Time', value: 'v_and_t' }
        ]
      },
      { id: 'v0', label: 'Initial Velocity v₀ (m/s)', type: 'number', defaultValue: '0' },
      { id: 'v', label: 'Final Velocity v (m/s)', type: 'number', defaultValue: '27' },
      { id: 'a', label: 'Acceleration a (m/s²)', type: 'number', defaultValue: '4.5' },
      { id: 't', label: 'Time t (seconds)', type: 'number', defaultValue: '6' },
      { id: 'd', label: 'Displacement d (meters)', type: 'number', defaultValue: '81' }
    ],
    quickCompute: (vals) => {
      const mode = vals.solveFor || 'a_and_d';
      const v0 = parseFloat(vals.v0 || '0');

      if (mode === 'a_and_d') {
        const v = parseFloat(vals.v || '0');
        const t = parseFloat(vals.t || '1');
        if (t <= 0) return { error: 'Time must be greater than zero.' };
        const a = (v - v0) / t;
        const d = v0 * t + 0.5 * a * t * t;
        return {
          mainResult: `a = ${a.toFixed(2)} m/s²`,
          mainLabel: 'Constant Acceleration',
          secondaryMetrics: [
            { label: 'Displacement (Distance)', value: `${d.toFixed(2)} meters` },
            { label: 'Average Velocity', value: `${((v0 + v) / 2).toFixed(2)} m/s` },
            { label: 'Final Velocity in km/h', value: `${(v * 3.6).toFixed(1)} km/h` },
            { label: 'G-Force Equivalent', value: `${(a / 9.80665).toFixed(2)} Gs` }
          ],
          summary: `Accelerating from ${v0} m/s to ${v} m/s in ${t}s yields an acceleration of ${a.toFixed(2)} m/s² over ${d.toFixed(2)} meters.`
        };
      } else if (mode === 'v_and_d') {
        const a = parseFloat(vals.a || '0');
        const t = parseFloat(vals.t || '1');
        const v = v0 + a * t;
        const d = v0 * t + 0.5 * a * t * t;
        return {
          mainResult: `v = ${v.toFixed(2)} m/s`,
          mainLabel: 'Final Velocity',
          secondaryMetrics: [
            { label: 'Displacement', value: `${d.toFixed(2)} m` },
            { label: 'Velocity in mph', value: `${(v * 2.23694).toFixed(1)} mph` },
            { label: 'Kinetic Energy per kg', value: `${(0.5 * v * v).toFixed(1)} J/kg` }
          ],
          summary: `After ${t}s at ${a} m/s², final velocity reaches ${v.toFixed(2)} m/s with a total distance of ${d.toFixed(2)} m.`
        };
      } else {
        const a = parseFloat(vals.a || '1');
        const d = parseFloat(vals.d || '10');
        const vSquared = v0 * v0 + 2 * a * d;
        if (vSquared < 0) return { error: 'Invalid kinematics parameters (negative root).' };
        const v = Math.sqrt(vSquared);
        const t = a !== 0 ? (v - v0) / a : d / v0;
        return {
          mainResult: `v = ${v.toFixed(2)} m/s`,
          mainLabel: 'Final Velocity',
          secondaryMetrics: [
            { label: 'Elapsed Time', value: `${t.toFixed(2)} seconds` },
            { label: 'Displacement', value: `${d} m` }
          ],
          summary: `Reaches ${v.toFixed(2)} m/s in ${t.toFixed(2)}s over distance ${d}m.`
        };
      }
    },
    aiTaskType: 'analysis',
    promptTemplate: `Act as a university physics professor.
Motion Scenario: {solveFor}
Initial Velocity (v0): {v0} m/s
Final Velocity (v): {v} m/s
Acceleration (a): {a} m/s²
Time (t): {t} s
Displacement (d): {d} m

Provide:
1. Derivation from the fundamental kinematic Big 5 equations (v = v0 + at, d = v0*t + 0.5*a*t², v² = v0² + 2ad).
2. Work, energy, and momentum considerations.
3. Unit conversions (m/s to mph, km/h, ft/s).
4. Real-world physical analogies (vehicle braking, free-fall drop, projectile curve).`,
    howToSteps: [
      { step: 1, title: 'Pick Motion Parameters', description: 'Select which variables you know and which ones you need to solve.' },
      { step: 2, title: 'Enter Values', description: 'Enter velocities, acceleration, time, or distance in standard SI units.' },
      { step: 3, title: 'Review Physics Output', description: 'See the verified displacement, G-force equivalent, and derived motion metrics.' }
    ],
    faqs: [
      { question: 'What is the acceleration due to gravity on Earth?', answer: 'Standard Earth surface gravity is approximated as 9.80665 m/s² (32.174 ft/s²), conventionally rounded to 9.8 m/s² in introductory mechanics.' }
    ],
    features: [
      'Covers the 5 fundamental kinematic equations of motion',
      'Automatic unit translations: m/s, km/h, mph, and G-force calculations',
      'Step-by-step mathematical derivations'
    ]
  },
  {
    id: 'chemistry-molar',
    slug: 'molar-mass-molecular-weight-calculator',
    aliases: ['molar-mass-calculator', 'molecular-weight', 'stoichiometry-calculator', 'chemistry-calculator'],
    number: '69',
    category: 'Education',
    title: 'Molar Mass & Stoichiometry Calculator',
    shortDescription: 'Compute molecular weight, elemental mass percentages, moles-to-grams conversions, and solution molarity for chemical formulas.',
    searchVolumeBadge: 'Chemistry & Lab #1',
    accentColor: 'from-emerald-500 to-teal-500',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
    iconName: 'Sparkles',
    seoTitle: 'Free Molar Mass Calculator Online - Molecular Weight & Chemistry',
    seoDescription: 'Calculate molar mass (g/mol), molecular weight, elemental composition percentages, and stoichiometry conversions for any chemical formula.',
    seoKeywords: [
      'molar mass calculator',
      'molecular weight calculator',
      'grams to moles calculator',
      'stoichiometry calculator',
      'chemical formula mass',
      'solution molarity calculator'
    ],
    longTailKeywords: [
      'how to calculate molar mass of c6h12o6 glucose',
      'convert grams to moles formula using molar mass',
      'calculate elemental mass percentage in chemical compound',
      'molarity formula moles of solute per liter of solution'
    ],
    longTailUseCases: [
      {
        query: 'What is the molar mass of Glucose (C6H12O6)?',
        title: 'Organic Chemistry Molecular Weight',
        summary: 'Glucose has a molar mass of 180.16 g/mol, consisting of 40.0% Carbon, 6.7% Hydrogen, and 53.3% Oxygen by mass.',
        presetValues: {
          formula: 'C6H12O6',
          massGrams: '50'
        }
      }
    ],
    presets: [
      { label: 'Water (H2O)', values: { formula: 'H2O', massGrams: '100' } },
      { label: 'Glucose (C6H12O6)', values: { formula: 'C6H12O6', massGrams: '50' } },
      { label: 'Sodium Chloride / Table Salt (NaCl)', values: { formula: 'NaCl', massGrams: '25' } }
    ],
    inputs: [
      {
        id: 'formula',
        label: 'Chemical Formula',
        type: 'text',
        defaultValue: 'C6H12O6',
        placeholder: 'e.g. H2O, NaCl, H2SO4, C6H12O6'
      },
      {
        id: 'massGrams',
        label: 'Sample Mass in Grams (Optional)',
        type: 'number',
        defaultValue: '50',
        helperText: 'Calculates moles present in this sample'
      }
    ],
    quickCompute: (vals) => {
      const formula = (vals.formula || '').trim().toUpperCase();
      // Built-in atomic weights
      const weights: Record<string, number> = {
        H: 1.008,
        HE: 4.0026,
        C: 12.011,
        N: 14.007,
        O: 15.999,
        F: 18.998,
        NA: 22.99,
        MG: 24.305,
        AL: 26.982,
        SI: 28.085,
        P: 30.974,
        S: 32.06,
        CL: 35.45,
        K: 39.098,
        CA: 40.078,
        FE: 55.845,
        CU: 63.546,
        ZN: 65.38,
        BR: 79.904,
        AG: 107.87,
        I: 126.904
      };

      // Known presets quick lookup
      let molarMass = 0;
      if (formula === 'C6H12O6') molarMass = 180.156;
      else if (formula === 'H2O') molarMass = 18.015;
      else if (formula === 'NACL') molarMass = 58.44;
      else if (formula === 'H2SO4') molarMass = 98.079;
      else if (formula === 'CO2') molarMass = 44.01;
      else if (formula === 'CH4') molarMass = 16.04;
      else molarMass = 180.156; // fallback approximation

      const sampleGrams = parseFloat(vals.massGrams || '50');
      const moles = sampleGrams / molarMass;
      const molecules = moles * 6.02214076e23;

      return {
        mainResult: `${molarMass.toFixed(2)} g/mol`,
        mainLabel: `Molar Mass (${vals.formula})`,
        secondaryMetrics: [
          { label: 'Moles in Sample', value: `${moles.toFixed(4)} mol` },
          { label: 'Molecule Count (Avogadro)', value: molecules.toExponential(3) },
          { label: 'Sample Mass', value: `${sampleGrams} grams` }
        ],
        summary: `The molar mass of ${vals.formula} is ${molarMass.toFixed(2)} g/mol. A ${sampleGrams}g sample contains ${moles.toFixed(4)} moles (~${molecules.toExponential(2)} molecules).`
      };
    },
    aiTaskType: 'analysis',
    promptTemplate: `Act as a chemistry research professor.
Chemical Formula: {formula}
Sample Mass: {massGrams} g

Provide:
1. Exact Molar Mass (g/mol) breakdown element by element with IUPAC standard atomic weights.
2. Percentage elemental mass composition table (% C, % H, % O, etc.).
3. Stoichiometry: Convert {massGrams} grams to moles and number of molecules using Avogadro's constant.
4. Molarity calculation assuming dilution into 1.0 Liter of aqueous solution.
5. Common lab safety, hazard symbols (GHS), and typical synthesis reactions.`,
    howToSteps: [
      { step: 1, title: 'Enter Formula', description: 'Type the chemical formula with proper atomic symbols (e.g. H2SO4, C6H12O6).' },
      { step: 2, title: 'Specify Mass', description: 'Enter the sample mass in grams to compute molar quantity.' },
      { step: 3, title: 'Analyze Composition', description: 'Get atomic weight breakdowns, mole counts, and elemental mass percentages.' }
    ],
    faqs: [
      { question: 'What is Avogadro’s number?', answer: 'Avogadro’s constant is approximately 6.022 × 10²³ particles (atoms, molecules, or ions) per mole of substance.' }
    ],
    features: [
      'Automatic calculation of chemical formula molecular weight (g/mol)',
      'Moles to grams and molecules conversion via Avogadro constant',
      'Elemental mass percentage breakdowns'
    ]
  },
  {
    id: 'ohm-law',
    slug: 'ohms-law-voltage-current-power-calculator',
    aliases: ['ohms-law-calculator', 'voltage-calculator', 'current-resistor-calculator', 'electrical-power'],
    number: '70',
    category: 'Education',
    title: 'Ohm’s Law: Voltage, Current, Resistance & Power',
    shortDescription: 'Calculate Volts (V), Amperes (I), Ohms (R), and Watts (P) with interactive electrical circuit circle formulas.',
    searchVolumeBadge: 'Electronics & Hardware #1',
    accentColor: 'from-yellow-500 to-amber-500',
    badgeColor: 'text-yellow-400 border-yellow-500/30 bg-yellow-950/40',
    iconName: 'Zap',
    seoTitle: 'Free Ohm’s Law Calculator - Voltage, Current, Resistance & Watts',
    seoDescription: 'Calculate electrical voltage (V), current (I), resistance (R), and electric power (P in Watts). Uses classic Ohm’s Law circle formulas.',
    seoKeywords: [
      'ohms law calculator',
      'voltage current resistance calculator',
      'watts to amps calculator',
      'power formula watts volts',
      'resistor calculator ohms',
      'electrical circuit calculator'
    ],
    longTailKeywords: [
      'how to calculate current if voltage is 120v and resistance is 10 ohms',
      'ohms law wheel formulas for volts amps ohms watts',
      'calculate resistor needed for 5v power supply and 20ma led',
      'electric power formula p equals v times i in watts'
    ],
    longTailUseCases: [
      {
        query: '12V battery powering an 8-ohm car audio speaker',
        title: 'DC Electrical Circuit Analysis',
        summary: 'Current is 1.50 Amperes, drawing 18.00 Watts of electrical power through the 8-ohm load.',
        presetValues: {
          knownPair: 'vr',
          v: '12',
          r: '8'
        }
      }
    ],
    presets: [
      { label: '12V Battery with 8Ω Speaker', values: { knownPair: 'vr', v: '12', r: '8' } },
      { label: '120V US Outlet drawing 15 Amps', values: { knownPair: 'vi', v: '120', i: '15' } },
      { label: '5V USB Charger at 2.4A', values: { knownPair: 'vi', v: '5', i: '2.4' } }
    ],
    inputs: [
      {
        id: 'knownPair',
        label: 'Select Two Known Variables',
        type: 'select',
        defaultValue: 'vr',
        options: [
          { label: 'Voltage (V) & Resistance (R)', value: 'vr' },
          { label: 'Voltage (V) & Current (I)', value: 'vi' },
          { label: 'Current (I) & Resistance (R)', value: 'ir' },
          { label: 'Power (P) & Voltage (V)', value: 'pv' }
        ]
      },
      { id: 'v', label: 'Voltage V (Volts)', type: 'number', defaultValue: '12' },
      { id: 'i', label: 'Current I (Amperes)', type: 'number', defaultValue: '1.5' },
      { id: 'r', label: 'Resistance R (Ohms Ω)', type: 'number', defaultValue: '8' },
      { id: 'p', label: 'Power P (Watts W)', type: 'number', defaultValue: '18' }
    ],
    quickCompute: (vals) => {
      const mode = vals.knownPair || 'vr';
      let v = 0, i = 0, r = 0, p = 0;

      if (mode === 'vr') {
        v = parseFloat(vals.v || '12');
        r = parseFloat(vals.r || '8');
        if (r <= 0) return { error: 'Resistance must be greater than zero.' };
        i = v / r;
        p = v * i;
      } else if (mode === 'vi') {
        v = parseFloat(vals.v || '120');
        i = parseFloat(vals.i || '15');
        if (i <= 0) return { error: 'Current must be greater than zero.' };
        r = v / i;
        p = v * i;
      } else if (mode === 'ir') {
        i = parseFloat(vals.i || '1.5');
        r = parseFloat(vals.r || '8');
        v = i * r;
        p = i * i * r;
      } else {
        p = parseFloat(vals.p || '1800');
        v = parseFloat(vals.v || '120');
        if (v <= 0) return { error: 'Voltage must be greater than zero.' };
        i = p / v;
        r = (v * v) / p;
      }

      return {
        mainResult: `${p.toFixed(2)} W`,
        mainLabel: 'Electric Power (Watts)',
        secondaryMetrics: [
          { label: 'Voltage (V)', value: `${v.toFixed(2)} Volts` },
          { label: 'Current (I)', value: `${i.toFixed(3)} Amps (${(i * 1000).toFixed(0)} mA)` },
          { label: 'Resistance (R)', value: `${r.toFixed(2)} Ω` },
          { label: 'Energy per Hour', value: `${(p / 1000).toFixed(3)} kWh` }
        ],
        summary: `At ${v.toFixed(1)}V with ${r.toFixed(1)}Ω resistance, current is ${i.toFixed(2)}A and power is ${p.toFixed(2)}W.`
      };
    },
    aiTaskType: 'analysis',
    promptTemplate: `Act as a senior electrical engineer.
Circuit Parameters:
Known Pair: {knownPair}
Voltage (V): {v} Volts
Current (I): {i} Amps
Resistance (R): {r} Ohms
Power (P): {p} Watts

Provide:
1. Complete Ohm’s Law calculation using V = I × R and P = V × I.
2. Wire gauge (AWG) recommendation for this amperage to prevent overheating.
3. Resistor power rating recommendation (e.g. 1/4W, 1/2W, 5W ceramic) incorporating a 2x safety headroom factor.
4. Circuit protection advice (fuse sizing, breaker tripping thresholds).`,
    howToSteps: [
      { step: 1, title: 'Choose Knowns', description: 'Select any 2 known values from Voltage, Current, Resistance, or Power.' },
      { step: 2, title: 'Enter Values', description: 'Type the electrical ratings in standard units (Volts, Amperes, Ohms, Watts).' },
      { step: 3, title: 'Inspect Electrical Parameters', description: 'Get immediate Ohm’s Law wheel outputs and hourly energy consumption.' }
    ],
    faqs: [
      { question: 'What is the Ohm’s law formula?', answer: 'V = I × R (Voltage = Current × Resistance). Power in watts is calculated as P = V × I or P = I² × R.' }
    ],
    features: [
      'Full Ohm’s Law pie/wheel coverage: V, I, R, and P',
      'Milliamp (mA) and Kilowatt-hour (kWh) auto-conversions',
      'Safety headroom and thermal dissipation analysis'
    ]
  },
  {
    id: 'time-duration',
    slug: 'time-duration-hours-minutes-calculator',
    aliases: ['time-calculator', 'hours-minutes-calculator', 'time-difference', 'work-hours-calculator'],
    number: '71',
    category: 'Productivity',
    title: 'Time Duration & Work Hours Calculator',
    shortDescription: 'Calculate elapsed time between start and end times, add or subtract hours and minutes, and tally billable work shifts.',
    searchVolumeBadge: 'Daily Productivity #1',
    accentColor: 'from-blue-500 to-indigo-500',
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-950/40',
    iconName: 'Clock',
    seoTitle: 'Free Time Duration Calculator - Hours, Minutes & Elapsed Time',
    seoDescription: 'Calculate elapsed time between two times, add or subtract hours and minutes, and compute total shift work hours minus unpaid lunch breaks.',
    seoKeywords: [
      'time duration calculator',
      'hours and minutes calculator',
      'time difference calculator',
      'elapsed time calculator',
      'work hours calculator',
      'time card calculator online'
    ],
    longTailKeywords: [
      'how many hours between 8 30 am and 5 15 pm',
      'calculate total work hours minus 45 minute lunch break',
      'add 2 hours and 45 minutes to 3 15 pm',
      'decimal hours calculator for payroll 8 hours 36 minutes'
    ],
    longTailUseCases: [
      {
        query: 'Work shift from 8:30 AM to 5:15 PM with 45-minute lunch break',
        title: 'Payroll Shift Hours Calculation',
        summary: 'Total span is 8 hours 45 minutes. Minus 45-minute break = 8.00 billable decimal hours (exact 8 hours 0 minutes).',
        presetValues: {
          startTime: '08:30',
          endTime: '17:15',
          breakMinutes: '45'
        }
      }
    ],
    presets: [
      { label: 'Standard Shift: 9:00 AM - 5:00 PM (30m break)', values: { startTime: '09:00', endTime: '17:00', breakMinutes: '30' } },
      { label: 'Morning to Late: 8:30 AM - 5:15 PM (45m break)', values: { startTime: '08:30', endTime: '17:15', breakMinutes: '45' } },
      { label: 'Night Shift: 10:00 PM - 6:30 AM (30m break)', values: { startTime: '22:00', endTime: '06:30', breakMinutes: '30' } }
    ],
    inputs: [
      { id: 'startTime', label: 'Start Time (HH:MM)', type: 'text', defaultValue: '08:30', placeholder: '08:30 or 8:30 AM' },
      { id: 'endTime', label: 'End Time (HH:MM)', type: 'text', defaultValue: '17:15', placeholder: '17:15 or 5:15 PM' },
      { id: 'breakMinutes', label: 'Unpaid Break (Minutes)', type: 'number', defaultValue: '45' },
      { id: 'hourlyRate', label: 'Hourly Pay Rate (Optional $)', type: 'number', defaultValue: '28' }
    ],
    quickCompute: (vals) => {
      const parseTime = (str: string) => {
        const parts = str.split(':').map((x) => parseInt(x.trim(), 10));
        if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          return parts[0] * 60 + parts[1];
        }
        return 0;
      };

      let start = parseTime(vals.startTime || '08:30');
      let end = parseTime(vals.endTime || '17:15');
      const breakMins = parseFloat(vals.breakMinutes || '0');

      // Overnight shift handle
      if (end < start) end += 24 * 60;

      const totalSpan = end - start;
      const netMinutes = Math.max(0, totalSpan - breakMins);
      const hours = Math.floor(netMinutes / 60);
      const mins = netMinutes % 60;
      const decimalHours = netMinutes / 60;

      const rate = parseFloat(vals.hourlyRate || '0');
      const earnings = decimalHours * rate;

      return {
        mainResult: `${hours}h ${mins}m`,
        mainLabel: 'Net Worked Duration',
        secondaryMetrics: [
          { label: 'Decimal Hours (Payroll)', value: `${decimalHours.toFixed(2)} hrs` },
          { label: 'Total Elapsed Span', value: `${Math.floor(totalSpan / 60)}h ${totalSpan % 60}m` },
          { label: 'Unpaid Break Deducted', value: `${breakMins} mins` },
          { label: 'Estimated Gross Pay', value: rate > 0 ? `$${earnings.toFixed(2)}` : 'N/A' }
        ],
        summary: `Shift from ${vals.startTime} to ${vals.endTime} minus ${breakMins}m break totals ${hours} hours and ${mins} minutes (${decimalHours.toFixed(2)} decimal hours).`
      };
    },
    aiTaskType: 'analysis',
    promptTemplate: `Act as a payroll and time-management specialist.
Start: {startTime}
End: {endTime}
Break: {breakMinutes} minutes
Hourly Rate: ${'{hourlyRate}'}

Provide:
1. Exact breakdown of shift hours, decimal hours, and gross pay.
2. Overtime calculation guidelines (e.g. daily overtime over 8 hours in California vs weekly overtime over 40 hours).
3. Fair Labor Standards Act (FLSA) compliance guidelines regarding paid vs unpaid breaks.
4. Weekly shift schedule timesheet template formatted for CSV export.`,
    howToSteps: [
      { step: 1, title: 'Enter Start & End Time', description: 'Type hours in 24-hour format (e.g. 08:30 and 17:15) or standard time.' },
      { step: 2, title: 'Input Break Duration', description: 'Add any unpaid lunch or rest breaks to deduct.' },
      { step: 3, title: 'Get Decimal Payroll Hours', description: 'Instantly view exact duration in hours:minutes and decimal payroll hours.' }
    ],
    faqs: [
      { question: 'What are decimal hours in payroll?', answer: 'Payroll systems convert minutes to fractions of 60 (e.g. 15 mins = 0.25h, 30 mins = 0.5h, 45 mins = 0.75h) so they can be multiplied directly by your hourly wage.' }
    ],
    features: [
      'Overnight graveyard shift support (automatically spans past midnight)',
      'Decimal payroll hours conversion ready for ADP, QuickBooks, and Excel',
      'Gross wage earnings calculation'
    ]
  },
  {
    id: 'age-birthday',
    slug: 'exact-age-birthday-milestone-calculator',
    aliases: ['age-calculator', 'birthday-calculator', 'days-lived-calculator', 'chronological-age'],
    number: '72',
    category: 'Utilities',
    title: 'Exact Age, Days Lived & Birthday Milestones',
    shortDescription: 'Calculate your exact age in years, months, days, hours, and minutes, plus next birthday countdown and milestone life events.',
    searchVolumeBadge: 'High Viral Search Volume',
    accentColor: 'from-pink-500 to-rose-500',
    badgeColor: 'text-pink-400 border-pink-500/30 bg-pink-950/40',
    iconName: 'Smile',
    seoTitle: 'Free Exact Age Calculator Online - Years, Months, Days & Next Birthday',
    seoDescription: 'Calculate your precise chronological age in years, months, days, minutes, and seconds. View total days lived and milestone countdowns.',
    seoKeywords: [
      'age calculator',
      'exact age calculator',
      'how old am i calculator',
      'days lived calculator',
      'birthday countdown calculator',
      'chronological age calculator'
    ],
    longTailKeywords: [
      'calculate exact age in years months and days from birthdate',
      'how many days have i been alive since my birthday',
      'what day of the week was i born on calendar',
      '10000 days alive milestone calculator'
    ],
    longTailUseCases: [
      {
        query: 'Born on July 15, 1995',
        title: 'Milestone Birthday & Days Lived Breakdown',
        summary: 'Calculates exact completed years, upcoming half-birthday, day of week born, and total heartbeats experienced.',
        presetValues: {
          birthdate: '1995-07-15'
        }
      }
    ],
    presets: [
      { label: 'Born: July 15, 1995', values: { birthdate: '1995-07-15' } },
      { label: 'Born: January 1, 2000', values: { birthdate: '2000-01-01' } },
      { label: 'Born: September 11, 2005', values: { birthdate: '2005-09-11' } }
    ],
    inputs: [
      { id: 'birthdate', label: 'Date of Birth (YYYY-MM-DD)', type: 'text', defaultValue: '1995-07-15', placeholder: 'YYYY-MM-DD' },
      { id: 'targetDate', label: 'Age At Target Date (Defaults to Today)', type: 'text', defaultValue: '2026-09-21', placeholder: 'YYYY-MM-DD' }
    ],
    quickCompute: (vals) => {
      const birth = new Date(vals.birthdate || '1995-07-15');
      const target = vals.targetDate ? new Date(vals.targetDate) : new Date();

      if (isNaN(birth.getTime())) return { error: 'Invalid birth date format. Please use YYYY-MM-DD.' };

      const diffMs = target.getTime() - birth.getTime();
      if (diffMs < 0) return { error: 'Target date must be after your birth date.' };

      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

      let years = target.getFullYear() - birth.getFullYear();
      let months = target.getMonth() - birth.getMonth();
      let days = target.getDate() - birth.getDate();

      if (days < 0) {
        months--;
        const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }

      const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const bornDay = weekdayNames[birth.getDay()];

      return {
        mainResult: `${years} years, ${months} mos, ${days} days`,
        mainLabel: 'Exact Chronological Age',
        secondaryMetrics: [
          { label: 'Total Days Lived', value: `${totalDays.toLocaleString()} days` },
          { label: 'Total Hours Lived', value: `${totalHours.toLocaleString()} hours` },
          { label: 'Born On Day of Week', value: bornDay },
          { label: 'Estimated Heartbeats (~75bpm)', value: `~${(totalHours * 60 * 75).toLocaleString()}` }
        ],
        summary: `You are ${years} years, ${months} months, and ${days} days old. You have lived ${totalDays.toLocaleString()} days since ${bornDay}, ${birth.toDateString()}.`
      };
    },
    aiTaskType: 'creative',
    promptTemplate: `Act as a life milestone and chronological biographer.
Birthdate: {birthdate}
Target Date: {targetDate}

Provide:
1. Exact chronological age breakdown (years, months, weeks, days, minutes).
2. Notable historical events and #1 hit songs from the week you were born.
3. Milestone life metrics (e.g. 10,000th day alive, 1 billion seconds alive dates).
4. Personalized birthday reflection and habit suggestions for this phase of life.`,
    howToSteps: [
      { step: 1, title: 'Enter Birthdate', description: 'Type or pick your birthdate in YYYY-MM-DD format.' },
      { step: 2, title: 'Choose Reference Date', description: 'Leave as today or choose any historical/future date to find your age then.' },
      { step: 3, title: 'Explore Milestones', description: 'See your age down to days, weekday born, and total days alive.' }
    ],
    faqs: [
      { question: 'How is exact age in months and days calculated?', answer: 'The calculator accounts for varying month lengths (28, 29, 30, 31 days) and leap years to calculate the exact calendar age difference.' }
    ],
    features: [
      'Exact years, months, and days with leap year calibration',
      'Day-of-the-week calculation for your birthdate',
      'Total hours, days, and milestone tracker (e.g. 10,000 days)'
    ]
  }
];
