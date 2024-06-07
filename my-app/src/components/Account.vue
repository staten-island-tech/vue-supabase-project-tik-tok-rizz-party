<script setup>
import { supabase } from '../supabase'
import { onMounted, ref, toRefs } from 'vue'
import router from '@/router'
import { useStore } from '@/stores/store.js'

const store = useStore()
const props = defineProps(['session'])
const { session } = toRefs(props)

const loading = ref(false)
const username = ref('')
const bio = ref('')
const avatar = ref('')
const updating = ref(false)

onMounted(() => {
 
  getProfile()
 
})

async function getProfile() {
  try {
    loading.value = true
    const { user } = session.value

    const { data, error, status } = await supabase
      .from('users')
      .select(`username, email, bio, avatar`)
      .eq('id', user.id)
      .single()

    if (error && status !== 406) throw error
    console.log(data, user.id)
    if (data) {
      if (data.username == null){
        username.value = user.email
      } else {
        username.value = data.username
      }
     
      bio.value = data.bio
      avatar.value = data.avatar
    }
  } catch (error) {
    console.log(error.message)
  } finally {
    loading.value = false
  }
}

async function updateProfile() {
  try {
    loading.value = true
    const { user } = session.value

    const updates = {
      id: user.id,
      username: username.value,
      bio: bio.value,
      avatar: avatar.value
    }

    const { error } = await supabase.from('users').upsert(updates)

    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
    updating.value = false
  }
}

async function signOut() {
  try {
    loading.value = true
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
    router.push('/')
  }
}
</script>

<template>
  <form class="form-widget" @submit.prevent="updateProfile">
    <div>
      <label for="email">Email</label>
      <h3>{{ session.user.email }}</h3>
    </div>
    <div>
      <label for="username">Name</label>
      <input id="username" type="text" v-model="username" v-if="updating" />
      <h3 v-else>{{ username }}</h3>
    </div>
    <div>
      <label for="bio">Bio</label>
      <input id="bio" type="text" v-model="bio" v-if="updating" />
      <h3 v-else>{{ bio }}</h3>

    </div>
    <div>
      <img id="avatar" :src="avatar"></img>
    </div>

    <div>

      <input
      v-if="updating"
        type="submit"
        class="button primary block"
        :value="loading ? 'Loading ...' : 'Update'"
        :disabled="loading"
      />
      <button v-else @click="updating = !updating">Edit account information</button>
    </div>

    <div>
      <button class="button block" @click="signOut" :disabled="loading">Sign Out</button>
    </div>
  </form>
</template>

<style>

</style>
