<template>
  <q-btn
    outline
    style="color: white"
    label="Voir la demande"
    @click="voirDemandeDetails(location)"
  />
  <q-dialog v-model="voirDemande">
    <q-card>
      <div class="header">Demande de {{ selectedDemande.association }}</div>
      <div class="q-pa-md">
        <div>Type de locataire : {{ selectedDemande.typeLocataire }}</div>

        <div>
          Dates : {{ utils.formatDate(selectedDemande.start) }} ->
          {{ utils.formatDate(selectedDemande.end) }}
        </div>

        <div>Description : {{ selectedDemande.description }}</div>

        <div v-if="Object.keys(selectedDemande.materiel).length > 0">
          <div>Matériel désiré :</div>
          <div class="q-px-md">
            <div
              v-if="
                selectedDemande.materiel.nbSB &&
                selectedDemande.materiel.nbSB != 0
              "
            >
              SoundBoks : {{ selectedDemande.materiel.nbSB }}
            </div>
            <div
              v-if="
                selectedDemande.materiel.nbSatellite &&
                selectedDemande.materiel.nbSatellite != 0
              "
            >
              Satellites : {{ selectedDemande.materiel.nbSatellite }}
            </div>
            <div v-if="selectedDemande.materiel.isCaisson !== false">
              Caisson : {{ selectedDemande.materiel.isCaisson ? 1 : 0 }}
            </div>
            <div v-if="selectedDemande.materiel.isScarlett !== false">
              Carte Son : {{ selectedDemande.materiel.isScarlett ? 1 : 0 }}
            </div>
            <div
              v-if="
                selectedDemande.materiel.nbMicro &&
                selectedDemande.materiel.nbMicro != 0
              "
            >
              Micro : {{ selectedDemande.materiel.nbMicro }}
            </div>
          </div>
        </div>
        <div>Prix : {{ selectedDemande.prix }} euros</div>

        <div style="display: flex; justify-content: end">
          <q-btn
            outline
            label="Refuser"
            style="color: purple"
            @click="justifierRefus(selectedDemande)"
          />
          <q-btn
            outline
            label="Accepter"
            style="color: purple"
            @click="accepterDemande(selectedDemande)"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog v-model="isJustification">
    <q-card class="refus-card">
      <div class="header">Justification du refus</div>
      <div class="q-pa-md">
        <q-input v-model="justification" label="Raison du refus de location" />
        <div class="row" style="display: flex; justify-content: end">
          <q-btn outline label="Annuler" @click="annulerRefus" color="purple" />
          <q-btn
            outline
            label="Valider"
            @click="refuserDemande(selectedDemande)"
            color="purple"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import utils from "src/helpers/utils.ts";
export default {
  name: "VoirDemande",
  emits: ["rejeter-demande", "get-locations"],
  props: {
    location: {
      type: Object,
      Required: true,
    },
  },
  setup() {
    return {
      utils,
    };
  },
  data() {
    return {
      selectedDemande: null,
      voirDemande: false,
      isJustification: false,
      justification: "",
    };
  },
  methods: {
    voirDemandeDetails(location) {
      this.selectedDemande = location;
      this.voirDemande = true;
    },

    justifierRefus() {
      this.isJustification = true;
    },

    annulerRefus() {
      this.isJustification = false;
      this.justification = "";
    },

    refuserDemande(location) {
      if (!this.justification) {
        utils.alert("Veuillez justifier le refus");
      } else {
        this.$emit("rejeter-demande", location, this.justification);
        this.selectedDemande = null;
        this.voirDemande = false;
        this.isJustification = false;
      }
    },

    async accepterDemande(selectedDemande) {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_API}/accepterDemande`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(selectedDemande),
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        try {
          const response = await fetch(
            `${process.env.VUE_APP_API}/sendMailAccepte`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(selectedDemande),
            }
          );

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
        } catch (error) {
          console.error("Error accepting renting:", error);
          utils.alert("Erreur lors de la récupétation des locations");
        }
        this.$emit("get-locations");
        this.voirDemande = false;
        utils.validate("Demande acceptée");
      } catch (error) {
        console.error("Error accepting renting:", error);
        utils.alert("Erreur lors de la récupétation des locations");
      }
    },
  },
};
</script>

<style>
.header {
  background-color: purple;
  color: white;
}

.refus-card {
  width: 80%;
}
</style>
