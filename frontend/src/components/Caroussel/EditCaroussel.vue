<template>
  <div class="row q-px-lg">
    <div class="section-title col-4">Caroussel</div>
    <q-btn
      outline
      color="white"
      label="Ajouter un article"
      @click="addingArticle = true"
    />
  </div>
  <div
    class="col"
    style="
      color: white;
      border: 1px solid white;
      border-radius: 10px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: center;
    "
  >
    <div
      v-for="article in articles"
      class="row"
      :key="article._id"
      style="display: flex; flex-direction: column"
    >
      <div class="row q-pa-md" style="display: flex; align-items: center">
        <div class="col">{{ article._id }}</div>
        <div class="col">
          {{ article.description }}
          <q-popup-edit v-model="article.description" auto-save v-slot="scope">
            <div class="row">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                class="col-10"
                @keydown.enter="
                  () => {
                    handleEnter({ article, value: scope.value });
                    scope.cancel();
                  }
                "
              />
              <q-btn
                flat
                dense
                icon="eva-checkmark-outline"
                @click="
                  () => {
                    handleEnter({ article, value: scope.value });
                    scope.cancel();
                  }
                "
              />
            </div>
          </q-popup-edit>
        </div>
        <div class="col">
          <q-btn
            outline
            color="white"
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

  <!-- Add Article Dialog -->
  <q-dialog v-model="addingArticle">
    <q-card style="width: 50%">
      <div class="q-pa-md">
        <div>
          <q-input v-model="inputName" label="Name of the article" />
          <q-input v-model="inputDescription" label="Description" />
          <div class="centered q-py-md">
            <q-file
              outlined
              ref="fileInput"
              label="Photo"
              accept="image/png, image/jpeg"
              style="width: 50%"
              @input="handleFileUpload"
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
    <q-card
      class="size-modif-photo"
      style="
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 16px;
      "
    >
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <q-btn
          flat
          dense
          icon="eva-close"
          @click="
            () => {
              isPhotoModif = false;
              modifPhoto = '';
            }
          "
          class="large-screen-only"
        />
      </div>

      <div
        class="centered"
        style="
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <q-img
          :src="modifPhoto"
          style="max-width: 100%; max-height: 100%"
          v-if="modifPhoto"
        />
        <q-file
          outlined
          ref="photoInput"
          v-else
          @input="handleFileSelection"
          style="width: 100%"
        >
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
          @click="deletePhotoCaroussel"
          v-if="modifPhoto"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import utils from "src/helpers/utils.ts";

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
    async getArticles() {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_API}/caroussel/articles`,
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
        this.articles = await response.json();
      } catch (error) {
        console.error("Error getting articles:", error);
        utils.alert("Erreur lors de la récupération des articles");
      }
    },

    async addArticle() {
      const allowedTypes = ["image/png", "image/jpeg"];
      if (this.articles.length >= 4) {
        utils.alert("Vous avez atteint le nombre maximal de pages");
      } else if (
        this.inputName === "" ||
        this.inputDescription === "" ||
        !this.file
      ) {
        utils.alert("Veuillez remplir toutes les informations");
      } else if (!allowedTypes.includes(this.file.type)) {
        utils.alert("Mauvais type de fichier");
      } else {
        const formData = new FormData();
        formData.append("_id", this.inputName);
        formData.append("type", "article");
        formData.append("description", this.inputDescription);
        if (this.file) {
          formData.append("photo", this.file);
        }

        try {
          const response = await fetch(
            `${process.env.VUE_APP_API}/addCaroussel`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          this.inputName = "";
          this.inputDescription = "";
          this.file = null;
          await this.getArticles();
          utils.validate("La page a bien été ajoutée");
          this.addingArticle = false;
        } catch (error) {
          console.error("Error adding article:", error);
          utils.alert("Erreur lors de l'ajout de l'article");
        }
      }
    },

    async updateArticlePhoto() {
      console.log(this.currentArticle);
      if (this.currentArticle && this.currentArticle.photo instanceof File) {
        const formData = new FormData();
        formData.append("photo", this.currentArticle.photo);
        formData.append("_id", this.currentArticle._id);

        try {
          const response = await fetch(
            `${process.env.VUE_APP_API}/updateArticlePhoto`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          const updatedArticle = await response.json();
          const index = this.articles.findIndex(
            (article) => article._id === updatedArticle._id
          );
          if (index !== -1) {
            this.articles.splice(index, 1, updatedArticle);
            utils.validate("Photo mise à jour avec succès !");
          }
          this.getArticles();
        } catch (error) {
          console.error("Error updating photo:", error);
          utils.alert("Erreur lors de la mise à jour de la photo");
        }
      }
    },

    editPhotos(article) {
      this.isPhotoModif = true;
      this.modifPhoto = article.photo;
      this.currentArticle = article;
    },

    async handleEnter(scope) {
      const updatedArticles = this.articles.map((article) => {
        if (article._id === scope.article._id) {
          return {
            ...article,
            description: scope.value,
          };
        }
        return article;
      });

      try {
        const response = await fetch(
          `${process.env.VUE_APP_API}/updateCaroussel`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedArticles),
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        await this.getArticles();
        utils.validate("Articles mise à jour avec succès !");
      } catch (error) {
        console.error("Error updating articles:", error);
        utils.alert("Erreur lors de la mise à jour des articles");
      }
    },

    handleFileSelection(event) {
      const fileInput = event.target.files[0];
      if (fileInput && this.currentArticle) {
        this.currentArticle.photo = fileInput;
        this.modifPhoto = URL.createObjectURL(fileInput);
        this.updateArticlePhoto();
      }
    },

    handleFileUpload(event) {
      const fileInput = event.target.files[0];
      if (fileInput) {
        this.file = fileInput;
      }
    },

    async deleteArticle(article) {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_API}/deleteCaroussel`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(article),
          }
        );

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

    async deletePhotoCaroussel() {
      if (!this.currentArticle) return;

      try {
        const response = await fetch(
          `${process.env.VUE_APP_API}/deletePhotoCaroussel`,
          {
            method: "DELETE",
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
  },
  mounted() {
    this.getArticles();
  },
};
</script>

<style scoped>
.size-modif-photo {
  height: 70vh;
  width: 80vw;

  @media (max-width: 575px) {
    height: 30vh;
  }
}
</style>
