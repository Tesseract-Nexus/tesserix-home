import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, ChefHat, Hospital, Trophy } from "lucide-react";

const products = [
  {
    title: "Mark8ly",
    tagline: "Marketplace Platform",
    description: "Launch and scale your branded online marketplace in days.",
    icon: ShoppingBag,
    href: "/products/mark8ly",
    featured: true,
  },
  {
    title: "HomeChef",
    tagline: "Food Delivery",
    description: "Home-cooked meals delivered fresh.",
    icon: ChefHat,
    href: "/products/homechef",
  },
  {
    title: "MediCare",
    tagline: "Hospital Management",
    description: "Complete healthcare administration.",
    icon: Hospital,
    href: "/products/medicare",
  },
  {
    title: "FanZone",
    tagline: "Cricket & Sports",
    description: "Live scores, predictions & banter.",
    icon: Trophy,
    href: "/products/fanzone",
  },
];

export function Hero() {
  const featured = products.find((p) => p.featured);
  const others = products.filter((p) => !p.featured);

  return (
    <section className="relative bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8 lg:py-20">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Build what's next
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Software solutions for marketplaces, healthcare, food delivery, and sports.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Featured Product - Mark8ly (spans 2 columns on lg) */}
            {featured && (
              <Link
                href={featured.href}
                className="group relative col-span-1 sm:col-span-2 lg:col-span-2 lg:row-span-2 rounded-2xl border bg-card p-6 sm:p-8 transition-all hover:border-foreground/20 hover:shadow-lg"
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
                      <featured.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">
                        {featured.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">{featured.tagline}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-muted-foreground leading-relaxed flex-1">
                    {featured.description}
                  </p>

                  <div className="mt-6 flex items-center gap-4">
                    <Button size="lg" className="group-hover:bg-foreground/90">
                      Start free trial
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      No credit card required
                    </span>
                  </div>

                  {/* Decorative element */}
                  <div className="absolute bottom-0 right-0 h-32 w-32 opacity-5 sm:h-48 sm:w-48">
                    <featured.icon className="h-full w-full" />
                  </div>
                </div>
              </Link>
            )}

            {/* Other Products */}
            {others.map((product) => (
              <Link
                key={product.title}
                href={product.href}
                className="group relative rounded-2xl border bg-card p-6 transition-all hover:border-foreground/20 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <product.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{product.title}</h3>
                    <p className="text-xs text-muted-foreground">{product.tagline}</p>
                  </div>
                </div>

                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>

                <div className="mt-4 flex items-center text-sm font-medium text-foreground">
                  Learn more
                  <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Trusted by 500+ businesses worldwide
          </p>
        </div>
      </div>
    </section>
  );
}
