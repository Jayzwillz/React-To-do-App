import React from 'react';

const TodoDetails = ({ todo }) => {
  return (
    <div>
      <h2>{todo.title}</h2>
      <p>Status: {todo.completed ? 'Completed' : 'Incomplete'}</p>
    </div>
  );
};

export default TodoDetails;
