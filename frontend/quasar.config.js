/* eslint-env node */

const { configure } = require("quasar/wrappers");
const dotenv = require("dotenv");

// if (process.env.NODE_ENV !== "production") {
//   dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });
// }

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

module.exports = configure(function (/* ctx */) {
  return {
    boot: [],
    css: ["app.scss"],
    extras: ["eva-icons", "line-awesome", "roboto-font", "material-icons"],
    build: {
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node20",
      },
      env: {
        VUE_APP_PASSWORD: process.env.VUE_APP_PASSWORD,
        VUE_APP_API: process.env.VUE_APP_API,
      },
      vueRouterMode: "history",
      vitePlugins: [
        [
          "vite-plugin-checker",
          {
            eslint: {
              lintCommand: 'eslint "./**/*.{js,mjs,cjs,vue}"',
            },
          },
          { server: false },
        ],
      ],
    },
    devServer: {
      open: true,
    },
    framework: {
      plugins: ["Notify", "Loading"],
    },
    animations: [],
    ssr: {
      pwa: false,
      prodPort: 3000,
      middlewares: ["render"],
    },
    pwa: {
      workboxPluginMode: "InjectManifest",
      injectManifest: {
        swSrc: "src-pwa/custom-service-worker.js",
        swDest: "service-worker.js",
      },
    },
    capacitor: {
      hideSplashscreen: true,
    },
    electron: {
      inspectPort: 5858,
      bundler: "packager",
      packager: {},
      builder: {
        appId: "Musique Mix",
      },
    },
    bex: {
      contentScripts: ["my-content-script"],
    },
  };
});
