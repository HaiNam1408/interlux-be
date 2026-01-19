"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moduleAlias = require("module-alias");
const path = require("path");
moduleAlias.addAliases({
    'src': path.join(__dirname, '..', 'src')
});
Promise.resolve().then(() => require('../src/main'));
//# sourceMappingURL=index.js.map