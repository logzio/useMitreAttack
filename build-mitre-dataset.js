/*
  MITRE ATT&CK - MITRE Adversarial Tactics, Techniques, and Common Knowledge

  MITRE ATT&CK is a curated knowledge base and model for cyber adversary behavior,
  reflecting the various phases of an adversary’s attack lifecycle and the platforms they are known
  to target. ATT&CK focuses on how external adversaries compromise and operate within
  computer information networks

  At a high-level, ATT&CK is a behavioral model that consists of the following core components:
    * Tactics, denoting short-term, tactical adversary goals during an attack;
    * Techniques, describing the means by which adversaries achieve tactical goals;
    * Sub-techniques, describing more specific means by which adversaries achieve tactical


  The following script extracts basic property from each core component and their relation to JSON a file.
 */

  const fs = require('fs');
  const axios = require('axios');

  const OUTPUT_PATH = './__output__/';
  const OUTPUT_FILE_NAME = 'mitre-attack-enterprise.json';
  const DATA_URL = 'https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterprise-attack.json';

  // Accessing the data from MITRE/CTI using HTTP request
  const getObjects = async () => {
    try {
      const response = await axios.get(DATA_URL);
      const data = await response.data;

      return data.objects;
    } catch (err) {
      console.log('fetch error', err);
    }
  };

  // A Tactic in ATT&CK is defined by an x-mitre-tactic object.
  const getAllTactics = dataObject => {
    return dataObject.filter(object => object.type === 'x-mitre-tactic');
  };

  // A Technique in ATT&CK is defined as an attack-pattern object.
  // Objects that are deemed no longer beneficial to track as part of the knowledge base are marked as deprecated,
  // and objects which are replaced by a different object are revoked.
  // In both cases, the old object is marked with a field (either x_mitre_deprecated or revoked)
  const getAllTechniques = dataObject => {
    return dataObject.filter(object => object.type === 'attack-pattern' && !object.revoked && !object.x_mitre_deprecated);
  };

  // A sub-technique in ATT&CK is represented as an attack-pattern and follows the same format as techniques.
  // They differ in that they have a boolean field (x_mitre_is_subtechnique) marking them as sub-techniques,
  // and a relationship of the type subtechnique-of where the source_ref is the sub-technique and the target_ref is the parent technique.
  // A sub-technique can only have 1 parent technique, but techniques can have multiple sub-techniques.
  const getAllSubTechniqueRelations = dataObject => {
    return dataObject.filter(o => o.type === 'relationship' && o.relationship_type === 'subtechnique-of');
  };

  // Object ATT&CK ID with it's corresponding URL can be found in it's external_references array where the source_name is mitre-attack
  const getExternalReference = technique => {
    const reference = technique.external_references.find(p => p.source_name === 'mitre-attack');

    return {
      id: reference.external_id,
      url: reference.url,
    };
  };

  // Techniques map into tactics by use of their kill_chain_phases property. Where the kill_chain_name is mitre-attack
  // the phase_name corresponds to the x_mitre_shortname property of an x-mitre-tactic object.
  const getTacticsOfTechnique = (technique, tactics) => {
    const tacticXNames = technique.kill_chain_phases
      .filter(p => p.kill_chain_name === 'mitre-attack')
      .map(p => getExternalReference(tactics.find(t => p.phase_name === t.x_mitre_shortname)).id);

    return tacticXNames;
  };

  const getTechniqueBaseProperties = technique => {
    const isSubTechnique = technique.x_mitre_is_subtechnique;
    const { name } = technique;
    const { id, url } = getExternalReference(technique);

    return { id, name, isSubTechnique, url };
  };

  const createTacticsObject = (allTactics, techniques) => {
    return allTactics.reduce((all, tactic) => {
      const reference = tactic.external_references.find(reference => reference.source_name === 'mitre-attack');

      return {
        ...all,
        [reference.external_id]: {
          id: reference.external_id,
          name: tactic.name,
          url: reference.url,
          techniques: Object.entries(techniques)
            .filter(([, tq]) => !tq.isSubTechnique && tq.relation.tactics.includes(reference.external_id))
            .map(([key]) => key),
        },
      };
    }, {});
  };

  const createTechniquesObject = (allTechniques, allRelations, allTactics) => {
    return allTechniques.reduce((all, technique) => {
      const { id, name, isSubTechnique, url } = getTechniqueBaseProperties(technique);

      const relation = {};

      if (isSubTechnique) {
        const targetTechniqueId = allRelations.find(r => r.source_ref === technique.id).target_ref;
        const techniqueObject = allTechniques.find(tq => tq.id === targetTechniqueId);
        const { id } = getExternalReference(techniqueObject);

        relation.technique = id;
      } else {
        const subs = allRelations.filter(r => r.target_ref === technique.id).map(r => r.source_ref);

        relation.subTechniques = allTechniques.filter(tq => subs.includes(tq.id)).map(tq => getExternalReference(tq).id);
        relation.tactics = getTacticsOfTechnique(technique, allTactics);
      }

      return { ...all, [id]: { id, name, isSubTechnique, url, relation } };
    }, {});
  };

  const saveToFile = dataObject => {
    fs.mkdirSync(OUTPUT_PATH, { recursive: true });
    fs.writeFileSync(`${OUTPUT_PATH}${OUTPUT_FILE_NAME}`, JSON.stringify(dataObject, undefined, 2));
    console.log(`created json file at: ${OUTPUT_PATH}${OUTPUT_FILE_NAME}`);
  };

  const run = async () => {
    const dataObject = await getObjects();

    const allTactics = getAllTactics(dataObject);
    const allTechniques = getAllTechniques(dataObject);
    const allRelations = getAllSubTechniqueRelations(dataObject);

    const techniques = createTechniquesObject(allTechniques, allRelations, allTactics);
    const tactics = createTacticsObject(allTactics, techniques);

    saveToFile({ tactics, techniques });
  };

  run();