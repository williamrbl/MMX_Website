<template>
  <q-btn outline dense label="Gestion de l'événement" @click="gererEvent()" />

  <q-dialog v-model="isGestion">
    <q-card class="size-dialog">
      <div class="header">
        Gestion de l'événement - {{ event.organisateur }}-{{ event.date }}
      </div>
      <div class="q-pa-md">
        <div>Date : {{ utils.formatDate(event.date) }}</div>
        <div>Organisateur : {{ event.organisateur }}</div>
        <div>Lieu : {{ event.lieu }}</div>
        <div>Description : {{ event.description }}</div>
        <div style="display: flex; justify-content: end; margin-top: 10px">
          <q-btn
            outline
            dense
            color="red"
            label="Supprimer l'événement"
            @click="checkSupp()"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog v-model="isVerifSupp">
    <q-card>
      <div class="header">Suppression d'événement</div>
      <div class="q-pa-md">
        <div>
          L'événement de {{ event.organisateur }} va être supprimé. Voulez vous
          continuer ?
        </div>
        <div style="display: flex; justify-content: end; margin-top: 10px">
          <q-btn
            outline
            dense
            color="purple"
            label="Annuler"
            @click="this.isVerifSupp = false"
          />
          <q-btn
            outline
            dense
            color="purple"
            label="Supprimer"
            @click="deleteEvent()"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import utils from "src/helpers/utils.ts";
import { Loading } from "quasar";
import SpinnerComponent from "../Other/SpinnerComponent.vue";
export default {
  name: "GestionEvent",
  emits: ["update-events"],
  data() {
    return {
      isGestion: false,
      isVerifSupp: false,
    };
  },
  setup() {
    return { utils };
  },
  props: {
    event: {
      type: Object,
      Required: true,
    },
  },
  methods: {
    gererEvent() {
      this.isGestion = true;
    },

    checkSupp() {
      this.isVerifSupp = true;
    },

    async deleteEvent() {
      try {
        Loading.show({ spinner: SpinnerComponent });
        const formData = new FormData();
        formData.append("id", this.event._id);
        const response = await fetch(
          `${process.env.VUE_APP_API}/deletePrestation`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        Loading.hide();
        this.isGestion = false;
        this.$emit("update-events");
        utils.validate("L'événement à bien été supprimé");
      } catch (error) {
        console.error("Error getting events", error);
      }
    },
  },
};
</script>
