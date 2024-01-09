<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { verifiedGet } from "@/utils/customFetch";

import { BlogData } from "@/types/Blog";
import { BlogListResponse } from "@/types/Responses";

import PostCard from "@/components/PostCard.vue";

const router = useRouter();
const auth = useAuthStore();

const token = auth.token;

const isLoading = ref(true);
const isError = ref(false);
const errorMessage = ref("");

const blogList = ref<BlogData[]>([]);
const blogCount = ref(0);

const current = ref(1);

const getBlogList = async (page = 1): Promise<void> => {
  try {
    const response = await verifiedGet(`/blog?page=${page}`, token);

    if (response instanceof Response) {
      const result: BlogListResponse = await response.json();
      if (!result.state) throw new Error(result.message);

      blogCount.value = result.blogCount;
      blogList.value = [];
      for (const data of result.blogList) {
        blogList.value.push(data);
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      isError.value = true;
      errorMessage.value = err.message;
      alert(err.message);
    } else {
      alert("어떤 예외사항인지 모르겠어요!");
    }
  } finally {
    isLoading.value = false;
  }
};
onMounted(() => {
  setTimeout(() => {
    getBlogList();
  }, 700);
});

const moveToDetail = (id: string) => {
  router.push(`/detail/${id}`);
};

watch(current, (newCurrent) => {
  getBlogList(newCurrent);
});
</script>

<template>
  <div>
    <h1 class="text-h4 text-center q-pa-xl">게시판</h1>
    <div v-if="isLoading" class="row justify-center align-center loading">
      <q-spinner-ios size="32px" color="secondary" />
    </div>
    <div v-else-if="isError">{{ errorMessage }}</div>
    <div v-else-if="blogList.length === 0" class="text-center text-none-post">
      <strong>작성한 게시글이 없습니다 !</strong>
    </div>
    <div v-else>
      <ul class="row q-gutter-md q-mb-lg">
        <PostCard
          v-for="blog in blogList"
          :key="blog.blog_id!"
          :id="blog.blog_id!"
          :title="blog.blog_title!"
          :content="blog.blog_content!"
          :login-id="blog.login_id!"
          @click="moveToDetail(blog.blog_id + '')"
        />
      </ul>
      <div class="q-pa-lg flex flex-center">
        <q-pagination
          v-model="current"
          :max="Math.ceil(blogCount / 8)"
          :max-pages="5"
          :boundary-numbers="false"
          color="secondary"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading {
  padding-block: 56px;
}
.text-none-post {
  font-size: 2rem;
  padding-block: 24px;
  font-weight: 700;
}
</style>
