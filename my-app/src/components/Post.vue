<script setup>
import { supabase } from '../supabase'
import { onMounted, ref, toRefs } from 'vue'
import router from '@/router'
import { storeToRefs } from 'pinia';
import { useStore } from '@/stores/store.js'

const store = useStore()
const props = defineProps({
    id: Number,
    creator: String,
    caption: String,
    image: String,
    created_at:String, 
    likes:Number,
})

const updating = ref(false)
const loading = ref(false)
const imageEdit = ref('')
const captionEdit = ref(props.caption)

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
  } finally {
  }
}

function getImage() {
      const upload = document.getElementById('imageUpload').files[0]
      const preview = document.getElementById(props.id)
    
      console.log(preview)
      const reader = new FileReader()

      reader.addEventListener(
        'load',
        function () {
          preview.src = reader.result
          imageEdit.value = reader.result
        },
        false
      )
      if (upload) {
        reader.readAsDataURL(upload)
      }
    }

async function editPost() {
  try {
    loading.value = true
  
    let updates = {
      id: props.id,
      image: imageEdit.value,
      caption: captionEdit.value
    }

    if (imageEdit.value == ""){
        updates.image = props.image
    } 

    const { error } = await supabase
    .from('posts').upsert(updates)

    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
    updating.value = false
   getPosts()
  }
}

async function deleteHandler(){
    const confirmation = confirm("Are you sure you want to delete this item?");
    if (confirmation){
        try {
    
    const { data, error, status } = await supabase
        .from('posts')
        .delete()
        .eq('id', props.id)

if (error && status !== 406) throw error

if (data) {
  console.log(data)
}
} catch (error) {
console.log(error.message)
} finally {
getPosts()
}
    }
   
}


</script>

<template>
 
        <form class="post" @submit.prevent="editPost" >
            <h3 >Id: {{ id }}</h3>
  <div>
    <input id="caption" type="text" v-model="captionEdit" v-if="updating" />
    <h3 v-else>{{ caption }}</h3>
  </div>
  <div>
    <h3 >Created {{ created_at }}</h3>
  </div>
  <div>
    <h3 >Likes: {{ likes }}</h3>
  </div>
  <div>
    <input id="imageUpload" type="file" v-if="updating"  accept="image/*" @input="getImage"/>
    <img class="preview" :src="image" :id="id"></img>
  </div>

  <div>

    <input
    v-if="updating"
      type="submit"
      class="button primary block"
      :value="loading ? 'Loading ...' : 'Save'"
      :disabled="loading"
    />
    <button v-else @click="updating = !updating">Edit post</button>
    <button @click="deleteHandler">Delete Post</button>
  </div>


</form>
  
  
</template>

<style>
    .post {
        height: 25vw;
        width: 25vw;
        background-color: rgb(211, 211, 211);
        margin: 1rem;
    }
    .preview {
        height: 5rem;
    }
</style>
