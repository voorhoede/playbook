<template>
  <p v-if="!isHomePage" class="last-updated">
    Last updated: <time :datatime="prettyDate">{{prettyDate}}</time>
  </p>
</template>

<script>
  export default {
    props: ['date', 'isHomePage'],
    computed: {
      prettyDate: ({ date }) => date.split('T')[0],
    },
  }
</script>

<style scoped>
  .last-updated {
    color: #888;
  }
</style>
