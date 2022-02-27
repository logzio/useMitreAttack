import { Tactic, TacticId, Technique, TechniqueId } from './useMitreTags.types';
export declare const useMitreTags: () => {
    getTactics: (tacticIds?: TacticId[]) => Tactic[];
    getTechniques: (techniqueIds?: TechniqueId[]) => Technique[];
    isLoading: boolean;
    error: null;
};
