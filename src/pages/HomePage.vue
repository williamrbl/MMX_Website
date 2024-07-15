<template>
  <q-page>
    <q-img src="src/assets/Fond.jpg" style="position: sticky; height: 100vh">
      <div style="display: flex; justify-content: center; align-items: center">
        <q-card
          class="bg-purple-9"
          style="
            width: 40vw;
            height: 35vh;
            opacity: 0.8;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <h5 class="q-pa-md">Bienvenue sur le site de Musique Mix</h5>
        </q-card>
      </div>
    </q-img>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "HomePage",
});
</script>

<style scoped>
.welcome-text-style {
  font-family: "calibri";
  font-size: 100px;
}
</style>
