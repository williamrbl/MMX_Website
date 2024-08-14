import { Notify, QNotifyCreateOptions } from "quasar";

function alert(arg: string | Error) {
  const message = arg instanceof Error ? arg.message : arg;
  console.error(arg);
  Notify.create({
    message: message,
    type: "negative",
    position: "top-right",
  } as QNotifyCreateOptions);
}

function validate(arg: string | Error) {
  const message = arg instanceof Error ? arg.message : arg;
  console.log(arg);
  Notify.create({
    message: message,
    type: "positive",
    position: "top-right",
  } as QNotifyCreateOptions);
}

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

export default {
  alert,
  validate,
  formatDate,
};
