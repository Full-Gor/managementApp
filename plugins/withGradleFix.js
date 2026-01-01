const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Plugin to fix components.release error in build.gradle
 * This error occurs when ExpoModulesCorePlugin tries to configure
 * maven-publish with a component that doesn't exist
 */
function withGradleFix(config) {
  return withAppBuildGradle(config, (config) => {
    let buildGradle = config.modResults.contents;

    // Add configuration to avoid components.release error
    // Only add if not already present
    if (!buildGradle.includes('expo.modules.core.publishing.disabled')) {
      // Append to the END of the file, not inside any block
      const gradleFix = `

// Fix for ExpoModulesCorePlugin components.release error
afterEvaluate {
    // Disable Maven publication tasks that cause issues
    tasks.matching { it.name.contains('publish') && it.name.contains('Release') }.configureEach {
        enabled = false
    }
}
`;
      // Append at the very end of the file
      buildGradle = buildGradle.trimEnd() + gradleFix;
    }

    config.modResults.contents = buildGradle;
    return config;
  });
}

module.exports = withGradleFix;
