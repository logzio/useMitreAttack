import { useState, useEffect } from 'react';
import { MitreTags, Tactic, TacticId, Technique, TechniqueId } from './useMitreTags.types';


const loadJson = (): Promise<MitreTags> => import(`./mitre-attack-tags.json`).then(res => res.default);

export const useMitreTags = () => {
  const [tags, setTags] = useState<MitreTags>({tactics:{},techniques:{}});
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