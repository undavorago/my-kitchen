import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const files = [
  'src/core/styles.jsx',
  'src/core/data.jsx',
  'src/components/shared.jsx',
  'src/components/MoonWidget.jsx',
  'src/pages/DiaryPage.jsx',
  'src/pages/HomePage.jsx',
  'src/pages/RecipesPage.jsx',
  'src/pages/RatingsPage.jsx',
  'src/pages/SafeFoodPage.jsx',
  'src/pages/KBJUPage.jsx',
  'src/pages/PlanPage.jsx',
  'src/pages/ShoppingPage.jsx',
  'src/pages/PantryPage.jsx',
  'src/pages/WishlistPage.jsx',
  'src/pages/CassettesPage.jsx',
  'src/App.jsx',
];

const parts = await Promise.all(
  files.map(async file => {
    const source = await fs.readFile(path.join(root, file), 'utf8');
    return `\n// ${file}\n${source}`;
  }),
);

await fs.writeFile(
  path.join(root, 'src/main.generated.jsx'),
  [
    "import React from 'react';",
    "import * as ReactDOM from 'react-dom/client';",
    ...parts,
    '',
  ].join('\n'),
);
