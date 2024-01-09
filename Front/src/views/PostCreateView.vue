<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { verifiedPost } from "@/utils/customFetch";
import { useAuthStore } from "@/stores/auth";

import { BlogInsertResponse } from "@/types/Responses";

const router = useRouter();
const auth = useAuthStore();

const title = ref("");
const content = ref("");

const onInputField = (e: Event): void => {
  const target = e.target as HTMLInputElement;
  const id = target.id;
  const targetInputValue = target.value;

  switch (id) {
    case "title":
      title.value = targetInputValue;
      break;
    case "content":
      content.value = targetInputValue;
      break;
  }
};

const onSubmitBlog = async (): Promise<void> => {
  try {
    const reqData = { blog_title: title.value, blog_content: content.value };
    const token = auth.getUserData.token; // '' || 'tokenValue'
    const response = await verifiedPost("/blog", token, JSON.stringify(reqData));

    if (response instanceof Response) {
      const result: BlogInsertResponse = await response.json();
      if (result.state) {
        alert("게시 성공, 상세화면으로 넘어갑니다");
        router.push(`/detail/${result.blog_id}`);
      } else {
        throw new Error(result.message);
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      alert(err.message);
    } else {
      alert("어떤 예외사항인지 모르겠어요!");
    }
  }
};
</script>

<template>
  <div class="q-pa-md">
    <form class="column" @submit.prevent="onSubmitBlog">
      <label for="title" class="text-bold text-h6 q-mb-md">제목</label>
      <input
        filled
        type="text"
        :value="title"
        placeholder="제목을 입력하세요"
        class="inp-title q-mb-md"
        id="title"
        @input="onInputField"
      />
      <label for="content" class="text-bold text-h6 q-mb-md">내용</label>
      <textarea
        id="content"
        :value="content"
        placeholder="글을 작성하세요"
        class="inp-cont"
        @input="onInputField"
      ></textarea>
      <q-btn
        class="btn-login q-mt-lg content-end"
        type="submit"
        color="secondary"
        label="게시"
        :disabled="!title.length || !content.length"
      />
    </form>
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
