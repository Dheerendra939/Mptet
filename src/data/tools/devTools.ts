import { ToolDefinition } from '../../types';

export const DEV_TOOLS: ToolDefinition[] = [
  {
    id: 'regex-gen',
    slug: 'regex-generator',
    aliases: ['regex', 'regexp-generator', 'regex-explainer', 'regular-expression'],
    number: '23',
    category: 'Development',
    title: 'Regex Pattern Generator & Explainer',
    shortDescription: 'Generates robust regular expressions for email, phone, passwords, and custom data patterns with character-by-character plain English explanations.',
    searchVolumeBadge: 'Developer Top Utility',
    accentColor: 'from-emerald-500 to-cyan-500',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
    iconName: 'FileCode',
    seoTitle: 'Free AI Regex Generator & Explainer Online - Regular Expression Pattern Maker',
    seoDescription: 'Generate and explain regex patterns in plain English. Works for JavaScript, Python, PHP, Java, and Go with test sample validation.',
    seoKeywords: ['regex generator online', 'regular expression maker', 'regex explainer', 'regex for email password url'],
    longTailKeywords: ['how to write regex for strong password with special character', 'regex extract text between brackets python'],
    presets: [
      { label: 'Strong Password (8+ chars, 1 upper, 1 num, 1 special)', values: { requirement: 'Must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special symbol like !@#$%', language: 'JavaScript (RegExp)' } },
      { label: 'International Phone Number Validation', values: { requirement: 'Matches international telephone numbers with optional leading plus sign and country code', language: 'Python (re)' } }
    ],
    fields: [
      { name: 'requirement', label: 'What string pattern do you need to match or extract?', type: 'textarea', defaultValue: 'Match valid email addresses including subdomains and plus addressing', required: true },
      { name: 'language', label: 'Target Programming Language', type: 'select', defaultValue: 'JavaScript (RegExp)', options: [
        { label: 'JavaScript (RegExp)', value: 'JavaScript' },
        { label: 'Python (re)', value: 'Python' },
        { label: 'PHP (preg_match)', value: 'PHP' },
        { label: 'Go (regexp)', value: 'Go' },
        { label: 'Java (java.util.regex)', value: 'Java' }
      ]}
    ],
    compilePrompt: (values) => `Act as a senior compiler engineer. Generate a bulletproof Regular Expression in ${values.language} for this specification: "${values.requirement}".\n1. Output the clean regex pattern with recommended flags (e.g. /g, /i, /m).\n2. Provide a character-by-character breakdown explaining every token, quantifier, and group.\n3. List 3 valid matching test cases and 3 invalid edge cases that must fail.`,
    howToSteps: [
      { name: 'Describe Pattern', text: 'Explain in plain words what characters or formats you need to catch.' },
      { name: 'Pick Language', text: 'Select Python, JS, Go, or PHP syntax rules.' },
      { name: 'Get Regex in AI', text: 'Click Search via AI Mode for character-by-character explanations and edge-case unit tests.' }
    ],
    faqs: [
      { question: 'What is Catastrophic Backtracking in regex?', answer: 'It occurs when nested quantifiers cause exponential combinations, locking the CPU. Safe regex patterns avoid ambiguous overlapping tokens.' }
    ],
    keyFeatures: ['Character-by-Character Token Breakdown', 'Edge Case Positive & Negative Tests', 'Language-Specific Flavor Rules'],
    whyAIMode: 'AI Search Mode protects against ReDoS (Regular Expression Denial of Service) vulnerabilities.'
  },
  {
    id: 'json-to-ts',
    slug: 'json-to-typescript',
    aliases: ['json-to-types', 'json-to-ts', 'json-schema-converter'],
    number: '24',
    category: 'Development',
    title: 'JSON to TypeScript & Python Type Generator',
    shortDescription: 'Converts raw JSON payload responses into clean TypeScript interfaces, Zod schemas, or Python Pydantic models.',
    searchVolumeBadge: 'Full-Stack Essential',
    accentColor: 'from-blue-500 to-indigo-400',
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-950/40',
    iconName: 'Terminal',
    seoTitle: 'Free JSON to TypeScript Interface Generator - Zod & Pydantic Converter',
    seoDescription: 'Convert JSON payloads into TypeScript interfaces, Zod validation schemas, and Python Pydantic dataclasses. Clean formatted output.',
    seoKeywords: ['json to typescript', 'json to zod', 'json to pydantic', 'generate typescript interface from json'],
    longTailKeywords: ['how to convert nested json into typescript types', 'generate zod schema from api json response'],
    presets: [
      { label: 'E-commerce Order API Payload', values: { jsonPayload: '{\n  "orderId": "ord_98231",\n  "customer": { "id": 104, "name": "Sarah", "verified": true },\n  "items": [{ "sku": "A1", "price": 49.99, "qty": 2 }],\n  "status": "shipped"\n}', targetFormat: 'TypeScript Interfaces & Types' } }
    ],
    fields: [
      { name: 'jsonPayload', label: 'Paste Raw JSON Payload', type: 'textarea', defaultValue: '{\n  "id": 1,\n  "title": "Sample API response",\n  "tags": ["frontend", "react"],\n  "metadata": { "views": 1420, "isPublic": true }\n}', required: true },
      { name: 'targetFormat', label: 'Desired Type Definition Format', type: 'select', defaultValue: 'TypeScript Interfaces & Types', options: [
        { label: 'TypeScript Interfaces & Types', value: 'TypeScript Interfaces' },
        { label: 'TypeScript + Zod Schema Validation', value: 'TypeScript + Zod' },
        { label: 'Python Pydantic BaseModel (v2)', value: 'Python Pydantic' },
        { label: 'Go Structs with JSON tags', value: 'Go Struct' }
      ]}
    ],
    compilePrompt: (values) => `Convert the following JSON payload into strict, production-ready ${values.targetFormat}:\n\n\`\`\`json\n${values.jsonPayload}\n\`\`\`\n\nEnsure:\n- Handle nested objects with clean descriptive type names.\n- Mark optional vs required fields thoughtfully.\n- Add JSDoc / docstrings where helpful.`,
    howToSteps: [
      { name: 'Paste JSON', text: 'Paste any JSON API response from Postman or network devtools.' },
      { name: 'Choose Schema Format', text: 'Select TypeScript, Zod, Pydantic, or Go struct.' },
      { name: 'Copy Production Types', text: 'Click Search via AI Mode for clean, compile-ready interfaces.' }
    ],
    faqs: [
      { question: 'What is the advantage of Zod schemas over raw TypeScript types?', answer: 'TypeScript types only exist at compile time, whereas Zod verifies runtime payloads against unexpected API data corruption.' }
    ],
    keyFeatures: ['Nested Type Resolution', 'Zod Runtime Validation Support', 'Pydantic v2 Compatible'],
    whyAIMode: 'AI Search Mode infers semantic enums and nullable types based on real-world API structures.'
  },
  {
    id: 'sql-query-gen',
    slug: 'sql-query-generator',
    aliases: ['sql-generator', 'text-to-sql', 'sql-optimizer', 'database-query-builder'],
    number: '25',
    category: 'Development',
    title: 'SQL Query Builder & Schema Optimizer',
    shortDescription: 'Converts natural language questions into optimized SQL queries with indexing recommendations, joins, and Big-O efficiency analysis.',
    searchVolumeBadge: 'Database Pro Tool',
    accentColor: 'from-cyan-500 to-teal-400',
    badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40',
    iconName: 'Database',
    seoTitle: 'Free Text-to-SQL Query Generator & Optimizer - PostgreSQL & MySQL',
    seoDescription: 'Generate complex SQL queries from plain English. Optimize joins, subqueries, group by aggregations, and indexes for PostgreSQL, MySQL, and SQLite.',
    seoKeywords: ['sql query generator', 'text to sql online', 'sql optimizer', 'postgresql query builder', 'complex sql joins generator'],
    longTailKeywords: ['how to write sql query to find top 3 highest spending customers by month', 'optimize slow postgresql query with composite index'],
    presets: [
      { label: 'Monthly Recurring Revenue by Plan (PostgreSQL)', values: { goal: 'Calculate monthly recurring revenue (MRR) grouped by subscription plan tier and cohort sign-up month', dialect: 'PostgreSQL', schemaContext: 'users(id, created_at), subscriptions(id, user_id, plan_name, monthly_price, status)' } }
    ],
    fields: [
      { name: 'goal', label: 'What data do you want to retrieve or aggregate?', type: 'textarea', defaultValue: 'Find the top 5 customers with the highest total order value in the last 90 days along with their email and total number of purchases.', required: true },
      { name: 'dialect', label: 'SQL Engine Dialect', type: 'select', defaultValue: 'PostgreSQL', options: [
        { label: 'PostgreSQL', value: 'PostgreSQL' },
        { label: 'MySQL / MariaDB', value: 'MySQL' },
        { label: 'SQLite', value: 'SQLite' },
        { label: 'Microsoft SQL Server (T-SQL)', value: 'SQL Server' },
        { label: 'Snowflake / BigQuery', value: 'BigQuery / Snowflake' }
      ]},
      { name: 'schemaContext', label: 'Table Schemas / Column Names (Optional)', type: 'textarea', defaultValue: 'customers(id, name, email), orders(id, customer_id, total_amount, created_at)' }
    ],
    compilePrompt: (values) => `Act as a principal database administrator. Write an optimized ${values.dialect} query to accomplish: "${values.goal}". Tables: ${values.schemaContext}.\n1. Provide the formatted SQL query with clear comments.\n2. Explain execution logic (JOINs, aggregations, window functions).\n3. Recommend indexes (e.g. composite B-Tree indexes) to ensure O(log N) lookup speeds.`,
    howToSteps: [
      { name: 'State Analytical Question', text: 'Describe in plain English what metrics or rows you need.' },
      { name: 'Add Table Columns', text: 'List the table names and relevant keys for accurate joins.' },
      { name: 'Run Query Generator', text: 'Click Search via AI Mode for optimized queries and indexing tips.' }
    ],
    faqs: [
      { question: 'Why are Window Functions better than correlated subqueries?', answer: 'Window functions calculate running totals and rankings in a single table pass, avoiding costly O(N²) repeated scan loops.' }
    ],
    keyFeatures: ['Index Recommendation Engine', 'Window Function & CTE Generation', 'Multi-Dialect Compatibility'],
    whyAIMode: 'AI Search brings up specific engine query planner behaviors (EXPLAIN ANALYZE).'
  },
  {
    id: 'cron-gen',
    slug: 'cron-expression-generator',
    aliases: ['cron-generator', 'crontab-maker', 'cron-schedule-explainer'],
    number: '26',
    category: 'Development',
    title: 'Cron Expression Generator & Explainer',
    shortDescription: 'Generates standard 5-part and 6-part cron schedule expressions with plain human-readable time schedules and upcoming trigger runs.',
    searchVolumeBadge: 'Sysadmin Utility',
    accentColor: 'from-purple-500 to-indigo-400',
    badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-950/40',
    iconName: 'Clock',
    seoTitle: 'Free Cron Expression Generator Online - Crontab Schedule Explainer',
    seoDescription: 'Create and explain cron expressions in plain English. Check next execution timestamps for Linux crontab, AWS EventBridge, and GitHub Actions.',
    seoKeywords: ['cron expression generator', 'crontab generator online', 'cron schedule explainer', 'cron job syntax maker'],
    longTailKeywords: ['cron expression for every monday at 9am', 'cron syntax every 15 minutes between 8am and 5pm weekdays'],
    presets: [
      { label: 'Every Weekday at 9:00 AM', values: { scheduleDescription: 'Run every Monday through Friday morning at 9:00 AM', cronSystem: 'Standard Crontab (5 fields: min hr dom mon dow)' } },
      { label: 'Every 30 Minutes on Weekends', values: { scheduleDescription: 'Run every 30 minutes on Saturday and Sunday only', cronSystem: 'Standard Crontab (5 fields: min hr dom mon dow)' } }
    ],
    fields: [
      { name: 'scheduleDescription', label: 'When should your task execute?', type: 'text', defaultValue: 'Run every Sunday night at 11:30 PM', required: true },
      { name: 'cronSystem', label: 'Target System Format', type: 'select', defaultValue: 'Standard Crontab (5 fields: min hr dom mon dow)', options: [
        { label: 'Standard Linux Crontab (5 fields)', value: 'Standard Linux Crontab (5 fields)' },
        { label: 'Quartz Scheduler / Spring (6-7 fields)', value: 'Quartz Scheduler (6 fields)' },
        { label: 'AWS EventBridge / CloudWatch Rule', value: 'AWS EventBridge' },
        { label: 'GitHub Actions workflow schedule', value: 'GitHub Actions' }
      ]}
    ],
    compilePrompt: (values) => `Generate the exact cron schedule expression for: "${values.scheduleDescription}" in ${values.cronSystem} syntax.\n1. Output the exact cron string (e.g. 30 23 * * 0).\n2. Explain the meaning of each position (minute, hour, day of month, month, day of week).\n3. List the next 5 simulated execution timestamps.`,
    howToSteps: [
      { name: 'Type Schedule in English', text: 'Describe timing like "Every weekday at midnight" or "Every 2 hours".' },
      { name: 'Select Target Platform', text: 'Choose Linux Crontab, AWS EventBridge, or GitHub Actions.' },
      { name: 'Verify Cron Timestamps', text: 'Click Search via AI Mode for the next 5 verified trigger times.' }
    ],
    faqs: [
      { question: 'What is the difference between Day-of-Month and Day-of-Week in cron?', answer: 'In standard 5-part cron, field 3 is day of the calendar month (1-31), while field 5 is day of the week (0-6 where 0 is Sunday).' }
    ],
    keyFeatures: ['Next 5 Run Times Projection', 'AWS and GitHub Actions Formatting', 'Field-by-Field Token Syntax Breakdown'],
    whyAIMode: 'AI Search Mode checks specific timezone handling and leap second edge cases.'
  },
  {
    id: 'git-helper',
    slug: 'git-command-helper',
    aliases: ['git-helper', 'git-cheat-sheet', 'git-undo', 'git-merge-conflict'],
    number: '27',
    category: 'Development',
    title: 'Git Command Helper & Undo Wizard',
    shortDescription: 'Provides exact terminal commands to recover lost commits, safely undo changes, resolve rebase conflicts, and clean branches.',
    searchVolumeBadge: 'Developer Lifesaver',
    accentColor: 'from-orange-500 to-red-400',
    badgeColor: 'text-orange-400 border-orange-500/30 bg-orange-950/40',
    iconName: 'Code2',
    seoTitle: 'Free Git Command Helper & Undo Wizard - Fix Mistakes & Conflicts',
    seoDescription: 'Find the right git commands to undo commits, fix merge conflicts, recover deleted branches with reflog, and manage remotes safely.',
    seoKeywords: ['git command helper', 'how to undo git commit', 'git merge conflict resolver', 'git reflog recover commit'],
    longTailKeywords: ['how to undo last commit without losing local changes', 'git revert merge commit with parent main'],
    presets: [
      { label: 'Undo last commit but keep staged files', values: { situation: 'I just committed to the wrong branch by mistake, but I want to keep all my code changes staged in my working tree.', safetyFirst: true } },
      { label: 'Accidentally deleted a local branch', values: { situation: 'I deleted a local git branch before merging it and need to find the commit hash to restore it.', safetyFirst: true } }
    ],
    fields: [
      { name: 'situation', label: 'What happened or what are you trying to accomplish in Git?', type: 'textarea', defaultValue: 'I committed changes to the main branch locally and pushed, but I need to undo that commit on the remote repository safely.', required: true },
      { name: 'safetyFirst', label: 'Prioritize Non-Destructive Solutions (Avoid hard reset data loss)', type: 'toggle', defaultValue: true }
    ],
    compilePrompt: (values) => `Act as a senior DevOps engineer and Git internal expert. Provide step-by-step terminal commands to solve this situation: "${values.situation}".\n1. State the safest terminal commands sequentially.\n2. Explain what each command does under the hood (.git object pointers, HEAD movement).\n3. Provide verification commands (git status, git log) to confirm success.`,
    howToSteps: [
      { name: 'Describe the Git Mishap', text: 'Explain if you committed to wrong branch, lost a commit, or hit a rebase loop.' },
      { name: 'Enable Safe Mode', text: 'Keep Non-Destructive toggle active to prevent lost uncommitted work.' },
      { name: 'Execute Clean Terminal Steps', text: 'Click Search via AI Mode for step-by-step command sequences.' }
    ],
    faqs: [
      { question: 'What is git reflog and how does it prevent data loss?', answer: 'Git reflog records every update to the HEAD pointer locally for 30-90 days, enabling you to recover virtually any commit even if you deleted its branch.' }
    ],
    keyFeatures: ['Reflog Recovery Recipes', 'Non-Destructive Revert Flags', 'Branch Divergence Diagnosis'],
    whyAIMode: 'AI Search Mode prevents dangerous force-push wipeouts.'
  },
  {
    id: 'dockerfile-gen',
    slug: 'dockerfile-generator',
    aliases: ['dockerfile-generator', 'docker-compose-generator', 'container-config'],
    number: '28',
    category: 'Development',
    title: 'Dockerfile & Docker Compose Config Generator',
    shortDescription: 'Generates multi-stage production Dockerfiles and docker-compose.yml files optimized for minimal image size and fast caching.',
    searchVolumeBadge: 'DevOps Standard',
    accentColor: 'from-blue-600 to-cyan-500',
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-950/40',
    iconName: 'Layers',
    seoTitle: 'Free Production Dockerfile & Compose Generator - Multi-Stage Builds',
    seoDescription: 'Generate lightweight, secure Dockerfiles with multi-stage caching and non-root users. Includes complete docker-compose.yml for Node, Python, and Go.',
    seoKeywords: ['dockerfile generator', 'docker compose generator', 'multi stage docker build', 'dockerize node react python app'],
    longTailKeywords: ['how to write multi stage dockerfile for nextjs standalone', 'docker compose with postgres redis and node app'],
    presets: [
      { label: 'Next.js 14 Production Multi-Stage (Node Alpine)', values: { appStack: 'Next.js 14 full-stack app with standalone build', environment: 'Production Multi-stage build with non-root security', includeCompose: true } }
    ],
    fields: [
      { name: 'appStack', label: 'Application Stack & Framework', type: 'text', defaultValue: 'Node.js Express + TypeScript backend with Vite React frontend', required: true },
      { name: 'environment', label: 'Build Target & Requirements', type: 'select', defaultValue: 'Production (Multi-stage, minimal size, non-root user)', options: [
        { label: 'Production (Multi-stage, minimal size, non-root user)', value: 'Production' },
        { label: 'Development (Hot-reload, bind mounts)', value: 'Development' }
      ]},
      { name: 'includeCompose', label: 'Include docker-compose.yml with Database (Postgres/Redis)', type: 'toggle', defaultValue: true }
    ],
    compilePrompt: (values) => `Act as an expert cloud infrastructure architect. Create a production-hardened Dockerfile and ${values.includeCompose ? 'docker-compose.yml' : 'build script'} for: ${values.appStack} in a ${values.environment} configuration.\n1. Use multi-stage builds to minimize image weight.\n2. Ensure proper layer caching order (copy lockfiles before source).\n3. Enforce a non-root security user.\n4. Include a clean .dockerignore file.`,
    howToSteps: [
      { name: 'Define Tech Stack', text: 'Specify Node, Python FastAPI, Go, Rust, or Java.' },
      { name: 'Select Target Build', text: 'Choose production optimization or local development.' },
      { name: 'Copy Docker Config', text: 'Click Search via AI Mode for optimized container configurations.' }
    ],
    faqs: [
      { question: 'Why should Node.js containers run as non-root users?', answer: 'Running as root in a container poses significant security privilege-escalation risks if an application dependency is compromised.' }
    ],
    keyFeatures: ['Multi-Stage Cache Optimization', 'Non-Root Security Hardening', '.dockerignore Clean Generation'],
    whyAIMode: 'AI Search brings up latest security vulnerability patches for base container images.'
  },
  {
    id: 'mock-data-gen',
    slug: 'mock-data-generator',
    aliases: ['mock-data', 'dummy-json-generator', 'fake-data-generator', 'api-seed-data'],
    number: '29',
    category: 'Development',
    title: 'API Mock Data & JSON Schema Generator',
    shortDescription: 'Generates realistic, schema-valid mock datasets (users, transactions, products) in JSON, CSV, or SQL INSERT formats.',
    searchVolumeBadge: 'Frontend Developer Tool',
    accentColor: 'from-teal-400 to-emerald-500',
    badgeColor: 'text-teal-400 border-teal-500/30 bg-teal-950/40',
    iconName: 'Database',
    seoTitle: 'Free API Mock Data Generator Online - Realistic JSON & SQL Seed Data',
    seoDescription: 'Generate realistic mock data for testing APIs and databases. Output authentic names, emails, addresses, and transactions in JSON, CSV, and SQL.',
    seoKeywords: ['mock data generator', 'fake json generator', 'api seed data', 'test database dummy data'],
    longTailKeywords: ['generate 10 mock e-commerce transactions with dates and prices json', 'mock user profile data with avatar urls and phone numbers'],
    presets: [
      { label: '5 E-commerce User Profiles with Orders', values: { schemaRequirements: '5 users with realistic international names, email addresses, avatar URLs, account creation dates, and an array of 2 past orders with items and dollar amounts', outputFormat: 'JSON Array' } }
    ],
    fields: [
      { name: 'schemaRequirements', label: 'Describe the Entities and Data Fields needed', type: 'textarea', defaultValue: '5 customer records with UUID, full name, company, email, phone number, loyalty tier (Bronze, Silver, Gold), and balance.', required: true },
      { name: 'outputFormat', label: 'Desired Data Format', type: 'select', defaultValue: 'JSON Array', options: [
        { label: 'JSON Array', value: 'JSON' },
        { label: 'SQL INSERT Statements', value: 'SQL INSERT' },
        { label: 'CSV (Comma Separated Values)', value: 'CSV' },
        { label: 'TypeScript Fixture Array', value: 'TypeScript' }
      ]}
    ],
    compilePrompt: (values) => `Generate realistic, production-quality mock data according to: "${values.schemaRequirements}". Output strictly as formatted ${values.outputFormat}.\nEnsure values look authentic (real sounding names, plausible dates, correct data types, valid UUIDs).`,
    howToSteps: [
      { name: 'List Desired Fields', text: 'Specify fields like user ID, name, email, pricing, and nested arrays.' },
      { name: 'Choose Format', text: 'Select JSON, SQL INSERT, or CSV.' },
      { name: 'Copy Test Fixtures', text: 'Click Search via AI Mode for clean, formatted test payloads.' }
    ],
    faqs: [
      { question: 'Can I generate thousands of records with this tool?', answer: 'Yes! The prompt specifies seed generators that can be iterated or scripted in local test runners.' }
    ],
    keyFeatures: ['UUID and Realistic Entity Generation', 'Relational Foreign Key Linking', 'Direct SQL & JSON Export'],
    whyAIMode: 'AI Search constructs contextually realistic data rather than generic "Lorem Ipsum".'
  },
  {
    id: 'css-grid-flex',
    slug: 'css-grid-flexbox-generator',
    aliases: ['css-grid', 'flexbox-generator', 'css-layout-builder'],
    number: '30',
    category: 'Development',
    title: 'CSS Flexbox & Modern Grid Code Generator',
    shortDescription: 'Generates responsive modern CSS Flexbox and Grid layouts with Tailwind CSS classes and clean native CSS snippets.',
    searchVolumeBadge: 'UI Developer Utility',
    accentColor: 'from-pink-500 to-purple-500',
    badgeColor: 'text-pink-400 border-pink-500/30 bg-pink-950/40',
    iconName: 'Layers',
    seoTitle: 'Free CSS Grid & Flexbox Generator - Responsive Tailwind Layouts',
    seoDescription: 'Build modern responsive layouts using CSS Grid and Flexbox. Instant generation of native CSS and Tailwind CSS classes with gap and alignment properties.',
    seoKeywords: ['css grid generator', 'flexbox generator', 'responsive css layout generator', 'tailwind grid generator'],
    longTailKeywords: ['how to make responsive 3 column card grid that collapses on mobile css', 'flexbox center child vertically and horizontally'],
    presets: [
      { label: 'Responsive 3-Column Bento Grid with Hero Card', values: { layoutGoal: 'A bento grid layout with 1 double-wide hero card on desktop and 4 smaller cards that seamlessly collapse into a single column on mobile screens', framework: 'Tailwind CSS Classes' } }
    ],
    fields: [
      { name: 'layoutGoal', label: 'Describe Desired Layout Structure', type: 'textarea', defaultValue: 'A responsive dashboard header with a logo on the left, centered navigation links, and action buttons on the right that wraps gracefully on small screens.', required: true },
      { name: 'framework', label: 'CSS Output Style', type: 'select', defaultValue: 'Tailwind CSS Classes', options: [
        { label: 'Tailwind CSS Utility Classes', value: 'Tailwind CSS' },
        { label: 'Standard CSS (Vanilla)', value: 'Vanilla CSS' },
        { label: 'CSS Modules / SCSS', value: 'CSS Modules' }
      ]}
    ],
    compilePrompt: (values) => `Act as a senior frontend UI engineer. Generate clean, accessible, modern layout code for: "${values.layoutGoal}" formatted in ${values.framework}.\n1. Provide the container and item markup.\n2. Detail alignment properties (align-items, justify-content, grid-template-columns: repeat(auto-fit, minmax(...))).\n3. Ensure seamless mobile responsiveness without horizontal overflow.`,
    howToSteps: [
      { name: 'Describe Component Layout', text: 'Explain card grids, hero layouts, sidebars, or navbar alignments.' },
      { name: 'Pick Tailwind or Vanilla CSS', text: 'Select your preferred styling paradigm.' },
      { name: 'Paste Responsive Code', text: 'Click Search via AI Mode for battle-tested modern CSS.' }
    ],
    faqs: [
      { question: 'When should you use CSS Grid vs Flexbox?', answer: 'Use Flexbox for 1-dimensional layouts (a single row or column of items) and CSS Grid for 2-dimensional grid alignments (rows and columns simultaneously).' }
    ],
    keyFeatures: ['Bento Grid & Multi-Column Archetypes', 'Tailwind CSS 3.4 & 4.0 Syntax', 'Zero JavaScript Layout Fluidity'],
    whyAIMode: 'AI Search Mode applies modern subgrid and container query best practices.'
  },
  {
    id: 'bash-explainer',
    slug: 'bash-command-explainer',
    aliases: ['bash-explainer', 'shell-script-generator', 'linux-command-helper'],
    number: '31',
    category: 'Development',
    title: 'Linux Bash Script & Command Explainer',
    shortDescription: 'Explains complex terminal shell commands flag-by-flag and generates safe, automated Bash automation scripts.',
    searchVolumeBadge: 'Linux Sysadmin Essential',
    accentColor: 'from-emerald-400 to-teal-500',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
    iconName: 'Terminal',
    seoTitle: 'Free Linux Bash Command Explainer & Shell Script Generator',
    seoDescription: 'Understand and generate Linux bash scripts and terminal commands. Explains flags, piping, sed, awk, grep, and cron with safe error handling.',
    seoKeywords: ['bash command explainer', 'linux command helper', 'shell script generator', 'explain bash one liner'],
    longTailKeywords: ['how to write bash script to find and delete files older than 30 days', 'explain find grep xargs pipe command linux'],
    presets: [
      { label: 'Explain Complex Find & Xargs Pipeline', values: { commandInput: 'find /var/log -type f -name "*.log" -mtime +14 -print0 | xargs -0 rm -f', mode: 'Explain Existing Command' } }
    ],
    fields: [
      { name: 'commandInput', label: 'Command to Explain OR Automation Task to Script', type: 'textarea', defaultValue: 'Write a bash script that monitors server disk space and sends an alert email if any partition exceeds 85% usage.', required: true },
      { name: 'mode', label: 'Operation Mode', type: 'select', defaultValue: 'Write New Bash Script', options: [
        { label: 'Write New Safe Bash Script', value: 'Write New Script' },
        { label: 'Explain Existing Terminal Command', value: 'Explain Command' }
      ]}
    ],
    compilePrompt: (values) => `Act as a senior Linux systems architect. Process: "${values.commandInput}" in ${values.mode} mode.\n1. Provide the exact shell commands or bash script (with set -euo pipefail for error safety).\n2. Break down every command flag, piping sequence, and subshell.\n3. Include a dry-run safety verification step before modifying files.`,
    howToSteps: [
      { name: 'Paste Command or Goal', text: 'Enter confusing shell commands or describe an automation goal.' },
      { name: 'Select Mode', text: 'Choose between flag-by-flag explanation or new script generation.' },
      { name: 'Review Safe Shell Code', text: 'Click Search via AI Mode for hardened bash automation.' }
    ],
    faqs: [
      { question: 'Why is "set -euo pipefail" considered the bash unofficial strict mode?', answer: 'It ensures scripts exit immediately on errors, undefined variables, and pipe failures, preventing catastrophic silent bugs.' }
    ],
    keyFeatures: ['Flag-by-Flag Explanations', 'Strict Mode Error Handlers', 'Dry-Run Testing Guides'],
    whyAIMode: 'AI Search Mode prevents accidental root folder deletion and permission hazards.'
  },
  {
    id: 'markdown-table',
    slug: 'markdown-table-formatter',
    aliases: ['markdown-table', 'markdown-formatter', 'csv-to-markdown'],
    number: '32',
    category: 'Development',
    title: 'Markdown Table & Document Formatter',
    shortDescription: 'Converts unformatted CSV, tabbed spreadsheet cells, and rough text into aligned GitHub-flavored Markdown tables and documentation.',
    searchVolumeBadge: 'Documentation Utility',
    accentColor: 'from-slate-400 to-cyan-400',
    badgeColor: 'text-slate-300 border-slate-700 bg-slate-900/60',
    iconName: 'FileText',
    seoTitle: 'Free Markdown Table Formatter & CSV to Markdown Converter',
    seoDescription: 'Convert spreadsheets and CSV data into aligned GitHub-Flavored Markdown tables. Clean column spacing and text alignments.',
    seoKeywords: ['markdown table generator', 'csv to markdown table', 'format markdown table online', 'github markdown table maker'],
    longTailKeywords: ['how to format markdown table with left right center alignment', 'convert excel spreadsheet columns to markdown'],
    presets: [
      { label: 'API Endpoints Table (CSV to MD)', values: { rawData: 'Endpoint, Method, Description, Auth Required\n/api/auth/login, POST, User authentication with JWT, No\n/api/user/profile, GET, Fetch user settings, Yes\n/api/payments/webhook, POST, Stripe event listener, Webhook Secret', alignment: 'Center Aligned' } }
    ],
    fields: [
      { name: 'rawData', label: 'Paste CSV or Tabbed Spreadsheet Rows', type: 'textarea', defaultValue: 'Feature, Free Tier, Pro Tier, Enterprise\nProjects, 3, Unlimited, Unlimited\nTeam Members, 1, 10, Unlimited\nDedicated Support, No, Email, 24/7 Phone SLA', required: true },
      { name: 'alignment', label: 'Column Text Alignment', type: 'select', defaultValue: 'Left Aligned (Default)', options: [
        { label: 'Left Aligned (:---)', value: 'Left' },
        { label: 'Center Aligned (:---:)', value: 'Center' },
        { label: 'Right Aligned (---:)', value: 'Right' }
      ]}
    ],
    compilePrompt: (values) => `Convert the following raw data into a perfectly aligned GitHub-Flavored Markdown (GFM) table:\n\n${values.rawData}\n\nAlignment preference: ${values.alignment}.\nEnsure headers, pipes, and hyphens are aligned for optimal monospace readability in code editors.`,
    howToSteps: [
      { name: 'Paste Spreadsheet Data', text: 'Copy cells directly from Excel, Google Sheets, or CSV.' },
      { name: 'Choose Column Alignment', text: 'Select left, center, or right alignment.' },
      { name: 'Copy Markdown', text: 'Click Search via AI Mode for monospace-aligned markdown tables.' }
    ],
    faqs: [
      { question: 'How do you align columns in Markdown tables?', answer: 'Use colons in the separator row: :--- for left, :---: for center, and ---: for right alignment.' }
    ],
    keyFeatures: ['Monospace Pipe Alignment', 'Excel/Sheets Direct Paste Support', 'GitHub Flavored Markdown (GFM) Standard'],
    whyAIMode: 'AI Search Mode sanitizes unescaped pipe characters inside table cells.'
  }
];
