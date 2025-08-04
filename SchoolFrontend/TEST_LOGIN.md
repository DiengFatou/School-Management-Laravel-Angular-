# 🧪 Test du Système de Connexion

## 📋 Instructions de test

### 1. **Accéder à la page de connexion**
```
URL : http://localhost:4200/login
```

### 2. **Test avec un compte Admin**
```
Email : admin@school.com
Mot de passe : admin
```
**Résultat attendu :** Redirection vers `/admin` (dashboard admin)

### 3. **Test avec un compte Enseignant**
```
Email : teacher@school.com
Mot de passe : teacher
```
**Résultat attendu :** Redirection vers `/enseignants`

### 4. **Test avec des credentials incorrects**
```
Email : test@test.com
Mot de passe : wrongpassword
```
**Résultat attendu :** Message d'erreur "Email ou mot de passe incorrect"

## 🎯 Fonctionnalités à vérifier

### ✅ **Formulaire de connexion**
- [ ] Affichage propre du formulaire
- [ ] Champs email et mot de passe
- [ ] Bouton de connexion
- [ ] Toggle pour afficher/masquer le mot de passe
- [ ] Validation des champs

### ✅ **Logique de connexion**
- [ ] Connexion admin → Dashboard admin
- [ ] Connexion enseignant → Page enseignants
- [ ] Credentials incorrects → Message d'erreur
- [ ] Stockage des données utilisateur

### ✅ **Interface Admin**
- [ ] Dashboard avec statistiques
- [ ] Sidebar de navigation
- [ ] Actions rapides
- [ ] Déconnexion fonctionnelle

## 🔧 Dépannage

### Si la page ne s'affiche pas correctement :
1. Vérifiez que l'application est lancée : `npm start`
2. Vérifiez la console du navigateur pour les erreurs
3. Assurez-vous que les routes sont correctement configurées

### Si la connexion ne fonctionne pas :
1. Vérifiez les credentials de test
2. Vérifiez que localStorage fonctionne
3. Vérifiez les redirections dans le code

## 📱 Test responsive

Testez également sur mobile pour vérifier que le formulaire s'adapte correctement.

---

**Note :** Ce système utilise des données mockées pour les tests. En production, il faudra connecter avec le backend Laravel. 