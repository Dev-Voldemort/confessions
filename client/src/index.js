import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from './App';
import Admin from "./Admin";


ReactDOM.render(
  <BrowserRouter>
  <Routes>
      <Route path="/" element={<App />} />
      <Route exact path="sonamguptabewafahai" element={<Admin />} />
    </Routes>
</BrowserRouter>,
 
  document.getElementById('root')
);




