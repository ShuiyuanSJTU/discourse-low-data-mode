import { withPluginApi } from 'discourse/lib/plugin-api'
import { computed } from "@ember/object"
import I18n from "I18n";

export default {
  name: 'low-data-mode',
  initialize () {
      withPluginApi('0.8.22', api => {
        console.log('low-data-mode plugin loaded')
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
          // }
        });
        api.modifyClass('controller:preferences/interface', {
          pluginId: 'low-data-mode',
          actions: {
            save() {
              localStorage.setItem('discourse-low-data-mode', (this.model.get('lowDataModeImage') ? '1' : '0') + (this.model.get('lowDataModeVideo') ? '1' : '0'));
              this._super();
            }
          }
        });
        api.decorateCookedElement(
          post => {
            function hide_element(elem,placeholder_text){
              const previous = elem;
              const placeholder = document.createElement('a');
              placeholder.innerText = placeholder_text;
              placeholder.setAttribute('data-previous',elem.outerHTML);
              placeholder.addEventListener('click',function(event) {
                  const placeholder = event.target;
                  const previous = (new DOMParser()).parseFromString(placeholder.getAttribute('data-previous'), 'text/html').body.firstChild;;
                  placeholder.replaceWith(previous);
              })
              elem.replaceWith(placeholder);
            }
            if (api.getCurrentUser().get('lowDataModeImage')) { 
              post.querySelectorAll('.lightbox:not(.emoji):not(.avatar)')
                .forEach((img) => hide_element(img, I18n.t(themePrefix("place_holder_image"))));
              post.querySelectorAll('img:not(.emoji):not(.avatar)')
                .forEach((img) => hide_element(img, I18n.t(themePrefix("place_holder_image"))));
            }
            if (api.getCurrentUser().get('lowDataModeVideo')) {
              post.querySelectorAll('video')
                .forEach((video) => hide_element(video, I18n.t(themePrefix("place_holder_video"))));
            }
          },
          { id: 'bilibili-onebox-decorator', onlyStream: true }
        );
      })
  }
}