// Construit la version publiée du simulateur :
// 1. intègre les banques de questions JS dans le HTML (un seul fichier) ;
// 2. chiffre ce fichier avec StatiCrypt -> docs/index.html.
// Usage (PowerShell) : $env:STATICRYPT_PASSWORD='mot de passe'; node build.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const SOURCE = 'Simulateur_Examen_IFS_Food_v8.html';

if (!process.env.STATICRYPT_PASSWORD) {
  console.error("Définir le mot de passe : $env:STATICRYPT_PASSWORD='...'; node build.mjs");
  process.exit(1);
}

let html = readFileSync(join(root, SOURCE), 'utf8');
let count = 0;
html = html.replace(/<script src="(questions_[^"]+\.js)"><\/script>/g, (_, file) => {
  const js = readFileSync(join(root, file), 'utf8');
  if (/<\/script/i.test(js)) throw new Error(`${file} contient "</script>"`);
  count++;
  return `<script>\n${js}\n</script>`;
});
if (count !== 4) throw new Error(`4 banques de questions attendues, ${count} trouvées`);

mkdirSync(join(root, 'build'), { recursive: true });
writeFileSync(join(root, 'build', 'index.html'), html);

// Le mot de passe est lu par StatiCrypt depuis STATICRYPT_PASSWORD (jamais sur la ligne de commande).
const args = [
  'build/index.html',
  '-d docs',
  '--short',
  '--remember 30',
  '--template-title "Simulateur Examen IFS Food v8"',
  '--template-instructions "Accès réservé. Saisissez le mot de passe."',
  '--template-placeholder "Mot de passe"',
  '--template-button "Entrer"',
  '--template-remember "Se souvenir de moi (30 jours)"',
  '--template-error "Mot de passe incorrect"',
  '--template-toggle-show "Afficher"',
  '--template-toggle-hide "Masquer"',
  '--template-color-primary "#00963C"',
  '--template-color-secondary "#EEEFF1"',
].join(' ');

execSync(`npx --yes staticrypt@3 ${args}`, { cwd: root, stdio: 'inherit' });
console.log('OK : docs/index.html généré (chiffré).');
