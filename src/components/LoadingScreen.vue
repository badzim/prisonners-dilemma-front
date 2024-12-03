<template>
    <div class="loading-screen">
      <div class="spinner"></div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoadingScreen',
  };
  </script>
  
  <style scoped>
  .loading-screen {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  
  .spinner {
    border: 8px solid var(--neutral-color);
    border-top: 8px solid var(--primary-color);
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  </style>
  