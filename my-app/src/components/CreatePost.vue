<script setup>
import { supabase } from '../supabase'
import { onMounted, ref, toRefs } from 'vue'

const props = defineProps(['session'])
const { session } = toRefs(props)
import { useStore } from '@/stores/store.js'
const store = useStore()
const caption = ref('')
const image = ref('')
const loading = ref(false)

function getImage() {
  const upload = document.getElementById('imageUpload').files[0]
  const preview = document.getElementById('preview')
  const reader = new FileReader()

  reader.addEventListener(
    'load',
    function () {
      preview.src = reader.result
      image.value = reader.result
    },
    false
  )
  if (upload) {
    reader.readAsDataURL(upload)
  }
}
async function getPosts() {
  try {
    const { data, error, status } = await supabase
      .from('posts')
      .select(`created_at, likes, image, caption, creator, id`)
      .eq('creator', store.session.user.id)

    if (error && status !== 406) throw error

    if (data) {
      data.sort((a, b) => b.id - a.id)

      store.posts.value = data
    }
  } catch (error) {
    console.log(error.message)
  }
}

async function CreatePost() {
  try {
    loading.value = true
    const { user } = session.value

    const { data, error, status } = await supabase.from('posts').insert([
      {
        created_at: new Date(),
        creator: user.id,
        likes: 0,
        image: image.value,
        caption: caption.value
      }
    ])

    if (error && status !== 406) throw error

    if (data) {
      store.posts.push = data
      console.log(data)
    }
  } catch (error) {
    console.log(error.message)
  } finally {
    loading.value = false
    store.creating = false
    getPosts()
  }
}
</script>

<template>
  <form class="form-widget" @submit.prevent="CreatePost">
    <div>
      <label for="caption">Caption</label>
      <input id="caption" type="text" v-model="caption" />
    </div>

    <div>
      <label for="imageUpload">Image</label>
      <input type="file" id="imageUpload" accept="image/*" @input="getImage" />
      <img src="" id="preview" alt="Image Preview" />
    </div>

    <div>
      <input
        type="submit"
        class="button primary block"
        :value="loading ? 'Loading ...' : 'Create'"
        :disabled="loading"
      />
    </div>
  </form>
</template>

<style></style>
