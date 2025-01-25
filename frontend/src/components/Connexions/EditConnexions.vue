<template>
  <div class="row q-px-lg">
    <div class="section-title col-4">Comptes</div>

    <div class="around">
      <div class="utilisateur utilisateur-header">
        <div class="header-item large-screen-only">Prénom</div>
        <div class="header-item large-screen-only">Nom</div>
        <div class="header-item large-screen-only">Rôle</div>
        <div class="header-item">Username</div>
        <div class="header-item">Mot de passe</div>
        <div class="header-item">Suppression de compte</div>
      </div>
      <q-scroll-area class="custom-scroll-area q-pa-md">
        <div v-for="compte in comptes" :key="compte.username">
          <div class="utilisateur">
            <div class="utilisateur-item large-screen-only">
              {{ compte.prenom }}
            </div>
            <div class="utilisateur-item large-screen-only">
              {{ compte.nom }}
            </div>
            <div class="utilisateur-item large-screen-only">
              {{ compte.role }}
            </div>
            <div class="utilisateur-item">{{ compte.username }}</div>
            <ChangePassword
              class="utilisateur-item"
              @update-accounts="getAccounts"
              :username="compte.username"
              :password="compte.password"
            />
            <q-btn
              flat
              dense
              class="utilisateur-item"
              icon="eva-trash-outline"
              @click="handleTrashClick(compte.username)"
            />
          </div>
          <q-separator color="white" />
        </div>

        <div class="add-admin">
          <AjouterAdmin @update-comptes="getAccounts" />
        </div>
      </q-scroll-area>
    </div>
  </div>

  <q-dialog v-model="isDelete">
    <q-card class="delete-admin-card">
      <div class="header">Suppression de compte</div>
      <div class="q-pa-md">
        Voulez vous supprimer le compte de {{ clickedUsername }} ?
      </div>
      <q-separator />
      <div class="q-pa-md" style="display: flex; justify-content: end">
        <q-btn
          outline
          color="purple"
          label="Annuler"
          @click="
            {
              clickedUsername = '';
              isDelete = false;
            }
          "
        />
        <q-btn
          outline
          color="purple"
          label="Valider"
          @click="removeAccount(clickedUsername)"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import ChangePassword from "./ChangePassword.vue";
import AjouterAdmin from "./AjouterAdmin.vue";
import SpinnerComponent from "../Other/SpinnerComponent.vue";
import { Loading } from "quasar";
import utils from "src/helpers/utils.ts";

export default {
  name: "EditConnexions",
  components: { ChangePassword, AjouterAdmin },
  data() {
    return {
      comptes: [],
      isDelete: false,
      clickedUsername: "",
    };
  },
  methods: {
    async getAccounts() {
      try {
        Loading.show({ spinner: SpinnerComponent });
        const response = await fetch(`${process.env.VUE_APP_API}/getAccounts`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        this.comptes = await response.json();
        Loading.hide();
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    },

    handleTrashClick(username) {
      this.isDelete = true;
      this.clickedUsername = username;
    },

    async removeAccount(username) {
      if (this.comptes.length === 1 && this.comptes[0].username === username) {
        utils.alert("Vous ne pouvez pas supprimer tous les comptes");
        this.isDelete = false;
        return;
      }
      const accountToRemove = this.comptes.find(
        (compte) => compte.username === username
      );
      if (accountToRemove && accountToRemove.role === "Modérateur") {
        utils.alert("Vous ne pouvez pas retirer le compte d'un modérateur");
        this.isDelete = false;
        return;
      }
      try {
        const formData = new FormData();
        formData.append("username", username);
        Loading.show({ spinner: SpinnerComponent });
        const response = await fetch(`${process.env.VUE_APP_API}/removeAdmin`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        this.getAccounts();
        this.clickedUsername = "";
        this.isDelete = false;
        Loading.hide();
      } catch (error) {
        console.log("Error fetching accounts:", error);
      }
    },
  },
  mounted() {
    this.getAccounts();
  },
};
</script>

<style scoped>
.around {
  border: 1px solid white;
  border-radius: 10px;
  height: 60vh;
  width: 100%;
  @media (max-width: 767px) {
    height: 50vh;
  }
}

.utilisateur {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  align-items: center;
  padding: 12px;
  gap: 10px;
  @media (max-width: 767px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.utilisateur-header {
  font-weight: bold;
  border-bottom: 2px solid white;
  padding-bottom: 13px;
  background-color: purple;
  border-radius: 10px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  @media (max-width: 767px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.header-item,
.utilisateur-item {
  text-align: center;
}

.add-admin {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.custom-scroll-area {
  width: 100%;
  height: 54vh;
  @media (max-width: 767px) {
    height: 43vh;
  }
  border-radius: 10px;
}
</style>
