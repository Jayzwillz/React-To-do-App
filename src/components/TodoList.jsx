import React from "react";
import { Link } from "react-router-dom";

const TodoList = ({ todos, onEdit, onDelete }) => {
  return (
    <div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id}>
            {/* Wrap the todo title with a Link */}
            <Link to={`/todos/${todo.id}`}>{todo.title}</Link>
            <div>
              <button
                className="edit-button"
                style={{ marginRight: "10px" }}
                onClick={() => onEdit(todo)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => onDelete(todo.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
