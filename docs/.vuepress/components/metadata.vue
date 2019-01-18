<template>
  <header class="metadata" v-if="!isHomePage">
    <span class="last-updated">
      Last updated: <time :datatime="prettyDate">{{prettyDate}}</time>
    </span>
    <a
      class="edit-link"
      :href="`https://paper.dropbox.com/doc/${id}`"
      rel="noopener" target="_blank"
    >
      Edit on Dropbox
    </a>
  </header>
</template>

<script>
  export default {
    props: [
      'id',
      'date',
      'isHomePage',
    ],
    computed: {
      prettyDate: ({ date }) => date.split('T')[0],
    },
  }
</script>

<style scoped>
  .metadata {
    display: flex;
    justify-content: space-between;
  }

  .last-updated,
  .edit-link {
    color: #888;
  }

  .last-updated {
    margin-right: 1rem;
  }
</style>
