import Link from "next/link";
import { ShoppingBag, ChefHat, Hospital, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const products = [
  {
    title: "Mark8ly",
    tagline: "Multi-tenant Marketplace Platform",
    description:
      "A comprehensive marketplace platform enabling businesses to launch and scale their own branded online stores. Features powerful admin tools, multi-vendor support, flexible pricing, and enterprise-grade security.",
    icon: ShoppingBag,
    href: "/products/mark8ly",
    pricing: "Starting at $99/month",
    features: [
      "Multi-tenant architecture",
      "Customizable storefronts",
      "Powerful admin dashboard",
      "Integrated payments",
      "Inventory management",
      "Analytics & reporting",
    ],
  },
  {
    title: "HomeChef",
    tagline: "Home Cooked Food Delivery Platform",
    description:
      "Connect home chefs with food lovers in your community. A complete platform for ordering authentic, home-cooked meals with real-time delivery tracking and chef management.",
    icon: ChefHat,
    href: "/products/homechef",
    pricing: "Starting at $79/month",
    features: [
      "Chef onboarding & verification",
      "Menu management",
      "Real-time order tracking",
      "Delivery coordination",
      "Customer reviews & ratings",
      "Payment processing",
    ],
  },
  {
    title: "MediCare",
    tagline: "Complete Hospital Management System",
    description:
      "End-to-end hospital management solution covering patient records, appointments, billing, inventory, and staff management. Built for clinics and hospitals of all sizes.",
    icon: Hospital,
    href: "/products/medicare",
    pricing: "Starting at $199/month",
    features: [
      "Electronic health records",
      "Appointment scheduling",
      "Billing & invoicing",
      "Pharmacy & inventory",
      "Staff management",
      "Lab & diagnostics",
    ],
  },
  {
    title: "FanZone",
    tagline: "Cricket Live Scores & Banter",
    description:
      "The ultimate cricket fan experience with live scores, ball-by-ball updates, match predictions, and a vibrant community for cricket banter and discussions.",
    icon: Trophy,
    href: "/products/fanzone",
    pricing: "Free / Premium $9.99/month",
    features: [
      "Live match scores",
      "Ball-by-ball commentary",
      "Match predictions",
      "Fan discussions & polls",
      "Player statistics",
      "Push notifications",
    ],
  },
];

export default function ProductsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Products
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Software solutions designed to help businesses succeed in their domains.
            </p>
          </div>
        </div>
      </section>

      {/* Products List */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="space-y-16 sm:space-y-20">
            {products.map((product, index) => (
              <div
                key={product.title}
                className={`flex flex-col gap-8 lg:flex-row lg:items-start ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Icon/Visual */}
                <div className="lg:w-1/3">
                  <div className="flex h-48 w-full items-center justify-center rounded-lg border bg-muted/30 shadow-sm">
                    <product.icon className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                </div>

                {/* Content */}
                <div className="lg:w-2/3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-semibold text-foreground">
                      {product.title}
                    </h2>
                  </div>
                  <p className="mt-1 text-muted-foreground">{product.tagline}</p>

                  {/* Pricing teaser */}
                  {product.pricing && (
                    <p className="mt-2 text-sm font-medium text-foreground">
                      {product.pricing}
                    </p>
                  )}

                  <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>

                  {/* Features Grid */}
                  <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {product.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-foreground shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-8">
                    <Button asChild>
                      <Link href={product.href}>
                        Explore {product.title}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 border-t">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Contact our team to learn how Tesserix products can help your business.
            </p>
            <div className="mt-10">
              <Button size="lg" asChild>
                <Link href="/contact">Talk to sales</Link>
              </Button>
              <p className="mt-3 text-sm text-muted-foreground">
                Free consultation · No commitment
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
