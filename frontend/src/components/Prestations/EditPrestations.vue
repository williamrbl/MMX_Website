<template>
  <div v-if="!isCustom">
    <div class="row items-center">
      <div style="display: flex; justify-content: space-between; width: 90%">
        <div class="section-title">Prestations</div>
        <ListeDemandes :events="events" @update-events="this.getEvents()" />
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
          <q-tabs no-caps inline-label style="height: 100%" v-model="tab">
            <q-tab name="avenir" icon="eva-clock-outline" label="A venir" />
            <q-tab
              name="tout"
              icon="eva-list-outline"
              label="Toutes les prestations"
            />
          </q-tabs>
          <AjoutPrestation @update-events="this.getEvents()" />
        </div>
        <div class="card-content q-pa-md">
          <q-scroll-area style="width: 100%; height: 100%">
            <table class="events-table" style="width: 100%; height: 100%">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Organisateur</th>
                  <th class="hide-on-small">Lieu</th>
                  <th class="hide-on-small">Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="event in filteredEvents" :key="event._id">
                  <td>{{ utils.formatDate(event.date) }}</td>
                  <td>{{ event.organisateur }}</td>
                  <td class="hide-on-small">{{ event.lieu }}</td>
                  <td class="hide-on-small">{{ event.description }}</td>
                  <td>
                    <GestionEvent
                      :event="event"
                      @update-events="this.getEvents()"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </q-scroll-area>
        </div>
      </div>
    </div>
  </div>

  <div v-if="isCustom">
    <CustomPrestationsPage @return-prestations="isCustom = false" />
  </div>
</template>

<script>
import AjoutPrestation from "./AjoutPrestation.vue";
import CustomPrestationsPage from "./CustomPrestationsPage.vue";
import utils from "src/helpers/utils.ts";
import GestionEvent from "./GestionEvent.vue";
import ListeDemandes from "./ListeDemandes.vue";
export default {
  name: "EditPrestations",
  data() {
    return {
      isCustom: false,
      isDemandes: false,
      events: [],
      tab: "avenir",
    };
  },
  setup() {
    return { utils };
  },
  components: {
    CustomPrestationsPage,
    AjoutPrestation,
    GestionEvent,
    ListeDemandes,
  },
  methods: {
    async getEvents() {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_API}/getPrestations`,
          {
            method: "GET",
          }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        this.events = await response.json();
      } catch (error) {
        console.error("Error getting events", error);
      }
    },
  },
  computed: {
    listeEventsConfirmes() {
      return this.events
        .filter((event) => event.demande === false)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    },

    listeEventsAVenir() {
      return this.events
        .filter((event) => {
          const checkDate = new Date(event.date).setHours(0, 0, 0, 0);
          const isAvenir = checkDate > new Date().setHours(0, 0, 0, 0);
          return event.demande === false && isAvenir;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    },

    filteredEvents() {
      return this.tab !== "avenir"
        ? this.listeEventsConfirmes
        : this.listeEventsAVenir;
    },
  },

  mounted() {
    this.getEvents();
  },
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
    height: 46vh;
  }
}

.title-card {
  background-color: purple;
  width: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 15%;
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
  height: 88%;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.event {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-top: 15px;
}

.events-table {
  width: 100%;
  border-collapse: collapse;
}

.events-table th,
.events-table td {
  padding: 8px;
  text-align: center;
  vertical-align: middle;
}

.hide-on-small {
  display: table-cell;
}

@media screen and (max-width: 768px) {
  .hide-on-small {
    display: none;
  }
}
</style>
