<script setup lang="ts">
import HeaderComp from "./components/Header.vue";
</script>

<template>
  <div>
    <q-layout>
      <q-header class="bg-white shadow-2">
        <HeaderComp></HeaderComp>
      </q-header>
      <q-page-container class="cont-app">
        <RouterView></RouterView>
      </q-page-container>
    </q-layout>
  </div>
</template>

<style scoped>
.cont-app {
  max-width: 1024px;
  margin: 0 auto;
}
</style>
