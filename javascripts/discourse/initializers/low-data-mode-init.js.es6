import { withPluginApi } from 'discourse/lib/plugin-api'
import { computed } from "@ember/object"
import I18n from "I18n";

export default {
  name: 'low-data-mode',
  initialize () {
      withPluginApi('0.8.22', api => {
        api.modifyClass('controller:preferences/interface', {
          pluginId: 'low-data-mode',
          actions: {
            save() {
              this._super(...arguments);
              localStorage.setItem('discourse-low-data-mode', (this.model.get('lowDataMode.image') ? '1' : '0') + (this.model.get('lowDataMode.video') ? '1' : '0'));
            }
          }
        });
        api.modifyClass("route:preferences-interface", {
          pluginId: 'low-data-mode',
          init() {
            this._super(...arguments);
            this.router.on('routeWillChange', (transition) => {
              if (transition.from.find(route => route.name === this.routeName) && !transition.to.find(route => route.name === this.routeName)) {
                const user = this.modelFor("user");
                const lowDataMode = localStorage.getItem('discourse-low-data-mode') ?? '00';
                user.set('lowDataMode.image', lowDataMode[0] === '1');
                user.set('lowDataMode.video', lowDataMode[1] === '1');
              }
            });
          },
        })
        api.decorateCookedElement(
          post => {
            function hide_element(elem, placeholder_text) {
              const placeholder = document.createElement('a');
              placeholder.innerText = placeholder_text;
              placeholder.setAttribute('data-previous', elem.outerHTML);
              placeholder.addEventListener('click', function (event) {
                const placeholder = event.target;
                const previous = (new DOMParser()).parseFromString(placeholder.getAttribute('data-previous'), 'text/html').body.firstChild;;
                placeholder.replaceWith(previous);
              })
              elem.replaceWith(placeholder);
            }
            if (api.getCurrentUser().get('lowDataMode.image')) {
              post.querySelectorAll('.lightbox:not(.emoji):not(.avatar)')
                .forEach((img) => hide_element(img, I18n.t(themePrefix("place_holder_image"))));
              post.querySelectorAll('img:not(.emoji):not(.avatar)')
                .forEach((img) => hide_element(img, I18n.t(themePrefix("place_holder_image"))));
            }
            if (api.getCurrentUser().get('lowDataMode.video')) {
              ['.video-container', 'video', 'audio', 'iframe'].forEach((selector) => {
                post.querySelectorAll(selector)
                  .forEach((video) => hide_element(video, I18n.t(themePrefix("place_holder_video"))));
              }
              );
            }
          },
          { id: 'low-data-mode', onlyStream: false }
        );
      })
  }
}