export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

export interface Asset {
  id: string;
  name: string;
  ipAddress: string;
  risk: RiskLevel;
  tags: AssetTag[];
}

export interface AssetTag {
  label: string;
  type: 'default' | 'warning' | 'error' | 'success' | 'info';
}

export interface GraphNode {
  id: string;
  label: string;
  data: Asset;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
