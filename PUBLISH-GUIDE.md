# 📦 Guide de Publication - VS Code Marketplace

## 🎯 Étapes pour Publier

### 1️⃣ Prépare ton Extension

#### A. Crée un compte Publisher

1. **Va sur Azure DevOps** (c'est gratuit!)
   - https://dev.azure.com
   - Connecte-toi avec ton compte Microsoft/GitHub

2. **Crée une organization**
   - Clique "Create new organization"
   - Nom: `mtldev514` (ou ce que tu veux)

3. **Génère un Personal Access Token (PAT)**
   - Va dans User Settings (icône en haut à droite)
   - Security > Personal access tokens
   - Clique "New Token"
   - **Nom**: "vscode-marketplace"
   - **Organization**: All accessible organizations
   - **Scopes**: Sélectionne **Marketplace > Manage**
   - **Durée**: 1 an (ou custom)
   - Clique "Create"
   - ⚠️ **COPIE LE TOKEN IMMÉDIATEMENT** (il ne s'affichera qu'une fois!)

#### B. Crée un Publisher sur VS Code Marketplace

1. **Va sur** https://marketplace.visualstudio.com/manage
2. **Connecte-toi** avec le même compte
3. **Clique "Create publisher"**
   - **ID**: `mtldev514` (doit être unique, lowercase)
   - **Name**: "MTLDev514" ou "Alexandre Catellier"
   - **Email**: ton email
4. **Vérifie ton email**

---

### 2️⃣ Configure ton Extension

#### A. Installe VSCE (VS Code Extension Manager)

```bash
npm install -g @vscode/vsce
```

#### B. Login avec ton Publisher

```bash
vsce login mtldev514
```

Quand demandé, entre ton **Personal Access Token** (celui que tu as copié)

---

### 3️⃣ Prépare les Assets

#### A. Crée une icône (128x128 PNG)

Ton extension a besoin d'une icône! Options:

**Option 1: Utilise un générateur en ligne**
- https://www.canva.com (gratuit)
- Crée une image 128x128px
- Thème rétro Windows 95 🖥️
- Sauvegarde comme `icon.png`

**Option 2: Utilise un emoji**
```bash
# Télécharge une icône simple pour l'instant
curl -o icon.png https://placeholder.pics/svg/128x128/008080/FFFFFF/Localhost
```

Place `icon.png` à la racine du projet.

#### B. Ajoute un screenshot (optionnel mais recommandé)

Prends des screenshots de ton extension:
1. Ouvre ton extension
2. Prends des captures d'écran
3. Sauvegarde dans `images/` folder

#### C. Met à jour README.md

Ajoute des images et plus de détails:

```markdown
# Localhost Manager (Retro) 🖥️

![Screenshot](images/screenshot.png)

Beautiful retro Windows 95 UI for managing localhost servers!

## Features
- 🎨 Retro Windows 95 UI
- 🔍 Smart filtering
- 🏷️ Custom port tagging
- 📊 Rich metadata (uptime, memory, CPU)

## Usage
[Add screenshots and GIFs here]
```

---

### 4️⃣ Valide ton package.json

Assure-toi que tout est correct:

```bash
cd /Users/alexcat/Developer/localhost-manager-vscode
```

Vérifie que `package.json` contient:
- ✅ `name` (lowercase, no spaces)
- ✅ `displayName` (beautiful name)
- ✅ `description` (clear description)
- ✅ `version` (e.g., "0.0.1")
- ✅ `publisher` (ton publisher ID)
- ✅ `icon` (chemin vers icon.png)
- ✅ `repository` (ton GitHub repo URL)
- ✅ `keywords` (pour recherche)
- ✅ `license` (MIT recommandé)

---

### 5️⃣ Package l'Extension

```bash
vsce package
```

Cela crée: `localhost-manager-retro-0.0.1.vsix`

**Teste le package localement:**
1. Ouvre VS Code
2. Extensions > ... > "Install from VSIX..."
3. Sélectionne le .vsix
4. Teste que tout fonctionne!

---

### 6️⃣ Publie sur le Marketplace! 🚀

```bash
vsce publish
```

C'est tout! Ton extension sera:
- ✅ Publiée sur le VS Code Marketplace
- ✅ Disponible dans VS Code Extensions
- ✅ Visible à https://marketplace.visualstudio.com/items?itemName=mtldev514.localhost-manager-retro

---

## 🔄 Mises à Jour Futures

### Publier une nouvelle version

1. **Modifie ton code**

2. **Incrémente la version** dans `package.json`:
   ```json
   "version": "0.0.2"
   ```

3. **Publie:**
   ```bash
   vsce publish
   ```

Ou utilise les commandes automatiques:
```bash
vsce publish patch    # 0.0.1 → 0.0.2
vsce publish minor    # 0.0.1 → 0.1.0
vsce publish major    # 0.0.1 → 1.0.0
```

---

## 📋 Checklist Avant Publication

- [ ] `icon.png` créé (128x128)
- [ ] README.md avec screenshots
- [ ] `publisher` dans package.json
- [ ] `repository` URL ajoutée
- [ ] `license` spécifiée (MIT)
- [ ] Testé localement avec `vsce package`
- [ ] Publisher créé sur marketplace.visualstudio.com
- [ ] Personal Access Token généré
- [ ] Logged in avec `vsce login`
- [ ] Extension testée après installation .vsix

---

## 🎨 Bonus: Améliorations

### Ajoute un CHANGELOG.md

```markdown
# Change Log

## [0.0.1] - 2024-02-12
### Added
- Initial release
- Retro Windows 95 UI
- Port filtering
- Custom tagging
- Rich metadata (uptime, memory, CPU)
- Auto-detection (React, Python, WebSocket, etc.)
```

### Ajoute une LICENSE

```bash
# MIT License recommandée
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2024 Alexandre Catellier

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
```

### Ajoute un .vscodeignore (déjà fait!)

Vérifie que `.vscodeignore` exclut les fichiers inutiles.

---

## 🐛 Troubleshooting

**Erreur: "Missing publisher"**
→ Ajoute `"publisher": "mtldev514"` dans package.json

**Erreur: "Invalid token"**
→ Re-génère un Personal Access Token avec scope "Marketplace > Manage"

**Erreur: "Icon not found"**
→ Assure-toi que `icon.png` existe à la racine

**Extension ne s'installe pas**
→ Vérifie `engines.vscode` dans package.json (minimum "^1.80.0")

---

## 🌟 Promotion

Une fois publié:

1. **Share sur Twitter/LinkedIn**
   ```
   🎉 Just published my first VS Code extension!

   Localhost Manager (Retro) - Beautiful Windows 95 UI
   for managing localhost servers 🖥️✨

   Features:
   - Port filtering 🔍
   - Custom tagging 🏷️
   - Rich metadata 📊

   Try it: [link]
   ```

2. **Share sur Reddit**
   - r/vscode
   - r/webdev
   - r/javascript

3. **Ajoute à ton Portfolio**
   - Ajoute dans ton Retro Portfolio! 🎨

---

## 📞 Support

Si tu as besoin d'aide:
- VS Code Publishing Docs: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- VSCE GitHub: https://github.com/microsoft/vscode-vsce

Bonne chance! 🚀✨
