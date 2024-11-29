<template>
  <q-btn
    label="Demandes"
    @click="isDemandes = true"
    outline
    color="white"
    class="notification"
    ><q-badge
      v-if="listeDemande.length"
      rounded
      color="red"
      floating
      transparent
      class="blinking-badge"
      style="position: absolute; top: -5px; right: -5px"
      :label="listeDemande.length"
    />
  </q-btn>
  <q-dialog v-model="isDemandes">
    <q-card class="size-dialog">
      <div class="header">Demandes de prestations</div>
      <div class="q-pa-md" style="height: 100%">
        <div v-if="events.filter((event) => event.demande).length === 0">
          Aucune demande de prestation
        </div>
        <div
          v-else
          v-for="event in listeDemande"
          :key="event._id"
          class="row"
          style="
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 5px;
          "
        >
          <div>{{ event.organisateur }}</div>
          <DemandePrestation
            :event="event"
            @update-events="this.$emit('update-events')"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import DemandePrestation from "./DemandePrestation.vue";

export default {
  name: "ListeDemandes",
  components: { DemandePrestation },
  emits: ["update-events"],
  data() {
    return {
      isDemandes: false,
    };
  },
  props: {
    events: {
      Type: Object,
      Required: true,
    },
  },
  computed: {
    listeDemande() {
      return this.events.filter((event) => event.demande === true);
    },
  },
};
</script>

<style scoped>
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
