<template>
  <div>
    <q-btn
      outline
      :style="{ color: getColor() }"
      :label="access === 'admin' ? 'Nouvelle location' : 'Demande de location'"
      @click="isAjoutLocation = true"
      class="edit-location-btn"
    />
    <q-dialog v-model="isAjoutLocation">
      <q-card class="card">
        <div class="header">
          <div class="header-text" style="font-family: Aileron Bold">
            {{
              access == "admin" ? "Ajout d'une location" : "Demande de location"
            }}
          </div>
          <q-btn
            flat
            dense
            icon="eva-close-outline"
            style="color: white"
            @click="
              {
                typeLocataire = null;
                isAjoutLocation = false;
                inputAsso = '';
                locationDates = {};
                isDay = false;
                materiel = {};
                description = '';
                email = '';
              }
            "
          />
        </div>

        <div class="large-screen-only">
          <div class="q-pa-md">
            <div class="row q-mt-md">
              <div
                class="col"
                style="
                  display: flex;
                  justify-content: center;
                  flex-direction: column;
                "
              >
                <q-select
                  v-model="typeLocataire"
                  label="Type de locataire"
                  :options="[
                    'Association du pôle',
                    'Particulier',
                    'Membre de MMX',
                  ]"
                  behavior="menu"
                  style="width: 80%"
                  outlined
                />
                <q-input
                  v-model="inputAsso"
                  :label="getLabel()"
                  style="width: 80%"
                  outlined
                />
                <q-input
                  v-model="email"
                  label="Email"
                  style="width: 80%"
                  outlined
                  v-if="access != 'admin'"
                />

                <q-input
                  label="Description de l'événement"
                  v-model="description"
                  style="width: 80%"
                />

                <q-toggle
                  v-model="isDay"
                  label="Location sur une journée"
                  @click="onToggleDaySelection"
                  style="margin-top: 5%"
                />

                <SelectionMateriel
                  @add-materiel="
                    (mat) => {
                      prix = prix;
                      materiel = mat;
                    }
                  "
                />

                <div v-if="Object.keys(materiel).length > 0">
                  <div style="font-weight: 500; margin-bottom: 5px">
                    Matériel loué :
                  </div>
                  <div class="q-px-md">
                    <div v-if="materiel.nbSB && materiel.nbSB != 0">
                      SoundBoks : {{ materiel.nbSB }}
                    </div>
                    <div
                      v-if="materiel.nbSatellite && materiel.nbSatellite != 0"
                    >
                      Satellites : {{ materiel.nbSatellite }}
                    </div>
                    <div v-if="materiel.isCaisson !== false">
                      Caisson : {{ materiel.isCaisson ? 1 : 0 }}
                    </div>
                    <div v-if="materiel.isScarlett !== false">
                      Carte Son : {{ materiel.isScarlett ? 1 : 0 }}
                    </div>
                    <div v-if="materiel.nbMicro && materiel.nbMicro != 0">
                      Micro : {{ materiel.nbMicro }}
                    </div>
                  </div>
                </div>
              </div>
              <q-date
                class="col"
                v-model="locationDates"
                :range="!isDay"
                first-day-of-week="1"
                style="color: purple"
                @update:model-value="handleDateChange(locationDates)"
              />
            </div>

            <div class="q-mt-md">
              <div
                class="row"
                v-if="!isDay"
                style="display: flex; flex-direction: row"
              >
                <!-- <div class="col">Date de début : {{ locationDates.from }}</div>
            <div class="col">Date de fin : {{ locationDates.to }}</div> -->

                <div v-if="materiel && locationDates.from && locationDates.to">
                  Prix : {{ calculatePrice() }} euros
                </div>
              </div>
              <!-- <div v-else>
                <div class="row">
                  <div>Date sélectionnée :&nbsp;</div>
                  <div v-if="Object.keys(locationDates).length > 0">
                    {{ locationDates }}
                  </div>
                </div>
              </div> -->
            </div>

            <div
              class="q-pt-md q-mt-md"
              style="display: flex; justify-content: end"
            >
              <q-btn
                outline
                label="Cancel"
                style="color: purple"
                @click="
                  {
                    isAjoutLocation = false;
                    inputAsso = '';
                    locationDates = {};
                    isDay = false;
                    materiel = {};
                    description = '';
                    typeLocataire = null;
                    email = '';
                  }
                "
              />
              <q-btn
                outline
                label="Ok"
                style="color: purple"
                class="q-ml-sm"
                @click="addLocation()"
              />
            </div>
          </div>
        </div>

        <div
          class="small-screen-only card-small"
          style="display: flex; justify-content: center; align-items: center"
        >
          <q-scroll-area style="height: 50vh" class="q-pa-md">
            <div>
              <div class="centered" style="flex-direction: column">
                <q-select
                  v-model="typeLocataire"
                  label="Type de locataire"
                  :options="[
                    'Association du pôle',
                    'Particulier',
                    'Membre de MMX',
                  ]"
                  style="width: 80%"
                  outlined
                />
                <q-input
                  v-model="inputAsso"
                  :label="getLabel()"
                  style="width: 80%"
                  outlined
                />
                <q-input
                  v-model="email"
                  label="Email"
                  style="width: 80%"
                  outlined
                  v-if="access != 'admin'"
                />

                <q-input
                  label="Description de l'événement"
                  v-model="description"
                  style="width: 80%; margin-bottom: 3vh"
                />

                <SelectionMateriel
                  @add-materiel="
                    (mat) => {
                      prix = prix;
                      materiel = mat;
                    }
                  "
                />
              </div>

              <div
                v-if="Object.keys(materiel).length > 0"
                class="centered"
                style="margin-top: 2vh"
              >
                <div style="display: flex; flex-direction: column">
                  <div style="font-weight: 500; margin-bottom: 5px">
                    Matériel loué :
                  </div>
                  <div>
                    <div v-if="materiel.nbSB && materiel.nbSB != 0">
                      SoundBoks : {{ materiel.nbSB }}
                    </div>
                    <div
                      v-if="materiel.nbSatellite && materiel.nbSatellite != 0"
                    >
                      Satellites : {{ materiel.nbSatellite }}
                    </div>
                    <div v-if="materiel.isCaisson !== false">
                      Caisson : {{ materiel.isCaisson ? 1 : 0 }}
                    </div>
                    <div v-if="materiel.isScarlett !== false">
                      Carte Son : {{ materiel.isScarlett ? 1 : 0 }}
                    </div>
                    <div v-if="materiel.nbMicro && materiel.nbMicro != 0">
                      Micro : {{ materiel.nbMicro }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="centered" style="display: flex; flex-direction: column">
              <q-date
                v-model="locationDates"
                :range="!isDay"
                first-day-of-week="1"
                style="color: purple; margin-top: 3vh"
                @update:model-value="handleDateChange(locationDates)"
              />
              <q-toggle
                v-model="isDay"
                label="Location sur une journée"
                @click="onToggleDaySelection"
              />
            </div>

            <div v-if="materiel && locationDates.from && locationDates.to">
              Prix : {{ calculatePrice() }} euros
            </div>
          </q-scroll-area>
          <q-separator />
          <div style="display: flex; justify-content: end" class="q-pa-md">
            <q-btn
              outline
              label="Cancel"
              style="color: purple"
              @click="
                {
                  isAjoutLocation = false;
                  inputAsso = '';
                  locationDates = {};
                  isDay = false;
                  materiel = {};
                  description = '';
                  typeLocataire = null;
                  email = '';
                }
              "
            />
            <q-btn
              outline
              label="Ok"
              style="color: purple"
              @click="addLocation()"
            />
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import SelectionMateriel from "./SelectionMateriel.vue";
import { v4 as uuidv4 } from "uuid";
import utils from "src/helpers/utils.ts";
import { Loading } from "quasar";
import SpinnerComponent from "src/components/Other/SpinnerComponent.vue";

export default {
  name: "AjouterLocation",
  emits: ["get-locations"],
  components: { SelectionMateriel },
  props: {
    access: { type: String, required: false },
  },
  data() {
    return {
      isAjoutLocation: false,
      inputAsso: "",
      locationDates: {},
      dates: {},
      isDay: false,
      materiel: {},
      prix: 0,
      typeLocataire: null,
      description: "",
      isDemande: false,
      email: "",
    };
  },
  setup() {
    return { utils };
  },

  methods: {
    getColor() {
      let color = "purple";
      if (this.access === "admin") {
        color = "white";
      }
      return color;
    },

    getLabel() {
      switch (this.typeLocataire) {
        case "Association du pôle":
          return "Nom de l'association";
        case "Particulier":
          return "Nom du particulier";
        case "Membre de MMX":
          return "Nom du membre de MMX";
        default:
          return "Nom du locataire";
      }
    },

    onToggleDaySelection() {
      if (this.isDay) {
        this.locationDates = {};
        this.dates = {};
      }
    },

    handleDateChange(dates) {
      console.log("before:", this.locationDates);
      if (this.isDay) {
        this.dates = {
          from: dates,
          to: dates,
        };
      } else {
        this.dates = dates;
      }
      console.log("after:", this.dates);
    },

    async addLocation() {
      console.log(this.dates);
      if (typeof this.dates === "string") {
        this.dates = utils.formatDate(this.dates);
      }
      if (this.access != "admin") {
        this.isDemande = true;
        if (this.email === "") {
          utils.alert("Veuillez entrer toutes les informations");
        }

        if (!(this.email.includes("@") && this.email.includes("."))) {
          utils.alert("Veuillez entrer un email valide");
        }
      }
      if (
        !this.dates ||
        !this.inputAsso ||
        Object.keys(this.materiel).length === 0 ||
        !this.typeLocataire
      ) {
        console.log("=======>");
        utils.alert("Veuillez entrer toutes les informations");
        return;
      } else if (this.access != "admin" && this.description == "") {
        utils.alert("Veuillez entrer toutes les informations");
        return;
      } else if (
        new Date(this.dates.from) < new Date().setHours(0, 0, 0, 0) ||
        new Date(this.dates.to) < new Date().setHours(0, 0, 0, 0)
      ) {
        utils.alert("Veuillez entrer des dates correctes");
        return;
      } else {
        Loading.show({
          spinner: SpinnerComponent,
        });
        this.calculatePrice();
        const uuid = uuidv4();

        const createFormData = () => {
          const formData = new FormData();
          formData.append("_id", uuid);
          formData.append("typeLocataire", this.typeLocataire);
          formData.append("association", this.inputAsso);
          formData.append("start", this.dates.from);
          formData.append("end", this.dates.to);
          formData.append("prix", this.prix);
          formData.append("materiel", JSON.stringify(this.materiel));
          if (this.isDemande) {
            formData.append("email", this.email);
            formData.append("demande", true);
          }
          formData.append("description", this.description);
          return formData;
        };

        try {
          const response = await fetch(
            `${process.env.VUE_APP_API}/addLocation`,
            {
              method: "POST",
              body: createFormData(),
            }
          );

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          this.$emit("get-locations");

          if (this.access != "admin") {
            try {
              const response = await fetch(
                `${process.env.VUE_APP_API}/sendMailDemande`,
                {
                  method: "POST",
                  body: createFormData(),
                }
              );

              if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
              }
              this.$emit("get-locations");
              if (this.access) {
                utils.validate("La location a bien été ajoutée");
              } else {
                utils.validate("La demande a bien été prise en compte");
              }
              Loading.hide();
            } catch (error) {
              console.error("Error sending mail:", error);
              utils.alert("Erreur lors de l'envoi du mail");
            }
            try {
              const response = await fetch(
                `${process.env.VUE_APP_API}/sendMailNewDemande`,
                {
                  method: "POST",
                  body: createFormData(),
                }
              );

              if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
              }
            } catch (error) {
              console.error("Error sending mail:", error);
              utils.alert("Erreur lors de l'envoi du mail");
            }
          }

          this.inputAsso = "";
          this.dates = {};
          this.locationDates = {};
          this.isAjoutLocation = false;
          this.description = "";
          this.materiel = {};
          this.isDemande = false;
          this.typeLocataire = null;
          this.email = "";
          Loading.hide();
        } catch (error) {
          console.error("Error adding renting:", error);
          utils.alert("Erreur lors de l'ajout de la location");
          return;
        }
      }
    },

    calculatePrice() {
      const materiel = this.materiel;

      const dateDebut = new Date(this.locationDates.from);
      const dateFin = new Date(this.locationDates.to);

      if (isNaN(dateDebut) || isNaN(dateFin)) {
        console.error("Invalid dates");
        return;
      }

      const nbSoundBoks = materiel.nbSB || 0;
      const nbSatellite = materiel.nbSatellite || 0;
      const caisson = materiel.isCaisson || false;
      const scarlett = materiel.isScarlett || false;
      const nbMicros = materiel.nbMicro || 0;

      const rates = {
        soundBoks: { weekDay: 10, weekEnd: 50 },
        satellite: { weekDay: 40, weekEnd: 80 },
        caisson: { weekDay: 40, weekEnd: 80 },
        scarlett: { weekDay: 10, weekEnd: 20 },
      };

      let prix = 0;

      const isWeekend = (date) => date.getDay() === 6 || date.getDay() === 0;

      let currentDate = new Date(dateDebut);
      while (currentDate <= dateFin) {
        if (isWeekend(currentDate)) {
          prix += (nbSoundBoks * rates.soundBoks.weekEnd) / 2;
          prix += (nbSatellite * rates.satellite.weekEnd) / 2;
          if (caisson) prix += rates.caisson.weekEnd / 2;
          if (scarlett) prix += rates.scarlett.weekEnd / 2;
        } else {
          prix += nbSoundBoks * rates.soundBoks.weekDay;
          prix += nbSatellite * rates.satellite.weekDay;
          if (caisson) prix += rates.caisson.weekDay;
          if (scarlett) prix += rates.scarlett.weekDay;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      this.prix = prix;
      return prix;
    },
  },
};
</script>

<style>
.header {
  background-color: purple;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  height: 7vh;
  position: relative;
}

.header-text {
  color: white;
  font-family: "calibri";
  font-size: large;
  flex: 1;
  text-align: center;
}

.close-btn {
  position: absolute;
  right: 16px;
  color: white;
}

.card {
  border-radius: 15px;
  width: 100vw !important;
}
</style>
