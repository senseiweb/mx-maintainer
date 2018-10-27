export interface ScriptModel {
  id: ScriptKey;
  path: string;
  loaded: boolean;
}
export enum ScriptKey {
  termStore = 'termStore'
}
export const ScriptStore: Array<ScriptModel> = [
  { id: ScriptKey.termStore, path: '/_layouts/15/sp.taxonomy.js', loaded: false }
];
