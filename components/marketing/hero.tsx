"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, ChefHat, Hospital, Trophy } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const products = [
  {
    title: "Mark8ly",
    tagline: "Your online store, ready this afternoon",
    description: "Launch your store in under an hour — no developer needed.",
    icon: ShoppingBag,
    href: "/products/mark8ly",
    featured: true,
    link: { label: "mark8ly.com", href: "https://mark8ly.com" },
    highlights: ["No coding", "0% fees", "Custom domains"],
  },
  {
    title: "HomeChef",
    tagline: "Food Delivery",
    description: "Connect home chefs with food lovers. Chef onboarding, menu management, real-time order tracking, and delivery coordination.",
    icon: ChefHat,
    href: "/products/homechef",
    highlights: ["Chef verification", "Live tracking", "Delivery"],
    comingSoon: true,
  },
  {
    title: "MediCare",
    tagline: "Hospital Management",
    description: "End-to-end hospital management with EHR, scheduling, billing, pharmacy, and lab integration.",
    icon: Hospital,
    href: "/products/medicare",
    highlights: ["EHR", "Scheduling", "Billing"],
    comingSoon: true,
  },
  {
    title: "FanZone",
    tagline: "Cricket & Sports",
    description: "Live scores, ball-by-ball commentary, match predictions, and a vibrant fan community.",
    icon: Trophy,
    href: "/products/fanzone",
    highlights: ["Live scores", "Predictions", "Community"],
    comingSoon: true,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  const featured = products.find((p) => p.featured);
  const others = products.filter((p) => !p.featured);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden gradient-mesh">
      {/* Decorative floating elements */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-foreground/[0.02] blur-3xl"
        style={{ animation: prefersReducedMotion ? "none" : "float 6s ease-in-out infinite" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-foreground/[0.02] blur-3xl"
        style={{ animation: prefersReducedMotion ? "none" : "float 8s ease-in-out infinite 2s" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8 lg:py-20">
        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div
            className="mx-auto max-w-3xl text-center mb-12"
            variants={prefersReducedMotion ? undefined : itemVariants}
          >
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Build what&apos;s next
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              We build the software so you can focus on the business.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <motion.div
            className="mx-auto max-w-5xl"
            variants={prefersReducedMotion ? undefined : itemVariants}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Featured Product - Mark8ly */}
              {featured && (
                <Link
                  href={featured.href}
                  className="group relative col-span-1 sm:col-span-2 lg:col-span-2 lg:row-span-2 rounded-2xl border bg-card p-6 sm:p-8 card-hover-lift card-glow-border overflow-hidden"
                >
                  {/* Watermark logo */}
                  <div className="pointer-events-none absolute bottom-4 right-2 h-52 w-52 sm:h-64 sm:w-64 opacity-[0.12] transition-opacity duration-300 group-hover:opacity-[0.18]">
                    <Image
                      src="/mark8ly-logo.png"
                      alt=""
                      fill
                      className="object-contain grayscale"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="relative flex h-full flex-col">
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

                    <p className="mt-4 text-muted-foreground leading-relaxed">
                      {featured.description}
                    </p>

                    {featured.highlights && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {featured.highlights.map((h) => (
                          <span key={h} className="inline-flex items-center rounded-md border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                            {h}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Key selling points */}
                    <div className="mt-5 flex items-center gap-5 text-sm flex-wrap">
                      <div>
                        <span className="font-semibold text-foreground">12 months</span>
                        <span className="text-muted-foreground"> free</span>
                      </div>
                      <span className="h-3 w-px bg-border" />
                      <div>
                        <span className="font-semibold text-foreground">0%</span>
                        <span className="text-muted-foreground"> platform fees</span>
                      </div>
                      <span className="h-3 w-px bg-border" />
                      <div>
                        <span className="font-semibold text-foreground">₹499</span>
                        <span className="text-muted-foreground">/mo after</span>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-2 flex-1 justify-end">
                      <span className="text-sm text-muted-foreground">
                        No credit card required
                      </span>
                      <div>
                        <Button size="lg" className="btn-shimmer group-hover:bg-foreground/90">
                          Start your free year
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </div>

                    {featured.link && (
                      <p className="mt-3 text-sm text-muted-foreground">
                        Visit{" "}
                        <span className="font-medium text-foreground underline underline-offset-4">
                          {featured.link.label}
                        </span>
                      </p>
                    )}
                  </div>
                </Link>
              )}

              {/* Other Products */}
              {others.map((product) => (
                <Link
                  key={product.title}
                  href={product.href}
                  className="group relative rounded-2xl border bg-card p-6 card-hover-lift flex flex-col overflow-hidden"
                >
                  {/* Coming Soon watermark */}
                  {product.comingSoon && (
                    <div className="pointer-events-none absolute top-3 -right-6 rotate-[30deg] select-none">
                      <span className="inline-block bg-foreground/[0.07] px-10 py-1 text-[10px] font-bold tracking-widest text-foreground/40 uppercase">
                        Coming Soon
                      </span>
                    </div>
                  )}

                  <div className="relative flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-foreground/5">
                      <product.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{product.title}</h3>
                      <p className="text-xs text-muted-foreground">{product.tagline}</p>
                    </div>
                  </div>

                  <p className="relative mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
                    {product.description}
                  </p>

                  {product.highlights && (
                    <div className="relative mt-3 flex flex-wrap gap-1.5">
                      {product.highlights.map((h) => (
                        <span key={h} className="inline-flex items-center rounded-md border bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                          {h}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="relative mt-4 flex items-center text-sm font-medium text-foreground">
                    Learn more
                    <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
