<template>
  <div class="row items-center">
    <div style="display: flex; justify-content: space-between; width: 90%">
      <div class="section-title">Prestations</div>
      <q-btn icon="eva-arrow-ios-back-outline" @click="emitReturn()" />
    </div>
    <q-scroll-area class="scroll-area">
      <div class="row" style="display: flex; flex-direction: row; width: 100%">
        <q-card class="card-images q-pa-md">
          <div>Gestion des images de tête</div>
          <div
            class="row q-gutter-md q-pa-md"
            style="width: 100%; height: 100%"
          >
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
              <q-btn
                flat
                icon="eva-trash"
                class="trash-icon"
                @click="deleteImage(image)"
              />
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

        <div
          class="row q-py-lg"
          style="width: 100%; display: flex; align-items: center"
        >
          <q-input
            v-model="texte"
            label="Texte de description des prestations"
            dark
            color="white"
            type="textarea"
            class="input-desc col-9"
          />
          <q-btn
            label="Valider"
            style="
              color: white;
              background-color: purple;
              border: 1px solid white;
              height: 20px;
            "
            @click="updateDescriptionText()"
          />
        </div>

        <q-card class="card-images q-pa-md">
          <div>Gestion des images de bas de page</div>
          <div
            class="row q-gutter-md q-pa-md"
            style="width: 100%; height: 100%"
          >
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
              <q-btn
                flat
                icon="eva-trash"
                class="trash-icon"
                @click="deleteImage(image)"
              />
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
    </q-scroll-area>
  </div>
</template>

<script>
import AddImageDialog from "./AddImageDialog.vue";
import { Loading } from "quasar";
import SpinnerComponent from "../Other/SpinnerComponent.vue";

export default {
  name: "CustomPrestationsPage",
  components: { AddImageDialog },
  data() {
    return {
      texte: "",
      images: [],
    };
  },
  emits: ["return-prestations"],
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

    async deleteImage(image) {
      console.log("Image deleted : ", image);
      Loading.show({
        spinner: SpinnerComponent,
      });
      try {
        const response = await fetch(process.env.VUE_APP_API + "/deleteImage", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(image),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        this.getImages();
        Loading.hide();
      } catch (error) {
        console.log(
          "Erreur lors de la suppression de l'image : ",
          error.message
        );
      }
    },

    async getDescription() {
      try {
        const response = await fetch(
          process.env.VUE_APP_API + "/getDescription",
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const res = await response.json();
        this.texte = res[0].texte;
      } catch (error) {
        console.log(
          "Erreur lors de la récupération de la description : ",
          error.message
        );
      }
    },

    async updateDescriptionText() {
      console.log("updating description");
      const formData = new FormData();
      formData.append("description", this.texte);

      try {
        const response = await fetch(
          process.env.VUE_APP_API + "/updateDescription",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        this.getDescription();
      } catch (error) {
        console.log(
          "Erreur lors de la mise à jour de la description : ",
          error.message
        );
      }
    },

    emitReturn() {
      this.$emit("return-prestations");
    },
  },
  async mounted() {
    await this.getImages();
    await this.getDescription();
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

.scroll-area {
  height: 60vh;
  width: 100%;
  @media (max-width: 767px) {
    height: 53vh;
  }
}
</style>
