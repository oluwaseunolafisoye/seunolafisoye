import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/lib/data";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const Projects = () => {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useGSAP(
    () => {
      const section = containerRef.current!;
      const track = trackRef.current!;

      gsap.from(".project-reveal", {
        scrollTrigger: {
          trigger: section,
          start: "top bottom-=100",
          toggleActions: "play none none reverse",
        },
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      });

      // Pin the section and turn vertical scroll into horizontal travel of the
      // track. Skipped for reduced motion, where the track scrolls natively.
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // How far the track travels so its last card lands on the right edge
        // of the page container.
        const getDistance = () =>
          Math.max(0, track.scrollWidth - section.clientWidth);

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${getDistance()}`,
              pin: true,
              // Lenis already smooths the scroll; a lagging scrub would let the
              // pin release before the track has finished moving.
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          .to(track, { x: () => -getDistance() })
          .fromTo(progressRef.current, { scaleX: 0 }, { scaleX: 1 }, 0);
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      id="work"
      ref={containerRef}
      className="py-32 motion-safe:py-0 motion-safe:pt-20 motion-safe:h-svh flex flex-col justify-center"
    >
      <div className="flex justify-between items-end gap-6 mb-16 motion-safe:mb-10 md:motion-safe:mb-16">
        <h2 className="project-reveal text-4xl md:text-6xl font-heading font-medium tracking-tight">
          Selected projects
        </h2>

        <div className="project-reveal hidden sm:block motion-reduce:hidden w-32 md:w-48 h-px mb-3 bg-secondary-foreground/15 overflow-hidden">
          <div
            ref={progressRef}
            className="h-full w-full bg-secondary-foreground origin-left scale-x-0"
          />
        </div>
      </div>

      {/* The track overflows the page container; the layout clips it at the
          page edges, so cards slide in from and out to the screen edges. */}
      <div className="motion-reduce:overflow-x-auto motion-reduce:pb-4">
        <div ref={trackRef} className="flex w-max gap-4 will-change-transform">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              onClick={() =>
                project.id &&
                !project.inProgress &&
                navigate(`/project/${project.id}`)
              }
              className={cn(
                "project-reveal group w-[82vw] sm:w-[60vw] md:w-[26rem] lg:w-[30rem] h-[min(60svh,460px)] shrink-0 bg-secondary p-2 rounded-[28px] text-secondary-foreground flex flex-col",
                project.inProgress
                  ? "opacity-50 grayscale cursor-default"
                  : "cursor-pointer",
              )}
            >
              <div className="overflow-hidden rounded-[20px] mb-2 relative flex-1 min-h-0">
                <img
                  src={project.projectImage}
                  alt={project.title}
                  draggable={false}
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
      </div>
    </section>
  );
};
