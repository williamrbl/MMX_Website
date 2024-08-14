<template>
  <div class="row q-pa-lg">
    <div class="section-title col-4">
      Gérer l'affichage du caroussel d'accueil
    </div>
    <q-btn
      outline
      color="primary"
      label="Ajouter un article"
      @click="addingArticle = true"
    />
  </div>

  <div
    class="col"
    style="
      color: white;
      border: 1px solid purple;
      border-radius: 10px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: stretch;
    "
  >
    <div
      v-for="article in articles"
      class="row q-pa-md"
      :key="article._id"
      style="
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;

      "
    >
      <div class="row q-pa-lg" style="border: 1px solid blueviolet; border-radius: 5px; display: flex; align-items: center;">
        <div class="col" style="margin-bottom: 5px">{{ article._id }}</div>
        <div class="col" style="margin-bottom: 5px">
          {{ article.description }}
        </div>
        <q-btn
          flat
          dense
          icon="eva-trash-outline"
          class="row"
          @click="deleteArticle(article)"
        />
      </div>
    </div>
  </div>

  <q-dialog v-model="addingArticle">
    <q-card style="width: 50%">
      <div class="q-pa-md">
        <div>
          <q-input v-model="inputName" label="Name of the article" />
          <q-input v-model="inputDescription" label="Description" />
        </div>
        <q-separator />
        <div class="q-pt-md" style="display: flex; justify-content: end">
          <q-btn outline label="Cancel" @click="addingArticle = false" />
          <q-btn outline label="Ok" @click="addArticle()" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import utils from "src/helpers/utils.ts";
import { ref } from "vue";

export default {
  name: "EditCarroussel",
  data() {
    return {
      articles: [],
      addingArticle: false,
      inputName: "",
      inputDescription: "",
    };
  },
  methods: {
    handleRefresh() {
      this.getArticles();
    },

    async getArticles() {
      try {
        const response = await fetch(`${process.env.API}/articles`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        this.articles = await response.json(); // Make sure this updates `articles`
      } catch (error) {
        console.error("Error getting articles:", error);
        utils.alert("Erreur lors de la récupération des articles");
      }
    },

    async addArticle() {
      if (this.articles.length >= 4) {
        // Updated check for array length
        utils.alert("Vous avez atteint le nombre maximal de pages");
      } else {
        const formData = new FormData();
        formData.append("_id", this.inputName);
        formData.append("type", "article");
        formData.append("description", this.inputDescription);
        formData.append("article", "");
        formData.append("photo", "");
        try {
          const response = await fetch(`${process.env.API}/addCarousselPage`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          this.inputName = "";
          this.inputDescription = "";
          await this.getArticles(); // Ensure the data is updated
          utils.validate("La page a bien été ajoutée");
          this.addingArticle = false;
        } catch (error) {
          console.error("Error adding article:", error);
          utils.alert("Erreur lors de l'ajout de l'article");
        }
      }
    },

    async deleteArticle(article) {
      try {
        const response = await fetch(`${process.env.API}/deleteCarousselPage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(article),
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        await this.getArticles(); // Ensure the data is updated
        utils.validate("La page a bien été supprimée");
      } catch (error) {
        console.error("Error deleting article:", error);
        utils.alert("Erreur lors de la suppression de l'article");
      }
    },
  },
  mounted() {
    this.getArticles();
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
