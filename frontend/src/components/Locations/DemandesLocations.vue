<template>
  <q-btn
    outline
    style="color: white"
    label="Demandes"
    @click="isDemandes = true"
    class="edit-location-btn"
  >
    <q-badge
      v-if="filteredLocations.length"
      rounded
      color="red"
      floating
      transparent
      class="blinking-badge"
      style="position: absolute; top: -5px; right: -5px"
      :label="filteredLocations.length"
    />
  </q-btn>

  <q-dialog v-model="isDemandes">
    <q-card class="carte-demandes">
      <div class="header">Demandes de location</div>
      <div v-if="filteredLocations.length">
        <div
          v-for="(location, index) in filteredLocations"
          :key="index"
          class="row q-pa-md"
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <div>{{ location.association }}</div>
          <VoirDemande
            :location="location"
            @rejeter-demande="
              (location, justification) => {
                rejeterDemande(location, justification);
              }
            "
            @get-locations="this.$emit('get-locations')"
          />
        </div>
      </div>
      <div v-else class="q-pa-md">Aucune demande de location</div>
    </q-card>
  </q-dialog>
</template>

<script>
import utils from "src/helpers/utils.ts";
import VoirDemande from "./VoirDemande.vue";
export default {
  name: "DemandeLocations",
  emits: ["get-locations"],
  components: { VoirDemande },
  data() {
    return {
      isDemandes: false,
      today: new Date(),
    };
  },
  props: {
    locations: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return { utils };
  },
  methods: {
    async rejeterDemande(location, justification) {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_API}/deleteLocation`,
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
        try {
          const response = await fetch(
            `${process.env.VUE_APP_API}/sendMailRefus`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ location, justification }),
            }
          );

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
        } catch (error) {
          console.error("Error deleting location:", error);
          utils.alert("Erreur lors de la suppression de la location");
        }
        this.$emit("get-locations");
        utils.validate("La demande a été refusée");
      } catch (error) {
        console.error("Error deleting location:", error);
        utils.alert("Erreur lors de la suppression de la location");
      }
    },
  },
  mounted() {
    this.$emit("get-locations");
  },
  computed: {
    filteredLocations() {
      return Array.isArray(this.locations)
        ? this.locations.filter(
            (location) =>
              location.demande === true && new Date(location.end) >= this.today
          )
        : [];
    },
  },
};
</script>

<style scoped>
.header {
  background-color: purple;
  color: white;
}

.carte-demandes {
  width: 400px;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.blinking-badge {
  animation: blink 1s infinite;
}
</style>
