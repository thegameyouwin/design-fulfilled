import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import maragaHero from "@/assets/maraga-hero.png";

const pillars = [
  {
    number: 1,
    title: "Justice & Rule of Law",
    description: "Committed to upholding the constitution and ensuring justice for all Kenyans"
  },
  {
    number: 2,
    title: "Transparency & Accountability",
    description: "Promoting open government and holding leaders accountable to the people"
  },
  {
    number: 3,
    title: "Inclusive Development",
    description: "Building a Kenya where every citizen has equal opportunities to succeed"
  }
];

const LeadershipSection = () => {
  return (
    <section className="py-16 md:py-24 bg-amber-50/80">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-elevated">
              <img 
                src={maragaHero} 
                alt="David Maraga" 
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Badge */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 md:bottom-6 bg-primary text-primary-foreground px-8 py-4 rounded-xl shadow-lg text-center">
              <p className="text-3xl font-bold">2027</p>
              <p className="text-sm font-medium">Presidential Candidate</p>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            {/* Tag */}
            <span className="inline-block px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-full mb-4">
              Leadership
            </span>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
              David Maraga 2027
            </h2>

            {/* Slogan */}
            <p className="text-xl text-muted-foreground italic mb-8">
              Reset. Restore. Rebuild.
            </p>

            {/* Pillars */}
            <div className="space-y-4 mb-8">
              {pillars.map((pillar) => (
                <div 
                  key={pillar.number}
                  className="bg-card border border-border rounded-xl p-4 shadow-card"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {pillar.number}
                    </span>
                    <div>
                      <h4 className="font-heading font-bold text-foreground mb-1">
                        {pillar.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 rounded-lg px-8">
                <Link to="/about" className="flex items-center gap-2">
                  LEARN MORE ABOUT MARAGA
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 rounded-lg px-8">
                <Link to="/pillars" className="flex items-center gap-2">
                  CAMPAIGNS PILLARS
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;
