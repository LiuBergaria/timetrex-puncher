import { notifyFailure, notifySuccess } from "./notification";
import { doPunch } from "./punch";

doPunch()
  .then(() => notifySuccess())
  .catch((e) => notifyFailure(e));
