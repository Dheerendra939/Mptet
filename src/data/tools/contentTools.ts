import { ToolDefinition } from '../../types';

export const CONTENT_TOOLS: ToolDefinition[] = [
  {
    id: 'paragraph-rewriter',
    slug: 'paragraph-rewriter-tone-changer',
    aliases: ['paragraph-rewriter', 'tone-changer', 'sentence-rewriter', 'paraphrasing-tool'],
    number: '33',
    category: 'Content',
    title: 'AI Paragraph Rewriter & Tone Changer',
    shortDescription: 'Rewrites paragraphs into 4 distinct professional, casual, persuasive, or executive tones while preserving core meaning.',
    searchVolumeBadge: 'Writing Utility #1',
    accentColor: 'from-violet-500 to-fuchsia-500',
    badgeColor: 'text-violet-400 border-violet-500/30 bg-violet-950/40',
    iconName: 'Feather',
    seoTitle: 'Free AI Paragraph Rewriter & Tone Changer - Paraphrasing Tool Online',
    seoDescription: 'Rewrite paragraphs and adjust writing tone instantly. Switch between executive professional, conversational, confident, and academic styles.',
    seoKeywords: ['paragraph rewriter online', 'tone changer ai', 'paraphrasing tool free', 'rewrite text professionally'],
    longTailKeywords: ['how to rewrite informal email to sound polite and professional to boss', 'paraphrase academic paragraph without plagiarism'],
    presets: [
      { label: 'Informal Email to Executive Polish', values: { originalText: 'Hey team, we need to hurry up and finish the slides because the client is getting annoyed about the delays.', targetTone: 'Executive & Diplomatic Professional' } },
      { label: 'Technical Jargon to Consumer Friendly', values: { originalText: 'Our microservice architecture leverages distributed event-driven pub/sub queues to minimize ingress throughput latency.', targetTone: 'Simple & Conversational (Explain Like I am 12)' } }
    ],
    fields: [
      { name: 'originalText', label: 'Paste Paragraph to Rewrite', type: 'textarea', defaultValue: 'We have to push back the project deadline because the backend team is running behind on the database migration.', required: true },
      { name: 'targetTone', label: 'Desired Writing Tone', type: 'select', defaultValue: 'Executive & Diplomatic Professional', options: [
        { label: 'Executive & Diplomatic Professional', value: 'Executive & Diplomatic' },
        { label: 'Persuasive & High-Energy Sales', value: 'Persuasive & High-Energy' },
        { label: 'Friendly & Conversational', value: 'Friendly & Conversational' },
        { label: 'Concise & Direct (Cut 50% words)', value: 'Concise & Direct' },
        { label: 'Academic & Formal Research', value: 'Academic & Formal' }
      ]}
    ],
    compilePrompt: (values) => `Act as an elite copyeditor. Rewrite the following text: "${values.originalText}" in a ${values.targetTone} tone.\n1. Provide 3 distinct rewrite options.\n2. Detail what was changed (filler words cut, passive voice converted to active, softened language).\n3. Keep the original intent intact while improving clarity and cadence.`,
    howToSteps: [
      { name: 'Paste Text', text: 'Paste any draft email, article paragraph, or customer response.' },
      { name: 'Select Tone', text: 'Choose executive, conversational, concise, or persuasive.' },
      { name: 'Pick Best Variation', text: 'Click Search via AI Mode for 3 polished rewrites with tone analysis.' }
    ],
    faqs: [
      { question: 'Does paraphrasing text bypass AI detectors?', answer: 'Rewriting for human clarity, rhythmic sentence length variation, and authentic voice creates genuinely high-quality communication.' }
    ],
    keyFeatures: ['3 Distinct Stylistic Variations', 'Active Voice Sentence Optimization', 'Fluff & Jargon Elimination'],
    whyAIMode: 'AI Search Mode adapts vocabulary to real corporate communication standards.'
  },
  {
    id: 'seo-blog-outline',
    slug: 'seo-blog-post-outline-generator',
    aliases: ['seo-outline', 'blog-outline-generator', 'content-brief-generator'],
    number: '34',
    category: 'Marketing',
    title: 'SEO Blog Post Outline & Topic Cluster Generator',
    shortDescription: 'Builds comprehensive, rank-ready H2/H3 blog post outlines, search intent briefs, and internal linking topic clusters.',
    searchVolumeBadge: 'SEO Content Essential',
    accentColor: 'from-teal-500 to-cyan-500',
    badgeColor: 'text-teal-400 border-teal-500/30 bg-teal-950/40',
    iconName: 'Search',
    seoTitle: 'Free AI SEO Blog Post Outline Generator - High-Ranking Content Brief',
    seoDescription: 'Generate comprehensive H2 and H3 blog outlines optimized for Google organic search intent. Includes featured snippet targets and FAQs.',
    seoKeywords: ['seo blog outline generator', 'content brief generator', 'blog post outline ai', 'seo content structure'],
    longTailKeywords: ['how to write blog post outline that ranks for competitive keyword', 'content brief with people also ask questions'],
    presets: [
      { label: 'How to Start a Podcast in 2026', values: { targetKeyword: 'how to start a podcast', audience: 'Beginner creators and entrepreneurs wanting to build brand authority', wordCount: '2500 - 3000 words' } }
    ],
    fields: [
      { name: 'targetKeyword', label: 'Primary Target SEO Keyword', type: 'text', defaultValue: 'best productivity apps for remote teams', required: true },
      { name: 'audience', label: 'Target Reader Persona & Search Intent', type: 'text', defaultValue: 'Remote managers and startup founders looking to eliminate communication bottlenecks', required: true },
      { name: 'wordCount', label: 'Target Article Length', type: 'select', defaultValue: 'Comprehensive Pillar Post (2,000 - 3,000 words)', options: [
        { label: 'Short Guide (1,000 - 1,500 words)', value: '1,000 - 1,500 words' },
        { label: 'Comprehensive Pillar Post (2,000 - 3,000 words)', value: '2,000 - 3,000 words' },
        { label: 'Ultimate Definitive Guide (3,500+ words)', value: '3,500+ words' }
      ]}
    ],
    compilePrompt: (values) => `Act as a principal SEO content strategist. Create a complete, high-ranking content outline for the target keyword: "${values.targetKeyword}" targeting "${values.audience}" at a length of ${values.wordCount}.\n1. Target Search Intent and Featured Snippet Opportunity.\n2. Complete H1, H2, and H3 header hierarchy with bullet points for key data.\n3. Semantic LSI keywords and People Also Ask questions to answer.\n4. Compelling title tags with high Organic CTR.`,
    howToSteps: [
      { name: 'Enter Focus Keyword', text: 'Input the main phrase you want your blog article to rank for.' },
      { name: 'Define Reader Intent', text: 'Specify whether they are beginners, buyers, or industry experts.' },
      { name: 'Generate Content Brief', text: 'Click Search via AI Mode for H2/H3 headers, FAQs, and snippet targets.' }
    ],
    faqs: [
      { question: 'What is a Featured Snippet Target in SEO?', answer: 'A 40-50 word direct definition or ordered list answering the search query concisely right under the H2 header.' }
    ],
    keyFeatures: ['Featured Snippet Targeting', 'LSI Keyword Integration', 'Semantic Topic Cluster Mapping'],
    whyAIMode: 'AI Search analyzes the current top 5 Google search results for content gaps.'
  },
  {
    id: 'linkedin-writer',
    slug: 'linkedin-post-carousel-writer',
    aliases: ['linkedin-writer', 'linkedin-post-generator', 'linkedin-hooks'],
    number: '35',
    category: 'Social',
    title: 'LinkedIn Thought Leadership Post & Carousel Writer',
    shortDescription: 'Drafts high-engagement LinkedIn posts with punchy scroll-stopping hooks, line-break formatting, and PDF carousel slides.',
    searchVolumeBadge: 'B2B Creator Trend',
    accentColor: 'from-blue-600 to-sky-400',
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-950/40',
    iconName: 'Share2',
    seoTitle: 'Free AI LinkedIn Post Generator - Viral Hooks & Carousel Outlines',
    seoDescription: 'Write high-engagement LinkedIn posts and PDF carousel slides. Scroll-stopping hooks, authentic storytelling, and high click-through formatting.',
    seoKeywords: ['linkedin post generator', 'linkedin hook writer', 'viral linkedin post maker', 'linkedin carousel generator'],
    longTailKeywords: ['how to write linkedin post that gets high comments and reposts', 'linkedin storytelling framework for founders'],
    presets: [
      { label: 'Lessons Learned from $1M Failure', values: { topic: 'The painful lessons I learned losing $50k on my first SaaS startup and why product distribution matters more than perfect code', format: 'Personal Story & Contrarian Lesson', callToAction: 'Question inviting comments from founders' } }
    ],
    fields: [
      { name: 'topic', label: 'Core Insight, Story, or Industry Lesson', type: 'textarea', defaultValue: 'Why 90% of meetings could be replaced with a 3-minute Loom video, and how our team got 8 hours back every week.', required: true },
      { name: 'format', label: 'LinkedIn Post Format', type: 'select', defaultValue: 'Contrarian Take with 5 Bulleted Proof Points', options: [
        { label: 'Contrarian Take with 5 Bulleted Proof Points', value: 'Contrarian Take' },
        { label: 'Vulnerable Founder Story (Problem -> Crisis -> Lesson)', value: 'Vulnerable Founder Story' },
        { label: '10-Slide PDF Carousel Slide-by-Slide Outline', value: 'PDF Carousel Outline' },
        { label: 'Curated Resource List / Playbook Breakdown', value: 'Curated Playbook' }
      ]},
      { name: 'callToAction', label: 'Engagement Goal / Closing Ask', type: 'text', defaultValue: 'Ask a specific question to spark debate in the comments' }
    ],
    compilePrompt: (values) => `Act as a top 1% B2B LinkedIn creator. Write a viral, authentic LinkedIn post on: "${values.topic}" in the "${values.format}" style. Closing ask: "${values.callToAction}".\n1. Write 3 scroll-stopping 1-line hooks (under 210 characters before the "see more" cutoff).\n2. Format with clean line breaks, high whitespace, and zero corporate buzzwords.\n3. Include a comment-driving question and 3 relevant hashtags.`,
    howToSteps: [
      { name: 'Enter Your Insight', text: 'Share a real experience, contrarian opinion, or tactical playbook.' },
      { name: 'Choose Format', text: 'Select story, contrarian view, or carousel slide breakdown.' },
      { name: 'Publish & Engage', text: 'Click Search via AI Mode for optimized formatting and "see more" hooks.' }
    ],
    faqs: [
      { question: 'Why does the "see more" hook matter on LinkedIn?', answer: 'The LinkedIn algorithm heavily weights the percentage of readers who click "see more" within the first 1-2 lines.' }
    ],
    keyFeatures: ['See-More Cutoff Optimization', 'Mobile Whitespace Line Breaking', 'Comment Catalyst Questions'],
    whyAIMode: 'AI Search Mode studies current LinkedIn algorithm dwell-time signals.'
  },
  {
    id: 'yt-desc-gen',
    slug: 'youtube-description-generator',
    aliases: ['youtube-description', 'yt-seo-tags', 'video-timestamps-generator'],
    number: '36',
    category: 'Content',
    title: 'YouTube Description & Timestamps Generator',
    shortDescription: 'Generates SEO-keyword rich YouTube video descriptions, chapter timestamps, and affiliate link callouts that rank on search.',
    searchVolumeBadge: 'Creator Suite Top 5',
    accentColor: 'from-red-500 to-rose-500',
    badgeColor: 'text-red-400 border-red-500/30 bg-red-950/40',
    iconName: 'Video',
    seoTitle: 'Free YouTube Description & Timestamps Generator - Video SEO Tags',
    seoDescription: 'Create SEO-optimized YouTube descriptions with clickable chapter timestamps, social links, and targeted keyword tags. Free creator tool.',
    seoKeywords: ['youtube description generator', 'youtube timestamp generator', 'youtube video tags generator', 'video seo description'],
    longTailKeywords: ['how to write youtube description for high search rank', 'clickable chapter timestamps format youtube 00:00'],
    presets: [
      { label: 'Beginner Python Coding Tutorial', values: { videoTitle: 'Python for Beginners - Full 4-Hour Crash Course (2026)', keySections: 'Setup environment, Variables, Loops, Functions, Object-Oriented Programming, Building a Web Scraper Project', linksToInclude: 'GitHub repo link, Python download page, Discord community' } }
    ],
    fields: [
      { name: 'videoTitle', label: 'YouTube Video Title', type: 'text', defaultValue: 'How to Build an AI Agent in 15 Minutes (Step-by-Step Tutorial)', required: true },
      { name: 'keySections', label: 'Video Milestones / Chapters covered', type: 'textarea', defaultValue: '0:00 Intro and Demo, 1:45 Setting up the API keys, 4:20 Writing the Python agent logic, 8:15 Connecting tools and search, 12:30 Deploying to cloud, 14:10 Final thoughts and next steps', required: true },
      { name: 'linksToInclude', label: 'Affiliate Links, Social Handles, or Free Downloads', type: 'text', defaultValue: 'GitHub source code repo, Twitter profile, Free newsletter link' }
    ],
    compilePrompt: (values) => `Act as an expert YouTube SEO optimizer. Create a complete, high-ranking video description for: "${values.videoTitle}". Chapters: ${values.keySections}. Links: ${values.linksToInclude}.\n1. First 2-3 lines (visible above "Show more") summarizing value with primary search keywords.\n2. Clickable chapter timestamps starting strictly at 00:00.\n3. Key takeaways bullet list.\n4. Relevant hashtags and 15 comma-separated backend YouTube tags.`,
    howToSteps: [
      { name: 'Input Title & Chapters', text: 'Enter your video topic and rough timestamp breakdown.' },
      { name: 'Add Resource Links', text: 'Include course links, sponsors, or software tools mentioned.' },
      { name: 'Copy Ready Description', text: 'Click Search via AI Mode for formatted timestamps and SEO tags.' }
    ],
    faqs: [
      { question: 'Why must YouTube timestamps start at 00:00?', answer: 'YouTube will not parse chapters unless the first timestamp is exactly 00:00 or 0:00.' }
    ],
    keyFeatures: ['00:00 Clickable Chapter Parser', 'First 150-Character Hook Optimization', 'Backend Comma-Separated Tag Clusters'],
    whyAIMode: 'AI Search Mode pulls high search volume tags related to your exact video title.'
  },
  {
    id: 'tweet-thread',
    slug: 'twitter-thread-generator',
    aliases: ['tweet-generator', 'x-thread-writer', 'twitter-hook-generator'],
    number: '37',
    category: 'Social',
    title: 'Tweet & X Thread Writer with Viral Hooks',
    shortDescription: 'Constructs 6-part viral X/Twitter threads with curiosity-gap opening hooks, concise value nuggets, and concluding retweets.',
    searchVolumeBadge: 'Social Growth Top 3',
    accentColor: 'from-sky-400 to-blue-500',
    badgeColor: 'text-sky-400 border-sky-500/30 bg-sky-950/40',
    iconName: 'MessageSquare',
    seoTitle: 'Free AI Twitter Thread & Viral Hook Writer - X Thread Generator',
    seoDescription: 'Write viral X (Twitter) threads that get bookmarks and retweets. Curiosity gap hook formulas, 280-character formatting, and conclusion CTAs.',
    seoKeywords: ['twitter thread generator', 'x thread writer', 'viral tweet hook generator', 'write twitter thread ai'],
    longTailKeywords: ['how to write twitter thread that gets 1000 bookmarks', 'curiosity gap hook formula for twitter thread'],
    presets: [
      { label: '10 Tools that Replace a $100k Agency', values: { coreTheme: '10 free AI and automation tools that replace an entire marketing agency for solopreneurs', style: 'Curated Toolkit / High-Bookmark Curation' } }
    ],
    fields: [
      { name: 'coreTheme', label: 'Thread Topic or Main Thesis', type: 'textarea', defaultValue: '5 psychological cognitive biases that make people buy things without realizing it, with real marketing examples.', required: true },
      { name: 'style', label: 'Thread Style Archetype', type: 'select', defaultValue: 'Educational Curation & Bookmark Magnet', options: [
        { label: 'Educational Curation & Bookmark Magnet', value: 'Educational Curation' },
        { label: 'Storytelling Case Study (0 to 1 million)', value: 'Case Study' },
        { label: 'Unpopular Opinion & Contrarian Breakdown', value: 'Contrarian Breakdown' },
        { label: 'Step-by-Step Tutorial & Playbook', value: 'Tutorial' }
      ]}
    ],
    compilePrompt: (values) => `Act as an elite X (Twitter) ghostwriter with 500k+ followers. Write a compelling 6-part thread on: "${values.coreTheme}" in the "${values.style}" archetype.\n1. Tweet 1: Hook Tweet. Provide 3 distinct hook variations (curiosity gap, high contrast, contrarian truth) under 260 characters.\n2. Tweets 2 to 5: High-density value nuggets with bullet points.\n3. Tweet 6: Conclusion, key takeaway, and CTA to retweet and follow.`,
    howToSteps: [
      { name: 'Define Core Thesis', text: 'Enter your insight, list of tools, or business story.' },
      { name: 'Choose Thread Vibe', text: 'Select curation, case study, or contrarian breakdown.' },
      { name: 'Copy Formatted Tweets', text: 'Click Search via AI Mode for 280-character tweets ready to post.' }
    ],
    faqs: [
      { question: 'Why are bookmarks more valuable than likes on X (Twitter)?', answer: 'The algorithm heavily scores bookmarks as a sign of high-retention evergreen value, giving threads prolonged distribution for weeks.' }
    ],
    keyFeatures: ['Under-280-Character Strict Fitting', '3 Viral Hook Variations', 'High-Bookmark Curation Structure'],
    whyAIMode: 'AI Search Mode references trending tweet archetypes and engagement algorithms.'
  },
  {
    id: 'grammar-checker',
    slug: 'grammar-readability-checker',
    aliases: ['grammar-checker', 'hemingway-editor', 'readability-score', 'proofreader'],
    number: '38',
    category: 'Content',
    title: 'Grammar & Hemingway Readability Checker',
    shortDescription: 'Analyzes readability grade level, highlights passive voice, eliminates redundant adverbs, and fixes grammatical syntax.',
    searchVolumeBadge: 'Everyday Writing Utility',
    accentColor: 'from-amber-500 to-orange-400',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
    iconName: 'CheckSquare',
    seoTitle: 'Free Grammar & Hemingway Readability Checker - Grade Level Analyzer',
    seoDescription: 'Analyze readability grade score, fix complex sentences, highlight passive voice, and eliminate weak adverbs online for free.',
    seoKeywords: ['grammar checker free', 'hemingway readability checker', 'flesch kincaid grade calculator', 'proofread online free'],
    longTailKeywords: ['how to lower readability grade level to grade 6 for plain english', 'highlight passive voice sentences and convert to active'],
    presets: [
      { label: 'Check Complex Academic Paragraph', values: { draftText: 'It is widely believed by numerous researchers that the utilization of excessively verbose phraseology has a detrimental effect on reader comprehension indices.', targetGrade: 'Grade 6 - 8 (Clear, punchy, accessible to all)' } }
    ],
    fields: [
      { name: 'draftText', label: 'Paste Draft Text for Proofreading', type: 'textarea', defaultValue: 'The decision was made by the executive committee that employees should be required to return to the office, which was met with substantial resistance.', required: true },
      { name: 'targetGrade', label: 'Desired Readability Target', type: 'select', defaultValue: 'Grade 6 - 8 (Clear, punchy, accessible to all)', options: [
        { label: 'Grade 5 - 6 (Mass consumer, ultra simple)', value: 'Grade 5-6' },
        { label: 'Grade 7 - 9 (Standard business & editorial)', value: 'Grade 7-9' },
        { label: 'Grade 10 - 12 (Specialized professional)', value: 'Grade 10-12' }
      ]}
    ],
    compilePrompt: (values) => `Act as an expert copyeditor adhering to the Hemingway clarity standard and Chicago Manual of Style. Analyze: "${values.draftText}". Target readability: ${values.targetGrade}.\n1. Calculate estimated Flesch-Kincaid grade level.\n2. Highlight passive voice sentences and rewrite in strong active voice.\n3. Flag unnecessary adverbs and zombie words.\n4. Provide the final, immaculate proofread version.`,
    howToSteps: [
      { name: 'Paste Your Draft', text: 'Enter any email, essay, blog post, or pitch.' },
      { name: 'Select Target Grade', text: 'Choose standard business, consumer, or technical clarity.' },
      { name: 'Readability Analysis', text: 'Click Search via AI Mode for passive voice fixes and word count trimming.' }
    ],
    faqs: [
      { question: 'Why does lowering reading grade level increase conversions?', answer: 'Studies show that even executives read 30% faster when text is at a 7th-grade reading level because it reduces cognitive load.' }
    ],
    keyFeatures: ['Flesch-Kincaid Grade Estimation', 'Passive-to-Active Voice Engine', 'Adverb & Fluff Elimination'],
    whyAIMode: 'AI Search Mode uses linguistic parsing to preserve the author original voice while removing clunky phrasing.'
  },
  {
    id: 'newsletter-subject',
    slug: 'newsletter-subject-line-generator',
    aliases: ['subject-line-generator', 'email-open-rate', 'newsletter-titles'],
    number: '39',
    category: 'Marketing',
    title: 'Newsletter Subject Line & Open-Rate Optimizer',
    shortDescription: 'Brainstorms 10 high-open-rate subject lines and preview text snippets using curiosity, urgency, and personalized formats.',
    searchVolumeBadge: 'Email Marketing Essential',
    accentColor: 'from-purple-500 to-pink-500',
    badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-950/40',
    iconName: 'Mail',
    seoTitle: 'Free Newsletter Subject Line Generator - 10 High Open-Rate Ideas',
    seoDescription: 'Generate curiosity-driven newsletter subject lines with matched preview text. Maximize email open rates on Gmail, Apple Mail, and Outlook.',
    seoKeywords: ['newsletter subject line generator', 'email open rate optimizer', 'email subject line tester', 'catchy email subjects'],
    longTailKeywords: ['how to write email subject lines with 50 percent open rate', 'lowercase casual email subject lines for marketing'],
    presets: [
      { label: 'Tech Newsletter on AI Search Shift', values: { newsletterTopic: 'How Google AI search is changing website traffic and what content creators need to do now', audience: 'Marketers, SEO professionals, and publishers' } }
    ],
    fields: [
      { name: 'newsletterTopic', label: 'Newsletter Issue Content & Main Story', type: 'textarea', defaultValue: '3 common morning habits that ruin your dopamine levels, plus a simple 5-minute morning routine to fix your energy.', required: true },
      { name: 'audience', label: 'Subscriber Niche', type: 'text', defaultValue: 'Health-conscious professionals and founders', required: true }
    ],
    compilePrompt: (values) => `Act as a top direct-response email marketing strategist (Morning Brew / Milk Road style). Generate 10 high-open-rate subject line pairs for: "${values.newsletterTopic}" targeting "${values.audience}".\nCategorize into:\n- Curiosity Gap & Counter-Intuitive\n- Short & Casual (All-lowercase, feels like a friend)\n- How-To & Tactical\nFor each subject line, provide a matching 50-character Preview Text (Preheader) that doubles opens.`,
    howToSteps: [
      { name: 'Describe the Issue', text: 'Enter your core topic, interview highlight, or tactical lesson.' },
      { name: 'Specify Your Readers', text: 'Target founders, engineers, creators, or hobbyists.' },
      { name: 'Get 10 Pairs in AI', text: 'Click Search via AI Mode for subject lines and preheaders tested against spam filters.' }
    ],
    faqs: [
      { question: 'Why do all-lowercase subject lines often get higher open rates?', answer: 'They visually resemble personal emails from friends rather than promotional marketing blasts.' }
    ],
    keyFeatures: ['Matched Preheader Preview Text', 'Spam Trigger Word Avoidance', 'Mobile 35-Character Truncation Safe'],
    whyAIMode: 'AI Search Mode checks current email deliverability and spam-filter algorithmic triggers.'
  },
  {
    id: 'podcast-notes',
    slug: 'podcast-show-notes-generator',
    aliases: ['podcast-notes', 'show-notes-generator', 'podcast-timestamps'],
    number: '40',
    category: 'Content',
    title: 'Podcast Episode Title & Show Notes Generator',
    shortDescription: 'Produces catchy Apple/Spotify podcast episode titles, guest bio intros, key quote highlights, and structured episode show notes.',
    searchVolumeBadge: 'Podcasting Suite',
    accentColor: 'from-fuchsia-500 to-rose-400',
    badgeColor: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-950/40',
    iconName: 'Mic',
    seoTitle: 'Free Podcast Show Notes & Episode Title Generator - Spotify & Apple',
    seoDescription: 'Generate engaging podcast titles, episode summaries, guest introduction bios, and resource link lists for Spotify and Apple Podcasts.',
    seoKeywords: ['podcast show notes generator', 'podcast title ideas', 'podcast summary generator', 'spotify episode notes'],
    longTailKeywords: ['how to write podcast show notes that rank on google and apple podcasts', 'podcast episode guest introduction script'],
    presets: [
      { label: 'Interview with Fintech Founder', values: { guestTopic: 'Interview with Sarah Chen, founder of an AI accounting software that raised $15M. She discusses product-market fit, hiring first 10 engineers, and navigating market downturns.', podcastName: 'The Modern Founder Podcast' } }
    ],
    fields: [
      { name: 'guestTopic', label: 'Guest Name, Expertise, and Main Discussion Points', type: 'textarea', defaultValue: 'Interview with Dr. Andrew Huberman discussing sleep optimization, light exposure timing, and the neuroscience of focus.', required: true },
      { name: 'podcastName', label: 'Podcast Name & Show Style', type: 'text', defaultValue: 'The High Performance Mindset', required: true }
    ],
    compilePrompt: (values) => `Act as an executive podcast producer. Generate complete show notes for: "${values.guestTopic}" for the show "${values.podcastName}".\n1. 5 High-CTR episode titles.\n2. Engaging 2-paragraph episode summary for Apple Podcasts and Spotify.\n3. 5 Key takeaways and notable pull-quotes.\n4. Resources and books mentioned section.`,
    howToSteps: [
      { name: 'Summarize Episode', text: 'Enter guest credentials and primary conversation topics.' },
      { name: 'Set Show Vibe', text: 'Specify business, wellness, comedy, or true crime tone.' },
      { name: 'Copy Ready Notes', text: 'Click Search via AI Mode for Spotify-ready formatted show notes.' }
    ],
    faqs: [
      { question: 'Do podcast show notes help with Google SEO ranking?', answer: 'Yes! Google indexes podcast show notes on Google Search and YouTube, driving organic discovery.' }
    ],
    keyFeatures: ['Guest Credential Highlighting', 'Quotable Soundbite Extraction', 'Apple & Spotify Directory Formatting'],
    whyAIMode: 'AI Search checks public guest bio details and relevant book publications.'
  },
  {
    id: 'story-plot-hook',
    slug: 'creative-story-plot-hook-generator',
    aliases: ['story-hook', 'plot-generator', 'novel-writing-prompts', 'screenplay-hooks'],
    number: '41',
    category: 'Content',
    title: 'Creative Story & Screenplay Plot Hook Generator',
    shortDescription: 'Brainstorms dramatic narrative premises, high-stakes central conflicts, plot twists, and 3-act story arc outlines.',
    searchVolumeBadge: 'Fiction Writers Top Pick',
    accentColor: 'from-amber-400 to-rose-500',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
    iconName: 'Sparkles',
    seoTitle: 'Free Creative Story & Screenplay Plot Hook Generator - Fiction Writing',
    seoDescription: 'Generate unique novel plot concepts, high-stakes conflicts, inciting incidents, and unforeseen twists for sci-fi, thriller, fantasy, and drama.',
    seoKeywords: ['story plot generator', 'screenplay hook generator', 'fiction writing prompts', 'creative writing plot ideas'],
    longTailKeywords: ['how to write a compelling inciting incident for a thriller novel', 'sci fi high concept plot ideas with unexpected twist'],
    presets: [
      { label: 'Sci-Fi Dystopian Memory Mystery', values: { genre: 'Sci-Fi Thriller', seedIdea: 'In a society where memories can be legally traded, a memory detective discovers his own childhood memory inside the mind of a murdered billionaire.', stakes: 'His identity and life are targeted by the ruling cartel' } }
    ],
    fields: [
      { name: 'genre', label: 'Story Genre', type: 'select', defaultValue: 'Psychological Thriller', options: [
        { label: 'Psychological Thriller', value: 'Psychological Thriller' },
        { label: 'Sci-Fi & Cyberpunk', value: 'Sci-Fi' },
        { label: 'Dark Fantasy & Supernatural', value: 'Fantasy' },
        { label: 'Contemporary Drama & Mystery', value: 'Drama' },
        { label: 'Romance with High Obstacles', value: 'Romance' }
      ]},
      { name: 'seedIdea', label: 'Seed Concept, Trope, or Setting', type: 'textarea', defaultValue: 'A retired safecracker is hired for one last job, only to discover the vault contains no money—only live surveillance feeds into his own family home.', required: true },
      { name: 'stakes', label: 'What happens if the protagonist fails?', type: 'text', defaultValue: 'His family life is permanently destroyed and he is framed for treason' }
    ],
    compilePrompt: (values) => `Act as an award-winning creative writing instructor and Hollywood screenwriting consultant. Develop a compelling narrative architecture for: Genre: ${values.genre}, Seed: "${values.seedIdea}", Stakes: "${values.stakes}".\n1. High-concept 1-sentence Logline.\n2. The Inciting Incident and Point of No Return.\n3. 3-Act Structure breakdown (Setup, Confrontation, Climax).\n4. A mid-point reversal and an unforgettable final plot twist.`,
    howToSteps: [
      { name: 'Select Genre', text: 'Choose sci-fi, fantasy, thriller, romance, or drama.' },
      { name: 'Enter Core Premise', text: 'Input what makes the world or the situation unique.' },
      { name: 'Generate Plot Arc', text: 'Click Search via AI Mode for loglines, 3-act beats, and twist endings.' }
    ],
    faqs: [
      { question: 'What is a "Logline" in storytelling?', answer: 'A 1-2 sentence summary that introduces the protagonist, the inciting incident, their primary goal, and the central conflict with high stakes.' }
    ],
    keyFeatures: ['3-Act Hollywood Beat Breakdown', 'High-Concept Logline Crafting', 'Mid-Point Reversal Architecture'],
    whyAIMode: 'AI Search Mode identifies overused genre tropes and suggests fresh, unexpected twists.'
  },
  {
    id: 'hashtag-gen',
    slug: 'hashtag-generator-social',
    aliases: ['hashtag-generator', 'instagram-hashtags', 'tiktok-tags', 'social-media-tags'],
    number: '42',
    category: 'Social',
    title: 'Hashtag Generator for Instagram & TikTok',
    shortDescription: 'Generates tiered high-reach, medium-niche, and community hashtags to maximize discoverability without triggering shadowbans.',
    searchVolumeBadge: 'Social Reach Utility',
    accentColor: 'from-pink-500 to-rose-400',
    badgeColor: 'text-pink-400 border-pink-500/30 bg-pink-950/40',
    iconName: 'Hash',
    seoTitle: 'Free Hashtag Generator for Instagram & TikTok - High Reach & Niche Tags',
    seoDescription: 'Generate targeted hashtags for Instagram, TikTok, and Reels. Tiered high, medium, and low competition tags to maximize organic reach safely.',
    seoKeywords: ['hashtag generator online', 'instagram hashtag generator', 'tiktok tags maker', 'trending hashtags generator'],
    longTailKeywords: ['how to choose hashtags for instagram reels to get on explore page', 'best hashtag strategy 3x3 rule for small accounts'],
    presets: [
      { label: 'Specialty Coffee Roaster Brand', values: { niche: 'Specialty third wave coffee brewing, V60 pour over recipes, and artisanal light roasts', platform: 'Instagram (Reels & Feed)' } }
    ],
    fields: [
      { name: 'niche', label: 'Content Topic & Niche Specifics', type: 'text', defaultValue: 'Calisthenics workout routines, muscle-up progression, bodyweight fitness for beginners', required: true },
      { name: 'platform', label: 'Primary Target Platform', type: 'select', defaultValue: 'Instagram (Reels & Feed)', options: [
        { label: 'Instagram (Reels & Feed)', value: 'Instagram' },
        { label: 'TikTok (FYP Search Optimization)', value: 'TikTok' },
        { label: 'YouTube Shorts', value: 'YouTube Shorts' },
        { label: 'Pinterest & Threads', value: 'Pinterest & Threads' }
      ]}
    ],
    compilePrompt: (values) => `Act as a social media algorithm strategist. Generate a structured hashtag strategy for: "${values.niche}" on ${values.platform}.\n1. 5 High-Volume Broad Tags (>1M posts) for category discovery.\n2. 10 Mid-Tier Targeted Tags (50k - 500k posts) where the account can rank on the Explore page.\n3. 10 Micro-Niche Community Tags (<50k posts) for high-intent followers.\n4. 5 Banned or spammy hashtags to strictly avoid in this niche.`,
    howToSteps: [
      { name: 'Enter Your Niche', text: 'Type your specific product, workout, recipe, or travel topic.' },
      { name: 'Pick Platform', text: 'Select Instagram, TikTok, or YouTube Shorts.' },
      { name: 'Copy Tiered Tags', text: 'Click Search via AI Mode for curated tags categorized by competition level.' }
    ],
    faqs: [
      { question: 'How many hashtags should you use on Instagram in 2026?', answer: 'Instagram recommends 3 to 5 hyper-relevant niche hashtags rather than dumping 30 generic ones to avoid triggering spam filters.' }
    ],
    keyFeatures: ['Tiered High/Mid/Micro Strategy', 'Banned Tag Warning Check', 'Platform-Specific Algorithm Tuning'],
    whyAIMode: 'AI Search Mode checks current active trending tags and flagged spam lists.'
  }
];
