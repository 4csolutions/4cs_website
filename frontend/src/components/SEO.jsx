import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://4csolutions.in';
const DEFAULT_TITLE = '4C Solutions | Premium ERPNext Solution Provider';
const DEFAULT_DESCRIPTION = '4C Solutions is a premier B2B ERPNext solution provider specializing in custom ERP implementations for Healthcare, Legal, Logistics, and Project Contracting.';
const DEFAULT_KEYWORDS = '4C Solutions, ERPNext, ERPNext Solution Provider, Healthcare ERP, HMS ERPNext, Legal Case Management, Logistics Dispatch, Project Budgeting ERP, Frappe Framework, Cloud ERP';
const DEFAULT_OG_IMAGE = `${BASE_URL}/logo.png`;

function setMetaTag(selector, attrName, attrValue, content) {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content || '');
}

function setCanonical(href) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
  schema = null,
}) {
  const location = useLocation();

  useEffect(() => {
    // 1. Page Title
    const formattedTitle = title.includes('4C Solutions') ? title : `${title} | 4C Solutions`;
    document.title = formattedTitle;

    // 2. Canonical URL
    const finalCanonical = canonicalUrl || `${BASE_URL}${location.pathname}`;
    setCanonical(finalCanonical);

    // 3. Standard SEO Metas
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    
    const keywordsContent = Array.isArray(keywords) ? keywords.join(', ') : keywords;
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywordsContent);

    // 4. Robots Directives
    setMetaTag('meta[name="robots"]', 'name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // 5. Open Graph Meta Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', formattedTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', finalCanonical);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', '4C Solutions');

    // 6. Twitter Cards
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', formattedTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

    // 7. Structured Data (JSON-LD)
    let schemaScript = document.getElementById('dynamic-route-schema');
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'dynamic-route-schema';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    } else if (schemaScript) {
      schemaScript.remove();
    }

    return () => {
      // Clean up dynamic schema when unmounting if needed
      const dynamicSchema = document.getElementById('dynamic-route-schema');
      if (dynamicSchema) {
        dynamicSchema.remove();
      }
    };
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, noIndex, schema, location.pathname]);

  return null;
}
