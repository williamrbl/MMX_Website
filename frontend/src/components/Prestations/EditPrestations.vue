<template>
  <div class="row items-center">
    <div class="section-title">Prestations</div>
    <div class="row" style="display: flex; flex-direction: row; width: 100%">
      <q-card class="card-images q-pa-md">
        <div>Gestion des images de tête</div>
        <div class="row q-gutter-md q-pa-md" style="width: 100%; height: 100%">
          <div
            v-for="image in imagesHaut"
            :key="image._id"
            class="image-container col"
          >
            <q-img
              :src="image.photo"
              alt="Image"
              style="width: 100%; height: 100%"
            />
            <q-btn flat icon="eva-trash" class="trash-icon" />
          </div>

          <div class="col centered">
            <AddImageDialog
              :position="'haut'"
              :images="images"
              @get-images="this.getImages"
            />
          </div>
        </div>
      </q-card>

      <q-input
        v-model="texte"
        label="Texte de description des prestations"
        dark
        color="white"
        type="textarea"
        class="input-desc"
      />

      <q-card class="card-images q-pa-md">
        <div>Gestion des images de bas de page</div>
        <div class="row q-gutter-md q-pa-md" style="width: 100%; height: 100%">
          <div
            v-for="image in imagesBas"
            :key="image._id"
            class="image-container col"
          >
            <q-img
              :src="image.photo"
              alt="Image"
              style="width: 100%; height: 100%"
            />
            <q-btn flat icon="eva-trash" class="trash-icon" />
          </div>
          <div class="col centered">
            <AddImageDialog
              :position="'bas'"
              :images="images"
              @get-images="this.getImages"
            />
          </div>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script>
import AddImageDialog from "./AddImageDialog.vue";

export default {
  name: "EditPrestations",
  components: { AddImageDialog },
  data() {
    return {
      texte: "",
      images: [],
    };
  },

  methods: {
    async getImages() {
      try {
        const response = await fetch(
          process.env.VUE_APP_API + "/getImagesPrestations",
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        this.images = data;
        this.isAddImage = false;
        this.uploadImage = {};
      } catch (error) {
        console.log(`Erreur lors de l'ajout de l'image': ${error.message}`);
      }
    },
  },
  async mounted() {
    await this.getImages();
  },

  computed: {
    imagesHaut() {
      return this.images.filter((image) => image.photo.includes("haut"));
    },
    imagesBas() {
      return this.images.filter((image) => image.photo.includes("bas"));
    },
  },
};
</script>

<style scoped>
.input-desc {
  width: 100%;
}

.card-images {
  width: 100%;
  background-color: purple;
  height: 20vh;
}

.image-container {
  padding: 5px;
  position: relative;
  height: 100%;
}

.trash-icon {
  visibility: hidden;
  position: absolute;
  top: 8px;
  right: 8px;
}

.image-container:hover .trash-icon {
  visibility: visible;
}
</style>
