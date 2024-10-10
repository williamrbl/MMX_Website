<template>
  <div class="texte">Locations en cours</div>
  <q-separator style="margin-bottom: 20px" color="white" />
  <q-scroll-area class="q-scroll-locations">
    <div
      v-for="location in filteredLocationsARegler"
      :key="location._id"
      class="row items-center justify-between q-mb-md"
    >
      <div class="col locations-text">
        {{ location.association }}
      </div>
      <div class="col locations-text">
        {{ utils.formatDate(location.start) }}
        {{
          utils.formatDate(location.start) != utils.formatDate(location.end)
            ? "→"
            : ""
        }}
        {{
          utils.formatDate(location.start) == utils.formatDate(location.end)
            ? ""
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
          @delete-location="
            (location) => {
              console.log('deleting : ', location);
              this.$emit('delete-location', location);
            }
          "
          :deleteContrat="deleteContrat"
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
      const fourDaysFromNow = new Date();
      fourDaysFromNow.setDate(fourDaysFromNow.getDate() + 2);

      return Object.entries(this.locations)
        .filter(([key, location]) => {
          const startDate = new Date(location.start).setHours(0, 0, 0, 0);
          const endDate = new Date(location.end).setHours(0, 0, 0, 0);

          const isMissing =
            (!location.paye ||
              !location.caution ||
              location.contrat == null ||
              !location.prete ||
              !location.rendu) &&
            startDate <= today;

          const isStartInLessThanFourDays =
            startDate <= fourDaysFromNow &&
            startDate >= today &&
            (!location.paye ||
              !location.caution ||
              location.contrat == null ||
              !location.prete ||
              !location.rendu);

          const isBetweenStartAndEnd =
            startDate <= today &&
            endDate >= today &&
            (!location.paye ||
              !location.caution ||
              location.contrat == null ||
              !location.prete ||
              !location.rendu);

          return (
            (isMissing || isStartInLessThanFourDays || isBetweenStartAndEnd) &&
            !location.demande
          );
        })
        .map(([key, location]) => location)
        .sort((a, b) => new Date(a.start) - new Date(b.start)); // Sort by start date
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
        // utils.validate("Le contrat a bien été importé");
      } catch (error) {
        console.error("Error importing contract:", error);
        utils.alert("Erreur lors de l'import du contrat");
      }
    },
    async deleteContrat(location) {
      const formData = new FormData();
      formData.append("_id", location._id);
      formData.append("contract", location.contrat);
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
  },
};
</script>
