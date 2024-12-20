import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTodoById } from "../api/todoAPI";

const TodoDetail = () => {
  const { id } = useParams();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const data = await fetchTodoById(id);
        setTodo(data);
      } catch (err) {
        setError("Error fetching todo details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!todo) return <p>Todo not found.</p>;

  return (
    <div>
      <h1>Todo Details</h1>
      <p><strong>Title:</strong> {todo.title}</p>
      <p><strong>Status:</strong> {todo.completed ? "Completed" : "Pending"}</p>
    </div>
  );
};

export default TodoDetail;
