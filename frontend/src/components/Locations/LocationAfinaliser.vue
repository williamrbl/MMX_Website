<template>
  <div class="texte">Locations à finaliser</div>
  <q-separator style="margin-bottom: 20px" color="white" />
  <q-scroll-area style="height: 29vh">
    <div
      v-for="location in filteredLocationsARegler"
      :key="location._id"
      class="row items-center justify-between q-mb-md"
    >
      <div class="col locations-text">
        {{ location.association }}
      </div>
      <div class="col locations-text">
        {{ utils.formatDate(location.start) }} →
        {{
          utils.formatDate(location.start) == utils.formatDate(location.end)
            ? "-"
            : utils.formatDate(location.end)
        }}
      </div>

      <!-- <div class="col locations-text">{{ utils.formatDate(location.end) }}</div> -->
      <div class="col">
        <BoutonDetails
          :location="location"
          :getLocations="getLocations"
          @update-location="
            (location) => {
              console.log('Updating : ', location);
              this.$emit('update-location', location);
            }
          "
        />
      </div>
    </div>
  </q-scroll-area>
</template>

<script>
import utils from "src/helpers/utils.ts";
import BoutonDetails from "./BoutonDetails.vue";
export default {
  name: "ComponentAfinaliser",
  components: { BoutonDetails },
  emits: ["update-location"],
  setup() {
    return {
      utils,
    };
  },
  props: {
    locations: {
      type: Object,
      required: true,
    },
    getLocations: {
      type: Function,
      required: true,
    },
    updateLocation: {
      type: Function,
      required: true,
    },
  },
  computed: {
    filteredLocationsARegler() {
      const today = new Date().setHours(0, 0, 0, 0);
      return Object.entries(this.locations)
        .filter(
          ([key, location]) =>
            (location.paye === false ||
              location.caution === false ||
              location.contrat == null ||
              location.pret === false ||
              location.rendu === false) &&
            new Date(location.end) >= today &&
            !location.demande
        )
        .map(([key, location]) => location);
    },
  },
  methods: {
    async uploadContrat(location, event) {
      const file = event.target.files[0];
      location.contrat = file;
      const formData = new FormData();
      formData.append("contrat", file);
      formData.append("_id", location._id);
      formData.append("association", location.association);

      try {
        const response = await fetch(
          `${process.env.VUE_APP_API}/uploadContrat`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        await this.getLocations();
        utils.validate("Le contrat a bien été importé");
      } catch (error) {
        console.error("Error importing contract:", error);
        utils.alert("Erreur lors de l'import du contrat");
      }
    },

    async deleteContrat(location) {
      const formData = new FormData();
      formData.append("_id", location._id);
      formData.append("contract", location.contract);
      formData.append("association", location.association);
      try {
        const response = await fetch(`${process.env.API}/removeContract`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        await this.getLocations();
        utils.validate("Le contrat a bien été supprimé");
        this.isVisuContrat = false;
        this.locationVisu = {};
        this.contratVisu = {};
      } catch (error) {
        console.error("Error deleting contract:", error);
        utils.alert("Erreur lors de la suppression du contrat");
      }
    },
  },
};
</script>
