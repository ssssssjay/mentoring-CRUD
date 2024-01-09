<script setup lang="ts">
import { reactive, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { unLoginGet, verifiedDelete } from "@/utils/customFetch";

import type { BlogDetailResponse, BlogDeleteResponse } from "../types/Responses";
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
    const response = await unLoginGet(`/blog/${id}`);
    if (response instanceof Response) {
      const result: BlogDetailResponse = await response.json();
      if (!result.state) throw new Error(result.message);

      const { blog_id, blog_title, blog_content, login_id, createdAt } = result.blogData;
      blogData.blog_id = blog_id;
      blogData.blog_title = blog_title;
      blogData.blog_content = blog_content;
      blogData.login_id = login_id;
      blogData.createdAt = createdAt;
    }
  } catch (err) {
    if (err instanceof Error) {
      isError.value = true;
      errorMessage.value = err.message;
    } else {
      alert("어떤 예외사항인지 모르겠어요!" + err);
    }
  } finally {
    isLoading.value = false;
  }
};

// 스켈레톤 UI 확인을 위한 의도적 지연
onMounted(() => {
  setTimeout(() => {
    if (typeof id === "string") {
      getBlogDetail(id);
    } else {
      isError.value = true;
      errorMessage.value = "접근할 수 없는 게시물의 유형입니다";
    }
  }, 700);
});

const moveToUpdate = (id: string) => {
  router.push(`/update/${id}`);
};

const onSubmitDelete = async (id: string) => {
  const confirmRes = confirm("게시글을 삭제하시겠습니까? 삭제 후 복원은 불가합니다");
  if (!confirmRes) return;

  const response = await verifiedDelete(`/blog/${id}`, token);
  if (response instanceof Response) {
    const result: BlogDeleteResponse = await response.json();
    if (!result.state) alert(result.message);

    if (result.isRenew) auth.setToken(result.accessToken);
    moveToHome();
  } else {
    alert(response.message);
  }
};

const moveToHome = () => {
  router.push(`/`);
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
      <h2 class="text-h4 q-mt-none q-mb-lg">{{ blogData.blog_title }}</h2>
      <q-separator />
      <p class="q-mt-md">{{ blogData.blog_content }}</p>
      <div class="flex justify-end">
        <q-btn
          v-if="auth.loginId === blogData.login_id"
          label="수정"
          color="secondary"
          @click="moveToUpdate(blogData.blog_id + '')"
        />
        <q-btn
          v-if="auth.loginId === blogData.login_id"
          label="삭제"
          color="red"
          class="q-ml-sm"
          @click="onSubmitDelete(blogData.blog_id + '')"
        />
        <q-btn label="홈으로" color="blue-13" class="q-ml-sm" @click="moveToHome" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
