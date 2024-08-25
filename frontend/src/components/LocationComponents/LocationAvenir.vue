<template>
  <div class="texte">Locations à venir</div>
  <div
    v-for="location in filteredLocations"
    :key="location._id"
    class="row items-center q-mb-md"
  >
    <div class="col locations-text">{{ location.association }}</div>

    <div class="col locations-text">{{ utils.formatDate(location.start) }}</div>
    <div class="col locations-text">{{ utils.formatDate(location.end) }}</div>

    <div class="col row items-center locations-text">
      <q-checkbox
        class="col-3"
        v-model="location.paye"
        @click="updateLocation(location)"
      />
      <div class="col">
        {{ location.paye ? "Location réglée" : "Location non réglée" }}
      </div>
    </div>

    <div class="col row items-center locations-text">
      <q-checkbox
        class="col-3"
        v-model="location.caution"
        @click="updateLocation(location)"
      />
      <div class="col">
        {{ location.caution ? "Caution reçue" : "Caution non reçue" }}
      </div>
    </div>

    <div class="col">
      <q-file
        v-if="!location.contrat"
        outlined
        v-model="location.contrat"
        label="Contrat"
        @input="uploadContrat(location, $event)"
      >
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>
      <q-btn
        v-else
        outline
        label="Voir Contrat"
        @click="viewContrat(location)"
        style="color: purple"
      />
    </div>

    <q-btn
      flat
      dense
      icon="eva-trash-outline"
      class="col-1"
      style="color: white"
      @click="confirmDelete(location)"
    />
  </div>

  <!-- Dialog de confirmation de suppression -->
  <q-dialog v-model="isDeleting">
    <q-card style="width: 40%; height: 20%">
      <div class="dialog-text">
        Voulez-vous supprimer la location de
        {{ selectedLocation?.association }} ?
      </div>
      <div class="dialog-actions">
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
    </q-card>
  </q-dialog>

  <!-- Dialog de visualisation du contrat -->
  <q-dialog v-model="isVisuContrat">
    <q-card class="pdf-viewer-card">
      <div class="dialog-header">
        <q-btn
          flat
          dense
          icon="eva-trash-outline"
          @click="deleteContrat(locationVisu)"
          class="delete-contrat"
        />
        <q-btn
          flat
          dense
          icon="eva-close-outline"
          @click="isVisuContrat = false"
          class="close-btn"
        />
      </div>
      <embed :src="contratVisu" type="application/pdf" class="pdf-viewer" />
    </q-card>
  </q-dialog>
</template>

<script>
import utils from "src/helpers/utils.ts";

export default {
  name: "ComponentAvenir",
  setup() {
    return {
      utils,
    };
  },
  props: {
    locations: {
      type: Array,
      default: () => [],
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

  data() {
    return {
      isDeleting: false,
      selectedLocation: null,
      isVisuContrat: false,
      contratVisu: null,
      locationVisu: {},
    };
  },

  computed: {
    filteredLocations() {
      const today = new Date().setHours(0, 0, 0, 0);
      return Array.isArray(this.locations)
        ? this.locations.filter((location) => new Date(location.end) >= today)
        : [];
    },
  },

  methods: {
    confirmDelete(location) {
      this.selectedLocation = location;
      this.isDeleting = true;
    },
    async deleteLocation() {
      try {
        const response = await fetch(`${process.env.API}/deleteLocation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.selectedLocation),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        await this.getLocations();
        this.isDeleting = false;
        utils.validate("La location a été supprimée !");
      } catch (error) {
        console.error("Error deleting location:", error);
        utils.alert("Erreur lors de la suppression de la location");
      }
    },

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

    viewContrat(location) {
      this.isVisuContrat = true;
      this.contratVisu = location.contrat;
      this.locationVisu = location;
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

<style scoped>
.pdf-viewer-card {
  width: 80%;
  height: 80%;
  max-width: 1000px;
  max-height: 800px;
  overflow: visible;
}

.pdf-viewer {
  width: 100%;
  height: 100%;
}

.close-btn,
.delete-contrat {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.close-btn:hover {
  background-color: red;
  color: white;
}

.delete-contrat:hover {
  background-color: orange;
  color: white;
}

.dialog-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
