<template>
  <button
    class="bg-yellow-500 hover:bg-yellow-400 border-b-4 border-yellow-600 py-2 px-4 rounded-lg transition-all duration-200 ease-in-out"
    @click="e => $emit('click', e)"
  >
    <slot />
  </button>
</template>
