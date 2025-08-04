# 🎓 Système d'Administration - School Management

## 📋 Vue d'ensemble

Ce système d'administration permet de gérer les utilisateurs avec différents rôles et de contrôler l'accès aux différentes fonctionnalités selon les permissions.

## 🔐 Système d'Authentification

### Rôles disponibles
- **Admin** : Accès complet à toutes les fonctionnalités
- **Enseignant** : Accès aux modules d'enseignement
- **Parent** : Accès aux informations des enfants
- **Élève** : Accès aux notes et informations personnelles

### Fonctionnalités de sécurité
- ✅ Vérification des rôles au niveau du formulaire de connexion
- ✅ Redirection automatique selon le rôle
- ✅ Protection des routes avec guards
- ✅ Gestion des tokens d'authentification
- ✅ Déconnexion sécurisée

## 🎨 Interface Admin

### Design moderne
- **Design responsive** : Adapté à tous les écrans
- **Interface intuitive** : Navigation claire et organisée
- **Animations fluides** : Transitions et effets visuels
- **Thème professionnel** : Couleurs et typographie cohérentes

### Composants principaux
1. **Formulaire de connexion** : Vérification des rôles
2. **Dashboard admin** : Vue d'ensemble avec statistiques
3. **Sidebar navigable** : Menu de navigation complet
4. **Actions rapides** : Accès direct aux fonctions principales

## 🚀 Utilisation

### 1. Connexion
```
URL : http://localhost:4200/login
```
- Entrez votre email et mot de passe
- Le système vérifie automatiquement votre rôle
- Redirection vers l'interface appropriée

### 2. Interface Admin
```
URL : http://localhost:4200/admin
```
- Tableau de bord avec statistiques
- Menu de navigation complet
- Actions rapides pour les tâches courantes

### 3. Navigation
- **Utilisateurs** : Gestion des comptes
- **Élèves** : Gestion des étudiants
- **Enseignants** : Gestion du personnel
- **Classes** : Organisation des classes
- **Notes** : Système de notation
- **Rapports** : Statistiques et analyses

## 🔧 Configuration Backend

### Endpoints requis
```php
// Authentification
POST /api/login
{
  "email": "admin@school.com",
  "password": "password"
}

// Réponse attendue
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@school.com",
    "role": "admin"
  },
  "token": "jwt_token_here"
}
```

### Base de données
```sql
-- Table users
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'enseignant', 'parent', 'eleve') DEFAULT 'eleve',
  email_verified_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🎯 Fonctionnalités clés

### Vérification des rôles
- ✅ Contrôle au niveau du formulaire de connexion
- ✅ Redirection automatique selon les permissions
- ✅ Protection des routes sensibles
- ✅ Interface adaptée au rôle

### Interface Admin
- ✅ Dashboard avec statistiques en temps réel
- ✅ Menu de navigation responsive
- ✅ Actions rapides pour les tâches courantes
- ✅ Design moderne et professionnel

### Sécurité
- ✅ Gestion des tokens JWT
- ✅ Déconnexion sécurisée
- ✅ Protection contre l'accès non autorisé
- ✅ Validation des données

## 📱 Responsive Design

L'interface s'adapte automatiquement à tous les appareils :
- **Desktop** : Interface complète avec sidebar
- **Tablet** : Menu adaptatif
- **Mobile** : Navigation optimisée

## 🎨 Personnalisation

### Couleurs principales
```css
--primary-color: #4f46e5;
--success-color: #10b981;
--warning-color: #f59e0b;
--error-color: #ef4444;
```

### Modifier le thème
1. Éditez les variables CSS dans les fichiers `.css`
2. Personnalisez les couleurs selon votre charte graphique
3. Adaptez les icônes Font Awesome si nécessaire

## 🔄 Mise à jour

Pour ajouter de nouveaux rôles ou fonctionnalités :

1. **Ajouter un rôle** :
   - Modifiez l'enum dans la base de données
   - Ajoutez la logique dans `AuthService`
   - Créez les guards appropriés

2. **Ajouter une route** :
   - Créez le composant
   - Ajoutez la route dans `app.routes.ts`
   - Configurez les guards si nécessaire

## 🐛 Dépannage

### Problèmes courants
1. **Erreur de connexion** : Vérifiez les credentials
2. **Accès refusé** : Vérifiez le rôle de l'utilisateur
3. **Page blanche** : Vérifiez les imports Angular

### Logs de débogage
```typescript
// Activer les logs dans AuthService
console.log('User role:', user.role);
console.log('Is admin:', this.authService.isAdmin());
```

## 📞 Support

Pour toute question ou problème :
1. Vérifiez la console du navigateur
2. Consultez les logs du backend
3. Testez avec différents rôles d'utilisateur

---

**Développé avec ❤️ pour la gestion scolaire moderne** 