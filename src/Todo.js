import React from 'react'

export default function Todo({ todo, toogleTodo }) {

    function handleCheck() {
        toogleTodo(todo.id);
        console.log("🚀 ~ ~ todo", todo.id)
    }

    function doNothing() {
        return
    }
    return (
        <div className='p-r mt-4' onClick={handleCheck}>
            <input type="checkbox" className='_checkboxId' checked={todo.complete} onChange={doNothing} />
            <label htmlFor="_checkbox">
                <div id="tick_mark"></div>
            </label>
            <div className="ml-4">{todo.name}</div>
        </div>
    )
}
