import React , {useState,useEffect} from 'react';
import firebase from 'firebase/compat/app';
import Message from './Message';
// import { doc, onSnapshot } from "firebase/firestore";

const Channel = ({user=null ,db})=>{
    const [messages,setMessages]=useState([]);
    const [newMessage,setNewMessage]=useState("");
    const {uid,displayName,photoURL}=user;
    useEffect(()=>{
        if (db){
            const unsubscribe= db
            .collection('messages')
            .orderBy('createdAt')
            .limit(100)
            .onSnapshot(querySnapshot=>{
                console.log("here")
                /// Get All documents from collection - with IDS
                const data= querySnapshot.docs.map(doc =>({
                    ...doc.data(),
                    id: doc.id,
                }));
                /// update State
                setMessages(data);
            })
            // detach listener
            return unsubscribe;
        }
    },[db]);

    const handleOnChange = e =>{
        setNewMessage(e.target.value)
    }

    const handleOnSubmit=e=>{
        e.preventDefault();
        if(db){
            db.collection('messages').add({
                text:newMessage,
                createdAt:firebase.firestore.FieldValue.serverTimestamp(),
                uid,
                displayName,
                photoURL
            })
        }
    }

    return (
        <>
            <ul>
              {messages.map(message=>(
                <li key={message.id}><Message {...message}/></li>
               ))}
            </ul>
            <form onSubmit={handleOnSubmit}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleOnChange}
                  placeholder="type your message here..."
                />
                <button type="submit" disabled={!newMessage}>
                    Send
                </button>
            </form>
        </>

    );
};
export default Channel;