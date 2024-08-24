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
          size="20px"
          style="color: white"
        />
        <q-btn
          flat
          round
          dense
          icon="eva-log-out-outline"
          @click="logOut"
          v-if="isConnected"
          size="20px"
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
        <EditLocations ref="locationsComponent" />
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
import EditPhotos from "src/components/EditPhotos.vue";
import EditCaroussel from "src/components/EditCaroussel.vue";
import EditLocations from "src/components/EditLocations.vue";
import utils from "src/helpers/utils.ts";

export default {
  name: "PageConnexion",
  components: { EditPhotos, EditCaroussel, EditLocations },
  data() {
    return {
      isConnected: false,
      inputPassword: "",
      isPwd: true,
    };
  },
  methods: {
    checkConnection() {
      if (this.inputPassword === "") {
        utils.alert("Veuillez saisir un mot de passe");
      } else if (this.inputPassword !== process.env.PASSWORD) {
        utils.alert("Le mot de passe est incorrect");
      } else {
        this.isConnected = true;
        this.inputPassword = "";
        utils.validate("Connexion réussie");
      }
    },

    logOut() {
      this.isConnected = false;
      this.isPwd = true;
      utils.validate("Déconnexion réussie");
    },

    refreshPage() {
      if (
        this.$refs.photosComponent &&
        this.$refs.carousselComponent &&
        this.$refs.locationsComponent
      ) {
        this.$refs.locationsComponent.handleRefresh();
        this.$refs.photosComponent.handleRefresh();
        this.$refs.carousselComponent.handleRefresh();
      } else {
        utils.alert("Components not available.");
      }
    },

    togglePasswordVisibility() {
      this.isPwd = !this.isPwd;
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
