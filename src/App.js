// src/App.js
import backendURL from '../apiConfig.js';
import React, { useState, useEffect, useRef } from 'react'; // <-- MUDANÇA: Importa o useRef
import axios from 'axios';
import AuthPage from './components/AuthPage';
import Converter from './components/Converter';
import History from './components/History';
import FavoritesList from './components/FavoritesList';

// --- IMPORTS DO MUI ---
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  CssBaseline,
  Box,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// --- IMPORT DA TRANSIÇÃO ---
import { SwitchTransition, CSSTransition } from 'react-transition-group';

// O nosso tema "High-Tech" (sem mudanças)
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#E53935' },
    background: {
      default: 'transparent',
      paper: 'rgba(26, 26, 46, 0.7)',
    },
  },
  typography: { fontFamily: 'Poppins, sans-serif' },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }
      }
    }
  }
});

function App() {


  // --- Nossos Estados (sem mudanças) ---
  const [token, setToken] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [allCoins, setAllCoins] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [loadingCoins, setLoadingCoins] = useState(false);
  const [sortedCoins, setSortedCoins] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);

  // --- NOSSAS FUNÇÕES (sem mudanças) ---
  const fetchHistory = async (currentToken) => { /* ...código igual... */ 
    if (!currentToken) return;
    setLoadingHistory(true);
    try {
      const config = { headers: { 'x-auth-token': currentToken } };
      const response = await axios.get(`${backendURL}/api/history`, config);
      setHistory(response.data);
    } catch (error) {
      console.error('Erro ao buscar histórico', error);
    } finally {
      setLoadingHistory(false);
    }
  };
  const fetchAllCoins = async (currentToken) => { /* ...código igual... */ 
    if (!currentToken) return;
    setLoadingCoins(true);
    try {
      const response = await axios.get(`${backendURL}/api/crypto/list`);
      setAllCoins(response.data);
    } catch (error) {
      console.error('Erro ao buscar lista de moedas', error);
    } finally {
      setLoadingCoins(false);
    }
  };
  const fetchUserFavorites = async (currentToken) => { /* ...código igual... */ 
    if (!currentToken) return;
    try {
      const config = { headers: { 'x-auth-token': currentToken } };
      const response = await axios.get(`${backendURL}/api/favorites`, config);
      setUserFavorites(response.data);
    } catch (error) {
      console.error('Erro ao buscar favoritos', error);
    }
  };
  useEffect(() => { /* ...código igual... */
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  useEffect(() => { /* ...código igual... */
    if (token) {
      fetchHistory(token);
      fetchAllCoins(token);
      fetchUserFavorites(token);
    }
  }, [token]);
  useEffect(() => { /* ...código igual... */
    if (allCoins.length === 0) return;
    const favorites = [];
    const others = [];
    allCoins.forEach(coin => {
      if (userFavorites.includes(coin.id)) {
        favorites.push({ ...coin, group: 'Favoritas' });
      } else {
        others.push({ ...coin, group: 'Outras Moedas' });
      }
    });
    setSortedCoins([...favorites, ...others]);
  }, [allCoins, userFavorites]);
  const handleLogout = () => { /* ...código igual... */
    setToken(null);
    setHistory([]);
    setAllCoins([]);
    setUserFavorites([]);
    setSortedCoins([]);
  };
  const handleTabChange = (event, newValue) => { /* ...código igual... */
    setCurrentTab(newValue);
  };
  
  // --- MUDANÇA: Criar os Refs ---
  const authPageRef = useRef(null);
  const mainAppRef = useRef(null);
  // Determina qual ref usar com base no estado ATUAL do token
  const nodeRef = token ? mainAppRef : authPageRef;
  // --- FIM DA MUDANÇA ---

  // --- Renderização ---
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={token ? "app" : "auth"} // O gatilho (sem mudanças)
          
          // --- MUDANÇA: Passa o nodeRef correto ---
          nodeRef={nodeRef} 
          // --- FIM DA MUDANÇA ---
          
          timeout={600}
          classNames="page-slide"
        >
          {/* MUDANÇA: 
            Agora o 'ref' é dinâmico (assim como o 'nodeRef').
            E o conteúdo condicional (token ? ... : ...)
            foi movido para DENTRO do 'div' wrapper.
          */}
          <div ref={nodeRef} className="page-wrapper">
            {token ? (
              // Se há token, mostra a App Principal
              <>
                <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                      Nexus Cripto
                    </Typography>
                    <Button color="inherit" onClick={handleLogout} variant="outlined">
                      Sair
                    </Button>
                  </Toolbar>
                </AppBar>

                <Container component="main" maxWidth="md" sx={{ marginTop: '2rem' }}>
                  <Paper elevation={3}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Tabs value={currentTab} onChange={handleTabChange} aria-label="abas principais" variant="fullWidth" indicatorColor="primary" textColor="inherit">
                        <Tab label="Converter" id="tab-0" />
                        <Tab label="Histórico" id="tab-1" />
                        <Tab label="Favoritos" id="tab-2" />
                      </Tabs>
                    </Box>
                    
                    {currentTab === 0 && (
                      <Box sx={{ p: 3 }}>
                        <Converter token={token} onConversionSuccess={fetchHistory} allCoins={sortedCoins} userFavorites={userFavorites} refreshFavorites={() => fetchUserFavorites(token)} loadingCoins={loadingCoins} />
                      </Box>
                    )}
                    {currentTab === 1 && (
                      <Box sx={{ p: 3 }}>
                        <History historyList={history} loading={loadingHistory} />
                      </Box>
                    )}
                    {currentTab === 2 && (
                      <Box sx={{ p: 3 }}>
                        <FavoritesList allCoins={sortedCoins} userFavorites={userFavorites} token={token} refreshFavorites={() => fetchUserFavorites(token)} />
                      </Box>
                    )}
                  </Paper>
                </Container>
              </>
            ) : (
              // Se não há token, mostra a página de Login
              <AuthPage setToken={setToken} />
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </ThemeProvider>
  );
}

export default App;