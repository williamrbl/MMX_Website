<template>
  <q-img src="src/assets/Fond.jpg">
    <div class="collection-container">
      <div v-for="(collection, idx) in data" :key="idx">
        <q-card
          class="collection-card"
          v-if="collection._id === 'Titre'"
          flat
          bordered
        >
          <q-img :src="collection.img" class="collection-image" />
          <q-card-section>
            <h3 class="collection-name">{{ collection.nom }}</h3>
            <p class="collection-date">
              {{ utils.formatDate(collection.date) }}
            </p>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              outline
              label="Voir les photos"
              class="view-photos-button"
              @click="viewPhotos(collection)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-img>
</template>

<script>
import utils from "src/helpers/utils.ts";

export default {
  data() {
    return {
      collections: [],
      data: [], // Array of photo objects
    };
  },
  setup() {
    return {
      utils,
    };
  },
  methods: {
    async getCollections() {
      try {
        const response = await fetch(`${process.env.API}/listCollections`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const collections = await response.json();
        this.collections = collections.map((collection) => collection.name);
      } catch (error) {
        console.error("Error getting collections:", error);
        utils.alert("Erreur lors de la récupération des collections");
      }
    },

    async getPhotos(collectionName) {
      try {
        const response = await fetch(
          `${process.env.API}/photos/${collectionName}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const photos = await response.json();
        this.data.push(...photos); // Assuming photos is an array
      } catch (error) {
        console.error("Error getting photos:", error);
        utils.alert("Erreur lors de la récupération des photos");
      }
    },

    async fetchAllPhotos() {
      await this.getCollections();
      for (const collection of this.collections) {
        await this.getPhotos(collection); // Fetch photos sequentially
      }
    },

    viewPhotos(collection) {
      this.$router.push(`/photos/${collection.nom}`);
    },
  },

  mounted() {
    this.fetchAllPhotos();
  },

  unmounted() {
    this.data = [];
  },
};
</script>

<style scoped>
.collection-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  padding: 16px;
}

.collection-card {
  background-color: purple;
  width: 300px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.collection-image {
  height: 200px;
  object-fit: cover;
}

.collection-name {
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
}

.collection-date {
  font-size: 0.875rem;
  opacity: 0.7;
  color: white;
}

.view-photos-button {
  margin-top: 8px;
  color: white;
}
</style>
