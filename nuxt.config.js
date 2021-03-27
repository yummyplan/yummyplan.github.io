import IgnoreNotFoundExportPlugin from './IgnoreNotFoundExportPlugin'
import de from './translations/de'
import en from './translations/en'
import es from './translations/es'

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
        content: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' 'unsafe-inline' data:; worker-src 'self'; img-src 'self' data:"
      },
      { hid: 'og:image', property: 'og:image', content: '/logo_text.png' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  loading: { color: '#fff' },

  css: [
    { src: '@node_modules/@fortawesome/fontawesome', lang: 'css' },
    { src: 'assets/css/fonts.css', lang: 'css' },
    { src: 'assets/css/html2canvas.css', lang: 'css' },
    { src: '@node_modules/vue-search-select/dist/VueSearchSelect.css', lang: 'css' },
    { src: 'assets/css/vue-search-select.css', lang: 'css' }
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
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'lang',
      alwaysRedirect: true,
      fallbackLocale: 'en'
    },
    locales: [{
      code: 'en',
      name: 'EN'
    }, {
      code: 'de',
      name: 'DE'
    }, {
      code: 'es',
      name: 'ES'
    }],
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en',
      messages: {
        de,
        en,
        es
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
    extractCSS: true,
    plugins: [
      new IgnoreNotFoundExportPlugin()
    ]
  },

  pageTransition: {
    name: 'default',
    mode: 'out-in'
  },

  generate: {
    routes: ['404', '/de', '/es']
  }
}
