<template>
  <div
    class="q-pa-sm"
    style="display: flex; flex-direction: column; height: 100vh"
  >
    <div
      class="row"
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <div class="title">Paramètres</div>
      <div>
        <q-btn
          flat
          round
          dense
          icon="eva-refresh-outline"
          @click="refreshPage"
          v-if="isConnected"
          size="30px"
          style="color: white"
        />
        <q-btn
          flat
          round
          dense
          icon="eva-log-out-outline"
          @click="logOut"
          v-if="isConnected"
          size="30px"
          style="color: white"
        />
      </div>
    </div>

    <q-scroll-area style="flex: 1; overflow: auto">
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
              @click="togglePasswordVisibility"
            />
          </template>
        </q-input>

        <q-btn
          outline
          label="Valider"
          @click="checkConnection"
          color="purple"
        />
      </div>

      <div v-else>
        <q-separator />
        <EditPhotos ref="photosComponent" />
        <div style="height: 30px" />
        <q-separator />
        <EditCaroussel ref="carousselComponent" />
        <div style="height: 30px" />
        <q-separator />
      </div>
    </q-scroll-area>
  </div>
</template>

<script>
import { ref } from "vue";
import EditPhotos from "src/components/EditPhotos.vue";
import EditCaroussel from "src/components/EditCaroussel.vue";
import utils from "src/helpers/utils.ts";

export default {
  name: "PageConnexion",
  components: { EditPhotos, EditCaroussel },
  setup() {
    const isConnected = ref(false);
    const inputPassword = ref("");
    const isPwd = ref(true);

    const checkConnection = () => {
      if (inputPassword.value === "") {
        utils.alert("Veuillez saisir un mot de passe");
      } else if (inputPassword.value !== process.env.PASSWORD) {
        utils.alert("Le mot de passe est incorrect");
      } else {
        isConnected.value = true;
        inputPassword.value = "";
        utils.validate("Connexion réussie");
      }
    };

    const logOut = () => {
      isConnected.value = false;
      isPwd.value = true;
      utils.validate("Déconnexion réussie");
    };

    const refreshPage = () => {
      // Access components using refs
      this.$refs.carousselComponent.handleRefresh();
      this.$refs.photosComponent.handleRefresh();
    };

    const togglePasswordVisibility = () => {
      isPwd.value = !isPwd.value;
    };

    return {
      isConnected,
      inputPassword,
      isPwd,
      checkConnection,
      logOut,
      refreshPage,
      togglePasswordVisibility,
    };
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
