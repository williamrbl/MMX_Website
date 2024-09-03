<template>
  <div>Album Photo {{ collectionName }}</div>
  <div v-for="photo in photos" :key="photo">
    <div v-if="photo._id != 'Titre'">
      <q-img :src="photo.photo" class="photo" />
    </div>
  </div>
</template>

<script>
import utils from "src/helpers/utils.ts";
export default {
  name: "DisplayPhotos",
  props: { collectionName: { type: String, required: true } },
  data() {
    return {
      photos: [],
    };
  },
  methods: {
    async getCollection() {
      try {
        const response = await fetch(
          `${process.env.API}/photos/${this.collectionName.toLowerCase()}`,
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

<style>
.photo {
  height: 100px;
  width: 300px;
  border: 3px solid black;
}
</style>
