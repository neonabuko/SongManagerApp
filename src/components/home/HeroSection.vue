<template>
  <div class="hero">
    <div class="hero-content">
      <h1>Welcome to ScoreHub</h1>
      <p>Your one-stop platform for discovering, sharing, and collaborating on music scores.</p>
      <router-link class="get-started" to="/scores">Get Started</router-link>
    </div>
  </div>
</template>

<style scoped>
.hero {
  background: url('https://fabric-yard.co.uk/cdn/shop/products/sheetmusic4_1_1024x.jpg?v=1684995818') no-repeat center center;
  background-size: cover;
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.742);
}

.hero-content {
  position: relative;
  text-align: center;
  color: rgb(255, 255, 255);
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 20px;
}

.hero-content p {
  font-size: 1.5rem;
  margin-bottom: 30px;
}

.get-started {
  text-decoration: none;
  font-size: 1.2rem;
  background: #3498db;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.get-started:hover {
  background: #2980b9;
}
</style>
