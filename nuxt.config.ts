import { Meta, Title } from "./.nuxt/components";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  app: {
    head: {
        title: 'Coversy',
      link: [{
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
      },
    //   { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }

]    }
  }
})
