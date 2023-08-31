export type Node = {
  class?: string;
  queries?: Array<string>;
  count?: number;
};

export type Start = {
  class?: string;
  queries?: Array<Record<string, string>>;
};

export type GoalsRequest = {
  goals: Array<string>;
  start: Start;
};

export type Korrel8rResponse = Array<Node>;
