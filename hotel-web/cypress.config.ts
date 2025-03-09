// cypress.config.ts

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Tu peux ajouter ici des écouteurs d'événements spécifiques si nécessaire
    },
    // Si tu veux spécifier des options globales pour les tests E2E
    baseUrl: 'http://localhost:5173', // Assure-toi que c'est l'URL de ton serveur de dev
    viewportWidth: 1280,
    viewportHeight: 720,
  },

  component: {
    // Utilisation de Vite pour servir le framework React
    devServer: {
      framework: 'react', // Framework React
      bundler: 'vite',    // Vite comme bundler
    },
    // Configurer la prise en charge des fichiers TSX
    specPattern: 'cypress/component/**/*.tsx',
  },

  // D'autres configurations globales
  video: false, // Si tu veux désactiver la capture vidéo
});
