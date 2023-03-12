/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: 'app',
  browserBuildDirectory: 'public/build',
  publicPath: '/build/',
  serverBuildDirectory: 'build',
  devServerPort: 8002,
  serverDependenciesToBundle: [/^marked.*/, '@sindresorhus/slugify', '@sindresorhus/transliterate'],
  future: {
    unstable_tailwind: true,
    v2_routeConvention: true,
  },
};
