<template>
  <q-btn
    flat
    round
    icon="eva-plus"
    style="border: 1px solid white"
    @click="handleAdd(position)"
  />
  <q-dialog v-model="isAddImage">
    <q-card class="add-img-card">
      <div class="header">
        {{
          position === "haut"
            ? "Ajouter une image de tête"
            : "Ajouter une image de bas de page"
        }}
      </div>
      <div class="q-pa-md">
        <q-file outlined v-model="uploadImage" label="Image à ajouter">
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
        <div v-show="uploadImage.length > 0">{{ uploadImage }}</div>
        <q-img v-show="uploadImage.length > 0" :src="uploadImage" />

        <div style="display: flex; align-items: end; margin-top: 10px">
          <q-btn
            outline
            color="purple"
            label="Cancel"
            @click="
              {
                isAddImage = false;
                uploadImage = [];
              }
            "
          />
          <q-btn
            outline
            color="purple"
            label="Valider"
            @click="addImage(position)"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import utils from "src/helpers/utils.ts";
export default {
  name: "AddImageDialog",
  emits: ["get-images"],
  props: {
    position: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
  },
  setup() {
    return { utils };
  },
  data() {
    return {
      isAddImage: false,
      uploadImage: [],
    };
  },
  methods: {
    handleAdd(position) {
      console.log(this.images);
      console.log(position);
      if (position == "haut") {
        if (this.imagesHaut.length >= 5) {
          utils.alert("Impossible d'ajouter plus de photos en tête de page");
        } else {
          this.addImage(position);
        }
      } else {
        if (this.imagesBas.length >= 5) {
          utils.alert("Impossible d'ajouter plus de photos en bas de page");
        } else {
          this.isAddImage = true;
        }
      }
    },

    async addImage(position) {
      if (!this.uploadImage) {
        utils.alert("Veuillez sélectionner une image à ajouter");
      } else {
        console.log("Adding image to : ", position);

        const formData = new FormData();
        formData.append("position", this.position);
        formData.append("image", this.uploadImage);

        try {
          const response = await fetch(
            process.env.VUE_APP_API + "/uploadImagePrestations",
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          this.isAddImage = false;
          this.uploadImage = {};
          this.$emit("get-images");
        } catch (error) {
          console.log(`Erreur lors de l'ajout de l'image': ${error.message}`);
        }
      }
    },
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
.add-img-card {
  width: 50vw;
}
</style>
