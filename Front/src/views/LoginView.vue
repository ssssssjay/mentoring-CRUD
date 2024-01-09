<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { unLoginPost } from "@/utils/customFetch";

import type { LoginResponse } from "../types/Responses";

const router = useRouter();
const auth = useAuthStore();

const loginId = ref("");
const loginPW = ref("");

const onSubmitLogin = async (): Promise<void> => {
  try {
    const reqData = { id: loginId.value, password: loginPW.value };
    const response = await unLoginPost("/user/login", reqData);

    if (response instanceof Response) {
      const result: LoginResponse = await response.json();
      if (result.state) {
        alert("로그인 성공");
        auth.setLoginId(result.loginId);
        auth.setToken(result.accessToken);
        router.push("/");
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
  <div class="q-pa-md column cont-login">
    <h2 class="text-center text-weight-bold text-h4">로그인</h2>
    <form @submit.prevent="onSubmitLogin">
      <q-input
        class="q-mb-md"
        color="secondary"
        placeholder="아이디를 입력하세요"
        label="아이디"
        type="text"
        id="id"
        v-model="loginId"
      />
      <q-input
        class="q-mb-md"
        color="secondary"
        placeholder="비밀번호를 입력하세요"
        label="비밀번호"
        type="password"
        id="password"
        v-model="loginPW"
      />
      <q-btn
        class="btn-login q-mt-lg"
        color="secondary"
        label="로그인"
        type="submit"
        :disabled="!loginId.length || !loginPW.length"
      />
    </form>
    <div class="text-center q-mt-md text-caption">
      <span>아직 회원이 아니신가요? | </span>
      <router-link to="/signup" class="signup"><span>회원가입하러 가기</span></router-link>
    </div>
  </div>
</template>

<style scoped>
.cont-login {
  width: 50%;
  min-width: 375px;
  margin: 2rem auto;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}
.btn-login {
  width: 100%;
}
.signup {
  text-decoration: none;
  color: #000;
}
</style>
