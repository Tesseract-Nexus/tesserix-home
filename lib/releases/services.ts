export type ServiceType = "backend" | "frontend" | "mfe";

export interface ServiceConfig {
  name: string;
  displayName: string;
  type: ServiceType;
  repo: string;
  buildWorkflow: string;
  releaseWorkflow: string;
  imageRepo: string;
}

const OWNER = "Tesseract-Nexus";

function globalService(name: string, displayName: string): ServiceConfig {
  return {
    name,
    displayName,
    type: "backend",
    repo: `${OWNER}/global-services`,
    buildWorkflow: `${name}-build.yml`,
    releaseWorkflow: `${name}-release.yml`,
    imageRepo: `ghcr.io/${OWNER.toLowerCase()}/global-services/${name}`,
  };
}

function marketplaceService(name: string, displayName: string): ServiceConfig {
  return {
    name,
    displayName,
    type: "backend",
    repo: `${OWNER}/marketplace-services`,
    buildWorkflow: `${name}-build.yml`,
    releaseWorkflow: `${name}-release.yml`,
    imageRepo: `ghcr.io/${OWNER.toLowerCase()}/marketplace-services/${name}`,
  };
}

function clientApp(name: string, displayName: string): ServiceConfig {
  return {
    name,
    displayName,
    type: "frontend",
    repo: `${OWNER}/marketplace-clients`,
    buildWorkflow: `${name}-build.yml`,
    releaseWorkflow: `${name}-release.yml`,
    imageRepo: `ghcr.io/${OWNER.toLowerCase()}/marketplace-clients/${name}`,
  };
}

function mfe(name: string, displayName: string): ServiceConfig {
  return {
    name,
    displayName,
    type: "mfe",
    repo: "",
    buildWorkflow: "",
    releaseWorkflow: "",
    imageRepo: "",
  };
}

export const SERVICE_REGISTRY: ServiceConfig[] = [
  // Global Services (15 Kargo-managed backends)
  globalService("settings-service", "Settings Service"),
  globalService("auth-service", "Auth Service"),
  globalService("tickets-service", "Tickets Service"),
  globalService("document-service", "Document Service"),
  globalService("location-service", "Location Service"),
  globalService("tenant-service", "Tenant Service"),
  globalService("verification-service", "Verification Service"),
  globalService("translation-service", "Translation Service"),
  globalService("analytics-service", "Analytics Service"),
  globalService("audit-service", "Audit Service"),
  globalService("feature-flags-service", "Feature Flags Service"),
  globalService("notification-service", "Notification Service"),
  globalService("notification-hub", "Notification Hub"),
  globalService("search-service", "Search Service"),
  globalService("subscription-service", "Subscription Service"),

  // Marketplace Services (7 Kargo-managed backends)
  marketplaceService("products-service", "Products Service"),
  marketplaceService("categories-service", "Categories Service"),
  marketplaceService("orders-service", "Orders Service"),
  marketplaceService("coupons-service", "Coupons Service"),
  marketplaceService("staff-service", "Staff Service"),
  marketplaceService("vendor-service", "Vendor Service"),
  marketplaceService("reviews-service", "Reviews Service"),

  // Marketplace Clients (3 frontends)
  clientApp("admin", "Admin Portal"),
  clientApp("storefront", "Storefront"),
  clientApp("tenant-onboarding", "Tenant Onboarding"),

  // MFEs (9 — repo TBD)
  mfe("products-hub", "Products Hub"),
  mfe("categories-hub", "Categories Hub"),
  mfe("orders-hub", "Orders Hub"),
  mfe("staff-hub", "Staff Hub"),
  mfe("vendor-hub", "Vendor Hub"),
  mfe("coupons-hub", "Coupons Hub"),
  mfe("reviews-hub", "Reviews Hub"),
  mfe("tickets-hub", "Tickets Hub"),
  mfe("user-management", "User Management"),
];

/** Unique repos that have workflows (excludes MFEs with empty repo). */
export const REPOS_WITH_WORKFLOWS = [
  ...new Set(
    SERVICE_REGISTRY.filter((s) => s.repo).map((s) => s.repo)
  ),
];

export function getServiceByName(name: string): ServiceConfig | undefined {
  return SERVICE_REGISTRY.find((s) => s.name === name);
}

/** Parse "Owner/repo" into { owner, repo }. */
export function parseRepo(fullRepo: string): { owner: string; repo: string } {
  const [owner, repo] = fullRepo.split("/");
  return { owner, repo };
}
