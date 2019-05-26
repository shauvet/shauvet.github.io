module.exports = {
  title: 'shauvet',
  description: '我的 BLOG',
  head: [
    ['link', { rel: 'shortcut icon', type: "image/x-icon", href: `./favicon.ico` }]
  ],
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '博客', link: '/tools/' },
      { text: '外链', link: 'https://google.com' },
    ],
    sidebar: {
      '/javascript/': [
        '',
        'function',
        'symbols',
      ],
      '/react/': [
        '',
      ],
      '/angular/': [
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