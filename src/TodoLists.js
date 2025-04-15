import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import * as moment from 'moment';
import animeI18n from 'moment';
import anime from 'animejs';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

const TodoItem = React.memo(
    ({ todo, index, moveTodo, toggleTodo, parentId = null, isSubTask = false, addSubTask, updateTodo, deleteTodo, deletingTasks }) => {
        const [{ isDragging }, drag] = useDrag({
            type: 'TODO',
            item: { id: todo.id, index, parentId },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        });

        const [, drop] = useDrop({
            accept: 'TODO',
            hover: (item) => {
                if (item.id !== todo.id) {
                    moveTodo(item.id, todo.id, item.parentId || parentId);
                }
            },
        });

        const taskRef = useRef();
        const [isEditing, setIsEditing] = useState(false);
        const [editValue, setEditValue] = useState(todo.name);
        const [dueDate, setDueDate] = useState(todo.dueDate || '');

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

        const handleCheck = () => {
            toggleTodo(todo.id, isSubTask, parentId);
        };

        const handleEdit = () => {
            if (isEditing && editValue.trim()) {
                updateTodo(todo.id, { name: editValue, dueDate: dueDate || null }, isSubTask, parentId);
            } else if (isEditing) {
                toast.error('Task name cannot be empty!');
                return;
            }
            setIsEditing(!isEditing);
        };

        const isOverdue = dueDate && !todo.complete && new Date(dueDate) < new Date();

        return (
            <div
                ref={(node) => {
                    drag(drop(node));
                    taskRef.current = node;
                }}
                className={`p-r mt-4 todo-item ${isOverdue ? 'overdue' : ''} ${isDragging ? 'dragging' : ''}`}
                style={{ marginLeft: isSubTask ? '20px' : '0px', display: deletingTasks.has(todo.id) ? 'none' : 'block' }}
                data-task-id={todo.id}
            >
                <input
                    type="checkbox"
                    id={`checkbox-${todo.id}`}
                    aria-label={`Mark ${todo.name} as ${todo.complete ? 'incomplete' : 'complete'}`}
                    className={isSubTask ? '_checkboxId-blue' : '_checkboxId'}
                    checked={todo.complete}
                    onChange={handleCheck}
                />
                <label htmlFor={`checkbox-${todo.id}`}>
                    <div id="tick_mark"></div>
                </label>
                {isEditing ? (
                    <div className="edit-container">
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
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="ml-4 add-input"
                        />
                    </div>
                ) : (
                    <div className="ml-4 title-todo tooltip" onDoubleClick={() => setIsEditing(true)} data-tooltip="Double-click to edit">
                        {todo.name}
                        {dueDate && <span className="due-date"> (Due: {moment(dueDate).format('MMM DD, YYYY')})</span>}
                        <span className="category-tag">{todo.category}</span>
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
                {!isSubTask && todo.subTasks && (
                    <div className="progress-bar">
                        <div
                            className="progress"
                            style={{
                                width: `${todo.subTasks.length ? (todo.subTasks.filter((st) => st.complete).length / todo.subTasks.length) * 100 : 0
                                    }%`,
                            }}
                        ></div>
                    </div>
                )}
                <div
                    className="delete-icon tooltip"
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteTodo(todo.id, isSubTask, parentId);
                    }}
                    role="button"
                    aria-label={`Delete ${todo.name}`}
                    data-tooltip="Delete task"
                >
                    🗑️
                </div>
                {!isSubTask && (
                    <div
                        className="add-subtask-icon tooltip"
                        onClick={(e) => {
                            e.stopPropagation();
                            addSubTask(todo.id);
                        }}
                        role="button"
                        aria-label={`Add subtask to ${todo.name}`}
                        data-tooltip="Add subtask"
                    >
                        ➕
                    </div>
                )}
            </div>
        );
    }
);

const TodoLists = ({ todos, toggleTodo, moveTodo, setTodos, updateTodo, deleteTodo, deletingTasks }) => {
    const [showSubtaskInput, setShowSubtaskInput] = useState(null);
    const [newSubtask, setNewSubtask] = useState('');
    const [subtaskDueDate, setSubtaskDueDate] = useState('');
    const inputRef = useRef();

    const addSubTask = useCallback((parentId) => {
        setShowSubtaskInput(parentId);
        setTimeout(() => inputRef.current?.focus(), 0);
    }, []);

    const handleAddSubTask = useCallback(
        (parentId) => {
            if (newSubtask.trim() === '') {
                toast.error('Subtask name cannot be empty!');
                return;
            }
            setTodos((prevTodos) => {
                const updatedTodos = [...prevTodos];
                const parentTask = updatedTodos.find((todo) => todo.id === parentId);
                parentTask.subTasks.push({
                    id: uuidv4(),
                    name: newSubtask,
                    complete: false,
                    createdOn: new Date(),
                    completedOn: '',
                    dueDate: subtaskDueDate || null,
                    type: 'subTask',
                });
                return updatedTodos;
            });
            toast.success('Subtask added!');
            setNewSubtask('');
            setSubtaskDueDate('');
            setShowSubtaskInput(null);
        },
        [newSubtask, subtaskDueDate, setTodos]
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
                        deletingTasks={deletingTasks}
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
                                        setSubtaskDueDate('');
                                    }
                                }}
                                className="add-input"
                            />
                            <input
                                type="date"
                                value={subtaskDueDate}
                                onChange={(e) => setSubtaskDueDate(e.target.value)}
                                className="add-input"
                            />
                            <button
                                className="primary-btn"
                                onClick={() => handleAddSubTask(todo.id)}
                                aria-label="Add subtask"
                            >
                                Add Subtask
                            </button>
                            <button
                                className="secondary-btn"
                                onClick={() => {
                                    setShowSubtaskInput(null);
                                    setNewSubtask('');
                                    setSubtaskDueDate('');
                                }}
                                aria-label="Cancel"
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
                                    deletingTasks={deletingTasks}
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