import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTodoById } from "../api/todoAPI";
import Modal from "../components/Modal";
import './TodoDetail.css'; // Import the CSS file for styling

const LOCAL_STORAGE_KEY = "todosApp.todos";

const TodoDetail = () => {
  const { id } = useParams();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedCompletionDate, setEditedCompletionDate] = useState("");
  const [editedStatus, setEditedStatus] = useState(false); // Track completed status in modal
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchTodo = async () => {
      setLoading(true);
      try {
        const savedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        const localTodo = savedTodos.find((todo) => todo.id.toString() === id);

        if (localTodo) {
          setTodo(localTodo);
          setComments(localTodo.comments || []);
          setEditedStatus(localTodo.completed); // Initialize the completion status
        } else {
          const data = await fetchTodoById(id);
          setTodo(data);
          setComments(data.comments || []);
        }
      } catch (err) {
        setError("Error fetching todo details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [id]);

  useEffect(() => {
    // Check if the todo deadline has passed and mark as completed
    const checkDeadline = () => {
      if (todo && todo.completionDate) {
        const deadline = new Date(todo.completionDate);
        const now = new Date();

        if (now >= deadline && !todo.completed) {
          const updatedTodo = { ...todo, completed: true };
          setTodo(updatedTodo);

          const savedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
          const updatedTodos = savedTodos.map((t) => (t.id === todo.id ? updatedTodo : t));
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));
        }
      }
    };

    checkDeadline();
    const timer = setInterval(checkDeadline, 60000); // Check every minute
    return () => clearInterval(timer); // Clean up interval on unmount
  }, [todo]);

  const handleEditToggle = () => {
    setEditModalOpen((prev) => !prev);
    if (todo) {
      setEditedTitle(todo.title);
      setEditedCompletionDate(todo.completionDate || "");
      setEditedStatus(todo.completed); // Set status for modal edit
    }
  };

  const handleSaveEdit = () => {
    if (!todo) return;

    const updatedTodo = {
      ...todo,
      title: editedTitle,
      completionDate: editedCompletionDate,
      completed: editedStatus, // Save the new completion status
    };
    setTodo(updatedTodo);

    const savedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    const updatedTodos = savedTodos.map((t) => (t.id === todo.id ? updatedTodo : t));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));

    setEditModalOpen(false);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = { id: Date.now(), text: newComment };
    const updatedComments = [...comments, comment];

    setComments(updatedComments);
    setNewComment("");

    const updatedTodo = { ...todo, comments: updatedComments };
    setTodo(updatedTodo);

    const savedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    const updatedTodos = savedTodos.map((t) => (t.id === todo.id ? updatedTodo : t));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));
  };

  const handleDeleteComment = (commentId) => {
    const updatedComments = comments.filter((comment) => comment.id !== commentId);

    setComments(updatedComments);

    const updatedTodo = { ...todo, comments: updatedComments };
    setTodo(updatedTodo);

    const savedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    const updatedTodos = savedTodos.map((t) => (t.id === todo.id ? updatedTodo : t));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));
  };

  const calculateTimeRemaining = () => {
    if (!todo || !todo.completionDate) return null;

    const deadline = new Date(todo.completionDate);
    const now = new Date();
    const difference = deadline - now;

    if (difference < 0) {
      return "Deadline has passed!";
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);

    return `${days}d ${hours}h ${minutes}m remaining`;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!todo) return <p>Todo not found.</p>;

  const timeRemaining = calculateTimeRemaining();

  return (
    <div className="todo-detail-container">
      <h1>Todo Details</h1>
      <div className="todo-detail-content">
        <div className="todo-detail-header">
          <h2>{todo.title}</h2>
          <span
            className={`status-badge ${todo.completed ? 'completed' : 'pending'}`}
          >
            {todo.completed ? "Completed" : "Pending"}
          </span>
        </div>
        {todo.completionDate ? (
          <p><strong>Completion Date:</strong> {new Date(todo.completionDate).toLocaleString()}</p>
        ) : (
          <p><strong>Completion Date:</strong> Not Available</p>
        )}
        {timeRemaining && <p><strong>Time Remaining:</strong> {timeRemaining}</p>}
        <button onClick={handleEditToggle}>Edit Todo</button>
        
        <div className="comments-section">
          <h3>Comments</h3>
          <ul>
            {comments.map((comment) => (
              <li key={comment.id} className="comment-item">
                {comment.text}
                <button onClick={() => handleDeleteComment(comment.id)} className="delete-comment-btn">Delete</button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            className="comment-input"
          />
          <button onClick={handleAddComment} className="add-comment-btn">Add Comment</button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={editModalOpen} onClose={handleEditToggle}>
        <h2>Edit Todo</h2>
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          placeholder="Edit title"
          className="edit-input"
        />
        <input
          type="datetime-local"
          value={editedCompletionDate}
          onChange={(e) => setEditedCompletionDate(e.target.value)}
          placeholder="Edit completion date"
          className="edit-input"
        />
        <div>
          <label>
            <input
              type="checkbox"
              checked={editedStatus}
              onChange={(e) => setEditedStatus(e.target.checked)} // Update status when checkbox is toggled
            />
            Mark as Completed
          </label>
        </div>
        <button onClick={handleSaveEdit} className="save-btn">Save Changes</button>
        <button onClick={handleEditToggle} className="cancel-btn">Cancel</button>
      </Modal>
    </div>
  );
};

export default TodoDetail;
