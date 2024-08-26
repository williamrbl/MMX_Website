<template>
  <div class="q-px-lg">
    <div class="row items-center">
      <div class="section-title q-mr-md">Locations</div>
      <q-btn
        outline
        style="color: purple; margin-left: 10%"
        label="Ajouter une location"
        @click="isAjoutLocation = true"
      />
    </div>

    <q-tabs
      v-model="tab"
      no-caps
      class="bg-purple text-white shadow-2 custom-tabs"
      style="margin-top: 3%"
    >
      <div class="tab-container">
        <q-tab name="avenir" label="A venir" />
        <q-tab name="afinaliser" label="A finaliser" />
        <q-tab name="alllocations" label="Toutes les locations" />
      </div>
      <q-btn flat dense class="far-right-btn" @click="exportExcel()">
        <i class="las la-file-excel" style="font-size: 30px" />
      </q-btn>
    </q-tabs>

    <div class="locations q-pa-md">
      <div v-if="tab == 'avenir'">
        <ComponentAvenir
          :locations="locations"
          :getLocations="getLocations"
          @update-location="
            (location) => {
              handleUpdateLocation(location);
            }
          "
        />
      </div>

      <div v-if="tab == 'afinaliser'">
        <ComponentAfinaliser
          :locations="locations"
          :getLocations="getLocations"
          :updateLocation="updateLocation"
        />
      </div>

      <div v-if="tab == 'alllocations'">
        <ComponentLocations :locations="locations" />
      </div>
    </div>
  </div>

  <q-dialog v-model="isAjoutLocation">
    <q-card style="width: 50%">
      <div class="q-pa-md">
        <div>
          <q-input v-model="inputAsso" label="Nom de l'association" />
          <div class="row">
            <q-toggle
              v-model="isDay"
              label="Location sur une journée"
              color="purple"
              class="col"
              @click="locationDates = {}"
            />
            <q-date
              class="col"
              v-model="locationDates"
              :range="!isDay"
              @input="updateDateDisplay"
              first-day-of-week="1"
            />
          </div>
          <div v-if="!isDay">
            <div>Date de début : {{ locationDates.from }}</div>
            <div>Date de fin : {{ locationDates.to }}</div>
          </div>
          <div v-else>
            <div>Date sélectionnée : {{ locationDates }}</div>
          </div>
        </div>
        <div class="q-pt-md" style="display: flex; justify-content: end">
          <q-btn
            outline
            label="Cancel"
            @click="
              {
                isAjoutLocation = false;
                inputAsso = '';
                locationDates = {};
                isDay = false;
              }
            "
          />
          <q-btn outline label="Ok" @click="addLocation()" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import utils from "src/helpers/utils.ts";
import { v4 as uuidv4 } from "uuid";
import ComponentAvenir from "./LocationComponents/LocationAvenir.vue";
import ComponentAfinaliser from "./LocationComponents/LocationAfinaliser.vue";
import ComponentLocations from "./LocationComponents/AllLocations.vue";

export default {
  name: "EditLocations",
  components: { ComponentAvenir, ComponentAfinaliser, ComponentLocations },
  setup() {
    return { utils };
  },
  data() {
    return {
      locations: {},
      isAjoutLocation: false,
      inputAsso: "",
      locationDates: {},
      isDay: false,
      tab: "avenir",
      isDeleting: false,
      selectedLocation: null,
    };
  },
  methods: {
    handleRefresh() {
      this.getLocations();
    },

    updateDateDisplay() {
      if (!this.isRange) {
        this.locationDates = this.locationDates ? this.locationDates : "";
      }
    },

    transformDate(dateStr) {
      return new Proxy(
        { from: dateStr, to: dateStr },
        {
          get(target, prop) {
            if (prop === "from" || prop === "to") {
              return target[prop];
            }
            return undefined;
          },
        }
      );
    },

    async getLocations() {
      try {
        const response = await fetch(`${process.env.API}/locations`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        this.locations = await response.json();
      } catch (error) {
        console.error("Error getting renting:", error);
        utils.alert("Erreur lors de la récupétation des locations");
      }
    },

    async addLocation() {
      if (typeof this.locationDates == "string") {
        this.locationDates = this.transformDate(this.locationDates);
      }
      if (this.locationDates == {} || this.inputAsso == "") {
        utils.alert("Veuillez entrer toutes les informations");
      } else if (
        new Date(this.locationDates.from) < new Date().setHours(0, 0, 0, 0) ||
        new Date(this.locationDates.to) < new Date().setHours(0, 0, 0, 0)
      ) {
        utils.alert("Veuillez entrer des dates correctes");
      } else {
        const uuid = uuidv4();
        const formData = new FormData();
        formData.append("_id", uuid);
        formData.append("association", this.inputAsso);
        formData.append("start", this.locationDates.from);
        formData.append("end", this.locationDates.to);
        formData.append("paye", false);
        formData.append("caution", false);
        formData.append("contrat", null);
        formData.append("pret", false);
        formData.append("rendu", false);
        formData.append("prix", 0);
        formData.append("isRetard", false);
        formData.append("suppRetard", 0);
        try {
          const response = await fetch(`${process.env.API}/addLocation`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          this.inputName = "";
          this.inputDescription = "";
          this.isDay = false;
          this.getLocations();
          utils.validate("La location a bien été ajoutée");
          this.addingArticle = false;
        } catch (error) {
          console.error("Error adding renting:", error);
          utils.alert("Erreur lors de l'ajout de la location");
        }
        (this.inputAsso = ""), (this.locationDates = {});
        this.isAjoutLocation = false;
      }
    },

    handleUpdateLocation(updatedLocation) {
      const updatedLocations = this.locations.map((location) =>
        location._id === updatedLocation._id ? updatedLocation : location
      );
      this.locations = updatedLocations;
      this.updateLocation(updatedLocation);
    },

    async updateLocation(location) {
      try {
        const response = await fetch(`${process.env.API}/updateLocation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(location),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        await this.getLocations();
        utils.validate("La location a été mise à jour !");
      } catch (error) {
        console.error("Error updating renting:", error);
        utils.alert("Erreur lors de la MAJ de la location");
      }
    },

    exportExcel() {
      console.log("Exporting Excel file");
    },
  },

  mounted() {
    this.getLocations();
  },
};
</script>
<style>
.locations-text {
  color: white;
}
.section-title {
  font-family: "calibri";
  font-size: 30px;
  font-weight: 200;
  color: white;
}
</style>
<style scoped>
.locations {
  border: 1px solid purple;
  border-radius: 5px;
}

.texte {
  color: white;
  font-size: 15px;
  font-weight: 300;
  font-family: "calibri";
}

.dialog-text {
  color: black;
  font-weight: 400;
  font-family: Arial, Helvetica, sans-serif;
}

.custom-tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tab-container {
  display: flex;
  flex: 1;
  justify-content: center;
}

.far-right-btn {
  margin-left: auto;
}
</style>
