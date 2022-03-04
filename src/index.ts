import { notifyFailure, notifySuccess } from "./notification";
import { doPunch } from "./punch";

(async () => {
  try {
    doPunch();

    notifySuccess();
  } catch {
    notifyFailure();
  }
})();
