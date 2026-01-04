import type { ScheduleType } from "./schedules";

class EdgeNode {
  fromKey: string;
  toKey: string;
  target: string;
  lineName: string;
  next: EdgeNode | undefined;

  constructor(fromKey: string, toKey: string, target: string, lineName: string, next: EdgeNode | undefined = undefined) {
    this.fromKey = fromKey;
    this.toKey = toKey;
    this.lineName = lineName;
    this.target = target;
    this.next = next;
  }
}

class Graph {
  adjacencyList: Map<string, EdgeNode>;

  constructor() {
    this.adjacencyList = new Map();
  }

  addEdge(from: string, target: string, to: string, reversedTarget: string, directed = false) {
    const p = this.adjacencyList.get(from);
    const lineName = [target, reversedTarget].join('-');
    const newNode = new EdgeNode(from, to, target, lineName, p);
    this.adjacencyList.set(from, newNode);
    if (!directed) {
      this.addEdge(to, reversedTarget, from, target, true);
    }
  }

}

function addLine(graph: Graph, line: string[], directed = false) {
  const target = line[line.length - 1];
  const reversedTarget = line[0];
  for (let i = 0; i < line.length - 1; i++) {
    const from = line[i];
    const to = line[i + 1];
    graph.addEdge(from, target, to, reversedTarget, directed);
  }
}

function buildMapGraph(lines: string[][], directedLines: string[][] = []): Graph {
  const graph = new Graph();
  for (const line of lines) {
    addLine(graph, line);
  }
  for (const line of directedLines) {
    addLine(graph, line, true);
  }
  return graph;
}

const WTC_NWK_LINE = ['WTC', 'EXP', 'GRV', 'JSQ', 'HAR', 'NWK'];
const JSQ_33S_LINE = ['JSQ', 'GRV', 'NEW', 'CHR', '09S', '14S', '23S', '33S'];
const HOB_33S_LINE = ['HOB', 'CHR', '09S', '14S', '23S', '33S'];
const WTC_HOB_LINE = ['WTC', 'EXP', 'NEW', 'HOB'];
const weekdayMapGraph = buildMapGraph([WTC_NWK_LINE, JSQ_33S_LINE, HOB_33S_LINE, WTC_HOB_LINE]);

const JSQ_HOB_33S_LINE = ['JSQ', 'GRV', 'NEW', 'HOB', 'CHR', '09S', '14S', '23S', '33S'];
const weeknightHolidayMapGraph = buildMapGraph([WTC_NWK_LINE, JSQ_HOB_33S_LINE]);

const _33S_HOB_JSQ_LINE = ['33S', '23S', '14S', '09S', 'CHR', 'HOB', 'NEW', 'EXP', 'GRV', 'JSQ'];
const weekendMapGraph = buildMapGraph([WTC_NWK_LINE], [JSQ_HOB_33S_LINE, _33S_HOB_JSQ_LINE]);

export interface DestinationTarget {
  key: string;
  target: string;
  transferKey?: string;
}

function orderedList(root: EdgeNode | undefined, lineName: string | undefined) {
  const l = [];
  let n = root;
  while (n) {
    if (n.lineName == lineName) {
      // insert at the head
      l.unshift(n)
    } else {
      l.push(n);
    }
    n = n.next;
  }
  return l;
}

function findRoute(graph: Graph, from: string, to: string, excludeLines: string[] = []): EdgeNode[] {
  const visited = new Set<string>();
  const path: EdgeNode[] = [];
  function dfs(current: string, lineName: string | undefined = undefined): boolean {
    if (current === to) {
      return true;
    }
    visited.add(current);
    const l = orderedList(graph.adjacencyList.get(current), lineName);
    while (l.length > 0) {
      const edgeNode = l.shift();
      if (edgeNode && !visited.has(edgeNode.toKey) && !excludeLines.includes(edgeNode.lineName)) {
        path.push(edgeNode);
        if (dfs(edgeNode.toKey, edgeNode.lineName)) {
          return true;
        }
        path.pop();
      }
    }
    return false;
  }
  dfs(from);
  return path;
}

function getGraph(schedule: ScheduleType): Graph {
  switch (schedule) {
    case 'weeknight':
    case 'holiday':
      return weeknightHolidayMapGraph;
    case 'weekend':
      return weekendMapGraph;
    default:
      return weekdayMapGraph;
  }
}

function getFirstTransferKey(trip: EdgeNode[]): string | undefined {
  const target = trip[0].target;
  for (const node of trip.slice(1)) {
    if (node.target != target) {
      return node.fromKey;
    }
  }
  return undefined;
}

export function getDestinationTargets(from: string, to: string, schedule: ScheduleType = 'weekday'): DestinationTarget[] {
  const graph = getGraph(schedule);
  const targets: DestinationTarget[] = [];
  let trip = findRoute(graph, from, to);
  const excludeLines: string[] = [];
  while (trip.length > 0) {
    const start = trip[0];
    const transferKey = getFirstTransferKey(trip);
    targets.push({ key: start.fromKey, target: start.target, transferKey });
    excludeLines.push(start.lineName);
    trip = findRoute(graph, from, to, excludeLines);
  }
  return targets;
}

