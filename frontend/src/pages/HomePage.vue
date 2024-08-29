<template>
  <q-img :src="fond" style="width: 100%; height: 120dvh" class="q-py-xl">
    <div style="width: 100%; height: 100%">
      <div
        style="
          color: white;
          font-size: 40px;
          font-family: 'calibri';
          margin-left: 10%;
        "
      >
        Bienvenue sur le site de Musique Mix
      </div>

      <div class="spacer" />

      <div style="width: 100%; margin-left: 10%">
        <div style="color: white; font-size: 30px; font-family: 'calibri'">
          Actualités
        </div>
      </div>

      <div class="spacer" />

      <div class="centered">
        <HomeCarrousel />
      </div>

      <div class="spacer" />
    </div>
  </q-img>

  <ContactsDiv />
</template>

<script>
import fond from "src/assets/Fond.jpg";
import HomeCarrousel from "../components/Caroussel/HomeCarrousel.vue";
import ContactsDiv from "../components/OtherComponents/ContactsDiv.vue";

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
