<template>
  <q-img src="src/assets/Fond.jpg">
    <div
      style="display: flex; flex-direction: column; width: 100%; height: 100%"
    >
      <div class="centered row">
        <CalendarComponent />
        <q-card
          class="q-pa-md"
          style="width: 30%; background-color: purple; margin-left: 5%"
        >
          <div class="title">Prix</div>
          <div class="item">SoundBoks</div>
          <div class="type">1 weekend : 40 euros</div>
          <div class="type">1 journée : 40 euros</div>
          <div class="title">Conditions</div>
          <div class="texte">
            Le matériel est loué pour une période définie. Tout retard sera
            facturé à hauteur de 10 euros par jour de retard sur le retour
          </div>
        </q-card>
      </div>
      <div class="centered"></div>
    </div>
  </q-img>
</template>

<script>
import CalendarComponent from "src/components/CalendarComponent.vue";
export default {
  name: "LocationPage",
  components: { CalendarComponent },
  data() {
    return {
      locations: {},
    };
  },
  methods: {
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
  },
  mounted() {
    this.getLocations();
  },
};
</script>

<style scoped>
.title {
  color: white;
  font-size: 40px;
  font-family: calibri;
}
.item {
  color: white;
  font-size: 30px;
  font-family: calibri;
  margin-left: 5px;
}
.type {
  color: white;
  font-size: 20px;
  font-family: calibri;
  margin-left: 10px;
}
.texte {
  color: white;
  font-size: 10px;
  font-family: calibri;
  margin-left: 10px;
  font-weight: 200;
}
</style>
