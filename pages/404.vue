<template>
  <div>
    <h1 class="text-3xl">
      Oh no, page not found
    </h1>

    <p class="mb-4">
      Apparently something went wrong... If this was a link in the navigation, please open an issue on Github.
    </p>

    <nuxt-link :to="localePath('/')" class="block text-center border-b-4 border-gray-300 p-3 transition-all duration-200 ease-in-out whitespace-nowrap">
      <f-button>
        Go back to home
      </f-button>
    </nuxt-link>
  </div>
</template>
