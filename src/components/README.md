# Components Architecture - Atomic Design

Cette structure suit les principes de l'Atomic Design pour une meilleure organisation et maintenabilité du code.

## Structure

```
src/components/
├── atoms/          # Composants de base indivisibles
│   ├── actions/    # Boutons, liens, etc.
│   ├── data-input/ # Inputs, selects, etc.
│   ├── display/    # Badges, images, etc.
│   ├── feedback/   # Tooltips, notifications, etc.
│   ├── layout/     # Containers, grids, etc.
│   └── navigation/ # Menus, navigation, etc.
├── molecules/      # Groupes d'atomes formant des unités
├── organisms/      # Groupes de molécules formant des sections
├── pages/         # Composants de page complets
└── templates/     # Templates de mise en page
```

## Principes

### Atoms (Atomes)
- **Plus petits composants** de l'interface
- **Indépendants** et réutilisables
- Ne dépendent que d'autres atomes ou de primitives HTML
- Exemples: Button, Input, Badge

### Molecules (Molécules)
- **Groupes d'atomes** liés ensemble
- Forment des **unités fonctionnelles**
- Exemples: FilterBlock, BeatmapCard

### Organisms (Organismes)
- **Groupes de molécules** formant des **sections distinctes**
- Représentent des **zones de l'interface**
- Exemples: FilterSection, Navbar

### Templates & Pages
- **Templates**: Squelettes de pages avec composants disposés
- **Pages**: Instances spécifiques des templates avec données

## Règles d'utilisation

1. **Les atomes ne doivent pas connaître leurs parents**
2. **Les molécules peuvent utiliser des atomes**
3. **Les organismes peuvent utiliser molécules et atomes**
4. **Maintenir la séparation des responsabilités**
5. **Préférer la composition à l'héritage**

## Conventions de nommage

- **PascalCase** pour les noms de composants
- **camelCase** pour les instances
- **index.ts** pour l'export des composants
- **.props.ts** pour les interfaces TypeScript
- **.module.css** pour les styles CSS modules

## Exemple d'utilisation

```tsx
// Atom
import Button from '@/components/atoms/actions/Button';

// Molecule utilisant l'atom
import FilterBlock from '@/components/molecules/FilterBlock';

// Organism utilisant la molecule
import FilterSection from '@/components/organisms/FilterSection';
```
