import React, { useState, useEffect } from 'react';
import TodoList from '../components/TodoList';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import SearchFilter from '../components/SearchFilter';

const LOCAL_STORAGE_KEY = 'todosApp.todos';

const Home = () => {
  const [todos, setTodos] = useState([]); // State for todos
  const [apiTodos, setApiTodos] = useState([]); // State for API todos
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
        const response = await fetch('https://jsonplaceholder.typicode.com/todos'); // Replace with your actual API endpoint
        const data = await response.json();
        setApiTodos(data);
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

  const resetForm = () => {
    setEditingTodo(null);
    setNewTodoTitle('');
    setNewTodoCompletionDate('');
    setNewTodoStatus(false);
  };

  // Create a new todo
  const handleCreateTodo = () => {
    if (!newTodoTitle.trim()) return; // Prevent empty todos
    const newTodo = {
      id: Date.now(),
      title: newTodoTitle,
      completed: false,
      completionDate: newTodoCompletionDate,
    };
    setTodos([newTodo, ...todos]); // Add the new todo to the list
    resetForm(); // Reset form fields
    setModalOpen(false); // Close modal
  };

  // Edit an existing todo
  const handleEditTodo = (updatedTodo) => {
    setTodos(todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)));
    resetForm(); // Reset form fields
    setModalOpen(false); // Close modal
  };

  // Delete a todo
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Filter todos based on search term and status
  const filteredTodos = [...todos, ...apiTodos] // Combine API and local todos
    .filter((todo) => {
      const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === 'all'
          ? true
          : filterStatus === 'completed'
          ? todo.completed
          : !todo.completed;
      return matchesSearch && matchesFilter;
    });

  // Pagination logic
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);

  // Calculate total pages
  const totalPages = Math.ceil(filteredTodos.length / todosPerPage);

  return (
    <div>
      <h1>Todos</h1>
      <div className="add-todo-container">
        <button
          className="add-todo-button"
          onClick={() => {
            resetForm(); // Reset form for adding a new todo
            setModalOpen(true); // Open modal
          }}
        >
          Add Todo
        </button>
      </div>

      {/* Search and Filter */}
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      {/* Todo List */}
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

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Modal */}
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
            placeholder="Completion Date"
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
          onClick={() => {
            editingTodo
              ? handleEditTodo({
                  ...editingTodo,
                  title: newTodoTitle,
                  completed: newTodoStatus,
                  completionDate: newTodoCompletionDate,
                })
              : handleCreateTodo();
          }}
        >
          {editingTodo ? 'Save Changes' : 'Create Todo'}
        </button>
      </Modal>
    </div>
  );
};

export default Home;
