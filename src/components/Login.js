// src/components/Login.js
import backendURL from '../apiConfig.js';
import React, { useState } from 'react';
import axios from 'axios';

// --- NOVOS IMPORTS DO MUI ---
import { TextField, Button, Box, Typography } from '@mui/material';
// --- FIM DOS NOVOS IMPORTS ---

// O 'setToken' ainda é recebido do App.js
function Login({ setToken }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(
        `${backendURL}/api/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );
      
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token); // Avisa o App.js

    } catch (error) {
      if (error.response) {
        console.error('Erro de login:', error.response.data.error);
        alert('Erro: ' + error.response.data.error);
      } else if (error.request) {
        console.error('Erro de rede:', error.request);
        alert('Erro: Não foi possível conectar ao servidor. Tente novamente.');
      } else {
        console.error('Erro:', error.message);
        alert('Ocorreu um erro inesperado.');
      }
    }
  };

  // --- NOVO JSX COM MUI ---
  return (
    // Box é um <div> mais inteligente
    <Box 
      component="form" // Dizemos que este Box é um <form>
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} // 'gap: 2' adiciona espaço entre os itens
    >
      <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold' }}>
        Nexus Cripto
      </Typography>
      <Typography component="h2" variant="h5">
        Login
      </Typography>
      
      {/* TextField substitui <label> e <input> */}
      <TextField
        label="Email" // O label flutuante
        variant="outlined" // O estilo da borda
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        fullWidth // Ocupa 100% da largura
      />
      
      <TextField
        label="Senha"
        variant="outlined"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
        fullWidth
      />
      
      {/* O novo botão com animações */}
      <Button 
        type="submit" 
        variant="contained" // Estilo "preenchido"
        color="primary" // Cor primária do tema
        size="large"
        fullWidth
      >
        Entrar
      </Button>
    </Box>
  );
}

export default Login;