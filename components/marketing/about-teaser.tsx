import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const values = [
  "Built for scale from day one",
  "Enterprise-grade security",
  "Transparent, predictable pricing",
  "Dedicated support team",
];

export function AboutTeaser() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-16 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Why businesses choose Tesserix
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              We build reliable infrastructure that scales with your business.
              Our products are trusted by hundreds of companies to power their commerce operations.
            </p>

            <ul className="mt-8 space-y-3">
              {values.map((value) => (
                <li key={value} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-foreground" />
                  <span className="text-foreground">{value}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <Button variant="outline" asChild>
                <Link href="/about">
                  Learn more about us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <p className="text-3xl font-semibold text-foreground">500+</p>
              <p className="mt-1 text-sm text-muted-foreground">Active businesses</p>
            </div>
            <div className="border rounded-lg p-6">
              <p className="text-3xl font-semibold text-foreground">99.9%</p>
              <p className="mt-1 text-sm text-muted-foreground">Uptime SLA</p>
            </div>
            <div className="border rounded-lg p-6">
              <p className="text-3xl font-semibold text-foreground">24/7</p>
              <p className="mt-1 text-sm text-muted-foreground">Support available</p>
            </div>
            <div className="border rounded-lg p-6">
              <p className="text-3xl font-semibold text-foreground">10M+</p>
              <p className="mt-1 text-sm text-muted-foreground">Transactions processed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
