export type FirewallStatus = 'enabled' | 'disabled' | 'deleted';

export type FirewallRuleProtocol = 'ALL' | 'TCP' | 'UDP' | 'ICMP' | 'IPENCAP';

export type FirewallDeviceEntityType = 'linode' | 'nodebalancer';

export type FirewallPolicyType = 'ACCEPT' | 'DROP';

export interface Firewall {
  id: number;
  status: FirewallStatus;
  label: string;
  tags: string[];
  rules: FirewallRules;
  created: string;
  updated: string;
  entities: {
    id: number;
    type: FirewallDeviceEntityType;
    label: string;
    url: string;
  }[];
}

export interface FirewallRules {
  inbound?: FirewallRuleType[] | null;
  outbound?: FirewallRuleType[] | null;
  inbound_policy: FirewallPolicyType;
  outbound_policy: FirewallPolicyType;
}

export interface FirewallRuleType {
  label?: string | null;
  description?: string | null;
  protocol: FirewallRuleProtocol;
  ports?: string;
  action: FirewallPolicyType;
  addresses?: null | {
    ipv4?: null | string[];
    ipv6?: null | string[];
  };
}

export interface FirewallDeviceEntity {
  id: number;
  type: FirewallDeviceEntityType;
  label: string;
  url: string;
}

export interface FirewallDevice {
  id: number;
  created: string;
  updated: string;
  entity: FirewallDeviceEntity;
}

export interface FirewallTemplate {
  slug: string;
  rules: FirewallRules;
}

export interface CreateFirewallPayload {
  label?: string;
  tags?: string[];
  rules: FirewallRules;
  devices?: {
    linodes?: number[];
    nodebalancers?: number[];
  };
}

export interface UpdateFirewallPayload {
  label?: string;
  tags?: string[];
  status?: Omit<FirewallStatus, 'deleted'>;
}

export interface FirewallDevicePayload {
  id: number;
  type: FirewallDeviceEntityType;
}
