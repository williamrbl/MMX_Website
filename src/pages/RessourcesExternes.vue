<template>
  <q-page>
    <h2 style="font-weight: 400; font-family: Helvetica; color:white">Liens MMX</h2>
    <div style="display: flex; justify-content: center">
      <q-card class="bg-purple-8 q-pa-md" style="width: 50%">
        <h4 style="color: white">Vidéos Arena 2024</h4>
        <div style="display: flex; justify-content: center;">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/yT9BTGj3i6w"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "RessoucesExternes",
});
</script>
