<template>
  <div class="carousel-container">
    <q-carousel
      v-model="slide"
      transition-prev="slide-right"
      transition-next="slide-left"
      animated
      control-color="primary"
      class="rounded-borders caroussel"
      @click="handleCarouselClick"
    >
      <q-carousel-slide
        v-for="(slideName, index) in slides"
        :key="index"
        :name="slideName"
      >
        <q-img :src="articles[index].photo" class="carousel-img" lazy-src>
          <div class="description-container">
            <div class="annonce-font">{{ articles[index].description }}</div>
          </div>
        </q-img>
      </q-carousel-slide>
    </q-carousel>

    <div class="row justify-center q-mt-md">
      <q-btn-toggle
        v-model="slide"
        :options="options"
        class="toggle-btn"
        @click="handleButtonToggleClick"
      />
    </div>
  </div>
</template>

<script>
import trio from "src/assets/trioarena.jpg";

export default {
  name: "HomeCarrousel",
  data() {
    return {
      trio,
      isHovered: false,
      slide: "one",
      interval: null,
      restartTimeout: null,
      intervalDuration: 4000,
      restartDelay: 8000,
      slides: [],
      articles: [],
      options: [],
      observers: [],
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
      if (this.restartTimeout) clearTimeout(this.restartTimeout);
      this.restartTimeout = setTimeout(this.startInterval, this.restartDelay);
    },

    handleCarouselClick() {
      this.restartAutoAdvance();
    },

    handleButtonToggleClick() {
      this.restartAutoAdvance();
    },

    async getArticles() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API}/articles`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        this.articles = data;
        this.slides = data.map((_, index) => `slide-${index}`);
        this.options = data.map((_, index) => ({
          label: index + 1,
          value: this.slides[index],
        }));

        this.slide = this.slides[0];

        this.preloadImages();
      } catch (error) {
        console.error("Error getting articles:", error);
        this.$q.notify({
          color: "negative",
          message: "Erreur lors de la récupération des articles",
        });
      }
    },

    preloadImages() {
      this.articles.forEach((article) => {
        const img = new Image();
        img.src = article.photo;
        img.onload = () => console.log(`${article.photo} preloaded`);
      });
    },

    observeImages() {
      const options = {
        root: null,
        threshold: 0.1,
      };

      this.observers = this.articles.map((article, index) => {
        console.log("Observing : ", article);
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = new Image();
              img.src = article.photo;
              observer.unobserve(entry.target);
            }
          });
        }, options);

        const imgElement = document.querySelector(
          `.carousel-img[data-index="${index}"]`
        );
        if (imgElement) observer.observe(imgElement);

        return observer;
      });
    },
  },

  mounted() {
    this.startInterval();
    this.getArticles();

    this.$nextTick(() => {
      this.observeImages();
    });
  },

  beforeUnmount() {
    this.stopInterval();
    if (this.restartTimeout) clearTimeout(this.restartTimeout);
    // Disconnect all observers on unmount
    this.observers.forEach((observer) => observer.disconnect());
  },
};
</script>

<style scoped>
.carousel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.caroussel {
  background-color: #800b95;
  height: 50vh;
  width: 50vw;

  @media (max-width: 575px) {
    height: 30vh;
    width: 90vw;
  }
}

.carousel-img {
  width: 100%;
  height: 100%;
  border-radius: 5px;
}

.description-container {
  display: flex;
  align-items: end;
  justify-content: center;
}

.toggle-btn {
  border: 1px solid white;
  color: white;
}

.annonce-font {
  font-size: large;
  color: white;
}

.carousel-img {
  position: relative;
}

.description-container {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 10px;
  border-radius: 5px;
  max-width: 90%;
  box-sizing: border-box;
  font-family: Aileron Light;
}
</style>
