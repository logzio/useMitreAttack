export type TacticId = string;
export type TechniqueId = string;
type Relation = {
  tactics?: TacticId[];
  technique?: TechniqueId;
  subTechniques?: TechniqueId[];
};
export type Tactic = {
  id: TacticId;
  name: string;
  url: string;
  techniques: string[];
};
export type Technique = {
  id: TechniqueId;
  name: string;
  url: string;
  isSubTechnique: boolean;
  relation: Relation;
};
type Tactics = Record<TacticId, Tactic>;
type Techniques = Record<TechniqueId, Technique>;

export type MitreTags = {
  tactics: Tactics;
  techniques: Techniques;
};

