<template>
  <q-page>
    <q-card class="my-card bg-purple-5">
      <img src="https://www.aleou.fr/xusers/ximg/wsuppliers/25186/min/a1153433.webp">

      <q-card-section>
        <div class="text-h6 text-white">Arena 2024</div>
      </q-card-section>

      <q-card-section class="text-white q-pt-none">
        23 Avril 2024
      </q-card-section>

      <q-card-actions>
        <q-btn flat color="white" label="Voir les photos" />
      </q-card-actions>

    </q-card>
  </q-page>
</template>

<script setup>
defineOptions({
  name: 'PhotoPage'
});
</script>

<style>
.my-card{
  width: 100%;
  max-width: 250px;
}
</style>
