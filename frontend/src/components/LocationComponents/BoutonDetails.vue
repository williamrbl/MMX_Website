<template>
  <div>
    <q-btn
      outline
      label="État de la location"
      class="detail-btn"
      @click="isDetail = true"
    />
    <q-dialog v-model="isDetail">
      <q-card class="detail-card">
        <div class="card-header">
          <div class="header-title">
            {{ location.association }} - {{ utils.formatDate(location.start) }}
          </div>
          <q-btn
            flat
            dense
            icon="eva-close-outline"
            class="close-btn"
            @click="isDetail = false"
          />
        </div>
        <div class="row">
          <div class="col">
            <div class="checklist-title">Checklist</div>
            <div class="timeline">
              <div
                v-for="(item, index) in timelineItems"
                :key="index"
                class="timeline-item"
                :class="{
                  'greyed-out': item.label === 'Contrat' && !item.isUploaded,
                }"
              >
                <div
                  class="timeline-circle"
                  :class="{
                    active:
                      item.value ||
                      (item.label === 'Contrat' && item.isUploaded),
                    'non-clickable': item.label === 'Contrat',
                  }"
                  @click="item.label !== 'Contrat' && toggleItem(index)"
                >
                  <span
                    v-if="
                      item.value ||
                      (item.label === 'Contrat' && item.isUploaded)
                    "
                    class="checkmark"
                    >✓</span
                  >
                </div>
                <div class="timeline-content">
                  {{ item.label }}
                </div>
              </div>
            </div>
          </div>

          <q-separator vertical />

          <div class="col">
            <div class="checklist-title">Contrat</div>
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <BoutonContrat
                :location="location"
                @add-contrat="uploadContrat"
                @delete-contrat="deleteContrat"
              />
            </div>
          </div>
        </div>
        <div class="row" style="display: flex; align-items: center">
          <div class="price col-4">
            Prix de la location : {{ locationTemp.prix }} euros
          </div>
          <div
            class="col"
            style="color: red; font-weight: 700"
            v-if="locationTemp.suppRetard"
          >
            + {{ locationTemp.suppRetard }} euros de retard
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import BoutonContrat from "./BoutonContrat.vue";
import utils from "src/helpers/utils.ts";
import cloneDeep from "lodash/cloneDeep";

export default {
  name: "BoutonDetails",
  components: { BoutonContrat },
  emits: ["update-location"],
  props: {
    location: {
      type: Object,
      required: true,
    },
    getLocations: {
      type: Function,
      required: true,
    },
  },
  setup() {
    return { utils };
  },
  data() {
    return {
      isDetail: false,
      locationTemp: cloneDeep(this.location),
      timelineItems: [
        { label: "Contrat", value: false, isUploaded: false },
        { label: "Caution", value: false },
        { label: "Payé", value: false },
        { label: "Matériel Prêté", value: false },
        { label: "Matériel Récupéré", value: false },
      ],
    };
  },
  watch: {
    location: {
      handler(newLocation) {
        this.locationTemp = cloneDeep(newLocation);
        this.updateTimelineItems();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    updateTimelineItems() {
      this.timelineItems = [
        {
          label: "Contrat",
          value: this.locationTemp.contrat,
          isUploaded: !!this.locationTemp.contrat,
        },
        { label: "Caution", value: this.locationTemp.caution },
        { label: "Matériel Prêté", value: this.locationTemp.prete },
        { label: "Matériel Récupéré", value: this.locationTemp.rendu },
        { label: "Payé", value: this.locationTemp.paye },
      ];
    },

    toggleItem(index) {
      const item = this.timelineItems[index];
      item.value = !item.value;
      if (item.label === "Matériel Récupéré") {
        this.locationTemp.daterendu = item.value ? this.getCurrentDate() : "";
      }
      this.updateLocationFromTimeline();
    },

    updateLocationFromTimeline() {
      this.locationTemp = {
        ...this.locationTemp,
        contrat: this.timelineItems[0].value,
        caution: this.timelineItems[1].value,
        prete: this.timelineItems[2].value,
        rendu: this.timelineItems[3].value,
        paye: this.timelineItems[4].value,
      };
      this.handleUpdate();
    },

    handleUpdate() {
      this.$emit("update-location", this.locationTemp);
    },

    getCurrentDate() {
      const date = new Date();
      return `${date.getFullYear()}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
    },

    async uploadContrat(event) {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("contrat", file);
      formData.append("_id", this.location._id);
      formData.append("association", this.location.association);

      try {
        const response = await fetch(`${process.env.API}/uploadContrat`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        await this.getLocations();
        utils.validate("Le contrat a bien été importé");

        this.timelineItems[0].value = true;
        this.timelineItems[0].isUploaded = true;
        this.handleUpdate();
      } catch (error) {
        console.error("Error importing contract:", error);
        utils.alert(`Erreur lors de l'import du contrat: ${error.message}`);
      }
    },

    async deleteContrat() {
      const formData = new FormData();
      formData.append("_id", this.location._id);
      formData.append("contract", this.location.contract);
      formData.append("association", this.location.association);

      try {
        const response = await fetch(`${process.env.API}/removeContract`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        await this.getLocations();
        utils.validate("Le contrat a bien été supprimé");

        this.timelineItems[0].value = false;
        this.timelineItems[0].isUploaded = false;
        this.handleUpdate();
      } catch (error) {
        console.error("Error deleting contract:", error);
        utils.alert(
          `Erreur lors de la suppression du contrat: ${error.message}`
        );
      }
    },

    calculatePrice() {
      const startDate = new Date(this.location.start);
      const endDate = new Date(this.location.end);
      if (endDate <= startDate) return 0;

      let totalPrice = 0;
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        totalPrice += dayOfWeek === 6 || dayOfWeek === 0 ? 20 : 10;
        if (
          dayOfWeek === 0 &&
          currentDate.getTime() + 86400000 <= endDate.getTime()
        ) {
          totalPrice += 20;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      this.locationTemp.prix = totalPrice;
      this.handleUpdate();
    },

    calculateRetard() {
      const penaltyPerDay = 10;
      let penalty = penaltyPerDay;
      const endDate = new Date(this.location.end);
      const returnDate = this.location.daterendu
        ? new Date(this.location.daterendu)
        : new Date();

      if (returnDate <= endDate) return 0;

      const oneDay = 24 * 60 * 60 * 1000;
      const daysLate = Math.ceil((returnDate - endDate) / oneDay);

      let currentDate = new Date(endDate);
      while (currentDate < returnDate) {
        const dayOfWeek = currentDate.getDay();
        penalty +=
          dayOfWeek === 6 || dayOfWeek === 0
            ? currentDate.getDay() === 6 &&
              currentDate.getTime() + 86400000 <= returnDate.getTime()
              ? 40
              : 20
            : 10;
        currentDate.setDate(currentDate.getDate() + 1);
      }
      this.locationTemp.suppRetard = penalty;
      this.handleUpdate();
    },
  },
  mounted() {
    this.calculatePrice();
    this.calculateRetard();
  },
};
</script>

<style scoped>
.detail-btn {
  color: purple;
}

.detail-card {
  width: 50%;
  border-radius: 10px;
  overflow: hidden;
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

.close-btn {
  color: white;
}

.checklist-title {
  font-weight: bold;
  margin: 20px;
}

.timeline {
  display: flex;
  flex-direction: column;
  position: relative;
  padding-left: 30px;
}

.timeline-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.timeline-item::before {
  content: "";
  position: absolute;
  left: 12px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: gray;
  z-index: -1;
}

.timeline-item:last-child::before {
  display: none;
}

.timeline-circle {
  width: 24px;
  height: 24px;
  border: 2px solid gray;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
}

.timeline-circle.active {
  border-color: purple;
  background-color: purple;
  color: white;
}

.checkmark {
  font-size: 16px;
}

.timeline-content {
  margin-left: 10px;
}

.price {
  font-weight: bold;
  margin: 20px;
}

.timeline-item.greyed-out .timeline-circle {
  border-color: #ccc;
  background-color: #f0f0f0;
  cursor: not-allowed;
}

.non-clickable {
  cursor: not-allowed;
}
</style>
