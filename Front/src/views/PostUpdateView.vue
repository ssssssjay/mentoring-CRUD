<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { verifiedGet, verifiedPatch } from "@/utils/customFetch";

import type { BlogDetailResponse, BlogUpdateResponse } from "../types/Responses";
import type { BlogData } from "../types/Blog";

const router = useRouter();
const { id } = useRoute().params;
const auth = useAuthStore();

const isLoading = ref(true);
const isError = ref(false);
const errorMessage = ref("");
const token = auth.token;

const blogData: BlogData = reactive({
  blog_id: undefined,
  blog_title: undefined,
  blog_content: undefined,
  login_id: undefined,
  createdAt: undefined,
});

const getBlogDetail = async (id: string): Promise<void> => {
  try {
    const response = await verifiedGet(`/blog/${id}`, token);
    if (response instanceof Response) {
      const result: BlogDetailResponse = await response.json();
      if (result.state) {
        const { blog_id, blog_title, blog_content, login_id, createdAt } = result.blogData;
        blogData.blog_id = blog_id;
        blogData.blog_title = blog_title;
        blogData.blog_content = blog_content;
        blogData.login_id = login_id;
        blogData.createdAt = createdAt;
      } else {
        isError.value = true;
        errorMessage.value = result.message;
      }
    } else {
      throw new Error(response.message);
    }
  } catch (err) {
    if (err instanceof Error) {
      alert(err.message);
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (typeof id === "string") {
    getBlogDetail(id);
  } else {
    isError.value = true;
    errorMessage.value = "접근할 수 없는 게시물의 유형입니다";
  }
});

const onInputField = (e: Event): void => {
  const target = e.target as HTMLInputElement;
  const id = target.id;
  const targetInputValue = target.value;

  switch (id) {
    case "title":
      blogData.blog_title = targetInputValue;
      break;
    case "content":
      blogData.blog_content = targetInputValue;
      break;
  }
};

const onSubmitUpdateBlog = async (): Promise<void> => {
  try {
    const reqData = { blog_title: blogData.blog_title, blog_content: blogData.blog_content };
    const response = await verifiedPatch(`/blog/${id}`, token, reqData);

    if (response instanceof Response) {
      const result: BlogUpdateResponse = await response.json();
      if (result.state) {
        alert("수정 성공, 상세화면으로 넘어갑니다");
        moveToDetail(result.blog_id);
      } else {
        throw new Error(result.message);
      }
    } else {
      throw new Error(response.message);
    }
  } catch (err) {
    if (err instanceof Error) {
      alert(err.message);
    } else {
      isError.value = true;
      errorMessage.value = "알 수 없는 오류가 발생했습니다";
    }
  }
};

const moveToDetail = (id: string): void => {
  router.push(`/detail/${id}`);
};
</script>

<template>
  <div class="q-pa-md">
    <div v-if="isLoading">
      <q-skeleton type="QSlider" class="q-mb-lg" />
      <q-separator />
      <q-skeleton type="rect" class="q-mt-md" />
    </div>
    <div v-else-if="isError">{{ errorMessage }}</div>
    <div v-else>
      <form class="column" @submit.prevent="onSubmitUpdateBlog">
        <label for="title" class="text-bold text-h6 q-mb-md">제목</label>
        <input
          id="title"
          type="text"
          :value="blogData.blog_title"
          placeholder="제목을 입력하세요"
          class="inp-title q-mb-md"
          @input="onInputField"
        />
        <label for="content" class="text-bold text-h6 q-mb-md">내용</label>
        <textarea
          id="content"
          :value="blogData.blog_content"
          placeholder="글을 작성하세요"
          class="inp-cont"
          @input="onInputField"
        ></textarea>
        <q-btn
          class="btn-login q-mt-lg content-end"
          type="submit"
          color="secondary"
          label="수정"
          :disabled="!blogData.blog_title?.length || !blogData.blog_content?.length"
        />
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.inp-title {
  min-width: 370px;
  transition: 0.3s all;
  border: none;
  outline: none;
  padding-block: 0.4rem;
  border-radius: 6px;
}
.inp-title:focus {
  outline: 1px solid $secondary;
}
.inp-cont {
  min-width: 370px;
  resize: none;
  border: none;
  outline: none;
  transition: 0.3s all;
  padding-block: 0.4rem;
  border-radius: 6px;
  min-height: 180px;
}
.inp-cont:focus {
  border: none;
  outline: none;
  outline: 1px solid $secondary;
}
</style>
