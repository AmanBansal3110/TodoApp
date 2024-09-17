import React, { useState, useEffect } from 'react';
import '../css/Todo.css'; // Link to the CSS file
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await fetch('http://localhost:3000/todo', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched todos:', data.todos); // Debug logging
        setTodos(data.todos);
        setName(data.name);
      } catch (e) {
        console.log(e);
      }
    };
    fetchTodo();
  }, [newTodo]);

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      try {
        const response = await fetch('http://localhost:3000/todo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ content: newTodo }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const text = await response.json();
        console.log('Added todo:', text); // Debug logging
        setTodos([...todos, { content: newTodo, completed: false, _id: text._id }]); // Ensure _id is included
        setNewTodo(''); // Clear input field after adding
      } catch (e) {
        alert('Todo Not added');
      }
    }
  };

  const handleToggleComplete = (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  const handleDeleteTodo = async (id) => {
    if (!id) {
      console.error('Cannot delete todo: ID is undefined');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/todo/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Remove the deleted todo from state
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (e) {
      alert('Failed to delete todo');
    }
  };

  const handleLogout = async () => {
    const response = await fetch('http://localhost:3000/logout', {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    alert('Logged out');
    navigate('/signin');
  };

  const prevtodo = () => {
    if (todos.length > 0) {
      return <div><h4>This is your previous tasks!</h4></div>;
    } else {
      return <div><h4>No previous todos present!</h4></div>;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gradient">
      <button
        onClick={handleLogout}
        className="absolute top-5 right-5 bg-pink-600 text-white p-2 rounded-md border border-pink-700 hover:bg-pink-700 transition-colors"
      >
        Logout
      </button>
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-3xl font-bold text-white mb-6">Hey!! {name}</h2>
        <h4 className='font-bold text-white mb-2'>{prevtodo()}</h4>
        <ul className="list-none p-0 mb-6">
          {todos.map((todo, index) => (
            <li
              key={todo._id}
              className="flex items-center bg-gray-800 text-white p-3 mb-2 rounded-md shadow-md"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(index)}
                className="mr-3"
              />
              <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.content || ''}
              </span>
              <button
                onClick={() => handleDeleteTodo(todo._id)}
                className="ml-3 bg-red-600 text-white p-1 rounded-md border border-red-700 hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <div className="flex">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-1 p-3 border border-gray-600 rounded-l-md bg-gray-800 text-white placeholder-gray-400 focus:border-pink-600 focus:ring-1 focus:ring-pink-600 transition-all"
            placeholder="Enter new todo"
          />
          <button
            onClick={handleAddTodo}
            className="bg-pink-600 text-white p-3 rounded-r-md border border-pink-700 hover:bg-pink-700 transition-colors"
          >
            Add Todo
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
