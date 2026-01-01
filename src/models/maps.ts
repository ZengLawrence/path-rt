class EdgeNode {
  fromKey: string;
  toKey: string;
  target: string;
  next: EdgeNode | undefined;

  constructor(fromKey: string, toKey: string, target: string, next: EdgeNode | undefined = undefined) {
    this.fromKey = fromKey;
    this.toKey = toKey;
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
    const newNode = new EdgeNode(from, to, target, p);
    this.adjacencyList.set(from, newNode);
    if (!directed) { 
      this.addEdge(to, reversedTarget, from, target, true);
    }
  }

}

function addLine(graph: Graph, line: string[]) {
  const target = line[line.length - 1];
  const reversedTarget = line[0];
  for (let i = 0; i < line.length - 1; i++) {
    const from = line[i];
    const to = line[i + 1];
    graph.addEdge(from, target, to, reversedTarget);
  }
}

function buildMapGraph(lines: string[][]): Graph {
  const graph = new Graph();
  for (const line of lines) {
    addLine(graph, line);
  }
  return graph;
}

const WTC_NWK_LINE = ['WTC', 'EXP', 'GRV', 'JSQ', 'HAR', 'NWK'];
const JSQ_33S_LINE = ['JSQ', 'GRV', 'NEW', 'CHR', '09S', '14S', '23S', '33S'];
const HOK_33S_LINE = ['HOK', 'CHR', '09S', '14S', '23S', '33S'];
const WTC_HOK_LINE = ['WTC', 'EXP', 'NEW', 'HOK'];
const weekdayMapGraph = buildMapGraph([WTC_NWK_LINE, JSQ_33S_LINE, HOK_33S_LINE, WTC_HOK_LINE]);

const JSQ_HOK_33S_LINE = ['JSQ', 'GRV', 'NEW', 'HOK', 'CHR', '09S', '14S', '23S', '33S', 'HOK'];
const weeknightHolidayMapGraph = buildMapGraph([WTC_NWK_LINE, JSQ_HOK_33S_LINE]);

export interface TripSegment {
  key: string;
  target: string;
}

function getTrip(graph: Graph, from: string, to: string): TripSegment[] {
  const visited = new Set<string>();
  const path: TripSegment[] = [];
  function dfs(current: string): boolean {
    if (current === to) {
      return true;
    }
    visited.add(current);
    let edgeNode = graph.adjacencyList.get(current);
    while (edgeNode) {
      if (!visited.has(edgeNode.toKey)) {
        path.push({ key: edgeNode.fromKey, target: edgeNode.target });
        if (dfs(edgeNode.toKey)) {
          return true;
        }
        path.pop();
      }
      edgeNode = edgeNode.next;
    }
    return false;
  }
  dfs(from);
  return path;
}

export function getDestinationTargets(from: string, to: string, schedule: 'weekday' | 'weeknight' | 'holiday' = 'weekday'): TripSegment[] {
  const graph = schedule === 'weekday' ? weekdayMapGraph : weeknightHolidayMapGraph;
  const trip = getTrip(graph, from, to);
  const returnTrip = getTrip(graph, to, from);
  return [trip[0], returnTrip[0]];
}

export function getSchedule(date: Date): 'weekday' | 'weeknight' | 'holiday' {
  const hour = date.getHours();
  const isHoliday = (date: Date): boolean => {
    const month = date.getMonth();
    const day = date.getDate();
    if ((month === 0 && day === 1) || // New Year's Day
        (month === 6 && day === 4) || // Independence Day
        (month === 11 && day === 25)) { // Christmas Day
      return true;
    }
    return false;
  };

  if (isHoliday(date)) {
    return 'holiday';
  } else if (hour < 6 || hour >= 23) {
    return 'weeknight';
  } else {
    return 'weekday';
  }
}