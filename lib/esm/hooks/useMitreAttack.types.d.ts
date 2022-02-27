export declare type TacticId = string;
export declare type TechniqueId = string;
export declare type Relation = {
    tactics?: TacticId[];
    technique?: TechniqueId;
    subTechniques?: TechniqueId[];
};
export declare type Tactic = {
    id: TacticId;
    name: string;
    url: string;
    techniques: string[];
};
export declare type Technique = {
    id: TechniqueId;
    name: string;
    url: string;
    isSubTechnique: boolean;
    relation: Relation;
};
export declare type Tactics = Record<TacticId, Tactic>;
export declare type Techniques = Record<TechniqueId, Technique>;
export declare type Matrix = {
    tactics: Tactics;
    techniques: Techniques;
};
