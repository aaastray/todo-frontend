<script lang="ts" setup>
import { ref, computed } from 'vue';
import { type CreateToDo} from "@/domain/ToDo.ts";
import { useTodoStore } from '@/stores/todoStore';

const todoStore = useTodoStore();

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(['close', 'todo-created', 'update:visible']);

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emits('update:visible', value)
});

const title = ref('');
const loading = ref(false);
const errorMessage = ref('');

const handleClose = () => {
  title.value = '';
  errorMessage.value = '';
  emits('close');
};

const createTodo = async () => {
  if (!title.value.trim()) {
    errorMessage.value = 'Название задачи не может быть пустым';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const newTodo: CreateToDo = {
      title: title.value.trim(),
      completed: false
    };

    const result = await todoStore.addTodo(newTodo);

    emits('todo-created', result);
    handleClose();
  } catch (error) {
    errorMessage.value = 'Не удалось создать задачу. Пожалуйста, попробуйте снова.';
    console.error('Ошибка при создании задачи:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="Создание новой задачи"
    width="30%"
    @close="handleClose"
  >
    <el-form>
      <el-form-item label="Название задачи" :error="errorMessage">
        <el-input
          v-model="title"
          placeholder="Введите название задачи"
          autofocus
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">Отмена</el-button>
        <el-button
          type="primary"
          @click="createTodo"
          :loading="loading"
        >
          Создать
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
