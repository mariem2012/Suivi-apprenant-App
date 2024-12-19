<template>
  <div class="container mt-5">
    <div class="text-center">
      <h1 class="fw-bold animated-title">Suivi des Apprenants</h1>
      <p class="lead">Suivez les progrès de vos apprenants et gérez leur parcours facilement.</p>
    </div>
    <div class="text-center mt-4">
      <div id="carouselExampleSlidesOnly" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="/src/assets/img1.jpg" class="d-block w-100" alt="Image 1" />
          </div>
          <div class="carousel-item">
            <img src="/src/assets/img2.jpg" class="d-block w-100" alt="Image 2" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.carousel-item img {
  height: 450px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.text-center {
  padding: 20px;
}

h1 {
  font-size: 3rem;
  color: #333;
  margin-bottom: 10px;
  font-family: 'Arial', sans-serif;
}

h1.animated-title {
  position: relative;
  display: inline-block;
}

h1.animated-title::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 4px;
  background-color: #007bff;
  transform: scaleX(0);
  transform-origin: bottom right;
  transition: transform 0.4s ease-out;
}

h1.animated-title:hover::before {
  transform: scaleX(1);
  transform-origin: bottom left;
}

p.lead {
  font-size: 1.2rem;
  color: #555;
  font-family: 'Arial', sans-serif;
  margin-bottom: 10px;
}

.carousel-inner {
  border-radius: 10px;
  overflow: hidden;
}
</style>
