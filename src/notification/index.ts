import notifier from "node-notifier";

const title = "Timetrex Puncher";

export const notifySuccess = () => {
  notifier.notify({
    title,
    message: "Successfully punched",
    sound: true,
  });
};

export const notifyFailure = (error: Error) => {
  notifier.notify({
    title,
    message: `Failed on do punch: ${error.message}`,
    sound: true,
  });
};
