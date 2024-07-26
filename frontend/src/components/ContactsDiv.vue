<template>
  <div class="bg-purple q-pa-xl row">
    <div class="col-6">
      <div style="color: white; font-size: 20px; font-family: 'calibri'">
        Contact :
      </div>
      <div style="height: 10px" />
      <div class="row" style="display: flex; align-items: center">
        <q-icon
          name="eva-email-outline"
          color="white"
          style="margin-right: 10px"
        />
        <div style="color: white">musiquemix@edu.devinci.fr</div>
      </div>
      <div class="row" style="display: flex; align-items: center">
        <q-icon name="la la-youtube" color="white" style="margin-right: 10px" />
        <div
          clickable
          style="color: white"
          class="cursor-pointer"
          href="https://www.youtube.com/channel/UC0rRdwDiwU8Cnsun4EfiLag"
          target="_blank"
        >
          https://www.youtube.com/channel/UC0rRdwDiwU8Cnsun4EfiLag
        </div>
      </div>
    </div>
    <div
      style="display: flex; align-items: center; justify-content: end"
      class="col-6"
    >
      <q-img style="width: 10%" :src="pole" />
    </div>
  </div>
</template>

<script>
import pole from "../assets/Pole.png";
export default {
  name: "ContactsDiv",
  data() {
    return {
      pole,
    };
  },
};
</script>
