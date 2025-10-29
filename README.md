# Formation : Bases à maîtriser pour Angular

**Objectif** : fournir un parcours structuré et pratique pour maîtriser les bases d'Angular avant d'entrer en projet réel. Chaque section contient une checklist que vous pouvez cocher au fur et à mesure.

---

## Informations générales
- **Durée recommandée** : 2–4 semaines (selon disponibilité).  
- **Public cible** : développeurs front-end connaissant JavaScript/TypeScript de base.  
- **Méthode** : théorie courte + exercices pratiques + mini-projets.

---

## ✅ Pré-requis
- [ ] Maîtriser JavaScript (ES6+) et les notions de base de TypeScript
- [ ] Connaître HTML & CSS
- [ ] Node.js installé (v14+) et npm/yarn
- [ ] éditeur : VS Code recommandé

---

# Module 1 — Fondations & CLI
**Objectif** : connaître l'outil et créer des projets Angular.

- [ ] Installer Angular CLI (`npm i -g @angular/cli`)
- [ ] Créer une app : `ng new my-app --routing --style=scss`
- [ ] Lancer en dev : `ng serve`
- [ ] Générer composants / services / modules : `ng generate component|service|module` ou `ng g c` etc.
- [ ] Builder en prod : `ng build --configuration production`

**Exercices**
- [ ] Créer une app mini To-do avec 2 components (list & add)
- [ ] Explorer les options de `ng new` et `ng serve`

---

# Module 2 — Composants & Templates
**Objectif** : maîtriser le cœur d'Angular.

- [ ] Créer et organiser des composants
- [ ] Data binding : interpolation, property binding `[]`, event binding `()`, two-way `[()]`
- [ ] Structural directives : `*ngIf`, `*ngFor` (utiliser `trackBy`)
- [ ] Attribute directives et `ngClass`, `ngStyle`
- [ ] `ng-template` et `TemplateRef`

**Exercices**
- [ ] Construire une liste paginée (ngFor + trackBy)
- [ ] Implémenter un composant réutilisable (card, modal)

---

# Module 3 — TypeScript & Lifecycle
**Objectif** : écrire du code Angular robuste et typé.

- [ ] Interfaces, types, generics
- [ ] `readonly`, `as const`
- [ ] Hooks : `ngOnInit`, `ngOnDestroy`, `ngAfterViewInit`, `ngOnChanges`
- [ ] Gestion des subscriptions et prévention des fuites (takeUntil / `async` pipe)

**Exercices**
- [ ] Ajouter un lifecycle log à un composant et démontrer l’ordre d’exécution
- [ ] Mettre en place `takeUntil` pour annuler des subscriptions

---

# Module 4 — Services & Dependency Injection
**Objectif** : centraliser logique et accéder aux ressources via DI.

- [ ] Créer un service (`ng generate service core/auth`)
- [ ] Fournisseurs : `providedIn: 'root'` vs module vs component
- [ ] Singleton vs instance-scoped services

**Exercices**
- [ ] Implémenter un service `AuthService` minimal (login/logout → BehaviorSubject)

---

# Module 5 — RxJS & Asynchrone
**Objectif** : maîtriser Observables et opérateurs essentiels.

- [ ] Observable vs Promise
- [ ] `Subject`, `BehaviorSubject`, `ReplaySubject`
- [ ] Opérateurs : `map`, `filter`, `switchMap`, `mergeMap`, `concatMap`, `debounceTime`, `takeUntil`, `shareReplay`
- [ ] `async` pipe dans le template

**Exercices**
- [ ] Implémenter une recherche auto-complète avec `debounceTime` + `switchMap`
- [ ] Transformer une Promise en Observable et vice versa

---

# Module 6 — Forms (Reactive Forms)
**Objectif** : construire et valider des formulaires complexes.

- [ ] ReactiveFormsModule : `FormGroup`, `FormControl`, `FormArray`
- [ ] Validation synchrones et asynchrones
- [ ] Valeurs par défaut, patchValue, reset

**Exercices**
- [ ] Formulaire de profil utilisateur avec validations et messages d’erreurs

---

# Module 7 — HttpClient & Interceptors
**Objectif** : communiquer avec des APIs et centraliser logique (auth, erreurs).

- [ ] Utiliser `HttpClient` pour GET/POST/PUT/DELETE
- [ ] Interceptor pour ajouter token / gérer erreurs / logging
- [ ] Gestion des erreurs (`catchError`) et retry

**Exercices**
- [ ] Implémenter un interceptor JWT + gestion d’expiration / refresh token (simplifié)

---

# Module 8 — Routing & Navigation
**Objectif** : structurer l’application par routes.

- [ ] Routes simples, routes enfants
- [ ] Lazy loading des modules (`loadChildren`)
- [ ] Guards (`CanActivate`, `CanDeactivate`), Resolvers
- [ ] Préchargement et stratégies de préchargement

**Exercices**
- [ ] Protéger une route `/dashboard` via un guard
- [ ] Implémenter lazy loading pour un module `admin`

---

# Module 9 — State Management (bases)
**Objectif** : gérer l’état applicatif correctement.

- [ ] Patterns simples avec services + `BehaviorSubject`
- [ ] Introduction à NgRx / Akita : store, actions, reducers, selectors (si nécessaire)

**Exercices**
- [ ] Remplacer un store local par un service central avec BehaviorSubject

---

# Module 10 — Performance & Change Detection
**Objectif** : comprendre et optimiser la perf.

- [ ] Change detection strategies : `Default` vs `OnPush`
- [ ] `ChangeDetectorRef` et `markForCheck`
- [ ] Optimiser listes (trackBy), éviter recalculs inutiles
- [ ] Lazy loading & bundle splitting

**Exercices**
- [ ] Passer un composant en `OnPush` et adapter les inputs/outputs

---

# Module 11 — Tests, qualité & CI
**Objectif** : s’assurer de la robustesse.

- [ ] Tests unitaires : Jest ou Karma + Jasmine (components, services)
- [ ] E2E : Cypress ou Playwright
- [ ] Linting : ESLint, Prettier, règles TypeScript strictes
- [ ] Pipeline CI simple (build → tests)

**Exercices**
- [ ] Écrire des tests unitaires pour un service Auth
- [ ] Ajouter un job CI qui lance `ng build` et tests

---

# Module 12 — Production & Déploiement
- [ ] AOT Compilation et optimisations (prod build)
- [ ] Analyse de bundle (`source-map-explorer` / `webpack-bundle-analyzer`)
- [ ] Stratégies de déploiement (Netlify, Vercel, Firebase, Docker)

---

# Module 13 — Sécurité, Accessibilité & Internationalisation
- [ ] XSS / DomSanitizer
- [ ] Stockage sécurisé des tokens (ne pas exposer dans le code)
- [ ] a11y : roles, aria-*, keyboard navigation
- [ ] i18n : `@angular/localize` ou ngx-translate

---

# Outils & Ressources utiles
- Angular CLI docs, Angular docs officiels
- RxJS docs & learn-rxjs.io
- Angular Style Guide (John Papa)
- Livres/tutos recommandés (à compléter selon préférence)

---

# Plan d'étude recommandé (4 semaines)
- **Semaine 1** : Modules 1–3 (CLI, composants, TS, lifecycles)
- **Semaine 2** : Modules 4–6 (services, RxJS, forms)
- **Semaine 3** : Modules 7–9 (HTTP, routing, state)
- **Semaine 4** : Modules 10–13 + tests & déploiement (perf, tests, sécurité)

---

# Mini-projets pratiques (ordre conseillé)
- [ ] To-do list (localStorage)
- [ ] CRUD app avec API fake (HttpClient + interceptors)
- [ ] Dashboard avec lazy-loading, OnPush, charts
- [ ] Auth app complète (guards, refresh token)
- [ ] PWA basique (service worker)

---

## Critères d’évaluation (valider avant projet réel)
- [ ] App construite en AOT et déployée en prod
- [ ] Tests unitaires couvrant services critiques
- [ ] Gestion des erreurs et interceptors en place
- [ ] Routes protégées et lazy-loaded
- [ ] Performance acceptable (bundle & change detection)

---

## Notes / Personnalisation
_Utilise cet espace pour noter les points à approfondir et les décisions d'équipe (ex : utiliser NgRx ou simple services)._

---

© Formation Angular — Checklist
