import {
  getSettingsMenuApi,
} from "../repositories/settingsRepository";

import type {
  SettingsMenuResponse,
} from "../types/settings.types";

class SettingsService {

  async getMenu():
    Promise<SettingsMenuResponse> {

    return await getSettingsMenuApi();
  }
}

export default new SettingsService();