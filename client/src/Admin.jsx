import axios from "axios";
import Header from "./Header";
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence , signOut } from "firebase/auth";
import { useState, useEffect } from "react";

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [data, setData] = useState([]);
  
  // Handling Authentication
  function handleLogin(e) {
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
    })
    .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    });
  }

  function handleLogout(){
    const auth = getAuth();
    signOut(auth).then(() => {
    // Sign-out successful.
    }).catch((error) => {
    // An error happened.
    });
  }

  // Session management
  const auth = getAuth();
  setPersistence(auth, browserLocalPersistence);
  getAuth().onAuthStateChanged(function (user) {
    if (user) {
      //User is signed in.
      const idx = user.email.indexOf('@gpahm.gujgov.edu.in');
      if (idx > -1) {
        handleLogout();
      }
      setLoggedIn(true);
    } else {
      // No user is signed in.
      setLoggedIn(false);
    }
  });

  // Fetching data of MongoDB from Backend
  useEffect(async() => {
    const response = await axios.post("/admin-panel");
    setData(await response.data);
  }, [setData]);

  async function handleClick(e) {
    await axios.post('/get-list', {
      id: e.target.value
    });
  }
  async function handleName(e){
    await axios.post('/send-msg', {
      msg: e.target.value,
      id: e.target.id
    });
  }
  
  const AdminPanel = () => {
    return (<div className="box">
      {data?.map((item, index) =>  
      <div key={index} className="item">
        <button 
          className="admin-l" 
          type="submit" 
          id={item._id} 
          value={item._id} 
          onClick={handleClick}
        >
          Delete
        </button>
        <p className="admin-p">{item.name}</p>
        <button 
          className="admin-r" 
          type="submit" 
          id={item._id} 
          value={item.name} 
          onClick={handleName}
        >
          Approve
        </button>
      </div>
    )}
    </div>)
  }

  return (
  <>
    {loggedIn ? 
      <> 
        <Header onClick={handleLogout} name="Logout" /> 
        <div className="box" id="heading">
          <h1> Moderator Panel </h1>
        </div>
        <AdminPanel />
      </> 
      : 
        <>
      <form method="post">
        <h4>Login with Moderator Credentials</h4>
        <input 
          type="email" 
          placeholder="Enter Email" 
          onChange={(e) => setEmail(e.target.value)} 
          name="email" 
          required 
        />
        <input 
          type="password" 
          placeholder="Enter Password" 
          onChange={(e) => setPassword(e.target.value)} 
          name="password" 
          required
        />
        <button type="submit" onClick={handleLogin}>Login</button>
      </form>
      </>}
  </>
  )
}
