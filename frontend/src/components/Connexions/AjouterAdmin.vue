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
            <q-input label="Prénom" style="width: 80%" v-model="prenom" />
          </div>
          <div class="col-4">
            <q-input label="Nom" style="width: 80%" v-model="nom" />
          </div>
          <div class="col-4">
            <q-select
              label="Rôle"
              :options="options"
              style="width: 80%"
              v-model="role"
            />
          </div>
        </div>
        <q-input label="Nom d'utilisateur" v-model="username" />
        <q-input label="Mot de passe" v-model="password" />
        <q-input label="Confirmer le mot de passe" v-model="passwordVerif" />
      </div>
      <q-separator style="margin-top: 5px" />
      <div class="q-pa-sm" style="display: flex; justify-content: end">
        <q-btn outline color="purple" label="Annuler" @click="cancelAddAdmin" />
        <q-btn outline color="purple" label="Valider" @click="addAdmin" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import utils from "src/helpers/utils.ts";
import SpinnerComponent from "../Other/SpinnerComponent.vue";
import { Loading } from "quasar";
export default {
  name: "AjouterAdmin",
  emits: ["update-comptes"],
  setup() {
    return { utils };
  },
  data() {
    return {
      isAddAdmin: false,
      prenom: "",
      nom: "",
      role: "",
      options: [
        { label: "Président", value: "Président" },
        { label: "Secrétaire", value: "Secrétaire" },
        { label: "Trésorier", value: "Trésorier" },
        { label: "Responsable", value: "Responsable" },
        { label: "Autre", value: "Autre" },
      ],
      username: "",
      password: "",
      passwordVerif: "",
    };
  },
  methods: {
    cancelAddAdmin() {
      this.isAddAdmin = false;
      this.prenom = "";
      this.nom = "";
      this.role = "";
      this.username = "";
      this.password = "";
      this.passwordVerif = "";
    },

    async addAdmin() {
      if (
        !this.prenom ||
        !this.nom ||
        !this.role ||
        !this.username ||
        !this.password ||
        !this.passwordVerif
      ) {
        utils.alert("Veuillez entrer toutes les informations");
      } else if (this.password != this.passwordVerif) {
        utils.alert("Les mots de passe sont différents");
      } else {
        const formData = new FormData();
        formData.append("prenom", this.prenom);
        formData.append("nom", this.nom);
        formData.append("role", this.role.value);
        formData.append("username", this.username);
        formData.append("password", this.password);

        try {
          Loading.show({ spinner: SpinnerComponent });
          const response = await fetch(`${process.env.VUE_APP_API}/addAdmin`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          this.cancelAddAdmin();
          this.$emit("update-comptes");
          Loading.hide();
        } catch (error) {
          console.error("Error adding admin:", error);
        }
      }
    },
  },
};
</script>

<style scoped>
.card {
  width: 40vw;
}
</style>
