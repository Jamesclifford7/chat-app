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

// initializing firebase, authentication, and firestore (database)
firebase.initializeApp(config)

const auth = firebase.auth(); 
const firestore = firebase.firestore(); 

// sign in handler
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

  console.log(props.message, auth)

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
  // rendering messages

  // not using react-firebase-hooks

  // const messagesRef = firestore.collection('messages'); 
  // const messages = messagesRef.orderBy('createdAt').limitToLast(20)
  //   .get()
  //   .then((res) => {
  //     res.forEach((doc) => {
  //       // doc.data() is never undefined for query doc snapshots
  //       // console.log(doc.id, " => ", doc.data());
  //       const data = doc.data(); 
  //       return data.text
  //     });

  //     // console.log(res)
  //     // return [res]
  //   })
  //   .catch((error) => {
  //     console.log(error)
  //   })
  // console.log(messages)

  // original: 
  const messagesRef = firestore.collection('messages'); 
  const query = messagesRef.orderBy('createdAt').limitToLast(25); 

  const [messages] = useCollectionData(query, { idField: 'id' }); 

  // sending messages?

  // const [formValue, setFormValue] = useState(''); 

  // const setFormValue = (event) => {
  //   event.preventDefault(); 
  //   return event.target.value
  // }

  const sendMessage = async (event) => {
    event.preventDefault(); 

    const { uid, photoURL } = auth.currentUser; 
    const { formValue } = event.target
    const message = formValue.value

    // according to docs: 

    firestore.collection('messages').add({
      text: message, 
      createdAt: firebase.firestore.FieldValue.serverTimestamp(), 
      uid, 
      photoURL
    })

    // await messagesRef.add({
    //   text: formValue, 
    //   createdAt: firebase.firestore.FieldValue.serverTimestamp(), 
    //   uid, 
    //   photoURL
    // })

    // setFormValue(''); 

    console.log(message, uid, photoURL)

  }


  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <form onSubmit={(event) => sendMessage(event)}>
          <input type="text" id="formValue" placeholder="send a message!" />
          <button type="submit" >Send</button>
        </form>
      </main>
    </>
  )
}

function App() {

  const [user] = useAuthState(auth); 

  // console.log(process.env.REACT_APP_CONFIG)

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
