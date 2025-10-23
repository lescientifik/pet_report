# Générateur de Comptes Rendus TEP-FDG

Application web statique pour faciliter et standardiser la rédaction de comptes rendus de TEP-scan au FDG.

## Fonctionnalités

### Version actuelle (MVP)

- **Interface progressive** : Formulaire en étapes pour guider la saisie
- **Sélection rapide** : Grandes icônes cliquables pour les indications et cancers fréquents
- **Génération automatique** : Le texte du compte rendu se génère en temps réel
- **Comparaison TEP** : Ajout dynamique de plusieurs TEP antérieurs (baseline, nadir, contrôle)
- **Copie optimisée** : Bouton de copie vers le presse-papier avec feedback visuel
- **Sauvegarde automatique** : localStorage pour reprendre un CR en cours (24h)
- **Volet contextuel** : Aide-mémoire et ressources pour chaque type de cancer
- **Navigation clavier** :
  - Tab/Enter pour navigation rapide
  - Ctrl+Enter pour copier
  - Esc pour fermer le volet contextuel

### Cancers pré-configurés

- Cancer du sein
- Mélanome
- Cancer ORL
- Lymphome

## Structure du compte rendu généré

1. **Indication** : Phrase standardisée avec âge, sexe, indication, type de cancer, traitement
2. **Résultats** :
   - Phrase de comparaison avec TEP antérieur(s) si applicable
   - Résultats libres
3. **Conclusion** : Conclusion libre

## Utilisation

### Ouvrir le site

Démarrez le serveur de développement avec `npm run dev` ou déployez sur GitHub Pages.

### Workflow type

1. Sélectionner l'indication (bilan, réévaluation, surveillance, récidive)
2. Choisir le type de cancer (icône rapide ou recherche)
3. Remplir les informations patient (âge, sexe, traitement optionnel)
4. Ajouter les TEP de comparaison si nécessaire
5. Saisir les résultats
6. Saisir la conclusion
7. Copier le compte rendu généré (Ctrl+Enter)

### Raccourcis clavier

- **Ctrl + Enter** : Copier le compte rendu
- **Tab** : Naviguer entre les champs
- **Esc** : Fermer le volet contextuel

## Architecture technique

- **Vue 3** : Framework réactif avec Composition API
- **Vite** : Build tool et serveur de développement rapide
- **CSS3** : Design responsive avec variables CSS (préparation multi-traceurs)
- **localStorage** : Sauvegarde locale uniquement (respect RGPD)

## Évolutions prévues

### Phase 2 - Amélioration UX
- Templates pré-remplis pour cancers fréquents
- Auto-complétion intelligente
- Historique des 10 derniers CR

### Phase 3 - Spécialisation
- Formulaires spécifiques par cancer
- Sections "Résultats" personnalisées par indication
- Bibliothèque de ressources étendue

### Phase 4 - Multi-traceurs
- Support TEP-PSMA (cancer prostate)
- Support TEP-FES (cancer sein)
- Sélecteur de traceur en amont

## Confidentialité

- **Aucune donnée uploadée** : Tout reste en local dans le navigateur
- **Pas de tracking** : Aucun analytics ou cookie tiers
- **Sauvegarde locale uniquement** : localStorage (supprimée après 24h)

## Développement local

### Installation

**IMPORTANT** : Avant de lancer l'application, installez les dépendances :

```bash
npm install
```

### Démarrer le serveur de développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173/pet_report/`

### Build pour production

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`

## Déploiement GitHub Pages

### Méthode automatique

```bash
npm run deploy
```

Cette commande build l'application et la déploie automatiquement sur GitHub Pages.

### Méthode manuelle

1. Build l'application : `npm run build`
2. Push le dossier `dist/` sur la branche `gh-pages`
3. Activer GitHub Pages dans Settings > Pages
4. L'URL sera : `https://[username].github.io/[repo-name]/`

## Licence

Usage personnel pour la rédaction de comptes rendus médicaux.

---

**Version** : 1.0.0 - MVP
**Traceurs supportés** : FDG uniquement
**Dernière mise à jour** : Octobre 2025
