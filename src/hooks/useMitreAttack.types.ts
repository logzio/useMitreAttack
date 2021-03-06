export type TacticId = string;
export type TechniqueId = string;
export type Relation = {
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
export type Tactics = Record<TacticId, Tactic>;
export type Techniques = Record<TechniqueId, Technique>;

export type Matrix = {
  tactics: Tactics;
  techniques: Techniques;
};

