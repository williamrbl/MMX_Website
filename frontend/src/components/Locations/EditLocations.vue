<template>
  <div>
    <div class="row items-center">
      <div class="section-title">Locations</div>
      <div class="row" style="display: flex; flex-direction: row; width: 100%">
        <AjouterLocation :access="'admin'" @get-locations="getLocations()" />

        <DemandesLocations
          :locations="locations"
          @get-locations="getLocations()"
          style="width: 5vw"
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
        <q-tabs inline-label no-caps v-model="tab">
          <q-tab name="avenir" icon="eva-clock-outline" label="A venir" />
          <!-- <q-tab name="afinaliser" label="En cours" /> -->
          <q-tab
            name="alllocations"
            label="Toutes les locations"
            icon="eva-list-outline"
          />
        </q-tabs>
      </div>
      <q-btn
        flat
        dense
        class="far-right-btn large-screen-only"
        @click="exportExcel()"
      >
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
          @delete-location="
            (location) => {
              confirmDelete(location);
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
          @delete-location="
            (location) => {
              confirmDelete(location);
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
          @delete-location="
            (location) => {
              confirmDelete(location);
            }
          "
        />
      </div>
    </div>

    <q-dialog v-model="isDeleting">
      <q-card class="q-pa-md" style="width: 40%; height: 20%">
        <q-card-section>
          <div style="font-size: 15px; font-weight: 400">
            Voulez-vous supprimer la location de
            {{ selectedLocation?.association }} ?
          </div>
        </q-card-section>

        <q-card-section class="q-pa-none">
          <div
            style="
              display: flex;
              justify-content: flex-end;
              align-items: center;
              margin-top: auto;
            "
          >
            <q-btn
              outline
              label="Non"
              @click="isDeleting = false"
              style="color: purple; margin-right: 8px"
            />
            <q-btn
              outline
              label="Oui"
              @click="deleteLocation"
              style="color: purple"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import utils from "src/helpers/utils.ts";

import ComponentAvenir from "./LocationAvenir.vue";
import ComponentAfinaliser from "./LocationEnCours.vue";
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
      tab: "afinaliser",
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

    confirmDelete(location) {
      this.selectedLocation = location;
      this.isDeleting = true;
    },

    async deleteLocation() {
      if (this.selectedLocation && this.selectedLocation.contrat) {
        await this.deleteContrat(this.selectedLocation);
      }
      try {
        const response = await fetch(
          `${process.env.VUE_APP_API}/deleteLocation`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.selectedLocation),
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        await this.getLocations();
        this.isDeleting = false;
        // utils.validate("La location a été supprimée !");
      } catch (error) {
        console.error("Error deleting location:", error);
        utils.alert("Erreur lors de la suppression de la location");
      }
    },

    async deleteContrat(location) {
      const formData = new FormData();
      formData.append("_id", location._id);
      formData.append("contract", location.contrat); // Ensure contract field exists
      formData.append("association", location.association);

      try {
        const response = await fetch(
          `${process.env.VUE_APP_API}/removeContract`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        await this.getLocations();
        utils.validate("Le contrat a bien été supprimé");

        if (this.timelineItems) {
          this.timelineItems[0].value = false;
          this.timelineItems[0].isUploaded = false;
          this.handleUpdate();
        }
      } catch (error) {
        console.error("Error deleting contract:", error);
        utils.alert(
          `Erreur lors de la suppression du contrat: ${error.message}`
        );
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

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "MMX-locations.xlsx";
        document.body.appendChild(a);
        a.click();

        a.remove();
        window.URL.revokeObjectURL(url);

        await this.getLocations();
      } catch (error) {
        console.error("Error exporting Excel:", error);
        utils.alert("Erreur lors de l'exportation des locations.");
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
  font-family: Aileron Light;
  font-size: 30px;
  font-weight: 200;
  color: white;
}

.edit-location-btn {
  height: 5vh;
}

.q-scroll-locations {
  height: 29vh;
  @media (max-width: 767px) {
    height: 24vh;
  }
}
</style>

<style scoped>
.locations {
  border: 1px solid white;
  border-radius: 5px;
  height: 38vh;
  @media (min-width: 767px) {
    height: 45vh;
  }
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
