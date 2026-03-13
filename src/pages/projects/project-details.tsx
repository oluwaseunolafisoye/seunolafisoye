import { PROJECTS } from "@/lib/data";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useParams, useNavigate, Link } from "react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const project = PROJECTS.find((p) => p.id === id);
  const containerRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const onBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (descriptionRef.current) {
      setIsOverflowing(
        descriptionRef.current.scrollHeight >
          descriptionRef.current.clientHeight,
      );
    }
  }, [project?.description]);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".details-animate", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
      });

      tl.from(
        ".image-animate",
        {
          y: 50,
          opacity: 0,
          duration: 1.2,
          scale: 0.95,
        },
        "-=0.5",
      );
    },
    { scope: containerRef },
  );

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <button onClick={onBack} className="text-primary hover:underline">
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <section
      ref={containerRef}
      className="min-h-screen text-foreground px-6 max-w-360 mx-auto mt-32 mb-10"
    >
      <Button
        onClick={onBack}
        className="details-animate group flex items-center gap-2 mb-12 px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
      >
        <ArrowLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform text-primary"
        />
        <span className="font-medium text-primary">Back</span>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
        <div className="lg:col-span-2">
          <h1 className="details-animate text-4xl md:text-6xl font-heading font-medium tracking-tight leading-tight mb-6">
            {project.title} — {project.category}
          </h1>
        </div>

        <div className="lg:col-span-1 space-y-12">
          <div className="details-animate">
            <p
              ref={descriptionRef}
              className={cn(
                "text-lg text-muted-foreground leading-relaxed",
                !isExpanded ? "line-clamp-5" : "",
              )}
            >
              {project.description}
            </p>
            {isOverflowing && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary hover:underline mt-2 text-sm font-medium cursor-pointer"
              >
                {isExpanded ? "Read less" : "Read more"}
              </button>
            )}
          </div>

          <div className="details-animate space-y-8 grid grid-cols-2">
            <div>
              <h3 className="text-sm text-muted-foreground mb-2 font-medium uppercase tracking-wider">
                Year
              </h3>
              <p className="text-xl font-medium">{project.year}</p>
            </div>
            {!project.isPersonal && (
              <div>
                <h3 className="text-sm text-muted-foreground mb-2 font-medium uppercase tracking-wider">
                  Client
                </h3>
                <p className="text-xl font-medium">{project.client}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm text-muted-foreground mb-2 font-medium uppercase tracking-wider">
                Website
              </h3>
              <Link
                to={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-medium underline decoration-muted-foreground/50 hover:decoration-primary transition-colors"
              >
                {new URL(project.href).hostname}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Link to={project.href} target="_blank" rel="noopener noreferrer">
        <div className="image-animate w-full overflow-hidden bg-secondary p-2 rounded-[28px] border border-border/50 shadow">
          <img
            src={project.projectImage}
            alt={project.title}
            className="w-full h-auto object-cover rounded-[20px]"
          />
        </div>
      </Link>
    </section>
  );
};
