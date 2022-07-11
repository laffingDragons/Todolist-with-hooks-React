import React from 'react'
import Todo from "./Todo";

export default function TodoLists({ todos, toogleTodo }) {
    return (
        <>
            {
                todos.map(todo => { return <Todo key={todo.id} toogleTodo={toogleTodo} todo={todo} /> })
            }

        </>
    )
}
