<script lang="ts" setup>
import { ref } from 'vue';
import { Plus } from "@element-plus/icons-vue";
import CreateToDoModal from './Modals/CreateToDoModal.vue';

const filterOptions = [
  { value: 'all', label: 'Все задачи' },
  { value: 'completed', label: 'Завершенные' },
  { value: 'active', label: 'Не завершенные' }
];

const selectedFilter = ref('all');
const createModalVisible = ref(false);

const emits = defineEmits(['filter-change', 'todo-created']);

const handleFilterChange = (value: string) => {
  emits('filter-change', value);
};

const openCreateModal = () => {
  createModalVisible.value = true;
};

const handleTodoCreated = (newTodo) => {
  emits('todo-created', newTodo);
};
</script>

<template>
  <el-header class="header">
    <div class="left-section">
      <el-select
        v-model="selectedFilter"
        class="filter-select"
        @change="handleFilterChange"
      >
        <el-option
          v-for="option in filterOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </div>
    <div class="right-section">
      <el-button type="primary" :icon="Plus" circle @click="openCreateModal" />
    </div>
  </el-header>

  <CreateToDoModal
    v-model:visible="createModalVisible"
    @close="createModalVisible = false"
    @todo-created="handleTodoCreated"
  />
</template>

<style scoped>
.header {
  margin-top: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: auto;
}

.filter-select {
  width: 180px;
}

.left-section, .right-section {
  display: flex;
  align-items: center;
}

.left-section {
  margin-right: 20px;
}
</style>
