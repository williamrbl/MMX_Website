<template>
  <q-page>
    <div>
      <q-img src="src/assets/Fond.jpg" style="position: sticky; height: 100vh">
        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <q-card
            class="bg-purple-9"
            style="
              width: 40vw;
              height: 35vh;
              opacity: 0.7;
              display: flex;
              justify-content: center;
              align-items: center;
            "
          >
            <h5 class="q-pa-md">Bienvenue sur le site de Musique Mix</h5>
          </q-card>
        </div>
      </q-img>
    </div>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "HomePage",
});
</script>

<style>
.welcome-text-style {
  font-family: "calibri";
  font-size: 100px;
}
</style>
