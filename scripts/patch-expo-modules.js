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
if (content.includes('// PATCHED: Skip publishing')) {
  console.log('Already patched, skipping');
  process.exit(0);
}

// Find the afterEvaluate block that configures publishing and wrap it with a check
const publishingPattern = /afterEvaluate\s*\{[^}]*publishing\s*\{/g;

if (publishingPattern.test(content)) {
  // Add a guard at the beginning of the file to skip publishing
  const patchCode = `
// PATCHED: Skip publishing to fix components.release error
def publishingDisabled = project.findProperty("expo.modules.core.publishing.disabled")?.toString()?.toBoolean() ?: true

`;

  // Insert after the first line (usually a comment or apply plugin)
  const lines = content.split('\n');
  lines.splice(1, 0, patchCode);
  content = lines.join('\n');

  // Wrap the publishing block with a condition
  content = content.replace(
    /(afterEvaluate\s*\{[\s\S]*?)(publishing\s*\{[\s\S]*?\}\s*\})/g,
    (match, before, publishing) => {
      return `${before}if (!publishingDisabled) {\n    ${publishing}\n  }`;
    }
  );

  fs.writeFileSync(pluginPath, content);
  console.log('Patched successfully!');
} else {
  console.log('Publishing pattern not found, trying alternative patch...');

  // Alternative: just disable the entire publishing section by commenting it out
  content = content.replace(
    /publishing\s*\{[\s\S]*?release[\s\S]*?\}\s*\}/g,
    '// PATCHED: Publishing disabled to fix components.release error\n// publishing { ... }'
  );

  fs.writeFileSync(pluginPath, content);
  console.log('Applied alternative patch');
}
