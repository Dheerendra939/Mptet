import { ToolDefinition } from '../types';

export function updateMetaTag(attributeName: string, attributeValue: string, content: string) {
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

export function updateCanonicalLink(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export function updateJsonLd(schemaData: object) {
  let script = document.getElementById('seo-schema') as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'seo-schema';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schemaData, null, 2);
}

export function applyToolSEO(tool: ToolDefinition, origin: string) {
  const toolUrl = `${origin}/tool/${tool.slug}`;
  const fullTitle = `${tool.seoTitle} - Mockia`;

  // Title
  document.title = fullTitle;

  // Merge Primary and Long-Tail Keywords
  const allKeywords = Array.from(
    new Set([...tool.seoKeywords, ...(tool.longTailKeywords || [])])
  );

  // Standard Meta
  updateMetaTag('name', 'title', fullTitle);
  updateMetaTag('name', 'description', tool.seoDescription);
  updateMetaTag('name', 'keywords', allKeywords.join(', '));
  updateCanonicalLink(toolUrl);

  // Open Graph
  updateMetaTag('property', 'og:type', 'website');
  updateMetaTag('property', 'og:title', fullTitle);
  updateMetaTag('property', 'og:description', tool.seoDescription);
  updateMetaTag('property', 'og:url', toolUrl);
  updateMetaTag('property', 'og:site_name', 'Mockia');

  // Twitter
  updateMetaTag('property', 'twitter:card', 'summary_large_image');
  updateMetaTag('property', 'twitter:title', fullTitle);
  updateMetaTag('property', 'twitter:description', tool.seoDescription);
  updateMetaTag('property', 'twitter:url', toolUrl);

  // Compile full list of FAQs including any long-tail use case Q&As
  const combinedFaqs = [...tool.faqs];
  if (tool.longTailUseCases) {
    tool.longTailUseCases.forEach(uc => {
      combinedFaqs.push({
        question: uc.query,
        answer: `${uc.title}: ${uc.summary} Use the ${tool.title} above with 1-click presets to generate complete instant calculations and reference solutions.`
      });
    });
  }

  // Rich Schema.org Graph (WebApplication + FAQPage + BreadcrumbList + HowTo)
  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${toolUrl}#software`,
        'name': tool.title,
        'url': toolUrl,
        'applicationCategory': tool.category + 'Application',
        'operatingSystem': 'All',
        'description': tool.seoDescription,
        'keywords': allKeywords.join(', '),
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD',
          'availability': 'https://schema.org/InStock'
        },
        'featureList': (tool.keyFeatures || tool.features || []).join(', ')
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${toolUrl}#breadcrumbs`,
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': origin
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': tool.category,
            'item': `${origin}/?category=${encodeURIComponent(tool.category)}`
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': tool.title,
            'item': toolUrl
          }
        ]
      },
      {
        '@type': 'HowTo',
        '@id': `${toolUrl}#howto`,
        'name': `How to use the ${tool.title}`,
        'description': tool.seoDescription,
        'step': tool.howToSteps.map((step, idx) => ({
          '@type': 'HowToStep',
          'position': idx + 1,
          'name': step.name || step.title || `Step ${idx + 1}`,
          'text': step.text || step.description || ''
        }))
      },
      {
        '@type': 'FAQPage',
        '@id': `${toolUrl}#faq`,
        'mainEntity': combinedFaqs.map(faq => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer
          }
        }))
      }
    ]
  };

  updateJsonLd(schemaGraph);
}

export function resetToDefaultSEO(origin: string, tools?: ToolDefinition[]) {
  const defaultTitle = 'Mockia - 100 Free Online Tools & Calculators';
  const defaultDesc =
    'Mockia: 100 free online tools and calculators for finance, STEM, development, content creation, productivity, career, and health with instant in-browser calculations.';
  const defaultKeywords =
    'online calculators, percentage calculator, scientific equation solver, strong password generator, EMI calculator, break-even calculator, word counter, base64 converter, compound interest calculator, unit converter, calorie macro calculator, json formatter';

  document.title = defaultTitle;
  updateMetaTag('name', 'title', defaultTitle);
  updateMetaTag('name', 'description', defaultDesc);
  updateMetaTag('name', 'keywords', defaultKeywords);
  updateCanonicalLink(origin);

  updateMetaTag('property', 'og:type', 'website');
  updateMetaTag('property', 'og:title', defaultTitle);
  updateMetaTag('property', 'og:description', defaultDesc);
  updateMetaTag('property', 'og:url', origin);
  updateMetaTag('property', 'og:site_name', 'Mockia');

  updateMetaTag('property', 'twitter:card', 'summary_large_image');
  updateMetaTag('property', 'twitter:title', defaultTitle);
  updateMetaTag('property', 'twitter:description', defaultDesc);
  updateMetaTag('property', 'twitter:url', origin);

  const graphItems: any[] = [
    {
      '@type': 'WebSite',
      '@id': `${origin}/#website`,
      'name': 'Mockia',
      'url': origin,
      'description': defaultDesc,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': `${origin}/?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@type': 'WebApplication',
      '@id': `${origin}/#application`,
      'name': 'Mockia Suite',
      'url': origin,
      'applicationCategory': 'UtilitiesApplication',
      'operatingSystem': 'All',
      'description': defaultDesc,
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    }
  ];

  if (tools && tools.length > 0) {
    graphItems.push({
      '@type': 'ItemList',
      '@id': `${origin}/#directory-items`,
      'name': 'Mockia Worldwide Utility Directory',
      'description': 'Directory of 100 online calculators, converters, and reference utilities.',
      'numberOfItems': tools.length,
      'itemListElement': tools.map((tool, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'name': tool.title,
        'url': `${origin}/tool/${tool.slug}`,
        'description': tool.shortDescription
      }))
    });
  }

  const rootSchema = {
    '@context': 'https://schema.org',
    '@graph': graphItems
  };

  updateJsonLd(rootSchema);
}
