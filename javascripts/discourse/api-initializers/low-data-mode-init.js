import { action } from "@ember/object";
import { apiInitializer } from "discourse/lib/api";
import { i18n } from "discourse-i18n";

export default apiInitializer((api) => {
  api.modifyClass(
    "controller:preferences/interface",
    (Superclass) =>
      class extends Superclass {
        @action
        save() {
          super.save(...arguments);
          localStorage.setItem(
            "discourse-low-data-mode",
            (this.model.get("lowDataMode.image") ? "1" : "0") +
              (this.model.get("lowDataMode.video") ? "1" : "0")
          );
        }
      }
  );
  api.modifyClass(
    "route:preferences-interface",
    (Superclass) =>
      class extends Superclass {
        init() {
          super.init(...arguments);
          this.router.on("routeWillChange", (transition) => {
            if (
              transition.from?.find((route) => route.name === this.routeName) &&
              !transition.to?.find((route) => route.name === this.routeName)
            ) {
              const user = this.modelFor("user");
              const lowDataMode =
                localStorage.getItem("discourse-low-data-mode") ?? "00";
              user.set("lowDataMode.image", lowDataMode[0] === "1");
              user.set("lowDataMode.video", lowDataMode[1] === "1");
            }
          });
        }
      }
  );
  api.decorateCookedElement(
    (post) => {
      function hide_element(elem, placeholder_text) {
        const placeholder = document.createElement("a");
        placeholder.innerText = placeholder_text;
        placeholder.setAttribute("data-previous", elem.outerHTML);
        placeholder.addEventListener("click", function (event) {
          const targetPlaceholder = event.target;
          const previous = new DOMParser().parseFromString(
            targetPlaceholder.getAttribute("data-previous"),
            "text/html"
          ).body.firstChild;
          targetPlaceholder.replaceWith(previous);
        });
        elem.replaceWith(placeholder);
      }
      if (api.getCurrentUser().get("lowDataMode.image")) {
        post
          .querySelectorAll(".lightbox:not(.emoji):not(.avatar)")
          .forEach((img) =>
            hide_element(img, i18n(themePrefix("place_holder_image")))
          );
        post
          .querySelectorAll("img:not(.emoji):not(.avatar)")
          .forEach((img) =>
            hide_element(img, i18n(themePrefix("place_holder_image")))
          );
      }
      if (api.getCurrentUser().get("lowDataMode.video")) {
        [".video-container", "video", "audio", "iframe"].forEach((selector) => {
          post
            .querySelectorAll(selector)
            .forEach((video) =>
              hide_element(video, i18n(themePrefix("place_holder_video")))
            );
        });
      }
    },
    { id: "low-data-mode", onlyStream: false }
  );
});
