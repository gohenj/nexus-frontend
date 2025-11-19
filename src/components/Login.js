
import backendURL from '../apiConfig.js';
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';

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
      setToken(response.data.token); 

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
  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} 
    >
      <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold' }}>
        Nexus Cripto
      </Typography>
      <Typography component="h2" variant="h5">
        Login
      </Typography>
      <TextField
        label="Email"
        variant="outlined"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        fullWidth 
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
      <Button 
        type="submit" 
        variant="contained"
        color="primary" 
        size="large"
        fullWidth
      >
        Entrar
      </Button>
    </Box>
  );
}

export default Login;