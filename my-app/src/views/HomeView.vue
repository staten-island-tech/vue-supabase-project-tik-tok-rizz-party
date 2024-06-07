<template>
  <h1></h1>
  <div class="container" style="padding: 50px 0 100px 0">
    <Auth />
    <p>
      Already have an account?
      <router-link to="/login">Log In</router-link>
    </p>
  </div>
</template>

<script setup>
import { supabase } from '@/supabase'
import Auth from '../components/Auth.vue'
import { onMounted, ref } from 'vue'
import { useStore } from '@/stores/store.js'

const store = useStore()

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    store.session = data.session
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    store.session = _session
  })
})
</script>

<style lang="scss" scoped></style>
