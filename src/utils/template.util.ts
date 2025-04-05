import * as ejs from 'ejs';
import * as path from 'path';
import { join } from 'path';

/**
 * Renders an EJS template with provided data
 * @param templateName Name of the template file
 * @param data Data to be passed to the template
 * @returns Promise containing the rendered HTML string
 */
export async function renderTemplate(templateName: string, data: any): Promise<string> {
    const templatePath = join(process.cwd(), 'views', templateName);
    return await ejs.renderFile(templatePath, data);
}

/**
 * Gets the absolute path to a template file
 * @param templateName Name of the template file
 * @returns Absolute path to the template file
 */
export function getTemplatePath(templateName: string): string {
    return join(process.cwd(), 'views', templateName);
}