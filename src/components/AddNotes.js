import React, { useContext, useState } from 'react'
import noteContext from '../context/notes/noteContext';

const AddNotes = (props) => {
    const context = useContext(noteContext);
    const { addNote } = context

    const [note, setNote] = useState({title:"",description:"",tag:""})
    const handleClick = (e)=>{
        e.preventDefault();
        addNote(note.title,note.description,note.tag)
        setNote({title:"",description:"",tag:""})
        props.showAlert("Added Successfully","success");
    }

    const onChange = (e)=>{
        setNote({...note, [e.target.name]:e.target.value}) // this says the name is equal to the value which user is typing and "..." is called as spread opreter and this used for previously what note value is as it it and next property can overwrite   
    }
    return (
        <div>
            <div className='container my-3'>
                <h2>Add a note</h2>
                <form className='my-3'>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp" value={note.title} required minLength={5} onChange={onChange}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" className="form-control" id="description" name="description" value={note.description} required minLength={5} onChange={onChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label">Tag</label>
                        <input type="text" className="form-control" id="tag" name="tag" value={note.tag} onChange={onChange} />
                    </div>
                    <button disabled={note.title.length<5 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
                </form>
            </div>

        </div>
    )
}

export default AddNotes
