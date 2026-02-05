import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ShoppingBag,
  CheckCircle2,
  ArrowRight,
  Users,
  Palette,
  CreditCard,
  Package,
  BarChart,
  Shield,
  ChefHat,
  Utensils,
  Truck,
  Star,
  Clock,
  MapPin,
  Hospital,
  Stethoscope,
  Calendar,
  FileText,
  Pill,
  UserCheck,
  Trophy,
  MessageCircle,
  TrendingUp,
  Bell,
  Zap,
  Users2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/common/breadcrumb";

// Product data
const products: Record<
  string,
  {
    title: string;
    tagline: string;
    description: string;
    longDescription: string;
    icon: React.ComponentType<{ className?: string }>;
    status: "available" | "coming-soon";
    features: Array<{
      icon: React.ComponentType<{ className?: string }>;
      title: string;
      description: string;
    }>;
    benefits: string[];
    pricing: {
      starter: string;
      professional: string;
      enterprise: string;
    };
    github?: string;
  }
> = {
  mark8ly: {
    title: "Mark8ly",
    tagline: "Multi-tenant Marketplace Platform",
    description:
      "Launch and scale your own branded marketplace with powerful tools and enterprise-grade infrastructure.",
    longDescription:
      "Mark8ly is a comprehensive multi-tenant marketplace platform that enables businesses to create, manage, and scale their own branded online marketplaces. Whether you're building a B2B wholesale platform, a consumer marketplace, or a specialized niche store, Mark8ly provides all the tools you need.",
    icon: ShoppingBag,
    status: "available",
    features: [
      {
        icon: Users,
        title: "Multi-Vendor Management",
        description:
          "Onboard and manage multiple vendors with role-based permissions, automated payouts, and performance tracking.",
      },
      {
        icon: Palette,
        title: "Customizable Storefronts",
        description:
          "Create beautiful, branded storefronts with our drag-and-drop builder. No coding required.",
      },
      {
        icon: CreditCard,
        title: "Integrated Payments",
        description:
          "Accept payments via multiple gateways with automated split payments and vendor settlements.",
      },
      {
        icon: Package,
        title: "Inventory Management",
        description:
          "Track inventory across multiple warehouses with real-time stock updates and low-stock alerts.",
      },
      {
        icon: BarChart,
        title: "Analytics & Reporting",
        description:
          "Gain insights with comprehensive dashboards, sales reports, and customer analytics.",
      },
      {
        icon: Shield,
        title: "Enterprise Security",
        description:
          "SOC 2 compliant infrastructure with data encryption, audit logs, and role-based access control.",
      },
    ],
    benefits: [
      "Launch your marketplace in days, not months",
      "No upfront infrastructure costs",
      "Automatic scaling as you grow",
      "24/7 technical support",
      "Regular feature updates",
      "99.9% uptime SLA",
    ],
    pricing: {
      starter: "$99/month",
      professional: "$299/month",
      enterprise: "Custom",
    },
  },
  homechef: {
    title: "HomeChef",
    tagline: "Home Cooked Food Delivery Platform",
    description:
      "Connect home chefs with food lovers for authentic, home-cooked meal delivery.",
    longDescription:
      "HomeChef is a complete platform that connects talented home cooks with hungry customers in their community. From chef onboarding and menu management to order tracking and delivery coordination, HomeChef provides everything you need to run a successful home food delivery business.",
    icon: ChefHat,
    status: "available",
    github: "https://github.com/Tesseract-Nexus/Home-Chef-App",
    features: [
      {
        icon: UserCheck,
        title: "Chef Onboarding & Verification",
        description:
          "Streamlined chef registration with identity verification, food safety certifications, and kitchen inspections.",
      },
      {
        icon: Utensils,
        title: "Menu Management",
        description:
          "Easy-to-use tools for chefs to create, update, and manage their menus with photos, pricing, and availability.",
      },
      {
        icon: Clock,
        title: "Real-time Order Tracking",
        description:
          "Live order status updates for customers from preparation to delivery with ETA notifications.",
      },
      {
        icon: Truck,
        title: "Delivery Coordination",
        description:
          "Integrated delivery management with route optimization, driver assignment, and live tracking.",
      },
      {
        icon: Star,
        title: "Reviews & Ratings",
        description:
          "Built-in review system to build trust and help customers discover the best home chefs.",
      },
      {
        icon: CreditCard,
        title: "Secure Payments",
        description:
          "Multiple payment options with automatic chef payouts and transparent fee structure.",
      },
    ],
    benefits: [
      "Support local home chefs in your community",
      "Authentic home-cooked meals delivered fresh",
      "Quality control and food safety compliance",
      "Flexible scheduling for chefs",
      "Customer loyalty programs",
      "Mobile apps for iOS and Android",
    ],
    pricing: {
      starter: "$79/month",
      professional: "$199/month",
      enterprise: "Custom",
    },
  },
  medicare: {
    title: "MediCare",
    tagline: "Complete Hospital Management System",
    description:
      "End-to-end hospital management solution for clinics and hospitals of all sizes.",
    longDescription:
      "MediCare is a comprehensive hospital management system designed to streamline healthcare operations. From patient registration and electronic health records to appointment scheduling, billing, and inventory management, MediCare digitizes every aspect of hospital administration.",
    icon: Hospital,
    status: "available",
    github: "https://github.com/Tesseract-Nexus/hospital-management",
    features: [
      {
        icon: FileText,
        title: "Electronic Health Records",
        description:
          "Secure, centralized patient records with medical history, prescriptions, lab results, and imaging.",
      },
      {
        icon: Calendar,
        title: "Appointment Scheduling",
        description:
          "Smart scheduling system with doctor availability, patient reminders, and waitlist management.",
      },
      {
        icon: CreditCard,
        title: "Billing & Insurance",
        description:
          "Automated billing, insurance claim processing, and payment tracking with detailed financial reports.",
      },
      {
        icon: Pill,
        title: "Pharmacy & Inventory",
        description:
          "Complete pharmacy management with drug inventory, expiry tracking, and prescription fulfillment.",
      },
      {
        icon: Users,
        title: "Staff Management",
        description:
          "Employee scheduling, attendance tracking, payroll integration, and performance management.",
      },
      {
        icon: Stethoscope,
        title: "Lab & Diagnostics",
        description:
          "Lab test ordering, result tracking, and integration with diagnostic equipment for seamless workflows.",
      },
    ],
    benefits: [
      "Reduce administrative overhead by 60%",
      "HIPAA compliant data security",
      "Improve patient care coordination",
      "Real-time bed and resource management",
      "Multi-location support",
      "Integration with medical devices",
    ],
    pricing: {
      starter: "$199/month",
      professional: "$499/month",
      enterprise: "Custom",
    },
  },
  fanzone: {
    title: "FanZone",
    tagline: "Cricket Live Scores & Banter",
    description:
      "The ultimate cricket fan experience with live scores, predictions, and community.",
    longDescription:
      "FanZone brings cricket fans together with real-time match updates, ball-by-ball commentary, match predictions, and a vibrant community for discussions and banter. Whether you're following IPL, international matches, or local leagues, FanZone keeps you connected to the game you love.",
    icon: Trophy,
    status: "available",
    github: "https://github.com/Tesseract-Nexus/FanZone-Battle-Ground",
    features: [
      {
        icon: Zap,
        title: "Live Match Scores",
        description:
          "Real-time score updates with ball-by-ball tracking, run rates, and key match statistics.",
      },
      {
        icon: MessageCircle,
        title: "Ball-by-Ball Commentary",
        description:
          "Expert commentary on every delivery with insights, analysis, and memorable moments.",
      },
      {
        icon: TrendingUp,
        title: "Match Predictions",
        description:
          "Predict match outcomes, player performances, and compete with friends on leaderboards.",
      },
      {
        icon: Users2,
        title: "Fan Discussions & Polls",
        description:
          "Join the conversation with live match threads, polls, and community discussions.",
      },
      {
        icon: BarChart,
        title: "Player Statistics",
        description:
          "Comprehensive player stats, career records, head-to-head comparisons, and performance trends.",
      },
      {
        icon: Bell,
        title: "Push Notifications",
        description:
          "Never miss a wicket or milestone with customizable alerts for your favorite teams and players.",
      },
    ],
    benefits: [
      "Follow all major cricket tournaments",
      "Compete with friends in prediction leagues",
      "Build your cricket fan profile",
      "Access historical match data",
      "Ad-free premium experience",
      "Available on web and mobile",
    ],
    pricing: {
      starter: "Free",
      professional: "$9.99/month",
      enterprise: "Custom",
    },
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products[slug];

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.title,
    description: product.description,
  };
}

export async function generateStaticParams() {
  return Object.keys(products).map((slug) => ({ slug }));
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = products[slug];

  if (!product) {
    notFound();
  }

  const Icon = product.icon;

  return (
    <div>
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Products", href: "/products" },
              { label: product.title },
            ]}
          />

          <div className="mx-auto max-w-3xl text-center">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted border">
                <Icon className="h-8 w-8 text-foreground" />
              </div>
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {product.title}
            </h1>
            <p className="mt-2 text-xl text-muted-foreground">{product.tagline}</p>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {product.longDescription}
            </p>

            {/* Single Primary CTA */}
            <div className="mt-10">
              <Button size="lg" asChild>
                <Link href="/contact">
                  Start free trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <p className="mt-3 text-sm text-muted-foreground">
                No credit card required · 14-day free trial
              </p>
            </div>

            {/* GitHub link if available */}
            {product.github && (
              <div className="mt-4">
                <a
                  href={product.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  View on GitHub →
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Powerful Features
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to succeed with {product.title}.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {product.features.map((feature) => (
              <div key={feature.title} className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <feature.icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Why Choose {product.title}?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Focus on what matters while we handle the technical infrastructure.
              </p>
              <ul className="mt-8 space-y-4">
                {product.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-foreground mt-0.5 shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing Preview */}
            <div className="rounded-lg border bg-card p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-foreground">Pricing Plans</h3>
              <p className="mt-2 text-muted-foreground">
                Choose the plan that fits your needs.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-foreground">Starter</p>
                    <p className="text-sm text-muted-foreground">For individuals & small teams</p>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {product.pricing.starter}
                  </p>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-foreground">Professional</p>
                    <p className="text-sm text-muted-foreground">For growing businesses</p>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {product.pricing.professional}
                  </p>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">Enterprise</p>
                    <p className="text-sm text-muted-foreground">For large organizations</p>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {product.pricing.enterprise}
                  </p>
                </div>
              </div>

              <Button className="w-full mt-8" asChild>
                <Link href="/contact">Get started today</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-primary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to get started with {product.title}?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Join businesses already using our platform.
            </p>
            <div className="mt-10">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="bg-white text-primary hover:bg-white/90"
              >
                <Link href="/contact">Start your free trial</Link>
              </Button>
              <p className="mt-3 text-sm text-primary-foreground/70">
                No credit card required · Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
