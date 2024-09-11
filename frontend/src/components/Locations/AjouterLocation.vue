<template>
  <q-btn
    outline
    style="color: purple; margin-left: 10%"
    :label="
      access === 'admin' ? 'Ajout d\'une location' : 'Demande de location'
    "
    @click="isAjoutLocation = true"
  />
  <q-dialog v-model="isAjoutLocation">
    <q-card class="card">
      <div class="header">
        <div class="header-text">
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
            }
          "
        />
      </div>

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
              :options="['Association du pôle', 'Particulier', 'Membre de MMX']"
              style="width: 80%"
              outlined
            />
            <q-input
              v-model="inputAsso"
              :label="getLabel()"
              style="width: 80%"
              outlined
            />

            <q-input label="Description de l'événement" v-model="description" />

            <q-toggle
              v-model="isDay"
              label="Location sur une journée"
              @click="locationDates = {}"
              style="margin-top: 5%"
            />

            <SelectionMateriel
              :locationDates="locationDates"
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
                <div v-if="materiel.nbSatellite && materiel.nbSatellite != 0">
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
            @input="updateDateDisplay"
            first-day-of-week="1"
            style="color: purple"
          />
        </div>

        <div class="q-mt-md">
          <div
            class="row"
            v-if="!isDay"
            style="display: flex; flex-direction: row"
          >
            <div class="col">Date de début : {{ locationDates.from }}</div>
            <div class="col">Date de fin : {{ locationDates.to }}</div>
          </div>
          <div v-else>
            <div class="row">
              <div>Date sélectionnée :&nbsp;</div>
              <div v-if="Object.keys(locationDates).length > 0">
                {{ locationDates }}
              </div>
            </div>
          </div>
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
    </q-card>
  </q-dialog>
</template>

<script>
import SelectionMateriel from "./SelectionMateriel.vue";
import { v4 as uuidv4 } from "uuid";
import utils from "src/helpers/utils.ts";

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
      isDay: false,
      materiel: {},
      prix: 0,
      typeLocataire: null,
      description: "",
      isDemande: false,
    };
  },
  setup() {
    return { utils };
  },

  methods: {
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

    async addLocation() {
      if (typeof this.locationDates === "string") {
        this.locationDates = utils.transformDate(this.locationDates);
      }
      if (this.access != "admin") {
        this.isDemande = true;
      }
      if (
        !this.locationDates.from ||
        !this.locationDates.to ||
        this.inputAsso === "" ||
        Object.keys(this.materiel).length === 0 ||
        !this.typeLocataire
      ) {
        utils.alert("Veuillez entrer toutes les informations");
        return;
      } else if (this.access != "admin" && this.description == "") {
        utils.alert("Veuillez entrer toutes les informations");
        return;
      } else if (
        new Date(this.locationDates.from) < new Date().setHours(0, 0, 0, 0) ||
        new Date(this.locationDates.to) < new Date().setHours(0, 0, 0, 0)
      ) {
        utils.alert("Veuillez entrer des dates correctes");
        return;
      }

      this.calculatePrice();
      const uuid = uuidv4();

      const createFormData = () => {
        const formData = new FormData();
        formData.append("_id", uuid);
        formData.append("typeLocataire", this.typeLocataire);
        formData.append("association", this.inputAsso);
        formData.append("start", this.locationDates.from);
        formData.append("end", this.locationDates.to);
        formData.append("prix", this.prix);
        formData.append("materiel", JSON.stringify(this.materiel));
        if (this.isDemande) {
          formData.append("demande", true);
        }
        formData.append("description", this.description);
        return formData;
      };

      try {
        const response = await fetch(`${process.env.API}/addLocation`, {
          method: "POST",
          body: createFormData(),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        this.$emit("get-locations");
        if (this.access) {
          utils.validate("La location a bien été ajoutée");
        } else {
          utils.validate("La demande a bien été prise en compte");
        }
        if (this.access != "admin") {
          try {
            const response = await fetch(`${process.env.API}/sendMailDemande`, {
              method: "POST",
              body: createFormData(),
            });

            if (!response.ok) {
              throw new Error(`Error: ${response.statusText}`);
            }
            this.$emit("get-locations");
            //utils.validate("Le mail a bien été envoyé");
          } catch (error) {
            console.error("Error sending mail:", error);
            utils.alert("Erreur lors de l'envoi du mail");
          }
        }
        this.inputAsso = "";
        this.locationDates = {};
        this.isAjoutLocation = false;
        this.description = "";
        this.materiel = {};
        this.isDemande = false;
        this.typeLocataire = null;
      } catch (error) {
        console.error("Error adding renting:", error);
        utils.alert("Erreur lors de l'ajout de la location");
        return;
      }
    },

    calculatePrice() {
      const materiel = this.materiel;
      console.log(this.locationDates);
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
        soundBoks: { weekDay: 10, weekEnd: 40 },
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
}
</style>
