"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTemplate = renderTemplate;
exports.getTemplatePath = getTemplatePath;
const ejs = require("ejs");
const path_1 = require("path");
const fs = require("fs");
function getViewsPath() {
    const productionPath = (0, path_1.join)(__dirname, '../../views');
    const developmentPath = (0, path_1.join)(process.cwd(), 'views');
    if (fs.existsSync(productionPath)) {
        return productionPath;
    }
    return developmentPath;
}
async function renderTemplate(templateName, data) {
    const templatePath = (0, path_1.join)(getViewsPath(), templateName);
    return await ejs.renderFile(templatePath, data);
}
function getTemplatePath(templateName) {
    return (0, path_1.join)(getViewsPath(), templateName);
}
//# sourceMappingURL=template.util.js.map