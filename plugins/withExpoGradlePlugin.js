/**
 * Config plugin to fix expo-module-gradle-plugin resolution
 * This ensures the plugin is correctly included in settings.gradle
 */
const { withSettingsGradle } = require('@expo/config-plugins');

const withExpoGradlePlugin = (config) => {
  return withSettingsGradle(config, (config) => {
    let contents = config.modResults.contents;

    // Check if already has the proper includeBuild for gradle-plugin
    if (contents.includes("includeBuild('node_modules/expo-modules-core/android/gradle-plugin')") ||
        contents.includes('includeBuild("node_modules/expo-modules-core/android/gradle-plugin")')) {
      return config;
    }

    // Add pluginManagement block with includeBuild if not present
    const pluginManagementBlock = `
// Added by withExpoGradlePlugin config plugin
pluginManagement {
    includeBuild(new File(rootDir, "node_modules/expo-modules-core/android/gradle-plugin"))
    includeBuild(new File(rootDir, "node_modules/@react-native/gradle-plugin"))
    repositories {
        gradlePluginPortal()
        google()
        mavenCentral()
    }
}
`;

    // Check if pluginManagement already exists
    if (contents.includes('pluginManagement')) {
      // Add includeBuild to existing pluginManagement
      contents = contents.replace(
        /pluginManagement\s*\{/,
        `pluginManagement {
    includeBuild(new File(rootDir, "node_modules/expo-modules-core/android/gradle-plugin"))`
      );
    } else {
      // Add new pluginManagement block at the beginning
      contents = pluginManagementBlock + '\n' + contents;
    }

    config.modResults.contents = contents;
    return config;
  });
};

module.exports = withExpoGradlePlugin;
