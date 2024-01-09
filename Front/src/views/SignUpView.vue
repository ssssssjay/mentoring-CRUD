<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { unLoginPost } from "@/utils/customFetch";

import type { CommonResponse } from "../types/Responses";

const router = useRouter();

const signUpId = ref("");
const signUpPW = ref("");
const signUpCheckPW = ref("");

const onSubmitSignUp = async (): Promise<void> => {
  try {
    const reqData = { id: signUpId.value, password: signUpPW.value };
    const response = await unLoginPost("/user/signup", reqData);
    if (response instanceof Response) {
      const result: CommonResponse = await response.json();
      if (result.state) {
        alert("로그인 창으로 이동합니다");
        router.push("/login");
      } else {
        throw new Error(result.message);
      }
    } else {
      throw new Error(response.message);
    }
  } catch (err) {
    if (err instanceof Error) {
      alert(err.message);
    }
  }
};
</script>

<template>
  <div class="q-pa-md column cont-signup">
    <h2 class="text-center text-weight-bold text-h4">회원가입</h2>
    <form @submit.prevent="onSubmitSignUp">
      <q-input
        class="q-mb-md"
        color="secondary"
        placeholder="아이디를 입력하세요"
        label="아이디"
        type="text"
        id="id"
        v-model="signUpId"
      />
      <q-input
        class="q-mb-md"
        color="secondary"
        placeholder="비밀번호를 입력하세요"
        label="비밀번호"
        type="password"
        id="password"
        v-model="signUpPW"
      />
      <q-input
        class="q-mb-md"
        color="secondary"
        placeholder="동일한 비밀번호를 입력하세요"
        label="비밀번호확인"
        type="password"
        id="passwordCheck"
        v-model="signUpCheckPW"
      />
      <span v-if="signUpPW !== signUpCheckPW" class="txt-warn">비밀번호가 일치하지 않습니다</span>
      <q-btn
        class="btn-signup q-mt-lg"
        color="secondary"
        label="회원가입"
        type="submit"
        :disabled="!signUpId.length || !signUpPW.length || !signUpCheckPW.length || signUpPW !== signUpCheckPW"
      />
    </form>
  </div>
</template>

<style scoped lang="scss">
.cont-signup {
  width: 50%;
  min-width: 375px;
  margin: 2rem auto;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}
.btn-signup {
  width: 100%;
}
.txt-warn {
  color: $red-7;
}
</style>
