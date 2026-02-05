#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Fix expo-modules-core ExpoModulesCorePlugin.gradle
// The useExpoPublishing() function fails because components.release doesn't exist
const pluginPath = path.join(
  __dirname,
  '../node_modules/expo-modules-core/android/ExpoModulesCorePlugin.gradle'
);

if (fs.existsSync(pluginPath)) {
  let content = fs.readFileSync(pluginPath, 'utf8');

  const oldCode = `  project.afterEvaluate {
    publishing {
      publications {
        release(MavenPublication) {
          from components.release
        }
      }`;

  const newCode = `  project.afterEvaluate {
    publishing {
      publications {
        // Fix: Only create publication if components.release exists
        if (project.components.findByName('release') != null) {
          release(MavenPublication) {
            from components.release
          }
        }
      }`;

  if (content.includes(oldCode)) {
    content = content.replace(oldCode, newCode);
    fs.writeFileSync(pluginPath, content);
    console.log('Patched ExpoModulesCorePlugin.gradle successfully');
  } else if (content.includes('findByName')) {
    console.log('ExpoModulesCorePlugin.gradle already patched');
  } else {
    console.log('Warning: Could not find expected code in ExpoModulesCorePlugin.gradle');
  }
} else {
  console.log('Warning: ExpoModulesCorePlugin.gradle not found');
}
