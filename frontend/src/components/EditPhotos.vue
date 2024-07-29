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
    <q-card class="q-pa-md" style="width: 30%">
      <q-input
        label="Veuillez entrer le nom de la nouvelle collection"
        v-model="nameCollection"
        @keyup.enter="addCollection(nameCollection)"
      />
      <div class="q-pt-md" style="display: flex; justify-content: end">
        <q-btn outline label="Cancel" @click="addingCollection = false" />
        <q-btn outline label="Ok" @click="addCollection(nameCollection)" />
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

export default {
  name: "EditPhotos",
  setup() {
    return {
      utils,
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
    };
  },
  methods: {
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

    async addCollection(name) {
      if (name.trim === "") {
        utils.alert("Veuillez entrer un nom pour la collection");
      } else if (this.options.includes(name.toLowerCase())) {
        utils.alert("La collection existe déjà");
      } else {
        name = name.toLowerCase();
        try {
          const response = await fetch(`${process.env.API}/createCollection`, {
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
          this.addingCollection = false;
          this.getCollections();
          utils.validate("La collection a bien été créée");
        } catch (error) {
          console.error("Error adding collection:", error);
          utils.alert("Erreur lors de l'ajout de la collection");
        }
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
        (this.deletedCollection = ""), (this.selectedCollection = "");
        utils.validate("La collection a bien été supprimée");
        this.getCollections();
      } catch (error) {
        console.error("Error adding collection:", error);
        utils.alert("Erreur lors de la suppression de la collection");
      }
    },

    async addPhotos() {},
  },

  mounted() {
    this.getCollections();
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
</style>
