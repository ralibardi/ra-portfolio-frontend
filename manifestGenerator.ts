// manifestGenerator.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import handlebars from 'handlebars';

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
  } catch (_error) {
    // Silently handle manifest generation errors
    // The build process should continue even if manifest generation fails
  }
}

function ExtractColour(content: string, varName: string, defaultColour: string): string {
  const match = content.match(new RegExp(`\\$${varName}:\\s*(#[0-9a-fA-F]{6});`));
  return match ? match[1] : defaultColour;
}
