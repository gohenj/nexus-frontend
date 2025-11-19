// src/components/AuthPage.js
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';


import './AuthPage.css';

function AuthPage({ setToken }) {
  const [isSignUpActive, setIsSignUpActive] = useState(false);

  const handleSignUpClick = () => {
    setIsSignUpActive(true); 
  };

  const handleSignInClick = () => {
    setIsSignUpActive(false);
  };

  return (
    <div className="auth-page-wrapper">
      <div className={`auth-container ${isSignUpActive ? 'right-panel-active' : ''}`}>
        
        <div className="form-container sign-up-container">
          <Register />
        </div>
        
        <div className="form-container sign-in-container">
          <Login setToken={setToken} />
        </div>
        
        <div className="overlay-container">
          <div className="overlay">
            
            <div className="overlay-panel overlay-left">
              <h1>Bem-vindo de volta!</h1>
              <p>Para se manter conectado, faça o login com suas informações</p>
              <button className="ghost-button" onClick={handleSignInClick}>
                Login
              </button>
            </div>
            
            <div className="overlay-panel overlay-right">
              <h1>Comece sua jornada!</h1>
              <p>Não tem uma conta? Cadastre-se e comece agora</p>
              <button className="ghost-button" onClick={handleSignUpClick}>
                Cadastre-se
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;