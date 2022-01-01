import { useState, useEffect, SetStateAction } from 'react';
import { Card } from '../components/card/Card';


import { GoogleLogin } from '../components/header/GoogleLogin';

import logo from '../images/logo.svg';
import "./Home.scss"

function Home() {
  
  // return (
  //   <div className="App">
  //     <div className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.tsx</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </div>
  //   </div>
  // );
  return (
    <div className="cards_container">
      <Card/>
      <Card/>
      <Card/>
    </div>
  )
}

export default Home;
