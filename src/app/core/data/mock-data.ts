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
    // Entry Point - Internet
    {
      id: 'node-internet',
      label: 'Internet',
      data: {
        id: 'asset-internet',
        name: 'Public Internet',
        ipAddress: '0.0.0.0/0',
        risk: 'low',
        tags: [{ label: 'External', type: 'warning' }]
      },
    },
    // Edge Layer
    {
      id: 'node-fw',
      label: 'Edge Firewall',
      data: {
        id: 'asset-fw',
        name: 'fw-edge-01',
        ipAddress: '203.0.113.1',
        risk: 'low',
        tags: [
          { label: 'Production', type: 'error' },
          { label: 'Hardened', type: 'success' }
        ]
      },
    },
    // DMZ Layer
    {
      id: 'node-lb',
      label: 'Load Balancer',
      data: {
        id: 'asset-lb',
        name: 'lb-prod-01',
        ipAddress: '10.0.0.10',
        risk: 'medium',
        tags: [
          { label: 'DMZ', type: 'info' },
          { label: 'Production', type: 'error' }
        ]
      },
    },
    {
      id: 'node-waf',
      label: 'WAF',
      data: {
        id: 'asset-waf',
        name: 'waf-prod-01',
        ipAddress: '10.0.0.15',
        risk: 'low',
        tags: [
          { label: 'DMZ', type: 'info' },
          { label: 'Security', type: 'success' }
        ]
      },
    },
    // Application Layer
    {
      id: 'node-api',
      label: 'API Gateway',
      data: {
        id: 'asset-api',
        name: 'api-gateway-01',
        ipAddress: '10.0.1.5',
        risk: 'high',
        tags: [
          { label: 'App Tier', type: 'info' },
          { label: 'Vulnerable', type: 'error' }
        ]
      },
    },
    {
      id: 'node-web1',
      label: 'Web Server 01',
      data: MOCK_ASSETS[0],
    },
    {
      id: 'node-web2',
      label: 'Web Server 02',
      data: MOCK_ASSETS[1],
    },
    {
      id: 'node-app1',
      label: 'App Server 01',
      data: {
        id: 'asset-app1',
        name: 'app-server-01',
        ipAddress: '10.0.2.20',
        risk: 'critical',
        tags: [
          { label: 'App Tier', type: 'info' },
          { label: 'SSH Exposed', type: 'error' }
        ]
      },
    },
    {
      id: 'node-app2',
      label: 'App Server 02',
      data: {
        id: 'asset-app2',
        name: 'app-server-02',
        ipAddress: '10.0.2.21',
        risk: 'high',
        tags: [
          { label: 'App Tier', type: 'info' },
          { label: 'Patching', type: 'warning' }
        ]
      },
    },
    // Data Layer
    {
      id: 'node-db-primary',
      label: 'DB Primary',
      data: {
        id: 'asset-db1',
        name: 'db-primary-01',
        ipAddress: '10.0.3.50',
        risk: 'critical',
        tags: [
          { label: 'Data Tier', type: 'default' },
          { label: 'PII Data', type: 'error' }
        ]
      },
    },
    {
      id: 'node-db-replica',
      label: 'DB Replica',
      data: {
        id: 'asset-db2',
        name: 'db-replica-01',
        ipAddress: '10.0.3.51',
        risk: 'high',
        tags: [
          { label: 'Data Tier', type: 'default' },
          { label: 'Backup', type: 'info' }
        ]
      },
    },
    {
      id: 'node-cache',
      label: 'Redis Cache',
      data: {
        id: 'asset-cache',
        name: 'cache-redis-01',
        ipAddress: '10.0.3.60',
        risk: 'medium',
        tags: [
          { label: 'Data Tier', type: 'default' },
          { label: 'Sessions', type: 'warning' }
        ]
      },
    },
  ],
  edges: [
    // Internet to Edge
    { id: 'edge-1', source: 'node-internet', target: 'node-fw' },
    // Edge to DMZ
    { id: 'edge-2', source: 'node-fw', target: 'node-lb' },
    { id: 'edge-3', source: 'node-fw', target: 'node-waf' },
    // DMZ to App Layer
    { id: 'edge-4', source: 'node-lb', target: 'node-api' },
    { id: 'edge-5', source: 'node-waf', target: 'node-api' },
    // API to Web Servers
    { id: 'edge-6', source: 'node-api', target: 'node-web1' },
    { id: 'edge-7', source: 'node-api', target: 'node-web2' },
    // Web to App Servers
    { id: 'edge-8', source: 'node-web1', target: 'node-app1' },
    { id: 'edge-9', source: 'node-web2', target: 'node-app2' },
    // App Servers to Data Layer
    { id: 'edge-10', source: 'node-app1', target: 'node-db-primary' },
    { id: 'edge-11', source: 'node-app2', target: 'node-db-primary' },
    { id: 'edge-12', source: 'node-app1', target: 'node-cache' },
    { id: 'edge-13', source: 'node-app2', target: 'node-cache' },
    // DB Replication
    { id: 'edge-14', source: 'node-db-primary', target: 'node-db-replica' },
  ],
};

export const MOCK_RISK_SUMMARY: RiskSummary = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 3,
  total: 12,
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
