<template>
  <div class="texte">Locations à venir</div>
  <q-separator style="margin-bottom: 20px" color="white" />
  <q-scroll-area class="q-scroll-locations">
    <div
      v-for="location in filteredLocations"
      :key="location._id"
      class="row items-center q-mb-md"
    >
      <div class="col locations-text">{{ location.association }}</div>

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

      <div class="col">
        <BoutonDetails
          :location="location"
          :getLocations="getLocations"
          @update-location="
            (updatedLocation) => {
              console.log('Updating : ', updatedLocation);
              this.$emit('update-location', updatedLocation);
            }
          "
          @delete-location="
            (deletedLocation) => {
              console.log('Deleting : ', deletedLocation);
              this.$emit('delete-location', deletedLocation);
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
  name: "ComponentAvenir",
  setup() {
    return {
      utils,
    };
  },
  components: { BoutonDetails },
  emits: ["update-location", "delete-location"],
  props: {
    locations: {
      type: Object,
      required: true,
    },
    getLocations: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      isDeleting: false,
      selectedLocation: null,
    };
  },

  computed: {
    filteredLocations() {
      const today = new Date().setHours(0, 0, 0, 0);
      const twoDaysFromNow = new Date().setDate(new Date().getDate() + 2);

      return Object.entries(this.locations)
        .filter(([key, location]) => {
          const startDate = new Date(location.start).setHours(0, 0, 0, 0);
          const endDate = new Date(location.end).setHours(0, 0, 0, 0);

          const isStartInLessThanTwoDays =
            startDate <= twoDaysFromNow && startDate >= today;

          return (
            !isStartInLessThanTwoDays && !location.demande && endDate >= today
          );
        })
        .map(([key, location]) => location)
        .sort((a, b) => new Date(a.start) - new Date(b.start));
    },
  },

  methods: {
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
        // utils.validate("Le contrat a bien été supprimé");

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

<style>
.texte {
  margin-bottom: 20px;
  font-size: 25px;
  font-weight: 200;
  color: white;
}
</style>
