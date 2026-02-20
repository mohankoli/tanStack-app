import { Injectable, Signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';
const BACKGROUND_REFETCH_INTERVAL = 10000; // 10 seconds

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  
  /**
   * Fetches all todos with automatic background refetching
   */
  getTodos() {
    return injectQuery(() => ({
      queryKey: ['todos'],
      queryFn: async (): Promise<Todo[]> => {
        const response = await fetch(`${API_BASE_URL}/todos`);
        if (!response.ok) {
          throw new Error(`Failed to fetch todos: ${response.statusText}`);
        }
        return response.json();
      },
      refetchInterval: BACKGROUND_REFETCH_INTERVAL,
    }));
  }

  /**
   * Fetches a single todo by ID
   * Used for popover details on hover
   */
  getTodoById(id: number) {
    return injectQuery(() => ({
      queryKey: ['todo', id],
      queryFn: async (): Promise<Todo> => {
        const response = await fetch(`${API_BASE_URL}/todos/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch todo ${id}: ${response.statusText}`);
        }
        return response.json();
      },
      enabled: id > 0, // Only fetch if valid ID
      staleTime: 30000, // Cache for 30 seconds
    }));
  }

  /**
   * Fetches a single todo by ID with dynamic signal support
   * Used for on-demand fetching in Single Todo tab
   */
  getTodoByIdDynamic(id: Signal<number>, enabled: Signal<boolean>) {
    return injectQuery(() => {
      const todoId = id();
      const isEnabled = enabled();
      return {
        queryKey: ['todo-dynamic', todoId],
        queryFn: async (): Promise<Todo> => {
          const response = await fetch(`${API_BASE_URL}/todos/${todoId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch todo ${todoId}: ${response.statusText}`);
          }
          return response.json();
        },
        enabled: isEnabled && todoId > 0 && todoId <= 200,
      };
    });
  }
}
