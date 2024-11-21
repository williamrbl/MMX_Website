<template>
  <div v-if="!isCustom">
    <div class="row items-center">
      <div style="display: flex; justify-content: space-between; width: 90%">
        <div class="section-title">Prestations</div>
        <q-btn
          label="Demandes"
          @click="isDemandes = true"
          outline
          color="white"
        />
        <q-btn
          label="Modifier la page"
          @click="isCustom = true"
          outline
          dense
          color="white"
        />
      </div>

      <div class="border-card">
        <div class="title-card" style="display: flex; align-items: center">
          <q-tabs no-caps inline-label style="height: 100%">
            <q-tab name="avenir" icon="eva-clock-outline" label="A venir" />
            <q-tab
              name="tout"
              icon="eva-list-outline"
              label="Toutes les prestations"
            />
          </q-tabs>
          <AjoutPrestation />
        </div>
        <div class="card-content q-pa-lg">
          <div class="event">
            <div>Date</div>
            <div>Association</div>
            <div>Description</div>
            <q-btn
              outline
              dense
              label="Gestion de l'événement"
              @click="gererEvent(event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="isCustom">
    <CustomPrestationsPage @return-prestations="isCustom = false" />
  </div>

  <q-dialog v-model="isDemandes">
    <q-card style="width: 30%">
      <div class="header">Demandes de prestations</div>
      <div class="q-pa-md" style="height: 100%">
        <!-- <div v-if="(isDemandes = false)">Aucune demande de prestation</div> -->
        <div
          class="row"
          style="
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <div>Association</div>
          <DemandePrestation />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import AjoutPrestation from "./AjoutPrestation.vue";
import CustomPrestationsPage from "./CustomPrestationsPage.vue";
import DemandePrestation from "./DemandePrestation.vue";
export default {
  name: "EditPrestations",
  data() {
    return {
      isCustom: false,
      isDemandes: false,
    };
  },
  components: { CustomPrestationsPage, DemandePrestation, AjoutPrestation },
  methods: {},
};
</script>

<style>
.border-card {
  margin-top: 4vh;
  border: 1px solid white;
  border-radius: 10px;
  width: 100%;
  height: 60vh;
  @media (max-width: 767px) {
    height: 53vh;
  }
}

.title-card {
  background-color: purple;
  width: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 10%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid white;
}

.text {
  margin-left: 1vw;
  font-size: 20px;
  font-family: Aileron Light;
}

.card-content {
  /* background-color: blue; */
  height: 90%;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.event {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
