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
      class="row"
      :key="article._id"
      style="display: flex; flex-direction: column; margin-bottom: 10px"
    >
      <div class="row" style="display: flex; align-items: center">
        <div class="col" style="margin-bottom: 5px">{{ article._id }}</div>
        <div class="col" style="margin-bottom: 5px">
          {{ article.description }}
          <q-popup-edit v-model="article.description" auto-save v-slot="scope">
        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="handleEnter(scope)" />
      </q-popup-edit>
        </div>
        <div class="col" style="margin-bottom: 5px">
          <q-btn
            outline
            color="purple"
            label="Photo"
            @click="editPhotos(article)"
          />
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
          <div class="centered q-py-md">
            <q-file
              outlined
              v-model="newArticleFile"
              label="Photo"
              style="width: 50%"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>
        </div>
        <div class="q-pt-md" style="display: flex; justify-content: end">
          <q-btn outline label="Cancel" @click="addingArticle = false" />
          <q-btn outline label="Ok" @click="addArticle()" />
        </div>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog v-model="isPhotoModif">
    <q-card style="width: 60%; height: 50%">
      <div style="display: flex; justify-content: end">
        <q-btn
          flat
          dense
          icon="eva-close"
          @click="
            {
              isPhotoModif = false;
              modifPhoto = '';
            }
          "
        />
      </div>
      <div class="centered">
        <q-img
          :src="modifPhoto"
          style="width: 60%; height: 60%"
          v-if="modifPhoto"
        />
        <q-file outlined v-model="file" v-else>
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
      </div>
      <div class="centered">
        <q-btn
          flat
          dense
          icon="eva-trash-outline"
          @click="deletePhotoCaroussel(currentArticle)"
          v-if="modifPhoto"
        />
        <q-btn
          outline
          color="purple"
          label="Add Photo"
          @click="addPhotoCarrousel"
          v-if="file"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import utils from "src/helpers/utils.ts";
import { nextTick } from "vue";

export default {
  name: "EditCarroussel",
  data() {
    return {
      articles: [],
      addingArticle: false,
      inputName: "",
      inputDescription: "",
      isPhotoModif: false,
      modifPhoto: "",
      currentArticle: null,
      file: null,
    };
  },
  methods: {
    handleRefresh(){
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
        this.articles = await response.json();
      } catch (error) {
        console.error("Error getting articles:", error);
        utils.alert("Erreur lors de la récupération des articles");
      }
    },

    async addArticle() {
      if (this.articles.length >= 4) {
        utils.alert("Vous avez atteint le nombre maximal de pages");
      } else if (this.inputName == "" || this.inputDescription == "") {
        utils.alert("Veuillez remplir toutes les informations");
      } else {
        const formData = new FormData();
        formData.append("_id", this.inputName);
        formData.append("type", "article");
        formData.append("description", this.inputDescription);

        try {
          const response = await fetch(`${process.env.API}/addCaroussel`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          this.inputName = "";
          this.inputDescription = "";
          await this.getArticles();
          utils.validate("La page a bien été ajoutée");
          this.addingArticle = false;
        } catch (error) {
          console.error("Error adding article:", error);
          utils.alert("Erreur lors de l'ajout de l'article");
        }
      }
    },

    async updateArticle(){
      console.log(this.articles)
      try {
        const response = await fetch(`${process.env.API}/updateCaroussel`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.articles),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        await this.getArticles();
        utils.validate("L'article à été mis à jour !");
      } catch (error) {
        console.error("Error updating article:", error);
        utils.alert("Erreur lors de la MAJ de l'article");
      }
    },

    async deleteArticle() {
      try {
        const response = await fetch(`${process.env.API}/deleteCaroussel`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.articles),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        await this.getArticles();
        utils.validate("La page a bien été supprimée");
      } catch (error) {
        console.error("Error deleting article:", error);
        utils.alert("Erreur lors de la suppression de l'article");
      }
    },

    editPhotos(article) {
      this.isPhotoModif = true;
      this.modifPhoto = article.photo;
      this.currentArticle = article;
    },

    async deletePhotoCaroussel() {
      if (!this.currentArticle) return;

      try {
        const response = await fetch(
          `${process.env.API}/deletePhotoCaroussel`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.currentArticle),
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        utils.validate("La photo a bien été supprimée");
        this.modifPhoto = "";
        this.currentArticle.photo = "";
        await this.getArticles();
      } catch (error) {
        console.error("Error deleting photo:", error);
        utils.alert("Erreur lors de la suppression de la photo");
      }
    },

    async addPhotoCarrousel() {
      if (!this.file || !this.currentArticle) {
        utils.alert(
          "Please select a file and make sure you have an article selected."
        );
        return;
      }

      const formData = new FormData();
      formData.append("photo", this.file);
      formData.append("_id", this.currentArticle._id);

      try {
        const response = await fetch(`${process.env.API}/addPhotoCaroussel`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        utils.validate("Photo added successfully");
        this.isPhotoModif = false;
        this.file = null;
        this.modifPhoto = "";
        await this.getArticles();
      } catch (error) {
        console.error("Error adding photo to carousel:", error);
        utils.alert("Error adding photo to carousel");
      }
    },

    async handleEnter(scope){
      scope.set();
      await nextTick();
      console.log(this.articles)
      this.updateArticle();
    }
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
