<template>
  <div>Edit photos</div>

  <q-btn
    outline
    label="Ajouter une collection"
    style="color: purple"
    @click="addingCollection = true"
  />

  <q-select v-model="model" :options="options" label="Collection" />

  <q-dialog v-model="addingCollection">
    <q-card class="q-pa-md" style="width: 30%">
      <q-input
        label="Veuillez entrer le nom de la nouvelle collection"
        v-model="nameCollection"
      />
      <div class="q-pt-md" style="display: flex; justify-content: end">
        <q-btn outline label="Cancel" @click="addingCollection = false" />
        <q-btn outline label="Ok" @click="addCollection(nameCollection)" />
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
    };
  },
  methods: {
    async addCollection(name) {
      if (name.trim === "") {
        console.log("error");
        utils.alert("Veuillez entrer un nom pour la collection");
      } else {
        name = name.toLowerCase();
        try {
          const response = await fetch(
            `http://localhost:3000/createCollection`,
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
          this.addingCollection = false;
        } catch (error) {
          console.error("Error adding collection:", error);
          utils.alert("Erreur lors de l'ajout de la collection");
        }
      }
    },

    async getCollections() {
      try {
        const response = await fetch(`http://localhost:3000/listCollections`, {
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
        console.error("Error adding collection:", error);
        utils.alert("Erreur lors de l'ajout de la collection");
      }
    },
  },

  mounted() {
    this.getCollections();
  },
};
</script>
