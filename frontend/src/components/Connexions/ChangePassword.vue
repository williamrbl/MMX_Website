<template>
  <q-btn
    outline
    label="Changer le mot de passe"
    @click="isChangePassword = true"
  />

  <q-dialog v-model="isChangePassword">
    <q-card class="card">
      <div class="header">Changement du mot de passe</div>
      <div class="q-pa-md" v-if="!isUser">
        <q-input
          label="Ancien mot de passe"
          v-model="inputCurrentPassword"
          @keydown.enter="checkCurrentPassword"
        />

        <div class="q-pa-sm" style="display: flex; justify-content: end">
          <q-btn
            outline
            color="purple"
            label="Annuler"
            @click="
              {
                inputCurrentPassword = '';
                isChangePassword = false;
              }
            "
          />
          <q-btn
            outline
            color="purple"
            label="Valider"
            @click="checkCurrentPassword"
          />
        </div>
      </div>
      <div class="q-pa-md" v-if="isUser">
        <q-input
          label="Nouveau mot de passe"
          v-model="newPassword"
          @keydown.enter="checkNewPassword"
        />
        <q-input
          label="Valider le nouveau mot de passe"
          v-model="newPasswordValidate"
          @keydown.enter="checkNewPassword"
        />

        <div class="q-pa-sm" style="display: flex; justify-content: end">
          <q-btn
            outline
            color="purple"
            label="Annuler"
            @click="
              {
                isUser = false;
                inputCurrentPassword = '';
                newPassword = '';
                newPasswordValidate = '';
                isChangePassword = false;
              }
            "
          />
          <q-btn
            outline
            color="purple"
            label="Valider"
            @click="checkNewPassword"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import utils from "src/helpers/utils.ts";
export default {
  name: "ChangePassword",
  setup() {
    return { utils };
  },
  data() {
    return {
      isChangePassword: false,
      inputCurrentPassword: "",
      isUser: false,
      newPassword: "",
      newPasswordValidate: "",
    };
  },
  methods: {
    checkCurrentPassword() {
      if (!this.inputCurrentPassword) {
        utils.alert("Veuillez entrer votre mot de passe actuel");
        return;
      }

      console.log("Checking");
      this.isUser = true;
    },

    checkNewPassword() {
      if (!this.newPassword || !this.newPasswordValidate) {
        utils.alert("Veuillez remplir toutes les informations");
        return;
      }

      if (this.newPassword != this.newPasswordValidate) {
        utils.alert("Les mots de passe entrés sont différents");
        return;
      }

      if (this.inputCurrentPassword == this.newPassword) {
        utils.alert("Veuillez saisir un mot de passe différent de l'ancien");
        return;
      }

      this.setNewPassword();
    },

    setNewPassword() {
      console.log("setNewPassword");
    },
  },
};
</script>

<style scoped>
.card {
  width: 40vw;
}
</style>
