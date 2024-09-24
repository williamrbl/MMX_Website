<template>
  <q-img :src="fond" class="height-image" style="object-fit: cover">
    <div style="width: 100%; height: 100%">
      <div
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        "
      >
        <q-scroll-area
          class="scroll-area"
          visible="false"
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
          "
        >
          <div class="titre-demandes">Demandes de prestation</div>

          <div
            class="q-pa-md"
            style="
              width: 90vw;
              height: 30vh;
              display: flex;
              align-items: stretch;
              justify-content: center;
            "
          >
            <div
              class="centered row q-gutter-md"
              style="height: 100%; width: 100%"
            >
              <div class="col image">IMAGE</div>
              <div class="col image">IMAGE</div>
              <div class="col image">IMAGE</div>
            </div>
          </div>

          <div class="card-demande" style="margin-top: 2vh">
            <div class="text" style="margin-top: 16px">
              Details de l'évènement
            </div>

            <q-separator />

            <div style="margin-top: 16px; width: 100%">
              <q-input
                v-model="organisateur"
                dark
                color="white"
                label="Organisateur de l'évènement"
              />
              <q-input
                v-model="mail"
                dark
                color="white"
                label="Email de l'organisateur"
              />
              <q-input
                v-model="lieu"
                dark
                color="white"
                label="Lieu de l'évènement"
              />
              <div style="display: flex; align-items: center; margin-top: 10px">
                <q-btn
                  round
                  @click="isSelectDate = true"
                  icon="eva-calendar-outline"
                  style="background-color: white; color: purple"
                />
                <div style="margin-left: 5px">
                  Date : {{ utils.formatDate(selectedDate) }}
                </div>
              </div>

              <q-dialog v-model="isSelectDate" class="col">
                <q-date v-model="selectedDate" class="row" />
                <q-btn
                  label="Valider"
                  @click="isSelectDate = false"
                  class="row validate-btn"
                />
              </q-dialog>

              <q-input
                v-model="description"
                filled
                type="textarea"
                label="Description de l'évènement"
                color="white"
                class="description-input"
                dark
                style="margin-top: 10px"
              />
            </div>
            <q-btn
              label="Valider"
              class="validate-btn"
              @click="createDemande()"
            />
          </div>
        </q-scroll-area>
      </div>
    </div>
  </q-img>
</template>

<script>
import fond from "src/assets/Fond.jpg";
import utils from "src/helpers/utils.ts";
export default {
  name: "DemandesPage",
  setup() {
    return { utils };
  },
  data() {
    return {
      fond,
      organisateur: "",
      lieu: "",
      isSelectDate: false,
      description: "",
      selectedDate: new Date(),
      mail: "",
    };
  },
  methods: {
    async createDemande() {
      if (!this.organisateur || !this.lieu || !this.description || !this.mail) {
        utils.alert("Veuillez remplir toutes les informations");
      } else if (
        this.selectedDate instanceof Date &&
        this.selectedDate.setHours(0, 0, 0, 0) ===
          new Date().setHours(0, 0, 0, 0)
      ) {
        utils.alert("Impossible de demander un événement pour le jour même");
      } else {
        const formData = new FormData();
        formData.append("organisateur", this.organisateur);
        formData.append("mail", this.mail);
        formData.append("lieu", this.lieu);
        formData.append("date", this.selectedDate);
        formData.append("description", this.description);

        try {
          const response = await fetch(
            `${process.env.VUE_APP_API}/createDemande`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          this.organisateur = "";
          this.mail = "";
          this.lieu;
          this.selectedDate = new Date();
          this.description = "";
        } catch (error) {
          console.log("Impossible de créer la demande : ", error);
        }
      }
    },
  },
};
</script>

<style scoped>
.height-image {
  width: 100%;
  height: 100vh;
}

.titre-demandes {
  font-family: Arupala Grotesk Ultra;
  color: white;
  z-index: 1;
  font-size: 3vh;
  margin-bottom: 1vh;
}

.scroll-area {
  height: 75vh;
  width: 100%;
  max-width: 90vw;

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge, and Firefox */
  .no-scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
}

.image {
  padding: 16px;
  background-color: aqua;
  height: 100%;
}

.centered.row {
  height: 100%;
}

.text {
  color: white;
  font-family: Aileron Bold;
}

.description-input {
  color: white;
}

.validate-btn {
  background-color: white;
  color: purple;
  border-radius: 10px;
}

.card-demande {
  padding: 16px;
  width: 40vw;
  background-color: purple;
  border-radius: 10px;
}
</style>
