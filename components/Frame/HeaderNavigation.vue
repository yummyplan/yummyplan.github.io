<template>
  <ul class="flex bg-white">
    <li class="w-1/4 text-xl">
      <nuxt-link :to="localePath('/')" class="block text-center border-b-4 border-gray-300 p-3 transition-all duration-200 ease-in-out whitespace-nowrap">
        <font-awesome-icon :icon="['fas', 'calendar']" class="md:mr-2" />
        <span class="hidden md:inline-block">
          {{ $t('header.plan') }}
        </span>
      </nuxt-link>
    </li>
    <li class="w-1/4 text-xl">
      <nuxt-link :to="localePath('/meals')" class="block text-center border-b-4 border-gray-300 p-3 transition-all duration-200 ease-in-out whitespace-nowrap">
        <font-awesome-icon :icon="['fas', 'drumstick-bite']" class="md:mr-2" />
        <span class="hidden md:inline-block">
          {{ $t('header.menus') }}
        </span>
      </nuxt-link>
    </li>
    <li class="w-1/4 text-xl">
      <nuxt-link :to="localePath('/ingredients')" class="block text-center border-b-4 border-gray-300 p-3 transition-all duration-200 ease-in-out whitespace-nowrap">
        <font-awesome-icon :icon="['fas', 'puzzle-piece']" class="md:mr-2" />
        <span class="hidden md:inline-block">
          {{ $t('header.ingredients') }}
        </span>
      </nuxt-link>
    </li>
    <li class="w-1/4 text-xl">
      <nuxt-link :to="localePath('/tags')" class="block text-center border-b-4 border-gray-300 p-3 transition-all duration-200 ease-in-out whitespace-nowrap">
        <font-awesome-icon :icon="['fas', 'tags']" class="md:mr-2" />
        <span class="hidden md:inline-block">
          {{ $t('header.tags') }}
        </span>
      </nuxt-link>
    </li>
  </ul>
</template>

<style scoped>
.nuxt-link-exact-active {
  @apply border-yellow-400;
  /* @apply bg-yellow-100; */
  @apply text-yellow-600;
}
</style>
