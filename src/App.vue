<script setup lang="ts">
import { ref, provide } from 'vue';
import TheHeader from "@/components/TheHeader.vue";
import { useTodoStore } from '@/stores/todoStore';

const todoStore = useTodoStore();
const currentFilter = ref('all');

const handleFilterChange = (filter: string) => {
  currentFilter.value = filter;
};

const handleTodoCreated = () => {
  if (currentFilter.value === 'all') {
  } else if (currentFilter.value === 'active') {
    todoStore.fetchActiveTodos();
  }
};

provide('currentFilter', currentFilter);
</script>

<template>
  <el-container class="container">
    <TheHeader
      @filter-change="handleFilterChange"
      @todo-created="handleTodoCreated"
    />
    <router-view/>
  </el-container>
</template>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
</style>
