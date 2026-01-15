/**
 * Config plugin to fix expo-module-gradle-plugin resolution
 * This ensures the plugin is correctly included in settings.gradle
 *
 * IMPORTANT: rootDir in settings.gradle is android/, so paths must use ../
 */
const { withSettingsGradle } = require('@expo/config-plugins');

const withExpoGradlePlugin = (config) => {
  return withSettingsGradle(config, (config) => {
    let contents = config.modResults.contents;

    // Check if already has the proper includeBuild for gradle-plugin
    if (contents.includes('// EXPO_GRADLE_PLUGIN_FIX')) {
      return config;
    }

    // Add pluginManagement block with correct relative path (../ because rootDir is android/)
    const pluginManagementBlock = `// EXPO_GRADLE_PLUGIN_FIX
pluginManagement {
    includeBuild("../node_modules/expo-modules-core/android/gradle-plugin")
    includeBuild("../node_modules/@react-native/gradle-plugin")
    repositories {
        gradlePluginPortal()
        google()
        mavenCentral()
    }
}

`;

    // Check if pluginManagement already exists
    if (contents.includes('pluginManagement')) {
      // Add includeBuild to existing pluginManagement with correct path
      contents = contents.replace(
        /pluginManagement\s*\{/,
        `pluginManagement {
    // EXPO_GRADLE_PLUGIN_FIX
    includeBuild("../node_modules/expo-modules-core/android/gradle-plugin")`
      );
    } else {
      // Add new pluginManagement block at the beginning
      contents = pluginManagementBlock + contents;
    }

    config.modResults.contents = contents;
    return config;
  });
};

module.exports = withExpoGradlePlugin;
