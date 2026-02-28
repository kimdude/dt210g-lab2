import { useState } from "react"

import "./TodoForm.css"

function TodoForm({todoUpdate} : {todoUpdate: Function}) {

    //Interfaces
    interface FormData {
        name: string,
        descr: string,
        status: string
    }

    interface ErrorsData {
        name?: string,
        descr?: string,
        serverErr?: string
    }

    //State
    const [formData, setFormData] = useState<FormData>({name: "", descr: "", status: "Ej påbörjad"});
    const [errors, setErrors] = useState<ErrorsData>({});

    //Validating inputs
    const validateForm = ((data: FormData) => {
        const validationErrors: ErrorsData = {};

        if(!data.name) {
            validationErrors.name = "Ange ett namn.";
        }

        if(!data.descr) {
            validationErrors.descr = "Ange en beskrivning.";
        }

        if(data.name && data.name.length <= 3) {
            validationErrors.name = "Namnet måste vara längre än 3 tecken.";
        }

        if(data.descr.length > 200) {
            validationErrors.descr = "Beskrivningen måste vara under 200 tecken.";
        }

        return validationErrors;

    });

    //Adding todo to db
    const addTodo = async () =>{
        try {
            const response = await fetch("https://dt201g-lab2-api.onrender.com/todo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if(!response.ok) {
                throw new Error("Ett fel uppstod. Vänligen försök igen senare")
            }

            todoUpdate();
            
        } catch (error) {
            setErrors({...errors, serverErr: "Ett fel uppstod. Prova igen senare."});
        }
    }

    //Submiting form
    const submitForm = ((event: any) => {
        event.preventDefault();

        const validationErrors = validateForm(formData);

        if(Object.keys(validationErrors).length > 0) {
            return setErrors(validationErrors);
        }

        setErrors({});
        addTodo();

    });

  return (
    <form onSubmit={submitForm}>
        {/* Name input*/}
        <label htmlFor="name">Namn: </label><br />
        <input type="text" name="name" id="name" value={formData.name} onChange={(event) => setFormData({...formData, name: event.target.value})} />
        {errors.name && <span className="errors">{errors.name}</span>}
        <br />

        {/* Description input */}
        <label htmlFor="descr">Beskrivning: </label><br />
        <textarea name="descr" id="descr" value={formData.descr} onChange={(event) => setFormData({...formData, descr: event.target.value})}></textarea>
        {errors.descr && <span className="errors">{errors.descr}</span>}
        <br />

        {/* Status input */}
        <label htmlFor="status">Ändra status:</label>
        <select name="status" id="status" value={formData.status} onChange={(event) => setFormData({...formData, status: event.target.value})}>
            <option value="Påbörjad">Påbörjad</option>
            <option value="Avklarad">Avklarad</option>
            <option value="Ej påbörjad">Ej påbörjad</option>
        </select><br />

        <input type="submit" value="Lägg till" /><br />
        {errors.serverErr && <span className="errors">{errors.serverErr}</span>}
    </form>
  )
}

export default TodoForm