import { Resource } from './logs.types';
import { notUndefined } from './value-utils';

export enum ResourceLabel {
  Container = 'Container',
  Namespace = 'Namespace',
  Pod = 'Pod',
  Severity = 'Severity',
}

const ResourceToStreamLabels: Record<ResourceLabel, { otel: string; viaq: string }> = {
  [ResourceLabel.Container]: {
    otel: 'k8s_container_name',
    viaq: 'kubernetes_container_name',
  },
  [ResourceLabel.Namespace]: {
    otel: 'k8s_namespace_name',
    viaq: 'kubernetes_namespace_name',
  },
  [ResourceLabel.Pod]: {
    otel: 'k8s_pod_name',
    viaq: 'kubernetes_pod_name',
  },
  [ResourceLabel.Severity]: {
    otel: 'severity_text',
    viaq: 'level',
  },
};

const parse = (data: Record<string, string>, resourceLabel: ResourceLabel) => {
  const resource = ResourceToStreamLabels[resourceLabel];
  if (data[resource.otel]) {
    return {
      kind: resourceLabel,
      name: data[resource.otel],
    };
  } else if (data[resource.viaq]) {
    return {
      kind: resourceLabel,
      name: data[resource.viaq],
    };
  } else {
    return undefined;
  }
};

export const parseResources = (data: Record<string, string>): Array<Resource> => {
  const namespace = parse(data, ResourceLabel.Namespace);
  const pod = parse(data, ResourceLabel.Pod);
  const container = parse(data, ResourceLabel.Container);
  return [namespace, pod, container].filter(notUndefined);
};

export const parseName = (
  data: Record<string, string>,
  resourceLabel: ResourceLabel,
): string | undefined => {
  return parse(data, resourceLabel)?.name;
};
