import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import "./ToDo.css";

const ToDo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all"); // new state for filter

  // Fetch all tasks
  useEffect(() => {
    axiosInstance
      .get("/tasks")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // Add a new task
  const addTask = () => {
    if (!newTask.trim()) {
      alert("Task cannot be empty!");
      return;
    }
    axiosInstance
      .post("/tasks", { text: newTask })
      .then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask("");
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  // Update a task (mark as completed)
  const toggleComplete = (id, completed) => {
    axiosInstance
      .put(`/tasks/${id}`, { completed: !completed })
      .then((response) => {
        setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  // Delete a task
  const deleteTask = (id) => {
    axiosInstance
      .delete(`/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id));
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  // Filter tasks based on current filter state
  const getFilteredTasks = () => {
    switch (filter) {
      case "completed":
        return tasks.filter((task) => task.completed);
      case "uncompleted":
        return tasks.filter((task) => !task.completed);
      default:
        return tasks;
    }
  };

  // Get task counts for each category
  const taskCounts = {
    all: tasks.length,
    completed: tasks.filter((task) => task.completed).length,
    uncompleted: tasks.filter((task) => !task.completed).length,
  };

  return (
    <div className="ToDo">
      <h1>Hello Madify </h1>
      <h1>To-Do List for you</h1>

      {/* Filter buttons */}
      <div className="filter-buttons">
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? "active" : ""}
        >
          All ({taskCounts.all})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={filter === "completed" ? "active" : ""}
        >
          Completed ({taskCounts.completed})
        </button>
        <button
          onClick={() => setFilter("uncompleted")}
          className={filter === "uncompleted" ? "active" : ""}
        >
          Uncompleted ({taskCounts.uncompleted})
        </button>
      </div>

      {/* Input for adding new tasks */}
      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
          onKeyPress={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {/* List of filtered tasks */}
      <ul className="big-box">
        {getFilteredTasks().map((task) => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            <label>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id, task.completed)}
              />
              <span className="task-text">{task.text}</span>
            </label>
            <button onClick={() => deleteTask(task.id)} className="delete-btn">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDo;
