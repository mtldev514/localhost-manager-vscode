# 🚀 Publication Rapide - 5 Étapes

Salut Alex! Voici comment publier ton extension rapidement:

## ✅ Ce qui est déjà fait

- ✅ package.json configuré
- ✅ LICENSE (MIT) créée
- ✅ CHANGELOG.md créé
- ✅ Ton nom: Alex Catus
- ✅ Extension fonctionnelle!

## 🎯 Ce qu'il reste à faire

### 1. Crée une icône (5 min)

**Option facile** - Utilise un générateur:
- Va sur https://www.canva.com
- Crée une image 128x128 pixels
- Thème: Windows 95, teal (#008080)
- Sauvegarde comme `icon.png` à la racine

**OU utilise un placeholder pour l'instant:**
```bash
# Icône temporaire (remplace plus tard)
curl -L "https://via.placeholder.com/128/008080/FFFFFF?text=LH" -o icon.png
```

### 2. Setup Publisher (10 min)

**A. Crée un compte Azure DevOps** (gratuit!)
1. https://dev.azure.com
2. Connecte-toi avec GitHub/Microsoft
3. Crée une organization: `mtldev514`

**B. Génère un Personal Access Token**
1. User Settings > Security > Personal access tokens
2. "New Token"
3. Nom: "vscode-marketplace"
4. Scope: **Marketplace > Manage** ✅
5. Durée: 1 an
6. **COPIE LE TOKEN!** ⚠️

**C. Crée le Publisher**
1. https://marketplace.visualstudio.com/manage
2. "Create publisher"
3. ID: `mtldev514` (lowercase, unique)
4. Name: `Alex Catus` ou `MTLDev514`
5. Email: ton email

### 3. Installe & Login (2 min)

```bash
cd /Users/alexcat/Developer/localhost-manager-vscode

# Installe VSCE
npm install -g @vscode/vsce

# Login avec ton publisher
vsce login mtldev514
# Entre ton Personal Access Token quand demandé
```

### 4. Package & Teste (2 min)

```bash
# Crée le .vsix
vsce package

# Teste-le!
# Extensions > ... > Install from VSIX
# Sélectionne localhost-manager-retro-0.0.1.vsix
```

### 5. PUBLIE! 🎉 (1 min)

```bash
vsce publish
```

C'est tout! Ton extension sera live sur le VS Code Marketplace! 🚀

---

## 📸 Bonus: Screenshots (optionnel mais cool)

Avant de publier, ajoute des screenshots:

1. Ouvre ton extension (fn + F5)
2. Prends des captures:
   - Sidebar panel
   - Full retro panel
   - Filter en action
   - Tagging demo
3. Sauvegarde dans `images/`
4. Ajoute au README

---

## 🔄 Futures Mises à Jour

```bash
# Modifie ton code...

# Publie une nouvelle version
vsce publish patch    # 0.0.1 → 0.0.2
vsce publish minor    # 0.0.1 → 0.1.0
vsce publish major    # 0.0.1 → 1.0.0
```

---

## 🎉 Après Publication

Ton extension sera visible à:
```
https://marketplace.visualstudio.com/items?itemName=mtldev514.localhost-manager-retro
```

Les gens pourront l'installer via:
1. VS Code > Extensions > Search "localhost manager retro"
2. Clic "Install"
3. Enjoy! 🖥️✨

---

## 🐛 Problèmes Courants

**"Missing publisher"**
→ Déjà fixé dans package.json! ✅

**"Icon not found"**
→ Crée `icon.png` (128x128) à la racine

**"Invalid token"**
→ Re-génère avec scope "Marketplace > Manage"

---

**Ready?** Follow les 5 steps et t'es live! 🚀

Questions? Check PUBLISH-GUIDE.md pour plus de détails.

Bonne chance Alex! 💪✨
