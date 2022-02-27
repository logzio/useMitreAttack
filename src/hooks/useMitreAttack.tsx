import { useState, useEffect } from 'react';
import { Matrix, Tactic, TacticId, Technique, TechniqueId } from './useMitreAttack.types';


const loadJson = (): Promise<Matrix> => import(`./mitre-attack-enterprise.json`).then(res => res.default);

export const useMitreAttack = () => {
  const [tags, setTags] = useState<Matrix>({tactics:{},techniques:{}});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const initialize = async () => {
      const data = await loadJson();

      if (mounted) {
        setTags(data);
        setIsLoading(false);
      }
    };

    initialize().catch(setError);

    return () => {
      mounted = false;
    };
  }, []);

  const getTactics = (tacticIds: TacticId[] = []): Tactic[] => {
    return tacticIds.length > 0 ? tacticIds.map(id => tags.tactics[id]) : Object.values(tags.tactics);
  };

  const getTechniques = (techniqueIds: TechniqueId[] = []): Technique[] => {
    return techniqueIds.map(id => tags.techniques[id]);
  };

  return { getTactics, getTechniques, isLoading, error };
};