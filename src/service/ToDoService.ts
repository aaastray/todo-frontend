import axios from 'axios';

import { type ToDo, type CreateToDo, type UpdateToDo } from '../domain/ToDo.ts';

const PORT = 3000;
const HOST = "localhost"

const BASE_URL = "http://" + HOST + ":" + PORT + "/todo";

const TodoService = {
  async getAllTodos(limit = 100, offset = 0): Promise<ToDo[] | Error> {
    try {
      const response = await axios.get(`${BASE_URL}/all`, {
        params: {
          limit,
          offset
        }
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении todos: ', error);
      throw new Error("Failed to fetch todos.");
    }
  },

  async getAllCompletedTodos(): Promise<ToDo[] | Error> {
    try {
      const response = await axios.get(`${BASE_URL}/completed`)
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении completed todos: ', error);
      throw new Error("Failed to fetch completed todos.");
    }
  },

  async getAllActiveTodos(): Promise<ToDo[] | Error> {
    try {
      const response = await axios.get(`${BASE_URL}/active`)
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении active todos: ', error);
      throw new Error("Failed to fetch active todos.");
    }
  },

  async createTodo(todo: CreateToDo): Promise<ToDo | Error> {
    try {
      const response = await axios.post(`${BASE_URL}/create`, todo);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании todo: ', error);
      throw new Error("Failed to create todo.");
    }
  },

  async updateTodo(todo_id: string, todo: UpdateToDo): Promise<ToDo | Error> {
    try {
      const currentTodoResponse = await axios.get(`${BASE_URL}/${todo_id}`);
      const currentTodo = currentTodoResponse.data;

      const updateData = {
        title: todo.title !== undefined ? todo.title : currentTodo.title,
        completed: todo.completed !== undefined ? todo.completed : currentTodo.completed
      };

      const response = await axios.put(`${BASE_URL}/update/${todo_id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении todo: ', error);
      throw new Error("Failed to update todo.");
    }
  },

  async deleteTodo(todo_id: string): Promise<ToDo | Error> {
    try {
      const response = await axios.delete(`${BASE_URL}/delete/${todo_id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при удалении todo: ', error);
      throw new Error("Failed to delete todo.");
    }
  }
}

export default TodoService
