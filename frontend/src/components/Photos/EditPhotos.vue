<template>
  <div class="row q-px-lg">
    <div class="section-title col-4">Photos</div>

    <q-btn
      outline
      label="Ajouter une collection"
      style="color: white"
      @click="addingCollection = true"
    />
  </div>

  <div style="display: flex; align-items: center">
    <q-select
      rounded
      outlined
      v-model="selectedCollection"
      :options="options"
      label="Collection"
      class="col"
      style="width: 30%"
      @update:modelValue="getCollection()"
      dark
      color="white"
      behavior="menu"
    />
    <q-btn
      outline
      label="Ajouter des photos à la collection"
      style="color: white"
      class="col"
      @click="
        if (selectedCollection) {
          addingPhotos = true;
        } else {
          this.utils.alert('Veuillez sélectionner une collection');
        }
      "
    />
    <q-btn
      outline
      label="Delete collection"
      style="color: white"
      class="col"
      @click="
        if (selectedCollection) {
          deletingCollection = true;
        } else {
          this.utils.alert('Veuillez sélectionner une collection');
        }
      "
    />
  </div>
  <q-scroll-area class="scroll-area-edit-photo">
    <div v-for="photo in photos" :key="photo._id" class="photo-container">
      <div v-if="photo._id != 'Titre'">
        <q-img :src="photo.photo" class="photo"> </q-img
        ><q-btn
          icon="eva-trash-outline"
          class="btn-hovered"
          flat
          @click="deletePhoto(photo, selectedCollection)"
          style="z-index: 1"
        />
      </div>
    </div>
  </q-scroll-area>

  <q-dialog v-model="addingCollection">
    <q-card class="col-dialog">
      <div
        class="centered titre-popup"
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          height: 7vh;
        "
      >
        <div>Ajout d'une collection</div>
      </div>

      <q-separator />
      <div class="q-pa-md">
        <q-input
          label="Nom de la nouvelle collection"
          v-model="nameCollection"
        />
        <div class="row" style="display: flex; align-items: center">
          <div class="q-pa-md col-6">
            <q-btn icon="event" round color="primary">
              <q-popup-proxy
                @before-show="updateProxy"
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="proxyDate">
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn label="Cancel" color="primary" flat v-close-popup />
                    <q-btn
                      label="OK"
                      color="primary"
                      flat
                      @click="save"
                      v-close-popup
                    />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-btn>
            <div class="q-mb-sm">
              <q-badge color="purple">
                {{ utils.formatDate(date) }}
              </q-badge>
            </div>
          </div>
          <q-file
            outlined
            v-model="cover"
            label="Couverture "
            accept="image/png, image/jpeg"
            class="col-6"
            @update:model-value="onCoverChange"
            v-if="!cover"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>

          <div v-else class="row q-pa-md" style="width: 60%">
            <div
              class="q-pa-md"
              style="border: solid black 1px; border-radius: 5px"
            >
              <q-img :src="coverUrl" class="col-9" />
            </div>
            <q-btn
              flat
              dense
              round
              icon="eva-close-outline"
              style="color: black"
              class="col-3"
              @click="deselectCover()"
            />
          </div>
        </div>
      </div>

      <q-separator />

      <div class="q-pa-md" style="display: flex; justify-content: end">
        <q-btn
          outline
          label="Cancel"
          @click="
            {
              addingCollection = false;
              nameCollection = '';
              date = new Date();
              proxyDate = new Date();
              cover = null;
            }
          "
        />
        <q-btn outline label="Ok" @click="submitCollection" />
      </div>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="deletingCollection"
    @keyup.enter="deleteCollection(selectedCollection)"
  >
    <q-card class="q-pa-md col-dialog">
      <div>Collection being deleted : {{ selectedCollection }}</div>
      <div class="q-pt-md" style="display: flex; justify-content: end">
        <q-btn
          outline
          label="Cancel"
          @click="deletingCollection = false"
          style="color: purple"
        />
        <q-btn
          outline
          label="Ok"
          @click="deleteCollection(selectedCollection)"
          style="color: purple"
        />
      </div>
    </q-card>
  </q-dialog>

  <q-dialog v-model="addingPhotos">
    <q-card class="q-pa-md col-dialog">
      <div style="margin-bottom: 15px; font-weight: 400">
        Adding pictures to : {{ selectedCollection }}
      </div>
      <q-file
        outlined
        multiple
        v-model="selectedFiles"
        accept=".jpg, .png, image/* "
        label="Photos"
      >
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>

      <div class="q-pt-md" style="display: flex; justify-content: end">
        <q-btn outline label="Cancel" @click="addingPhotos = false" />
        <q-btn
          outline
          label="Ok"
          @click="handleFileUpload(selectedCollection)"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import utils from "src/helpers/utils.ts";
import { ref } from "vue";
import SpinnerComponent from "../Other/SpinnerComponent.vue";
import { Loading } from "quasar";

export default {
  name: "EditPhotos",
  setup() {
    const date = ref(new Date());
    const proxyDate = ref(new Date());
    return {
      utils,
      date,
      proxyDate,

      updateProxy() {
        proxyDate.value = date.value;
      },

      save() {
        date.value = proxyDate.value;
      },
    };
  },
  data() {
    return {
      addingCollection: false,
      nameCollection: "",
      options: [],
      selectedCollection: "",
      deletingCollection: false,
      addingPhotos: false,
      selectedFiles: [],
      cover: null,
      file: null,
      photos: [],
    };
  },
  methods: {
    handleRefresh() {
      this.getCollections();
    },

    async handleFileUpload(collection) {
      Loading.show({ spinner: SpinnerComponent });
      try {
        const formData = new FormData();
        formData.append("collection", collection);

        this.selectedFiles.forEach((file, index) => {
          formData.append(`file_${index}`, file);
        });

        const response = await fetch(
          `${process.env.VUE_APP_API}/uploadPhotos`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        this.addingPhotos = false;
        this.selectedFiles = [];
        this.getCollection();
        Loading.hide();
        utils.validate("Photos ajoutées avec succès");
      } catch (error) {
        console.error("Error uploading photos:", error);
        utils.alert("Erreur lors du téléchargement des photos");
      }
    },

    async getCollections() {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_API}/listCollections`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        let collections = await response.json();
        const collectionNames = collections.map(
          (collection) => collection.name
        );
        this.nameCollection = "";
        this.addingCollection = false;
        this.options = collectionNames;
      } catch (error) {
        console.error("Error getting collections:", error);
        utils.alert("Erreur lors de la récupération des collections");
      }
    },

    async getCollection() {
      this.photos = [];
      try {
        const response = await fetch(
          `${
            process.env.VUE_APP_API
          }/photos/${this.selectedCollection.toLowerCase()}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const photos = await response.json();
        this.photos.push(...photos);
        console.log(this.photos);
      } catch (error) {
        console.error("Error getting photos:", error);
        utils.alert("Erreur lors de la récupération des photos");
      }
    },

    async addCollection(name, date, cover) {
      Loading.show({ spinner: SpinnerComponent });
      const allowedTypes = ["image/png", "image/jpeg"];
      if (cover && !allowedTypes.includes(cover.type)) {
        utils.alert("Mauvais type de fichier pour la couverture");
        return;
      }
      const formData = new FormData();
      formData.append("name", name);
      formData.append("date", date);
      if (cover) {
        formData.append("cover", cover);
      }

      try {
        const response = await fetch(
          `${process.env.VUE_APP_API}/createCollection`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        this.nameCollection = "";
        this.addingCollection = false;
        this.cover = null;
        this.date = new Date();
        this.proxyDate = new Date();
        this.getCollections();
        this.selectedCollection = name.toLowerCase();
        Loading.hide();
        utils.validate("La collection a bien été créée");
      } catch (error) {
        console.error("Error adding collection:", error);
        utils.alert("Erreur lors de l'ajout de la collection");
      }
    },

    async deleteCollection(name) {
      Loading.show({ spinner: SpinnerComponent });
      name = name.toLowerCase();
      try {
        const response = await fetch(
          `${process.env.VUE_APP_API}/deleteCollection`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }),
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        this.nameCollection = "";
        this.deletingCollection = false;
        this.selectedCollection = "";
        this.photos = [];

        this.getCollections();
        Loading.hide();
        utils.validate("La collection a bien été supprimée");
      } catch (error) {
        console.error("Error deleting collection:", error);
        utils.alert("Erreur lors de la suppression de la collection");
      }
    },

    deselectCover() {
      if (this.cover) {
        URL.revokeObjectURL(this.cover);
        this.cover = null;
      }
    },

    onCoverChange(newFile) {
      const file = newFile[0];
      if (file) {
        this.cover = file;
      } else {
        this.cover = null;
      }
    },

    submitCollection() {
      if (!this.nameCollection.trim()) {
        utils.alert("Veuillez entrer un nom pour la collection");
        return;
      }

      if (this.options.includes(this.nameCollection.toLowerCase())) {
        utils.alert("La collection existe déjà");
        return;
      }

      this.addCollection(this.nameCollection, this.date, this.cover);
    },

    async deletePhoto(photo, collection) {
      console.log("Deleting photo : ", photo);
      try {
        Loading.show({ spinner: SpinnerComponent });
        const response = await fetch(`${process.env.VUE_APP_API}/deletePhoto`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: photo._id, collection: collection }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        this.photos = this.photos.filter((p) => p._id !== photo._id);
        await this.getCollections();
        this.selectedCollection = collection;

        Loading.hide();
        utils.validate("La photo a bien été supprimée");
      } catch (error) {
        console.error("Error deleting photo:", error);
        utils.alert("Erreur lors de la suppression de la photo");
      }
    },
  },

  mounted() {
    this.getCollections();
  },

  computed: {
    coverUrl() {
      return this.cover ? URL.createObjectURL(this.cover) : "";
    },
  },
  watch: {
    cover(newVal) {
      if (this._oldCoverUrl) {
        URL.revokeObjectURL(this._oldCoverUrl);
      }
      this._oldCoverUrl = this.cover ? URL.createObjectURL(newVal) : "";
    },
  },
  beforeUnmount() {
    if (this._oldCoverUrl) {
      URL.revokeObjectURL(this._oldCoverUrl);
    }
  },
};
</script>

<style scoped>
.section-title {
  font-family: "calibri";
  font-size: 30px;
  font-weight: 200;
  color: white;
}

.titre-popup {
  font-size: 20px;
  color: white;
  background-color: purple;
  font-family: Aileron Bold;
}

.photo-container {
  position: relative;
  display: inline-block;
  margin: 10px;
}

.photo {
  height: 100px;
  width: 300px;
  object-fit: cover;
}

.btn-hovered {
  position: absolute;
  top: 5px;
  right: 5px;
  display: none;
  background-color: rgba(255, 255, 255, 0.8);
  color: black;
}

.photo-container:hover .btn-hovered {
  display: block;
}

.scroll-area-edit-photo {
  height: 50vh;

  @media (max-width: 767px) {
    display: flex;
    align-items: center;
    height: 45vh;
  }
}

.col-dialog {
  width: 40vw;

  @media (max-width: 767px) {
    width: 80vw;
  }

  border-radius: 10px;
}
</style>
