<template>
  <header class="metadata" v-if="!isHomePage">
    <span v-if="hasBeenUpdatedSinceLastVisit" class="last-updated last-updated--message">
      Heads up! This page has been updated since your last visit {{ daysSinceLastVisit }} days ago
    </span>
    <span v-else class="last-updated last-updated--date">
      Last updated: <time :datatime="lastUpdate">{{ lastUpdate }}</time>
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
    data() {
      return {
        lastVisit: '',
        today: '',
      }
    },
    props: {
      id: {
        type: String,
      },
      date: {
        type: String,
      },
      isHomePage: {
        type: Boolean,
        required: true,
      },
    },
    mounted() {
      this.setCurrentDate();
      this.getVisit();
    },
    beforeDestroy() {
      this.setVisit();
    },
    computed: {
      daysSinceLastVisit() {
        const lastUpdate = new Date(this.lastUpdate);
        const lastVisit = new Date(this.lastVisit);
        const day = 1000 * 60 * 60 * 24;

        return  Math.round((lastUpdate - lastVisit) / day);
      },
      hasBeenUpdatedSinceLastVisit() {
        return new Date(this.lastVisit) < new Date(this.lastUpdate);
      },
      lastUpdate() {
        return this.date.split('T')[0];
      },
    },
    methods: {
      setCurrentDate() {
        const date = new Date();
        let dd = date.getDate();
        let mm = date.getMonth() + 1;
        const yyyy = date.getFullYear();

        if (dd < 10) { dd = `0${dd}`; }
        if (mm < 10) { mm = `0${mm}`; }

        this.today = `${yyyy}-${mm}-${dd}`;
      },
      setVisit() {
        localStorage.setItem(`last-visit-${this.id}`, this.today);
      },
      getVisit() {
        const localStorageItem = localStorage.getItem(`last-visit-${this.id}`);

        localStorageItem
          ? this.lastVisit = localStorageItem
          : this.lastVisit = this.today;
      },
    },
  }
</script>

<style lang="styl" scoped>
  .metadata {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  @media (min-width: 420px) {
    .metadata {
      flex-direction: row;
      align-items: center;
    }
  }

  .last-updated--message {
    padding: .375rem .5rem;
    border-radius: 4px;
    background-color: bgPastel;
    color: blue;
    line-height: 1.2;
  }

  .last-updated {
    margin-bottom: 1rem;
  }

  @media (min-width: 420px) {
    .last-updated {
      margin-right: 1rem;
      margin-bottom: 0;
    }
  }
</style>
