
import backendURL from '../apiConfig.js';
import React, { useState } from 'react'; 
import axios from 'axios'; 
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton, 
  CircularProgress 
} from '@mui/material';

import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete'; 

function FavoritesList({ allCoins, userFavorites, token, refreshFavorites }) {

  const [loadingItemId, setLoadingItemId] = useState(null);
  const favoriteCoinObjects = allCoins.filter(coin => 
    userFavorites.includes(coin.id)
  );
  const handleUnfavorite = async (cryptoId) => {
    setLoadingItemId(cryptoId); 
    try {
      const config = { headers: { 'x-auth-token': token } };
      await axios.delete(
        `${backendURL}/api/favorites/${cryptoId}`, 
        config
      );
      refreshFavorites(); 
    } catch (error) {
      console.error('Erro ao desfavoritar', error);
      alert('Erro ao remover favorito.');
    } finally {
    }
  };

  return (
    <Box>
      <Typography component="h2" variant="h5" gutterBottom>
        Suas Moedas Favoritas
      </Typography>
      
      {favoriteCoinObjects.length === 0 ? (
        <Typography variant="body1">
          Você ainda não favoritou nenhuma moeda.
        </Typography>
      ) : (
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {favoriteCoinObjects.map((coin) => (
            <ListItem 
              key={coin.id} 
              divider
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={() => handleUnfavorite(coin.id)}
                  disabled={loadingItemId === coin.id} 
                >
                  {loadingItemId === coin.id ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <DeleteIcon />
                  )}
                </IconButton>
              }
            >
              <ListItemIcon>
                <StarIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={<strong>{coin.name}</strong>}
                secondary={coin.symbol.toUpperCase()}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default FavoritesList;