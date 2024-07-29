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

export default {
  alert,
  validate,
};
