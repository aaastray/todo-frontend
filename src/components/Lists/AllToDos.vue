<script setup lang="ts">
import { ref, onMounted, watch, inject, computed } from 'vue';
import { ElMessage } from 'element-plus';
import ToDoCard from '../Cards/ToDoCard.vue';
import { type ToDo } from '@/domain/ToDo.ts';
import { useTodoStore } from '@/stores/todoStore';

const todoStore = useTodoStore();
const initialLoading = ref(true); // Для первоначальной загрузки
const currentFilter = inject('currentFilter', ref('all'));

const filterTitles = {
  all: 'Все задачи',
  completed: 'Завершенные задачи',
  active: 'Активные задачи'
};

const todos = computed(() => {
  if (currentFilter.value === 'all') {
    return todoStore.getTodos();
  } else if (currentFilter.value === 'completed') {
    return todoStore.getCompletedTodos();
  } else {
    return todoStore.getActiveTodos();
  }
});

const loading = computed(() => todoStore.isLoading());

const fetchTodos = async (filter: string) => {
  try {
    if (filter === 'all') {
      await todoStore.fetchAllTodos();
    } else if (filter === 'completed') {
      await todoStore.fetchCompletedTodos();
    } else if (filter === 'active') {
      await todoStore.fetchActiveTodos();
    }
  } catch (error) {
    ElMessage.error('Не удалось загрузить задачи');
    console.error(error);
  } finally {
    initialLoading.value = false;
  }
};

const handleEdit = (todo: ToDo) => {
  console.log('Редактирование задачи:', todo);
};

const handleDelete = async (id: string) => {
  try {
    await todoStore.deleteTodo(id);
    ElMessage.success('Задача успешно удалена');
  } catch (error) {
    ElMessage.error('Не удалось удалить задачу');
    console.error(error);
  }
};

watch(currentFilter, (newFilter) => {
  fetchTodos(newFilter);
});

onMounted(() => {
  fetchTodos(currentFilter.value);
});
</script>

<template>
  <div class="todos-container">
    <h2>{{ filterTitles[currentFilter as keyof typeof filterTitles] }}</h2>

    <el-skeleton :loading="loading" animated :count="3" v-if="loading">
      <template #template>
        <div style="padding: 14px; margin-bottom: 10px;">
          <el-skeleton-item variant="p" style="width: 100%; height: 60px;" />
        </div>
      </template>
    </el-skeleton>

    <div v-else>
      <div v-if="todos.length === 0" class="empty-state">
        <el-empty description="Нет задач" />
      </div>

      <div v-else class="todos-list">
        <transition-group name="todo-list" tag="div">
          <ToDoCard
            v-for="todo in todos"
            :key="todo.id"
            :todo="todo"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </transition-group>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.todos-container {
  padding: 20px;
  width: 100%;

  h2 {
    margin-bottom: 20px;
    font-weight: 600;
  }

  .todos-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
  }

  .empty-state {
    margin: 40px 0;
  }
}

.todo-list-enter-active,
.todo-list-leave-active {
  transition: all 0.3s ease;
}

.todo-list-enter-from,
.todo-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.todo-list-move {
  transition: transform 0.3s ease;
}
</style>
