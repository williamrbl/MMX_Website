<template>
  <div class="row" style="display: flex; align-items: center">
    <q-btn
      outline
      style="color: purple; width: 80%"
      label="Sélection du matériel"
      @click="isSelectionMateriel = true"
    />

    <q-icon
      class="state-icon"
      name="eva-close-square-outline"
      v-if="isSelectionne == false"
      style="color: red"
    />
    <q-icon
      class="state-icon"
      name="eva-checkmark-square-outline"
      v-else
      style="color: green"
    />
  </div>

  <q-dialog v-model="isSelectionMateriel">
    <q-card class="selection-card">
      <div class="card-header">
        <div class="header-title">Sélection du matériel à louer :</div>
        <q-btn
          flat
          dense
          icon="eva-close-outline"
          class="close-btn"
          @click="isSelectionMateriel = false"
        />
      </div>
      <div class="q-pa-md">
        <div class="col texte-section">SoundBoks :</div>

        <div class="row" style="display: flex; align-items: center">
          <div class="col">Nombre de SoundBoks :</div>
          <q-select
            behavior="menu"
            class="col"
            v-model="nbSB"
            :options="[0, 1, 2]"
          />
        </div>

        <div class="col texte-section">Matériel Annexe :</div>

        <div class="col">
          <div class="row" style="display: flex; align-items: center">
            <div class="col">Nombre de FBT X-LITE 115A (Satellite Sono) :</div>
            <q-select
              behavior="menu"
              class="col"
              v-model="nbSatellite"
              :options="[0, 1, 2]"
            />
          </div>

          <div class="row">
            <q-checkbox
              class="col"
              v-model="isCaisson"
              label="FBT X-SUB 118SA (Caisson de Basses)"
            />
          </div>

          <div class="row">
            <q-checkbox
              class="col"
              v-model="isScarlett"
              label="Focusrite Scarlett 18i20 (Carte Son)"
            />
          </div>

          <div class="row" style="display: flex; align-items: center">
            <div class="col">Nombre de micros/câbles :</div>
            <q-select
              behavior="menu"
              class="col"
              v-model="nbMicro"
              :options="[0, 1, 2]"
            />
          </div>
        </div>
        <div style="display: flex; justify-content: end; margin-top: 10px">
          <q-btn
            outline
            style="color: purple"
            label="Cancel"
            @click="isSelectionMateriel = false"
          />
          <q-btn
            outline
            style="color: purple"
            label="OK"
            @click="this.addMateriel()"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import utils from "src/helpers/utils.ts";
export default {
  name: "SelectionMateriel",
  emits: ["add-materiel"],
  setup() {
    return { utils };
  },
  data() {
    return {
      isSelectionMateriel: false,
      isSelectionne: false,
      nbSB: 0,
      nbSatellite: 0,
      isCaisson: false,
      isScarlett: false,
      nbMicro: 0,
      materiel: {},
    };
  },
  methods: {
    addMateriel() {
      this.materiel = {
        nbSB: this.nbSB,
        nbSatellite: this.nbSatellite,
        isCaisson: this.isCaisson,
        isScarlett: this.isScarlett,
        nbMicro: this.nbMicro,
      };
      if (
        JSON.stringify(this.materiel) ===
        JSON.stringify({
          nbSB: 0,
          nbSatellite: 0,
          isCaisson: false,
          isScarlett: false,
          nbMicro: 0,
        })
      ) {
        utils.alert("Veuillez sélectionner le matériel à louer");
      } else {
        this.$emit("add-materiel", this.materiel);
        this.isSelectionne = true;
        this.isSelectionMateriel = false;
      }
    },
  },
};
</script>

<style>
.state-icon {
  font-size: 30px;
}

.card-header {
  width: 100%;
  background-color: purple;
  padding: 10px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  text-align: center;
  flex: 1;
}

.selection-card {
  width: 40vw;

  @media (max-width: 767px) {
    width: 90vw;
  }
}

.texte-section {
  font-weight: 800;
}
</style>
