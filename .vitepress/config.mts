import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Zentra Documentation',
  description: 'Guides, installation, and API docs for Zentra',
  appearance: true, // Enables dark/light mode toggle
  cleanUrls: true,  // Optional: removes .html from URLs

  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Dev Intro', link: '/development/introduction' },
      { text: 'Local Setup', link: '/development/local-setup' },
      { text: 'Plugin Development', link: '/development/plugin-development' },
      { text: 'Plugins', link: '/plugins' },
      { text: 'Installation', link: '/installation' },
      { text: 'Self-Hosting', link: '/self-hosting' },
      { text: 'Usage', link: '/usage' },
      { text: 'API', link: '/api' },
      { text: 'FAQ', link: '/faq' }
    ],

    sidebar: [
      {
        text: 'Start',
        items: [
          { text: 'Home', link: '/' },
          { text: 'Development Introduction', link: '/development/introduction' },
          { text: 'Local Development Setup', link: '/development/local-setup' },
        ]
      },
      {
        text: 'Plugins',
        items: [
          { text: 'Plugin Development Guide', link: '/development/plugin-development' },
          { text: 'Plugin System Overview', link: '/plugins' }
        ]
      },
      {
        text: 'Install & Deploy',
        items: [
          { text: 'Installation', link: '/installation' },
          { text: 'Self-Hosting Guide', link: '/self-hosting' },
          { text: 'Usage Guide', link: '/usage' }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'About', link: '/about' },
          { text: 'API Reference', link: '/api' },
          { text: 'FAQ', link: '/faq' }
        ]
      }
    ]
  }
})
