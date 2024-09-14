<template>
  <div class="container">
    <div class="calendar-info-wrapper">
      <div class="calendar" ref="calendar">
        <div class="titre">Disponibilités</div>
        <div class="calendar-header">
          <span class="month-change" id="prev-month">&#8249;</span>
          <span class="month-picker" id="month-picker">Mai</span>
          <span class="month-change" id="next-month">&#8250;</span>
          <div class="year-picker" id="year-picker">
            <span class="year-change" id="pre-year">&#8249;</span>
            <span id="year">2020</span>
            <span class="year-change" id="next-year">&#8250;</span>
          </div>
        </div>

        <div class="calendar-body">
          <div class="calendar-week-days">
            <div>Lun</div>
            <div>Mar</div>
            <div>Mer</div>
            <div>Jeu</div>
            <div>Ven</div>
            <div>Sam</div>
            <div>Dim</div>
          </div>
          <div class="calendar-days"></div>
        </div>
      </div>
    </div>

    <div class="info-sidebar">
      <div class="date-time-format">
        <div class="day-text-format">AUJOURD'HUI</div>
        <div class="date-time-value">
          <div class="time-format">01:41:20</div>
          <div class="date-format">03 - Mars - 2022</div>
        </div>
      </div>

      <div class="calendar-footer">
        <div class="day-text-format">Légende</div>
        <div class="legend-item">
          <div class="color-box orange"></div>
          <div class="legend">Une seule SB disponible</div>
        </div>
        <div class="legend-item">
          <div class="color-box red"></div>
          <div class="legend">Pas de SB disponible</div>
        </div>
      </div>

      <div class="calendar-footer">
        <div style="display: flex; justify-content: center">
          <AjouterLocation @get-locations="getLocations" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AjouterLocation from "./AjouterLocation.vue";
import { ref, onMounted } from "vue";

const locations = ref([]);
const calendar = ref(null);
const month_names = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

const getLocations = async () => {
  try {
    const response = await fetch(`${process.env.VUE_APP_API}/locations`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    locations.value = await response.json();
    updateCalendar();
  } catch (error) {
    console.error("Error getting locations:", error);
    alert("Erreur lors de la récupération des locations");
  }
};

const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

const getFebDays = (year) => {
  return isLeapYear(year) ? 29 : 28;
};

const generateCalendar = (month, year) => {
  const calendar_days = calendar.value.querySelector(".calendar-days");
  calendar_days.innerHTML = "";
  const calendar_header_year = calendar.value.querySelector("#year");
  const days_of_month = [
    31,
    getFebDays(year),
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  let first_day = new Date(year, month, 1).getDay();
  first_day = first_day === 0 ? 6 : first_day - 1;

  for (let i = 0; i < first_day + days_of_month[month]; i++) {
    const day = document.createElement("div");
    if (i >= first_day) {
      day.innerHTML = i - first_day + 1;
      const currentDate = new Date();
      if (
        i - first_day + 1 === currentDate.getDate() &&
        year === currentDate.getFullYear() &&
        month === currentDate.getMonth()
      ) {
        day.classList.add("current-date");
      }
    }
    calendar_days.appendChild(day);
  }

  // Set header
  const month_picker = calendar.value.querySelector("#month-picker");
  month_picker.innerText = month_names[month];
  calendar_header_year.innerText = year;
};

const updateCalendar = () => {
  generateCalendar(currentMonth.value, currentYear.value);

  const calendar_days = calendar.value.querySelector(".calendar-days").children;
  for (let day of calendar_days) {
    const date = new Date(currentYear.value, currentMonth.value, day.innerText);
    const formattedDate = date.toISOString().split("T")[0];

    const locs = locations.value.filter((loc) => loc.date === formattedDate);
    let sbCount = locs.reduce((count, loc) => count + loc.nbSB, 0);

    if (sbCount >= 2) {
      day.classList.add("red");
    } else if (sbCount === 1) {
      day.classList.add("orange");
    }
  }
};

onMounted(() => {
  calendar.value = document.querySelector(".calendar");
  getLocations();
  // Generate initial calendar
  generateCalendar(currentMonth.value, currentYear.value);

  // Month navigation
  document.querySelector("#prev-month").onclick = () => {
    if (currentMonth.value === 0) {
      currentMonth.value = 11;
      currentYear.value--;
    } else {
      currentMonth.value--;
    }
    updateCalendar();
  };

  document.querySelector("#next-month").onclick = () => {
    if (currentMonth.value === 11) {
      currentMonth.value = 0;
      currentYear.value++;
    } else {
      currentMonth.value++;
    }
    updateCalendar();
  };

  // Year navigation
  document.querySelector("#pre-year").onclick = () => {
    currentYear.value--;
    updateCalendar();
  };

  document.querySelector("#next-year").onclick = () => {
    currentYear.value++;
    updateCalendar();
  };

  // Show time
  const todayShowTime = document.querySelector(".time-format");
  const todayShowDate = document.querySelector(".date-format");
  const showCurrentDateOption = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  };
  const currentDateFormat = new Intl.DateTimeFormat(
    "fr-FR",
    showCurrentDateOption
  ).format(new Date());
  todayShowDate.textContent = currentDateFormat;

  setInterval(() => {
    const timer = new Date();
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    todayShowTime.textContent = new Intl.DateTimeFormat(
      "fr-FR",
      options
    ).format(timer);
  }, 1000);
});
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
  font-family: consolas, sans-serif;
  box-sizing: border-box;
}

body {
  display: flex;
  height: 100vh;
  width: 100%;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #6a5acd, #4b0082);
  overflow: hidden;
}

.container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.calendar-info-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.calendar {
  width: 400px;
  background-color: #ffffff;
  border-radius: 25px;
  padding: 35px 50px 0px 50px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 7px 29px 0px;
  margin-bottom: 20px; /* Margin to separate calendar from the info section */
}

.calendar-header {
  background: #4b0082;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  color: #ffffff;
  padding: 10px;
  border-radius: 7px;
}

.month-picker {
  padding: 5px 10px;
  border-radius: 10px;
  cursor: pointer;
}

.month-change {
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0 10px;
}

.month-change:hover {
  color: #f8fbff;
  transform: scale(1.2);
  transition: all 0.2s ease-in-out;
}

.year-picker {
  display: flex;
  align-items: center;
}

.year-change {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  margin: 0px 10px;
  cursor: pointer;
}

.year-change:hover {
  background-color: #6a5acd;
  transition: all 0.2s ease-in-out;
  transform: scale(1.12);
}

.calendar-body {
  padding: 10px;
  border: 1px solid #4b0082;
  border-radius: 5px;
  margin-bottom: 40px;
}

.calendar-week-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-weight: 600;
  cursor: pointer;
  color: #4b0082;
}

.calendar-week-days div {
  display: grid;
  place-items: center;
  height: 50px;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  color: #0a0921;
  min-height: 300px; /* Keeps the height consistent */
  font-family: "Calibri";
}

.calendar-days div {
  width: 37px;
  height: 37px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  position: relative;
  cursor: pointer;
  animation: to-top 1s forwards;
}

.calendar-days div:hover {
  transition: width 0.2s ease-in-out, height 0.2s ease-in-out;
  background-color: #9370db;
  border-radius: 50%;
  color: #f8fbff;
}

.calendar-days div.current-date {
  color: #ffffff;
  background-color: #4b0082;
  border-radius: 50%;
  width: 37px;
  height: 37px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.calendar-days div.red {
  background-color: #ff4c4c;
}

.calendar-days div.orange {
  background-color: #ff9c4c;
}

.date-time-format {
  background-color: #ffffff;
  border-radius: 25px;
  padding: 20px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 7px 29px 0px;
  width: 300px;
  margin-left: 20px;
}

.day-text-format {
  color: #4b0082;
  font-size: 1.2rem;
  padding-right: 5%;
  border-right: 3px solid #4b0082;
}

.date-time-value {
  display: block;
  text-align: center;
  padding-left: 5%;
}

.time-format {
  font-size: 1.5rem;
  color: #4b0082;
}

.date-format {
  color: #4b0082;
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

.red {
  background-color: #ff4c4c;
}

.orange {
  background-color: #ff9c4c;
}

.titre {
  color: #4b0082;
  font-family: "Calibri";
  font-weight: 500;
  font-size: 20px;
  margin-bottom: 20px;
}

@keyframes to-top {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  100% {
    transform: translateY(100%);
    opacity: 1;
  }
}
</style>
