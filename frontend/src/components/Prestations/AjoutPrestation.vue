<template>
  <q-btn flat icon="eva-plus-outline" @click="isAjoutPrestation = true" />

  <q-dialog v-model="isAjoutPrestation">
    <q-card style="width: 40%">
      <div class="header">Ajouter un événement</div>
      <div class="q-pa-md">
        <div>
          <q-input label="Organisateur" v-model="organisateur" />
          <q-input label="Email" v-model="email" />
          <q-input label="Lieu" v-model="lieu" />
          <div style="display: flex; align-items: center; width: 100%">
            <q-btn
              round
              class="date-btn"
              icon="eva-calendar-outline"
              @click="isSelectDate = true"
            />
            <div class="date-display">{{ selectedDate }}</div>
          </div>
          <q-input label="Description" v-model="description" />
        </div>
        <div style="margin-top: 2vh; display: flex; justify-content: end">
          <q-btn
            outline
            dense
            color="purple"
            label="Annuler"
            @click="cancelDemande()"
          />
          <q-btn
            outline
            dense
            color="purple"
            label="Valider"
            @click="sendDemande()"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog v-model="isSelectDate">
    <q-date v-model="selectedDate">
      <div style="display: flex; justify-content: end">
        <q-btn
          outline
          dense
          label="Valider"
          color="purple"
          @click="isSelectDate = false"
        />
      </div>
    </q-date>
  </q-dialog>
</template>

<script>
import utils from "src/helpers/utils.ts";
export default {
  name: "AjoutPrestation",
  setup() {
    return { utils };
  },
  data() {
    return {
      isAjoutPrestation: false,
      isSelectDate: false,
      organisateur: "",
      email: "",
      lieu: "",
      selectedDate: "",
      description: "",
    };
  },
  methods: {
    cancelDemande() {
      this.organisateur = "";
      this.email = "";
      this.lieu = "";
      this.selectedDate = "";
      this.description = "";
      this.isAjoutPrestation = false;
    },

    sendDemande() {
      if (
        this.organisateur == "" ||
        this.email == "" ||
        this.lieu == "" ||
        this.selectedDate == "" ||
        this.description == ""
      ) {
        utils.alert("Veuillez entrer toutes les informations");
      } else {
        console.log("Sending demande");
      }
    },
  },
};
</script>

<style scoped>
.date-btn {
  background-color: purple;
  color: white;
}

.date-display {
  background-color: purple;
  color: white;
  border-radius: 5px;
  width: 20%;
  display: flex;
  justify-content: center;
}
</style>
