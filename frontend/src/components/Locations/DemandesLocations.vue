<template>
  <q-btn
    outline
    style="color: purple"
    label="Demandes de location"
    @click="isDemandes = true"
  />
  <q-dialog v-model="isDemandes">
    <q-card class="carte-demandes">
      <div class="header">Demandes de location</div>
      <div>fdjh</div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "DemandeLocations",
  data() {
    return {
      isDemandes: false,
    };
  },
};
</script>

<style scoped>
.header {
  background-color: purple;
  color: white;
}
.carte-demandes {
  width: 400px;
}
</style>
