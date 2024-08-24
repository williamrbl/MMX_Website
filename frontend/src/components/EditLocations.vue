<template>
  <div class="q-pa-lg">
    <div class="row items-center">
      <div class="section-title q-mr-md">Gérer les locations</div>
      <q-btn
        outline
        style="color: purple"
        label="Ajouter une location"
        @click="isAjoutLocation = true"
      />
    </div>

    <!-- Section for the list of locations -->
    <div class="locations q-pa-md">
      <div
        v-for="location in filteredLocations"
        :key="location._id"
        class="row items-center q-mb-md"
      >
        <div class="col locations-text">{{ location.association }}</div>
        <div class="col locations-text">{{ location.start }}</div>
        <div class="col locations-text">{{ location.end }}</div>
        <q-btn
          flat
          dense
          icon="eva-trash-outline"
          class="col"
          style="color: white"
        />
      </div>
    </div>
  </div>

  <q-dialog v-model="isAjoutLocation">
    <q-card style="width: 50%">
      <div class="q-pa-md">
        <div>
          <q-input v-model="inputAsso" label="Nom de l'association" />
          <div class="row">
            <q-toggle
              v-model="isDay"
              label="Location sur une journée"
              color="purple"
              class="col"
              @click="locationDates = {}"
            />
            <q-date
              class="col"
              v-model="locationDates"
              :range="!isDay"
              @input="updateDateDisplay"
              first-day-of-week="1"
            />
          </div>
          <div v-if="!isDay">
            <div>Date de début : {{ locationDates.from }}</div>
            <div>Date de fin : {{ locationDates.to }}</div>
          </div>
          <div v-else>
            <div>Date sélectionnée : {{ locationDates }}</div>
          </div>
        </div>
        <div class="q-pt-md" style="display: flex; justify-content: end">
          <q-btn
            outline
            label="Cancel"
            @click="
              {
                isAjoutLocation = false;
                inputAsso = '';
                locationDates = {};
                isDay = false;
              }
            "
          />
          <q-btn outline label="Ok" @click="addLocation()" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import utils from "src/helpers/utils.ts";
import { v4 as uuidv4 } from "uuid";
export default {
  name: "EditLocations",
  setup() {
    return { utils };
  },
  data() {
    return {
      locations: {},
      isAjoutLocation: false,
      inputAsso: "",
      locationDates: {},
      isDay: false,
    };
  },
  methods: {
    handleRefresh() {
      this.getLocations();
    },

    updateDateDisplay() {
      if (!this.isRange) {
        this.locationDates = this.locationDates ? this.locationDates : "";
      }
    },

    transformDate(dateStr) {
      return new Proxy(
        { from: dateStr, to: dateStr },
        {
          get(target, prop) {
            if (prop === "from" || prop === "to") {
              return target[prop];
            }
            return undefined;
          },
        }
      );
    },

    async getLocations() {
      try {
        const response = await fetch(`${process.env.API}/locations`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        this.locations = await response.json();
      } catch (error) {
        console.error("Error getting renting:", error);
        utils.alert("Erreur lors de la récupétation des locations");
      }
    },

    async addLocation() {
      if (typeof this.locationDates == "string") {
        this.locationDates = this.transformDate(this.locationDates);
      }
      if (this.locationDates == {} || this.inputAsso == "") {
        utils.alert("Veuillez entrer toutes les informations");
      } else if (
        new Date(this.locationDates.from) < new Date().setHours(0, 0, 0, 0) ||
        new Date(this.locationDates.to) < new Date().setHours(0, 0, 0, 0)
      ) {
        utils.alert("Veuillez entrer des dates correctes");
      } else {
        console.log("Validé : ", this.inputAsso, this.locationDates);
        const uuid = uuidv4();
        const formData = new FormData();
        formData.append("_id", uuid);
        formData.append("association", this.inputAsso);
        formData.append("start", this.locationDates.from);
        formData.append("end", this.locationDates.to);
        try {
          const response = await fetch(`${process.env.API}/addLocation`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          this.inputName = "";
          this.inputDescription = "";
          this.file = null;
          this.isDay = false;
          this.getLocations();
          utils.validate("La location a bien été ajoutée");
          this.addingArticle = false;
        } catch (error) {
          console.error("Error adding renting:", error);
          utils.alert("Erreur lors de l'ajout de la location");
        }
        (this.inputAsso = ""), (this.locationDates = {});
        this.isAjoutLocation = false;
      }
    },
  },
  computed: {
    filteredLocations() {
      const today = new Date().setHours(0, 0, 0, 0);
      return Object.entries(this.locations)
        .filter(([key, location]) => new Date(location.end) >= today)
        .map(([key, location]) => location);
    },
  },
  mounted() {
    this.getLocations();
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

.locations {
  border: 1px solid purple;
  border-radius: 5px;
}

.locations-text {
  color: white;
}
</style>
