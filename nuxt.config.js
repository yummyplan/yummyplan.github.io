import IgnoreNotFoundExportPlugin from './IgnoreNotFoundExportPlugin'
import de from './translations/de'
import en from './translations/en'

export default {
  target: 'static',
  ssr: false,

  head: {
    title: 'Yummyplan',
    titleTemplate: '%s | Yummyplan',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      {
        'http-equiv': 'Content-Security-Policy',
        content: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; worker-src 'self'"
      },
      { hid: 'og:image', property: 'og:image', content: '/logo_text.png' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  loading: { color: '#fff' },

  css: [
    { src: '@node_modules/@fortawesome/fontawesome', lang: 'css' },
    { src: 'assets/css/fonts.css', lang: 'css' }
  ],

  plugins: [
    { src: '~/plugins/draggable.ts', mode: 'client' }
  ],

  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',

    '@nuxt/typescript-build'
  ],

  modules: [
    '@nuxtjs/pwa',
    [
      'nuxt-fontawesome',
      {
        imports: [
          {
            set: '@fortawesome/free-solid-svg-icons',
            icons: ['fas']
          },
          {
            set: '@fortawesome/free-brands-svg-icons',
            icons: ['fab']
          }
        ]
      }
    ],
    'nuxt-i18n'
  ],

  i18n: {
    locales: [{
      code: 'en',
      name: 'EN'
    }, {
      code: 'de',
      name: 'DE'
    }],
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en',
      messages: {
        de,
        en
      }
    }
  },

  pwa: {
    icon: {
      fileName: 'logo.png',
      purpose: 'any'
    },
    manifest: {
      name: 'Yummyplan',
      short_name: 'Yummyplan',
      description: 'A meal planning app for an entire week',
      background_color: '#ffffff',
      useWebmanifestExtension: false
    },
    meta: {
      name: 'Yummyplan',
      author: 'Pascal Thormeier',
      description: 'A meal planning app for an entire week',
      theme_color: '#faf089',
      lang: 'de'
    }
  },

  build: {
    plugins: [
      new IgnoreNotFoundExportPlugin()
    ]
  },

  pageTransition: {
    name: 'default',
    mode: 'out-in'
  }
}
