<template>
  <div class="row q-pa-lg">
    <div class="section-title col-4">Gérer les collections de photos</div>

    <q-btn
      outline
      label="Ajouter une collection"
      style="color: purple"
      @click="addingCollection = true"
    />
  </div>

  <div class="row q-px-lg" style="display: flex; align-items: center">
    <q-select
      rounded
      outlined
      v-model="selectedCollection"
      :options="options"
      label="Collection"
      class="col"
      style="width: 30%"
    />
    <q-btn
      outline
      label="Ajouter des photos à la collection"
      style="color: purple"
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
      style="color: purple"
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

  <q-dialog v-model="addingCollection">
    <q-card class="q-pa-md" style="width: 40%">
      <div class="titre-popup q-pb-md">Ajout d'une collection</div>
      <q-separator />
      <div class="q-pa-md">
        <q-input
          label="Veuillez entrer le nom de la nouvelle collection"
          v-model="nameCollection"
        />
        <div class="row" style="display: flex; align-items: center">
          <div class="q-pa-md col-4">
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
                Date: {{ utils.formatDate(date) }}
              </q-badge>
            </div>
          </div>

          <q-file
            outlined
            v-model="cover"
            label="Couverture de collection"
            class="col"
            @change="onCoverChange"
            v-if="!cover"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>

          <div v-else class="row" style="width: 60%">
            <div
              class="q-pa-md"
              style="border: solid black 1px; border-radius: 5px"
            >
              <q-img src="coverUrl()" class="col-9" />
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

      <div class="q-pt-md" style="display: flex; justify-content: end">
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
    <q-card class="q-pa-md" style="width: 30%">
      <div>Collection being deleted : {{ selectedCollection }}</div>
      <div class="q-pt-md" style="display: flex; justify-content: end">
        <q-btn outline label="Cancel" @click="deletingCollection = false" />
        <q-btn
          outline
          label="Ok"
          @click="deleteCollection(selectedCollection)"
        />
      </div>
    </q-card>
  </q-dialog>

  <q-dialog v-model="addingPhotos">
    <q-card class="q-pa-md" style="width: 30%">
      <div>Adding pictures to : {{ this.selectedCollection }}</div>
      <q-file outlined v-model="selectedFiles">
        <template>
          <div class="row" style="display: flex; align-items: center">
            <q-icon name="attach_file" class="col-1" />
            <div
              style="opacity: 0.5; font-size: medium; margin-left: 3px"
              class="col-11"
            >
              Select files to photos to collection
            </div>
          </div>
        </template>
        <div>{{ this.selectedFiles }}</div>
      </q-file>

      <div class="q-pt-md" style="display: flex; justify-content: end">
        <q-btn outline label="Cancel" @click="addingPhotos = false" />
        <q-btn outline label="Ok" @click="addPhotos()" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import utils from "src/helpers/utils.ts";
import { ref } from "vue";

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
      selectedFiles: "",
      cover: null,
    };
  },
  methods: {
    handleRefresh() {
      this.getCollections();
    },

    async getCollections() {
      try {
        const response = await fetch(`${process.env.API}/listCollections`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

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

    async addCollection(name, date, cover) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("date", date.toISOString());
      formData.append("cover", cover);

      console.log(formData);
      try {
        const response = await fetch(`${process.env.API}/createCollection`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        this.nameCollection = "";
        this.addingCollection = false;
        this.cover = null;
        this.date = new Date();
        this.proxyDate = new Date();
        this.getCollections();
        utils.validate("La collection a bien été créée");
      } catch (error) {
        console.error("Error adding collection:", error);
        utils.alert("Erreur lors de l'ajout de la collection");
      }
    },

    async deleteCollection(name) {
      name = name.toLowerCase();
      try {
        const response = await fetch(`${process.env.API}/deleteCollection`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        this.nameCollection = "";
        this.deletingCollection = false;
        this.selectedCollection = "";
        utils.validate("La collection a bien été supprimée");
        this.getCollections();
      } catch (error) {
        console.error("Error deleting collection:", error);
        utils.alert("Erreur lors de la suppression de la collection");
      }
    },

    async addPhotos() {},

    deselectCover() {
      if (this.cover) {
        URL.revokeObjectURL(this.cover);
        this.cover = null;
      }
    },

    onCoverChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.cover = file;
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
  color: black;
}
</style>
