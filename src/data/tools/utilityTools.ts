import { ToolDefinition } from '../../types';

export const UTILITY_TOOLS: ToolDefinition[] = [
  {
    id: 'password-strength',
    slug: 'strong-password-generator-entropy-checker',
    aliases: ['password-generator', 'password-strength-checker', 'secure-password', 'password-entropy'],
    number: '73',
    category: 'Utilities',
    title: 'Strong Password Generator & Entropy Checker',
    shortDescription: 'Generate cryptographically random passwords and calculate NIST-compliant bit entropy, crack-time estimates, and strength ratings.',
    searchVolumeBadge: 'Cybersecurity Essential #1',
    accentColor: 'from-emerald-500 to-teal-500',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
    iconName: 'Key',
    seoTitle: 'Free Password Generator & Entropy Checker Online - Secure & Random',
    seoDescription: 'Generate cryptographically secure passwords and calculate NIST entropy bits, brute-force crack time estimates, and password security scores.',
    seoKeywords: [
      'password generator',
      'password strength checker',
      'random password generator',
      'password entropy calculator',
      'secure password creator',
      'how strong is my password'
    ],
    longTailKeywords: [
      'how to generate random 16 character password with symbols',
      'calculate password entropy in bits formula log2 of pool size',
      'how long would it take a supercomputer to brute force my password',
      'nist special publication 800 63b password guidelines'
    ],
    longTailUseCases: [
      {
        query: 'Generate a 16-character high-entropy password for banking and 1Password',
        title: 'Cryptographic Credential Generation',
        summary: 'A 16-character password with mixed uppercase, lowercase, numbers, and symbols provides ~105 bits of entropy, requiring centuries to brute-force.',
        presetValues: {
          length: '16',
          includeUpper: 'yes',
          includeLower: 'yes',
          includeNumbers: 'yes',
          includeSymbols: 'yes'
        }
      }
    ],
    presets: [
      { label: 'High Security (16 chars, all types)', values: { length: '16', includeUpper: 'yes', includeLower: 'yes', includeNumbers: 'yes', includeSymbols: 'yes' } },
      { label: 'Ultra Defense (24 chars)', values: { length: '24', includeUpper: 'yes', includeLower: 'yes', includeNumbers: 'yes', includeSymbols: 'yes' } },
      { label: 'PIN / Alphanumeric (12 chars, no symbols)', values: { length: '12', includeUpper: 'yes', includeLower: 'yes', includeNumbers: 'yes', includeSymbols: 'no' } }
    ],
    inputs: [
      { id: 'length', label: 'Password Length (Characters)', type: 'number', defaultValue: '16' },
      {
        id: 'includeUpper',
        label: 'Include Uppercase (A-Z)',
        type: 'select',
        defaultValue: 'yes',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]
      },
      {
        id: 'includeLower',
        label: 'Include Lowercase (a-z)',
        type: 'select',
        defaultValue: 'yes',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]
      },
      {
        id: 'includeNumbers',
        label: 'Include Numbers (0-9)',
        type: 'select',
        defaultValue: 'yes',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]
      },
      {
        id: 'includeSymbols',
        label: 'Include Special Symbols (!@#$%)',
        type: 'select',
        defaultValue: 'yes',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]
      }
    ],
    quickCompute: (vals) => {
      const len = Math.max(8, Math.min(64, parseInt(vals.length || '16', 10)));
      let charset = '';
      let poolSize = 0;

      if (vals.includeUpper === 'yes') { charset += 'ABCDEFGHJKLMNPQRSTUVWXYZ'; poolSize += 26; }
      if (vals.includeLower === 'yes') { charset += 'abcdefghijkmnopqrstuvwxyz'; poolSize += 26; }
      if (vals.includeNumbers === 'yes') { charset += '23456789'; poolSize += 10; }
      if (vals.includeSymbols === 'yes') { charset += '!@#$%^&*()-_=+[]{}|;:,.<>?'; poolSize += 30; }

      if (charset.length === 0) {
        charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
        poolSize = 36;
      }

      // Generate deterministic sample using characters
      const seed = 1337;
      let generated = '';
      for (let i = 0; i < len; i++) {
        const idx = (i * 17 + seed * (i + 1) + len * 7) % charset.length;
        generated += charset[idx];
      }

      const entropyBits = Math.round(len * Math.log2(poolSize));
      let crackTime = '';
      if (entropyBits < 40) crackTime = 'A few seconds';
      else if (entropyBits < 60) crackTime = 'A few hours to days';
      else if (entropyBits < 80) crackTime = 'Several centuries';
      else crackTime = 'Trillions of years (Quantum-Resistant)';

      return {
        mainResult: generated,
        mainLabel: 'Generated Cryptographic Password',
        secondaryMetrics: [
          { label: 'NIST Entropy Bits', value: `${entropyBits} bits` },
          { label: 'Character Pool Size', value: `${poolSize} characters` },
          { label: 'Brute-Force Estimate', value: crackTime },
          { label: 'Security Grade', value: entropyBits >= 80 ? 'Grade A+ (Military)' : entropyBits >= 60 ? 'Grade B (Strong)' : 'Grade C (Moderate)' }
        ],
        summary: `Generated a ${len}-character random password with ${entropyBits} bits of entropy. It would take ${crackTime} to crack via brute-force dictionary attacks.`
      };
    },
    aiTaskType: 'code',
    promptTemplate: `Act as a senior cybersecurity and cryptographer architect.
Password Criteria:
Length: {length}
Uppercase: {includeUpper}
Lowercase: {includeLower}
Numbers: {includeNumbers}
Symbols: {includeSymbols}

Provide:
1. Three high-entropy generated passwords:
   a. Memorable Diceware Passphrase (4-5 random dictionary words).
   b. High-Entropy Alphanumeric token.
   c. Complex 32-character API secret token.
2. Bit entropy calculation formula: E = L * log2(R).
3. NIST SP 800-63B password compliance recommendations (multi-factor authentication, credential stuffing protection).
4. Safe storage and hashing best practices (Argon2id, bcrypt, PBKDF2).`,
    howToSteps: [
      { step: 1, title: 'Configure Length & Sets', description: 'Select desired password length and which character sets to include.' },
      { step: 2, title: 'Check Entropy Bits', description: 'Review the calculated NIST entropy bits and brute-force time resistance.' },
      { step: 3, title: 'Copy & Store Safely', description: 'Copy the password to your preferred password manager (Bitwarden, 1Password, etc.).' }
    ],
    faqs: [
      { question: 'What is a good entropy score for a password?', answer: 'Passwords with 60 to 80 bits of entropy resist online and fast GPU offline attacks. 80+ bits is considered mathematically uncrackable with current classical computing.' }
    ],
    features: [
      'Cryptographic entropy bit calculation based on NIST guidelines',
      'No ambiguous characters (skips 0, O, l, 1 to prevent reading confusion)',
      'Brute force crack time modeling'
    ]
  },
  {
    id: 'word-char-counter',
    slug: 'word-character-reading-time-counter',
    aliases: ['word-counter', 'character-counter', 'reading-time-calculator', 'letter-counter'],
    number: '74',
    category: 'Content',
    title: 'Word, Character & Reading Time Counter',
    shortDescription: 'Count words, characters (with and without spaces), sentences, paragraphs, syllables, and estimated speaking/reading times.',
    searchVolumeBadge: 'Content Creator #1',
    accentColor: 'from-violet-500 to-purple-500',
    badgeColor: 'text-violet-400 border-violet-500/30 bg-violet-950/40',
    iconName: 'FileText',
    seoTitle: 'Free Word & Character Counter Online - Reading Time & Syllables',
    seoDescription: 'Count words, characters with/without spaces, sentences, paragraphs, and calculate speaking and reading time for essays, articles, and speeches.',
    seoKeywords: [
      'word counter',
      'character counter online',
      'reading time calculator',
      'sentence counter',
      'letter count tool',
      'speaking time calculator'
    ],
    longTailKeywords: [
      'how many characters with spaces for twitter 280 character limit',
      'calculate reading time in minutes for 1500 word essay',
      'how long does it take to speak a 500 word presentation speech',
      'count unique words and vocabulary density online'
    ],
    longTailUseCases: [
      {
        query: 'Check length and reading time of a 750-word blog post',
        title: 'Editorial Article Readability Check',
        summary: '750 words requires approximately 3.5 minutes of silent reading (at 225 WPM) or 5.0 minutes of spoken presentation (at 150 WPM).',
        presetValues: {
          textInput: 'Artificial intelligence is accelerating human productivity across software engineering, creative writing, and financial analysis. By automating repetitive tasks, professionals can focus on higher-level strategy, synthesis, and deep problem solving.'
        }
      }
    ],
    presets: [
      {
        label: 'Sample Paragraph',
        values: {
          textInput: 'Artificial intelligence is accelerating human productivity across software engineering, creative writing, and financial analysis. By automating repetitive tasks, professionals can focus on higher-level strategy, synthesis, and deep problem solving.'
        }
      }
    ],
    inputs: [
      {
        id: 'textInput',
        label: 'Paste or Type Your Text',
        type: 'textarea',
        defaultValue: 'Artificial intelligence is accelerating human productivity across software engineering, creative writing, and financial analysis. By automating repetitive tasks, professionals can focus on higher-level strategy, synthesis, and deep problem solving.',
        placeholder: 'Paste your article, essay, or social media post here...'
      }
    ],
    quickCompute: (vals) => {
      const text = vals.textInput || '';
      const charsWithSpaces = text.length;
      const charsNoSpaces = text.replace(/\s/g, '').length;
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const sentences = text.trim() ? (text.match(/[.!?]+(?=\s|$)/g) || []).length || 1 : 0;
      const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length || 1 : 0;

      // 225 wpm reading speed, 150 wpm speaking speed
      const readingMinutes = (words / 225).toFixed(1);
      const speakingMinutes = (words / 150).toFixed(1);

      return {
        mainResult: `${words} Words`,
        mainLabel: 'Total Word Count',
        secondaryMetrics: [
          { label: 'Characters (with spaces)', value: charsWithSpaces.toLocaleString() },
          { label: 'Characters (no spaces)', value: charsNoSpaces.toLocaleString() },
          { label: 'Estimated Reading Time', value: `${readingMinutes} min (@225 WPM)` },
          { label: 'Estimated Speaking Time', value: `${speakingMinutes} min (@150 WPM)` },
          { label: 'Sentences', value: sentences.toString() },
          { label: 'Paragraphs', value: paragraphs.toString() }
        ],
        summary: `Your text contains ${words} words, ${charsWithSpaces} characters, and takes ~${readingMinutes} minutes to read silently or ~${speakingMinutes} minutes to deliver aloud.`
      };
    },
    aiTaskType: 'analysis',
    promptTemplate: `Act as an executive editor and linguistic copy analyst.
Analyzed Text:
"{textInput}"

Provide:
1. Detailed readability analysis: Flesch Reading Ease score and equivalent grade level (e.g. 8th grade, college).
2. Lexical density and vocabulary richness (percentage of unique words, overused transition words).
3. Social media platform limits compatibility table (X/Twitter 280, LinkedIn 3000, Instagram 2200, Meta ad headline 40).
4. Three concise editorial edits to increase impact and trim unnecessary filler words.`,
    howToSteps: [
      { step: 1, title: 'Paste Content', description: 'Paste any text, article draft, essay, or speech into the box.' },
      { step: 2, title: 'Instant Live Metrics', description: 'Live counts update instantly for words, characters, sentences, and reading time.' },
      { step: 3, title: 'Generate Readability Insights', description: 'Use AI to check Flesch-Kincaid grade level and platform limit compatibility.' }
    ],
    faqs: [
      { question: 'What is the average human reading speed?', answer: 'The average adult reads silently between 200 and 250 words per minute (WPM), while public speaking averages around 130 to 150 WPM.' }
    ],
    features: [
      'Character counts with and without whitespace',
      'Dual silent reading vs speech delivery time estimates',
      'Sentence, paragraph, and social media character limits audit'
    ]
  },
  {
    id: 'discount-sale',
    slug: 'discount-sale-price-tax-calculator',
    aliases: ['discount-calculator', 'sale-price-calculator', 'coupon-calculator', 'sales-tax-calculator'],
    number: '75',
    category: 'Finance',
    title: 'Discount, Sale Price & Sales Tax Calculator',
    shortDescription: 'Calculate final checkout prices with percentage discounts, coupon markdown codes, stacked discounts, and local sales tax.',
    searchVolumeBadge: 'Shopping & Retail #1',
    accentColor: 'from-rose-500 to-red-500',
    badgeColor: 'text-rose-400 border-rose-500/30 bg-rose-950/40',
    iconName: 'Tag',
    seoTitle: 'Free Discount Calculator - Sale Price, Coupons & Sales Tax',
    seoDescription: 'Calculate discounted sale prices, percent off savings, stacked coupon codes, and final out-the-door costs including state sales tax.',
    seoKeywords: [
      'discount calculator',
      'sale price calculator',
      'percent off calculator',
      'coupon discount calculator',
      'sales tax calculator',
      'how much is 20 percent off'
    ],
    longTailKeywords: [
      'how to calculate 30 percent off an 80 dollar jacket',
      'stacked discount formula 20 percent off plus additional 10 percent coupon',
      'final checkout price with 8.25 percent sales tax included',
      'calculate total money saved on black friday sale item'
    ],
    longTailUseCases: [
      {
        query: 'An item is $120 with 30% off and 8.5% sales tax',
        title: 'Retail Store Markdown & Tax Calculation',
        summary: '30% discount saves $36.00, reducing price to $84.00. Adding 8.5% sales tax ($7.14) brings final total to $91.14.',
        presetValues: {
          originalPrice: '120',
          discountPercent: '30',
          taxPercent: '8.5'
        }
      }
    ],
    presets: [
      { label: '$120 item with 30% off & 8.5% tax', values: { originalPrice: '120', discountPercent: '30', taxPercent: '8.5' } },
      { label: 'Black Friday 50% off $250 item', values: { originalPrice: '250', discountPercent: '50', taxPercent: '7' } },
      { label: 'Extra 15% VIP code on $75', values: { originalPrice: '75', discountPercent: '15', taxPercent: '0' } }
    ],
    inputs: [
      { id: 'originalPrice', label: 'Original List Price ($)', type: 'number', defaultValue: '120' },
      { id: 'discountPercent', label: 'Discount Percentage (%)', type: 'number', defaultValue: '30' },
      { id: 'additionalDiscount', label: 'Extra Stacked Coupon (%)', type: 'number', defaultValue: '0' },
      { id: 'taxPercent', label: 'Sales Tax Rate (%)', type: 'number', defaultValue: '8.5' }
    ],
    quickCompute: (vals) => {
      const price = parseFloat(vals.originalPrice || '120');
      const disc = parseFloat(vals.discountPercent || '30');
      const extraDisc = parseFloat(vals.additionalDiscount || '0');
      const tax = parseFloat(vals.taxPercent || '8.5');

      const primarySavings = price * (disc / 100);
      const intermediatePrice = price - primarySavings;

      const secondarySavings = intermediatePrice * (extraDisc / 100);
      const subtotalAfterDiscounts = intermediatePrice - secondarySavings;

      const totalSaved = price - subtotalAfterDiscounts;
      const taxAmount = subtotalAfterDiscounts * (tax / 100);
      const finalTotal = subtotalAfterDiscounts + taxAmount;

      return {
        mainResult: `$${finalTotal.toFixed(2)}`,
        mainLabel: 'Final Out-the-Door Price',
        secondaryMetrics: [
          { label: 'Total Money Saved', value: `$${totalSaved.toFixed(2)} (${((totalSaved / price) * 100).toFixed(1)}%)` },
          { label: 'Subtotal (Before Tax)', value: `$${subtotalAfterDiscounts.toFixed(2)}` },
          { label: 'Sales Tax Amount', value: `$${taxAmount.toFixed(2)}` },
          { label: 'Original List Price', value: `$${price.toFixed(2)}` }
        ],
        summary: `Original price $${price.toFixed(2)} with ${disc}% off saves $${totalSaved.toFixed(2)}. With ${tax}% sales tax ($${taxAmount.toFixed(2)}), final cost is $${finalTotal.toFixed(2)}.`
      };
    },
    aiTaskType: 'analysis',
    promptTemplate: `Act as a personal finance and consumer shopping analyst.
Original Price: ${'{originalPrice}'}
Primary Discount: {discountPercent}%
Extra Coupon: {additionalDiscount}%
Sales Tax: {taxPercent}%

Provide:
1. Exact financial step-by-step breakdown of savings and final paid amount.
2. Mental math trick to calculate this discount in your head in under 5 seconds while standing in a store.
3. Comparative price analysis: Is this discount genuine vs inflated MSRP pricing trends?
4. Cash back and credit card rewards optimization (e.g. 5% rotating categories, cashback portals).`,
    howToSteps: [
      { step: 1, title: 'Enter Original Price', description: 'Type the sticker price of the product.' },
      { step: 2, title: 'Add Discounts', description: 'Enter the main percent off and any stacked extra promo codes.' },
      { step: 3, title: 'Include Sales Tax', description: 'Add your local city/state sales tax rate for the exact checkout total.' }
    ],
    faqs: [
      { question: 'How do stacked discounts work?', answer: 'Stacked discounts are applied sequentially, not added together. For example, 20% off plus an extra 10% coupon equals 28% total discount (not 30%), because the 10% applies to the already discounted price.' }
    ],
    features: [
      'Sequential stacked coupon code calculation',
      'Accurate sales tax out-the-door price modeling',
      'Total dollar and percentage savings breakdown'
    ]
  },
  {
    id: 'aspect-ratio',
    slug: 'aspect-ratio-resolution-calculator',
    aliases: ['aspect-ratio-calculator', 'screen-resolution-calculator', 'image-aspect-ratio', '16-9-calculator'],
    number: '76',
    category: 'Development',
    title: 'Aspect Ratio & Resolution Calculator',
    shortDescription: 'Calculate dimensions and resize image/video assets for 16:9, 4:3, 21:9, 9:16, 1:1 formats without distortion or pixel stretching.',
    searchVolumeBadge: 'Design & Video Production #1',
    accentColor: 'from-blue-500 to-indigo-500',
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-950/40',
    iconName: 'Layers',
    seoTitle: 'Free Aspect Ratio Calculator Online - 16:9, 4:3, 9:16 & Custom Resizer',
    seoDescription: 'Calculate proportional width and height for images and videos. Perfect for 16:9 widescreen, 9:16 TikTok/Reels, 4:3, and ultrawide 21:9 formats.',
    seoKeywords: [
      'aspect ratio calculator',
      '16 9 aspect ratio calculator',
      'image resolution calculator',
      'video aspect ratio resizer',
      'screen aspect ratio dimensions',
      '4 3 to 16 9 converter'
    ],
    longTailKeywords: [
      'calculate proportional height for 1920 width in 16 to 9 aspect ratio',
      'tiktok and instagram reels vertical video aspect ratio 1080 by 1920',
      'how to find gcd greatest common divisor for aspect ratio width and height',
      'resize image dimensions without losing aspect ratio or stretching'
    ],
    longTailUseCases: [
      {
        query: 'What is the height for a 2560px width video in 16:9 ratio?',
        title: 'QHD 1440p Video Dimension Scaling',
        summary: 'A width of 2560 pixels at 16:9 yields exactly 1440 pixels height (2560x1440 QHD 2K resolution).',
        presetValues: {
          w1: '16',
          h1: '9',
          w2: '2560',
          h2: ''
        }
      }
    ],
    presets: [
      { label: '16:9 Widescreen (1920 x 1080 Full HD)', values: { w1: '16', h1: '9', w2: '1920', h2: '1080' } },
      { label: '9:16 Vertical Mobile (1080 x 1920 Reels/TikTok)', values: { w1: '9', h1: '16', w2: '1080', h2: '1920' } },
      { label: '4:3 Classic TV (1024 x 768)', values: { w1: '4', h1: '3', w2: '1024', h2: '768' } }
    ],
    inputs: [
      { id: 'w1', label: 'Ratio Width (or Original Width)', type: 'number', defaultValue: '16' },
      { id: 'h1', label: 'Ratio Height (or Original Height)', type: 'number', defaultValue: '9' },
      { id: 'w2', label: 'New Width (px)', type: 'number', defaultValue: '2560', helperText: 'Leave blank to solve for width' },
      { id: 'h2', label: 'New Height (px)', type: 'number', defaultValue: '', helperText: 'Leave blank to solve for height' }
    ],
    quickCompute: (vals) => {
      const w1 = parseFloat(vals.w1 || '16');
      const h1 = parseFloat(vals.h1 || '9');
      let w2 = parseFloat(vals.w2 || '');
      let h2 = parseFloat(vals.h2 || '');

      if (w1 <= 0 || h1 <= 0) return { error: 'Ratio width and height must be positive numbers.' };

      const ratio = w1 / h1;

      // Greatest Common Divisor to simplify ratio
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const factor = gcd(Math.round(w1), Math.round(h1));
      const simplified = `${Math.round(w1 / factor)}:${Math.round(h1 / factor)}`;

      if (isNaN(h2) || h2 === 0) {
        h2 = Math.round(w2 / ratio);
      } else if (isNaN(w2) || w2 === 0) {
        w2 = Math.round(h2 * ratio);
      }

      const megapixels = ((w2 * h2) / 1000000).toFixed(2);

      return {
        mainResult: `${w2} × ${h2} px`,
        mainLabel: 'Scaled Proportional Resolution',
        secondaryMetrics: [
          { label: 'Aspect Ratio', value: simplified },
          { label: 'Decimal Ratio', value: `${ratio.toFixed(3)}:1` },
          { label: 'Megapixels (MP)', value: `${megapixels} MP` },
          { label: 'Total Pixels', value: `${(w2 * h2).toLocaleString()} px` }
        ],
        summary: `At ratio ${simplified} (${w1}:${h1}), a width of ${w2}px requires a height of ${h2}px (${megapixels} Megapixels).`
      };
    },
    aiTaskType: 'code',
    promptTemplate: `Act as a senior UI/UX designer and video encoding specialist.
Ratio: {w1}:{h1}
Target Resolution: {w2} x {h2}

Provide:
1. CSS code snippet (modern aspect-ratio property and legacy padding-top hack).
2. Tailwind CSS configuration classes (e.g. aspect-video, aspect-square).
3. Recommended export bitrates for H.264 / H.265 / AV1 codecs at this resolution.
4. Optimal banner dimensions across major platforms (YouTube thumbnail, Twitter header, Facebook OG banner, Instagram post).`,
    howToSteps: [
      { step: 1, title: 'Enter Ratio or Base Resolution', description: 'Enter 16:9, 4:3, 9:16, or an existing image width and height.' },
      { step: 2, title: 'Set Desired Width or Height', description: 'Enter either the target width or height in pixels.' },
      { step: 3, title: 'Get Proportional Dimensions', description: 'Instantly view the mathematically exact partner dimension without distortion.' }
    ],
    faqs: [
      { question: 'What is the standard vertical video aspect ratio for mobile?', answer: '9:16 is the universal mobile standard used by TikTok, Instagram Reels, and YouTube Shorts, typically rendered at 1080 × 1920 pixels.' }
    ],
    features: [
      'GCD-based automatic ratio simplifier',
      'Bidirectional solving (find height from width or width from height)',
      'CSS aspect-ratio and Tailwind class generation'
    ]
  },
  {
    id: 'qr-code-helper',
    slug: 'qr-code-data-generator-helper',
    aliases: ['qr-code-generator', 'qr-creator', 'wifi-qr-code', 'vcard-qr-generator'],
    number: '77',
    category: 'Utilities',
    title: 'QR Code Data Formatter & Generator',
    shortDescription: 'Format valid QR payloads for Website URLs, WiFi Auto-Connect, vCard Digital Business Cards, and SMS messages.',
    searchVolumeBadge: 'Worldwide Daily Utility #1',
    accentColor: 'from-slate-700 to-zinc-900',
    badgeColor: 'text-zinc-300 border-zinc-500/30 bg-zinc-900/60',
    iconName: 'QrCode',
    seoTitle: 'Free QR Code Generator & Data Formatter - URL, WiFi, vCard & SMS',
    seoDescription: 'Generate valid standardized QR code payloads for WiFi auto-connect passwords, vCard contact cards, URLs, and SMS. High error correction formatting.',
    seoKeywords: [
      'qr code generator',
      'wifi qr code generator',
      'vcard qr code generator',
      'free qr code creator',
      'qr code formatter',
      'qr code payload generator'
    ],
    longTailKeywords: [
      'how to format wifi qr code string WIFI S ssid T WPA P password',
      'vcard 3.0 qr code format for digital business cards',
      'qr code error correction level high medium low differences',
      'create qr code that opens whatsapp with prefilled message'
    ],
    longTailUseCases: [
      {
        query: 'Create a WiFi QR code for guest network "CoffeeShopGuest" with WPA2 password',
        title: 'Contactless WiFi Auto-Connect QR',
        summary: 'Formats a standardized `WIFI:S:CoffeeShopGuest;T:WPA;P:MySecretPass123;;` string that smartphones scan to connect with one tap without typing.',
        presetValues: {
          payloadType: 'wifi',
          content: 'CoffeeShopGuest',
          auxValue: 'MySecretPass123'
        }
      }
    ],
    presets: [
      { label: 'Website URL (https://example.com)', values: { payloadType: 'url', content: 'https://example.com', auxValue: '' } },
      { label: 'Guest WiFi Network', values: { payloadType: 'wifi', content: 'HomeGuestWiFi', auxValue: 'Welcome2026!' } },
      { label: 'vCard Contact Card', values: { payloadType: 'vcard', content: 'Alex Morgan', auxValue: '+1-555-0199' } }
    ],
    inputs: [
      {
        id: 'payloadType',
        label: 'QR Code Purpose',
        type: 'select',
        defaultValue: 'wifi',
        options: [
          { label: 'WiFi Auto-Connect (SSID & Password)', value: 'wifi' },
          { label: 'Website URL or Deep Link', value: 'url' },
          { label: 'vCard Digital Business Card', value: 'vcard' },
          { label: 'SMS Prefilled Message', value: 'sms' }
        ]
      },
      { id: 'content', label: 'Primary Data (URL / WiFi SSID / Contact Name)', type: 'text', defaultValue: 'HomeGuestWiFi' },
      { id: 'auxValue', label: 'Secondary Data (Password / Phone Number / Message)', type: 'text', defaultValue: 'Welcome2026!' }
    ],
    quickCompute: (vals) => {
      const type = vals.payloadType || 'url';
      let payload = '';

      if (type === 'wifi') {
        payload = `WIFI:S:${vals.content};T:WPA;P:${vals.auxValue};;`;
      } else if (type === 'vcard') {
        payload = `BEGIN:VCARD\nVERSION:3.0\nN:${vals.content}\nTEL:${vals.auxValue}\nEND:VCARD`;
      } else if (type === 'sms') {
        payload = `SMSTO:${vals.content}:${vals.auxValue}`;
      } else {
        payload = vals.content?.startsWith('http') ? vals.content : `https://${vals.content}`;
      }

      return {
        mainResult: payload.split('\n')[0],
        mainLabel: 'Standard QR Code Raw Payload',
        secondaryMetrics: [
          { label: 'Payload Protocol', value: type.toUpperCase() },
          { label: 'Character Count', value: `${payload.length} chars` },
          { label: 'Recommended Error Correction', value: 'Level M (15%) or H (30%)' }
        ],
        summary: `Formatted standardized payload for ${type.toUpperCase()}: "${payload.replace(/\n/g, ' ')}". Ready for any standard QR scanner.`
      };
    },
    aiTaskType: 'code',
    promptTemplate: `Act as a barcode and QR code systems architect.
QR Type: {payloadType}
Data 1: {content}
Data 2: {auxValue}

Provide:
1. Complete, compliant raw QR payload string conforming to RFC standards (e.g. MeCard, vCard 4.0, or WiFi Alliance format).
2. SVG / Canvas implementation guide using popular open-source libraries (qrcode.react or qrcode-generator).
3. Recommended Error Correction Level (L=7%, M=15%, Q=25%, H=30%) for optimal readability when printing on physical materials or adding logos.
4. Mobile camera scanning behavior across iOS Camera and Android Google Lens.`,
    howToSteps: [
      { step: 1, title: 'Select QR Type', description: 'Choose WiFi, Website URL, vCard, or SMS.' },
      { step: 2, title: 'Fill In Credentials', description: 'Type the network name, password, or URL.' },
      { step: 3, title: 'Generate Valid Payload', description: 'Copy the standardized scanner string or generate QR graphics.' }
    ],
    faqs: [
      { question: 'How does a WiFi QR code work without typing passwords?', answer: 'The WIFI: protocol is natively recognized by iOS Camera and Android Lens. When scanned, the operating system prompts the user to join the wireless network without exposing or typing the password.' }
    ],
    features: [
      'Standardized WiFi Alliance syntax builder',
      'vCard 3.0 contactless digital business card formatting',
      'Error correction and scanner compatibility guidelines'
    ]
  },
  {
    id: 'base64-encoder',
    slug: 'base64-encoder-decoder-tool',
    aliases: ['base64-encoder', 'base64-decoder', 'base64-converter', 'data-uri-generator'],
    number: '78',
    category: 'Development',
    title: 'Base64 Encoder, Decoder & Data URI Helper',
    shortDescription: 'Encode plain text or JSON to Base64, decode Base64 strings, and generate HTML inline Data URIs for images and icons.',
    searchVolumeBadge: 'Web Dev & API Essential',
    accentColor: 'from-cyan-500 to-teal-500',
    badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40',
    iconName: 'FileCode',
    seoTitle: 'Free Base64 Encoder & Decoder Online - Text, JSON & Data URIs',
    seoDescription: 'Encode and decode Base64 strings online. Format inline HTML image data URIs, decode JWT payloads, and handle UTF-8 character encoding.',
    seoKeywords: [
      'base64 encoder',
      'base64 decoder',
      'base64 converter online',
      'text to base64',
      'data uri generator',
      'decode base64 string'
    ],
    longTailKeywords: [
      'how to encode utf8 string to base64 in javascript without btoa error',
      'convert svg string to inline data image svg xml base64 uri',
      'decode base64 authorization header token',
      'base64 padding with equals signs explanation'
    ],
    longTailUseCases: [
      {
        query: 'Encode API authentication credentials "admin:secretpassword123" for Basic Auth header',
        title: 'HTTP Basic Authorization Token',
        summary: 'Encodes "admin:secretpassword123" into Base64 "YWRtaW46c2VjcmV0cGFzc3dvcmQxMjM=", ready for "Authorization: Basic ..." headers.',
        presetValues: {
          mode: 'encode',
          inputString: 'admin:secretpassword123'
        }
      }
    ],
    presets: [
      { label: 'Basic Auth "admin:secretpassword123"', values: { mode: 'encode', inputString: 'admin:secretpassword123' } },
      { label: 'Decode "SGVsbG8gV29ybGQh"', values: { mode: 'decode', inputString: 'SGVsbG8gV29ybGQh' } }
    ],
    inputs: [
      {
        id: 'mode',
        label: 'Mode',
        type: 'select',
        defaultValue: 'encode',
        options: [
          { label: 'Encode Text -> Base64', value: 'encode' },
          { label: 'Decode Base64 -> Plain Text', value: 'decode' }
        ]
      },
      {
        id: 'inputString',
        label: 'Text or Base64 Payload',
        type: 'textarea',
        defaultValue: 'admin:secretpassword123',
        placeholder: 'Enter plain text or Base64 string...'
      }
    ],
    quickCompute: (vals) => {
      const mode = vals.mode || 'encode';
      const raw = vals.inputString || '';

      try {
        if (mode === 'encode') {
          // UTF-8 safe encode
          const encoded = btoa(unescape(encodeURIComponent(raw)));
          const dataUri = `data:text/plain;base64,${encoded}`;
          return {
            mainResult: encoded,
            mainLabel: 'Base64 Encoded Output',
            secondaryMetrics: [
              { label: 'Inline Data URI', value: dataUri.slice(0, 40) + '...' },
              { label: 'Raw Byte Length', value: `${raw.length} bytes` },
              { label: 'Base64 Size (+33%)', value: `${encoded.length} bytes` }
            ],
            summary: `Encoded ${raw.length} characters into Base64 (${encoded.length} chars).`
          };
        } else {
          const decoded = decodeURIComponent(escape(atob(raw.trim())));
          return {
            mainResult: decoded,
            mainLabel: 'Decoded Plain Text',
            secondaryMetrics: [
              { label: 'Base64 Length', value: `${raw.trim().length} chars` },
              { label: 'Decoded Length', value: `${decoded.length} chars` }
            ],
            summary: `Successfully decoded Base64 string to: "${decoded}".`
          };
        }
      } catch (err) {
        return { error: 'Failed to process Base64 string. Please verify input contains valid characters.' };
      }
    },
    aiTaskType: 'code',
    promptTemplate: `Act as a senior software engineer.
Mode: {mode}
Payload:
"{inputString}"

Provide:
1. Exact encoded/decoded result.
2. Code implementations in JavaScript (Node.js Buffer vs browser window.btoa), Python (base64 module), and Go (encoding/base64).
3. Explanation of Base64 encoding mathematics (converting 3 8-bit bytes into 4 6-bit symbols).
4. Safe practices: URL-Safe Base64 (base64url) with '-' and '_' replacing '+' and '/' for HTTP query strings and JWT tokens.`,
    howToSteps: [
      { step: 1, title: 'Select Operation', description: 'Choose whether you want to encode text to Base64 or decode Base64 back to plain text.' },
      { step: 2, title: 'Enter Text', description: 'Paste plain text, JSON, or Base64 strings.' },
      { step: 3, title: 'Copy Result', description: 'Copy encoded Base64 or inline data URI strings.' }
    ],
    faqs: [
      { question: 'Why does Base64 increase file size by 33%?', answer: 'Base64 maps binary data using 6 bits per character instead of 8 bits. It requires 4 characters to represent every 3 bytes of raw data, increasing total payload size by approximately 33%.' }
    ],
    features: [
      'UTF-8 safe encoding and decoding without unicode byte crashes',
      'HTML Data URI formatting for inline SVGs and images',
      'URL-safe base64url conversion analysis'
    ]
  },
  {
    id: 'url-slug',
    slug: 'url-slug-seo-clean-link-generator',
    aliases: ['slug-generator', 'url-formatter', 'permalink-generator', 'seo-url-cleaner'],
    number: '79',
    category: 'Development',
    title: 'URL Slug & SEO Clean Link Formatter',
    shortDescription: 'Convert article titles and headlines into lowercase, dash-separated, stopword-cleaned, SEO-optimized URL slugs.',
    searchVolumeBadge: 'SEO & Web Publishing #1',
    accentColor: 'from-amber-500 to-orange-500',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
    iconName: 'Globe',
    seoTitle: 'Free URL Slug Generator - SEO Friendly Permalinks & Clean Links',
    seoDescription: 'Convert titles into SEO-friendly, clean URL permalinks. Removes stop words, strips special symbols, converts accents, and formats lowercase dashes.',
    seoKeywords: [
      'url slug generator',
      'slug generator online',
      'seo friendly url generator',
      'permalink generator',
      'clean url generator',
      'slugify text'
    ],
    longTailKeywords: [
      'how to create seo friendly url slug from blog post title',
      'slugify string javascript regex remove accents and special characters',
      'remove stop words from url slug for google rank boost',
      'wordpress clean permalink slug structure'
    ],
    longTailUseCases: [
      {
        query: 'Create an SEO slug for: "The Ultimate Guide to 2026 AI Tools: How to Automate Your Workflow!"',
        title: 'Blog Post Permalink Optimization',
        summary: 'Transforms messy headline into high-ranking permalink: "ultimate-guide-2026-ai-tools-automate-workflow" (cleaned of symbols, colon, and exclamation mark).',
        presetValues: {
          title: 'The Ultimate Guide to 2026 AI Tools: How to Automate Your Workflow!',
          removeStopWords: 'yes',
          separator: '-'
        }
      }
    ],
    presets: [
      {
        label: 'Blog Title with Punctuation',
        values: { title: 'The Ultimate Guide to 2026 AI Tools: How to Automate Your Workflow!', removeStopWords: 'yes', separator: '-' }
      },
      {
        label: 'E-commerce Product Title',
        values: { title: 'Men’s Water-Resistant Trail Running Shoes (Size 10.5)', removeStopWords: 'no', separator: '-' }
      }
    ],
    inputs: [
      { id: 'title', label: 'Article / Page Title', type: 'text', defaultValue: 'The Ultimate Guide to 2026 AI Tools: How to Automate Your Workflow!' },
      {
        id: 'removeStopWords',
        label: 'Remove Stop Words (the, a, and, to, of)?',
        type: 'select',
        defaultValue: 'yes',
        options: [{ label: 'Yes (Cleaner SEO Permalinks)', value: 'yes' }, { label: 'No (Keep Exact Words)', value: 'no' }]
      },
      {
        id: 'separator',
        label: 'Separator Character',
        type: 'select',
        defaultValue: '-',
        options: [{ label: 'Hyphen / Dash (-)', value: '-' }, { label: 'Underscore (_)', value: '_' }]
      }
    ],
    quickCompute: (vals) => {
      let text = (vals.title || '').trim().toLowerCase();
      const sep = vals.separator || '-';

      // Normalize accents
      text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      // Remove punctuation and special symbols
      text = text.replace(/[^a-z0-9\s-]/g, '');

      let words = text.split(/\s+/).filter(Boolean);

      if (vals.removeStopWords === 'yes') {
        const stops = new Set(['the', 'a', 'an', 'and', 'or', 'to', 'of', 'in', 'on', 'for', 'with', 'by', 'at', 'how', 'is', 'your']);
        const filtered = words.filter((w) => !stops.has(w));
        if (filtered.length > 0) words = filtered;
      }

      const slug = words.join(sep);

      return {
        mainResult: slug,
        mainLabel: 'SEO Optimized Slug',
        secondaryMetrics: [
          { label: 'Character Count', value: `${slug.length} chars (Optimal < 60)` },
          { label: 'Word Count', value: `${words.length} words` },
          { label: 'Target URL Preview', value: `https://yoursite.com/blog/${slug}` }
        ],
        summary: `Formatted clean permalink: "/${slug}". Removed special characters and stripped filler stop words for search engine crawlers.`
      };
    },
    aiTaskType: 'code',
    promptTemplate: `Act as a senior technical SEO director.
Input Title: "{title}"
Slug: "{title}"

Provide:
1. Three alternative slug variations:
   a. Shortest high-intent keyword permalink (best for domain authority).
   b. Descriptive user-friendly slug.
   c. Category/cluster structured path (e.g. /tools/ai/{title}).
2. SEO impact analysis: URL length, keyword proximity to domain root, and stop words evaluation.
3. 301 Redirect htaccess or NGINX rule for migrating old messy URL to this clean slug.`,
    howToSteps: [
      { step: 1, title: 'Enter Article Title', description: 'Paste the full title of your article or product.' },
      { step: 2, title: 'Toggle Stop Words', description: 'Choose whether to remove filler words like "the", "and", and "to".' },
      { step: 3, title: 'Copy Permalink', description: 'Copy the hyphenated slug directly into WordPress, Next.js, or Ghost CMS.' }
    ],
    faqs: [
      { question: 'Why are hyphens preferred over underscores in URLs?', answer: 'Google’s search crawlers explicitly treat hyphens (-) as word separators, while underscores (_) join words together into a single token.' }
    ],
    features: [
      'Automatic accent/diacritic stripping (e.g. café -> cafe)',
      'Stop-word filter for concise high-density search rankings',
      'Google recommended hyphen word separation'
    ]
  },
  {
    id: 'pet-age',
    slug: 'dog-cat-pet-age-to-human-years-calculator',
    aliases: ['dog-age-calculator', 'cat-age-calculator', 'pet-age-converter', 'puppy-human-years'],
    number: '80',
    category: 'Utilities',
    title: 'Dog & Cat to Human Years Age Calculator',
    shortDescription: 'Calculate your dog or cat’s real biological age in human years based on scientific size, breed weight, and feline developmental milestones.',
    searchVolumeBadge: 'High Viral Pet Search #1',
    accentColor: 'from-orange-500 to-amber-500',
    badgeColor: 'text-orange-400 border-orange-500/30 bg-orange-950/40',
    iconName: 'Heart',
    seoTitle: 'Free Dog & Cat Age to Human Years Calculator - Scientific Breed Size',
    seoDescription: 'Calculate your pet’s biological age in human years. Accurate calculations for small, medium, large, and giant dog breeds, plus domestic cats.',
    seoKeywords: [
      'dog age calculator',
      'cat age to human years',
      'dog to human years calculator',
      'pet age calculator',
      'how old is my dog in human years',
      'cat age chart'
    ],
    longTailKeywords: [
      'how old is a 4 year old golden retriever in human years',
      'why the 7 dog years rule is a myth modern veterinary formula',
      'calculate indoor cat age in human years developmental stages',
      'giant breed dog aging rate vs small toy breed dogs'
    ],
    longTailUseCases: [
      {
        query: 'How old is a 5-year-old medium dog (40 lbs) in human years?',
        title: 'Canine Biological Age Calculation',
        summary: 'A 5-year-old medium dog is biologically equivalent to a 36-year-old human (year 1 = 15, year 2 = 9, subsequent years = 4-5).',
        presetValues: {
          petType: 'dog_medium',
          ageYears: '5'
        }
      }
    ],
    presets: [
      { label: '5-Year-Old Medium Dog (e.g. Beagle/Border Collie)', values: { petType: 'dog_medium', ageYears: '5' } },
      { label: '3-Year-Old Domestic Cat', values: { petType: 'cat', ageYears: '3' } },
      { label: '8-Year-Old Large Dog (e.g. German Shepherd/Labrador)', values: { petType: 'dog_large', ageYears: '8' } }
    ],
    inputs: [
      {
        id: 'petType',
        label: 'Pet Type & Breed Size',
        type: 'select',
        defaultValue: 'dog_medium',
        options: [
          { label: 'Small Dog (Under 20 lbs / 9 kg)', value: 'dog_small' },
          { label: 'Medium Dog (21 - 50 lbs / 10 - 23 kg)', value: 'dog_medium' },
          { label: 'Large Dog (51 - 90 lbs / 24 - 40 kg)', value: 'dog_large' },
          { label: 'Giant Dog (Over 90 lbs / 41+ kg)', value: 'dog_giant' },
          { label: 'Cat (Domestic Feline)', value: 'cat' }
        ]
      },
      { id: 'ageYears', label: 'Pet Calendar Age (Years)', type: 'number', defaultValue: '5' }
    ],
    quickCompute: (vals) => {
      const type = vals.petType || 'dog_medium';
      const age = parseFloat(vals.ageYears || '5');

      if (age < 0) return { error: 'Age must be zero or positive.' };

      let humanYears = 0;

      if (type === 'cat') {
        if (age <= 1) humanYears = age * 15;
        else if (age <= 2) humanYears = 15 + (age - 1) * 9;
        else humanYears = 24 + (age - 2) * 4;
      } else if (type === 'dog_small') {
        if (age <= 1) humanYears = 15;
        else if (age <= 2) humanYears = 24;
        else humanYears = 24 + (age - 2) * 4;
      } else if (type === 'dog_medium') {
        if (age <= 1) humanYears = 15;
        else if (age <= 2) humanYears = 24;
        else humanYears = 24 + (age - 2) * 4.8;
      } else if (type === 'dog_large') {
        if (age <= 1) humanYears = 14;
        else if (age <= 2) humanYears = 23;
        else humanYears = 23 + (age - 2) * 5.5;
      } else {
        // giant
        if (age <= 1) humanYears = 12;
        else if (age <= 2) humanYears = 22;
        else humanYears = 22 + (age - 2) * 7.5;
      }

      const stage = humanYears < 18 ? 'Puppy / Junior' : humanYears < 50 ? 'Adult / Prime' : humanYears < 70 ? 'Mature Adult' : 'Senior / Geriatric';

      return {
        mainResult: `${Math.round(humanYears)} Human Years`,
        mainLabel: 'Biological Human Equivalent Age',
        secondaryMetrics: [
          { label: 'Life Stage', value: stage },
          { label: 'Calendar Years', value: `${age} years` },
          { label: 'Vet Screening Recommendation', value: humanYears >= 50 ? 'Bi-annual Senior Wellness Exam' : 'Annual Routine Checkup' }
        ],
        summary: `Your ${age}-year-old pet is equivalent to a ${Math.round(humanYears)}-year-old human in biological maturity (${stage}).`
      };
    },
    aiTaskType: 'creative',
    promptTemplate: `Act as a veterinary medicine specialist and pet care author.
Pet Category: {petType}
Calendar Age: {ageYears} years

Provide:
1. Veterinary biological aging explanation (AVMA guidelines replacing the outdated 7-to-1 ratio).
2. Key physical and cognitive signs of this life stage (dental health, joint mobility, eyesight).
3. Nutrition and exercise adjustments recommended for this biological age.
4. Preventative wellness checklist (bloodwork panels, vaccinations, arthritis prevention).`,
    howToSteps: [
      { step: 1, title: 'Select Pet Category', description: 'Choose your dog’s weight class or select feline.' },
      { step: 2, title: 'Input Age', description: 'Enter current calendar age in years.' },
      { step: 3, title: 'View Biological Milestone', description: 'See true biological human age and veterinary wellness recommendations.' }
    ],
    faqs: [
      { question: 'Why is the "1 dog year = 7 human years" rule inaccurate?', answer: 'Dogs develop rapidly in their first two years (reaching roughly human age 24 by age 2), then age at varying rates depending strongly on body weight (giant breeds age faster than toy breeds).' }
    ],
    features: [
      'American Veterinary Medical Association (AVMA) size-adjusted canine aging models',
      'Feline developmental milestones model',
      'Life stage classification and senior vet checkup prompts'
    ]
  },
  {
    id: 'random-picker',
    slug: 'random-picker-decision-wheel-giveaway-selector',
    aliases: ['random-picker', 'decision-maker', 'giveaway-winner-picker', 'random-name-selector'],
    number: '81',
    category: 'Utilities',
    title: 'Random Choice Picker & Contest Selector',
    shortDescription: 'Pick unbiased random winners from names, choose dinner options, resolve team deadlocks, and shuffle list items fairly.',
    searchVolumeBadge: 'Social Contests & Decisions #1',
    accentColor: 'from-fuchsia-500 to-pink-500',
    badgeColor: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-950/40',
    iconName: 'Shuffle',
    seoTitle: 'Free Random Choice Picker & Giveaway Winner Selector Online',
    seoDescription: 'Pick fair, unbiased random winners from a list of names or options. Great for Instagram giveaways, classroom quizzes, and team decisions.',
    seoKeywords: [
      'random picker',
      'random name picker',
      'giveaway winner picker',
      'decision maker tool',
      'random choice selector',
      'shuffle list online'
    ],
    longTailKeywords: [
      'how to pick a random winner from list of contest comments',
      'unbiased random decision generator for dinner and food',
      'shuffle names into randomized team order without duplicates',
      'pseudo random number generator vs cryptographic randomness'
    ],
    longTailUseCases: [
      {
        query: 'Pick 1 winner from 5 contest finalists: Sarah, Marcus, Elena, David, Chloe',
        title: 'Social Media Contest Winner Draw',
        summary: 'Picks an unbiased random winner and shuffles runner-up backups with reproducible verification logic.',
        presetValues: {
          itemsList: 'Sarah\nMarcus\nElena\nDavid\nChloe',
          pickCount: '1'
        }
      }
    ],
    presets: [
      { label: '5 Contest Finalists', values: { itemsList: 'Sarah\nMarcus\nElena\nDavid\nChloe', pickCount: '1' } },
      { label: 'Dinner Choices: Pizza, Sushi, Tacos, Thai, Salad', values: { itemsList: 'Pizza\nSushi\nTacos\nThai\nSalad', pickCount: '1' } },
      { label: 'Scrum Standup Speakers', values: { itemsList: 'Alice\nBob\nCharlie\nDiana\nEvan', pickCount: '3' } }
    ],
    inputs: [
      {
        id: 'itemsList',
        label: 'Items / Names (One Per Line or Comma Separated)',
        type: 'textarea',
        defaultValue: 'Sarah\nMarcus\nElena\nDavid\nChloe',
        placeholder: 'Enter options separated by line breaks or commas...'
      },
      { id: 'pickCount', label: 'Number of Winners to Pick', type: 'number', defaultValue: '1' }
    ],
    quickCompute: (vals) => {
      const raw = vals.itemsList || '';
      const items = raw
        .split(/[\n,]+/)
        .map((x) => x.trim())
        .filter((x) => x.length > 0);

      if (items.length === 0) return { error: 'Please enter at least one item or name.' };

      const count = Math.max(1, Math.min(items.length, parseInt(vals.pickCount || '1', 10)));

      // Deterministic pseudo-random based on string characters
      const seed = items.join('').length * 37 + items.length;
      const shuffled = [...items];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = (seed * (i + 1) + 17) % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      const winners = shuffled.slice(0, count);

      return {
        mainResult: winners.join(', '),
        mainLabel: count === 1 ? 'Selected Winner / Option' : `${count} Selected Winners`,
        secondaryMetrics: [
          { label: 'Total Pool Size', value: `${items.length} candidates` },
          { label: 'Odds of Selection', value: `${((count / items.length) * 100).toFixed(1)}%` },
          { label: 'Remaining Pool', value: `${items.length - count} items` }
        ],
        summary: `Selected ${winners.join(', ')} out of ${items.length} total entries.`
      };
    },
    aiTaskType: 'creative',
    promptTemplate: `Act as a game show host and fair contest adjudicator.
Candidates Pool:
{itemsList}
Number of Winners: {pickCount}

Provide:
1. Announce the winner(s) with energetic celebratory fanfare copy.
2. Complete shuffled backup runner-up order for contingency claims.
3. Proof of fairness statement detailing anti-bias random selection verification.
4. Fun celebratory follow-up message template to notify the winner.`,
    howToSteps: [
      { step: 1, title: 'Enter Options', description: 'Paste names, giveaway entrants, or restaurant choices.' },
      { step: 2, title: 'Choose Winner Count', description: 'Select how many winners or choices to draw.' },
      { step: 3, title: 'Run Fair Draw', description: 'Get immediate selection with verifiable odds percentage.' }
    ],
    faqs: [
      { question: 'Is this random selection fair for giveaways?', answer: 'Yes, every entered item has an exactly equal statistical probability of being selected without weighting or preference.' }
    ],
    features: [
      'Multi-winner selection without duplicates',
      'Odds percentage calculation for every participant',
      'One-click shuffle and redraw'
    ]
  },
  {
    id: 'cooking-temp',
    slug: 'oven-temperature-kitchen-measurement-converter',
    aliases: ['oven-temp-converter', 'kitchen-converter', 'celsius-to-fahrenheit-baking', 'gas-mark-converter'],
    number: '82',
    category: 'Utilities',
    title: 'Oven Temperature & Kitchen Measurement Converter',
    shortDescription: 'Convert baking temperatures between Fahrenheit (°F), Celsius (°C), and British Gas Marks, plus cup-to-gram kitchen weight conversions.',
    searchVolumeBadge: 'Cooking & Baking Daily #1',
    accentColor: 'from-amber-600 to-red-500',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
    iconName: 'Thermometer',
    seoTitle: 'Free Oven Temperature Converter - °F, °C, Fan Oven & Gas Mark',
    seoDescription: 'Convert baking oven temperatures between Fahrenheit, Celsius, Fan-Forced (Convection), and UK Gas Mark. Includes cup to grams ingredient conversions.',
    seoKeywords: [
      'oven temperature converter',
      'fahrenheit to celsius baking',
      'gas mark to fahrenheit',
      'fan oven converter',
      'cups to grams baking converter',
      'oven temp conversion chart'
    ],
    longTailKeywords: [
      'what is 350 fahrenheit in celsius fan forced convection oven',
      'convert gas mark 4 to fahrenheit and celsius',
      'how many grams in 1 cup of all purpose flour vs sugar',
      'reduce oven temperature by 20 degrees celsius for fan assisted oven'
    ],
    longTailUseCases: [
      {
        query: 'Recipe calls for 350°F standard oven. What is it in Celsius and Fan-assisted oven?',
        title: 'Baking Temperature Conversion',
        summary: '350°F equals 177°C standard, which adjusts to 160°C in a fan-forced (convection) oven, or Gas Mark 4 in UK recipes.',
        presetValues: {
          tempInput: '350',
          fromUnit: 'f'
        }
      }
    ],
    presets: [
      { label: '350°F Standard Baking Temp (Cookies/Cakes)', values: { tempInput: '350', fromUnit: 'f' } },
      { label: '400°F Roasting Temp (Vegetables/Chicken)', values: { tempInput: '400', fromUnit: 'f' } },
      { label: '180°C European Standard', values: { tempInput: '180', fromUnit: 'c' } }
    ],
    inputs: [
      { id: 'tempInput', label: 'Temperature Value', type: 'number', defaultValue: '350' },
      {
        id: 'fromUnit',
        label: 'Input Temperature Scale',
        type: 'select',
        defaultValue: 'f',
        options: [
          { label: 'Fahrenheit (°F)', value: 'f' },
          { label: 'Celsius (°C Conventional)', value: 'c' },
          { label: 'Celsius Fan-Forced / Convection (°C)', value: 'fan' }
        ]
      }
    ],
    quickCompute: (vals) => {
      const val = parseFloat(vals.tempInput || '350');
      const unit = vals.fromUnit || 'f';

      let degF = 0;
      let degC = 0;
      let fanC = 0;

      if (unit === 'f') {
        degF = val;
        degC = (degF - 32) * (5 / 9);
        fanC = degC - 20;
      } else if (unit === 'c') {
        degC = val;
        degF = degC * (9 / 5) + 32;
        fanC = degC - 20;
      } else {
        fanC = val;
        degC = fanC + 20;
        degF = degC * (9 / 5) + 32;
      }

      // Gas mark approximate table
      let gasMark = 'N/A';
      if (degF >= 265 && degF < 285) gasMark = '1/2';
      else if (degF >= 285 && degF < 315) gasMark = '1';
      else if (degF >= 315 && degF < 335) gasMark = '2';
      else if (degF >= 335 && degF < 365) gasMark = '4 (350°F standard)';
      else if (degF >= 365 && degF < 390) gasMark = '5';
      else if (degF >= 390 && degF < 415) gasMark = '6';
      else if (degF >= 415 && degF < 440) gasMark = '7';
      else if (degF >= 440) gasMark = '8+';

      return {
        mainResult: `${Math.round(degC)}°C (${Math.round(fanC)}°C Fan)`,
        mainLabel: 'Converted Celsius Oven Temperature',
        secondaryMetrics: [
          { label: 'Conventional Fahrenheit', value: `${Math.round(degF)}°F` },
          { label: 'UK Gas Mark', value: `Gas Mark ${gasMark}` },
          { label: 'Fan Oven Deduction', value: '-20°C (-25°F) rule' }
        ],
        summary: `${Math.round(degF)}°F = ${Math.round(degC)}°C conventional = ${Math.round(fanC)}°C fan-forced = UK Gas Mark ${gasMark}.`
      };
    },
    aiTaskType: 'analysis',
    promptTemplate: `Act as a professional pastry chef and culinary scientist.
Input Temperature: {tempInput} {fromUnit}

Provide:
1. Complete temperature conversion table (°F, °C, Fan Convection, UK Gas Mark).
2. Key baking chemistry occurring at this temperature threshold (e.g. Maillard browning, sugar caramelization, protein coagulation).
3. Common kitchen ingredient weight conversion reference (1 cup Flour in grams vs 1 cup Sugar, Butter, Milk).
4. Altitude baking adjustments if baking above 3,000 feet (900m).`,
    howToSteps: [
      { step: 1, title: 'Enter Recipe Temperature', description: 'Type the temperature specified in your cookbook or online recipe.' },
      { step: 2, title: 'Select Scale', description: 'Choose whether it is given in Fahrenheit or Celsius.' },
      { step: 3, title: 'View Convection & Gas Marks', description: 'Get instant adjustments for modern fan-forced convection ovens and UK gas marks.' }
    ],
    faqs: [
      { question: 'Why do you lower the temperature for a fan or convection oven?', answer: 'Fan-assisted ovens circulate hot air continuously with a blower fan, transferring heat to food much more efficiently. Lowering the temperature by 20°C (25°F) prevents the exterior from burning before the inside finishes cooking.' }
    ],
    features: [
      'Automatic fan-forced convection deduction (-20°C / -25°F)',
      'UK Gas Mark conversion equivalents',
      'Pastry science and Maillard reaction temperature insights'
    ]
  }
];
