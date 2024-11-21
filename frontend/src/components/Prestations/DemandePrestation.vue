<template>
  <q-btn
    outline
    color="purple"
    label="Voir la demande"
    @click="isVisuDemande = true"
  />

  <q-dialog v-model="isVisuDemande">
    <q-card style="width: 30%">
      <div class="header">Demande de prestation</div>
      <div class="q-pa-md">
        <div>
          <div>Association: {asso}</div>
          <div>Date: {date}</div>
          <div>Description de l'événement: {description}</div>
        </div>
        <div style="display: flex; justify-content: end">
          <q-btn outline dense color="purple" label="Refuser" />
          <q-btn outline dense color="purple" label="Accepter" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "DemandePrestation",
  data() {
    return {
      isVisuDemande: false,
    };
  },
};
</script>
