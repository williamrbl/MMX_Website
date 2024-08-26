<template>
  <div class="texte">Locations à finaliser</div>
  <div
    v-for="location in filteredLocationsARegler"
    :key="location._id"
    class="row items-center justify-between q-mb-md"
  >
    <div class="col locations-text">
      {{ location.association }}
    </div>
    <div class="col locations-text">{{ utils.formatDate(location.start) }}</div>
    <!-- <div class="col locations-text">{{ utils.formatDate(location.end) }}</div> -->
    <div class="col locations-text row items-center">
      <q-checkbox
        class="col-auto q-mr-sm"
        v-model="location.paye"
        @click="updateLocation()"
      />
      <div class="col">
        {{ location.paye ? "Location réglée" : "Location non réglée" }}
      </div>
    </div>
    <div class="col locations-text row items-center justify-between">
      <q-checkbox
        class="col-auto q-mr-sm"
        v-model="location.caution"
        @click="updateLocation()"
      />
      <div class="col">
        {{ location.caution ? "Caution reçue" : "Caution non reçue" }}
      </div>
    </div>
    <BoutonContrat
      :location="location"
      @add-contrat="(location, event) => uploadContrat(location, event)"
      @delete-contrat="(location) => deleteContrat(location)"
      class="col"
    />
  </div>
</template>

<script>
import utils from "src/helpers/utils.ts";
import BoutonContrat from "./BoutonContrat.vue";
export default {
  name: "ComponentAfinaliser",
  components: { BoutonContrat },
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
      return Object.entries(this.locations)
        .filter(
          ([key, location]) =>
            location.paye === false ||
            location.caution === false ||
            location.contrat == null ||
            location.pret == false ||
            location.rendu == false
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
        const response = await fetch(`${process.env.API}/uploadContrat`, {
          method: "POST",
          body: formData,
        });

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
