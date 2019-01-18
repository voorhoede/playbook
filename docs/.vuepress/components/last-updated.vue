<template>
  <div v-if="!isHomePage" class="last-updated">
    <p>Last updated: {{ lastUpdated }}</p>
  </div>
</template>

<script>
export default {
  props: ['lastUpdated', 'isHomePage'],
}
</script>

<style scoped>
.last-updated p {
  font-size: 12px;
}
</style>
