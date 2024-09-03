<template>
  <div>Album Photo {{ collectionName }}</div>
  <div>{{ photos }}</div>
</template>

<script>
import utils from "src/helpers/utils.ts";
export default {
  name: "DisplayPhotos",
  props: { collectionName: { type: String, required: true } },
  data() {
    return {
      photos: [], // Initialize photos as an empty array
    };
  },
  methods: {
    async getCollection() {
      try {
        const response = await fetch(
          `${process.env.API}/photos/${this.collectionName}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const photos = await response.json();
        this.photos.push(...photos);
      } catch (error) {
        console.error("Error getting photos:", error);
        utils.alert("Erreur lors de la récupération des photos");
      }
    },
  },
  mounted() {
    this.getCollection();
  },
};
</script>
