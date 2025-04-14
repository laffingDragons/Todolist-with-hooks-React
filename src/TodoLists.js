import React, { useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import * as moment from 'moment';
import anime from 'animejs';
import { v4 as uuidv4 } from 'uuid';

const TodoItem = ({ todo, index, moveTodo, toggleTodo, parentId = null, isSubTask = false, addSubTask }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'TODO',
        item: { index, parentId },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'TODO',
        hover: (item) => {
            if (item.index !== index) {
                moveTodo(item.index, index, parentId);
                item.index = index;
            }
        },
    });

    const taskRef = useRef();

    useEffect(() => {
        if (!isDragging) {
            anime({
                targets: taskRef.current,
                opacity: [0, 1],
                translateX: [10, 0],
                easing: 'easeOutQuad',
                duration: 300,
            });
        }
    }, [isDragging]);

    const handleCheck = (e) => {
        toggleTodo(todo.id, isSubTask, parentId);
        e.preventDefault();
        console.log(" ??????", todo.id, isSubTask, parentId);
    };


    return (
        <div
            ref={(node) => { drag(drop(node)); taskRef.current = node; }}
            className="p-r mt-4"
            style={{ marginLeft: isSubTask ? '20px' : '0px' }} // Add indentation for subtasks
            onClick={(e) => handleCheck(e)}
        >
            <input
                type="checkbox"
                className={isSubTask ? "_checkboxId-blue" : "_checkboxId"}
                checked={todo.complete}
            />
            <label htmlFor="_checkbox">
                <div id="tick_mark"></div>
            </label>
            <div className="ml-4 title-todo">{todo.name}</div>
            {isSubTask && (
                <div className="ml-4 date-todo">
                    {todo.completedOn ? (
                        <div className="sucess">{moment(todo.completedOn).fromNow()}</div>
                    ) : (
                        todo.createdOn && moment(todo.createdOn).fromNow()
                    )}
                </div>
            )}
            {/* Show "Add subtask" icon */}
            {!isSubTask && (
                <div
                    className="add-subtask-icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        addSubTask(todo.id); // Show input to add subtask
                    }}
                >
                    ➕
                </div>
            )}
        </div>
    );
};

const TodoLists = ({ todos, toggleTodo, moveTodo, setTodos }) => {
    const [showSubtaskInput, setShowSubtaskInput] = useState(null); // To handle visibility of the subtask input

    const [newSubtask, setNewSubtask] = useState(''); // Store subtask input

    const addSubTask = (parentId) => {
        setShowSubtaskInput(parentId);
    };

    const handleAddSubTask = (parentId) => {
        if (newSubtask.trim() !== '') {
            setTodos((prevTodos) => {
                const updatedTodos = [...prevTodos];
                const parentTask = updatedTodos.find((todo) => todo.id === parentId);
                parentTask.subTasks.push({
                    id: uuidv4(),
                    name: newSubtask,
                    complete: false,
                    createdOn: new Date(),
                    completedOn: '',
                    type: 'subTask',
                });
                return updatedTodos;
            });
            setNewSubtask('');
            setShowSubtaskInput(null); // Hide the input after adding
        }
    };

    return (
        <div className="todo-list">
            {todos.map((todo, index) => (
                <div key={todo.id}>
                    <TodoItem
                        todo={todo}
                        index={index}
                        moveTodo={moveTodo}
                        toggleTodo={toggleTodo}
                        addSubTask={addSubTask}
                    />
                    <div className="ml-4 date-todo">{todo.completedOn ? <div className="sucess">{moment(todo.completedOn).fromNow()}</div> : todo.createdOn && moment(todo.createdOn).fromNow()}</div>
                    {/* Display input for subtask if it's the parent task and showSubtaskInput matches the parent task ID */}
                    {showSubtaskInput === todo.id && (
                        <div className="subtask-input-container">
                            <input
                                type="text"
                                value={newSubtask}
                                onChange={(e) => setNewSubtask(e.target.value)}
                                placeholder="Enter subtask"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddSubTask(todo.id);
                                    }
                                }}
                                className='add-input'
                            />
                            <button className='primary-btn' onClick={() => handleAddSubTask(todo.id)}>Add Subtask</button>
                        </div>
                    )}
                    {/* Render subtasks if any */}
                    {todo.subTasks && todo.subTasks.length > 0 && (
                        <div>
                            {todo.subTasks.map((subTask, subIndex) => (
                                <TodoItem
                                    key={subTask.id}
                                    todo={subTask}
                                    index={subIndex}
                                    moveTodo={moveTodo}
                                    toggleTodo={toggleTodo}
                                    parentId={todo.id} // Pass parentId for subtasks
                                    isSubTask={true} // Mark this as a subtask
                                />
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TodoLists;