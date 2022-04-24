import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";
import "./firebase.config";
import { getAuth, setPersistence, signInWithPopup, browserLocalPersistence, signOut, OAuthProvider } from "firebase/auth";
import Header from "./Header";
import Footer from "./Footer";


function App() {
const [user, setUser] = useState(null);
const [loggedIn, setLoggedIn] = useState(true);
const [hour, setHour] = useState(true);
const [expanded, setExpanded] = useState(false);
const [distance, setDistance] = useState(null);
const msg = useRef("");

const auth = getAuth();
const provider = new OAuthProvider('microsoft.com');

useEffect(async() => {
  const response = await axios.post("/get-time", {
    uid: user,
  });
  const cur = new Date().getTime();
  const time = (cur - await response.data) /60000;
  setDistance(await response.data);
  if(time >= 60 || response.data === false){
    setHour(true);
  } else{
    setHour(false);
  }
}, [user]);

// Handling Authentication
function handleLogin(){
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = OAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      const idToken = credential.idToken;
    })
    .catch((error) => {
      console.log(error);
    });

}

function handleLogout(){
  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
  }

// User session management
setPersistence(auth, browserLocalPersistence);

// Checking Autentication status
getAuth().onAuthStateChanged(function(user) {
  if (user) {
    //User is signed in.
    var idx = user.email.indexOf('@gpahm.gujgov.edu.in');
    
    if (idx > -1) {
      setUser(user.uid);
      setLoggedIn(true);
    } else {
      setLoggedIn(false)
    }
  } else {
    // No user is signed in.
    setLoggedIn(false);
  }
});
  
  async function handleMsg(event){
    msg.current = await event.target.value;
  }

  async function handleClick() {
    await axios.post('/home', {
      Name: msg.current,
      uid: user,
    });
  }
  
  const Timer = () => {
    const x = setInterval(function() {
      const cur = new Date().getTime();
      const b = (cur - distance);
      const minutes = 59 - (Math.floor((b % (1000 * 60 * 60)) / (1000 * 60)));
      const seconds = 59 - (Math.floor((b % (1000 * 60)) / 1000));
      document.getElementById("timer").innerText = minutes + "m " + seconds + "s ";
      if (distance < 0) {
        clearInterval(x);
        document.getElementById("timer").innerText = "EXPIRED";
      }
    }, 1000);
    return (<div className="div">
      <h1 id="timer" className="timer"></h1>
    </div>)
  }

  const Textarea = () => {
    return (hour ? 
    <> 
      <Header onClick={handleLogout} name="Logout" />
      <form>
        <textarea
          onClick={() => setExpanded(true)}
          onChange={handleMsg}
          placeholder="Enter Your Confession..."
          rows={expanded ? 3 : 1}
        />
        {expanded && <button id="input" onClick={handleClick} type="submit">Add</button>}
      </form>
    </>
    : <>
      <Header onClick={handleLogout} name="Logout" />
      <Timer />
    </>
    )
  }
  
  return (<div className="parent">
    {loggedIn ? 
        <Textarea /> 
        : 
        <>
          <h3>You have to login with MsTeams email to use this website</h3>
          <Header onClick={handleLogin} name="Login" />
        </>
    } 
    <Footer />
  </div>
  );
}

export default App;


