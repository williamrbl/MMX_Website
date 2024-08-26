<template>
  <div class="texte">Toutes locations</div>
  <div
    v-for="location in this.locations"
    :key="location._id"
    class="row items-center q-mb-md"
  >
    <div class="col locations-text">{{ location.association }}</div>

    <div class="col locations-text">{{ location.start }}</div>
    <div class="col locations-text">{{ location.end }}</div>
  </div>
</template>

<script>
export default {
  name: "ComponentLocations",
  props: {
    locations: {
      type: Object,
      required: true,
    },
  },
};
</script>
