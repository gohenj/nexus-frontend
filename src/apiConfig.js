// src/apiConfig.js

// O Vercel vai dar-nos esta variável.
// Se não existir, (localmente) ele usa o localhost.
const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

export default backendURL;