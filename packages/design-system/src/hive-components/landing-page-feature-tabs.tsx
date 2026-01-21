import auditImage from '../../public/features/gateway/audit.png';
import observabilityClientsImage from '../../public/features/observability/clients.webp';
import observabilityOperationsImage from '../../public/features/observability/operations.webp';
import observabilityOverallImage from '../../public/features/observability/overall.webp';
import registryExplorerImage from '../../public/features/registry/explorer.webp';
import registrySchemaChecksImage from '../../public/features/registry/schema-checks.webp';
import registryVersionControlSystemImage from '../../public/features/registry/version-control-system.webp';
import { ActiveHighlightImage, FeatureTab, FeatureTabs, Highlight } from './feature-tabs';
import { GatewayIcon } from './icons';

const tabs = ['Schema Registry', 'GraphQL Observability', 'GraphQL Gateway'];
type Tab = (typeof tabs)[number];

export const highlights: Record<Tab, Highlight[]> = {
  'GraphQL Gateway': [
    {
      description:
        'Best in class support for Apollo Federation. Scores 100% in the Federation audit.',
      image: auditImage,
      link: '/federation-gateway-audit',
      title: 'Federation v1 and v2',
    },
    {
      description: 'Contribute data from subgraphs to a GraphQL subscription seamlessly.',
      image: auditImage,
      link: '/docs/gateway/subscriptions',
      title: 'Real-time features',
      // TODO: show entities and Subscription type (code)
    },
    {
      description:
        'Access control with role-based access control (RBAC), JSON Web Tokens (JWT) and Persisted Operations.',
      image: auditImage,
      link: '/docs/gateway/authorization-authentication',
      title: 'Security and Compliance',
      // TODO: show directives and auth roles
    },
    {
      description:
        'Out-of-the-box support for OpenTelemetry and Prometheus metrics to fit your observability stack.',
      image: auditImage,
      link: '/docs/gateway/monitoring-tracing',
      title: 'OTEL & Prometheus',
      // TODO: image
    },
  ],
  'GraphQL Observability': [
    {
      description: 'Track GraphQL requests to see how API is utilized and by what applications.',
      image: observabilityClientsImage,
      title: 'GraphQL consumers',
    },
    {
      description: 'Observe and analyze performance of your GraphQL API.',
      image: observabilityOverallImage,
      title: 'Overall performance',
    },
    {
      description: 'Identify slow GraphQL operations to pinpoint performance bottlenecks.',
      image: observabilityOperationsImage,
      title: 'Query performance',
    },
  ],
  'Schema Registry': [
    {
      description:
        'Track schema modifications across multiple environments from development to production.',
      image: registryVersionControlSystemImage,
      title: 'Version Control System',
    },
    {
      description:
        'Identify and breaking changes before they reach production. Evolve your API with confidence.',
      image: registrySchemaChecksImage,
      title: 'Schema Checks',
    },
    {
      description: 'Avoid runtime errors by validating compatibility of all your subgraphs.',
      image: registrySchemaChecksImage,
      title: 'Composition Error Prevention',
    },
    {
      description: 'Navigate through your GraphQL schema and check ownership and usage of types.',
      image: registryExplorerImage,
      title: 'Schema Explorer',
    },
  ],
};

export interface LandingPageFeatureTabsProps {
  className?: string;
}

export function LandingPageFeatureTabs({ className }: LandingPageFeatureTabsProps) {
  const icons = [
    // The keys here are redundant, but Next.js started false positive linting them even if the ESLint integration is disabled.
    <SchemaRegistryIcon key="schema-registry-icon" />,
    <GraphQLObservabilityIcon key="graphql-observability-icon" />,
    <GatewayIcon key="gateway-icon" />,
  ];
  return (
    <FeatureTabs className={className} highlights={highlights} icons={icons}>
      <FeatureTab
        description="Publish schemas, compose federated GraphQL api, and detect backward-incompatible changes with ease."
        documentationLink="/docs/schema-registry"
        highlights={highlights['Schema Registry']!}
        title="Schema Registry"
      />
      <FeatureTab
        description="Insights into API usage and user experience metrics."
        documentationLink="/docs/schema-registry/usage-reporting"
        highlights={highlights['GraphQL Observability']!}
        title="GraphQL Observability"
      />
      <FeatureTab
        description="Entry point to your distributed data graph."
        documentationLink="/docs/gateway"
        highlights={highlights['GraphQL Gateway']!}
        title="GraphQL Gateway"
      />
      <ActiveHighlightImage />
    </FeatureTabs>
  );
}

function SchemaRegistryIcon() {
  return (
    <svg fill="currentColor" height="24" width="24">
      <path d="M5.25 7.5a2.25 2.25 0 1 1 3 2.122v4.756a2.251 2.251 0 1 1-1.5 0V9.622A2.25 2.25 0 0 1 5.25 7.5Zm9.22-2.03a.75.75 0 0 1 1.06 0l.97.97.97-.97a.75.75 0 1 1 1.06 1.06l-.97.97.97.97a.75.75 0 0 1-1.06 1.06l-.97-.97-.97.97a.75.75 0 1 1-1.06-1.06l.97-.97-.97-.97a.75.75 0 0 1 0-1.06Zm2.03 5.03a.75.75 0 0 1 .75.75v3.128a2.251 2.251 0 1 1-1.5 0V11.25a.75.75 0 0 1 .75-.75Z" />
    </svg>
  );
}

function GraphQLObservabilityIcon() {
  return (
    <svg fill="currentColor" height="24" width="24">
      <path d="M11.1 19.2v-6.3H9.3v-2.7h5.4v2.7h-1.8v6.3h4.5V21H6.6v-1.8h4.5Zm-.9-16V2.1h3.6v1.1a8.102 8.102 0 0 1 2.694 14.64l-1-1.497a6.3 6.3 0 1 0-6.99 0l-.998 1.497A8.103 8.103 0 0 1 10.2 3.2Z" />
    </svg>
  );
}
