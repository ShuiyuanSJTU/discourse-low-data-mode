import Component from "@ember/component";
import { classNames } from "@ember-decorators/component";
import { eq } from "truth-helpers";
import LowDataModePreference from "../../components/low-data-mode-preference";

@classNames("user-preferences-interface-outlet", "low-data-mode")
export default class LowDataModeConnector extends Component {
  <template>
    {{#if (eq this.currentUser.id this.model.id)}}
      <LowDataModePreference @model={{this.model}} />
    {{/if}}
  </template>
}
