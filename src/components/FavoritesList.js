// src/components/FavoritesList.js
import backendURL from '../apiConfig.js';
import React, { useState } from 'react'; // <-- 1. Importa o useState
import axios from 'axios'; // <-- 2. Importa o axios

// --- Imports do MUI (adicionamos IconButton e CircularProgress) ---
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton, // <-- 3. Novo: O botão de ícone
  CircularProgress // <-- 4. Novo: O loading
} from '@mui/material';

// --- Imports de Ícones (adicionamos DeleteIcon) ---
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete'; // <-- 5. Novo: Ícone da lixeira

// 6. Recebe as novas props: token e refreshFavorites
function FavoritesList({ allCoins, userFavorites, token, refreshFavorites }) {

  

  // 7. Estado para mostrar o loading *apenas* no item que está a ser removido
  const [loadingItemId, setLoadingItemId] = useState(null);

  // Filtra as moedas (sem mudanças)
  const favoriteCoinObjects = allCoins.filter(coin => 
    userFavorites.includes(coin.id)
  );

  // 8. Nova função para desfavoritar
  const handleUnfavorite = async (cryptoId) => {
    setLoadingItemId(cryptoId); // Ativa o loading para este item
    try {
      const config = { headers: { 'x-auth-token': token } };
      // Chama a rota DELETE do backend (que já tínhamos feito)
      await axios.delete(
        `${backendURL}/api/favorites/${cryptoId}`, 
        config
      );
      // Avisa o App.js para recarregar as listas (atualizando tudo!)
      refreshFavorites(); 
    } catch (error) {
      console.error('Erro ao desfavoritar', error);
      alert('Erro ao remover favorito.');
    } finally {
      // setLoadingItemId(null); // O 'refresh' já vai fazer isto, mas podemos garantir
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
              // 9. Adiciona o botão de "ação secundária" (a lixeira)
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={() => handleUnfavorite(coin.id)}
                  disabled={loadingItemId === coin.id} // Desativa o botão durante o clique
                >
                  {/* Mostra o loading ou o ícone */}
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