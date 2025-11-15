// src/components/Converter.js (v3 - Corrigindo bugs de usabilidade)
import backendURL from '../apiConfig.js';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Autocomplete,
  TextField,
  Typography,
  IconButton,
  Paper,
  CircularProgress
} from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';

function Converter({
  token,
  onConversionSuccess,
  allCoins,
  userFavorites,
  refreshFavorites,
  loadingCoins
}) {
  const [selectedCoin, setSelectedCoin] = useState(null);
  
  // MUDANÇA 1: "Quantidade" agora começa vazia, o que é mais natural.
  const [amount, setAmount] = useState(''); 
  
  const [result, setResult] = useState(null);
  const [loadingConvert, setLoadingConvert] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  

  useEffect(() => {
    // Este efeito define a moeda padrão QUANDO a lista carrega
    if (!selectedCoin && allCoins.length > 0) {
      let defaultCoinId = allCoins[0].id;
      if (userFavorites.length > 0) {
        defaultCoinId = userFavorites[0];
      }
      const defaultCoinObject = allCoins.find(coin => coin.id === defaultCoinId);
      setSelectedCoin(defaultCoinObject);
    }
  }, [allCoins, userFavorites]); // MUDANÇA 2: Removido 'selectedCoin' daqui. Isso PAROU o bug do auto-completar.

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCoin) {
      alert('Por favor, selecione uma moeda.');
      return;
    }
    
    // MUDANÇA 3: Melhor validação da quantidade
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      alert('Por favor, insira uma quantidade válida maior que zero.');
      return;
    }
    
    setLoadingConvert(true);
    setResult(null);
    try {
      const config = { headers: { 'x-auth-token': token } };
      const response = await axios.post(
        `${backendURL}/api/convert`,
        { cryptoId: selectedCoin.id, amount: numAmount }, // Usa a quantidade validada
        config
      );
      setResult(response.data);
      onConversionSuccess(token);
    } catch (error) {
      console.error('Erro na conversão', error.response.data);
      alert('Erro: ' + (error.response?.data?.error || 'Falha na conversão'));
    } finally {
      setLoadingConvert(false);
    }
  };

  const handleFavoriteToggle = async () => {
    // ... (Esta função está correta, sem mudanças) ...
    if (loadingFavorite || !selectedCoin) return; 
    setLoadingFavorite(true);
    const config = { headers: { 'x-auth-token': token } };
    const coinId = selectedCoin.id;
    try {
      const isCurrentCoinFavorite = userFavorites.includes(coinId);
      if (isCurrentCoinFavorite) {
        await axios.delete(`${backendURL}/api/favorites/${coinId}`, config);
      } else {
        await axios.post(`${backendURL}/api/favorites`, { cryptoId: coinId }, config);
      }
      refreshFavorites();
    } catch (error) {
      console.error('Erro ao favoritar', error);
      alert('Erro ao atualizar favoritos.');
    } finally {
      setLoadingFavorite(false);
    }
  };
  
  const isCurrentCoinFavorite = userFavorites.includes(selectedCoin?.id);

  return (
    <Box>
      <Typography component="h2" variant="h5" gutterBottom>
        Simulador de Conversão
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          
          <Autocomplete
            fullWidth
            value={selectedCoin} 
            onChange={(event, newValue) => { 
              setSelectedCoin(newValue);
            }}
            options={allCoins} 
            loading={loadingCoins} 
            getOptionLabel={(option) => option.name || ""} 
            isOptionEqualToValue={(option, value) => option.id === value.id}
            groupBy={(option) => option.group}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Criptomoeda"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingCoins ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          
          <IconButton
            onClick={handleFavoriteToggle}
            disabled={loadingFavorite || loadingCoins || !selectedCoin}
            color="primary"
          >
            {loadingFavorite ? (
              <CircularProgress size={24} />
            ) : (
              isCurrentCoinFavorite ? <Star /> : <StarBorder />
            )}
          </IconButton>
        </Box>
        
        <TextField
          label="Quantidade"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)} // Permite digitar livremente
          variant="outlined"
          fullWidth
          inputProps={{ min: "0", step: "any" }} // 'step="any"' remove as setas chatas
        />
        
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loadingConvert || !selectedCoin}
          startIcon={loadingConvert ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loadingConvert ? 'A converter...' : 'Converter'}
        </Button>
      </Box>
      
      {/* ... (O JSX do Resultado continua igual) ... */}
      {result && (
        <Paper 
          variant="outlined" 
          sx={{ marginTop: 2, padding: 2, background: (theme) => theme.palette.action.hover }}
        >
          <Typography variant="h6" gutterBottom>Resultado da Conversão:</Typography>
          <Typography variant="body1">
            {result.quantity} <strong>{result.from.toUpperCase()}</strong> é igual a:
          </Typography>
          <Typography variant="body1" color="success.main" sx={{ fontWeight: 'bold' }}>
            BRL: R$ {result.valueBRL.toFixed(2)}
          </Typography>
          <Typography variant="body1" color="info.main" sx={{ fontWeight: 'bold' }}>
            USD: $ {result.valueUSD.toFixed(2)}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

export default Converter;