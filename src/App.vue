<template>
  <div id="app" class="app-container landing-page">
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
.app-container {
  height: 100%;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
}

.app-container h1 {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 40px;
}

.app-main {
  padding: 10px;
  height: 100%;
}


</style>
