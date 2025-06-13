import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "low-data-mode",
  before: "inject-discourse-objects",
  initialize() {
    withPluginApi("0.8.22", (api) => {
      api.modifyClass("model:user", {
        pluginId: "low-data-mode",
        lowDataMode: {},

        init() {
          this._super(...arguments);
          const lowDataMode =
            localStorage.getItem("discourse-low-data-mode") ?? "00";
          this.set("lowDataMode.image", lowDataMode[0] === "1");
          this.set("lowDataMode.video", lowDataMode[1] === "1");
        },
      });
    });
  },
};
