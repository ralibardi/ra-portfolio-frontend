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
  const match = content.match(
    new RegExp(`\\$${varName}:\\s*(#[0-9a-fA-F]{6});`),
  );
  return match ? match[1] : defaultColour;
}
