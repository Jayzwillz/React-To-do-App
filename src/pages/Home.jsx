import React, { useState, useEffect } from 'react';
import TodoList from '../components/TodoList';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import SearchFilter from '../components/SearchFilter';

const LOCAL_STORAGE_KEY = 'todosApp.todos';

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [apiTodos, setApiTodos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [todosPerPage, setTodosPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'completed', 'pending'
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoCompletionDate, setNewTodoCompletionDate] = useState('');
  const [newTodoStatus, setNewTodoStatus] = useState(false);

  // Fetch todos from the API
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        const data = await response.json();
        setApiTodos(data.map((todo) => ({ ...todo, timestamp: null }))); // Add placeholder timestamp
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    fetchTodos();
  }, []);

  // Load todos from localStorage when the component mounts
  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    setTodos(savedTodos);
  }, []);

  // Save todos to localStorage whenever the todos state changes
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos]);

  // Periodically check for overdue todos (every minute)
  useEffect(() => {
    const intervalId = setInterval(() => {
      const updatedTodos = todos.map((todo) => {
        // If the completionDate has passed and the todo is not already completed, mark it as completed
        if (!todo.completed && todo.completionDate && new Date(todo.completionDate) < new Date()) {
          return { ...todo, completed: true };
        }
        return todo;
      });
      setTodos(updatedTodos);
    }, 60000); // Check every minute

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [todos]);

  const resetForm = () => {
    setEditingTodo(null);
    setNewTodoTitle('');
    setNewTodoCompletionDate('');
    setNewTodoStatus(false);
  };

  const handleCreateTodo = () => {
    if (!newTodoTitle.trim()) return;
    const newTodo = {
      id: Date.now(),
      title: newTodoTitle,
      completed: false,
      completionDate: newTodoCompletionDate || null,
      timestamp: Date.now(), // Add creation timestamp
    };
    setTodos([newTodo, ...todos]);
    resetForm();
    setModalOpen(false);
  };

  const handleEditTodo = (updatedTodo) => {
    // Update in local todos
    setTodos(todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)));

    // If the todo exists in apiTodos, update it as well
    setApiTodos(apiTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)));

    resetForm();
    setModalOpen(false);
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    setApiTodos(apiTodos.filter((todo) => todo.id !== id)); // Ensure deletion in API todos too
  };

  const filteredTodos = [...todos, ...apiTodos].filter((todo) => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === 'all'
        ? true
        : filterStatus === 'completed'
        ? todo.completed
        : !todo.completed;
    return matchesSearch && matchesFilter;
  });

  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);

  const totalPages = Math.ceil(filteredTodos.length / todosPerPage);

  return (
    <div>
      <h1>Todos</h1>
      <div className="add-todo-container">
        <button
          className="add-todo-button"
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
        >
          Add Todo
        </button>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <TodoList
        todos={currentTodos}
        onEdit={(todo) => {
          setEditingTodo(todo);
          setNewTodoTitle(todo.title);
          setNewTodoCompletionDate(todo.completionDate || '');
          setNewTodoStatus(todo.completed || false);
          setModalOpen(true);
        }}
        onDelete={handleDeleteTodo}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>{editingTodo ? 'Edit Todo' : 'Add Todo'}</h2>
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Enter todo title"
        />
        {!editingTodo && (
          <input
            type="datetime-local"
            value={newTodoCompletionDate}
            onChange={(e) => setNewTodoCompletionDate(e.target.value)}
          />
        )}
        {editingTodo && (
          <div>
            <label>
              <input
                type="checkbox"
                checked={newTodoStatus}
                onChange={(e) => setNewTodoStatus(e.target.checked)}
              />
              Mark as Completed
            </label>
          </div>
        )}
        <button
          onClick={() =>
            editingTodo
              ? handleEditTodo({
                  ...editingTodo,
                  title: newTodoTitle,
                  completed: newTodoStatus,
                  completionDate: newTodoCompletionDate,
                })
              : handleCreateTodo()
          }
        >
          {editingTodo ? 'Save Changes' : 'Create Todo'}
        </button>
      </Modal>
    </div>
  );
};

export default Home;
