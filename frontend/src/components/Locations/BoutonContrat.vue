<template>
  <div>
    <div v-if="!location.contrat" class="centered">
      <q-file
        outlined
        v-model="file"
        label="Contrat"
        @input="handleFileInput"
        style="width: 80%"
      >
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>
    </div>
    <q-btn
      v-else
      outline
      label="Voir Contrat"
      @click="viewContrat"
      style="color: purple"
    />
    <q-dialog v-model="isVisuContrat">
      <q-card class="pdf-viewer-card">
        <div class="dialog-btn">
          <q-btn
            flat
            dense
            icon="eva-trash-outline"
            @click="deleteContrat"
            class="delete-contrat"
          />
          <q-btn
            flat
            dense
            icon="eva-close-outline"
            @click="isVisuContrat = false"
            class="close-btn"
          />
        </div>
        <embed :src="contratVisu" type="application/pdf" class="pdf-viewer" />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: "BoutonContrat",
  data() {
    return {
      file: null,
      isVisuContrat: false,
      contratVisu: null,
    };
  },
  props: {
    location: {
      type: Object,
      required: true,
    },
  },
  emits: ["add-contrat", "delete-contrat"],
  methods: {
    handleFileInput(event) {
      this.$emit("add-contrat", event);
    },

    viewContrat() {
      this.isVisuContrat = true;
      this.contratVisu = `${this.location.contrat}?v=${new Date().getTime()}`;
    },

    deleteContrat() {
      this.$emit("delete-contrat", this.location);
      this.isVisuContrat = false;
      this.contratVisu = "";
      this.file = null;
    },
  },
};
</script>

<style scoped>
.pdf-viewer-card {
  width: 80%;
  height: 80%;
  max-width: 1000px;
  max-height: 800px;
  overflow: visible;
}

.pdf-viewer {
  width: 100%;
  height: 100%;
}

.close-btn,
.delete-contrat {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.close-btn:hover {
  background-color: red;
  color: white;
}

.delete-contrat:hover {
  background-color: orange;
  color: white;
}

.dialog-btn {
  display: flex;
  justify-content: space-between;
}
</style>
