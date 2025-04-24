import { defineStore } from 'pinia';
import { ref } from 'vue';
import { type ToDo, type CreateToDo } from '@/domain/ToDo';
import TodoService from "@/service/ToDoService.ts";

export const useTodoStore = defineStore('todo', () => {
  // Состояния
  const todos = ref<ToDo[]>([]);
  const completedTodos = ref<ToDo[]>([]);
  const activeTodos = ref<ToDo[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Геттеры
  const getTodos = () => todos.value;
  const getCompletedTodos = () => completedTodos.value;
  const getActiveTodos = () => activeTodos.value;
  const isLoading = () => loading.value;
  const getError = () => error.value;

  // Действия
  const fetchAllTodos = async () => {
    loading.value = true;
    error.value = null;
    try {
      const result = await TodoService.getAllTodos();
      if (result instanceof Error) {
        throw result;
      }
      todos.value = result;
    } catch (err) {
      error.value = 'Не удалось загрузить задачи';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const fetchCompletedTodos = async () => {
    loading.value = true;
    error.value = null;
    try {
      const result = await TodoService.getAllCompletedTodos();
      if (result instanceof Error) {
        throw result;
      }
      completedTodos.value = result;
    } catch (err) {
      error.value = 'Не удалось загрузить завершенные задачи';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const fetchActiveTodos = async () => {
    loading.value = true;
    error.value = null;
    try {
      const result = await TodoService.getAllActiveTodos();
      if (result instanceof Error) {
        throw result;
      }
      activeTodos.value = result;
    } catch (err) {
      error.value = 'Не удалось загрузить активные задачи';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const addTodo = async (newTodo: CreateToDo) => {
    loading.value = true;
    error.value = null;
    try {
      const result = await TodoService.createTodo(newTodo);
      if (result instanceof Error) {
        throw result;
      }

      const createdTodo = result as ToDo;
      todos.value.unshift(createdTodo);

      if (!createdTodo.completed) {
        activeTodos.value.unshift(createdTodo);
      } else {
        completedTodos.value.unshift(createdTodo);
      }

      return createdTodo;
    } catch (err) {
      error.value = 'Не удалось создать задачу';
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteTodo = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const result = await TodoService.deleteTodo(id);
      if (result instanceof Error) {
        throw result;
      }
      todos.value = todos.value.filter(todo => todo.id !== id);
      completedTodos.value = completedTodos.value.filter(todo => todo.id !== id);
      activeTodos.value = activeTodos.value.filter(todo => todo.id !== id);
    } catch (err) {
      error.value = 'Не удалось удалить задачу';
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateTodo = async (id: string, updatedData: { title?: string; completed?: boolean }) => {
    loading.value = true;
    error.value = null;
    try {
      const result = await TodoService.updateTodo(id, updatedData);
      if (result instanceof Error) {
        throw result;
      }

      const updatedTodo = result as ToDo;

      const updateInList = (list: ToDo[]) => {
        const index = list.findIndex(todo => todo.id === id);
        if (index !== -1) {
          list[index] = { ...list[index], ...updatedTodo };
        }
      };

      updateInList(todos.value);

      if (updatedData.completed !== undefined) {
        if (updatedData.completed) {
          activeTodos.value = activeTodos.value.filter(todo => todo.id !== id);
          const todoExists = completedTodos.value.some(todo => todo.id === id);
          if (!todoExists) {
            const todo = todos.value.find(t => t.id === id);
            if (todo) completedTodos.value.unshift(todo);
          } else {
            updateInList(completedTodos.value);
          }
        } else {
          completedTodos.value = completedTodos.value.filter(todo => todo.id !== id);
          const todoExists = activeTodos.value.some(todo => todo.id === id);
          if (!todoExists) {
            const todo = todos.value.find(t => t.id === id);
            if (todo) activeTodos.value.unshift(todo);
          } else {
            updateInList(activeTodos.value);
          }
        }
      } else {
        if (updatedTodo.completed) {
          updateInList(completedTodos.value);
        } else {
          updateInList(activeTodos.value);
        }
      }

      return updatedTodo;
    } catch (err) {
      error.value = 'Не удалось обновить задачу';
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    // Состояния
    todos,
    completedTodos,
    activeTodos,
    loading,
    error,

    // Геттеры
    getTodos,
    getCompletedTodos,
    getActiveTodos,
    isLoading,
    getError,

    // Действия
    fetchAllTodos,
    fetchCompletedTodos,
    fetchActiveTodos,
    addTodo,
    deleteTodo,
    updateTodo
  };
});
