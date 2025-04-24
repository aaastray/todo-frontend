<script setup lang="ts">
import { type ToDo } from "@/domain/ToDo.ts";
import { Delete, EditPen, Check, Close } from '@element-plus/icons-vue';
import { computed, ref } from 'vue';
import { useTodoStore } from '@/stores/todoStore';
import { ElMessage } from 'element-plus';

const todoStore = useTodoStore();

const props = defineProps<{
  todo: ToDo;
}>();

const emit = defineEmits(['edit', 'delete']);

const isLoading = ref(false);
const checked = ref(props.todo.completed);
const isEditing = ref(false);
const editedTitle = ref(props.todo.title);

const handleEdit = () => {
  isEditing.value = true;
  editedTitle.value = props.todo.title;
};

const handleDelete = () => {
  emit('delete', props.todo.id);
};

const handleStatusChange = async (value: boolean) => {
  isLoading.value = true;
  try {
    await todoStore.updateTodo(props.todo.id, { completed: value });
    checked.value = value;
    ElMessage.success(`Задача ${value ? 'завершена' : 'возобновлена'}`);
  } catch (error) {
    ElMessage.error('Не удалось обновить статус задачи');
    checked.value = !value;
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const saveEdit = async () => {
  if (!editedTitle.value.trim()) {
    ElMessage.warning('Название задачи не может быть пустым');
    return;
  }

  isLoading.value = true;
  try {
    await todoStore.updateTodo(props.todo.id, { title: editedTitle.value.trim() });
    ElMessage.success('Задача обновлена');
    isEditing.value = false;
  } catch (error) {
    ElMessage.error('Не удалось обновить задачу');
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  editedTitle.value = props.todo.title;
};

const isCompleted = computed(() => checked.value);
</script>

<template>
  <div class="card">
    <el-card style="width: 480px" shadow="hover">
      <div class="todo-card-content">
        <el-checkbox
          v-model="checked"
          @change="handleStatusChange"
          :disabled="isLoading"
        />

        <div v-if="!isEditing" class="todo-title">
          <el-text tag="p" :class="{ 'completed': isCompleted }">{{ todo.title }}</el-text>
        </div>

        <div v-else class="todo-edit-form">
          <el-input
            v-model="editedTitle"
            placeholder="Введите название задачи"
            :disabled="isLoading"
            @keyup.enter="saveEdit"
          />
          <div class="edit-actions">
            <el-icon class="action-icon save-icon" @click="saveEdit" :disabled="isLoading">
              <Check />
            </el-icon>
            <el-icon class="action-icon cancel-icon" @click="cancelEdit" :disabled="isLoading">
              <Close />
            </el-icon>
          </div>
        </div>

        <div v-if="!isEditing" class="todo-actions">
          <el-icon class="action-icon edit-icon" @click="handleEdit">
            <EditPen />
          </el-icon>
          <el-icon class="action-icon delete-icon" @click="handleDelete">
            <Delete />
          </el-icon>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.card {
  margin-bottom: 1rem;
}
.card:last-child {
  margin-bottom: 0;
}

.todo-card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todo-title {
  flex-grow: 1;
  margin-left: 12px;
  margin-right: 12px;
}

.todo-edit-form {
  display: flex;
  flex-grow: 1;
  margin-left: 12px;
  margin-right: 12px;
  align-items: center;
}

.edit-actions {
  display: flex;
  gap: 8px;
  margin-left: 8px;
}

.todo-actions {
  display: flex;
  gap: 16px;
  opacity: 0;
  transition: opacity 0.3s;
}

.card:hover .todo-actions {
  opacity: 1;
}

.completed {
  text-decoration: line-through;
  color: #909399;
}

.action-icon {
  cursor: pointer;
  font-size: 18px;
  transition: transform 0.2s, color 0.2s;
  color: #909399; /* Нейтральный цвет по умолчанию */
}

.action-icon:hover {
  transform: scale(1.2);
}

.edit-icon:hover {
  color: #409EFF;
}

.delete-icon:hover {
  color: #F56C6C;
}

.save-icon:hover {
  color: #67C23A;
}

.cancel-icon:hover {
  color: #F56C6C;
}
</style>
