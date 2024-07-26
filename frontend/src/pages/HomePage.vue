<template>
  <div>fljd</div>
  <q-parallax
    :src="fond"
    speed="0.5"
    style="width: 100%; height: 100vh"
    class="q-py-xl"
  >
    <div style="width: 100%">
      <q-card
        class="centered"
        style="
          width: 500px;
          height: 100px;
          background-color: rgba(128, 0, 128, 0.5);
        "
      >
        <div style="color: white">Bienvenue sur le site de Musique Mix</div>
      </q-card>

      <div class="spacer" />

      <div style="width: 100%; margin-left: 10%">
        <div style="color: white; font-size: 40px; font-family: 'calibri'">
          Actualités
        </div>
      </div>

      <div class="spacer" />

      <div class="centered">
        <HomeCarrousel />
      </div>

      <div class="spacer" />
    </div>
  </q-parallax>

  <ContactsDiv />
</template>

<script>
import fond from "src/assets/Fond.jpg";
import HomeCarrousel from "../components/HomeCarrousel.vue";
import ContactsDiv from "../components/ContactsDiv.vue";

export default {
  name: "HomePage",
  components: { HomeCarrousel, ContactsDiv },
  data() {
    return {
      fond,
    };
  },
};
</script>

<style scoped>
.spacer {
  height: 50px;
}
</style>
