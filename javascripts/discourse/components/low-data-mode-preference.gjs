import PreferenceCheckbox from "discourse/components/preference-checkbox";
import { i18n } from "discourse-i18n";

const LowDataModePreference = <template>
  <div class="control-group low-data-mode">
    <label class="control-label">{{i18n (themePrefix "low_data_mode")}}</label>
    <div class="controls">
      <PreferenceCheckbox
        @labelKey={{themePrefix "low_data_mode_image"}}
        @checked={{@model.lowDataMode.image}}
      />
    </div>
    <div class="controls">
      <PreferenceCheckbox
        @labelKey={{themePrefix "low_data_mode_video"}}
        @checked={{@model.lowDataMode.video}}
      />
    </div>
  </div>
</template>;

export default LowDataModePreference;
