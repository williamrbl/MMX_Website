<template>
  <div class="texte">Locations à finaliser</div>
  <div
    v-for="location in filteredLocationsARegler"
    :key="location._id"
    class="row items-center q-mb-md"
  >
    <div class="col locations-text">{{ location.association }}</div>
    <div
      class="col row locations-text"
      style="display: flex; align-items: center"
    >
      <q-checkbox
        class="col-2"
        v-model="location.paye"
        @click="updateLocation()"
      />
      <div v-if="location.paye == false" class="col">Location non réglée</div>
      <div v-else class="col">Location réglée</div>
    </div>
    <div
      class="col row locations-text"
      style="display: flex; align-items: center"
    >
      <q-checkbox
        class="col-2"
        v-model="location.caution"
        @click="updateLocation()"
      />
      <div v-if="location.caution == false" class="col">Caution non reçue</div>
      <div v-else class="col">Caution reçue</div>
    </div>
    <div class="col locations-text">{{ location.start }}</div>
    <div class="col locations-text">{{ location.end }}</div>
  </div>
</template>

<script>
export default {
  name: "ComponentAfinaliser",
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
            location.contrat == null
        )
        .map(([key, location]) => location);
    },
  },
};
</script>
