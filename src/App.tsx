import { useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { PuffLoader } from 'react-spinners'

import Header from './components/header'
import type ToDo from './interfaces/ToDo'
import TodoItem from './components/TodoItem'
import TodoForm from './components/TodoForm'

import './App.css'

//Setting spinner
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red"
};

function App() {

  //States
  const [todos, setTodos] = useState<ToDo[]>([]) //State for todo-list
  const [error, setError] = useState<string | null>(null) //State for error handling
  const [loading, setLoading] = useState<boolean>(false) //State for loading list

  //Triggeering function onload
  useEffect(() => {
    getTodos();
  }, []);

  //Getting todo list
  const getTodos = async () => {
    try {
      setLoading(true);
      setError(null);
 
      const response = await fetch("https://dt201g-lab2-api.onrender.com/todo");

      if(response.ok) {
        const data = await response.json();

        data.sort((a: ToDo, b: ToDo) => b.status.localeCompare(a.status));
        setTodos(data);
      }

    } catch(error) {
      setError("Ett fel uppstod. Försök igen senare.");

    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    {/* Header */}
    <Header />

    <main>
      
      {/* Form to add todo-items */}
      <section id="formSection">
        <div>
          <h2>Lägg till i listan</h2>
          <TodoForm todoUpdate={getTodos}/>
        </div>
      </section>

      {/* Todo-list */}
      <section>
        <h2>Att göra</h2>

        {/* Setting errors */}
        { error && <p>{error}</p> }

        {/* Setting loading-icon */}
        { loading && <PuffLoader cssOverride={override} />}

        {/* Getting article for every todo */}
        { todos.map((item) => 
          <TodoItem key={item._id} item={item} todoUpdate={getTodos}/>
        ) }
      </section>
    </main>
    </>
  )
}

export default App
