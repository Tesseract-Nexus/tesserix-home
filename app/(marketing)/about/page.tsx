import type { Metadata } from "next";
import { CheckCircle2, Users, Globe, Shield, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Tesserix - our mission, values, and the team building the future of commerce.",
};

const values = [
  {
    icon: Users,
    title: "Customer First",
    description:
      "Every decision we make starts with our customers. We build solutions that solve real problems and deliver measurable value.",
  },
  {
    icon: Shield,
    title: "Security & Trust",
    description:
      "Enterprise-grade security is built into everything we do. Your data and your customers' data are protected by industry-leading standards.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description:
      "We continuously push the boundaries of what's possible, leveraging the latest technologies to give our customers a competitive edge.",
  },
  {
    icon: Globe,
    title: "Global Scale",
    description:
      "Our infrastructure is designed for global scale, ensuring your business can grow without limits.",
  },
];

const team = [
  {
    name: "Leadership Team",
    description:
      "Our leadership brings decades of combined experience from leading technology companies, with deep expertise in e-commerce, cloud infrastructure, and enterprise software.",
  },
  {
    name: "Engineering",
    description:
      "World-class engineers passionate about building reliable, scalable systems that power businesses around the world.",
  },
  {
    name: "Customer Success",
    description:
      "Dedicated team ensuring every customer achieves their business goals with our platform.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              About Tesserix
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              We are on a mission to democratize access to enterprise-grade commerce tools,
              enabling businesses of all sizes to compete and succeed in the digital economy.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 sm:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Our Mission
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Tesserix was founded with a simple belief: that every business deserves access to
              powerful, reliable, and affordable software tools. Too often, small and medium businesses
              are forced to choose between expensive enterprise solutions and inadequate consumer products.
            </p>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              We're changing that. By building multi-tenant SaaS platforms from the ground up, we can
              offer enterprise-grade features at a fraction of the cost, allowing businesses to focus
              on what they do best: serving their customers.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Our Values
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The principles that guide everything we do.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="rounded-lg border p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border">
                  <value.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-foreground">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 sm:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Our Team
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A diverse team united by a shared passion for building great products.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
            {team.map((group) => (
              <div key={group.name} className="text-center">
                <h3 className="text-lg font-semibold text-foreground">{group.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{group.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Trusted by Businesses Worldwide
            </h2>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 xs:grid-cols-2 sm:grid-cols-4 sm:gap-8">
            <div className="text-center p-4 rounded-lg border bg-card">
              <p className="text-3xl font-semibold text-foreground">500+</p>
              <p className="mt-1 text-sm text-muted-foreground">Active businesses</p>
            </div>
            <div className="text-center p-4 rounded-lg border bg-card">
              <p className="text-3xl font-semibold text-foreground">15+</p>
              <p className="mt-1 text-sm text-muted-foreground">Countries served</p>
            </div>
            <div className="text-center p-4 rounded-lg border bg-card">
              <p className="text-3xl font-semibold text-foreground">99.9%</p>
              <p className="mt-1 text-sm text-muted-foreground">Uptime SLA</p>
            </div>
            <div className="text-center p-4 rounded-lg border bg-card">
              <p className="text-3xl font-semibold text-foreground">10M+</p>
              <p className="mt-1 text-sm text-muted-foreground">Transactions</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
