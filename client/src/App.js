import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import './App.css';

import Mainroute from './routes/MainRoute';


function App() {
  return (
    <>
       <BrowserRouter>
         
        <Mainroute />
       </BrowserRouter>
    </>
  );
}

export default App;
