<template>
  <div class="q-pa-sm">
    <div
      class="row"
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <div class="title">Paramètres</div>
      <q-btn
        flat
        round
        dense
        icon="eva-log-out-outline"
        @click="logOut()"
        v-if="isConnected"
        size="30px"
        style="color: white;"
      />
    </div>

    <div v-if="!isConnected" class="q-pa-lg">
      <div class="login-label">Connexion</div>

      <q-input
        v-model="inputPassword"
        class="inputPassword q-py-md"
        outlined
        @keyup.enter="checkConnection"
        :type="isPwd ? 'password' : 'text'"
        label="Password"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>

      <q-btn outline label="Valider" @click="checkConnection" color="purple" />
    </div>

    <div v-else>
      <q-separator />
      <EditPhotos />
      <div style="height: 30px" />
      <q-separator />
    </div>
  </div>
</template>

<script>
import EditPhotos from "src/components/EditPhotos.vue";
import utils from "src/helpers/utils.ts";
import { ref } from "vue";

export default {
  name: "PageConnexion",
  components: { EditPhotos },
  setup() {
    return {
      utils,
    };
  },
  data() {
    return {
      isConnected: false,
      inputPassword: "",
      isPwd: ref(true),
    };
  },

  methods: {
    checkConnection() {
      if (this.inputPassword == "") {
        utils.alert("Veuillez saisir un mot de passe");
      } else if (this.inputPassword != process.env.PASSWORD) {
        utils.alert("Le mot de passe est incorrect");
      } else {
        (this.isConnected = true), (this.inputPassword = "");
        utils.validate("Connexion réussie");
      }
    },

    logOut() {
      this.isConnected = false;
      this.isPwd = true;
      utils.validate("Déconnexion réussie");
    },
  },
};
</script>

<style>
.title {
  font-family: "calibri";
  font-size: 40px;
  color: white;
}

.login-label {
  font-family: "calibri";
  font-size: 30px;
  font-weight: 200;
  color: white;
}

.inputPassword {
  width: 30vw;
}
</style>
