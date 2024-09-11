function formatDate(isoDate) {
  const date = new Date(isoDate);
  const mois = [
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
  const jour = date.getDate();
  const moisIndex = date.getMonth();
  const annee = date.getFullYear();
  return `${jour} ${mois[moisIndex]} ${annee}`;
}

function boolToNumber(bool) {
  if (bool == false) {
    return 0;
  } else {
    return 1;
  }
}

module.exports = {
  formatDate,
  boolToNumber,
};
