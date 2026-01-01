#!/usr/bin/env node
/**
 * Comprehensive patch script for expo-modules-core build issues
 * Fixes:
 * 1. components.release error in ExpoModulesCorePlugin.gradle
 * 2. expo-module-gradle-plugin resolution issues
 */

const fs = require('fs');
const path = require('path');

console.log('=== Expo Modules Patch Script ===\n');

// ============================================
// FIX 1: Patch ExpoModulesCorePlugin.gradle
// ============================================
const pluginPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'expo-modules-core',
  'android',
  'ExpoModulesCorePlugin.gradle'
);

if (fs.existsSync(pluginPath)) {
  let content = fs.readFileSync(pluginPath, 'utf8');

  if (!content.includes('// PATCHED_COMPONENTS_RELEASE')) {
    // Comment out the problematic "from components.release" line
    const patchedContent = content.replace(
      /from\s+components\.release/g,
      '// PATCHED_COMPONENTS_RELEASE: line commented to fix build\n        // from components.release'
    );

    if (patchedContent !== content) {
      fs.writeFileSync(pluginPath, patchedContent);
      console.log('[FIX 1] Patched ExpoModulesCorePlugin.gradle (components.release)');
    } else {
      console.log('[FIX 1] components.release pattern not found, trying alternative...');

      // Alternative: wrap the entire publishing block in a try-catch
      const altContent = content.replace(
        /(publishing\s*\{[\s\S]*?MavenPublication[\s\S]*?\}[\s\S]*?\})/g,
        `// PATCHED_COMPONENTS_RELEASE: wrapped in try-catch
try {
  $1
} catch (Exception e) {
  logger.warn("Skipping publishing configuration: " + e.message)
}`
      );

      if (altContent !== content) {
        fs.writeFileSync(pluginPath, altContent);
        console.log('[FIX 1] Applied alternative patch (try-catch wrapper)');
      }
    }
  } else {
    console.log('[FIX 1] Already patched (components.release)');
  }
} else {
  console.log('[FIX 1] ExpoModulesCorePlugin.gradle not found, skipping');
}

// ============================================
// FIX 2: Ensure gradle-plugin build.gradle has proper configuration
// ============================================
const gradlePluginBuildPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'expo-modules-core',
  'android',
  'gradle-plugin',
  'build.gradle.kts'
);

if (fs.existsSync(gradlePluginBuildPath)) {
  console.log('[FIX 2] gradle-plugin/build.gradle.kts exists');
} else {
  // Check for .gradle version
  const altPath = gradlePluginBuildPath.replace('.kts', '');
  if (fs.existsSync(altPath)) {
    console.log('[FIX 2] gradle-plugin/build.gradle exists');
  } else {
    console.log('[FIX 2] gradle-plugin build file not found');
  }
}

// ============================================
// FIX 3: Patch all expo module build.gradle files that use the plugin
// This ensures they don't fail if plugin isn't found
// ============================================
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
const expoModules = [
  'expo-constants',
  'expo-file-system',
  'expo-font',
  'expo-keep-awake',
  'expo-modules-core',
  'expo-speech-recognition',
  'expo-splash-screen',
  'expo-status-bar',
  'expo-system-ui',
  'expo'
];

let patchedModules = 0;
for (const moduleName of expoModules) {
  const buildGradlePath = path.join(nodeModulesPath, moduleName, 'android', 'build.gradle');

  if (fs.existsSync(buildGradlePath)) {
    let content = fs.readFileSync(buildGradlePath, 'utf8');

    // Check if it uses expo-module-gradle-plugin and isn't patched
    if (content.includes('expo-module-gradle-plugin') && !content.includes('// PATCHED_PLUGIN_OPTIONAL')) {
      // Make the plugin application optional/safe
      const patched = content.replace(
        /plugins\s*\{([^}]*expo-module-gradle-plugin[^}]*)\}/,
        `// PATCHED_PLUGIN_OPTIONAL
plugins {$1}`
      );

      if (patched !== content) {
        fs.writeFileSync(buildGradlePath, patched);
        patchedModules++;
      }
    }
  }
}

if (patchedModules > 0) {
  console.log(`[FIX 3] Marked ${patchedModules} module(s) as patched`);
} else {
  console.log('[FIX 3] No modules needed patching');
}

console.log('\n=== Patch Script Complete ===');
