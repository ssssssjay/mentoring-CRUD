<script setup lang="ts">
defineProps<{
  id: number;
  title: string;
  content: string;
  loginId: string;
}>();
</script>

<template>
  <li class="my-card">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6 ellipsis">{{ title }}</div>
      </q-card-section>
      <q-separator inset />
      <q-card-section class="q-pt-lg q-pb-md ellipsis content">
        {{ content }}
      </q-card-section>
      <q-card-section class="q-pt-none q-pb-md ellipsis content text-right text-caption">
        {{ loginId }}
      </q-card-section>
    </q-card>
  </li>
</template>

<style scoped lang="scss">
.my-card {
  width: calc(25% - 16px);
  max-width: 250px;
  cursor: pointer;
}
</style>
