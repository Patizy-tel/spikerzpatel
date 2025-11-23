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
    name: 'Loremipsumdolorsit',
    ipAddress: '192.168.1.1',
    risk: 'critical',
    tags: [
      { label: 'Lorem', type: 'error' },
      { label: 'Ipsum', type: 'warning' },
    ],
  },
  {
    id: 'asset-2',
    name: 'Loremipsumdolorsit002',
    ipAddress: '192.168.1.2',
    risk: 'critical',
    tags: [
      { label: 'Lorem', type: 'error' },
      { label: 'Ipsum', type: 'warning' },
    ],
  },
  {
    id: 'asset-3',
    name: 'Loremipsum',
    ipAddress: '1.2.3.4',
    risk: 'high',
    tags: [
      { label: 'Lorem', type: 'info' },
      { label: 'Ipsum', type: 'warning' },
      { label: 'Lorem', type: 'success' },
    ],
  },
  {
    id: 'asset-4',
    name: 'Loremipsu',
    ipAddress: '1.2.3.4',
    risk: 'medium',
    tags: [{ label: 'Lorem', type: 'default' }],
  },
];

export const MOCK_GRAPH_DATA: GraphData = {
  nodes: [
    {
      id: 'node-1',
      label: 'Loremipsuatim',
      data: MOCK_ASSETS[0],
    },
    {
      id: 'node-2',
      label: 'Loremipsu',
      data: MOCK_ASSETS[3],
    },
    {
      id: 'node-3',
      label: 'Loremipsumdolorsit',
      data: MOCK_ASSETS[0],
    },
    {
      id: 'node-4',
      label: 'Loremipsumdolorsit002',
      data: MOCK_ASSETS[1],
    },
  ],
  edges: [
    { id: 'edge-1', source: 'node-1', target: 'node-2' },
    { id: 'edge-2', source: 'node-2', target: 'node-3' },
    { id: 'edge-3', source: 'node-3', target: 'node-4' },
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
  title: 'Lorem Lorem Lorem',
  description:
    'Lorem Ipsum Dolor Sit Amet Consectetur. Aenean Sodales Pellentesque Gravida Nibh Et Magna Faucibus. Dui Commodo Ut Metus Amet Egestas Habitant Viverra. Quisque Fusce Senectus Facilisis Non Diam Leo Nulla Sem Pellentesque. Sit In Vel Sed Cursus Metus Sit Fringilla Vestibulum.',
  extraInfo:
    'Lorem ipsum dolor sit amet consectetur. Tempus a id adipiscing fames egestas tellus dis pretium tempus, justo risit nisi lorem lectus sit ornare. Amet gravida integer sed lobortis amet portitor pellentesque sit. Amet felis. Eu consectetur interdum auctor sed adipsum. Eu poritor accumsan tortor id. Duis a alisuam eu ultrices commodo lectus. Lacitus ipsum erat purus viverra vulputate viverra in nunc nulla. Euismod rhoncus mauris urna orci gravida sagittis neque. Amet risus in vel etiam, mauris mi habitant eaque massa in etiam sit. Commodo nibh viverra lobortis augue lorem quam lorem suspendisse.',
  publishedDate: '10/19/2017',
  severity: 'critical',
  affectedAssets: MOCK_ASSETS.slice(0, 2),
  details: [
    { label: 'Lorem Ipsum Dolor', value: '10/19/2017' },
    { label: 'Lorem Ipsum Dolor', value: 'Ut' },
    { label: 'Lorem Ipsum Dolor', value: 'Eros' },
    { label: 'Lorem Ipsum Dolor', value: 'Yes', hasCheckmark: true },
    { label: 'Lorem Ipsum Dolor', value: 'Sit' },
    { label: 'Lorem Ipsum Dolor', value: 'Lorem Ipsum Dolor' },
    { label: 'Lorem Ipsum Dolor', value: 'Lorem Ipsum Dolor' },
  ],
};

export const MOCK_REMEDIATION_TECHNIQUES: RemediationTechnique[] = [
  {
    id: 'rem-a',
    name: 'remediation technique A',
    type: 'A',
    description: 'Lorem Ipsum Dolor Sit Amet Consectetur. Nunc Vitae Tortor Convallis Vitae Arcu. Magna.',
    servers: [
      { id: 'srv-a1', name: 'Lorem P', description: 'Lorem Ipsum Dolor Sit Amet Consectetur.' },
      { id: 'srv-a2', name: 'Lorem P', description: 'Lorem Ipsum Dolor Sit Amet Consectetur.' },
    ],
  },
  {
    id: 'rem-b',
    name: 'remediation technique B',
    type: 'B',
    description:
      'Lorem Ipsum Dolor Sit Amet Consectetur. Quis Viverra Etiam Pellentesque Lectus Semper In Massa Purus. Auctor Aenean Aenean Senectus Massa Dignissim Vehicula Mi Erat Purus. Praesent Scelerisque Aliquet Metus Sagittis Dictum Sed Sed. Sed Venenatis Sed Urna Quam.',
    servers: [
      { id: 'srv-b1', name: 'Lorem S', description: 'Lorem Ipsum Dolor Sit Amet Consectetur.' },
      { id: 'srv-b2', name: 'Lorem S', description: 'Lorem Ipsum Dolor Sit Amet Consectetur.' },
    ],
  },
  {
    id: 'rem-c',
    name: 'remediation technique C',
    type: 'C',
    description: 'Lorem Ipsum Dolor Sit Amet Consectetur. In Laoreet Elementum Luctus Odio. Id Enim Urna.',
    servers: [
      { id: 'srv-c1', name: 'Lorem T', description: 'Lorem Ipsum Dolor Sit Amet Consectetur.' },
      { id: 'srv-c2', name: 'Lorem T', description: 'Lorem Ipsum Dolor Sit Amet Consectetur.' },
    ],
  },
];

export const SIDEBAR_MENU_ITEMS = [
  { id: 'item-1', label: 'Lorem', active: false },
  { id: 'item-2', label: 'Lorem', active: false },
  { id: 'item-3', label: 'Lorem', active: false },
  { id: 'item-4', label: 'Lorem', active: true },
  { id: 'item-5', label: 'Lorem', active: false },
  { id: 'item-6', label: 'Lorem', active: false },
];
