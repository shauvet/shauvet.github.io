/*
 * @Date: 2019-05-13 17:07:56
 * @LastEditors: guangling
 * @LastEditTime: 2020-06-06 23:04:56
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
        'buildHighlyCustomizableComponent',
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