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
            @click="isRefusing = true"
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

  <q-dialog v-model="isRefusing">
    <q-card style="width: 40%">
      <div class="header">Refus de l'événement de {{ event.organisateur }}</div>
      <div class="q-pa-md">
        <q-input label="Raison du refus" v-model="justification" />
        <div style="margin-top: 10px; display: flex; justify-content: end">
          <q-btn
            outline
            dense
            color="purple"
            label="Annuler"
            @click="cancelRefus"
          />
          <q-btn
            outline
            dense
            color="purple"
            label="Refuser"
            @click="refusPrestation"
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
      isRefusing: false,
      justification: "",
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
      try {
        const response = await fetch(
          `${process.env.VUE_APP_API}/accepterPrestation`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.event),
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

    cancelRefus() {
      this.isRefusing = false;
      this.justification = "";
    },

    async refusPrestation() {
      console.log("id:", this.event._id);
      console.log("Justification");
      try {
        const body = {
          ...this.event,
          justification: this.justification,
        };
        const response = await fetch(
          `${process.env.VUE_APP_API}/refuserPrestation`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
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
