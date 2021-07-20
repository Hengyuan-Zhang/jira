const CracoLessPlugin = require("craco-less");
module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "rgb(0, 82,204)",
              "@font-siz-base": "16px",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
