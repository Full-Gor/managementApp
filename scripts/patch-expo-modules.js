#!/usr/bin/env node
/**
 * Script to patch expo-modules-core to fix the components.release error
 * This patches ExpoModulesCorePlugin.gradle to skip publishing configuration
 */

const fs = require('fs');
const path = require('path');

const pluginPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'expo-modules-core',
  'android',
  'ExpoModulesCorePlugin.gradle'
);

console.log('Patching expo-modules-core for components.release fix...');

if (!fs.existsSync(pluginPath)) {
  console.log('ExpoModulesCorePlugin.gradle not found, skipping patch');
  process.exit(0);
}

let content = fs.readFileSync(pluginPath, 'utf8');

// Check if already patched
if (content.includes('// PATCHED_BY_POSTINSTALL')) {
  console.log('Already patched, skipping');
  process.exit(0);
}

// Find and comment out the problematic publishing block that uses components.release
// The issue is in the MavenPublication block that tries to use components.release
const patchedContent = content.replace(
  /from\s+components\.release/g,
  '// PATCHED_BY_POSTINSTALL: commented to fix build error\n        // from components.release'
);

if (patchedContent !== content) {
  fs.writeFileSync(pluginPath, patchedContent);
  console.log('Patched successfully! (commented out components.release)');
  process.exit(0);
}

// Alternative: Comment out the entire publishing afterEvaluate block
const altPatch = content.replace(
  /(afterEvaluate\s*\{[\s\S]*?publishing\s*\{[\s\S]*?from\s+components[\s\S]*?\}\s*\}\s*\})/g,
  '// PATCHED_BY_POSTINSTALL: Entire publishing block commented out\n/*\n$1\n*/'
);

if (altPatch !== content) {
  fs.writeFileSync(pluginPath, altPatch);
  console.log('Patched successfully! (commented entire publishing block)');
  process.exit(0);
}

console.log('Could not find pattern to patch, file unchanged');
