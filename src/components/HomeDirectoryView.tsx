import React, { useMemo } from 'react';
import {
  ArrowRight,
  Filter,
  CheckCircle2,
  Sliders,
  Layers,
  Zap
} from 'lucide-react';
import { ToolDefinition, ToolCategory } from '../types';
import { ToolIcon } from './ToolIcon';

interface HomeDirectoryViewProps {
  tools: ToolDefinition[];
  onSelectTool: (tool: ToolDefinition) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ToolCategory;
  onSelectCategory: (cat: ToolCategory) => void;
}

const CATEGORIES: ToolCategory[] = [
  'All',
  'Finance',
  'Development',
  'Social',
  'Content',
  'Marketing',
  'Productivity',
  'Business',
  'Health',
  'Education',
  'Legal',
  'Utilities',
  'E-commerce',
  'Career'
];

export function HomeDirectoryView({
  tools,
  onSelectTool,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory
}: HomeDirectoryViewProps) {
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesCategory =
        selectedCategory === 'All' ||
        tool.category.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        tool.title.toLowerCase().includes(query) ||
        tool.shortDescription.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query) ||
        tool.seoKeywords.some(kw => kw.toLowerCase().includes(query)) ||
        (tool.longTailKeywords && tool.longTailKeywords.some(kw => kw.toLowerCase().includes(query))) ||
        (tool.longTailUseCases && tool.longTailUseCases.some(uc => uc.query.toLowerCase().includes(query) || uc.title.toLowerCase().includes(query)));

      return matchesCategory && matchesSearch;
    });
  }, [tools, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-white text-slate-600 text-xs font-medium mb-4 shadow-xs">
          <Layers className="w-3.5 h-3.5 text-slate-500" />
          <span>100 Free Online Tools & Calculators</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
          Fast, Reliable <span className="text-slate-600">Everyday Tools</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Clean, accurate calculators and utilities for finance, mathematics, science, development, and daily tasks. Completely distraction-free with instant computations.
        </p>
      </div>

      {/* Popular Fast-Search Terms */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium mr-1">Popular:</span>
        {[
          { label: 'EMI Loan Planner', query: 'emi' },
          { label: 'Percentage Calculator', query: 'percentage' },
          { label: 'Scientific Solver', query: 'scientific' },
          { label: 'Password Generator', query: 'password' },
          { label: 'Fitness Macros', query: 'macro' },
          { label: 'Compound Interest', query: 'compound' },
          { label: 'Word Counter', query: 'word' },
          { label: 'Base64 Codec', query: 'base64' },
          { label: 'JSON Formatter', query: 'json' },
          { label: 'Freelance Rate', query: 'freelance' }
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              onSearchChange(item.query);
              onSelectCategory('All');
            }}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors shadow-2xs"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Category Pills Bar */}
      <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`text-xs font-medium px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat === 'All' ? `All Tools (${tools.length})` : cat}
            </button>
          );
        })}
      </div>

      {/* Tools Grid */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-2xl bg-white border border-slate-200">
          <p className="text-slate-800 text-base font-semibold mb-2">No tools found matching "{searchQuery}"</p>
          <p className="text-slate-500 text-xs mb-4">Try searching for keywords like loan, percentage, password, binary, or conversion</p>
          <button
            onClick={() => {
              onSearchChange('');
              onSelectCategory('All');
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors shadow-xs"
          >
            Clear Search & Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredTools.map(tool => (
            <div
              key={tool.id}
              className="p-6 rounded-2xl bg-white hover:border-slate-300 border border-slate-200/90 transition-all flex flex-col justify-between group shadow-xs hover:shadow-md relative overflow-hidden"
            >
              <div>
                {/* Top Badge & Number */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                    {tool.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-medium">
                    #{tool.number}
                  </span>
                </div>

                {/* Icon & Title */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors shrink-0">
                    <ToolIcon name={tool.iconName} className="w-5 h-5" />
                  </div>
                  <div>
                    <a
                      href={`/tool/${tool.slug}`}
                      onClick={(e) => {
                        if (!e.metaKey && !e.ctrlKey) {
                          e.preventDefault();
                          onSelectTool(tool);
                        }
                      }}
                      className="text-base font-bold text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-1 block"
                    >
                      {tool.title}
                    </a>
                    {tool.searchVolumeBadge && (
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {tool.searchVolumeBadge}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                  {tool.shortDescription}
                </p>

                {/* Popular Presets Quick Tags */}
                {tool.presets && tool.presets.length > 0 && (
                  <div className="mb-5 flex flex-wrap gap-1.5">
                    {tool.presets.slice(0, 2).map((p, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-500 truncate max-w-[200px]"
                      >
                        {p.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action: Open Dedicated Tool with Semantic Anchor Link for Googlebot */}
              <a
                href={`/tool/${tool.slug}`}
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey) {
                    e.preventDefault();
                    onSelectTool(tool);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-900 text-slate-700 hover:text-white font-medium text-xs sm:text-sm border border-slate-200 hover:border-slate-900 transition-all shadow-xs group-hover:shadow-sm"
              >
                <span>Open Tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Global Value Proposition Section */}
      <div className="mt-16 sm:mt-24 p-8 sm:p-10 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="max-w-2xl mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            <Zap className="w-4 h-4 text-slate-700" />
            <span>Built for Precision & Utility</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            Instant Calculations & Distraction-Free Design
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every tool in this directory provides instant mathematical evaluation directly in your browser, complete with clean standalone URLs, presets, and guides.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Dedicated Standalone Pages</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Direct, distraction-free URLs for every single calculator and utility so you can bookmark and calculate instantly.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Real-Time In-Browser Compute</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Formulas update live as you type with instant numerical validation, metrics breakdowns, and reset options.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>1-Click Scenarios & Guides</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pre-configured real-world examples and step-by-step documentation to help you verify results quickly.
            </p>
          </div>
        </div>
      </div>

      {/* Complete Categorized 100 Tools HTML Directory / Sitemap for Googlebot & Users */}
      <section className="mt-16 sm:mt-24 p-8 sm:p-10 rounded-2xl bg-white border border-slate-200 shadow-xs" aria-label="All 100 Tools Directory">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Complete 100 Tools Directory & Sitemap
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Browse all free online calculators and utilities indexed by category with standalone pages.
            </p>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 shrink-0 self-start sm:self-auto">
            100 Online Tools Ready
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.filter(c => c !== 'All').map(cat => {
            const catTools = tools.filter(t => t.category.toLowerCase() === cat.toLowerCase());
            if (catTools.length === 0) return null;
            return (
              <div key={cat} className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>{cat}</span>
                    <span className="text-xs text-slate-400 font-normal">({catTools.length})</span>
                  </h3>
                </div>
                <ul className="space-y-2">
                  {catTools.map(t => (
                    <li key={t.id}>
                      <a
                        href={`/tool/${t.slug}`}
                        onClick={(e) => {
                          if (!e.metaKey && !e.ctrlKey) {
                            e.preventDefault();
                            onSelectTool(t);
                          }
                        }}
                        className="text-xs text-slate-600 hover:text-slate-900 hover:underline flex items-center justify-between gap-2 group transition-colors"
                      >
                        <span className="truncate group-hover:translate-x-0.5 transition-transform">{t.title}</span>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">#{t.number}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
