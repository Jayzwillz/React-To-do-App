// src/env.d.ts
declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
  }
  

  declare module '../stores/todoStore' {
    export interface Todo {
      id: number;
      title: string;
      datetime?: string;
      completed: boolean;
    }
  
    export function useTodoStore(): {
      todos: Todo[];
      updateTodo: (todo: Todo) => void;
    };
  }