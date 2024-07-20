<template>
  <q-page class="flex flex-center">
    <q-img src="src/assets/Fond.jpg">
      <div
        class="row q-px-xl"
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        "
      >
        <q-card style="background: #800b95">
          <h6>Tarifs</h6>
        </q-card>
        <q-card class="q-pa-md col" style="background: #800b95">
          <q-input
            color="white"
            label="Locataire"
            label-color="white"
            style="color: white; color-scheme: white"
          />
          <br /><br />
          <q-input
            color="white"
            label-color="white"
            style="color: white; color-scheme: white"
            label="Date Début"
          />
          <br /><br />
          <q-input
            label="Date Fin"
            color="white"
            label-color="white"
            style="color: white; color-scheme: white"
          />
          <q-btn label="Envoyer la demande" />
        </q-card>
        <q-date v-model="days" range multiple />
      </div>
    </q-img>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "LocationPage",
});
</script>
