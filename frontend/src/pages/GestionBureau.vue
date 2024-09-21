<template>
  <q-img :src="fond" style="height: 80vh">
    <div style="width: 100%; height: 100%">
      <div
        class="col-12 row align-items-center"
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <div class="title">Espace bureau</div>
        <div v-if="isConnected">
          <q-btn
            flat
            round
            dense
            icon="eva-log-out-outline"
            @click="logOut"
            size="20px"
            class="logout-btn"
            aria-label="Log out"
          />
        </div>
      </div>

      <div v-if="!isConnected" class="col-12 q-pa-md">
        <div class="login-label">Connexion</div>
        <q-form @submit.prevent="checkConnection">
          <q-input
            v-model="inputPassword"
            class="inputPassword q-py-md custom-text-color"
            outlined
            :type="isPwd ? 'password' : 'text'"
            label="Password"
            autocomplete="new-password"
            aria-label="Password"
            color="white"
            label-color="white"
            content-class="text-white"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="togglePasswordVisibility"
                style="color: white"
                aria-label="Toggle password visibility"
              />
            </template>
          </q-input>

          <q-btn
            outline
            label="Valider"
            color="white"
            style="margin-left: 10px"
            type="submit"
            aria-label="Submit"
          />
        </q-form>
      </div>

      <div v-else class="col-12 row" style="height: 100%">
        <div class="sidebar col-md-3" v-show="isLargeScreen">
          <q-list padding class="q-pa-md side-bar">
            <q-item
              class="item"
              clickable
              v-ripple
              :class="{ 'selected-item': selectedPage === 'locations' }"
              @click="selectedPage = 'locations'"
              aria-label="Locations"
            >
              <q-item-section>
                <q-item-label>Locations</q-item-label>
                <q-item-label caption class="caption">
                  Gérez les locations de SoundBoks
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              class="item"
              clickable
              v-ripple
              :class="{ 'selected-item': selectedPage === 'photos' }"
              @click="selectedPage = 'photos'"
              aria-label="Photos"
            >
              <q-item-section>
                <q-item-label>Photos</q-item-label>
                <q-item-label caption class="caption">
                  Mettez à jour l'album photo
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              class="item"
              clickable
              v-ripple
              :class="{ 'selected-item': selectedPage === 'caroussel' }"
              @click="selectedPage = 'caroussel'"
              aria-label="Caroussel"
            >
              <q-item-section>
                <q-item-label>Caroussel</q-item-label>
                <q-item-label caption class="caption">
                  Mettez à jour le caroussel de la page d'accueil
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              class="item"
              clickable
              v-ripple
              :class="{ 'selected-item': selectedPage === 'studio' }"
              @click="selectedPage = 'studio'"
              aria-label="Studio"
            >
              <q-item-section>
                <q-item-label>Studio</q-item-label>
                <q-item-label caption class="caption">
                  Gérez les réservations du studio
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              class="item"
              clickable
              v-ripple
              :class="{ 'selected-item': selectedPage === 'taches' }"
              @click="selectedPage = 'taches'"
              aria-label="TachesComponent"
            >
              <q-item-section>
                <q-item-label>Tâches</q-item-label>
                <q-item-label caption class="caption">
                  Gérez les tâches à faire
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="col-12 q-pa-md" v-show="!isLargeScreen" style="height: 5vw">
          <q-select
            v-model="selectedPage"
            :options="pages"
            class="my-custom-select"
            emit-value
            outlined
            color="white"
            label="Tab"
            label-color="white"
            map-options
            dark
            style="max-width: 300px"
            behavior="menu"
          />
        </div>

        <div class="col-md-9">
          <EditLocations
            ref="locationsComponent"
            v-if="selectedPage === 'locations'"
          />
          <EditPhotos ref="photosComponent" v-if="selectedPage === 'photos'" />
          <EditCaroussel
            ref="carousselComponent"
            v-if="selectedPage === 'caroussel'"
          />
          <EditStudio ref="studioComponent" v-if="selectedPage === 'studio'" />
          <TachesComponent
            ref="tachesComponent"
            v-if="selectedPage === 'taches'"
          />
        </div>
      </div>
    </div>
  </q-img>
</template>

<script>
import EditPhotos from "src/components/Photos/EditPhotos.vue";
import EditCaroussel from "src/components/Caroussel/EditCaroussel.vue";
import EditLocations from "src/components/Locations/EditLocations.vue";
import EditStudio from "src/components/Studio/EditStudio.vue";
import TachesComponent from "src/components/Taches/TachesComponent.vue";
import utils from "src/helpers/utils.ts";
import fond from "src/assets/Fond.jpg";

export default {
  name: "PageConnexion",
  components: {
    EditPhotos,
    EditCaroussel,
    EditLocations,
    EditStudio,
    TachesComponent,
  },
  data() {
    return {
      fond,
      isConnected: false,
      inputUsername: "",
      inputPassword: "",
      isPwd: true,
      selectedPage: "locations",
      isLargeScreen: this.$q.screen.gt.sm,
      pages: [
        { label: "Locations", value: "locations" },
        { label: "Photos", value: "photos" },
        { label: "Caroussel", value: "caroussel" },
        { label: "Studio", value: "studio" },
        { label: "Tâches", value: "taches" },
      ],
    };
  },
  watch: {
    "$q.screen.gt.sm"(newVal) {
      this.isLargeScreen = newVal;
    },
  },
  methods: {
    checkConnection() {
      if (this.inputPassword === "") {
        utils.alert("Veuillez saisir un mot de passe");
      } else if (this.inputPassword !== process.env.VUE_APP_PASSWORD) {
        utils.alert("Le mot de passe est incorrect");
      } else {
        this.isConnected = true;
        this.inputPassword = "";
      }
    },

    logOut() {
      this.isConnected = false;
      this.isPwd = true;
    },

    togglePasswordVisibility() {
      this.isPwd = !this.isPwd;
    },
  },
};
</script>

<style scoped>
.title {
  font-family: Arupala Grotesk Ultra;
  font-size: 2rem;
  color: white;
  margin-left: 10px;
}

.login-label {
  font-family: Aileron Bold;
  font-size: 1.875rem;
  font-weight: 200;
  color: white;
  margin-left: 10px;
}

.inputPassword {
  width: 100%;
  max-width: 500px;
  margin-left: 10px;
}

.inputUsername {
  width: 100%;
  max-width: 500px;
  margin-left: 10px;
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

@media (min-width: 768px) {
  .inputPassword {
    width: 30vw;
  }
}

@media (max-width: 767px) {
  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 2px solid white;
  }
}

.side-bar {
  @media (min-width: 767px) {
    border-right: 2px solid purple;
    height: 60vh;
    width: 20vw;
  }
}

.logout-btn {
  color: white;
}

.caption {
  color: white;
  opacity: 0.7;
}

::v-deep .text-white .q-field__native {
  color: white !important;
}
</style>
