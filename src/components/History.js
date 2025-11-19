

import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress 
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
function History({ historyList, loading }) {
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
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
        <List sx={{ maxHeight: 400, overflow: 'auto' }}> 
          {historyList.map((item) => (
            <ListItem 
              key={item._id} 
              divider
            >
              <ListItemIcon>
                <AccessTimeIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <span>
                    <strong>{item.amount} {item.fromCrypto.toUpperCase()}</strong> = 
                    BRL {item.valueBRL.toFixed(2)}
                  </span>
                }
                secondary={
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