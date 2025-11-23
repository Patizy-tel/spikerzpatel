import {
  Asset,
  GraphData,
  RemediationTechnique,
  RiskSummary,
  Vulnerability,
} from '../models';

export const MOCK_ASSETS: Asset[] = [
  {
    id: 'asset-1',
    name: 'prod-web-server-01',
    ipAddress: '192.168.1.1',
    risk: 'critical',
    tags: [
      { label: 'Production', type: 'error' },
      { label: 'External', type: 'warning' },
    ],
  },
  {
    id: 'asset-2',
    name: 'prod-web-server-02',
    ipAddress: '192.168.1.2',
    risk: 'critical',
    tags: [
      { label: 'Production', type: 'error' },
      { label: 'External', type: 'warning' },
    ],
  },
  {
    id: 'asset-3',
    name: 'staging-api-gateway',
    ipAddress: '10.0.2.15',
    risk: 'high',
    tags: [
      { label: 'Staging', type: 'info' },
      { label: 'Internal', type: 'warning' },
      { label: 'Patched', type: 'success' },
    ],
  },
  {
    id: 'asset-4',
    name: 'dev-database-01',
    ipAddress: '10.0.3.20',
    risk: 'medium',
    tags: [{ label: 'Development', type: 'default' }],
  },
];

export const MOCK_GRAPH_DATA: GraphData = {
  nodes: [
    {
      id: 'node-1',
      label: 'Internet Gateway',
      data: { ...MOCK_ASSETS[3], name: 'gateway-01', ipAddress: '203.0.113.1' },
    },
    {
      id: 'node-2',
      label: 'Load Balancer',
      data: { ...MOCK_ASSETS[3], name: 'lb-prod-01', ipAddress: '10.0.0.10' },
    },
    {
      id: 'node-3',
      label: 'API Gateway',
      data: { ...MOCK_ASSETS[2], name: 'api-gateway', ipAddress: '10.0.1.5' },
    },
    {
      id: 'node-4',
      label: 'prod-web-server-01',
      data: MOCK_ASSETS[0],
    },
    {
      id: 'node-5',
      label: 'prod-web-server-02',
      data: MOCK_ASSETS[1],
    },
  ],
  edges: [
    { id: 'edge-1', source: 'node-1', target: 'node-2' },
    { id: 'edge-2', source: 'node-2', target: 'node-3' },
    { id: 'edge-3', source: 'node-3', target: 'node-4' },
    { id: 'edge-4', source: 'node-3', target: 'node-5' },
  ],
};

export const MOCK_RISK_SUMMARY: RiskSummary = {
  critical: 2,
  high: 0,
  medium: 0,
  low: 0,
  total: 2,
};

export const MOCK_VULNERABILITY: Vulnerability = {
  id: 'vuln-1',
  cveId: 'CVE-2024-6387',
  title: 'OpenSSH Remote Code Execution',
  description:
    'A critical signal handler race condition vulnerability in OpenSSH server (sshd) allows unauthenticated remote code execution as root on glibc-based Linux systems. This vulnerability affects OpenSSH versions 8.5p1 through 9.7p1. The vulnerability is exploitable through a carefully timed sequence of SSH authentication requests that trigger a race condition in the SIGALRM signal handler.',
  extraInfo:
    'The vulnerability exists due to improper handling of asynchronous signals in the SSH daemon. When a client fails to authenticate within the LoginGraceTime period (default 120 seconds), a SIGALRM signal is raised. The signal handler calls functions that are not async-signal-safe, creating a race condition that can be exploited for remote code execution. Exploitation requires approximately 10,000 connection attempts on average, making it feasible for determined attackers.',
  publishedDate: '07/01/2024',
  severity: 'critical',
  affectedAssets: MOCK_ASSETS.slice(0, 2),
  details: [
    { label: 'Published Date', value: '07/01/2024' },
    { label: 'CVSS Score', value: '9.8 Critical' },
    { label: 'Attack Vector', value: 'Network' },
    { label: 'Exploit Available', value: 'Yes', hasCheckmark: true },
    { label: 'Privileges Required', value: 'None' },
    { label: 'Affected Versions', value: 'OpenSSH 8.5p1 - 9.7p1' },
    { label: 'Patch Available', value: 'OpenSSH 9.8p1' },
  ],
};

export const MOCK_REMEDIATION_TECHNIQUES: RemediationTechnique[] = [
  {
    id: 'rem-a',
    name: 'Upgrade OpenSSH',
    type: 'A',
    description: 'Upgrade to OpenSSH version 9.8p1 or later which contains the security fix for this vulnerability. This is the recommended permanent solution.',
    servers: [
      { id: 'srv-a1', name: 'Web Server 01', description: 'Production server running OpenSSH 9.6p1 - requires immediate upgrade.' },
      { id: 'srv-a2', name: 'Web Server 02', description: 'Production server running OpenSSH 9.6p1 - requires immediate upgrade.' },
    ],
  },
  {
    id: 'rem-b',
    name: 'Reduce LoginGraceTime',
    type: 'B',
    description:
      'As a temporary mitigation, reduce the LoginGraceTime parameter to 0 in sshd_config. This disables the vulnerable code path but may cause denial of service under heavy load. Monitor server performance after applying this change.',
    servers: [
      { id: 'srv-b1', name: 'API Gateway', description: 'Set LoginGraceTime=0 in /etc/ssh/sshd_config and restart sshd service.' },
      { id: 'srv-b2', name: 'Jump Host', description: 'Set LoginGraceTime=0 in /etc/ssh/sshd_config and restart sshd service.' },
    ],
  },
  {
    id: 'rem-c',
    name: 'Network Segmentation',
    type: 'C',
    description: 'Implement network-level controls to limit SSH access. Use firewall rules to restrict SSH connections to known IP ranges and implement rate limiting to slow down exploitation attempts.',
    servers: [
      { id: 'srv-c1', name: 'Firewall', description: 'Configure SSH rate limiting: max 10 connections per minute per IP.' },
      { id: 'srv-c2', name: 'Jump Host', description: 'Restrict direct SSH access; require VPN connection first.' },
    ],
  },
];

export const SIDEBAR_MENU_ITEMS = [
  { id: 'item-1', label: 'Dashboard', icon: 'dashboard', active: false },
  { id: 'item-2', label: 'Vulnerabilities', icon: 'bug_report', active: false },
  { id: 'item-3', label: 'Assets', icon: 'devices', active: false },
  { id: 'item-4', label: 'CVE-2024-6387', icon: 'security', active: true },
  { id: 'item-5', label: 'Reports', icon: 'assessment', active: false },
  { id: 'item-6', label: 'Settings', icon: 'settings', active: false },
];
