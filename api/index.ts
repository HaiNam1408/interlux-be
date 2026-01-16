import * as moduleAlias from 'module-alias';
import * as path from 'path';

// Register module aliases for Vercel serverless environment
moduleAlias.addAliases({
  'src': path.join(__dirname, '..', 'src')
});

// Dynamic import to ensure aliases are registered first
import('../src/main');