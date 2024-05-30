<template>
    <h1>laisdhf</h1>
     <div class="container" style="padding: 50px 0 100px 0">
    <Account v-if="session" :session="session" />
    <Auth v-else />
  </div>
</template>

<script setup>
import { supabase } from '@/supabase';
import Auth from '../components/Auth.vue'
import { onMounted, ref } from 'vue'
const session = ref()
onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
})
</script>

<style lang="scss" scoped>

</style>