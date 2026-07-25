import "vuetify/styles";

import "@mdi/font/css/materialdesignicons.css";

import { createVuetify } from "vuetify";

export default createVuetify({

  icons: {
    defaultSet: "mdi",
  },

  defaults: {

    global: {

      style: {

        fontFamily: "Poppins, sans-serif",

      },

    },

  },

});