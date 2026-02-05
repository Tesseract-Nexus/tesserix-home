import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ContactCTA() {
  return (
    <section className="py-16 sm:py-24 bg-foreground">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
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
              className="bg-white text-foreground hover:bg-white/90"
            >
              <Link href="/contact">Get in touch</Link>
            </Button>
            <p className="mt-3 text-sm text-background/60">
              Free consultation · No commitment required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
