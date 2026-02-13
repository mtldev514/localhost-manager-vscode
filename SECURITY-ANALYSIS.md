# 🔒 Analyse de Sécurité - Localhost Manager

## ✅ Résumé Général

**Verdict:** Extension relativement sûre, mais quelques améliorations recommandées.

**Risque Global:** 🟡 **MOYEN-BAS**

---

## 🔍 Vulnérabilités Identifiées

### 🟡 1. Command Injection (MOYEN)

**Localisation:** Ligne 168, 241
```javascript
await execPromise(`ps -p ${portData.pid} -o etime=,rss=,pcpu=`);
await execPromise(`kill -9 ${pids.join(' ')}`);
```

**Problème:**
Les PIDs viennent de `lsof` qui est fiable, MAIS si un attaquant pouvait modifier ces valeurs, il pourrait injecter des commandes.

**Exemple d'attaque théorique:**
```javascript
// Si PID = "123; rm -rf /"
// Commande devient: ps -p 123; rm -rf / -o etime=...
```

**Risque réel:** 🟢 **BAS** (PIDs viennent de lsof, pas de l'utilisateur)

**Fix recommandé:**
```javascript
// Valider que PID est numérique
const safePid = parseInt(portData.pid, 10);
if (isNaN(safePid)) {
    throw new Error('Invalid PID');
}
await execPromise(`ps -p ${safePid} -o etime=,rss=,pcpu=`);
```

---

### 🟢 2. XSS dans WebView (BAS-MOYEN)

**Localisation:** Lignes 542+, génération HTML
```javascript
container.innerHTML = filteredPorts.map(p => `
    <div class="port-item">
        <span class="port-number">:${p.port}</span>
        ...
        <div class="port-process">
            ${p.customName ? '🏷️ ' + p.customName : ...}
        </div>
```

**Problème:**
Les `customName` (tags) sont injectés directement dans le HTML sans échappement.

**Exemple d'attaque:**
```javascript
// User tag: <img src=x onerror=alert('XSS')>
// S'affiche comme HTML exécutable
```

**Risque réel:** 🟡 **MOYEN** (l'attaquant doit avoir accès au workspace)

**Impact:**
- Peut voler des données du workspace
- Peut exécuter du code dans le contexte de l'extension
- Limité à l'environnement VS Code (pas full système)

**Fix recommandé:**
```javascript
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Utilisation:
${p.customName ? '🏷️ ' + escapeHtml(p.customName) : ...}
```

---

### 🟢 3. URL Injection (BAS)

**Localisation:** Ligne 279
```javascript
vscode.env.openExternal(vscode.Uri.parse(`http://localhost:${data.port}`));
```

**Problème:**
Le port vient du webview sans validation.

**Exemple d'attaque:**
```javascript
// data.port = "8000 --evil-flag"
// Ou: data.port = "'; malicious-url"
```

**Risque réel:** 🟢 **BAS**
- `vscode.Uri.parse()` fait déjà de la validation
- Limité à localhost
- VS Code demande confirmation pour URLs externes

**Fix recommandé:**
```javascript
const port = parseInt(data.port, 10);
if (isNaN(port) || port < 1 || port > 65535) {
    vscode.window.showErrorMessage('Invalid port number');
    return;
}
vscode.env.openExternal(vscode.Uri.parse(`http://localhost:${port}`));
```

---

### 🟢 4. Permissions Trop Larges (BAS)

**Localisation:** package.json
```json
"activationEvents": ["onStartupFinished"]
```

**Problème:**
Extension s'active automatiquement au démarrage de VS Code.

**Risque réel:** 🟢 **TRÈS BAS**
- Normal pour ce type d'extension
- Nécessaire pour le monitoring en temps réel
- VS Code sandbox limite les dégâts

**Recommandation:**
OK pour ton cas d'usage. Alternatif serait `onCommand` mais moins UX.

---

### 🟢 5. Global State Pollution (BAS)

**Localisation:** Ligne 16
```javascript
global.extensionContext = context;
```

**Problème:**
Utilise l'objet `global` qui peut être accédé par d'autres extensions.

**Risque réel:** 🟢 **TRÈS BAS**
- Seulement dans le contexte de VS Code
- Peu de risque de collision
- Extensions sont isolées par VS Code

**Fix recommandé:**
```javascript
// Utilise un module-level variable au lieu de global
let extensionContext;

function activate(context) {
    extensionContext = context;
    ...
}

async function enrichPortData(portData) {
    const enriched = { ...portData };
    ...
    if (extensionContext) {
        const tags = extensionContext.workspaceState.get('portTags', {});
        enriched.customName = tags[portData.port] || '';
    }
    ...
}
```

---

### 🟢 6. Pas de Rate Limiting (INFO)

**Localisation:** Auto-refresh toutes les 2-3 secondes

**Problème:**
Pas de limite sur les appels système (`lsof`, `ps`).

**Risque réel:** 🟢 **TRÈS BAS**
- Peut charger le CPU sur des machines lentes
- Pas vraiment une vulnérabilité de sécurité
- Plus une question de performance

**Recommandation:**
Déjà OK. Peut ajouter une option pour configurer l'intervalle.

---

## 🛡️ Points Positifs de Sécurité

### ✅ Ce qui est BIEN fait:

1. **Pas d'accès réseau externe**
   - Tout est localhost
   - Pas de télémétrie
   - Pas d'API externes

2. **WebView isolée**
   ```javascript
   localResourceRoots: [this._extensionUri]
   ```
   - Limite les ressources accessibles
   - Bonne pratique VS Code

3. **Pas de eval() ou Function()**
   - Pas d'exécution de code dynamique
   - Pas de JSON.parse() non sécurisé

4. **Error handling**
   - Try/catch partout
   - Pas de crash exposant des infos

5. **Pas de stockage de credentials**
   - Seulement des tags/noms
   - Pas de tokens ou passwords

6. **Permissions minimales**
   - Utilise seulement `lsof` et `ps`
   - Pas de sudo requis
   - Pas d'accès filesystem large

---

## 🎯 Recommandations par Priorité

### 🔴 HAUTE PRIORITÉ

1. **Escape HTML dans les tags**
   ```javascript
   function escapeHtml(text) {
       return text
           .replace(/&/g, '&amp;')
           .replace(/</g, '&lt;')
           .replace(/>/g, '&gt;')
           .replace(/"/g, '&quot;')
           .replace(/'/g, '&#039;');
   }
   ```

### 🟡 MOYENNE PRIORITÉ

2. **Valider les PIDs**
   ```javascript
   const safePid = parseInt(portData.pid, 10);
   if (isNaN(safePid) || safePid < 1) {
       throw new Error('Invalid PID');
   }
   ```

3. **Valider les ports**
   ```javascript
   const port = parseInt(data.port, 10);
   if (isNaN(port) || port < 1 || port > 65535) {
       return;
   }
   ```

### 🟢 BASSE PRIORITÉ

4. **Remplacer global.extensionContext**
   - Utilise module-level variable

5. **Ajouter CSP (Content Security Policy)**
   ```javascript
   <meta http-equiv="Content-Security-Policy"
         content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
   ```

---

## 📊 Score de Sécurité

| Catégorie | Score | Notes |
|-----------|-------|-------|
| **Code Injection** | 7/10 | PIDs validés par lsof, mais peut améliorer |
| **XSS** | 6/10 | Tags non échappés - FIX RECOMMANDÉ |
| **Permissions** | 9/10 | Minimal, approprié |
| **Data Storage** | 10/10 | Seulement des tags, rien de sensible |
| **Network** | 10/10 | Localhost seulement |
| **Dependencies** | 9/10 | Dépendances officielles VS Code |

**Score Global: 8.5/10** 🟢

---

## 🚀 Code Sécurisé - Exemple

Voici les fixes critiques à appliquer:

```javascript
// 1. Fonction d'échappement HTML
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// 2. Validation PID
async function enrichPortData(portData) {
    const safePid = parseInt(portData.pid, 10);
    if (isNaN(safePid) || safePid < 1) {
        throw new Error('Invalid PID');
    }

    const { stdout } = await execPromise(`ps -p ${safePid} -o etime=,rss=,pcpu=`);
    // ...
}

// 3. Validation Port
case 'open':
    const port = parseInt(data.port, 10);
    if (isNaN(port) || port < 1 || port > 65535) {
        vscode.window.showErrorMessage('Invalid port number');
        return;
    }
    vscode.env.openExternal(vscode.Uri.parse(`http://localhost:${port}`));
    break;

// 4. Utilisation dans HTML
${p.customName ? '🏷️ ' + escapeHtml(p.customName) : ...}
```

---

## 🎓 Pour Aller Plus Loin

**Ressources:**
- [VS Code Extension Security](https://code.visualstudio.com/api/extension-guides/webview#security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Command Injection Guide](https://owasp.org/www-community/attacks/Command_Injection)

**Best Practices:**
- ✅ Valider TOUTES les entrées utilisateur
- ✅ Échapper TOUT le HTML dynamique
- ✅ Utiliser des commandes paramétrées quand possible
- ✅ Limiter les permissions au minimum
- ✅ Ne jamais faire confiance aux données externes

---

## ✅ Conclusion

**Ton extension est relativement sûre!** 🎉

Les vulnérabilités identifiées sont:
- 🟡 1 Moyenne (XSS dans tags) - **FIX RECOMMANDÉ**
- 🟢 5 Basses - Optionnel mais bien de fixer

**Effort de fix:** ~30 minutes
**Impact:** Beaucoup plus sécurisé

Veux-tu que je crée une version sécurisée avec tous les fixes? 🔒✨
