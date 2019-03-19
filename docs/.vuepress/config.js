module.exports = {
  title: 'shauvet',
  description: '我的 BLOG',
  head: [
    ['link', { rel: 'shortcut icon', type: "image/x-icon", href: `./favicon.ico` }]
  ],
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'blog', link: '/tools/' },
      { text: 'External', link: 'https://google.com' },
    ],
    sidebar: {
      '/javascript/': [
        '',
        'function',
        'symbols',
      ],
      '/js-frame/': [
        '',
        'angularJS'
      ],
      '/backend/': [
        ''
      ],
      '/tools/': [
        '',
        'dev-server'
      ]
    }
  }
};