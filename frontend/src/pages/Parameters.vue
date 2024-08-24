<template>
  <div
    class="q-pa-sm row"
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

      <q-btn outline label="Valider" @click="checkConnection" color="purple" />
    </div>

    <div v-else class="row">
      <div class="col-2">
        <q-list
          class="q-pa-md"
          padding
          style="height: 100%; border-right: 2px solid purple"
        >
          <q-item
            class="item"
            clickable
            v-ripple
            :class="{ 'selected-item': selectedPage === 'locations' }"
            @click="selectedPage = 'locations'"
          >
            <q-item-section>
              <q-item-label>Locations</q-item-label>
              <q-item-label caption
                >Gérez les locations de SoundBoks</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item
            class="item"
            clickable
            v-ripple
            :class="{ 'selected-item': selectedPage === 'photos' }"
            @click="selectedPage = 'photos'"
          >
            <q-item-section>
              <q-item-label>Photos</q-item-label>
              <q-item-label caption>Mettez à jour l'album photo</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            class="item"
            clickable
            v-ripple
            :class="{ 'selected-item': selectedPage === 'caroussel' }"
            @click="selectedPage = 'caroussel'"
          >
            <q-item-section>
              <q-item-label>Caroussel</q-item-label>
              <q-item-label caption
                >Mettez à jour le caroussel de la page d'accueil</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="col-10 q-pa-md">
        <EditLocations
          ref="locationsComponent"
          v-if="selectedPage === 'locations'"
        />
        <EditPhotos ref="photosComponent" v-if="selectedPage === 'photos'" />
        <EditCaroussel
          ref="carousselComponent"
          v-if="selectedPage === 'caroussel'"
        />
      </div>
    </div>
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
      selectedPage: "",
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
  margin-bottom: 10px;
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

.item {
  color: white;
  margin-top: 5px;
  margin-bottom: 5px;
}

.selected-item {
  background-color: rgba(128, 0, 128, 0.3);
  color: white;
  border-radius: 5px;
}
</style>
