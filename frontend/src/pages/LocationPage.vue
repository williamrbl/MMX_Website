<template>
  <q-img :src="fond" style="height: 80vh">
    <div
      style="
        display: flex;
        justify-content: center;
        flex-direction: column;
        width: 100%;
        height: 100%;
      "
    >
      <div class="centered row">
        <q-date
          v-model="selectedDate"
          minimal
          flat
          first-day-of-week="1"
          :events="dates"
          :event-color="(date) => getEventColor(date)"
          style="background-color: white; color: purple; width: 40vh"
        />

        <div>
          <q-card style="margin-left: 5%">
            <div class="calendar-footer">
              <div class="day-text-format">Légende :</div>
              <div class="legend-item">
                <div class="color-box orange"></div>
                <div class="legend">Une seule SB disponible</div>
              </div>
              <div class="legend-item">
                <div class="color-box red"></div>
                <div class="legend">Pas de SB disponible</div>
              </div>
            </div>
          </q-card>
        </div>

        <q-card
          class="q-pa-md"
          style="
            width: 70vw;
            background-color: white;
            margin-left: 5%;
            border-radius: 20px;
            height: 30vh;
          "
        >
          <div class="title">A changer tout avec vraies valeurs</div>
          <div class="item">SoundBoks</div>

          <div class="type">1 weekend : 40 euros</div>
          <div class="type">1 journée : 40 euros</div>
          <div class="title">Conditions</div>
          <div class="texte">
            Le matériel est loué pour une période définie. Tout retard sera
            facturé à hauteur de 10 euros par jour de retard sur le retour.
          </div>
          <AjouterLocation @get-locations="getLocations" />
        </q-card>
      </div>
      <div class="centered"></div>
    </div>
  </q-img>
</template>

<script>
import AjouterLocation from "src/components/Locations/AjouterLocation.vue";
import fond from "src/assets/Fond.jpg";

export default {
  name: "LocationPage",
  components: { AjouterLocation },
  data() {
    return {
      locations: [],
      events: [],
      dates: [],
      selectedDate: "",
      fond,
    };
  },
  methods: {
    async getLocations() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API}/locations`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data || data.length === 0) {
          throw new Error("No locations found");
        }
        this.locations = data;
        this.calculateEvents();
      } catch (error) {
        alert(`Erreur lors de la récupération des locations: ${error.message}`);
      }
    },

    calculateEvents() {
      const events = [];
      const locationsAcceptées = this.locations.filter(
        (location) => location.demande !== true
      );

      locationsAcceptées.forEach((location) => {
        let startDate = new Date(location.start);
        let endDate = new Date(location.end);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          return;
        }

        startDate.setDate(startDate.getDate() + 1);
        endDate.setDate(endDate.getDate() + 1);

        while (startDate <= endDate) {
          const formattedDate = startDate.toISOString().split("T")[0];
          const existingEvent = events.find(
            (event) => event.date === formattedDate
          );

          if (!existingEvent) {
            events.push({
              date: formattedDate,
              availableSB: 2 - location.materiel.nbSB,
            });
          } else {
            existingEvent.availableSB -= location.materiel.nbSB;
          }

          startDate.setDate(startDate.getDate() + 1);
        }
      });

      this.events = events;
      this.events.forEach((event) => {
        if (event.date) {
          event.date = event.date.replace(/-/g, "/");
        }
      });
      this.dates = events.map((event) => event.date.replace(/-/g, "/"));
    },

    getEventColor(date) {
      const formattedDate = date.split("T")[0].replace(/-/g, "/");
      const event = this.events.find((event) => event.date === formattedDate);

      if (!event) {
        return "green";
      }

      if (event.availableSB === 2) {
        return "green";
      } else if (event.availableSB === 1) {
        return "yellow";
      } else {
        return "red";
      }
    },
  },
  async mounted() {
    await this.getLocations();
  },
};
</script>

<style scoped>
.title {
  color: purple;
  font-size: 20px;
  font-family: calibri;
}
.item {
  color: purple;
  font-size: 15px;
  font-family: calibri;
  margin-left: 5px;
}
.type {
  color: purple;
  font-size: 10px;
  font-family: calibri;
  margin-left: 10px;
}
.texte {
  color: purple;
  font-size: 5px;
  font-family: calibri;
  margin-left: 10px;
  font-weight: 200;
}

.q-img {
  position: relative;
}

.centered {
  position: relative;
  z-index: 10;
}

.q-date {
  position: relative;
  z-index: 20;
  color: black;
}

.q-date__header,
.q-date__day,
.q-date__calendar-day {
  color: black;
}

.calendar-footer {
  margin-top: 15px;
  background-color: #ffffff;
  border-radius: 25px;
  padding: 20px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 7px 29px 0px;
  width: 300px;
  margin-left: 20px;
}

.red {
  background-color: #ff4c4c;
}

.orange {
  background-color: yellow;
}

.legend {
  font-family: consolas;
  font-size: 0.9rem;
  color: #0a0921;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.color-box {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  margin-right: 10px;
}

.day-text-format {
  color: #4b0082;
  font-size: 1.2rem;
  padding-right: 5%;
  border-right: 3px solid #4b0082;
  margin-bottom: 10px;
}
</style>
