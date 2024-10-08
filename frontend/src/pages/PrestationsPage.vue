<template>
  <q-img :src="fond" class="height-image" style="object-fit: cover">
    <div style="width: 100%; height: 100%">
      <div
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        "
      >
        <q-scroll-area
          class="scroll-area"
          :visible="false"
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
          "
        >
          <div class="titre-demandes">Demandes de prestation</div>

          <div
            class="q-pa-md large-screen-only"
            style="
              width: 100%;
              height: 50vh;
              display: flex;
              align-items: center;
              justify-content: center;
            "
            v-if="imagesHaut.length > 0"
          >
            <div
              class="row q-gutter-x-md"
              style="
                height: 100%;
                width: 100%;
                overflow: hidden;
                display: flex;
                align-items: center;
              "
            >
              <div
                v-for="image in imagesHaut"
                :key="image._id"
                class="image-container col"
                style="max-height: 100%"
              >
                <q-img
                  :src="image.photo"
                  alt="Image"
                  style="max-width: 100%; max-height: 100%"
                />
              </div>
            </div>
          </div>

          <div
            class="small-screen-only"
            v-if="imagesHaut.length > 0"
            style="
              width: 90vw;
              height: 20vh;
              display: flex;
              align-items: stretch;
              justify-content: center;
            "
          >
            <q-carousel
              swipeable
              arrows
              navigation
              animated
              v-model="slide"
              infinite
              style="height: 100%"
            >
              <q-carousel-slide
                v-for="(image, index) in imagesHaut"
                :key="image._id"
                :name="index"
                :img-src="image.photo"
              />
            </q-carousel>
          </div>

          <div class="description-text" style="margin-top: 3vh">
            {{ texte }}
          </div>

          <div class="card-demande" style="margin: 2vh auto">
            <div class="text" style="margin-bottom: 10px">
              Demande d'évènement
            </div>
            <q-separator />
            <div style="margin-top: 16px; width: 100%">
              <q-input
                v-model="organisateur"
                dark
                color="white"
                label="Organisateur de l'évènement"
              />
              <q-input
                v-model="mail"
                dark
                color="white"
                label="Email de l'organisateur"
              />
              <q-input
                v-model="lieu"
                dark
                color="white"
                label="Lieu de l'évènement"
              />
              <div style="display: flex; align-items: center; margin-top: 10px">
                <q-btn
                  round
                  @click="isSelectDate = true"
                  icon="eva-calendar-outline"
                  style="background-color: white; color: purple"
                />
                <div style="margin-left: 5px">
                  Date : {{ utils.formatDate(selectedDate) }}
                </div>
              </div>

              <q-dialog v-model="isSelectDate" class="col">
                <q-date v-model="selectedDate" class="row" />
                <q-btn
                  label="Valider"
                  @click="isSelectDate = false"
                  class="row validate-btn"
                />
              </q-dialog>

              <q-input
                v-model="description"
                filled
                type="textarea"
                label="Description de l'évènement"
                color="white"
                class="description-input"
                dark
                style="margin-top: 10px"
              />
              <div class="centered" style="margin-top: 10px">
                <q-btn
                  label="Valider"
                  class="validate-btn"
                  @click="createDemande()"
                />
              </div>
            </div>
          </div>
          <q-card class="top-img-container centered">
            <div
              class="q-pa-md"
              style="
                width: 90vw;
                height: 30vh;
                display: flex;
                align-items: stretch;
                justify-content: center;
              "
              v-if="imagesBas.length > 0"
            >
              <div
                class="centered row q-gutter-md"
                style="height: 100%; width: 100%"
              >
                <div
                  v-for="image in imagesBas"
                  :key="image._id"
                  class="image-container col"
                >
                  <q-img
                    :src="image.photo"
                    alt="Image"
                    style="width: 100%; height: 100%"
                  />
                </div>
              </div>
            </div>
          </q-card>
        </q-scroll-area>
      </div>
    </div>
  </q-img>
</template>

<script>
import fond from "src/assets/Fond.jpg";
import utils from "src/helpers/utils.ts";
import { ref } from "vue";
import { Loading } from "quasar";
import SpinnerComponent from "src/components/Other/SpinnerComponent.vue";
export default {
  name: "PrestationsPage",
  setup() {
    return {
      utils,
      slide: ref(0),
    };
  },
  data() {
    return {
      fond,
      organisateur: "",
      lieu: "",
      isSelectDate: false,
      description: "",
      selectedDate: new Date(),
      mail: "",
      images: [],
      texte: "",
    };
  },
  methods: {
    async createDemande() {
      const isDatePassed = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date.getTime() < today.getTime();
      };
      if (!this.organisateur || !this.lieu || !this.description || !this.mail) {
        utils.alert("Veuillez remplir toutes les informations");
      } else if (
        this.selectedDate instanceof Date &&
        this.selectedDate.setHours(0, 0, 0, 0) ===
          new Date().setHours(0, 0, 0, 0)
      ) {
        utils.alert("Impossible de demander un événement pour le jour même");
      } else if (
        this.selectedDate instanceof Date &&
        isDatePassed(this.selectedDate)
      ) {
        utils.alert("La date sélectionnée est déjà passée");
      } else {
        Loading.show({
          spinner: SpinnerComponent,
        });
        const formData = new FormData();
        formData.append("organisateur", this.organisateur);
        formData.append("mail", this.mail);
        formData.append("lieu", this.lieu);
        formData.append("date", this.selectedDate);
        formData.append("description", this.description);

        try {
          const response = await fetch(
            `${process.env.VUE_APP_API}/createDemande`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          this.organisateur = "";
          this.mail = "";
          this.lieu = "";
          this.selectedDate = new Date();
          this.description = "";
          Loading.hide();
          utils.validate("Demande de prestation envoyée !");
        } catch (error) {
          console.log("Impossible de créer la demande : ", error);
        }
      }
    },
    async getImages() {
      try {
        const response = await fetch(
          process.env.VUE_APP_API + "/getImagesPrestations",
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        this.images = data;
        this.isAddImage = false;
        this.uploadImage = {};
      } catch (error) {
        console.log(`Erreur lors de l'ajout de l'image': ${error.message}`);
      }
    },
    async getDescription() {
      try {
        const response = await fetch(
          process.env.VUE_APP_API + "/getDescription",
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const res = await response.json();
        this.texte = res[0].texte;
      } catch (error) {
        console.log(
          "Erreur lors de la récupération de la description : ",
          error.message
        );
      }
    },
  },

  async mounted() {
    await this.getImages();
    await this.getDescription();
  },

  computed: {
    imagesHaut() {
      return this.images.filter((image) => image.photo.includes("haut"));
    },
    imagesBas() {
      return this.images.filter((image) => image.photo.includes("bas"));
    },
  },
};
</script>

<style scoped>
.height-image {
  width: 100%;
  height: 100vh;
}

.titre-demandes {
  font-family: Arupala Grotesk Ultra;
  color: white;
  z-index: 1;
  font-size: 3vh;
  margin-bottom: 1vh;
  font-size: 35px;
}

.scroll-area {
  height: 75vh;
  width: 100%;
  max-width: 90vw;

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge, and Firefox */
  .no-scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
}

.image {
  padding: 16px;
  background-color: aqua;
  height: 100%;
}

.centered.row {
  height: 100%;
}

.text {
  color: white;
  font-family: Aileron Bold;
  font-size: 30px;
}

.description-input {
  color: white;
}

.validate-btn {
  background-color: white;
  color: purple;
  border-radius: 10px;
}

.card-demande {
  padding: 16px;
  width: 80vw;
  background-color: purple;
  border-radius: 10px;
  margin: 2vh auto;

  @media (min-width: 767px) {
    width: 40vw;
  }
}

.description-text {
  font-size: 30px;
  font-family: Aileron Bold;
  @media (max-width: 767px) {
    font-size: 20px;
  }
}

.image-container {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
}

.top-img-container {
  background-color: white;
}
</style>
