<template>
  <div>
    <q-btn
      flat
      no-caps
      icon="eva-plus-outline"
      label="Ajouter une prestation"
      @click="isAjoutPrestation = true"
      class="large-screen-only"
    />
    <q-btn
      flat
      no-caps
      icon="eva-plus-outline"
      @click="isAjoutPrestation = true"
      class="small-screen-only"
    />
  </div>

  <q-dialog v-model="isAjoutPrestation">
    <q-card class="size-dialog">
      <div class="header">Ajouter un événement</div>
      <div class="q-pa-md">
        <div>
          <q-input label="Organisateur" v-model="organisateur" />
          <q-input label="Email" v-model="email" />
          <q-input label="Lieu" v-model="lieu" />
          <q-input label="Description" v-model="description" />
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              width: 100%;
              margin-top: 10px;
            "
          >
            <q-btn
              round
              class="date-btn"
              icon="eva-calendar-outline"
              @click="isSelectDate = true"
            />
            <div v-if="selectedDate" class="date-display">
              {{ utils.formatDate(selectedDate) }}
            </div>
          </div>
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
          @click="checkSelectedDate()"
        />
      </div>
    </q-date>
  </q-dialog>
</template>

<script>
import utils from "src/helpers/utils.ts";
import SpinnerComponent from "../Other/SpinnerComponent.vue";
import { Loading } from "quasar";
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
  emits: ["update-events"],
  methods: {
    cancelDemande() {
      this.organisateur = "";
      this.email = "";
      this.lieu = "";
      this.selectedDate = "";
      this.description = "";
      this.isAjoutPrestation = false;
    },

    checkSelectedDate() {
      const checkDate = new Date(this.selectedDate).setHours(0, 0, 0, 0);
      if (checkDate <= new Date().setHours(0, 0, 0, 0)) {
        utils.alert("Veuillez vérifier la date de l'événement");
      } else {
        this.isSelectDate = false;
      }
    },

    async sendDemande() {
      function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      }
      if (
        this.organisateur == "" ||
        this.email == "" ||
        this.lieu == "" ||
        this.selectedDate == "" ||
        this.description == ""
      ) {
        utils.alert("Veuillez entrer toutes les informations");
      } else if (!isValidEmail(this.email)) {
        utils.alert("Veuillez saisir une adresse mail valide");
      } else {
        Loading.show({
          spinner: SpinnerComponent,
        });
        const formData = new FormData();
        formData.append("organisateur", this.organisateur);
        formData.append("email", this.email);
        formData.append("lieu", this.lieu);
        formData.append("description", this.description);
        formData.append("date", this.selectedDate);
        formData.append("demande", false);

        try {
          const response = await fetch(
            `${process.env.VUE_APP_API}/addPrestation`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          this.$emit("update-events");
          this.cancelDemande();
          Loading.hide();
        } catch (error) {
          console.error("Error sending mail:", error);
          utils.alert("Erreur lors de l'envoi du mail");
        }
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
  width: 25%;
  display: flex;
  justify-content: center;
}
</style>
