<template>
  <div class="texte">Locations à venir</div>
  <q-separator style="margin-bottom: 20px" />
  <q-scroll-area style="height: 29vh">
    <div
      v-for="location in filteredLocations"
      :key="location._id"
      class="row items-center q-mb-md"
    >
      <div class="col locations-text">{{ location.association }}</div>

      <div class="col locations-text">
        {{ utils.formatDate(location.start) }}
      </div>
      <div class="col locations-text">
        {{
          utils.formatDate(location.start) == utils.formatDate(location.end)
            ? "-"
            : utils.formatDate(location.end)
        }}
      </div>

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

      <q-btn
        flat
        dense
        icon="eva-trash-outline"
        class="col-1"
        style="color: white"
        @click="confirmDelete(location)"
      />
    </div>
  </q-scroll-area>

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
  emits: ["update-location"],
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
