import { useContext } from 'react';
import { Card } from '../components/card/Card';
import Login from '../components/login/Login';
import { LoginContext } from '../components/LoginContext';


import { NameManager } from '../components/nameManager/NameManager';

import "./Home.scss"

function Main() {
	const {user, setUser} = useContext(LoginContext);


  if (user) {
    return (
      <>
        <NameManager />
        <div className="cards_container">
          <Card />
          <Card />
          <Card />
        </div>
      </>
    )

  } else {
    return <Login />
  }
}

export default Main;
