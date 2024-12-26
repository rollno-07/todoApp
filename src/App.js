import "./App.css";

import React, { useState, useReducer, useMemo, useEffect } from "react";

// Initial state for useReducer
const initialState = JSON.parse(localStorage.getItem("todos")) || [];

function todoReducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, action.payload];
    case "DELETE_TODO":
      return state.filter((todo) => todo.id !== action.payload);
    case "UPDATE_TODO":
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, text: action.payload.text }
          : todo
      );
    default:
      return state;
  }
}

function App() {
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [todos, dispatch] = useReducer(todoReducer, initialState);

  const updateTodo = () => {
    if (input.trim() === "") return;
    dispatch({
      type: "UPDATE_TODO",
      payload: { id: editingId, text: input.trim() },
    });
    setEditingId(null);
    setInput("");
  };

  const addTodo = () => {
    if (input.trim() === "") return;
    dispatch({
      type: "ADD_TODO",
      payload: { id: Date.now(), text: input.trim() },
    });
    setInput("");
  };

  const startEditing = (id) => {
    const todo = todos.find((todo) => todo.id === id);
    setEditingId(id);
    setInput(todo.text);
  };

  const deleteTodo = (id) => {
    dispatch({ type: "DELETE_TODO", payload: id });
  };

  // Persist todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Memoized calculation for Todo count
  const todoCount = useMemo(() => todos.length, [todos]);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Todo List App</h1>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter Your Task...."
          style={{ padding: "10px", width: "75%", marginRight: "10px" }}
        />
        {editingId ? (
          <button onClick={updateTodo} style={{ padding: "10px" }}>
            Upadate
          </button>
        ) : (
          <button onClick={addTodo} style={{ padding: "10px" }}>
            Add
          </button>
        )}
      </div>
      <h3>Total Todos:{todoCount}</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <span style={{ flex: 1 }}>{todo.text}</span>
            <button
              onClick={() => startEditing(todo.id)}
              style={{ marginRight: "10px" }}
            >
              Edit
            </button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
