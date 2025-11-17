// src/components/AuthPage.js
import backendURL from '../apiConfig.js';
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

// 1. Importa o nosso novo CSS
import './AuthPage.css';

// Recebe o 'setToken' do App.js para passar para o Login
function AuthPage({ setToken }) {
  // 2. Estado que controla qual painel está ativo
  const [isSignUpActive, setIsSignUpActive] = useState(false);

  const handleSignUpClick = () => {
    setIsSignUpActive(true); // Ativa o painel de cadastro
  };

  const handleSignInClick = () => {
    setIsSignUpActive(false); // Ativa o painel de login
  };

  // 3. Monta o JSX usando as classes do AuthPage.css
  return (
    <div className="auth-page-wrapper">
      {/* Adiciona a classe 'right-panel-active' quando 'isSignUpActive' for true */}
      <div className={`auth-container ${isSignUpActive ? 'right-panel-active' : ''}`}>
        
        {/* Painel de Cadastro */}
        <div className="form-container sign-up-container">
          {/* O componente Register.js que já tínhamos! */}
          <Register />
        </div>
        
        {/* Painel de Login */}
        <div className="form-container sign-in-container">
          {/* O componente Login.js que já tínhamos! */}
          <Login setToken={setToken} />
        </div>
        
        {/* Painel de Overlay (o que desliza) */}
        <div className="overlay-container">
          <div className="overlay">
            
            {/* Overlay da Esquerda (Mostrado com o Login) */}
            <div className="overlay-panel overlay-left">
              <h1>Bem-vindo de volta!</h1>
              <p>Para se manter conectado, faça o login com suas informações</p>
              <button className="ghost-button" onClick={handleSignInClick}>
                Login
              </button>
            </div>
            
            {/* Overlay da Direita (Mostrado com o Cadastro) */}
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