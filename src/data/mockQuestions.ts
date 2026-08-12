import { Question } from '../types';
import { VARG1_HINDI_150_QUESTIONS } from './varg1HindiFullPaper';
import { VARG1_ENGLISH_150_QUESTIONS } from './varg1EnglishFullPaper';
import { VARG1_SANSKRIT_150_QUESTIONS } from './varg1SanskritFullPaper';
import { VARG1_MATHS_150_QUESTIONS } from './varg1MathsFullPaper';
import { VARG1_PHYSICS_150_QUESTIONS } from './varg1PhysicsFullPaper';
import { VARG1_CHEMISTRY_150_QUESTIONS } from './varg1ChemistryFullPaper';
import { VARG2_MATHS_120_QUESTIONS } from './varg2MathsFullPaper';
import { VARG2_SOCIAL_SCIENCE_120_QUESTIONS } from './varg2SocialScienceFullPaper';

export const BASE_QUESTIONS: Record<string, Partial<Question>[]> = {
  CDP: [
    { questionText: "पियाजे के अनुसार, विकास के पहले चरण (जन्म से लगभग 2 वर्ष तक) के दौरान, बच्चा सबसे बेहतर तरीके से कैसे सीखता है?", options: ["इंद्रियों के प्रयोग द्वारा", "अमूर्त शब्दों को समझने द्वारा", "अमूर्त तरीके से सोचने द्वारा", "भाषा के नए अर्जित ज्ञान को लागू करके"], correctAnswer: "इंद्रियों के प्रयोग द्वारा" },
    { questionText: "सबसे गहन और महत्वपूर्ण समाजीकरण कब होता है?", options: ["पूरे जीवन भर", "किशोरावस्था के दौरान", "प्रारंभिक बचपन के दौरान", "वयस्कता के दौरान"], correctAnswer: "किशोरावस्था के दौरान" },
    { questionText: "शिक्षण-अधिगम प्रक्रिया में व्यक्तिगत ध्यान देना महत्वपूर्ण है क्योंकि:", options: ["शिक्षार्थी हमेशा समूहों में बेहतर सीखते हैं", "शिक्षक प्रशिक्षण कार्यक्रम इसकी अनुशंसा करते हैं", "यह शिक्षकों को प्रत्येक शिक्षार्थी को अनुशासित करने के बेहतर अवसर प्रदान करता है", "बच्चों के विकास की दर अलग-अलग होती है और वे अलग-अलग तरीके से सीखते हैं"], correctAnswer: "बच्चों के विकास की दर अलग-अलग होती है और वे अलग-अलग तरीके से सीखते हैं" },
  ],
  Hindi: [
    { questionText: "हिन्दी साहित्य के इतिहास लेखन का सर्वप्रथम प्रयास किसने किया था?", options: ["आचार्य रामचंद्र शुक्ल", "ग्रियर्सन", "गार्सा-द-तासी", "शिवसिंह सेंगर"], correctAnswer: "गार्सा-द-तासी" },
    { questionText: "'आदिकाल' को 'वीरगाथा काल' का नाम किसने दिया?", options: ["हजारी प्रसाद द्विवेदी", "डॉ. रामकुमार वर्मा", "आचार्य रामचंद्र शुक्ल", "राहुल सांकृत्यायन"], correctAnswer: "आचार्य रामचंद्र शुक्ल" },
    { questionText: "'पृथ्वीराज रासो' किस काल की रचना है?", options: ["भक्तिकल", "रीतिकाल", "आदिकाल", "आधुनिक काल"], correctAnswer: "आदिकाल" },
    { questionText: "अष्टछाप की स्थापना किसने की थी?", options: ["वल्लभाचार्य", "विट्ठलनाथ", "सूरदास", "रामानंद"], correctAnswer: "विट्ठलनाथ" },
  ],
  GK: [
    { questionText: "मध्य प्रदेश की 'संस्कार धानी' किसे कहा जाता है?", options: ["भोपाल", "इंदौर", "जबलपुर", "ग्वालियर"], correctAnswer: "जबलपुर" },
    { questionText: "सांची का स्तूप मध्य प्रदेश के किस जिले में स्थित है?", options: ["रायसेन", "विदिशा", "सीहोर", "भोपाल"], correctAnswer: "रायसेन" },
    { questionText: "मध्य प्रदेश का राज्य पशु कौन सा है?", options: ["बारहसिंगा", "टाइगर", "सांभर", "चीता"], correctAnswer: "बारहसिंगा" },
  ]
};

export const PART_A_COMMON: Partial<Question>[] = [
  // खंड 1: सामान्य हिन्दी (8 प्रश्न)
  { questionText: "'अमृत' शब्द का सही विलोम क्या है?", options: ["पीयूष", "विष", "सुधा", "जल"], correctAnswer: "विष", section: "General Hindi" },
  { questionText: "'नीलकंठ' में कौन सा समास है?", options: ["अव्ययीभाव समास", "तत्पुरुष समास", "बहुव्रीहि समास", "कर्मधारय समास"], correctAnswer: "बहुव्रीहि समास", section: "General Hindi" },
  { questionText: "'आँखों का तारा होना' मुहावरे का सही अर्थ क्या है?", options: ["बहुत प्यारा होना", "आँखों की रोशनी बढ़ना", "दुश्मन होना", "तारे गिनना"], correctAnswer: "बहुत प्यारा होना", section: "General Hindi" },
  { questionText: "निम्नलिखित में से शुद्ध वर्तनी वाला शब्द चुनिए:", options: ["आशिर्वाद", "अशिर्वाद", "आशीर्वाद", "आशिरवाद"], correctAnswer: "आशीर्वाद", section: "General Hindi" },
  { questionText: "'सूर्य' का पर्यायवाची शब्द नहीं है?", options: ["दिनकर", "भास्कर", "रजनीचर", "दिवाकर"], correctAnswer: "रजनीचर", section: "General Hindi" },
  { questionText: "'महोत्सव' शब्द का सही संधि-विच्छेद क्या होगा?", options: ["महो + उत्सव", "महा + उत्सव", "मह + उत्सव", "मही + उत्सव"], correctAnswer: "महा + उत्सव", section: "General Hindi" },
  { questionText: "जो सब कुछ जानता हो, उसे क्या कहते हैं?", options: ["अज्ञानी", "विशेषज्ञ", "सर्वज्ञ", "कृतज्ञ"], correctAnswer: "सर्वज्ञ", section: "General Hindi" },
  { questionText: "'आग' का तत्सम रूप क्या है?", options: ["अग्नि", "अनल", "पावक", "दहन"], correctAnswer: "अग्नि", section: "General Hindi" },

  // खंड 2: सामान्य अंग्रेज़ी (General English) (5 प्रश्न)
  { questionText: "Choose the correct article: \"He is _____ honest man.\"", options: ["a", "an", "the", "No article"], correctAnswer: "an", section: "General English" },
  { questionText: "Fill in the blank with the correct preposition: \"The book is _____ the table.\"", options: ["in", "on", "at", "over"], correctAnswer: "on", section: "General English" },
  { questionText: "Choose the synonym for the word 'BEAUTIFUL':", options: ["Ugly", "Pretty", "Dirty", "Bad"], correctAnswer: "Pretty", section: "General English" },
  { questionText: "Choose the correct tense: \"They _____ playing football yesterday.\"", options: ["is", "are", "was", "were"], correctAnswer: "were", section: "General English" },
  { questionText: "What is the antonym of 'STRONG'?", options: ["Weak", "Powerful", "Heavy", "Hard"], correctAnswer: "Weak", section: "General English" },

  // खंड 3: सामान्य ज्ञान, समसामयिक घटनाक्रम, तार्किक और आंकिक योग्यता (7 प्रश्न)
  { questionText: "मध्य प्रदेश की 'संस्कार धानी' किसे कहा जाता है?", options: ["भोपाल", "इंदौर", "जबलपुर", "ग्वालियर"], correctAnswer: "जबलपुर", section: "GK & Reasoning" },
  { questionText: "सांची का स्तूप मध्य प्रदेश के किस जिले में स्थित है?", options: ["रायसेन", "विदिशा", "सीहोर", "भोपाल"], correctAnswer: "रायसेन", section: "GK & Reasoning" },
  { questionText: "श्रृंखला को पूरा करें: 2, 4, 8, 16, ?", options: ["24", "32", "20", "64"], correctAnswer: "32", section: "GK & Reasoning" },
  { questionText: "यदि 'A', 'B' का भाई है और 'C', 'A' की माता है, तो 'B' का 'C' से क्या संबंध है?", options: ["पिता", "पुत्र या पुत्री", "चाचा", "दादा"], correctAnswer: "पुत्र या पुत्री", section: "GK & Reasoning" },
  { questionText: "कंप्यूटर में 'RAM' का पूर्ण रूप (Full Form) क्या है?", options: ["Read Access Memory", "Random Access Memory", "Run Accept Memory", "Real Active Memory"], correctAnswer: "Random Access Memory", section: "GK & Reasoning" },
  { questionText: "इनमें से कौन सा एक 'इनपुट डिवाइस' (Input Device) है?", options: ["मॉनिटर", "प्रिंटर", "कीबोर्ड", "स्पीकर"], correctAnswer: "कीबोर्ड", section: "GK & Reasoning" },
  { questionText: "वर्तमान में (2024-25) भारत के शिक्षा मंत्री कौन हैं?", options: ["अमित शाह", "राजनाथ सिंह", "धर्मेंद्र प्रधान", "स्मृति ईरानी"], correctAnswer: "धर्मेंद्र प्रधान", section: "GK & Reasoning" },

  // खंड 4: शिक्षाशास्त्र (Pedagogy) (10 प्रश्न)
  { questionText: "राष्ट्रीय शिक्षा नीति (NEP) 2020 के अनुसार नई स्कूल शिक्षा प्रणाली का ढांचा क्या है?", options: ["10+2", "5+3+3+4", "5+4+3+3", "8+4+2+2"], correctAnswer: "5+3+3+4", section: "Pedagogy" },
  { questionText: "'समीपस्थ विकास का क्षेत्र' (ZPD - Zone of Proximal Development) का सिद्धांत किसने दिया?", options: ["जीन पियाजे", "लेव वाइगोत्स्की", "अल्बर्ट बंडूरा", "बी.एफ. स्किनर"], correctAnswer: "लेव वाइगोत्स्की", section: "Pedagogy" },
  { questionText: "समावेशी शिक्षा (Inclusive Education) का मुख्य उद्देश्य क्या है?", options: ["केवल विकलांग बच्चों को पढ़ाना", "केवल प्रतिभाशाली बच्चों को पढ़ाना", "सभी बच्चों (सामान्य और विशेष) को एक ही कक्षा में समान अवसर देना", "बच्चों को उनकी जाति के आधार पर अलग करना"], correctAnswer: "सभी बच्चों (सामान्य और विशेष) को एक ही कक्षा में समान अवसर देना", section: "Pedagogy" },
  { questionText: "पढ़ने में कठिनाई (Reading disorder) को मनोवैज्ञानिक भाषा में क्या कहा जाता है?", options: ["डिस्लेक्सिया (Dyslexia)", "डिस्ग्राफिया (Dysgraphia)", "डिस्केलकुलिया (Dyscalculia)", "अफेज़िया (Aphasia)"], correctAnswer: "डिस्लेक्सिया (Dyslexia)", section: "Pedagogy" },
  { questionText: "रचनात्मक मूल्यांकन (Formative Assessment) का मुख्य उद्देश्य क्या है?", options: ["छात्रों को पास या फेल करना", "साल के अंत में ग्रेड देना", "सीखने की प्रक्रिया के दौरान छात्रों की प्रगति को जाँचना और सुधार करना", "छात्रों के बीच प्रतिस्पर्धा बढ़ाना"], correctAnswer: "सीखने की प्रक्रिया के दौरान छात्रों की प्रगति को जाँचना और सुधार करना", section: "Pedagogy" },
  { questionText: "आर.टी.ई. एक्ट (RTE Act) 2009 के अनुसार, कक्षा 1 से 5 तक के लिए शिक्षक-छात्र अनुपात क्या होना चाहिए?", options: ["1:40", "1:30", "1:50", "1:25"], correctAnswer: "1:30", section: "Pedagogy" },
  { questionText: "जीन पियाजे के अनुसार, बच्चा किस अवस्था में 'अमूर्त तार्किक सोच' (Abstract logical thinking) विकसित करता है?", options: ["संवेदी-गामक अवस्था (Sensorimotor stage)", "पूर्व-संक्रियात्मक अवस्था (Pre-operational stage)", "मूर्त संक्रियात्मक अवस्था (Concrete operational stage)", "औपचारिक संक्रियात्मक अवस्था (Formal operational stage)"], correctAnswer: "औपचारिक संक्रियात्मक अवस्था (Formal operational stage)", section: "Pedagogy" },
  { questionText: "एक अच्छा शिक्षक वह है जो:", options: ["कक्षा में सख्त अनुशासन बनाए रखे", "छात्रों को रटने के लिए प्रेरित करे", "छात्रों को स्वयं सीखने और प्रश्न पूछने के लिए प्रेरित करे (सुविधादाता के रूप में)", "केवल होशियार बच्चों पर ध्यान दे"], correctAnswer: "छात्रों को स्वयं सीखने और प्रश्न पूछने के लिए प्रेरित करे (सुविधादाता के रूप में)", section: "Pedagogy" },
  { questionText: "'किंडरगार्टन' (Kindergarten) शिक्षा पद्धति के जनक कौन थे?", options: ["मारिया मांटेसरी", "फ्रेडरिक फ्रोबेल", "जॉन डीवी", "रूसो"], correctAnswer: "फ्रेडरिक फ्रोबेल", section: "Pedagogy" },
  { questionText: "दृश्य-श्रव्य सामग्री (Audio-Visual Aids) का उपयोग कक्षा में क्यों किया जाता है?", options: ["केवल शिक्षक का समय बचाने के लिए", "कक्षा को सुंदर बनाने के लिए", "अधिगम (Learning) को अधिक रोचक, स्थायी और प्रभावी बनाने के लिए", "छात्रों को डराने के लिए"], correctAnswer: "अधिगम (Learning) को अधिक रोचक, स्थायी और प्रभावी बनाने के लिए", section: "Pedagogy" },
];

// Seed generator for randomness per testId
function getTestSeed(testId?: string): number {
  if (!testId) return 1;
  let hash = 0;
  for (let i = 0; i < testId.length; i++) {
    hash = (hash << 5) - hash + testId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 1000 + 1;
}

// --- DYNAMIC QUESTION GENERATORS (PRODUCING 120+ UNIQUE QUESTIONS PER SUBJECT) ---

function generateMathQuestion(index: number, testSeed: number): Partial<Question> {
  const seed = index + testSeed * 13;
  const a = (seed * 7 + 3) % 20 + 2;
  const b = (seed * 11 + 5) % 30 + 3;
  const c = a * b;
  const p = (seed * 150) % 5000 + 1000;
  const r = (seed % 8) + 4;
  const t = (seed % 5) + 1;
  const si = (p * r * t) / 100;
  const radius = (seed % 10 + 1) * 7;
  const area = (22 / 7) * radius * radius;
  const side = (seed % 15) + 5;

  const mathTemplates = [
    {
      questionText: `यदि ${a}x + ${b} = ${a * 10 + b}, तो x का मान ज्ञात कीजिए।`,
      options: [`10`, `${10 + (seed % 3) + 1}`, `${10 - (seed % 2 + 1)}`, `15`],
      correctAnswer: `10`
    },
    {
      questionText: `₹${p} की राशि पर ${r}% वार्षिक साधारण ब्याज की दर से ${t} वर्ष का ब्याज कितना होगा?`,
      options: [`₹${si}`, `₹${si + 50}`, `₹${si - 40}`, `₹${si + 100}`],
      correctAnswer: `₹${si}`
    },
    {
      questionText: `दो संख्याओं का गुणनफल ${c} है। यदि उनका HCF ${a} है, तो उनका LCM ज्ञात कीजिए।`,
      options: [`${b}`, `${b + 4}`, `${b * 2}`, `${b + 10}`],
      correctAnswer: `${b}`
    },
    {
      questionText: `एक वृत्ताकार मैदान की त्रिज्या ${radius} मीटर है। इस मैदान का क्षेत्रफल कितना होगा? (π = 22/7)`,
      options: [`${area} वर्ग मीटर`, `${area + 50} वर्ग मीटर`, `${area - 30} वर्ग मीटर`, `${area * 2} वर्ग मीटर`],
      correctAnswer: `${area} वर्ग मीटर`
    },
    {
      questionText: `एक दुकानदार ₹${p} में एक वस्तु खरीदकर उसे ₹${p + (p * r / 100)} में बेचता है। लाभ प्रतिशत कितना है?`,
      options: [`${r}%`, `${r + 2}%`, `${r - 1}%`, `${r * 2}%`],
      correctAnswer: `${r}%`
    },
    {
      questionText: `समानांतर श्रेणी (A.P.) ${a}, ${a + b}, ${a + 2 * b}... का ${t + 5}वाँ पद क्या होगा?`,
      options: [`${a + (t + 4) * b}`, `${a + (t + 5) * b}`, `${a + (t + 3) * b}`, `${(a + b) * t}`],
      correctAnswer: `${a + (t + 4) * b}`
    },
    {
      questionText: `समकोण त्रिभुज में यदि लम्ब = ${a * 3} सेमी और आधार = ${a * 4} सेमी है, तो कर्ण की लंबाई कितनी होगी?`,
      options: [`${a * 5} सेमी`, `${a * 6} सेमी`, `${a * 7} सेमी`, `${a * 4} सेमी`],
      correctAnswer: `${a * 5} सेमी`
    },
    {
      questionText: `यदि tan(θ) = ${a}/${b}, तो cot(θ) का मान क्या होगा?`,
      options: [`${b}/${a}`, `${a}/${b}`, `${a + b}/${a}`, `${b}/${a + b}`],
      correctAnswer: `${b}/${a}`
    },
    {
      questionText: `प्रथम ${a + 5} प्राकृत संख्याओं का औसत (Mean) क्या होगा?`,
      options: [`${(a + 6) / 2}`, `${a + 5}`, `${(a + 5) / 2}`, `${a + 3}`],
      correctAnswer: `${(a + 6) / 2}`
    },
    {
      questionText: `एक वर्ग की प्रत्येक भुजा ${side} सेमी है। इसके विकर्ण (Diagonal) की लंबाई क्या होगी?`,
      options: [`${side}√2 सेमी`, `${side * 2} सेमी`, `${side}√3 सेमी`, `${side + 2} सेमी`],
      correctAnswer: `${side}√2 सेमी`
    },
    {
      questionText: `द्विघात समीकरण x² - ${a + b}x + ${a * b} = 0 के मूल (Roots) क्या होंगे?`,
      options: [`${a} और ${b}`, `${-a} और ${-b}`, `${a} और ${-b}`, `${-a} और ${b}`],
      correctAnswer: `${a} और ${b}`
    },
    {
      questionText: `यदि किसी घन (Cube) की भुजा ${a} सेमी है, तो उसका कुल पृष्ठीय क्षेत्रफल (Total Surface Area) कितना होगा?`,
      options: [`${6 * a * a} वर्ग सेमी`, `${a * a * a} घन सेमी`, `${4 * a * a} वर्ग सेमी`, `${12 * a} सेमी`],
      correctAnswer: `${6 * a * a} वर्ग सेमी`
    },
    {
      questionText: `समीकरण निकाय 2x + 3y = ${2 * a + 3 * b} तथा 3x - y = ${3 * a - b} में y का मान क्या है?`,
      options: [`${b}`, `${a}`, `${a + b}`, `${b - 1}`],
      correctAnswer: `${b}`
    },
    {
      questionText: `लॉग (Logarithm) नियम के अनुसार log(${a} × ${b}) का मान किसके बराबर होता है?`,
      options: [`log(${a}) + log(${b})`, `log(${a}) - log(${b})`, `log(${a}) × log(${b})`, `log(${a}) / log(${b})`],
      correctAnswer: `log(${a}) + log(${b})`
    },
    {
      questionText: `यदि एक बेलन (Cylinder) की त्रिज्या ${radius / 7} सेमी और ऊँचाई ${a} सेमी है, तो उसका आयतन कितना होगा? (π = 22/7)`,
      options: [`${(22 / 7) * (radius / 7) * (radius / 7) * a} घन सेमी`, `${2 * (22 / 7) * (radius / 7) * a} वर्ग सेमी`, `${(22 / 7) * (radius / 7) * a} घन सेमी`, `${44 * a} घन सेमी`],
      correctAnswer: `${(22 / 7) * (radius / 7) * (radius / 7) * a} घन सेमी`
    }
  ];

  return mathTemplates[(index - 1) % mathTemplates.length];
}

function generatePhysicsQuestion(index: number, testSeed: number): Partial<Question> {
  const seed = index + testSeed * 17;
  const m = (seed % 15) + 2;
  const a = (seed % 10) + 1;
  const f = m * a;
  const v = (seed % 20) + 5;
  const ke = 0.5 * m * v * v;
  const r1 = (seed % 10) + 2;
  const r2 = (seed % 10) + 3;
  const reqSeries = r1 + r2;

  const physicsTopics = [
    { questionText: `यदि ${m} किग्रा के पिंड पर बल लगाने से उसमें ${a} m/s² का त्वरण उत्पन्न होता है, तो लगाए गए बल (Force) का मान क्या होगा?`, options: [`${f} न्यूटन`, `${f + 5} न्यूटन`, `${f - 2} न्यूटन`, `${f * 2} न्यूटन`], correctAnswer: `${f} न्यूटन` },
    { questionText: `द्रव्यमान ${m} किग्रा का एक पिंड ${v} m/s के वेग से गतिमान है। इसकी गतिज ऊर्जा (Kinetic Energy) कितनी होगी?`, options: [`${ke} जूल`, `${ke + 10} जूल`, `${ke / 2} जूल`, `${ke * 2} जूल`], correctAnswer: `${ke} जूल` },
    { questionText: `श्रेणीक्रम (Series Connection) में जुड़े ${r1} Ω और ${r2} Ω के प्रतिरोधों का तुल्य प्रतिरोध (Equivalent Resistance) कितना होगा?`, options: [`${reqSeries} Ω`, `${(r1 * r2) / (r1 + r2)} Ω`, `${r1} Ω`, `${r2} Ω`], correctAnswer: `${reqSeries} Ω` },
    { questionText: "अंतर्राष्ट्रीय मात्रक प्रणाली (SI System) में बल का मात्रक क्या है?", options: ["न्यूटन (Newton)", "जूल (Joule)", "पास्कल (Pascal)", "वाट (Watt)"], correctAnswer: "न्यूटन (Newton)" },
    { questionText: "प्रकाश का पूर्ण आंतरिक परावर्तन किस उपकरण में प्रयुक्त होता है?", options: ["ऑप्टिकल फाइबर (Optical Fiber)", "समतल दर्पण", "उत्तल लेंस", "अवतल लेंस"], correctAnswer: "ऑप्टिकल फाइबर (Optical Fiber)" },
    { questionText: "ध्वनि की चाल सर्वाधिक किस माध्यम में होती है?", options: ["ठोस (Steel)", "द्रव (Water)", "गैस (Air)", "निर्वात (Vacuum)"], correctAnswer: "ठोस (Steel)" },
    { questionText: "उत्तल लेंस (Convex Lens) की क्षमता (Power) का मात्रक क्या है?", options: ["डायोप्टर (Diopter)", "लुमेन", "कैंडेला", "वाट"], correctAnswer: "डायोप्टर (Diopter)" },
    { questionText: "ओह्म के नियम (Ohm's Law) का गणितीय सूत्र क्या है?", options: ["V = IR", "P = VI", "F = ma", "E = mc²"], correctAnswer: "V = IR" },
    { questionText: "परमाणु के केंद्रक (Nucleus) में कौन से कण पाए जाते हैं?", options: ["प्रोटॉन और न्यूट्रॉन", "इलेक्ट्रॉन और प्रोटॉन", "केवल इलेक्ट्रॉन", "न्यूट्रॉन और इलेक्ट्रॉन"], correctAnswer: "प्रोटॉन और न्यूट्रॉन" },
    { questionText: "न्यूटन के गति के किस नियम को 'जड़त्व का नियम' (Law of Inertia) कहा जाता है?", options: ["प्रथम नियम", "द्वितीय नियम", "तृतीय नियम", "गुरुत्वाकर्षण नियम"], correctAnswer: "प्रथम नियम" },
    { questionText: "सूर्य की ऊर्जा का मुख्य स्रोत कौन सी प्रक्रिया है?", options: ["नाभकीय संलयन (Nuclear Fusion)", "नाभिकीय विखंडन", "रासायनिक दहन", "रेडियोधर्मिता"], correctAnswer: "नाभकीय संलयन (Nuclear Fusion)" },
    { questionText: "समताप मंडल में ओजोन परत हमारी रक्षा किससे करती है?", options: ["पराबैंगनी किरणों (UV Rays) से", "अवरक्त किरणों से", "गामा किरणों से", "एक्स-किरणों से"], correctAnswer: "पराबैंगनी किरणों (UV Rays) से" },
    { questionText: "एक अश्वशक्ति (Horse Power - HP) में कितने वाट होते हैं?", options: ["746 वाट", "750 वाट", "1000 वाट", "500 वाट"], correctAnswer: "746 वाट" },
    { questionText: "आकाश का रंग नीला दिखाई देने का मुख्य कारण क्या है?", options: ["प्रकाश का प्रकीर्णन (Scattering)", "प्रकाश का अपवर्तन", "प्रकाश का परावर्तन", "प्रकाश का विवर्तन"], correctAnswer: "प्रकाश का प्रकीर्णन (Scattering)" },
    { questionText: "मानव नेत्र में किसी वस्तु का प्रतिबिंब कहाँ बनता है?", options: ["रेटीना (Retina)", "कॉर्निया", "पुतली", "आयरिस"], correctAnswer: "रेटीना (Retina)" }
  ];

  return physicsTopics[(index - 1) % physicsTopics.length];
}

function generateChemistryQuestion(index: number, testSeed: number): Partial<Question> {
  const chemistryTopics = [
    { questionText: "आधुनिक आवर्त सारणी में आवर्तों (Periods) की कुल संख्या कितनी है?", options: ["7", "18", "8", "12"], correctAnswer: "7" },
    { questionText: "अम्लीय विलयन (Acidic Solution) का pH मान कितना होता है?", options: ["7 से कम", "7 के बराबर", "7 से अधिक", "14"], correctAnswer: "7 से कम" },
    { questionText: "साधारण नमक का रासायनिक नाम और सूत्र क्या है?", options: ["सोडियम क्लोराइड (NaCl)", "सोडियम बायकार्बोनेट (NaHCO3)", "सोडियम हाइड्रोक्साइड (NaOH)", "कैल्शियम कार्बोनेट (CaCO3)"], correctAnswer: "सोडियम क्लोराइड (NaCl)" },
    { questionText: "जल का अणुभार (Molecular Weight of H2O) कितना होता है?", options: ["18 g/mol", "16 g/mol", "20 g/mol", "32 g/mol"], correctAnswer: "18 g/mol" },
    { questionText: "प्लास्टर ऑफ पेरिस (Plaster of Paris) का सही रासायनिक सूत्र क्या है?", options: ["CaSO4 · 1/2 H2O", "CaSO4 · 2 H2O", "CuSO4 · 5 H2O", "MgSO4 · 7 H2O"], correctAnswer: "CaSO4 · 1/2 H2O" },
    { questionText: "किस गैस को 'लाफिंग गैस' (Laughing Gas) कहा जाता है?", options: ["नाइट्रस ऑक्साइड (N2O)", "नाइट्रिक ऑक्साइड (NO)", "नाइट्रोजन डाइऑक्साइड (NO2)", "अमोनिया (NH3)"], correctAnswer: "नाइट्रस ऑक्साइड (N2O)" },
    { questionText: "कार्बन का सबसे कठोर अपररूप (Allotrope) कौन सा है?", options: ["हीरा (Diamond)", "ग्रेफाइट", "फुलेरीन", "कोयला"], correctAnswer: "हीरा (Diamond)" },
    { questionText: "बॉयल का नियम (Boyle's Law) स्थिर ताप पर दाब (P) और आयतन (V) में क्या संबंध बताता है?", options: ["P ∝ 1/V", "P ∝ V", "P ∝ T", "V ∝ T"], correctAnswer: "P ∝ 1/V" },
    { questionText: "सिरके (Vinegar) में कौन सा अम्ल पाया जाता है?", options: ["एसिटिक अम्ल (Acetic Acid)", "साइट्रिक अम्ल", "टार्टरिक अम्ल", "फॉर्मिक अम्ल"], correctAnswer: "एसिटिक अम्ल (Acetic Acid)" },
    { questionText: "लोहे पर जस्ते की परत चढ़ाने की प्रक्रिया को क्या कहते हैं?", options: ["गैल्वनीकरण (Galvanization)", "ऑक्सीकरण", "विद्युत अपघटन", "आसवन"], correctAnswer: "गैल्वनीकरण (Galvanization)" },
    { questionText: "खाने वाले सोडे (Baking Soda) का रासायनिक नाम क्या है?", options: ["सोडियम बायकार्बोनेट", "सोडियम कार्बोनेट", "सोडियम नाइट्रेट", "कैल्शियम कार्बोनेट"], correctAnswer: "सोडियम बायकार्बोनेट" },
    { questionText: "आवर्त सारणी में 'शून्य समूह' (Zero Group / Group 18) के तत्वों को क्या कहा जाता है?", options: ["उत्कृष्ट गैसें (Noble Gases)", "क्षार धातुएँ", "हैलोजन", "संक्रमण तत्व"], correctAnswer: "उत्कृष्ट गैसें (Noble Gases)" },
    { questionText: "दूध से दही बनने की प्रक्रिया में कौन सा बैक्टीरिया सहायक होता है?", options: ["लैक्टोबैसिलस (Lactobacillus)", "राइजोबियम", "ई-कोलाई", "स्ट्रैप्टोकोकस"], correctAnswer: "लैक्टोबैसिलस (Lactobacillus)" },
    { questionText: "शुद्ध जल का pH मान कितना होता है?", options: ["7", "0", "14", "5.6"], correctAnswer: "7" },
    { questionText: "निम्नलिखित में से कौन सा एक भौतिक परिवर्तन (Physical Change) है?", options: ["जल का बर्फ में जमना", "लोहे पर जंग लगना", "दूध का खट्टा होना", "कागज का जलना"], correctAnswer: "जल का बर्फ में जमना" }
  ];

  return chemistryTopics[(index - 1) % chemistryTopics.length];
}

function generateBiologyQuestion(index: number, testSeed: number): Partial<Question> {
  const bioTopics = [
    { questionText: "मानव शरीर की सबसे बड़ी ग्रंथि (Largest Gland) कौन सी है?", options: ["यकृत (Liver)", "अग्न्याशय (Pancreas)", "थायरॉइड", "पीयूष ग्रंथि"], correctAnswer: "यकृत (Liver)" },
    { questionText: "पौधों में जल एवं खनिज लवणों का संवहन किस ऊतक द्वारा होता है?", options: ["जाइलम (Xylem)", "फ्लोएम (Phloem)", "मृदूतक", "दृढ़ऊतक"], correctAnswer: "जाइलम (Xylem)" },
    { questionText: "आनुवंशिकी के जनक (Father of Genetics) किसे माना जाता है?", options: ["ग्रेगर जॉन मेंडल", "चार्ल्स डार्विन", "लैमार्क", "ह्यूगो डी ब्रीज"], correctAnswer: "ग्रेगर जॉन मेंडल" },
    { questionText: "मानव रक्त का सर्वदाता (Universal Donor) समूह कौन सा है?", options: ["O निगेटिव (O-)", "AB पॉजिटिव (AB+)", "A पॉजिटिव", "B निगेटिव"], correctAnswer: "O निगेटिव (O-)" },
    { questionText: "प्रकाश संश्लेषण की प्रक्रिया में पौधों द्वारा कौन सी गैस छोड़ी जाती है?", options: ["ऑक्सीजन (O2)", "कार्बन डाइऑक्साइड (CO2)", "नाइट्रोजन", "जलवाष्प"], correctAnswer: "ऑक्सीजन (O2)" },
    { questionText: "'कोशिका की आत्मघाती थैली' (Suicidal Bag of Cell) किसे कहा जाता है?", options: ["लाइसोसोम (Lysosome)", "राइबोसोम", "माइटोकॉन्ड्रिया", "गोलजीकाय"], correctAnswer: "लाइसोसोम (Lysosome)" },
    { questionText: "विटामिन 'डी' की कमी से बच्चों में कौन सा रोग होता है?", options: ["रिकेट्स (Rickets)", "स्कर्वी", "रतौंधी", "एनीमिया"], correctAnswer: "रिकेट्स (Rickets)" },
    { questionText: "मानव हृदय में अशुद्ध रक्त किस भाग में प्रवेश करता है?", options: ["दायाँ आलिंद (Right Atrium)", "बायाँ आलिंद", "दायाँ निलय", "बायाँ निलय"], correctAnswer: "दायाँ आलिंद (Right Atrium)" },
    { questionText: "पेनिसिलिन एंटीबायोटिक की खोज किसने की थी?", options: ["अलेक्जेंडर फ्लेमिंग", "एडवर्ड जेनर", "लुई पाश्चर", "रॉबर्ट कोच"], correctAnswer: "अलेक्जेंडर फ्लेमिंग" },
    { questionText: "डीएनए (DNA) की द्वि-कुंडलिनी संरचना किसने प्रस्तुत की थी?", options: ["वाटसन और क्रिक", "मेंडल", "रॉबर्ट हुक", "हरगोविंद खुराना"], correctAnswer: "वाटसन और क्रिक" },
    { questionText: "कोशिका का शक्ति गृह (Powerhouse of the Cell) किसे कहा जाता है?", options: ["माइटोकॉन्ड्रिया (Mitochondria)", "केंद्रक", "लाइसोसोम", "राइबोसोम"], correctAnswer: "माइटोकॉन्ड्रिया (Mitochondria)" },
    { questionText: "पौधों की पत्तियों का हरा रंग किस वर्णक (Pigment) के कारण होता है?", options: ["क्लोरोफिल (Chlorophyll)", "कैरोटीन", "जेन्थोफिल", "एंथोसायनिन"], correctAnswer: "क्लोरोफिल (Chlorophyll)" },
    { questionText: "इंसुलिन (Insulin) हार्मोन का स्राव शरीर के किस अंग से होता है?", options: ["अग्न्याशय (Pancreas)", "यकृत", "थायरॉइड", "वृक्क"], correctAnswer: "अग्न्याशय (Pancreas)" },
    { questionText: "मानव शरीर में गुणसूत्रों (Chromosomes) की कुल संख्या कितनी होती है?", options: ["46 (23 जोड़े)", "44", "48", "50"], correctAnswer: "46 (23 जोड़े)" },
    { questionText: "रक्तचाप (Blood Pressure) मापने वाले यंत्र को क्या कहा जाता है?", options: ["स्फिग्मोमैनोमीटर", "स्टेथोस्कोप", "बैरोमीटर", "थर्मामीटर"], correctAnswer: "स्फिग्मोमैनोमीटर" }
  ];

  return bioTopics[(index - 1) % bioTopics.length];
}

function generateHistoryQuestion(index: number, testSeed: number): Partial<Question> {
  const historyTopics = [
    { questionText: "मौर्य साम्राज्य के संस्थापक कौन थे?", options: ["चंद्रगुप्त मौर्य", "सम्राट अशोक", "बिंदुसार", "चंद्रगुप्त प्रथम"], correctAnswer: "चंद्रगुप्त मौर्य" },
    { questionText: "गुप्त काल के किस महान कवि को 'भारत का शेक्सपियर' कहा जाता है?", options: ["कालिदास", "बाणभट्ट", "हरिषेण", "शूद्रक"], correctAnswer: "कालिदास" },
    { questionText: "दिल्ली सल्तनत की पहली और एकमात्र महिला शासिका कौन थीं?", options: ["रज़िया सुल्तान", "चाँद बीबी", "नूरजहाँ", "मुमताज महल"], correctAnswer: "रज़िया सुल्तान" },
    { questionText: "पानीपत का प्रथम युद्ध (1526 ई.) किनके मध्य लड़ा गया था?", options: ["बाबर और इब्राहिम लोदी", "अकबर और हेमू", "अहमद शाह अब्दाली और मराठा", "हुमायूँ और शेरशाह"], correctAnswer: "बाबर और इब्राहिम लोदी" },
    { questionText: "1857 के प्रथम स्वतंत्रता संग्राम की शुरुआत कहाँ से हुई थी?", options: ["मेरठ", "झाँसी", "कानपुर", "लखनऊ"], correctAnswer: "मेरठ" },
    { questionText: "महात्मा गांधी ने 'असहयोग आंदोलन' किस वर्ष प्रारंभ किया था?", options: ["1920 ई.", "1919 ई.", "1930 ई.", "1942 ई."], correctAnswer: "1920 ई." },
    { questionText: "'आर्य समाज' की स्थापना 1875 में किसने की थी?", options: ["स्वामी दयानंद सरस्वती", "स्वामी विवेकानंद", "राजा राममोहन राय", "ईश्वरचंद्र विद्यासागर"], correctAnswer: "स्वामी दयानंद सरस्वती" },
    { questionText: "भारत छोड़ो आंदोलन (Quit India Movement) की शुरुआत कब हुई थी?", options: ["8 अगस्त 1942", "15 अगस्त 1947", "26 जनवरी 1930", "12 मार्च 1930"], correctAnswer: "8 अगस्त 1942" },
    { questionText: "मध्य प्रदेश के रीवा जिले में 1932 में हुए 'चावल आंदोलन' का संबंध किससे था?", options: ["कृषक विद्रोह", "नमक आंदोलन", "जंगल सत्याग्रह", "जनजातीय आंदोलन"], correctAnswer: "कृषक विद्रोह" },
    { questionText: "'सांची का स्तूप' का निर्माण किस मौर्य सम्राट ने करवाया था?", options: ["सम्राट अशोक", "चंद्रगुप्त मौर्य", "बिंदुसार", "दशरथ"], correctAnswer: "सम्राट अशोक" },
    { questionText: "सिंधु घाटी सभ्यता का प्रमुख बंदरगाह नगर कौन सा था?", options: ["लोथल", "हड़प्पा", "मोहनजोदड़ो", "कालीबंगा"], correctAnswer: "लोथल" },
    { questionText: "सत्यमेव जयते' उक्ति किस उपनिषद से ली गई है?", options: ["मुंडकोपनिषद", "कठोपनिषद", "छान्दोग्य उपनिषद", "ईशावास्योपनिषद"], correctAnswer: "मुंडकोपनिषद" },
    { questionText: "खजुराहो के प्रसिद्ध मंदिरों का निर्माण किस राजवंश के शासकों ने करवाया था?", options: ["चंदेल शासक", "परमार शासक", "गुप्त शासक", "मौर्य शासक"], correctAnswer: "चंदेल शासक" },
    { questionText: "स्वराज मेरा जन्मसिद्ध अधिकार है और मैं इसे लेकर रहूँगा - यह नारा किसने दिया था?", options: ["बाल गंगाधर तिलक", "लाला लाजपत राय", "विपिन चंद्र पाल", "सुभाष चंद्र बोस"], correctAnswer: "बाल गंगाधर तिलक" },
    { questionText: "आज़ाद हिंद फौज (INA) के पुनर्गठन का श्रेय किसे जाता है?", options: ["नेताजी सुभाष चंद्र बोस", "रासबिहारी बोस", "कैप्टन मोहन सिंह", "भगत सिंह"], correctAnswer: "नेताजी सुभाष चंद्र बोस" }
  ];

  return historyTopics[(index - 1) % historyTopics.length];
}

function generateGeographyQuestion(index: number, testSeed: number): Partial<Question> {
  const geoTopics = [
    { questionText: "मध्य प्रदेश की जीवन रेखा (Lifeline of MP) किस नदी को कहा जाता है?", options: ["नर्मदा नदी", "चंबल नदी", "ताप्ती नदी", "सोन नदी"], correctAnswer: "नर्मदा नदी" },
    { questionText: "भारत में क्षेत्रफल के अनुसार सबसे बड़ा राज्य कौन सा है?", options: ["राजस्थान", "मध्य प्रदेश", "महाराष्ट्र", "उत्तर प्रदेश"], correctAnswer: "राजस्थान" },
    { questionText: "सुंदरवन का डेल्टा किस नदी द्वारा बनाया जाता है?", options: ["गंगा और ब्रह्मपुत्र", "नर्मदा और ताप्ती", "गोदावरी और कृष्णा", "सिंधु और झेलम"], correctAnswer: "गंगा और ब्रह्मपुत्र" },
    { questionText: "भारत में सर्वाधिक वर्षा किस मानसून से होती है?", options: ["दक्षिण-पश्चिम मानसून", "उत्तर-पूर्वी मानसून", "पश्चिमी विक्षोभ", "लौटता मानसून"], correctAnswer: "दक्षिण-पश्चिम मानसून" },
    { questionText: "कान्हा किसली राष्ट्रीय उद्यान मध्य प्रदेश के किस जिले में स्थित है?", options: ["मंडला/बालाघाट", "शिवपुरी", "उमरिया", "पन्ना"], correctAnswer: "मंडला/बालाघाट" },
    { questionText: "वायुमंडल की किस परत में मौसम संबंधी सभी घटनाएँ होती हैं?", options: ["क्षोभमंडल (Troposphere)", "समतापमंडल", "मध्यमंडल", "आयनमंडल"], correctAnswer: "क्षोभमंडल (Troposphere)" },
    { questionText: "भारत की सबसे लंबी तटीय रेखा वाला राज्य कौन सा है?", options: ["गुजरात", "आंध्र प्रदेश", "तमिलनाडु", "महाराष्ट्र"], correctAnswer: "गुजरात" },
    { questionText: "भाखड़ा नांगल परियोजना किस नदी पर निर्मित है?", options: ["सतलुज नदी", "व्यास नदी", "रावी नदी", "झेलम नदी"], correctAnswer: "सतलुज नदी" },
    { questionText: "पृथ्वी की भूपर्पटी में सर्वाधिक पाया जाने वाला तत्व कौन सा है?", options: ["ऑक्सीजन", "सिलिकॉन", "एल्युमिनियम", "लोहा"], correctAnswer: "ऑक्सीजन" },
    { questionText: "मध्य प्रदेश की सबसे ऊँची चोटी 'धूपगढ़' किस पर्वत श्रेणी में स्थित है?", options: ["सतपुड़ा श्रेणी (महादेव पहाड़ियाँ)", "विंध्याचल श्रेणी", "मैकाल श्रेणी", "अरावली श्रेणी"], correctAnswer: "सतपुड़ा श्रेणी (महादेव पहाड़ियाँ)" },
    { questionText: "क्षेत्रफल की दृष्टि से मध्य प्रदेश का भारत में कौन सा स्थान है?", options: ["द्वितीय (दूसरा)", "प्रथम", "तृतीय", "चतुर्थ"], correctAnswer: "द्वितीय (दूसरा)" },
    { questionText: "भारत में 'कर्क रेखा' (Tropic of Cancer) कितने राज्यों से होकर गुजरती है?", options: ["8 राज्यों से", "7 राज्यों से", "9 राज्यों से", "6 राज्यों से"], correctAnswer: "8 राज्यों से" },
    { questionText: "मध्य प्रदेश में सफेद बाघों की भूमि (Land of White Tigers) किसे कहा जाता है?", options: ["रीवा", "शहडोल", "सतना", "जबलपुर"], correctAnswer: "रीवा" },
    { questionText: "विश्व का सबसे बड़ा महाद्वीप कौन सा है?", options: ["एशिया", "अफ्रीका", "उत्तर अमेरिका", "यूरोप"], correctAnswer: "एशिया" },
    { questionText: "हीराकुंड बांध किस नदी पर स्थित है?", options: ["महानदी", "गोदावरी", "नर्मदा", "कावेरी"], correctAnswer: "महानदी" }
  ];

  return geoTopics[(index - 1) % geoTopics.length];
}

function generateCivicsPolityQuestion(index: number, testSeed: number): Partial<Question> {
  const civicsTopics = [
    { questionText: "भारतीय संविधान में मौलिक अधिकारों (Fundamental Rights) का वर्णन किस भाग में है?", options: ["भाग 3 (अनुच्छेद 12-35)", "भाग 4", "भाग 2", "भाग 1"], correctAnswer: "भाग 3 (अनुच्छेद 12-35)" },
    { questionText: "भारत के राष्ट्रपति को पद एवं गोपनीयता की शपथ कौन दिलाता है?", options: ["भारत का मुख्य न्यायाधीश (CJI)", "उपराष्ट्रपति", "प्रधानमंत्री", "लोकसभा अध्यक्ष"], correctAnswer: "भारत का मुख्य न्यायाधीश (CJI)" },
    { questionText: "'संवैधानिक उपचारों का अधिकार' किस अनुच्छेद में वर्णित है जिसे डॉ. अंबेडकर ने संविधान की आत्मा कहा?", options: ["अनुच्छेद 32", "अनुच्छेद 21", "अनुच्छेद 14", "अनुच्छेद 19"], correctAnswer: "अनुच्छेद 32" },
    { questionText: "भारतीय संसद के उच्च सदन (Upper House) को क्या कहा जाता है?", options: ["राज्यसभा", "लोकसभा", "विधानसभा", "विधान परिषद"], correctAnswer: "राज्यसभा" },
    { questionText: "पंचायती राज को संवैधानिक दर्जा किस संविधान संशोधन अधिनियम द्वारा दिया गया?", options: ["73वां संशोधन (1992)", "74वां संशोधन", "42वां संशोधन", "44वां संशोधन"], correctAnswer: "73वां संशोधन (1992)" },
    { questionText: "भारत में मुख्य निर्वाचन आयुक्त (Chief Election Commissioner) की नियुक्ति कौन करता है?", options: ["राष्ट्रपति", "प्रधानमंत्री", "संसद", "मुख्य न्यायाधीश"], correctAnswer: "राष्ट्रपति" },
    { questionText: "राज्य के नीति निदेशक तत्व (DPSP) किस देश के संविधान से प्रेरित हैं?", options: ["आयरलैंड", "अमेरिका", "ब्रिटेन", "कनाडा"], correctAnswer: "आयरलैंड" },
    { questionText: "आपातकाल की घोषणा राष्ट्रपति किस अनुच्छेद के तहत राष्ट्रीय स्तर पर करते हैं?", options: ["अनुच्छेद 352", "अनुच्छेद 356", "अनुच्छेद 360", "अनुच्छेद 368"], correctAnswer: "अनुच्छेद 352" },
    { questionText: "लोकसभा सदस्य बनने के लिए न्यूनतम आयु सीमा कितनी निर्धारित है?", options: ["25 वर्ष", "30 वर्ष", "35 वर्ष", "21 वर्ष"], correctAnswer: "25 वर्ष" },
    { questionText: "भारतीय संविधान की प्रस्तावना में 'समाजवादी' और 'धर्मनिरपेक्ष' शब्द किस संशोधन द्वारा जोड़े गए?", options: ["42वां संशोधन (1976)", "44वां संशोधन", "86वां संशोधन", "61वां संशोधन"], correctAnswer: "42वां संशोधन (1976)" },
    { questionText: "भारत में मतदान की न्यूनतम आयु 21 वर्ष से घटाकर 18 वर्ष किस संशोधन द्वारा की गई?", options: ["61वां संशोधन (1989)", "42वां संशोधन", "44वां संशोधन", "73वां संशोधन"], correctAnswer: "61वां संशोधन (1989)" },
    { questionText: "भारतीय संविधान का प्रारूप तैयार करने वाली 'प्रारूप समिति' (Drafting Committee) के अध्यक्ष कौन थे?", options: ["डॉ. बी.आर. अंबेडकर", "डॉ. राजेंद्र प्रसाद", "जवाहरलाल नेहरू", "सच्चिदानंद सिन्हा"], correctAnswer: "डॉ. बी.आर. अंबेडकर" },
    { questionText: "संविधान सभा की पहली बैठक किस तिथि को हुई थी?", options: ["9 दिसंबर 1946", "11 दिसंबर 1946", "26 नवंबर 1949", "26 जनवरी 1950"], correctAnswer: "9 दिसंबर 1946" },
    { questionText: "राज्य का सर्वोच्च विधि अधिकारी (Advocate General) कौन होता है?", options: ["महाधिवक्ता (Advocate General)", "अटॉर्नी जनरल", "solicitor General", "मुख्य न्यायाधीश"], correctAnswer: "महाधिवक्ता (Advocate General)" },
    { questionText: "शिक्षा का अधिकार (RTE) किस अनुच्छेद के अंतर्गत मौलिक अधिकार बनाया गया?", options: ["अनुच्छेद 21A", "अनुच्छेद 19", "अनुच्छेद 45", "अनुच्छेद 51A"], correctAnswer: "अनुच्छेद 21A" }
  ];

  return civicsTopics[(index - 1) % civicsTopics.length];
}

function generateEconomicsQuestion(index: number, testSeed: number): Partial<Question> {
  const ecoTopics = [
    { questionText: "सकल घरेलू उत्पाद (GDP) की गणना में किसे शामिल किया जाता है?", options: ["देश की सीमा के भीतर उत्पादित अंतिम वस्तुओं एवं सेवाओं का मूल्य", "केवल विदेशों से प्राप्त आय", "केवल कृषि उत्पाद", "पुरानी वस्तुओं की बिक्री"], correctAnswer: "देश की सीमा के भीतर उत्पादित अंतिम वस्तुओं एवं सेवाओं का मूल्य" },
    { questionText: "भारतीय रिजर्व बैंक (RBI) की स्थापना किस वर्ष हुई थी?", options: ["1935 ई.", "1947 ई.", "1950 ई.", "1969 ई."], correctAnswer: "1935 ई." },
    { questionText: "'रेपो रेट' (Repo Rate) क्या होता है?", options: ["जिस दर पर RBI व्यावसायिक बैंकों को अल्पकालिक ऋण देता है", "जिस दर पर बैंक जनता को ऋण देते हैं", "जिस दर पर RBI बैंकों से जमा स्वीकार करता है", "मुद्रास्फीति की दर"], correctAnswer: "जिस दर पर RBI व्यावसायिक बैंकों को अल्पकालिक ऋण देता है" },
    { questionText: "'माँग का नियम' (Law of Demand) के अनुसार मूल्य और माँग में कैसा संबंध होता है?", options: ["विपरीत / ऋणात्मक संबंध", "प्रत्यक्ष / धनात्मक संबंध", "कोई संबंध नहीं", "समान संबंध"], correctAnswer: "विपरीत / ऋणात्मक संबंध" },
    { questionText: "भारत में राष्ट्रीय आय का आकलन किस संस्था द्वारा किया जाता है?", options: ["राष्ट्रीय सांख्यिकी कार्यालय (NSO)", "नीति आयोग", "वित्त मंत्रालय", "भारतीय रिजर्व बैंक"], correctAnswer: "राष्ट्रीय सांख्यिकी कार्यालय (NSO)" },
    { questionText: "प्राथमिक क्षेत्र (Primary Sector) के अंतर्गत कौन सी गतिविधि आती है?", options: ["कृषि एवं उत्खनन", "विनिर्माण उद्योग", "बैंकिंग एवं बीमा", "यातायात सेवा"], correctAnswer: "कृषि एवं उत्खनन" },
    { questionText: "मुद्रास्फीति (Inflation) के समय अर्थव्यवस्था पर क्या प्रभाव पड़ता है?", options: ["वस्तुओं की कीमतें बढ़ती हैं और मुद्रा का मूल्य घटता है", "कीमतें घटती हैं", "मुद्रा का मूल्य बढ़ता है", "कोई प्रभाव नहीं पड़ता"], correctAnswer: "वस्तुओं की कीमतें बढ़ती हैं और मुद्रा का मूल्य घटता है" },
    { questionText: "नीति आयोग के पदेन अध्यक्ष (Ex-officio Chairman) कौन होते हैं?", options: ["भारत के प्रधानमंत्री", "वित्त मंत्री", "RBI गवर्नर", "राष्ट्रपति"], correctAnswer: "भारत के प्रधानमंत्री" },
    { questionText: "भारत में हरित क्रांति के फलस्वरूप किस खाद्यान्न के उत्पादन में सर्वाधिक वृद्धि हुई?", options: ["गेहूँ और चावल", "दालें", "मक्का", "तिलहन"], correctAnswer: "गेहूँ और चावल" },
    { questionText: "'मिश्रित अर्थव्यवस्था' (Mixed Economy) का तात्पर्य क्या है?", options: ["सार्वजनिक और निजी क्षेत्र का सह-अस्तित्व", "केवल निजी क्षेत्र का प्रभुत्व", "केवल सरकारी नियंत्रण", "विदेशी व्यापार का प्रभुत्व"], correctAnswer: "सार्वजनिक और निजी क्षेत्र का सह-अस्तित्व" },
    { questionText: "₹1 के नोट पर किसके हस्ताक्षर होते हैं?", options: ["वित्त सचिव (Finance Secretary)", "RBI गवर्नर", "वित्त मंत्री", "प्रधानमंत्री"], correctAnswer: "वित्त सचिव (Finance Secretary)" },
    { questionText: "भारत में 'वस्तु एवं सेवा कर' (GST) कब लागू किया गया?", options: ["1 जुलाई 2017", "1 अप्रैल 2016", "8 नवंबर 2016", "15 अगस्त 2015"], correctAnswer: "1 जुलाई 2017" },
    { questionText: "छिपी हुई या अदृश्य बेरोजगारी (Disguised Unemployment) मुख्य रूप से किस क्षेत्र में पाई जाती है?", options: ["कृषि क्षेत्र", "औद्योगिक क्षेत्र", "सेवा क्षेत्र", "सूचनावैद्योगिकी"], correctAnswer: "कृषि क्षेत्र" },
    { questionText: "बॉम्बे स्टॉक एक्सचेंज (BSE) का संवेदी सूचकांक क्या कहलाता है?", options: ["सेंसेक्स (Sensex)", "निफ्टी (Nifty)", "नास्डैक", "डाउ जोंस"], correctAnswer: "सेंसेक्स (Sensex)" },
    { questionText: "मानव विकास सूचकांक (HDI) किसके द्वारा जारी किया जाता है?", options: ["UNDP", "विश्व बैंक", "IMF", "UNESCO"], correctAnswer: "UNDP" }
  ];

  return ecoTopics[(index - 1) % ecoTopics.length];
}

function generateSanskritQuestion(index: number, testSeed: number): Partial<Question> {
  const sktTopics = [
    { questionText: "'रामस्य' पद में कौन सी विभक्ति और वचन है?", options: ["षष्ठी विभक्ति, एकवचन", "सप्तमी विभक्ति, एकवचन", "पंचमी विभक्ति, द्विवचन", "प्रथमा विभक्ति, बहुवचन"], correctAnswer: "षष्ठी विभक्ति, एकवचन" },
    { questionText: "'पित्रा' रूप किस विभक्ति का है?", options: ["तृतीया विभक्ति, एकवचन", "द्वितीय विभक्ति", "चतुर्थी विभक्ति", "षष्ठी विभक्ति"], correctAnswer: "तृतीया विभक्ति, एकवचन" },
    { questionText: "'गच्छति' क्रियापद में कौन सी धातु, लकार और पुरुष है?", options: ["गम् धातु, लट् लकार, प्रथम पुरुष", "गम् धातु, लृट् लकार, मध्यम पुरुष", "गच्छ धातु, लङ् लकार, उत्तम पुरुष", "गम् धातु, लोट् लकार"], correctAnswer: "गम् धातु, लट् लकार, प्रथम पुरुष" },
    { questionText: "'इत्यपि' शब्द का सही संधि-विच्छेद क्या होगा?", options: ["इति + अपि (यण् स्वर संधि)", "इत्य + अपि", "इत + अपि", "इती + अपि"], correctAnswer: "इति + अपि (यण् स्वर संधि)" },
    { questionText: "'प्रत्येकम्' पद में कौन सा समास है?", options: ["अव्ययीभाव समास (दिनं दिनं प्रति)", "तत्पुरुष समास", "द्विगु समास", "कर्मधारय समास"], correctAnswer: "अव्ययीभाव समास (दिनं दिनं प्रति)" },
    { questionText: "'रघुवंशम्' महाकाव्य के रचयिता कौन हैं?", options: ["महाकवि कालिदास", "भारवि", "माघ", "श्रीहर्ष"], correctAnswer: "महाकवि कालिदास" },
    { questionText: "'किरातार्जुनीयम्' महाकाव्य के रचयिता कौन हैं?", options: ["भारवि", "माघ", "कालिदास", "दण्डी"], correctAnswer: "भारवि" },
    { questionText: "संस्कृत में कुल कितने कारक माने गए हैं?", options: ["षट् (6 कारक)", "सप्त (7)", "अष्ट (8)", "पंच (5)"], correctAnswer: "षट् (6 कारक)" },
    { questionText: "'पठित्वा' पद में कौन सा प्रत्यय है?", options: ["क्त्वा प्रत्यय", "तुमुन् प्रत्यय", "ल्यप् प्रत्यय", "क्त प्रत्यय"], correctAnswer: "क्त्वा प्रत्यय" },
    { questionText: "'सूर्य' शब्द का तृतीया विभक्ति एकवचन रूप क्या होगा?", options: ["सूर्येण", "सूर्याय", "सूर्यात्", "सूर्यस्य"], correctAnswer: "सूर्येण" },
    { questionText: "संस्कृत व्याकरण में माहेश्वर सूत्रों की कुल संख्या कितनी है?", options: ["14 सूत्र", "12 सूत्र", "16 सूत्र", "10 सूत्र"], correctAnswer: "14 सूत्र" },
    { questionText: "'अभिज्ञानशाकुन्तलम्' नाटक में कितने अंक हैं?", options: ["सप्त (7)", "पञ्च (5)", "षट् (6)", "दश (10)"], correctAnswer: "सप्त (7)" },
    { questionText: "'शिशुपालवधम्' महाकाव्य के रचयिता कौन हैं?", options: ["माघ", "भारवि", "कालिदास", "बाणभट्ट"], correctAnswer: "माघ" },
    { questionText: "'कादम्बरी' गद्यकाव्य के रचयिता कौन हैं?", options: ["बाणभट्ट", "सुबन्धु", "दण्डी", "अम्बिकादत्त व्यास"], correctAnswer: "बाणभट्ट" },
    { questionText: "'अयादि स्वर संधि' का सूत्र क्या है?", options: ["एचोऽयवायावः", "इको यणचि", "आद्गुणः", "वृद्धिरेचि"], correctAnswer: "एचोऽयवायावः" }
  ];

  return sktTopics[(index - 1) % sktTopics.length];
}

function generateEnglishQuestion(index: number, testSeed: number): Partial<Question> {
  const engTopics = [
    { questionText: "Choose the correct passive voice of: \"She writes a letter.\"", options: ["A letter is written by her.", "A letter was written by her.", "A letter is being written by her.", "A letter has been written by her."], correctAnswer: "A letter is written by her." },
    { questionText: "Fill in the blank: \"Neither he nor his friends _____ present in the meeting.\"", options: ["were", "was", "is", "has"], correctAnswer: "were" },
    { questionText: "Identify the correct indirect speech: He said, \"I am going to school.\"", options: ["He said that he was going to school.", "He said that I am going to school.", "He said that he is going to school.", "He told he was going to school."], correctAnswer: "He said that he was going to school." },
    { questionText: "Choose the correct antonym of 'OPTIMISTIC':", options: ["Pessimistic", "Hopeful", "Positive", "Bright"], correctAnswer: "Pessimistic" },
    { questionText: "Complete with suitable conjunction: \"Work hard _____ you should fail.\"", options: ["lest", "unless", "until", "otherwise"], correctAnswer: "lest" },
    { questionText: "What is the one-word substitution for \"A person who collects stamps\"?", options: ["Philatelist", "Numismatist", "Philanthropist", "Optimist"], correctAnswer: "Philatelist" },
    { questionText: "Identify the figure of speech in \"Life is a roller coaster ride.\"", options: ["Metaphor", "Simile", "Personification", "Hyperbole"], correctAnswer: "Metaphor" },
    { questionText: "Choose the correct plural form of 'CRITERION':", options: ["Criteria", "Criterions", "Criterias", "Criterion"], correctAnswer: "Criteria" },
    { questionText: "What is the meaning of the idiom 'To break the ice'?", options: ["To start a conversation", "To break friendship", "To freeze water", "To feel very cold"], correctAnswer: "To start a conversation" },
    { questionText: "Fill in the blank with correct preposition: \"She has been living here _____ 2015.\"", options: ["since", "for", "from", "in"], correctAnswer: "since" },
    { questionText: "Choose the correctly spelt word:", options: ["Accommodation", "Acommodation", "Accomodation", "Acomodation"], correctAnswer: "Accommodation" },
    { questionText: "Select the synonym of 'CANDID':", options: ["Frank / Honest", "Secretive", "Shy", "Clever"], correctAnswer: "Frank / Honest" },
    { questionText: "Which poem begins with the line: \"I wandered lonely as a cloud\"?", options: ["Daffodils (William Wordsworth)", "Ode to a Nightingale", "The Raven", "Stopping by Woods"], correctAnswer: "Daffodils (William Wordsworth)" },
    { questionText: "Who is known as the 'Father of English Poetry'?", options: ["Geoffrey Chaucer", "William Shakespeare", "John Milton", "Edmund Spenser"], correctAnswer: "Geoffrey Chaucer" },
    { questionText: "Identify the type of clause in: \"I know where he lives.\"", options: ["Noun Clause", "Adjective Clause", "Adverb Clause", "Relative Clause"], correctAnswer: "Noun Clause" }
  ];

  return engTopics[(index - 1) % engTopics.length];
}

function generateHindiQuestion(index: number, testSeed: number): Partial<Question> {
  const templates = BASE_QUESTIONS.Hindi || [];
  if (index <= templates.length) {
    return templates[index - 1];
  }

  const hindiTopics = [
    { questionText: "'कामायनी' महाकाव्य के रचयिता कौन हैं?", options: ["जयशंकर प्रसाद", "सूर्यकांत त्रिपाठी निराला", "सुमित्रानंदन पंत", "महादेवी वर्मा"], correctAnswer: "जयशंकर प्रसाद" },
    { questionText: "'अन्न-जल' में कौन सा समास है?", options: ["द्वंद्व समास", "द्विगु समास", "तत्पुरुष समास", "कर्मधारय समास"], correctAnswer: "द्वंद्व समास" },
    { questionText: "'विद्यालय' शब्द का सही संधि-विच्छेद क्या होगा?", options: ["विद्या + आलय (दीर्घ स्वर संधि)", "विद्य + आलय", "विद्या + लय", "विद्य + लय"], correctAnswer: "विद्या + आलय (दीर्घ स्वर संधि)" },
    { questionText: "'शांत रस' का स्थायी भाव क्या है?", options: ["निर्वेद (शम)", "रति", "उत्साह", "शोक"], correctAnswer: "निर्वेद (शम)" },
    { questionText: "'चौपाई' छंद के प्रत्येक चरण में कितनी मात्राएँ होती हैं?", options: ["16 मात्राएँ", "13 मात्राएँ", "11 मात्राएँ", "24 मात्राएँ"], correctAnswer: "16 मात्राएँ" },
    { questionText: "\"कनक कनक ते सौगुनी मादकता अधिकाय\" में कौन सा अलंकार है?", options: ["यमक अलंकार", "अनुप्रास अलंकार", "श्लेष अलंकार", "रूपक अलंकार"], correctAnswer: "यमक अलंकार" },
    { questionText: "'गोदान' उपन्यास के लेखक कौन हैं?", options: ["मुंशी प्रेमचंद", "फणीश्वरनाथ रेणु", "हजारी प्रसाद द्विवेदी", "अज्ञेय"], correctAnswer: "मुंशी प्रेमचंद" },
    { questionText: "'आदिकाल' को 'सिद्ध-सामंत काल' किसने कहा है?", options: ["पंडित राहुल सांकृत्यायन", "आचार्य रामचंद्र शुक्ल", "हजारी प्रसाद द्विवेदी", "डॉ. रामकुमार वर्मा"], correctAnswer: "पंडित राहुल सांकृत्यायन" },
    { questionText: "'तारसप्तक' (1943) के संपादक कौन थे?", options: ["सच्चिदानंद हीरानंद वात्स्यायन 'अज्ञेय'", "गजानन माधव मुक्तिबोध", "धर्मवीर भारती", "गिरजाकुमार माथुर"], correctAnswer: "सच्चिदानंद हीरानंद वात्स्यायन 'अज्ञेय'" },
    { questionText: "'अग्नि' का तद्भव रूप क्या होगा?", options: ["आग", "अनल", "पावक", "दहन"], correctAnswer: "आग" }
  ];

  return hindiTopics[(index - 1) % hindiTopics.length];
}

function generateGeneralSubjectQuestion(subjectName: string, index: number, testSeed: number): Partial<Question> {
  const generalTopics = [
    { questionText: `${subjectName} अध्ययन में राष्ट्रीय पाठ्यचर्या रूपरेखा (NCF) का मुख्य जोर किस पर है?`, options: ["ज्ञान को विद्यालय के बाहरी जीवन से जोड़ना", "किताबी ज्ञान तक सीमित रखना", "केवल परीक्षा केंद्रित बनाना", "रटने की पद्धति को बढ़ावा देना"], correctAnswer: "ज्ञान को विद्यालय के बाहरी जीवन से जोड़ना" },
    { questionText: `${subjectName} शिक्षणशास्त्र के अनुसार प्रभावी अधिगम हेतु सर्वोत्तम शिक्षण विधि कौन सी है?`, options: ["प्रयोगात्मक एवं करके सीखना (Learning by Doing)", "केवल व्याख्यान विधि", "पाठ्यपुस्तक रटना", "केवल प्रश्नोत्तर विधि"], correctAnswer: "प्रयोगात्मक एवं करके सीखना (Learning by Doing)" },
    { questionText: `${subjectName} विषय के संदर्भ में सतत एवं व्यापक मूल्यांकन (CCE) का मुख्य उद्देश्य क्या है?`, options: ["शिक्षार्थी के सर्वांगीण विकास का आकलन करना", "केवल वार्षिक परीक्षा लेना", "छात्रों को अंक देना", "कमजोर छात्रों को अलग करना"], correctAnswer: "शिक्षार्थी के सर्वांगीण विकास का आकलन करना" },
    { questionText: `${subjectName} की कक्षा में समावेशी वातावरण बनाने के लिए शिक्षक को क्या करना चाहिए?`, options: ["सभी विद्यार्थियों की व्यक्तिगत भिन्नताओं का सम्मान करना", "केवल मेधावी छात्रों पर ध्यान देना", "कमजोर छात्रों को अलग बैठाना", "कठिन परीक्षा लेना"], correctAnswer: "सभी विद्यार्थियों की व्यक्तिगत भिन्नताओं का सम्मान करना" },
    { questionText: `${subjectName} शिक्षण में दृश्य-श्रव्य सामग्री (Audio-Visual Aids) का क्या महत्व है?`, options: ["अधिगम को रोचक, स्पष्ट एवं स्थायी बनाना", "कक्षा में अनुशासन बनाए रखना", "शिक्षक का समय बचाना", "केवल मनोरंजन करना"], correctAnswer: "अधिगम को रोचक, स्पष्ट एवं स्थायी बनाना" },
    { questionText: `${subjectName} में निदानात्मक परीक्षण (Diagnostic Test) का मुख्य कार्य क्या है?`, options: ["छात्रों की अधिगम संबंधी कठिनाइयों और कमजोरियों की पहचान करना", "ग्रेड प्रदान करना", "पास या फेल की घोषणा करना", "पुरस्कार देना"], correctAnswer: "छात्रों की अधिगम संबंधी कठिनाइयों और कमजोरियों की पहचान करना" },
    { questionText: `${subjectName} में उपचारात्मक शिक्षण (Remedial Teaching) कब प्रदान किया जाता है?`, options: ["निदानात्मक परीक्षण के बाद कठिनाइयों को दूर करने हेतु", "सत्रांत परीक्षा के पूर्व", "प्रवेश परीक्षा के समय", "वार्षिक उत्सव पर"], correctAnswer: "निदानात्मक परीक्षण के बाद कठिनाइयों को दूर करने हेतु" },
    { questionText: `${subjectName} शिक्षण में सूक्ष्म शिक्षण (Micro Teaching) का मुख्य उपयोग क्या है?`, options: ["शिक्षण कौशलों का विकास करना", "बड़ी कक्षाओं को पढ़ाना", "पाठ्यपुस्तक पूरी करना", "परीक्षा परिणाम सुधारना"], correctAnswer: "शिक्षण कौशलों का विकास करना" },
    { questionText: `${subjectName} के शिक्षण में क्रियात्मक अनुसंधान (Action Research) का मुख्य उद्देश्य क्या है?`, options: ["कक्षा की तात्कालिक समस्याओं का समाधान खोजना", "सिद्धांतों का प्रतिपादन करना", "डिग्री प्राप्त करना", "राष्ट्रीय स्तर पर शोध करना"], correctAnswer: "कक्षा की तात्कालिक समस्याओं का समाधान खोजना" },
    { questionText: `ब्लूम के वर्गीकरण (Bloom's Taxonomy) के अनुसार ${subjectName} में संज्ञानात्मक क्षेत्र का सर्वोच्च स्तर कौन सा है?`, options: ["मूल्यांकन / सृजन (Evaluation/Creation)", "ज्ञान (Knowledge)", "बोध (Comprehension)", "अनुप्रयोग (Application)"], correctAnswer: "मूल्यांकन / सृजन (Evaluation/Creation)" }
  ];

  return generalTopics[(index - 1) % generalTopics.length];
}

function getDynamicSubjectQuestion(subjectKey: string, index: number, testSeed: number): Partial<Question> {
  const normSubject = subjectKey.toLowerCase();
  
  if (normSubject.includes("math")) {
    return generateMathQuestion(index, testSeed);
  } else if (normSubject.includes("physic")) {
    return generatePhysicsQuestion(index, testSeed);
  } else if (normSubject.includes("chemist")) {
    return generateChemistryQuestion(index, testSeed);
  } else if (normSubject.includes("biolog")) {
    return generateBiologyQuestion(index, testSeed);
  } else if (normSubject.includes("scien")) {
    const r = (index + testSeed) % 3;
    return r === 0 ? generatePhysicsQuestion(index, testSeed) : r === 1 ? generateChemistryQuestion(index, testSeed) : generateBiologyQuestion(index, testSeed);
  } else if (normSubject.includes("histor")) {
    return generateHistoryQuestion(index, testSeed);
  } else if (normSubject.includes("geograph")) {
    return generateGeographyQuestion(index, testSeed);
  } else if (normSubject.includes("civic") || normSubject.includes("polit")) {
    return generateCivicsPolityQuestion(index, testSeed);
  } else if (normSubject.includes("social")) {
    const r = (index + testSeed) % 4;
    return r === 0 ? generateHistoryQuestion(index, testSeed) : r === 1 ? generateGeographyQuestion(index, testSeed) : r === 2 ? generateCivicsPolityQuestion(index, testSeed) : generateEconomicsQuestion(index, testSeed);
  } else if (normSubject.includes("econom")) {
    return generateEconomicsQuestion(index, testSeed);
  } else if (normSubject.includes("sanskrit")) {
    return generateSanskritQuestion(index, testSeed);
  } else if (normSubject.includes("english")) {
    return generateEnglishQuestion(index, testSeed);
  } else if (normSubject.includes("hindi")) {
    return generateHindiQuestion(index, testSeed);
  } else {
    return generateGeneralSubjectQuestion(subjectKey, index, testSeed);
  }
}

export function generateFullMockTest(vargId: string, subject: string, testId?: string): Question[] {
  const fullSet: Question[] = [];
  let currentId = 1;
  const seenTexts = new Set<string>();
  const testSeed = getTestSeed(testId);

  const createSet = (sectionName: string, count: number, templateSet: Partial<Question>[], subjectKeyName: string) => {
    let templateIdx = 0;
    
    for (let i = 0; i < count; i++) {
      let qObj: Partial<Question> | null = null;
      
      // First try hand-crafted templates that haven't been seen
      while (templateSet && templateIdx < templateSet.length) {
        const candidate = templateSet[templateIdx++];
        if (candidate && candidate.questionText && !seenTexts.has(candidate.questionText)) {
          qObj = candidate;
          break;
        }
      }
      
      // If templates run out or candidate was duplicate, generate dynamic unique question
      let dynIdx = i + 1;
      let attempt = 0;
      while (!qObj || (qObj.questionText && seenTexts.has(qObj.questionText))) {
        const candidate = getDynamicSubjectQuestion(subjectKeyName, dynIdx + attempt * 100, testSeed);
        let qText = candidate.questionText || `${sectionName} Question ${dynIdx}`;
        
        // If question text is already seen, augment with variation parameters or dynamic index
        if (seenTexts.has(qText)) {
          const numA = (dynIdx * 7 + testSeed * 3 + attempt * 11) % 50 + 2;
          const numB = (dynIdx * 13 + testSeed * 5 + attempt * 17) % 80 + 5;
          if (subjectKeyName.toLowerCase().includes("math")) {
            qText = `प्रश्न (${dynIdx}): यदि ${numA}x + ${numB} = ${numA * 10 + numB}, तो x का मान क्या होगा?`;
            candidate.questionText = qText;
            candidate.options = [`10`, `${10 + (dynIdx % 3) + 1}`, `${10 - (dynIdx % 2 + 1)}`, `15`];
            candidate.correctAnswer = `10`;
          } else {
            qText = `${qText} (प्रश्न क्रमांक ${i + 1})`;
            candidate.questionText = qText;
          }
        }
        
        qObj = candidate;
        attempt++;
        if (attempt > 50) break;
      }

      const textToUse = qObj.questionText || `${sectionName} Question ${i + 1}`;
      seenTexts.add(textToUse);
      fullSet.push({
        id: currentId++,
        section: sectionName,
        questionText: textToUse,
        options: qObj.options || ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: qObj.correctAnswer || "Option A"
      } as Question);
    }
  };

  if (vargId === 'gk' || subject === 'gk' || vargId === 'gk_test') {
    createSet('GK', 20, BASE_QUESTIONS.GK || [], 'gk');
    return fullSet;
  }

  if (vargId === 'varg1') {
    if (subject && subject.toLowerCase() === 'english') {
      return VARG1_ENGLISH_150_QUESTIONS;
    }
    if (subject && subject.toLowerCase() === 'sanskrit') {
      return VARG1_SANSKRIT_150_QUESTIONS;
    }
    if (subject && (subject.toLowerCase() === 'mathematics' || subject.toLowerCase() === 'maths')) {
      return VARG1_MATHS_150_QUESTIONS;
    }
    if (subject && (subject.toLowerCase() === 'physics' || subject.toLowerCase() === 'भौतिक विज्ञान')) {
      return VARG1_PHYSICS_150_QUESTIONS;
    }
    if (subject && (subject.toLowerCase() === 'chemistry' || subject.toLowerCase() === 'रसायन विज्ञान' || subject.toLowerCase() === 'chem')) {
      return VARG1_CHEMISTRY_150_QUESTIONS;
    }
    if (!subject || subject.toLowerCase() === 'hindi' || subject === 'general') {
      return VARG1_HINDI_150_QUESTIONS;
    }
  }

  if (vargId === 'varg2') {
    if (subject && (subject.toLowerCase() === 'mathematics' || subject.toLowerCase() === 'maths' || subject.toLowerCase() === 'गणित')) {
      return VARG2_MATHS_120_QUESTIONS;
    }
    if (subject && (subject.toLowerCase().includes('social') || subject.toLowerCase().includes('सामाजिक') || subject.toLowerCase() === 'sst')) {
      return VARG2_SOCIAL_SCIENCE_120_QUESTIONS;
    }
  }

  if (vargId === 'varg3') {
    createSet('CDP', 30, BASE_QUESTIONS.CDP || [], 'cdp');
    createSet('Language 1 (Hindi)', 30, BASE_QUESTIONS.Hindi || [], 'hindi');
    createSet('Language 2 (English)', 30, BASE_QUESTIONS.English || [], 'english');
    createSet('Maths', 30, BASE_QUESTIONS.Mathematics || [], 'maths');
    createSet('EVS', 30, BASE_QUESTIONS.Evs || [], 'evs');
  } else {
    // Varg 1 & 2
    // Use actual Part A
    for (const q of PART_A_COMMON) {
      const text = q.questionText || `Part A Question ${currentId}`;
      seenTexts.add(text);
      fullSet.push({
        id: currentId++,
        section: `Part A: ${q.section}`,
        questionText: text,
        options: q.options || ["A", "B", "C", "D"],
        correctAnswer: q.correctAnswer || "A"
      } as Question);
    }
    
    // Add Part B based on subject
    const subjectKey = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
    const subjectTemplates = BASE_QUESTIONS[subjectKey] || BASE_QUESTIONS[subject] || [];
    createSet(`Part B: ${subject.toUpperCase()}`, 120, subjectTemplates, subjectKey);
  }

  return fullSet;
}
