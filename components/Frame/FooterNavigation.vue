<template>
  <div class="py-4 border-t-4 border-gray-300 flex flex-wrap items-center">
    <nuxt-link :to="localePath('/settings')" class="hover:underline mr-4 order-2 md:order-1 w-full md:w-auto">
      {{ $t('settings.title') }}
    </nuxt-link>

    <nuxt-link :to="localePath('/about')" class="hover:underline mr-4 order-2 md:order-1 w-full md:w-auto">
      {{ $t('about.nav') }}
    </nuxt-link>

    <div class="order-2 md:order-1">
      <select
        class="border-b-2 border-black bg-transparent focus:bg-yellow-200 p-2 outline-none mr-4 flex-1 w-full"
        @input="e => $i18n.setLocale(e.target.value)"
      >
        <option
          v-for="locale in $i18n.locales"
          :key="locale.code"
          :selected="$i18n.locale === locale.code"
          :value="locale.code"
        >
          {{ locale.name }}
        </option>
      </select>
    </div>

    <img src="/logo_textonly.svg" alt="Yummyplan logo" class="logo order-1 md:order-2 w-full md:w-auto md:ml-auto">
  </div>
</template>

<style scoped>
.logo {
  width: 119px;
  height: 32px;
}
</style>
