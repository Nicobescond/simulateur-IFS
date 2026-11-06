# Simulateur Examen IFS Food v8

Simulateur d'examen écrit IFS Food v8, publié sur GitHub Pages et protégé par mot de passe.

Le fichier publié `docs/index.html` est **chiffré** (AES-256, StatiCrypt) : son contenu n'est lisible qu'après saisie du mot de passe. Les sources en clair restent en local et ne sont pas dans ce dépôt.

## Mettre à jour

Depuis le dossier local contenant les sources :

```powershell
$env:STATICRYPT_PASSWORD = 'mot de passe'
node build.mjs
git add docs/index.html
git commit -m "Mise à jour du simulateur"
git push
```
