<template>
  <header class="metadata" v-if="!isHomePage">
    <span v-if="updatedSinceLastVisit" class="last-updated last-updated--message">
      Heads up! This page has been updated since your last visit {{ daysSinceLastVisit }} days ago
    </span>
    <span v-else class="last-updated last-updated--date">
      Last updated: <time :datatime="lastUpdate">{{ lastUpdate }}</time>
    </span>
    <a
      class="edit-link"
      :href="`https://paper.dropbox.com/doc/${id}`"
      rel="noopener" target="_blank">
      Edit on Dropbox
    </a>
  </header>
</template>

<script>
  export default {
    data() {
      return {
        lastUpdate: this.date.split('T')[0],
        lastVisit: '',
        today: '',
        updatedSinceLastVisit: false,
        daysSinceLastVisit: 0,
      }
    },
    props: [
      'id',
      'date',
      'isHomePage',
    ],
    created() {
      this.setCurrentDate()
      this.getVisit()
      this.hasBeenUpdatedSinceLastVisit()
    },
    mounted() {
      this.setVisit()
    },
    methods: {
      setCurrentDate() {
        const date = new Date();
        let dd = date.getDate();
        let mm = date.getMonth() + 1;
        const yyyy = date.getFullYear();

        if (dd < 10) { dd = `0${dd}` }
        if (mm < 10) { mm = `0${mm}` }

        this.today = `${yyyy}-${mm}-${dd}`
      },
      setVisit() {
        localStorage.setItem(`last-visit-${this.id}`, this.today);
      },
      getVisit() {
        const localStorageItem = localStorage.getItem(`last-visit-${this.id}`)

        localStorageItem
          ? this.lastVisit = localStorageItem
          : this.lastVisit = this.today
      },
      hasBeenUpdatedSinceLastVisit() {
        const lastUpdate = new Date(this.lastUpdate)
        const lastVisit = new Date(this.lastVisit)
        const day = 1000 * 60 * 60 * 24

        // Check if last edit is older than last visit.
        lastVisit < lastUpdate
          ? this.updatedSinceLastVisit = true
          : this.updatedSinceLastVisit = false

        this.daysSinceLastVisit = Math.round((lastUpdate - lastVisit) / day)
      },
    }
  }
</script>

<style scoped>
  .metadata {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }

  @media (min-width: 420px) {
    .metadata {
      flex-direction: row;
      align-items: center;
    }
  }

  .last-updated--date,
  .edit-link {
    color: rgba(34, 34, 34, .55); /* Based on VuePress $textColor */
  }

  .last-updated--message {
    color: blue;
    padding: .375rem .5rem;
    background-color: #fffeca; /* bgPastel */
    border-radius: 4px;
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
