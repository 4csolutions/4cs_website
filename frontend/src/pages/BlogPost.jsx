import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Clock, Tag } from 'lucide-react';

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blogs/slug/${slug}`)
      .then(res => res.json())
      .then(data => {
        setBlog(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching blog details:', err);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (blog) {
      // 1. Update document title for SEO/AEO
      const originalTitle = document.title;
      document.title = `${blog.title} | 4C Solutions Case Study`;

      // 2. Manage meta keywords
      let metaKeywordsEl = document.querySelector('meta[name="keywords"]');
      let originalKeywords = '';
      if (metaKeywordsEl) {
        originalKeywords = metaKeywordsEl.getAttribute('content') || '';
      }
      
      const keywordsStr = Array.isArray(blog.metaKeywords) && blog.metaKeywords.length > 0
        ? blog.metaKeywords.join(', ')
        : (typeof blog.metaKeywords === 'string' ? blog.metaKeywords : '');
        
      const finalKeywords = keywordsStr 
        ? `${keywordsStr}, ERPNext, 4C Solutions, ERPNext Case Study`
        : '4C Solutions, ERPNext, ERPNext Case Study, Cloud ERP Solutions';

      if (metaKeywordsEl) {
        metaKeywordsEl.setAttribute('content', finalKeywords);
      } else {
        metaKeywordsEl = document.createElement('meta');
        metaKeywordsEl.setAttribute('name', 'keywords');
        metaKeywordsEl.setAttribute('content', finalKeywords);
        document.head.appendChild(metaKeywordsEl);
      }

      // 3. Manage meta description
      let metaDescEl = document.querySelector('meta[name="description"]');
      let originalDesc = '';
      if (metaDescEl) {
        originalDesc = metaDescEl.getAttribute('content') || '';
      }
      const descStr = blog.summary || 'Premium ERPNext Case Study by 4C Solutions';
      
      if (metaDescEl) {
        metaDescEl.setAttribute('content', descStr);
      } else {
        metaDescEl = document.createElement('meta');
        metaDescEl.setAttribute('name', 'description');
        metaDescEl.setAttribute('content', descStr);
        document.head.appendChild(metaDescEl);
      }

      // 4. Manage Open Graph (og:title, og:description)
      const ogTitleEl = document.querySelector('meta[property="og:title"]');
      let originalOgTitle = '';
      if (ogTitleEl) {
        originalOgTitle = ogTitleEl.getAttribute('content') || '';
        ogTitleEl.setAttribute('content', `${blog.title} | 4C Solutions`);
      }

      const ogDescEl = document.querySelector('meta[property="og:description"]');
      let originalOgDesc = '';
      if (ogDescEl) {
        originalOgDesc = ogDescEl.getAttribute('content') || '';
        ogDescEl.setAttribute('content', descStr);
      }

      // Cleanup function to restore original tags when unmounting
      return () => {
        document.title = originalTitle;
        if (metaKeywordsEl) {
          if (originalKeywords) {
            metaKeywordsEl.setAttribute('content', originalKeywords);
          } else {
            metaKeywordsEl.remove();
          }
        }
        if (metaDescEl) {
          if (originalDesc) {
            metaDescEl.setAttribute('content', originalDesc);
          } else {
            metaDescEl.remove();
          }
        }
        if (ogTitleEl && originalOgTitle) {
          ogTitleEl.setAttribute('content', originalOgTitle);
        }
        if (ogDescEl && originalOgDesc) {
          ogDescEl.setAttribute('content', originalOgDesc);
        }
      };
    }
  }, [blog]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Highly performant, custom-made lightweight Markdown parser
  const renderMarkdown = (markdownText) => {
    if (!markdownText) return '';
    
    const lines = markdownText.split('\n');
    let inList = false;
    let listItems = [];

    const renderedBlocks = lines.map((line, idx) => {
      let trimmed = line.trim();

      // Handle Bullet lists
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        inList = true;
        const itemContent = trimmed.substring(2);
        return { type: 'li', content: parseInlineMarkdown(itemContent), key: idx };
      }

      // If we were in a list but current line is not a list item, we close the list
      if (inList && !trimmed.startsWith('- ') && !trimmed.startsWith('* ')) {
        inList = false;
      }

      // Headers
      if (trimmed.startsWith('### ')) {
        return { type: 'h3', content: parseInlineMarkdown(trimmed.substring(4)), key: idx };
      }
      if (trimmed.startsWith('## ')) {
        return { type: 'h2', content: parseInlineMarkdown(trimmed.substring(3)), key: idx };
      }
      if (trimmed.startsWith('# ')) {
        return { type: 'h1', content: parseInlineMarkdown(trimmed.substring(2)), key: idx };
      }

      // Horizontal Rules
      if (trimmed === '---') {
        return { type: 'hr', key: idx };
      }

      // Empty Lines
      if (trimmed === '') {
        return { type: 'br', key: idx };
      }

      // Normal Paragraphs
      return { type: 'p', content: parseInlineMarkdown(trimmed), key: idx };
    });

    // Let's group list items (li) together into standard ul elements
    const finalElements = [];
    let currentList = [];

    renderedBlocks.forEach((block, index) => {
      if (block.type === 'li') {
        currentList.push(<li key={block.key} dangerouslySetInnerHTML={{ __html: block.content }} />);
      } else {
        if (currentList.length > 0) {
          finalElements.push(<ul key={`list-${index}`} style={{ paddingLeft: '24px', marginBottom: '20px', listStyleType: 'disc' }}>{currentList}</ul>);
          currentList = [];
        }
        
        if (block.type === 'h1') finalElements.push(<h1 key={block.key} style={{ fontSize: '36px', marginTop: '36px', marginBottom: '16px', color: 'var(--text-main)' }} dangerouslySetInnerHTML={{ __html: block.content }} />);
        else if (block.type === 'h2') finalElements.push(<h2 key={block.key} style={{ fontSize: '28px', marginTop: '32px', marginBottom: '16px', color: 'var(--text-main)', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }} dangerouslySetInnerHTML={{ __html: block.content }} />);
        else if (block.type === 'h3') finalElements.push(<h3 key={block.key} style={{ fontSize: '22px', marginTop: '24px', marginBottom: '12px', color: 'var(--text-main)' }} dangerouslySetInnerHTML={{ __html: block.content }} />);
        else if (block.type === 'hr') finalElements.push(<hr key={block.key} style={{ border: 0, borderTop: '1px solid var(--border)', margin: '32px 0' }} />);
        else if (block.type === 'br') finalElements.push(<div key={block.key} style={{ height: '12px' }} />);
        else if (block.type === 'p') finalElements.push(<p key={block.key} style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '20px', textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: block.content }} />);
      }
    });

    // Close any final dangling lists
    if (currentList.length > 0) {
      finalElements.push(<ul key="final-list" style={{ paddingLeft: '24px', marginBottom: '20px', listStyleType: 'disc' }}>{currentList}</ul>);
    }

    return finalElements;
  };

  // Translate bold text, italics, and links
  const parseInlineMarkdown = (text) => {
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Bold text (**text**)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italics (*text*)
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Links [text](url)
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: var(--primary); text-decoration: underline;" target="_blank" rel="noopener noreferrer">$1</a>');

    return html;
  };

  return (
    <div className="blogpost-container" style={{ padding: '120px 0 80px 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Back navigation */}
        <Link to="/case-studies" className="btn btn-secondary flex align-center gap-1" style={{ width: 'fit-content', padding: '8px 16px', marginBottom: '32px' }}>
          <ArrowLeft size={16} /> Back to Case Studies
        </Link>

        {loading ? (
          <div className="text-center" style={{ padding: '64px 0' }}>
            <span className="spinner"></span>
            <p style={{ color: 'var(--text-muted)', marginTop: '12px' }}>Loading case study content...</p>
          </div>
        ) : !blog ? (
          <div className="text-center" style={{ padding: '64px 0', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ color: 'var(--text-muted)' }}>Case study could not be loaded.</p>
          </div>
        ) : (
          <article className="blog-post-wrapper" style={{ textAlign: 'left' }}>
            
            {/* Header info */}
            <header className="post-header" style={{ marginBottom: '40px' }}>
              {blog.sector && (
                <span className="flex align-center gap-1" style={{ fontSize: '12px', fontWeight: 600, backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '12px', width: 'fit-content', textTransform: 'uppercase', marginBottom: '16px' }}>
                  <Tag size={12} /> {blog.sector.name} Solution
                </span>
              )}
              <h1 style={{ fontSize: '40px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '20px', lineHeight: 1.25 }}>
                {blog.title}
              </h1>
              
              <div className="flex align-center gap-6" style={{ fontSize: '14px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
                <span className="flex align-center gap-1"><Calendar size={16} /> {formatDate(blog.datePublished)}</span>
                <span className="flex align-center gap-1"><User size={16} /> By {blog.author}</span>
              </div>
            </header>

            {/* Markdown rendered body */}
            <div className="post-content-body">
              {renderMarkdown(blog.content)}
            </div>

          </article>
        )}

      </div>
    </div>
  );
}
