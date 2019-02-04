<template>
  <div>
    <iframe
      :src="`https://www.youtube.com/embed${
        type === 'playlist' ? '/videoseries?list=' : '/'
      }${id}`"
      frameborder="0"
      allowfullscreen
    >
    </iframe>
  </div>
</template>

<script>
  export default {
    props: {
      id: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
    },
  }
</script>

<style scoped>
  div {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    max-width: 100%;
  }

  div iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
