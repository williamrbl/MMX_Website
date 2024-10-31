<template>
  <div class="background-container">
    <q-parallax :src="fond" :height="1100" :speed="1">
      <div class="centered">
        <div class="content-container centered">
          <div class="welcome-message">Bienvenue chez Musique Mix !</div>

          <div class="news-section">
            <div class="news-title">Actualités</div>
          </div>

          <div class="spacer" />

          <div class="carrousel-container">
            <HomeCarrousel style="margin-bottom: 20%" />
          </div>

          <div class="spacer" />
        </div>
      </div>
    </q-parallax>

    <ContactsDiv />
  </div>
</template>

<script>
import fond from "src/assets/Fond.jpg";
import HomeCarrousel from "../components/Caroussel/HomeCarrousel.vue";
import ContactsDiv from "../components/Other/ContactsDiv.vue";

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
.background-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.content-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 10%;
  box-sizing: border-box;
}

.welcome-message {
  color: white;
  font-size: 40px;
  font-family: Arupala Grotesk Ultra;
  margin-bottom: 20px;
}

.news-section {
  width: 100%;
  margin-bottom: 20px;
}

.news-title {
  color: white;
  font-size: 30px;
  font-family: Aileron Light;
}

.carrousel-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.large-screen-only {
  display: block;
}

.small-screen-only {
  display: none;
}

/* Media queries to handle screen sizes */
@media (max-width: 767px) {
  .large-screen-only {
    display: none;
  }
  .small-screen-only {
    display: block;
  }
}

.spacer {
  height: 50px;
}
</style>
