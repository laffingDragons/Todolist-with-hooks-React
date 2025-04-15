import './App.css';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TodoLists from './TodoLists';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import anime from 'animejs';
import Confetti from 'react-confetti';

function App() {
  const [todos, setTodos] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [deletingTasks, setDeletingTasks] = useState(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const isMobile = () => /Mobi|Android/i.test(navigator.userAgent);

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    if (storedTodos && storedTodos.length > 0) {
      setTodos(storedTodos);
    } else {
      // Initialize with dummy tasks
      const dummyTodos = [
        {
          id: uuidv4(),
          name: 'Plan team meeting',
          category: 'Work',
          complete: false,
          createdOn: new Date(),
          completedOn: '',
          dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
          subTasks: [
            { id: uuidv4(), name: 'Book conference room', complete: true, createdOn: new Date(), completedOn: new Date(), dueDate: null },
            { id: uuidv4(), name: 'Prepare slides', complete: false, createdOn: new Date(), completedOn: '', dueDate: null },
          ],
        },
        {
          id: uuidv4(),
          name: 'Buy groceries',
          category: 'Personal',
          complete: false,
          createdOn: new Date(),
          completedOn: '',
          dueDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0], // Overdue
          subTasks: [],
        },
        {
          id: uuidv4(),
          name: 'Finish hackathon project',
          category: 'Work',
          complete: false,
          createdOn: new Date(),
          completedOn: '',
          dueDate: null,
          subTasks: [
            { id: uuidv4(), name: 'Fix bugs', complete: false, createdOn: new Date(), completedOn: '', dueDate: null },
          ],
        },
        {
          id: uuidv4(),
          name: 'Read a book',
          category: 'Personal',
          complete: true,
          createdOn: new Date(new Date().setDate(new Date().getDate() - 3)),
          completedOn: new Date(),
          dueDate: null,
          subTasks: [],
        },
        {
          id: uuidv4(),
          name: 'Update resume',
          category: 'General',
          complete: false,
          createdOn: new Date(),
          completedOn: '',
          dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
          subTasks: [],
        },
      ];
      setTodos(dummyTodos);
      localStorage.setItem('todos', JSON.stringify(dummyTodos));
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (todos.length) localStorage.setItem('todos', JSON.stringify(todos));
    }, 500);
    return () => clearTimeout(handler);
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme;
  }, [theme]);

  const todoNameRef = useRef();
  const todoCategoryRef = useRef();

  const addTodo = useCallback(() => {
    const name = todoNameRef.current.value;
    const category = todoCategoryRef.current.value;
    if (!name.trim()) {
      toast.error('Task name cannot be empty!');
      return;
    }
    setTodos((prevTodos) => [
      {
        id: uuidv4(),
        name,
        category: category || 'General',
        complete: false,
        createdOn: new Date(),
        completedOn: '',
        dueDate: null,
        subTasks: [],
      },
      ...prevTodos,
    ]);
    toast.success('Task added!');
    todoNameRef.current.value = '';
    todoCategoryRef.current.value = 'General';
  }, []);

  const toggleTodo = useCallback((id, isSubTask = false, parentId = null) => {
    setTodos((prevTodos) => {
      const newTodos = prevTodos.map((todo) => {
        if (isSubTask && todo.id === parentId) {
          const updatedSubTasks = todo.subTasks.map((subTask) => {
            if (subTask.id === id) {
              return {
                ...subTask,
                complete: !subTask.complete,
                completedOn: subTask.complete ? '' : new Date(),
              };
            }
            return subTask;
          });
          return { ...todo, subTasks: updatedSubTasks };
        } else if (!isSubTask && todo.id === id) {
          return {
            ...todo,
            complete: !todo.complete,
            completedOn: todo.complete ? '' : new Date(),
          };
        }
        return todo;
      });
      if (newTodos.every((todo) => todo.complete && todo.subTasks.every((st) => st.complete))) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      return newTodos;
    });
    toast.info('Task updated!');
  }, []);

  const updateTodo = useCallback((id, updates, isSubTask = false, parentId = null) => {
    setTodos((prevTodos) => {
      const newTodos = prevTodos.map((todo) => {
        if (isSubTask && todo.id === parentId) {
          return {
            ...todo,
            subTasks: todo.subTasks.map((subTask) =>
              subTask.id === id ? { ...subTask, ...updates } : subTask
            ),
          };
        } else if (!isSubTask && todo.id === id) {
          return { ...todo, ...updates };
        }
        return todo;
      });
      return newTodos;
    });
    toast.success('Task updated!');
  }, []);

  const deleteTodo = useCallback((id, isSubTask = false, parentId = null) => {
    const sound = new Audio('https://freesound.org/data/previews/423/423241_2289448-lq.mp3');
    sound.volume = 0.3;
    sound.play().catch(() => { });
    setDeletingTasks((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });

    const element = document.querySelector(`[data-task-id="${id}"]`);
    if (element) {
      anime({
        targets: element,
        opacity: 0,
        translateY: -10,
        duration: 300,
        easing: 'easeOutQuad',
        complete: () => {
          setTodos((prevTodos) => {
            let newTodos;
            if (isSubTask && parentId) {
              newTodos = prevTodos.map((todo) =>
                todo.id === parentId
                  ? { ...todo, subTasks: todo.subTasks.filter((subTask) => subTask.id !== id) }
                  : todo
              );
            } else {
              newTodos = prevTodos.filter((todo) => todo.id !== id);
            }
            return newTodos;
          });
          setDeletingTasks((prev) => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          });
          toast.success('Task deleted!');
        },
      });
    } else {
      setTodos((prevTodos) => {
        let newTodos;
        if (isSubTask && parentId) {
          newTodos = prevTodos.map((todo) =>
            todo.id === parentId
              ? { ...todo, subTasks: todo.subTasks.filter((subTask) => subTask.id !== id) }
              : todo
          );
        } else {
          newTodos = prevTodos.filter((todo) => todo.id !== id);
        }
        return newTodos;
      });
      setDeletingTasks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      toast.success('Task deleted!');
    }
  }, []);

  const moveTodo = useCallback((dragId, hoverId, parentId = null) => {
    setTodos((prevTodos) => {
      if (parentId) {
        // Move subtask within parent
        const newTodos = [...prevTodos];
        const parentTodo = newTodos.find((todo) => todo.id === parentId);
        const dragIndex = parentTodo.subTasks.findIndex((st) => st.id === dragId);
        const hoverIndex = parentTodo.subTasks.findIndex((st) => st.id === hoverId);
        const [dragSubTask] = parentTodo.subTasks.splice(dragIndex, 1);
        parentTodo.subTasks.splice(hoverIndex, 0, dragSubTask);
        return newTodos;
      } else {
        // Move main task
        const dragIndex = prevTodos.findIndex((todo) => todo.id === dragId);
        const hoverIndex = prevTodos.findIndex((todo) => todo.id === hoverId);
        const newTodos = [...prevTodos];
        const [dragTodo] = newTodos.splice(dragIndex, 1);
        newTodos.splice(hoverIndex, 0, dragTodo);
        return newTodos;
      }
    });
  }, []);

  const completeTodos = useCallback(() => {
    setTodos((prevTodos) => {
      const remaining = prevTodos.filter((x) => !x.complete);
      if (remaining.length === 0 && prevTodos.length > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      return remaining;
    });
    toast.success('Completed tasks removed!');
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const filteredTodos = todos.filter(
    (todo) => categoryFilter === 'All' || todo.category === categoryFilter
  );

  return (
    <DndProvider backend={isMobile() ? TouchBackend : HTML5Backend}>
      <>
        {showConfetti && <Confetti />}
        <div className="z-100 container">
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <h1 className="primary-text f-huge text-center">TodoMaster</h1>
          <div className="text-center d-block d-sm-none sticky">
            <input
              ref={todoNameRef}
              type="text"
              className="add-input"
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  addTodo();
                }
              }}
              placeholder="Add a new task"
            />
            <select ref={todoCategoryRef} className="add-input category-select">
              <option value="General">General</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
            </select>
            <button onClick={addTodo} className="primary-btn">Add Todo</button>
          </div>

          <div className="category-filter">
            <button
              className={`category-btn ${categoryFilter === 'All' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('All')}
            >
              All
            </button>
            <button
              className={`category-btn ${categoryFilter === 'General' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('General')}
            >
              General
            </button>
            <button
              className={`category-btn ${categoryFilter === 'Work' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('Work')}
            >
              Work
            </button>
            <button
              className={`category-btn ${categoryFilter === 'Personal' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('Personal')}
            >
              Personal
            </button>
          </div>

          <div className="primary-text">{filteredTodos.filter((x) => !x.complete).length} todos left</div>
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet—add one to get started! 🚀</p>
            </div>
          ) : (
            <TodoLists
              todos={filteredTodos.slice().reverse()}
              toggleTodo={toggleTodo}
              moveTodo={moveTodo}
              setTodos={setTodos}
              updateTodo={updateTodo}
              deleteTodo={deleteTodo}
              deletingTasks={deletingTasks}
            />
          )}
          <button onClick={completeTodos} className="mt-4 secondary-btn">
            Remove all checked todos
          </button>
        </div>

        <div className="bg-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="500px">
            <path
              id="shape1"
              fillRule="evenodd"
              fill="rgb(35, 23, 123)"
              d="M-0.011,9.318 L8.682,6.988 L11.011,15.682 L2.318,18.011 L-0.011,9.318 Z"
            ></path>
            <path
              id="shape8"
              fillRule="evenodd"
              fill="rgb(35, 23, 123)"
              d="M607.694,164.319 L612.680,161.693 L615.306,166.680 L610.320,169.305 L607.694,164.319 Z"
            ></path>
            <path
              id="shape alarming-shape"
              fillRule="evenodd"
              fill="rgb(93, 203, 250)"
              d="M667.343,205.646 L679.152,213.179 L671.620,224.988 L659.810,217.456 L667.343,205.646 Z"
            ></path>
            <path
              id="shape10"
              fillRule="evenodd"
              fill="rgb(93, 203, 250)"
              d="M915.839,-0.008 L924.997,5.833 L919.156,14.991 L909.998,9.150 L915.839,-0.008 Z"
            ></path>
            <path
              id="cir6"
              fillRule="evenodd"
              fill="rgb(35, 23, 123)"
              d="M989.000,93.000 C993.418,93.000 997.000,96.582 997.000,101.000 C997.000,105.418 993.418,109.000 989.000,109.000 C984.582,109.000 981.000,105.418 981.000,101.000 C981.000,96.582 984.582,93.000 989.000,93.000 Z"
            ></path>
            <path
              id="cir5"
              fillRule="evenodd"
              fill="rgb(35, 23, 123)"
              d="M1165.000,8.000 C1167.761,8.000 1170.000,10.238 1170.000,13.000 C1170.000,15.761 1167.761,18.000 1165.000,18.000 C1162.239,18.000 1160.000,15.761 1160.000,13.000 C1160.000,10.238 1162.239,8.000 1165.000,8.000 Z"
            ></path>
            <path
              id="cir4"
              fillRule="evenodd"
              fill="rgb(93, 203, 250)"
              d="M1303.500,118.000 C1304.881,118.000 1306.000,119.119 1306.000,120.500 C1306.000,121.880 1304.881,123.000 1303.500,123.000 C1302.119,123.000 1301.000,121.880 1301.000,120.500 C1301.000,119.119 1302.119,118.000 1303.500,118.000 Z"
            ></path>
            <path
              id="cir3"
              fillRule="evenodd"
              fill="rgb(93, 203, 250)"
              d="M61.000,112.000 C62.657,112.000 64.000,113.343 64.000,115.000 C64.000,116.657 62.657,118.000 61.000,118.000 C59.343,118.000 58.000,116.657 58.000,115.000 C58.000,113.343 59.343,112.000 61.000,112.000 Z"
            ></path>
            <path
              id="cir2"
              fillRule="evenodd"
              fill="rgb(74, 92, 246)"
              d="M265.500,-0.000 C271.299,-0.000 276.000,4.701 276.000,10.500 C276.000,16.299 271.299,21.000 265.500,21.000 C259.701,21.000 255.000,16.299 255.000,10.500 C255.000,4.701 259.701,-0.000 265.500,-0.000 Z"
            ></path>
            <path
              id="cir1"
              fillRule="evenodd"
              fill="rgb(35, 23, 123)"
              d="M185.500,131.000 C187.985,131.000 190.000,133.015 190.000,135.500 C190.000,137.985 187.985,140.000 185.500,140.000 C183.015,140.000 181.000,137.985 181.000,135.500 C181.000,133.015 183.015,131.000 185.500,131.000 Z"
            ></path>
          </svg>
        </div>
        <div className="box">
          <div className="wave one"></div>
          <div className="wave two"></div>
          <div className="wave three"></div>
        </div>
        <ToastContainer position="top-right" autoClose={2000} />
      </>
    </DndProvider>
  );
}

export default App;