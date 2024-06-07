import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('useStore', {
  state: () => ({
    session: ref(null),
    creating: ref(false),
    posts: ref([])
  }),

  actions: {}
})
