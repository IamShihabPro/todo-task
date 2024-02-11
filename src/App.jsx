import { useState, useEffect } from 'react';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [priorityInput, setPriorityInput] = useState('low');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState('');
  const [editingPriorityId, setEditingPriorityId] = useState(null);
  const [editingPriorityValue, setEditingPriorityValue] = useState('');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const handleTaskInputChange = (e) => {
    setTaskInput(e.target.value);
  };

  const handlePriorityInputChange = (e) => {
    setPriorityInput(e.target.value);
  };

  const handleAddTask = () => {
    if (taskInput.trim() !== '') {
      const newTask = {
        id: Date.now(),
        text: taskInput,
        priority: priorityInput,
        completed: false,
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
      setTaskInput('');
    }
  };

  const handleEditClick = (taskId, taskText, priority) => {
    setEditingTaskId(taskId);
    setEditingTaskText(taskText);
    setEditingPriorityId(taskId);
    setEditingPriorityValue(priority);
  };

  const handleSaveEdit = () => {
    const updatedTasks = tasks.map((task) =>
      task.id === editingTaskId
        ? { ...task, text: editingTaskText, priority: editingPriorityValue }
        : task
    );
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
    setEditingTaskId(null);
    setEditingTaskText('');
    setEditingPriorityId(null);
    setEditingPriorityValue('');
  };

  const handleToggleTaskStatus = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-3xl mb-4 text-center font-bold text-gray-800">Todo List</h1>
      <div className="flex flex-col md:flex-row justify-center gap-2 items-center mb-4">
        <input
          type="text"
          placeholder="Enter task"
          className="p-2 border border-gray-300 mb-2 md:mb-0 md:mr-2 rounded-md w-full md:w-auto focus:outline-none"
          value={taskInput}
          onChange={handleTaskInputChange}
        />
        <select
          className="p-2 border border-gray-300 mb-2 md:mb-0 md:mr-2 rounded-md w-full md:w-auto focus:outline-none"
          value={priorityInput}
          onChange={handlePriorityInputChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          className="p-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md w-full md:w-auto focus:outline-none"
          onClick={handleAddTask}
        >
          Add Task
        </button>
      </div>
      <ul className=''>
        {tasks?.map((task) => (
          <li
            key={task.id}
            className="bg-gray-100 rounded-md shadow-md p-3 flex flex-col md:flex-row items-center justify-between py-2 border-b border-gray-300 my-3"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTaskStatus(task.id)}
              />
              <span
                className={`ml-2 ${
                  task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                }`}
              >
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    value={editingTaskText}
                    onChange={(e) => setEditingTaskText(e.target.value)}
                    className="border-b border-transparent focus:border-blue-500"
                    onBlur={() => handleSaveEdit()}
                  />
                ) : (
                  task.text
                )}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row items-center gap-2 mt-2 md:mt-0">
              <span className="mr-2">
                Priority:{' '}
                {editingPriorityId === task.id ? (
                  <select
                    value={editingPriorityValue}
                    onChange={(e) => setEditingPriorityValue(e.target.value)}
                    className="border-b border-transparent focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                ) : (
                  task.priority
                )}
              </span>
              <span>Completed: {task.completed ? 'Yes' : 'No'}</span>
              {editingTaskId !== task.id ? (
                <button
                  className="p-2 bg-yellow-500 text-white hover:bg-yellow-600 md:ml-2 rounded-md focus:outline-none"
                  onClick={() => handleEditClick(task.id, task.text, task.priority)}
                >
                  Edit
                </button>
              ) : (
                <button
                  className="p-2 bg-green-500 text-white hover:bg-green-600 md:ml-2 rounded-md focus:outline-none"
                  onClick={handleSaveEdit}
                >
                  Save
                </button>
              )}
              <button
                className="p-2 bg-red-500 text-white hover:bg-red-600 md:ml-2 rounded-md focus:outline-none"
                onClick={() => handleDeleteTask(task.id)}
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

export default App;
