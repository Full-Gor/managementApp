const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Plugin pour corriger l'erreur components.release dans build.gradle
 * Cette erreur survient quand ExpoModulesCorePlugin essaie de configurer
 * maven-publish avec un composant qui n'existe pas
 */
function withGradleFix(config) {
  return withAppBuildGradle(config, (config) => {
    let buildGradle = config.modResults.contents;

    // Ajouter la configuration pour éviter l'erreur components.release
    if (!buildGradle.includes('afterEvaluate')) {
      const insertPoint = buildGradle.lastIndexOf('}');
      const gradleFix = `
// Fix pour l'erreur ExpoModulesCorePlugin components.release
afterEvaluate {
    // Désactiver la publication Maven si elle cause des problèmes
    tasks.matching { it.name.contains('publish') && it.name.contains('Release') }.configureEach {
        enabled = false
    }

    // S'assurer que les composants existent avant publication
    if (project.plugins.hasPlugin('maven-publish')) {
        publishing {
            publications {
                // Configuration vide pour éviter l'erreur
            }
        }
    }
}
`;
      buildGradle = buildGradle.slice(0, insertPoint) + gradleFix + buildGradle.slice(insertPoint);
    }

    config.modResults.contents = buildGradle;
    return config;
  });
}

module.exports = withGradleFix;
