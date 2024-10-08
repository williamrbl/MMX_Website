<template>
  <div class="spinner-container">
    <img :src="logo" alt="Loading" class="loading-logo" />
  </div>
</template>

<script>
import logo from "src/assets/Logo.png";
export default {
  name: "SpinnerComponent",
  data() {
    return {
      logo,
    };
  },
};
</script>
<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.loading-logo {
  animation: rotate 1s linear infinite;
  width: 50px;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
