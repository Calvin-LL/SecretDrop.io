module.exports = function(api) {
  // const babelEnv = api.env();

  const presets = [
    "@babel/preset-typescript",
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: 3,
        modules: "commonjs",
        shippedProposals: true,
      },
    ],
  ];
  const plugins = [];

  return { presets, plugins };
};
