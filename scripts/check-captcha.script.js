import { RECAPTCHA_SITE_KEY, RE_CAPTCHA_SDK_URL, SITE_PATH_HOME, redirectTo, script_to_head } from "./util.js";
import { validateCaptcha } from "../service/api.service.js";

document.addEventListener("DOMContentLoaded", () => {
  // script
  //     src="https://www.google.com/recaptcha/api.js?render=6LfudxMpAAAAAPO69qoWbC5Wg1iODmA_QjIJcleP"
  //     async
  //     defer
  //   ></script>

  script_to_head({
    src: `${RE_CAPTCHA_SDK_URL}${RECAPTCHA_SITE_KEY}`,
  }).then(function () {
    window?.grecaptcha?.ready(function () {
      grecaptcha
        .execute(RECAPTCHA_SITE_KEY, { action: "submit" })
        .then(async function (token) {
          const isHuman = await validateCaptcha(token);
          if (!isHuman) {
            redirectTo(SITE_PATH_HOME, { replace: true });
          }
        })
        .catch((err) => {
          redirectTo(SITE_PATH_HOME, { replace: true });
        });
    });
  });
});
