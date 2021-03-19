import React, { useEffect, useRef, useState } from 'react'; 
import './App.css';
import firebase from 'firebase/app'; 
import 'firebase/firestore'; 
import 'firebase/auth'; 
import { useAuthState } from 'react-firebase-hooks/auth'; 
import { useCollectionData } from 'react-firebase-hooks/firestore'; 

const config = {
    apiKey: "AIzaSyAZTYfBxj1-DUAz52MujrwzvCxOm0PQkFg",
    authDomain: "chat-app-47550.firebaseapp.com",
    projectId: "chat-app-47550",
    storageBucket: "chat-app-47550.appspot.com",
    messagingSenderId: "325934419874",
    appId: "1:325934419874:web:b6343906b283dd2b192cfb",
    measurementId: "G-SJCHNLVSTQ"
}

firebase.initializeApp(config)

const auth = firebase.auth(); 
const firestore = firebase.firestore(); 

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider(); 
    auth.signInWithPopup(provider); 
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message; 

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'; 

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img src={photoURL} />
        <p>{text}</p>
      </div>
    </>
  )
}

function ChatRoom() {
  // rendering messages?
  const messagesRef = firestore.collection('messages'); 
  const query = messagesRef.orderBy('createdAt').limitToLast(25); 

  const [messages] = useCollectionData(query, { idField: 'id' }); 

  // sending messages?

  const [formValue, setFormValue] = useState(''); 

  const sendMessage = async (e) => {
    e.preventDefault(); 

    const { uid, photoURL } = auth.currentUser; 

    await messagesRef.add({
      text: formValue, 
      createdAt: firebase.firestore.FieldValue.serverTimestamp(), 
      uid, 
      photoURL
    })

    setFormValue(''); 

  }


  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <form onSubmit={sendMessage}>
          <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="send a message!" />
          <button type="submit" disabled={!formValue}>Send</button>
        </form>
      </main>
    </>
  )
}

function App() {

  const [user] = useAuthState(auth); 

  return (
    <div className="App">
      <header>
        <h1></h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
      
    </div>
  );
}

export default App;