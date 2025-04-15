import './App.css';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TodoLists from './TodoLists';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

function App() {
  const [todos, setTodos] = useState([]);

  const isMobile = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    if (storedTodos) setTodos(storedTodos);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (todos.length) localStorage.setItem('todos', JSON.stringify(todos));
    }, 500);
    return () => clearTimeout(handler);
  }, [todos]);

  const todoNameRef = useRef();

  const addTodo = useCallback(() => {
    const name = todoNameRef.current.value;
    if (name) {
      setTodos((prevTodos) => [
        {
          id: uuidv4(),
          name: name,
          complete: false,
          createdOn: new Date(),
          completedOn: '',
          subTasks: [],
        },
        ...prevTodos,
      ]);
      todoNameRef.current.value = '';
    }
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
      return newTodos;
    });
  }, []);

  const updateTodo = useCallback((id, newName, isSubTask = false, parentId = null) => {
    setTodos((prevTodos) => {
      const newTodos = prevTodos.map((todo) => {
        if (isSubTask && todo.id === parentId) {
          return {
            ...todo,
            subTasks: todo.subTasks.map((subTask) =>
              subTask.id === id ? { ...subTask, name: newName } : subTask
            ),
          };
        } else if (!isSubTask && todo.id === id) {
          return { ...todo, name: newName };
        }
        return todo;
      });
      return newTodos;
    });
  }, []);

  const deleteTodo = useCallback((id, isSubTask = false, parentId = null) => {
    setTodos((prevTodos) => {
      if (isSubTask && parentId) {
        return prevTodos.map((todo) =>
          todo.id === parentId
            ? { ...todo, subTasks: todo.subTasks.filter((subTask) => subTask.id !== id) }
            : todo
        );
      }
      return prevTodos.filter((todo) => todo.id !== id);
    });
  }, []);

  const moveTodo = useCallback((dragIndex, hoverIndex, parentId = null) => {
    setTodos((prevTodos) => {
      if (parentId) {
        const newTodos = [...prevTodos];
        const parentTodo = newTodos.find((todo) => todo.id === parentId);
        const dragSubTask = parentTodo.subTasks[dragIndex];
        parentTodo.subTasks.splice(dragIndex, 1);
        parentTodo.subTasks.splice(hoverIndex, 0, dragSubTask);
        return newTodos;
      } else {
        const dragTodo = prevTodos[dragIndex];
        const newTodos = [...prevTodos];
        newTodos.splice(dragIndex, 1);
        newTodos.splice(hoverIndex, 0, dragTodo);
        return newTodos;
      }
    });
  }, []);

  const completeTodos = useCallback(() => {
    setTodos((prevTodos) => prevTodos.filter((x) => !x.complete));
  }, []);

  return (
    <DndProvider backend={isMobile() ? TouchBackend : HTML5Backend}>
      <>
        <div className="z-100 conatiner">
          <h1 className="primary-text f-huge text-center">Todolist</h1>
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
            />
            <button onClick={addTodo} className="primary-btn">
              Add todo
            </button>
            <br />
          </div>

          <div className="primary-text">{todos.filter((x) => !x.complete).length} todos left</div>
          <TodoLists
            todos={todos.slice().reverse()}
            toggleTodo={toggleTodo}
            moveTodo={moveTodo}
            setTodos={setTodos}
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
          />
          <button onClick={completeTodos} className="mt-4 secondary-btn">
            Remove all checked todo
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
              id="shape9"
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
      </>
    </DndProvider>
  );
}

export default App;