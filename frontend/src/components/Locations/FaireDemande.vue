<template>
  <q-btn
    outline
    label="Faire une demande"
    style="color: purple"
    @click="isDemande = true"
  />

  <q-dialog v-model="isDemande">
    <q-card> Faire une demande </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "FaireDemande",
  data() {
    return {
      isDemande: false,
    };
  },
};
</script>
