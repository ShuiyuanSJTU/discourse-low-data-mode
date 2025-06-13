import Component from "@ember/component";
import { classNames } from "@ember-decorators/component";
import LowDataModePreference from "../../components/low-data-mode-preference";

@classNames("user-preferences-interface-outlet", "low-data-mode")
export default class LowDataModeConnector extends Component {
  <template><LowDataModePreference @model={{this.model}} /></template>
}
