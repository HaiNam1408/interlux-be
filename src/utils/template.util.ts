import * as ejs from 'ejs';
import * as path from 'path';
import { join } from 'path';
import * as fs from 'fs';

/**
 * Gets the correct views directory path
 * Works in both development and production environments
 */
function getViewsPath(): string {
  // In production (Vercel), dist structure is dist/src/main.js
  const productionPath = join(__dirname, '../../views');
  const developmentPath = join(process.cwd(), 'views');
  
  // Check if production path exists (after build)
  if (fs.existsSync(productionPath)) {
    return productionPath;
  }
  
  return developmentPath;
}

/**
 * Renders an EJS template with provided data
 * @param templateName Name of the template file
 * @param data Data to be passed to the template
 * @returns Promise containing the rendered HTML string
 */
export async function renderTemplate(templateName: string, data: any): Promise<string> {
    const templatePath = join(getViewsPath(), templateName);
    return await ejs.renderFile(templatePath, data);
}

/**
 * Gets the absolute path to a template file
 * @param templateName Name of the template file
 * @returns Absolute path to the template file
 */
export function getTemplatePath(templateName: string): string {
    return join(getViewsPath(), templateName);
}