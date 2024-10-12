<template>
  <q-btn
    outline
    label="Changer le mot de passe"
    @click="isChangePassword = true"
  />

  <q-dialog v-model="isChangePassword">
    <q-card class="card">
      <div class="header">Changement du mot de passe de {{ username }}</div>
      <div class="q-pa-md" v-if="!isUser">
        <q-input
          v-model="inputCurrentPassword"
          filled
          :type="isPwd ? 'password' : 'text'"
          label="Ancien mot de passe"
          @keyup.enter="handleEnter"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <div class="q-pa-sm" style="display: flex; justify-content: end">
          <q-btn
            outline
            color="purple"
            label="Annuler"
            @click="
              {
                inputCurrentPassword = '';
                isChangePassword = false;
                isPwd = true;
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
          v-model="newPassword"
          filled
          :type="isPwd ? 'password' : 'text'"
          label="Nouveau mot de passe"
          @keydown.enter="checkNewPassword"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-input
          v-model="newPasswordValidate"
          filled
          :type="isPwd ? 'password' : 'text'"
          label="Valider le nouveau mot de passe"
          @keydown.enter="checkNewPassword"
          style="margin-top: 20px"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <div
          class="q-pa-sm"
          style="display: flex; justify-content: end; margin-top: 10px"
        >
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
import SpinnerComponent from "../Other/SpinnerComponent.vue";
import { Loading } from "quasar";
export default {
  name: "ChangePassword",
  emits: ["update-accounts"],
  setup() {
    return { utils };
  },
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isChangePassword: false,
      inputCurrentPassword: "",
      isUser: false,
      newPassword: "",
      newPasswordValidate: "",
      isPwd: true,
    };
  },
  methods: {
    handleEnter() {
      this.checkCurrentPassword();
      this.isPwd = true;
    },
    async checkCurrentPassword() {
      if (!this.inputCurrentPassword) {
        utils.alert("Veuillez entrer votre mot de passe actuel");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("username", this.username);
        formData.append("password", this.inputCurrentPassword);

        const response = await fetch(
          `${process.env.VUE_APP_API}/checkOldPassword`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        } else {
          this.isUser = true;
        }
      } catch (error) {
        utils.alert("Authentification incorrecte");
        console.log(`Erreur lors de la connexion: ${error.message}`);
        this.isUser = false;
      }
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

    async setNewPassword() {
      this.isPwd = true;
      try {
        const formData = new FormData();
        formData.append("username", this.username);
        formData.append("password", this.newPassword);
        Loading.show({ spinner: SpinnerComponent });
        const response = await fetch(
          `${process.env.VUE_APP_API}/setNewPassword`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        this.$emit("update-accounts");
        this.newPassword = "";
        this.newPasswordValidate = "";
        this.isChangePassword = false;
        this.inputCurrentPassword = "";
        this.isUser = false;
        Loading.hide();
      } catch (error) {
        console.log("Error fetching accounts:", error);
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
