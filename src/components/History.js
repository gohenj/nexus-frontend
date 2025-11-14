// src/components/History.js

import React from 'react';

// --- NOVOS IMPORTS DO MUI ---
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress // O loading
} from '@mui/material';

// --- NOVO IMPORT DE ÍCONE ---
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Ícone de relógio

// Recebe a 'historyList' e o 'loading' do App.js
function History({ historyList, loading }) {
  
  // Se estiver a carregar, mostra o spinner
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // --- NOVO JSX COM MUI ---
  return (
    <Box>
      <Typography component="h2" variant="h5" gutterBottom>
        Seu Histórico de Conversões
      </Typography>
      
      {historyList.length === 0 ? (
        <Typography variant="body1">
          Você ainda não fez nenhuma conversão.
        </Typography>
      ) : (
        // A nova Lista do MUI
        <List sx={{ maxHeight: 400, overflow: 'auto' }}> {/* Define uma altura máxima e scroll */}
          {historyList.map((item) => (
            <ListItem 
              key={item._id} 
              divider // Adiciona uma linha divisória
            >
              <ListItemIcon>
                <AccessTimeIcon />
              </ListItemIcon>
              {/* ListItemText usa 'primary' e 'secondary' para duas linhas */}
              <ListItemText
                primary={
                  <span>
                    <strong>{item.amount} {item.fromCrypto.toUpperCase()}</strong> = 
                    BRL {item.valueBRL.toFixed(2)}
                  </span>
                }
                secondary={
                  // Formata a data para ficar bonita
                  new Date(item.timestamp).toLocaleString('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'short'
                  })
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default History;