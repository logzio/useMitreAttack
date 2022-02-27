import { Tactic, TacticId, Technique, TechniqueId } from './useMitreAttack.types';
export declare const useMitreAttack: () => {
    getTactics: (tacticIds?: TacticId[]) => Tactic[];
    getTechniques: (techniqueIds?: TechniqueId[]) => Technique[];
    isLoading: boolean;
    error: null;
};
