<template>
  <q-btn
    outline
    color="purple"
    label="Voir la demande"
    @click="isVisuDemande = true"
  />

  <q-dialog v-model="isVisuDemande">
    <q-card style="width: 30%">
      <div class="header">Demande de prestation</div>
      <div class="q-pa-md">
        <div>
          <div>Association: {{ event.organisateur }}</div>
          <div>Date: {{ event.date }}</div>
          <div>Lieu: {{ event.lieu }}</div>
          <div>Description de l'événement: {{ event.description }}</div>
        </div>
        <div style="display: flex; justify-content: end">
          <q-btn
            outline
            dense
            color="purple"
            label="Refuser"
            @click="refusPrestation"
          />
          <q-btn
            outline
            dense
            color="purple"
            label="Accepter"
            @click="accepterPrestation"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import utils from "src/helpers/utils.ts";
export default {
  name: "DemandePrestation",
  amits: ["update-events"],
  setup() {
    return { utils };
  },
  data() {
    return {
      isVisuDemande: false,
    };
  },
  props: {
    event: {
      type: Object,
      required: true,
    },
  },

  methods: {
    async accepterPrestation() {
      console.log("id:", this.event._id);
      try {
        const response = await fetch(
          `${process.env.VUE_APP_API}/accepterPrestation`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: this.event._id }),
          }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        this.$emit("update-events");
        this.isVisuDemande = false;
        utils.validate("Demande acceptée");
      } catch (error) {
        console.error("Error getting events", error);
      }
    },

    async refusPrestation() {
      console.log("id:", this.event._id);
      try {
        const response = await fetch(
          `${process.env.VUE_APP_API}/refuserPrestation`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: this.event._id }),
          }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        this.$emit("update-events");
        this.isVisuDemande = false;
        utils.validate("Demande refusée");
      } catch (error) {
        console.error("Error getting events", error);
      }
    },
  },
};
</script>
