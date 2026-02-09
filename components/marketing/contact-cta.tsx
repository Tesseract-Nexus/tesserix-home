"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

export function ContactCTA() {
  return (
    <section className="py-14 sm:py-16 bg-foreground relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        <AnimateOnScroll variant="fade-up" className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-background sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg text-background/70">
            Contact our team to learn how Tesserix can help your business grow.
          </p>
          <div className="mt-10">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="bg-white text-foreground hover:bg-white/90 btn-shimmer"
            >
              <Link href="/contact">Get in touch</Link>
            </Button>
            <p className="mt-3 text-sm text-background/60">
              Free consultation · No commitment required
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
