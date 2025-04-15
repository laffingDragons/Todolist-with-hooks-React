import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import * as moment from 'moment';
import anime from 'animejs';
import { v4 as uuidv4 } from 'uuid';

const TodoItem = React.memo(
    ({ todo, index, moveTodo, toggleTodo, parentId = null, isSubTask = false, addSubTask, updateTodo, deleteTodo }) => {
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
                if (item.index !== index || item.parentId !== parentId) {
                    moveTodo(item.index, index, item.parentId || parentId);
                    item.index = index;
                    item.parentId = parentId;
                }
            },
        });

        const taskRef = useRef();
        const [isEditing, setIsEditing] = useState(false);
        const [editValue, setEditValue] = useState(todo.name);

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
        };

        const handleEdit = () => {
            if (isEditing && editValue.trim()) {
                updateTodo(todo.id, editValue, isSubTask, parentId);
            }
            setIsEditing(!isEditing);
        };

        return (
            <div
                ref={(node) => {
                    drag(drop(node));
                    taskRef.current = node;
                }}
                className="p-r mt-4"
                style={{ marginLeft: isSubTask ? '20px' : '0px' }}
                onClick={(e) => handleCheck(e)}
            >
                <input
                    type="checkbox"
                    id={`checkbox-${todo.id}`}
                    aria-label={`Mark ${todo.name} as ${todo.complete ? 'incomplete' : 'complete'}`}
                    className={isSubTask ? '_checkboxId-blue' : '_checkboxId'}
                    checked={todo.complete}
                />
                <label htmlFor={`checkbox-${todo.id}`}>
                    <div id="tick_mark"></div>
                </label>
                {isEditing ? (
                    <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleEdit}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEdit();
                        }}
                        className="ml-4 title-todo add-input"
                        autoFocus
                    />
                ) : (
                    <div className="ml-4 title-todo" onDoubleClick={() => setIsEditing(true)}>
                        {todo.name}
                    </div>
                )}
                {isSubTask && (
                    <div className="ml-4 date-todo">
                        {todo.completedOn ? (
                            <div className="sucess">{moment(todo.completedOn).fromNow()}</div>
                        ) : (
                            todo.createdOn && moment(todo.createdOn).fromNow()
                        )}
                    </div>
                )}
                <div
                    className="delete-icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteTodo(todo.id, isSubTask, parentId);
                    }}
                >
                    🗑️
                </div>
                {!isSubTask && (
                    <div
                        className="add-subtask-icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            addSubTask(todo.id);
                        }}
                    >
                        ➕
                    </div>
                )}
            </div>
        );
    }
);

const TodoLists = ({ todos, toggleTodo, moveTodo, setTodos, updateTodo, deleteTodo }) => {
    const [showSubtaskInput, setShowSubtaskInput] = useState(null);
    const [newSubtask, setNewSubtask] = useState('');
    const inputRef = useRef();

    const addSubTask = useCallback((parentId) => {
        setShowSubtaskInput(parentId);
        setTimeout(() => inputRef.current?.focus(), 0);
    }, []);

    const handleAddSubTask = useCallback(
        (parentId) => {
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
                setShowSubtaskInput(null);
            }
        },
        [newSubtask, setTodos]
    );

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
                        updateTodo={updateTodo}
                        deleteTodo={deleteTodo}
                    />
                    <div className="ml-4 date-todo">
                        {todo.completedOn ? (
                            <div className="sucess">{moment(todo.completedOn).fromNow()}</div>
                        ) : (
                            todo.createdOn && moment(todo.createdOn).fromNow()
                        )}
                    </div>
                    {showSubtaskInput === todo.id && (
                        <div className="subtask-input-container">
                            <input
                                ref={inputRef}
                                type="text"
                                value={newSubtask}
                                onChange={(e) => setNewSubtask(e.target.value)}
                                placeholder="Enter subtask"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddSubTask(todo.id);
                                    }
                                    if (e.key === 'Escape') {
                                        setShowSubtaskInput(null);
                                        setNewSubtask('');
                                    }
                                }}
                                className="add-input"
                            />
                            <button className="primary-btn" onClick={() => handleAddSubTask(todo.id)}>
                                Add Subtask
                            </button>
                            <button
                                className="secondary-btn"
                                onClick={() => {
                                    setShowSubtaskInput(null);
                                    setNewSubtask('');
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                    {todo.subTasks && todo.subTasks.length > 0 && (
                        <div>
                            {todo.subTasks.map((subTask, subIndex) => (
                                <TodoItem
                                    key={subTask.id}
                                    todo={subTask}
                                    index={subIndex}
                                    moveTodo={moveTodo}
                                    toggleTodo={toggleTodo}
                                    parentId={todo.id}
                                    isSubTask={true}
                                    updateTodo={updateTodo}
                                    deleteTodo={deleteTodo}
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