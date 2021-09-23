import React , {useState, useEffect} from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import Button from './components/Buttons';
import Channel from './components/Channel';
firebase.initializeApp({
});


const auth=firebase.auth();
const db=firebase.firestore();

function App() {
  const [user,setUser]=useState(()=>auth.currentUser);
  const [intializing,setIntializing]=useState(true);
  useEffect(()=>{
    const unsubscribe=auth.onAuthStateChanged(user=>{
      if (user){
        setUser(user);
      }else{
        setUser(null);
      }
    })
    // clean subscription
    return unsubscribe;
  },[])
  const signInWithGoogle= async ()=>{
    // to use google provider
    const provider = new firebase.auth.GoogleAuthProvider();
    // to select language
    auth.useDeviceLanguage();
    // start sign in process
    try {
      await auth.signInWithPopup(provider)
    } catch(error){
      console.error(error);
    }
  };

  const signOut=async()=>{
    try{
      await firebase.auth().signOut();
    } catch(error){
      console.log(error.message)
    }
  };
  // if (intializing) return "Loading...";
  return (
    <div>

      {user ?
      (
        <>
          <Button onClick={signOut}>Sign Out</Button>
          {/* <p>Welcome to the Chat</p> */}
          <Channel user={user} db={db}/>
        </>
      ):(
        <Button onClick={signInWithGoogle}>Sign in with Google</Button>
      )}
    </div>
  );
}

export default App;
