<template>
  <div class="contact-container q-pa-xl row">
    <div class="contact-details col-6">
      <div class="contact-title">Contact:</div>
      <div class="spacer" />
      <div>
        <div class="contact-row">
          <q-icon name="eva-email-outline" color="white" class="contact-icon" />
          <div class="contact-text">musiquemix@devinci.fr</div>
        </div>
        <div class="contact-row">
          <q-icon name="la la-youtube" color="white" class="contact-icon" />
          <a
            class="contact-link cursor-pointer"
            href="https://www.youtube.com/channel/UC0rRdwDiwU8Cnsun4EfiLag"
            target="_blank"
          >
            Chaîne YouTube
          </a>
        </div>
        <div class="contact-row">
          <q-icon name="la la-instagram" color="white" class="contact-icon" />
          <a
            class="contact-link cursor-pointer"
            href="https://www.instagram.com/musiquemix_/"
            target="_blank"
          >
            Instagram
          </a>
        </div>
      </div>
    </div>
    <div class="contact-logo col-6">
      <q-img class="logo-img" :src="pole" />
    </div>
  </div>
</template>

<script>
import pole from "src/assets/Pole.png";

export default {
  name: "ContactsDiv",
  data() {
    return {
      pole,
    };
  },
};
</script>

<style scoped>
.contact-container {
  background-color: #800b95;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 200px;
}

.contact-details {
  display: flex;
  flex-direction: column;
}

.contact-title {
  font-size: 20px;
  font-family: "Calibri", sans-serif;
  font-weight: bold;
}

.spacer {
  margin-bottom: 10px;
}

.contact-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.contact-icon {
  margin-right: 15px;
}

.contact-text,
.contact-link {
  font-size: 16px;
  font-family: Aileron Light;
}

.contact-link {
  text-decoration: none;
  color: white;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: #d1c4e9; /* Light purple for hover */
}

.contact-logo {
  display: flex;
  justify-content: flex-end;
}

.logo-img {
  width: 80px; /* Adjust the size as needed */
}
</style>
