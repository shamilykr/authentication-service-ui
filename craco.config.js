const path = require("path");
module.exports = {
  webpack: {
    alias: {
      assets: path.resolve(__dirname, "src/assets"),
      components: path.resolve(__dirname, "src/components"),
      constants: path.resolve(__dirname, "src/constants"),
      containers: path.resolve(__dirname, "src/containers"),
      hooks: path.resolve(__dirname, "src/hooks"),
      states: path.resolve(__dirname, "src/states"),
      types: path.resolve(__dirname, "src/types"),
      utils: path.resolve(__dirname, "src/utils"),
    },
  },
};
