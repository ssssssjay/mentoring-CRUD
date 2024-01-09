<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { verifiedPost } from "@/utils/customFetch";

import type { CommonResponse } from "../types/Responses";

const auth = useAuthStore();

const onClickLogout = async () => {
  try {
    const checkLogout = confirm("로그아웃 하시겠습니까?");
    if (checkLogout) {
      const response = await verifiedPost("/user/logout", auth.token, JSON.stringify({ id: auth.loginId }));
      if (response instanceof Response) {
        const result: CommonResponse = await response.json();
        if (result.state) {
          alert("로그아웃 되었습니다");
        } else {
          throw new Error(result.message);
        }
      }
      auth.deleteLoginId();
      auth.deleteToken();
    }
  } catch (err) {
    if (err instanceof Error) {
      alert(err.message);
    } else {
      alert(err);
    }
  }
};
</script>
<template>
  <div class="cont-header">
    <nav class="cont-header row justify-between">
      <router-link to="/" class="text-black btn-home">
        <span>Home</span>
      </router-link>
      <section class="header-right">
        <router-link v-if="!auth.getUserData.loginId.length" to="/login">
          <q-btn label="로그인" :outline="true" class="text-black" />
        </router-link>
        <q-btn v-else label="로그아웃" :outline="true" class="text-black" @click="onClickLogout" />
        <router-link to="/create">
          <q-btn
            :disable="!auth.getUserData.loginId.length"
            label="글쓰기"
            class="q-ml-sm"
            :outline="true"
            color="secondary"
          />
        </router-link>
      </section>
    </nav>
  </div>
</template>

<style scoped>
.cont-header {
  padding-block: 0.3rem;
}
.cont-header nav {
  max-width: 1024px;
  margin: 0 auto;
}
.btn-home {
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 700;
}
</style>
