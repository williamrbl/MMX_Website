<template>
  <div class="row" style="display: flex; align-items: center">
    <q-btn
      round
      icon="eva-plus"
      style="border: 1px solid white"
      @click="isAddAdmin = true"
    />
    <div style="margin-left: 10px">Ajouter un administrateur</div>
  </div>

  <q-dialog v-model="isAddAdmin">
    <q-card class="card">
      <div class="header">Ajouter un administrateur</div>
      <div class="q-pa-md">
        <div class="row">
          <div class="col-4">
            <q-input label="Prénom" style="width: 80%" />
          </div>
          <div class="col-4">
            <q-input label="Nom" style="width: 80%" />
          </div>
          <div class="col-4">
            <q-select label="Rôle" :options="options" style="width: 80%" />
          </div>
        </div>
        <q-input label="Nom d'utilisateur" />
        <q-input label="Mot de passe" />
        <q-input label="Confirmer le mot de passe" />
      </div>
      <q-separator style="margin-top: 5px" />
      <div class="q-pa-sm" style="display: flex; justify-content: end">
        <q-btn outline color="purple" label="Annuler" @click="cancelAddAdmin" />
        <q-btn outline color="purple" label="Valider" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "AjouterAdmin",
  data() {
    return {
      isAddAdmin: false,
      options: [
        { label: "Président", value: "président" },
        { label: "Secrétaire", value: "secrétaire" },
        { label: "Trésorier", value: "trésorier" },
        { label: "Responsable", value: "responsable" },
        { label: "Autre", value: "autre" },
      ],
    };
  },
  methods: {
    cancelAddAdmin() {
      this.isAddAdmin = false;
    },
  },
};
</script>

<style scoped>
.card {
  width: 40vw;
}
</style>
