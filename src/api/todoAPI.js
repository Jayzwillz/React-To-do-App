const API_URL = 'https://jsonplaceholder.typicode.com/todos';

export const fetchTodos = async (page = 1, limit = 10) => {
  const response = await fetch(`${API_URL}?_page=${page}&_limit=${limit}`);
  return response.json();
};

export const fetchTodoById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  return response.json();
};

export const createTodo = async (newTodo) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTodo),
  });
  return response.json();
};

export const updateTodo = async (id, updatedTodo) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedTodo),
  });
  return response.json();
};

export const deleteTodo = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  return response.ok;
};
