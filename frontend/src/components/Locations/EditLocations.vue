<template>
  <div class="q-px-lg">
    <div class="row items-center">
      <div class="section-title q-mr-md">Locations</div>
      <div class="row">
        <AjouterLocation
          :access="'admin'"
          @get-locations="getLocations()"
          class="col-2"
        />
        <DemandesLocations
          :locations="locations"
          @get-locations="getLocations()"
        />
      </div>
    </div>

    <q-tabs
      v-model="tab"
      no-caps
      class="bg-primary text-white shadow-2 custom-tabs"
      style="
        margin-top: 3%;
        border-top: 1px solid white;
        border-left: 1px solid white;
        border-right: 1px solid white;
        border-radius: 5px;
      "
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
          @update-location="
            (location) => {
              handleUpdateLocation(location);
            }
          "
        />
      </div>

      <div v-if="tab == 'alllocations'">
        <ComponentLocations
          :locations="locations"
          :getLocations="getLocations"
          :updateLocation="updateLocation"
          @update-location="
            (location) => {
              handleUpdateLocation(location);
            }
          "
        />
      </div>
    </div>
  </div>
</template>

<script>
import utils from "src/helpers/utils.ts";

import ComponentAvenir from "./LocationAvenir.vue";
import ComponentAfinaliser from "./LocationAfinaliser.vue";
import ComponentLocations from "./AllLocations.vue";
import DemandesLocations from "./DemandesLocations.vue";
import AjouterLocation from "./AjouterLocation.vue";

export default {
  name: "EditLocations",
  components: {
    ComponentAvenir,
    ComponentAfinaliser,
    ComponentLocations,
    DemandesLocations,
    AjouterLocation,
  },
  setup() {
    return { utils };
  },
  data() {
    return {
      locations: {},
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
        const response = await fetch(`${process.env.VUE_APP_API}/locations`, {
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

    handleUpdateLocation(updatedLocation) {
      const updatedLocations = this.locations.map((location) =>
        location._id === updatedLocation._id ? updatedLocation : location
      );
      this.locations = updatedLocations;
      this.updateLocation(updatedLocation);
    },

    async updateLocation(location) {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_API}/updateLocation`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(location),
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        await this.getLocations();
        // utils.validate("La location a été mise à jour !");
      } catch (error) {
        console.error("Error updating renting:", error);
        utils.alert("Erreur lors de la MAJ de la location");
      }
    },

    async exportExcel() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API}/exportExcel`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.locations),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        await this.getLocations();
      } catch (error) {
        console.error("Error updating renting:", error);
        utils.alert("Erreur lors de la MAJ de la location");
      }
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
  border: 1px solid white;
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
