module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: [
            ">0.2%",
            "not dead",
            "not op_mini all",
            "ios >= 8",
            "android >= 4",
          ],
        },
      },
    ],
    "@babel/preset-typescript",
  ],
};
