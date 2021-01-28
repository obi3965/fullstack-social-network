import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import './App.css';
import Nav from './pages/Nav';
import Mainroute from './routes/MainRoute';


function App() {
  return (
    <>
       <BrowserRouter>
         <Nav />
        <Mainroute />
       </BrowserRouter>
    </>
  );
}

export default App;
