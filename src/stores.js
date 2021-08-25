import { writable } from "svelte/store";
export const instance = writable({
  nodes: [],
  property: {},
});
export const solution = writable({
  routes: [],
  cost: null,
});

export const config = writable({
  initialIndividuals: 100,
  minimumPopulationSize: 25,
  generationSize: 40,
  localSearchGranularity: 20,
  numberOfElites: 4,
  feasibilityProportionTarget: 0.2,
  RRGamma: 1.0,
  RRStartTemp: 10.0,
  eliteStartTemp: 50.0,
  eliteGamma: 500,
  eliteEducation: true,
});

export const time = writable(0.0);
export const state = writable({
  loaded: false,
  running: false,
  reset: false,
  updateConfig: false,
});
