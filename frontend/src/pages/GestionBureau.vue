<template>
  <q-img :src="fond" class="taille-page">
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
            v-model="inputUsername"
            class="inputPassword q-py-md custom-text-color"
            outlined
            :type="text"
            label="Username"
            aria-label="Username"
            color="white"
            label-color="white"
            content-class="text-white"
          />
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

      <div v-else>
        <div class="row" v-show="isLargeScreen">
          <div class="sidebar col-3">
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
                    Gérez les locations de matériel
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                class="item"
                clickable
                v-ripple
                :class="{ 'selected-item': selectedPage === 'prestations' }"
                @click="selectedPage = 'prestations'"
                aria-label="Prestations"
              >
                <q-item-section>
                  <q-item-label>Prestations</q-item-label>
                  <q-item-label caption class="caption">
                    Gérez les prestations et personnalisez la page
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

              <!-- <q-item
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
              </q-item> -->

              <q-item
                class="item"
                clickable
                v-ripple
                :class="{ 'selected-item': selectedPage === 'connexions' }"
                @click="selectedPage = 'connexions'"
                aria-label="Connexions"
              >
                <q-item-section>
                  <q-item-label>Comptes</q-item-label>
                  <q-item-label caption class="caption">
                    Gérez les comptes
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col-9">
            <EditLocations
              ref="locationsComponent"
              v-if="selectedPage === 'locations'"
            />
            <EditPrestations
              ref="prestationsComponent"
              v-if="selectedPage === 'prestations'"
            />
            <EditPhotos
              ref="photosComponent"
              v-if="selectedPage === 'photos'"
            />
            <EditCaroussel
              ref="carousselComponent"
              v-if="selectedPage === 'caroussel'"
            />

            <!-- <EditStudio
              ref="studioComponent"
              v-if="selectedPage === 'studio'"
            />
            <TachesComponent
              ref="tachesComponent"
              v-if="selectedPage === 'taches'"
            /> -->
            <EditConnexions
              ref="connexionComponent"
              v-if="selectedPage === 'connexions'"
            />
          </div>
        </div>

        <div v-show="!isLargeScreen">
          <div style="display: flex; justify-content: center">
            <q-select
              v-model="selectedPage"
              :options="pages"
              emit-value
              outlined
              color="white"
              label="Tab"
              label-color="white"
              map-options
              dark
              style="
                max-width: 300px;
                margin-bottom: 2vh;
                margin-top: 3vh;
                width: 50vw;
              "
              behavior="menu"
            />
          </div>
          <q-separator color="white" style="margin-bottom: 2vh" />
          <div>
            <EditLocations
              ref="locationsComponent"
              v-if="selectedPage === 'locations'"
            />
            <EditPrestations
              ref="prestationsComponent"
              v-if="selectedPage === 'prestations'"
            />
            <EditPhotos
              ref="photosComponent"
              v-if="selectedPage === 'photos'"
            />
            <EditCaroussel
              ref="carousselComponent"
              v-if="selectedPage === 'caroussel'"
            />

            <!-- <TachesComponent
              ref="tachesComponent"
              v-if="selectedPage === 'taches'"
            />
            <EditConnexions
              ref="connexionComponent"
              v-if="selectedPage === 'connexions'"
            /> -->
            <EditConnexions
              ref="connexionComponent"
              v-if="selectedPage === 'connexions'"
            />
          </div>
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
import EditPrestations from "src/components/Prestations/EditPrestations.vue";
import TachesComponent from "src/components/Taches/TachesComponent.vue";
import EditConnexions from "src/components/Connexions/EditConnexions.vue";
import utils from "src/helpers/utils.ts";
import fond from "src/assets/Fond.jpg";

export default {
  name: "PageConnexion",
  components: {
    EditPhotos,
    EditCaroussel,
    EditLocations,
    EditPrestations,
    // EditStudio,
    // TachesComponent,
    EditConnexions,
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
        { label: "Prestations", value: "prestations" },
        { label: "Photos", value: "photos" },
        { label: "Caroussel", value: "caroussel" },
        // { label: "Studio", value: "studio" },
        // { label: "Tâches", value: "taches" },
        { label: "Comptes", value: "connexions" },
      ],
    };
  },
  watch: {
    "$q.screen.gt.sm"(newVal) {
      this.isLargeScreen = newVal;
    },
  },
  methods: {
    async checkConnection() {
      if (this.inputUsername === "" || this.inputPassword === "") {
        utils.alert("Veuillez saisir un nom d'utilisateur et un mot de passe");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("username", this.inputUsername);
        formData.append("password", this.inputPassword);

        const response = await fetch(`${process.env.VUE_APP_API}/connexion`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const token = await response.json();
          const expirationTime = new Date().getTime() + 3600 * 1000;
          localStorage.setItem(
            "authToken",
            JSON.stringify({ token, expirationTime })
          );
          this.isConnected = true;
          this.inputUsername = "";
          this.inputPassword = "";
          this.startTokenCheck();
        } else {
          utils.alert("Authentification incorrecte");
        }
      } catch (error) {
        utils.alert("Erreur lors de la connexion");
        this.isConnected = false;
      }
    },

    startTokenCheck() {
      this.tokenCheckInterval = setInterval(() => {
        const storedToken = JSON.parse(localStorage.getItem("authToken"));
        if (storedToken && new Date().getTime() > storedToken.expirationTime) {
          this.logOut();
          utils.alert("Votre session a expiré. Veuillez vous reconnecter.");
        }
      }, 1000 * 5 * 60);
    },

    logOut() {
      this.isConnected = false;
      localStorage.removeItem("authToken");
      clearInterval(this.tokenCheckInterval);
      //utils.alert("Vous avez été déconnecté.");
    },

    togglePasswordVisibility() {
      this.isPwd = !this.isPwd;
    },
  },

  mounted() {
    const storedToken = JSON.parse(localStorage.getItem("authToken"));
    if (storedToken && new Date().getTime() < storedToken.expirationTime) {
      this.isConnected = true;
      this.startTokenCheck();
    }
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

:deep(.text-white) .q-field__native {
  color: white !important;
}
</style>
