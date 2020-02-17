/*
 * @Date: 2019-05-13 17:07:56
 * @LastEditors: guangling
 * @LastEditTime : 2020-02-05 13:23:33
 */
module.exports = {
  title: 'shauvet',
  description: '我的 BLOG',
  head: [
    ['link', { rel: 'shortcut icon', type: "image/x-icon", href: `./favicon.ico` }]
  ],
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '博客', link: '/life/' },
      { text: 'BING', link: 'https://cn.bing.com' },
    ],
    sidebar: {
      '/life': [
        ''
      ],
      '/javascript/': [
        '',
        'function',
        'symbols',
        'asyncInForeach',
      ],
      '/react/': [
        '',
        'hocInHooks',
        'fetchDataWithReduxAndHooks',
        'reselect',
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