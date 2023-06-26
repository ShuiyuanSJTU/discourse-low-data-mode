import { withPluginApi } from 'discourse/lib/plugin-api'
import { computed } from "@ember/object"
import I18n from "I18n";

export default {
  name: 'low-data-mode',
  before: "inject-discourse-objects",
  initialize () {
      withPluginApi('0.8.22', api => {
        api.modifyClass('model:user', {
          pluginId: 'low-data-mode',
          lowDataMode: {},
            lowDataModeImage: computed({
              set(key, value) {
                this.set('lowDataMode.Image_', value);
                return value;
              },
              get() {
                if (this.get('lowDataMode.Image_') !== undefined) {
                  return this.get('lowDataMode.Image_');
                }
                const lowDataMode = localStorage.getItem('discourse-low-data-mode') ?? '00';
                this.set('lowDataMode.Image_', lowDataMode[0] === '1');
                return this.get('lowDataMode.Image_');
              },
            }),
            lowDataModeVideo: computed({
              set(key, value) {
                this.set('lowDataMode.Video_', value);
                return value;
              },
              get() {
                if (this.get('lowDataMode.Video_') !== undefined) {
                  return this.get('lowDataMode.Video_');
                }
                const lowDataMode = localStorage.getItem('discourse-low-data-mode') ?? '00';
                this.set('lowDataMode.Video_', lowDataMode[1] === '1');
                return this.get('lowDataMode.Video_');
              },
            }),
        });
      })
  }
}