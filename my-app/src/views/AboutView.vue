<template>
  <div class="about">
    <h1>Welcome to Julithane</h1>
    <Account :session="store.session" />
    <div>
      <h2>Your posts</h2>
      <button @click="store.creating = !store.creating" v-if="!store.creating">
        Create new post
      </button>
      <CreatePost :session="store.session" v-if="store.creating" />
      <div class="allPosts">
        <Post
          v-for="post in store.posts.value"
          :key="post.id"
          :id="post.id"
          :creator="post.creator"
          :caption="post.caption"
          :image="post.image"
          :likes="post.likes"
          :created_at="post.created_at"
        />
      </div>
    </div>
  </div>
</template>

<style>
.allPosts {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  width: 100vw;
  justify-content: center;
}
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
}
</style>

<script setup>
import { supabase } from '@/supabase'
import Account from '@/components/Account.vue'
import Post from '@/components/Post.vue'
import CreatePost from '@/components/CreatePost.vue'
import { onMounted, ref } from 'vue'
import { useStore } from '@/stores/store.js'
const store = useStore()
import router from '@/router'

onMounted(() => {
  getPosts()
})

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
</script>
