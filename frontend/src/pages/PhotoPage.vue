<template>
  <q-img
    :src="fond"
    class="taille-page"
    style="
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    "
  >
    <div style="width: 100%">
      <div class="position-album">
        <div class="album-text">Album photos</div>
      </div>
      <div class="collection-container">
        <q-scroll-area class="scroll-area">
          <div class="card-wrapper">
            <div v-for="(collection, idx) in sortedData" :key="idx">
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
        </q-scroll-area>
      </div>
    </div>
  </q-img>
</template>

<script>
import utils from "src/helpers/utils.ts";
import fond from "src/assets/Fond.jpg";

export default {
  data() {
    return {
      collections: [],
      data: [],
      fond,
    };
  },
  computed: {
    sortedData() {
      const filteredData = this.data.filter(
        (collection) => collection._id === "Titre"
      );

      const sorted = filteredData.slice().sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        console.log("Comparing dates:", dateA, dateB);
        return dateB - dateA;
      });
      return sorted;
    },
  },
  setup() {
    return {
      utils,
    };
  },
  methods: {
    async getCollections() {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_API}/listCollections`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
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
          `${process.env.VUE_APP_API}/photos/${collectionName}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const photos = await response.json();
        this.data.push(...photos);
      } catch (error) {
        console.error("Error getting photos:", error);
        utils.alert("Erreur lors de la récupération des photos");
      }
    },

    async fetchAllPhotos() {
      await this.getCollections();
      for (const collection of this.collections) {
        await this.getPhotos(collection);
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

<style>
.height-image {
  height: 80vh;
  @media (max-width: 767px) {
    height: 82.5vh;
  }
}
</style>

<style scoped>
.collection-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.scroll-area {
  width: 95%;
  height: 76vh;
  @media (max-width: 767px) {
    height: 70.5vh;
  }
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  height: 86.5vh;
  width: 100%;
}

.collection-card {
  background-color: purple;
  width: 280px;
  margin: 8px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.collection-image {
  height: 180px;
  object-fit: cover;
}

.collection-name {
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  font-family: Arupala Grotesk Ultra;
}

.collection-date {
  font-size: 0.875rem;
  opacity: 0.7;
  color: white;
  font-family: Aileron Light;
}

.view-photos-button {
  margin-top: 8px;
  color: white;
}

.position-album {
  display: flex;
  align-items: center;
  margin-left: 5%;
  @media (max-width: 767px) {
    justify-content: center;
    margin-left: 0%;
  }
  width: 100%;
}
.album-text {
  font-size: 30px;
  color: white;
  z-index: 0;
  margin-bottom: 20px;
  font-family: Arupala Grotesk Ultra;
}
</style>
