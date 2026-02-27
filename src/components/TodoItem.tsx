import type ToDo from '../interfaces/ToDo'
import "./TodoItem.css"

//Article elements
const TodoItem = ({item, todoUpdate}: { item: ToDo, todoUpdate: Function}) => {

  const updateTodo = async (e: any) => {

    const newStatus = e.target.value;
    const newTodo = {
      ...item,
      status: newStatus
    }

    try {
      const res = await fetch("https://dt201g-lab2-api.onrender.com/todo/" + item._id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newTodo)
        }
      )

      if(res.ok) {
        todoUpdate();
      }

    } catch(error) {

    }
  }

  return (
    <article className={item.status === "Avklarad" ? ("done") : item.status === "Påbörjad" ? ("ongoing") : ("todo")}>
        <h3>{item.name}</h3>
        <p>{item.descr}</p>

        <form>
          <label htmlFor="status" id="status">Ändra status:</label>
          <select name="status" id="status" defaultValue={item.status} onChange={updateTodo}>
            <option>Påbörjad</option>
            <option>Avklarad</option>
            <option>Ej påbörjad</option>
          </select>
        </form>
    </article>
  )
}

export default TodoItem