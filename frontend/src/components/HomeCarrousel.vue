<template>
  <div style="width: 50%">
    <q-carousel
      v-model="slide"
      transition-prev="slide-right"
      transition-next="slide-left"
      animated
      control-color="primary"
      class="rounded-borders"
      style="background-color: purple"
      @click="handleCarouselClick"
    >
      <q-carousel-slide name="one" class="column flex-center">
        <q-img
          :src="trio"
          style="width: 100%; height: 100%; border-radius: 5px"
          @mouseover="isHovered = true"
          @mouseleave="isHovered = false"
        >
          <div style="display: flex; align-items: end; justify-content: center">
            <div class="annonce-font">Musique Mix à Paris La Défense Arena</div>
          </div>

          <div
            v-if="isHovered"
            class="bg-grey-5 cursor-pointer"
            style="
              border: 1px solid white;
              bottom: 0;
              right: 0;
              opacity: 0.7;
              border-radius: 5px;
            "
            @click="changePage('arena2024')"
          >
            Voir plus
          </div>
        </q-img>
      </q-carousel-slide>

      <q-carousel-slide name="two" class="column no-wrap flex-center">
        <div class="q-pa-md centered col">
          <div color="white">{{ articlesImported }}</div>
          <div class="annonce-font">Longue vie au studio</div>
        </div>
      </q-carousel-slide>

      <q-carousel-slide name="three" class="column no-wrap flex-center">
        <div class="q-pa-md centered col">
          <div class="annonce-font">Recrutements</div>
        </div>
      </q-carousel-slide>

      <q-carousel-slide name="four" class="column no-wrap flex-center">
      </q-carousel-slide>
    </q-carousel>

    <div class="row justify-center q-mt-md">
      <q-btn-toggle
        v-model="slide"
        :options="[
          { label: 1, value: 'one' },
          { label: 2, value: 'two' },
          { label: 3, value: 'three' },
          { label: 4, value: 'four' },
        ]"
        style="border: 1px solid white; color: white"
        @click="handleButtonToggleClick"
      />
    </div>
  </div>
  <div v-if="display">
    <EditCaroussel :articlesImported="articlesImported" />
  </div>
</template>

<script>
import trio from "src/assets/trioarena.jpg";
import EditCaroussel from "./EditCaroussel.vue";

export default {
  name: "HomeCarrousel",
  components: { EditCaroussel },

  data() {
    return {
      trio,
      isHovered: false,
      slide: "one",
      interval: null,
      restartTimeout: null,
      intervalDuration: 5000,
      restartDelay: 10000,
      slides: ["one", "two", "three", "four"],
      display: false,
      articlesImported: [],
    };
  },
  methods: {
    changeSlide() {
      const currentIndex = this.slides.indexOf(this.slide);
      const nextIndex = (currentIndex + 1) % this.slides.length;
      this.slide = this.slides[nextIndex];
    },

    startInterval() {
      if (this.interval) clearInterval(this.interval);
      this.interval = setInterval(this.changeSlide, this.intervalDuration);
    },

    stopInterval() {
      if (this.interval) clearInterval(this.interval);
    },

    restartAutoAdvance() {
      this.stopInterval();
      this.restartTimeout = setTimeout(this.startInterval, this.restartDelay);
    },

    handleCarouselClick() {
      this.restartAutoAdvance();
    },

    handleButtonToggleClick() {
      this.restartAutoAdvance();
    },

    changePage(page) {
      this.$router.push(`/${page}`);
    },
  },

  mounted() {
    this.startInterval();
  },

  beforeUnmount() {
    this.stopInterval();
    if (this.restartTimeout) clearTimeout(this.restartTimeout);
  },
};
</script>

<style scoped>
.annonce-font {
  font-size: large;
  color: white;
  font-family: "CALIBRI";
}
</style>
