// Configuration de l'app
// Modifie API_BASE_URL avec l'IP/URL de ton serveur cloud1

export const config = {
  // URL de l'API cloud1 - A MODIFIER selon ton environnement
  // En local: 'http://192.168.1.XXX:3000/api'
  // En production: 'https://ton-domaine.com/api'
  API_BASE_URL: 'http://192.168.1.100:3000/api',

  // Identifiant de l'application pour cloud1
  APP_ID: 'managementapp',

  // Timeout des requetes (en ms)
  REQUEST_TIMEOUT: 10000,
};

export default config;
