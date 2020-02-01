module.exports = function(api) {
  // const babelEnv = api.env();
  api.cache(true);

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
  const plugins = [["@babel/plugin-proposal-class-properties", { loose: true }]];

  return { presets, plugins };
};
