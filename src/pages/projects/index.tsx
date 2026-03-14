import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/lib/data";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

gsap.registerPlugin(ScrollTrigger);

export const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useGSAP(
    () => {
      gsap.from(".project-reveal", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none reverse",
        },
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      });
    },
    { scope: containerRef },
  );

  return (
    <section id="work" className="py-32" ref={containerRef}>
      <div className="flex justify-between items-baseline mb-16">
        <h2 className="project-reveal text-4xl md:text-6xl font-heading font-medium tracking-tight">
          Selected projects
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[400px]">
        {PROJECTS.map((project, index) => (
          <div
            key={index}
            onClick={() =>
              project.id &&
              !project.inProgress &&
              navigate(`/project/${project.id}`)
            }
            className={cn(
              "project-reveal group bg-secondary p-2 rounded-[28px] text-secondary-foreground flex flex-col",
              project.className,
              project.inProgress
                ? "opacity-50 grayscale cursor-default"
                : "cursor-pointer",
            )}
          >
            <div className="overflow-hidden rounded-[20px] mb-2 relative flex-1">
              <img
                src={project.projectImage}
                alt={project.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            <div className="px-2 mb-2 space-y-2">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-sans font-medium group-hover:text-muted-foreground transition-colors mb-2 flex items-center">
                    {project.title}{" "}
                    {project.inProgress && (
                      <span className="italic text-sm text-muted-foreground">
                        — In Progress
                      </span>
                    )}
                  </h3>

                  <div className="text-left">
                    <span className="block text-sm font-sans mb-1 text-secondary-foreground">
                      {project.year}
                    </span>
                  </div>
                </div>

                {!project.isPersonal && (
                  <div className="flex items-center gap-2">
                    {project.clientLogo && (
                      <>
                        <span className="text-xs text-muted-foreground font-sans uppercase">
                          For
                        </span>
                        <Avatar className="size-10 border border-secondary-foreground/10">
                          <AvatarImage
                            src={project.clientLogo}
                            alt={project.client}
                            className={cn(
                              project.clientLogo.includes("desk_logo")
                                ? "p-1"
                                : "",
                              project.clientLogo.includes("my_logo") ||
                                project.clientLogo.includes("desk_logo")
                                ? "dark:invert"
                                : "",
                            )}
                          />

                          {project?.client && (
                            <AvatarFallback className="text-[10px] text-primary font-sans">
                              {project.client.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="text-left">
                <span className="block text-sm text-muted-foreground font-sans">
                  {project.category}
                </span>
              </div>
              <p className="text-muted-foreground text-sm font-sans leading-relaxed line-clamp-2">
                {project.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
