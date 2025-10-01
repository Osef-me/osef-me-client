# BeatmapHorizontalCard

Ce composant a été refactorisé pour suivre les principes de l'architecture atomique et améliorer la maintenabilité.

## Structure

### Composant principal
- `BeatmapHorizontalCard.tsx` - Le composant principal qui orchestre tous les sous-composants

### Sous-composants (Molecules)
- `BeatmapCover/` - Gère l'affichage de la couverture du beatmap
- `BeatmapInfo/` - Affiche les informations principales (artiste, titre, créateur) - renommé en `BeatmapCardInfo`
- `BeatmapActions/` - Contient le bouton de téléchargement
- `BeatmapBadges/` - Gère l'affichage des badges de difficulté et patterns
- `BeatmapFooter/` - Affiche le status et la plage de difficulté

### Atomes utilisés
- `PatternBadge` - Badge pour afficher les patterns de jeu
- `DifficultyBadge` - Badge pour afficher les difficultés
- `StatusBadge` - Badge pour afficher le statut du beatmap
- `DifficultyRange` - Composant pour afficher la plage de difficulté

### Hooks personnalisés

#### Hooks atomiques (`hooks/atoms/`)
- `useBeatmapPatterns` - Extrait et traite les patterns des beatmaps
- `useBeatmapStatus` - Détermine le statut prioritaire d'un beatmapset
- `useSortedBeatmaps` - Trie les beatmaps par difficulté
- `useDisplayedBeatmaps` - Gère l'affichage des beatmaps avec limite
- `useDifficultyRange` - Calcule la plage de difficulté

#### Hooks moléculaires (`hooks/molecules/`)
- `useBeatmapCardActions` - Gère les actions (clic, téléchargement)
- `useBeatmapHorizontalCard` - Hook principal qui orchestre tous les autres hooks

## Avantages de cette structure

1. **Séparation des responsabilités** - Chaque composant a une responsabilité claire
2. **Réutilisabilité** - Les atomes peuvent être réutilisés dans d'autres composants
3. **Testabilité** - Chaque composant peut être testé individuellement
4. **Maintenabilité** - Plus facile de modifier ou déboguer une partie spécifique
5. **Performance** - Meilleure optimisation avec des hooks spécialisés

## Utilisation

```tsx
import { BeatmapHorizontalCard } from '@/components/molecules/BeatmapHorizontalCard';

<BeatmapHorizontalCard beatmapset={beatmapset} />
```
