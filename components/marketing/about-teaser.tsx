"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimateOnScroll, StaggerContainer, StaggerItem } from "@/components/ui/animate-on-scroll";
import { CountUp } from "@/components/ui/count-up";

const values = [
  "Built for scale from day one",
  "Enterprise-grade security",
  "Transparent, predictable pricing",
  "Dedicated support team",
];

export function AboutTeaser() {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-16 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center">
          {/* Content */}
          <AnimateOnScroll variant="slide-left">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Why businesses choose Tesserix
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              We build reliable infrastructure that scales with your business.
              Our products are trusted by hundreds of companies to power their commerce operations.
            </p>

            <StaggerContainer className="mt-8 space-y-3" delay={0.2}>
              {values.map((value) => (
                <StaggerItem key={value}>
                  <li className="flex items-center gap-3 list-none">
                    <Check className="h-5 w-5 text-foreground" />
                    <span className="text-foreground">{value}</span>
                  </li>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <div className="mt-10">
              <Button variant="outline" asChild>
                <Link href="/about">
                  Learn more about us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </AnimateOnScroll>

          {/* Stats */}
          <StaggerContainer className="grid grid-cols-2 gap-6" staggerDelay={0.1}>
            <StaggerItem variant="scale-in">
              <div className="border rounded-lg p-6 card-hover-lift">
                <p className="text-3xl font-semibold text-foreground">
                  <CountUp end={500} suffix="+" />
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Active businesses</p>
              </div>
            </StaggerItem>
            <StaggerItem variant="scale-in">
              <div className="border rounded-lg p-6 card-hover-lift">
                <p className="text-3xl font-semibold text-foreground">
                  <CountUp end={99.9} suffix="%" decimals={1} />
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Uptime SLA</p>
              </div>
            </StaggerItem>
            <StaggerItem variant="scale-in">
              <div className="border rounded-lg p-6 card-hover-lift">
                <p className="text-3xl font-semibold text-foreground">24/7</p>
                <p className="mt-1 text-sm text-muted-foreground">Support available</p>
              </div>
            </StaggerItem>
            <StaggerItem variant="scale-in">
              <div className="border rounded-lg p-6 card-hover-lift">
                <p className="text-3xl font-semibold text-foreground">
                  <CountUp end={10} suffix="M+" />
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Transactions processed</p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
