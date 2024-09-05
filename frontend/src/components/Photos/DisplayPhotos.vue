<template>
  <q-img src="src/assets/Fond.jpg">
    <div class="album-text">Album Photo {{ collectionName }}</div>
    <div class="page-container" v-if="photos.length > 1">
      <div class="photo-flex">
        <div v-for="photo in photos" :key="photo._id">
          <div v-if="photo._id !== 'Titre'">
            <q-img
              :src="photo.photo"
              class="photo"
              @click="openPhotoViewer(photo.photo)"
            />
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="isPhotoViewerOpen" class="dialog-container">
      <q-card class="dialog-card">
        <div class="header">
          <q-btn
            flat
            dense
            icon="eva-close-outline"
            class="close-btn"
            @click="closePhotoViewer"
          />
        </div>
        <q-img :src="currentPhoto" class="full-photo" />
      </q-card>
    </q-dialog>
  </q-img>
</template>

<script>
import utils from "src/helpers/utils.ts";
export default {
  name: "DisplayPhotos",
  props: { collectionName: { type: String, required: true } },
  data() {
    return {
      photos: [],
      isPhotoViewerOpen: false, // For controlling the photo viewer modal
      currentPhoto: "",
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

    openPhotoViewer(photoUrl) {
      this.currentPhoto = photoUrl;
      this.isPhotoViewerOpen = true;
    },

    closePhotoViewer() {
      this.isPhotoViewerOpen = false;
      this.currentPhoto = "";
    },
  },
  mounted() {
    this.getCollection();
  },
};
</script>

<style scoped>
.album-text {
  font-size: 30px;
  color: white;
  z-index: 1;
}

.page-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  width: 100%;
  text-align: center;
}

.photo-flex {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.photo {
  width: 350px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.photo:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.dialog-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-card {
  overflow: hidden;
  width: 100vw;
}

.full-photo {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.header {
  background-color: purple;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 16px;
  height: 40px;
}

.close-btn {
  color: white;
}
</style>
