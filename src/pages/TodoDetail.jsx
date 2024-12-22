import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTodoById } from "../api/todoAPI";

const LOCAL_STORAGE_KEY = "todosApp.todos";

const TodoDetail = () => {
  const { id } = useParams();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodo = async () => {
      setLoading(true);
      try {
        // Check local storage first
        const savedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        const localTodo = savedTodos.find((todo) => todo.id.toString() === id);

        if (localTodo) {
          setTodo(localTodo);
        } else {
          // If not found locally, fetch from API
          const data = await fetchTodoById(id);
          setTodo(data);
        }
      } catch (err) {
        setError("Error fetching todo details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [id]);

  const toggleCompletionStatus = () => {
    if (!todo) return;

    // Update locally and sync to local storage
    const updatedTodo = { ...todo, completed: !todo.completed };
    setTodo(updatedTodo);

    const savedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    const updatedTodos = savedTodos.map((t) => (t.id === todo.id ? updatedTodo : t));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!todo) return <p>Todo not found.</p>;

  return (
    <div>
      <h1>Todo Details</h1>
      <p><strong>Title:</strong> {todo.title}</p>
      <p><strong>Status:</strong> {todo.completed ? "Completed" : "Pending"}</p>
      <button onClick={toggleCompletionStatus}>
        {todo.completed ? "Mark as Pending" : "Mark as Completed"}
      </button>
    </div>
  );
};

export default TodoDetail;
