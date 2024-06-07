<template>

    <div>
        <p> 
            <h1> Welcome back beotch!</h1>
        </p>
        <form class="row flex-center flex" @submit.prevent="handleLogin">
    <div class="col-6 form-widget">
     
      <div>
        <input class="inputField" 
        required type="email" 
        placeholder="Your email" 
        v-model="email" />
      </div>
      <div>
        <input
          class="inputField"
          required type="password"
          placeholder="Your password"
          v-model="password"
        />
      </div>
      <div>
        <input
          type="submit"
          class="button block"
          :value="loading ? 'Loading' : 'Log In'"
          :disabled="loading"
        />
      </div>
    </div>
  </form>
    </div>
</template>

<script setup>
import { supabase } from '@/supabase';
import router from '@/router';
import {useStore} from '@/stores/store.js'
const store = useStore()

import { onMounted, ref } from 'vue'

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    store.session = data.session
 
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    store.session = _session
    console.log(store.session)
  })
})


const loading = ref(false)
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })
    
    if (error) throw error
   
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  } finally {
    loading.value = false
    console.log('logged in')
    router.push({ path: '/about'})
  } 
}
</script>

<style lang="scss" scoped>

</style>