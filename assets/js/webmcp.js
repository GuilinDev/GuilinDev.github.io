/**
 * WebMCP Integration for GuilinDev.github.io
 * Exposes structured tools for AI agents to interact with this website.
 * Requires Chrome 146+ Canary with WebMCP flag enabled.
 */

(function () {
  // Guard: only run if WebMCP API is available
  if (!navigator.modelContext) {
    console.log('[WebMCP] navigator.modelContext not available. Enable WebMCP flag in chrome://flags');
    return;
  }

  console.log('[WebMCP] Registering tools for GuilinDev...');

  // ============================================================
  // Tool 1: Search Posts
  // ============================================================
  navigator.modelContext.registerTool({
    name: 'searchPosts',
    description: 'Search blog posts by keyword. Returns matching post titles, URLs, dates, and excerpts. The blog contains 3000+ technical posts covering algorithms, system design, cloud native, AI/ML, and more.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search keyword or phrase to find in post titles and content'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default: 10, max: 50)'
        }
      },
      required: ['query']
    },
    async execute({ query, limit = 10 }) {
      limit = Math.min(limit, 50);
      const q = query.toLowerCase();

      // Collect all post links from the DOM (works on index/blog pages)
      const articles = document.querySelectorAll('article.preview, .post-list li, article');
      const results = [];

      articles.forEach(article => {
        const link = article.querySelector('a[href*="/"]');
        const title = link ? link.textContent.trim() : '';
        const href = link ? link.getAttribute('href') : '';
        const excerpt = article.querySelector('.post-section p, .post-excerpt, p')?.textContent?.trim() || '';
        const time = article.querySelector('.post-time, time')?.textContent?.trim() || '';

        if (title.toLowerCase().includes(q) || excerpt.toLowerCase().includes(q)) {
          results.push({ title, url: href, date: time, excerpt: excerpt.substring(0, 200) });
        }
      });

      // If on a non-blog page, try fetching from sitemap or index
      if (results.length === 0) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              message: `No results found for "${query}" on this page. Try navigating to the blog index first, or use getAbout for author information.`,
              suggestion: window.location.origin + '/'
            })
          }]
        };
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            query,
            count: results.slice(0, limit).length,
            total: results.length,
            results: results.slice(0, limit)
          })
        }]
      };
    }
  });

  // ============================================================
  // Tool 2: Get About / Author Info
  // ============================================================
  navigator.modelContext.registerTool({
    name: 'getAbout',
    description: 'Get author profile information including name, title, work history, education, skills, and contact info for Guilin Zhang.',
    inputSchema: {
      type: 'object',
      properties: {}
    },
    async execute() {
      const about = {
        name: 'Guilin Zhang',
        title: 'Principal AI Researcher',
        location: 'San Mateo, CA, USA',
        email: 'GuilinDev@gmail.com',
        github: 'https://github.com/GuilinDev',
        website: 'https://guilindev.github.io',
        languages: ['Mandarin Chinese (Native)', 'English (Fluent)'],
        skills: [
          'AI & ML (PyTorch, TensorFlow, Scikit-learn)',
          'Reinforcement Learning, NLP (RAG, Agentic Systems)',
          'MLOps, Explainable AI (XAI)',
          'Cloud-Native (Kubernetes, Prometheus, Grafana, Kafka)',
          'Infrastructure (AWS, GCP, Terraform, ArgoCD)',
          'Go, Java/Spring Boot, Python, PostgreSQL',
          'Certifications: CKA/CKAD/CKS'
        ],
        currentRole: {
          company: 'Workday, Inc.',
          title: 'Principal AI Researcher',
          since: '02/2022',
          focus: 'AI research, large scale metrics monitoring and alerting systems, Observability'
        },
        blog: {
          totalPosts: '3000+',
          topics: 'Algorithms, LeetCode, System Design, Cloud Native, AI/ML, Software Engineering'
        }
      };

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(about)
        }]
      };
    }
  });

  // ============================================================
  // Tool 3: Get Post Content (when on a post page)
  // ============================================================
  navigator.modelContext.registerTool({
    name: 'getPostContent',
    description: 'Get the full content of the currently viewed blog post, including title, date, and body text.',
    inputSchema: {
      type: 'object',
      properties: {}
    },
    async execute() {
      const title = document.querySelector('.post-title, h1, h2')?.textContent?.trim() || document.title;
      const date = document.querySelector('.post-time, .post-date, time')?.textContent?.trim() || '';
      const content = document.querySelector('.post-content, .post-body, article, .container')?.textContent?.trim() || '';

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            title,
            date,
            url: window.location.href,
            content: content.substring(0, 5000),
            truncated: content.length > 5000
          })
        }]
      };
    }
  });

  // ============================================================
  // Tool 4: Navigate Site
  // ============================================================
  navigator.modelContext.registerTool({
    name: 'navigateSite',
    description: 'Navigate to a specific page on the GuilinDev website. Available pages: home (blog index), about (profile/resume), menu (all posts).',
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'string',
          enum: ['home', 'about', 'menu'],
          description: 'Page to navigate to'
        }
      },
      required: ['page']
    },
    async execute({ page }) {
      const pages = {
        home: '/',
        about: '/about.html',
        menu: '/menu.html'
      };
      const url = pages[page];
      if (url) {
        window.location.href = url;
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ navigated: true, page, url })
          }]
        };
      }
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ error: 'Unknown page', available: Object.keys(pages) })
        }]
      };
    }
  });

  // ============================================================
  // Tool 5: List Recent Posts
  // ============================================================
  navigator.modelContext.registerTool({
    name: 'listRecentPosts',
    description: 'List the most recent blog posts with titles, dates, and URLs.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of recent posts to return (default: 10, max: 30)'
        }
      }
    },
    async execute({ limit = 10 }) {
      limit = Math.min(limit, 30);
      const articles = document.querySelectorAll('article.preview, .post-list li, article');
      const posts = [];

      articles.forEach(article => {
        const link = article.querySelector('a[href*="/"]');
        if (!link) return;
        const title = link.textContent.trim();
        const href = link.getAttribute('href');
        const time = article.querySelector('.post-time, time')?.textContent?.trim() || '';
        posts.push({ title, url: href, date: time });
      });

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            count: posts.slice(0, limit).length,
            posts: posts.slice(0, limit)
          })
        }]
      };
    }
  });

  console.log('[WebMCP] ✅ 5 tools registered: searchPosts, getAbout, getPostContent, navigateSite, listRecentPosts');
})();
