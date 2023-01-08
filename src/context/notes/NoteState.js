import NoteContext from './noteContext'
import { useState } from 'react';

const NoteState = (props) => {
    const host = "http://localhost:5000"
    //     const s1 = {
    //         "name":"Siddharth",
    //         "class":"A1"
    //     }

    //     const [state, setState] = useState(s1);
    // const update = ()=>{
    //     setTimeout(() => {
    //         setState({
    //             "name":"Aman",
    //             "class":"A3"
    //         })
    //     }, 1000);
    // }

    // const notesInital = [
    //     {
    //         "_id": "63a742913616dw24981a44930",
    //         "user": "63a43c707fca2174ac6405d0",
    //         "title": "T1 is my first",
    //         "description": "Testing purpose note",
    //         "tag": "personal",
    //         "date": "2022-12-24T18:18:57.851Z",
    //         "__v": 0
    //     },
    //     {
    //         "_id": "63a7429e3616de24981a44932",
    //         "user": "63a43c707fca2174ac6405d0",
    //         "title": "T2 is my first",
    //         "description": "Testing purpose note2",
    //         "tag": "personal",
    //         "date": "2022-12-24T18:19:10.872Z",
    //         "__v": 0
    //     },
    //     {
    //         "_id": "63a7429e3616d2t4981a44932",
    //         "user": "63a43c707fca2174ac6405d0",
    //         "title": "T2 is my first",
    //         "description": "Testing purpose note2",
    //         "tag": "personal",
    //         "date": "2022-12-24T18:19:10.872Z",
    //         "__v": 0
    //     },
    //     {
    //         "_id": "63a7429e3616d24t981a44932",
    //         "user": "63a43c707fca2174ac6405d0",
    //         "title": "T2 is my first",
    //         "description": "Testing purpose note2",
    //         "tag": "personal",
    //         "date": "2022-12-24T18:19:10.872Z",
    //         "__v": 0
    //     },
    //     {
    //         "_id": "63a7429e3616d249481a44932",
    //         "user": "63a43c707fca2174ac6405d0",
    //         "title": "T2 is my first",
    //         "description": "Testing purpose note2",
    //         "tag": "personal",
    //         "date": "2022-12-24T18:19:10.872Z",
    //         "__v": 0
    //     },
    //     {
    //         "_id": "63a7429e3616d249381a44932",
    //         "user": "63a43c707fca2174ac6405d0",
    //         "title": "T2 is my first",
    //         "description": "Testing purpose note2",
    //         "tag": "personal",
    //         "date": "2022-12-24T18:19:10.872Z",
    //         "__v": 0
    //     },
    //     {
    //         "_id": "63a7429e3616d249821a44932",
    //         "user": "63a43c707fca2174ac6405d0",
    //         "title": "T2 is my first",
    //         "description": "Testing purpose note2",
    //         "tag": "personal",
    //         "date": "2022-12-24T18:19:10.872Z",
    //         "__v": 0
    //     }

    // ]
    const notesInital = []

    const [notes, setNotes] = useState(notesInital)

    // Get all notes
    const getNotes = async () => {
        // API call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = await response.json()
        console.log(json)
        setNotes(json)
    }

    // Add a note
    const addNote = async (title, description, tag) => {
        // API call
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag })
        });
        const note = await response.json();
        // console.log(json)

        // logic
        // console.log("Adding a new note")
        // const note =  {
        //     "_id": "63a7429e3616d2s49821a44932",
        //     "user": "63a43c707fca2174ac6405d0",
        //     "title": title,
        //     "description": description,
        //     "tag": tag,
        //     "date": "2022-12-24T18:19:10.872Z",
        //     "__v": 0
        // }
        setNotes(notes.concat(note))
    }

    // Delete a note
    const deleteNote = async (id) => {
        // API call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = response.json();
        console.log(json)

        // logic
        // console.log("Delete a note with id" + id)
        const newNotes = notes.filter((note) => { return note._id !== id })
        setNotes(newNotes)
    }

    // Edit a note
    const editNote = async (id, title, description, tag) => {
        // API call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag })
        });
        const json = await response.json();
        console.log(json)

        let newNotes = JSON.parse(JSON.stringify(notes))
        // logic to edit in client
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }
        }
        setNotes(newNotes)
    }

    return (

        // <NoteContext.Provider value={{state, update}}>
        // <NoteContext.Provider value={{state:state, update:update}}>
        // <NoteContext.Provider value={{notes,setNotes}}>
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
            {props.children}
        </NoteContext.Provider>
    )
}
export default NoteState;