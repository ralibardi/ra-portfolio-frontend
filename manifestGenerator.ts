// manifestGenerator.ts
import fs from 'fs/promises';
import handlebars from 'handlebars';
import path from 'path';

export async function GenerateManifest() {
  try {
    // Read _colours.scss
    const scssContent = await fs.readFile('src/assets/_colours.scss', 'utf8');

    // Extract colour values
  const colours = {
    primaryColour: ExtractColour(scssContent, 'primary-1', '#ffffff'),
    whiteColour: ExtractColour(scssContent, 'white', '#000000'),
  };

    // Read and compile manifest template
    const manifestTemplate = await fs.readFile('manifest.hbs', 'utf8');
    const template = handlebars.compile(manifestTemplate);

    // Generate manifest content
    const manifestContent = template(colours);

    // Write the final manifest.json
    await fs.writeFile(path.join('public', 'manifest.json'), manifestContent);
  } catch (error) {
    console.error('Error generating manifest:', error);
  }
}

function ExtractColour(
  content: string,
  varName: string,
  defaultColour: string,
): string {
  // First try a simple variable match e.g. $white: #fff;
  const simpleRegex = new RegExp(`\\$${varName}:\\s*(#[0-9a-fA-F]{3,6})`, 'm');
  let match = content.match(simpleRegex);
  if (match) {
    return match[1];
  }

  // Support SCSS maps e.g. $primary: (1: #4a90e2, ...);
  const mapParts = varName.split('-');
  if (mapParts.length === 2) {
    const [mapName, key] = mapParts;
    const mapRegex = new RegExp(`\\$${mapName}\\s*:\\s*\\(([^\\)]*)\\)`, 'm');
    const mapMatch = content.match(mapRegex);
    if (mapMatch) {
      const entryRegex = new RegExp(`${key}:\\s*(#[0-9a-fA-F]{3,6})`, 'm');
      const entryMatch = mapMatch[1].match(entryRegex);
      if (entryMatch) {
        return entryMatch[1];
      }
    }
  }

  return defaultColour;
}
