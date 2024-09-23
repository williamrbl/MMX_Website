<template>
  <q-img :src="fond" style="height: 80vh">
    <div class="large-screen-only">
      <div
        style="
          display: flex;
          justify-content: center;
          flex-direction: column;
          width: 100%;
          height: 80vh;
        "
      >
        <div class="row" style="display: flex; align-items: center">
          <q-date
            v-model="selectedDate"
            minimal
            flat
            first-day-of-week="1"
            :events="dates"
            :event-color="(date) => getEventColor(date)"
            style="
              background-color: white;
              color: purple;
              margin-left: 5vw;
              height: 70vh;
            "
            class="col-5"
          />

          <div
            style="
              display: flex;
              justify-content: center;
              flex-direction: column;
            "
          >
            <q-card
              class="q-pa-md"
              style="
                width: 40vw;
                background-color: white;
                margin-left: 5%;
                border-radius: 20px;
              "
            >
              <div class="title" style="margin-bottom: 2vh">
                Conditions de location
              </div>
              <div class="row">
                <div class="col-6">
                  <div class="section">Prix (asso)</div>
                  <div class="content">Petit Déjeuner / Soirée : 20 euros</div>
                  <div class="content">Week-end :</div>
                  <div class="content-tab">1 SoundBoks : 50 euros</div>
                  <div class="content-tab">2 SoundBoks : 90 euros</div>
                  <div class="content">
                    Autre (micro, carte son, sono) : voir en DM Instagram !
                  </div>
                  <div class="content">
                    Pour les locations aux particuliers ou aux membres MMX, les
                    prix varient. Passez en DM !
                  </div>
                </div>

                <q-separator vertical />

                <div class="col-5">
                  <div class="section">Règlement</div>
                  <div class="reglement">
                    La location de matériel implique un chèque de caution
                    obligatoire du montant du prix du matériel loué neuf. Un
                    contrat devra être rempli. Le matériel pourra être récupéré
                    le vendredi pour une location sur le weekend.
                  </div>
                  <div class="reglement">
                    Le matériel devra être rendu au plus tard le lendemain de la
                    fin de la location. Chaque jour de retard entrainera une
                    pénalité financière à hauteur de 10 euros par jour de retard
                    et de 40 euros par weekend de retard (ces conditions sont
                    stipulées dans le contrat à signer)
                  </div>
                </div>
              </div>
              <div
                style="display: flex; justify-content: center; margin-top: 2vh"
              >
                <AjouterLocation @get-locations="getLocations" />
              </div>
            </q-card>

            <q-card
              style="
                margin-left: 5%;
                width: 40vw;
                border-radius: 25px;
                margin-top: 3vh;
              "
            >
              <div class="calendar-footer">
                <div class="day-text-format">Disponibilités :</div>
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
        </div>
      </div>
    </div>

    <div class="small-screen-only" style="width: 100%; height: 100%">
      <!-- <div class="title-dark">Location de matériel</div> -->
      <div class="centered" style="height: 100%; flex-direction: column">
        <q-date
          v-model="selectedDate"
          minimal
          flat
          first-day-of-week="1"
          :events="dates"
          :event-color="(date) => getEventColor(date)"
          style="background-color: white; color: purple; width: 80vw"
        />

        <q-card
          style="width: 80vw; border-radius: 25px; margin-top: 3vh"
          class="q-pa-md"
        >
          <div class="calendar-footer">
            <div class="day-text-format">Disponibilités :</div>
            <div class="legend-item">
              <div class="color-box orange"></div>
              <div class="legend">Une seule SoundBoks disponible</div>
            </div>
            <div class="legend-item">
              <div class="color-box red"></div>
              <div class="legend">Pas de SoundBoks disponibles</div>
            </div>
          </div>
          <div class="centered">
            <q-btn
              outline
              label="Faire une demande"
              style="color: purple"
              @click="isDemanding = true"
            />
          </div>
        </q-card>
      </div>

      <q-dialog v-model="isDemanding">
        <q-card
          class="q-pa-md"
          style="
            width: 85vw;
            background-color: white;

            border-radius: 20px;
          "
        >
          <div class="title" style="margin-bottom: 2vh">
            Conditions de location
          </div>
          <div>
            <div>
              <div class="section">Prix (asso)</div>
              <div class="content">Petit Déjeuner / Soirée : 20 euros</div>
              <div class="content">Week-end :</div>
              <div class="content-tab">1 SoundBoks : 50 euros</div>
              <div class="content-tab">2 SoundBoks : 90 euros</div>
              <div class="content">
                Autre (micro, carte son, sono) : voir en DM Instagram !
              </div>
              <div class="content">
                Pour les locations aux particuliers ou aux membres MMX, les prix
                varient. Passez en DM !
              </div>
            </div>

            <div class="q-py-md">
              <q-separator />
            </div>

            <div>
              <div class="section">Règlement</div>
              <div class="reglement">
                La location de matériel implique un chèque de caution
                obligatoire du montant du prix du matériel loué neuf. Un contrat
                devra être rempli. Le matériel pourra être récupéré le vendredi
                pour une location sur le weekend.
              </div>
              <div class="reglement">
                Le matériel devra être rendu au plus tard le lendemain de la fin
                de la location. Chaque jour de retard entrainera une pénalité
                financière à hauteur de 10 euros par jour de retard et de 40
                euros par weekend de retard (ces conditions sont stipulées dans
                le contrat à signer)
              </div>
            </div>
          </div>
          <div style="display: flex; justify-content: center; margin-top: 2vh">
            <AjouterLocation
              @get-locations="
                {
                  getLocations, (this.isDemanding = false);
                }
              "
            />
          </div>
        </q-card>
      </q-dialog>
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
      isDemanding: false,
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
        console.log(
          `Erreur lors de la récupération des locations: ${error.message}`
        );
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
  font-size: 25px;
  font-family: Arupala Grotesk Ultra;
}

.title-dark {
  color: white;
  font-size: 25px;
  font-family: Arupala Grotesk Ultra;
}

.section {
  color: purple;
  font-size: 25px;
  font-family: Aileron Light;
  margin-left: 5px;
}
.content {
  color: purple;
  font-size: 15px;
  font-family: Aileron Light;
  margin-left: 10px;
}

.reglement {
  color: purple;
  font-size: 10px;
  font-family: Aileron Light;
  margin-left: 10px;
}

.content-tab {
  color: purple;
  font-size: 15px;
  font-family: Aileron Light;
  margin-left: 20px;
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
  background-color: #ffffff;
  border-radius: 25px;
  padding: 20px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 7px 29px 0px;
  width: 100%;
}

.red {
  background-color: #ff4c4c;
}

.orange {
  background-color: yellow;
}

.legend {
  font-family: Aileron Light;
  font-size: 0.9rem;
  color: purple;
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
  color: purple;
  font-size: 1.2rem;
  padding-right: 5%;
  border-right: 3px solid #4b0082;
  margin-bottom: 10px;
  font-family: Arupala Grotesk Ultra;
}
</style>
