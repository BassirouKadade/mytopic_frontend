import { useState, useRef, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Layers,
  Sparkles,
  CheckCircle2,
  PlayCircle,
  Plus,
  X,
  Image as ImageIcon,
  FileText,
  Zap,
  Quote,
  Type,
  LayoutGrid,
  Download,
  Share2,
  Wand2,
  ListChecks,
  PanelsTopLeft,
  Activity,
  Mail,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ═══════════════════════════════════════════════════════════════
   ACETERNITY-STYLE COMPONENTS (inlined, copy-paste pattern)
   ═══════════════════════════════════════════════════════════════ */

/* ─── Spotlight (animated radial light beam) ─── */
const Spotlight = ({
  className,
  fill = "var(--primary)",
}: {
  className?: string;
  fill?: string;
}) => (
  <svg
    className={cn(
      "animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-0",
      className,
    )}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 3787 2842"
    fill="none"
  >
    <g filter="url(#filter)">
      <ellipse
        cx="1924.71"
        cy="273.501"
        rx="1924.71"
        ry="273.501"
        transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
        fill={fill}
        fillOpacity="0.18"
      />
    </g>
    <defs>
      <filter
        id="filter"
        x="0.860352"
        y="0.838989"
        width="3785.16"
        height="2840.26"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur" />
      </filter>
    </defs>
  </svg>
);

/* ─── Background Beams (subtle SVG paths) ─── */
const BackgroundBeams = ({ className }: { className?: string }) => {
  const paths = [
    "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
    "M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867",
    "M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859",
    "M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851",
    "M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843",
    "M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835",
    "M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827",
    "M-331 -245C-331 -245 -263 160 201 287C665 414 733 819 733 819",
    "M-324 -253C-324 -253 -256 152 208 279C672 406 740 811 740 811",
  ];

  return (
    <div
      className={cn(
        "absolute inset-0 -z-0 overflow-hidden pointer-events-none [mask-image:radial-gradient(50%_50%_at_50%_50%,black,transparent)]",
        className,
      )}
    >
      <svg
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke={`url(#beam-grad-${i})`}
            strokeOpacity="0.4"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
        <defs>
          {paths.map((_, i) => (
            <linearGradient
              key={i}
              id={`beam-grad-${i}`}
              x1="0"
              y1="0"
              x2="100%"
              y2="0"
            >
              <stop stopColor="var(--primary)" stopOpacity="0" />
              <stop offset="0.5" stopColor="var(--primary)" />
              <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
      </svg>
    </div>
  );
};

/* ─── Background Boxes (Aceternity — grille skew 3D, hover primary) ─── */
const BackgroundBoxes = ({ className }: { className?: string }) => {
  const rows = 22;
  const cols = 40;
  return (
    <div
      className={cn(
        "absolute inset-0 z-0 overflow-hidden pointer-events-none",
        className,
      )}
      style={{
        maskImage:
          "radial-gradient(ellipse 85% 65% at 50% 45%, black 30%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 85% 65% at 50% 45%, black 30%, transparent 100%)",
      }}
    >
      <div
        className="absolute -top-[20%] -left-[15%] flex pointer-events-auto"
        style={{
          transform: "skewX(-28deg) skewY(8deg) scale(1.35)",
          transformOrigin: "top left",
        }}
      >
        {Array.from({ length: cols }).map((_, j) => (
          <div key={j} className="flex flex-col shrink-0">
            {Array.from({ length: rows }).map((_, i) => (
              <div
                key={i}
                className="w-16 h-8 border-l border-t border-background/[0.07] hover:bg-primary/25 transition-colors duration-150 relative"
              >
                {/* Plus icon at every 2nd intersection (Aceternity signature) */}
                {i % 2 === 0 && j % 2 === 0 && (
                  <svg
                    className="absolute -top-[3px] -left-[3px] size-1.5 text-background/20"
                    viewBox="0 0 6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path d="M3 0v6M0 3h6" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Hero Highlight (Aceternity-style — fond blanc encadré + animation) ─── */
const Highlight = ({
  children,
  delay = 0.4,
}: {
  children: ReactNode;
  delay?: number;
}) => (
  <motion.span
    initial={{ backgroundSize: "0% 100%" }}
    animate={{ backgroundSize: "100% 100%" }}
    transition={{ duration: 1.4, ease: "easeInOut", delay }}
    style={{
      backgroundImage:
        "linear-gradient(to right, var(--background), var(--background))",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "left center",
      display: "inline-block",
      WebkitBoxDecorationBreak: "clone",
      boxDecorationBreak: "clone",
    }}
    className="relative inline-block px-2.5 py-0.5 rounded-md text-foreground"
  >
    {children}
  </motion.span>
);

/* ─── Card with cursor-following spotlight ─── */
const SpotlightCard = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn(
        "group relative rounded-2xl border border-border/60 bg-card overflow-hidden transition-colors hover:border-primary/30",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, color-mix(in oklch, var(--primary) 14%, transparent), transparent 60%)`,
        }}
      />
      {children}
    </div>
  );
};

/* ─── Infinite Moving Cards (Aceternity-style marquee) ─── */
const InfiniteMovingCards = ({
  items,
  speed = 40,
  className,
}: {
  items: ReactNode[];
  speed?: number;
  className?: string;
}) => (
  <div
    className={cn(
      "relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]",
      className,
    )}
  >
    <div
      className="flex w-max gap-8 animate-marquee-x"
      style={{ ["--marquee-duration" as string]: `${speed}s` }}
    >
      {[...items, ...items].map((item, i) => (
        <div key={i} className="shrink-0">
          {item}
        </div>
      ))}
    </div>
  </div>
);

/* ─── Background Gradient (animated rotating border) ─── */
const BackgroundGradient = ({
  children,
  className,
  containerClassName,
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}) => (
  <div className={cn("relative p-[1.5px] rounded-2xl group", containerClassName)}>
    <div
      className="absolute inset-0 rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity"
      style={{
        background:
          "conic-gradient(from var(--angle, 0deg), var(--primary), var(--chart-2), var(--accent), var(--chart-3), var(--primary))",
        animation: "border-spin 6s linear infinite",
      }}
    />
    <style>{`@property --angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }`}</style>
    <div className={cn("relative rounded-2xl bg-card", className)}>
      {children}
    </div>
  </div>
);

/* ─── Tracing Beam (vertical line that fills as you scroll) ─── */
const TracingBeam = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const seen = Math.min(
        Math.max(window.innerHeight - rect.top, 0),
        total,
      );
      setProgress(Math.min(1, seen / total));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "absolute left-1/2 top-0 -translate-x-1/2 hidden md:block w-px",
        className,
      )}
      style={{ height: "100%" }}
    >
      <div className="absolute inset-0 bg-border/60" />
      <div
        className="absolute inset-x-0 top-0 bg-gradient-to-b from-primary via-primary/70 to-primary/0 transition-[height] duration-200"
        style={{ height: `${progress * 100}%` }}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MOCKUPS
   ═══════════════════════════════════════════════════════════════ */

const HeroAppMockup = () => (
  <div className="relative rounded-2xl border border-border bg-card shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] overflow-hidden">
    {/* Browser chrome */}
    <div className="flex items-center gap-2 px-5 py-3 bg-muted/40 border-b border-border/60">
      <div className="flex gap-1.5">
        <div className="size-2.5 rounded-full bg-muted-foreground/30" />
        <div className="size-2.5 rounded-full bg-muted-foreground/30" />
        <div className="size-2.5 rounded-full bg-muted-foreground/30" />
      </div>
      <div className="flex-1 mx-auto max-w-md">
        <div className="h-6 bg-background/80 rounded-md border border-border/60 flex items-center justify-center">
          <span className="text-[10px] font-mono text-muted-foreground/60">
            mytopic.app/presentation/q4-strategy
          </span>
        </div>
      </div>
      <div className="size-6 rounded-md bg-primary/15 flex items-center justify-center">
        <Sparkles className="size-3 text-primary" />
      </div>
    </div>

    <div className="flex h-[400px] sm:h-[480px]">
      <div className="hidden sm:flex w-16 flex-col items-center gap-3 border-r border-border/60 bg-muted/20 py-4">
        {[Layers, Plus, ImageIcon, LayoutGrid].map((Icon, i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col items-center gap-1 px-1 py-2 rounded-lg w-12",
              i === 0
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground/60",
            )}
          >
            <Icon className="size-4" />
          </div>
        ))}
      </div>

      <div className="flex-1 bg-muted/15 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60 bg-background/50">
          <div className="flex items-center gap-2">
            <div className="text-xs font-medium text-foreground">
              Q4 Strategy Review
            </div>
            <div className="size-1 rounded-full bg-primary" />
            <div className="text-[10px] text-muted-foreground">Saved 2s ago</div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-6 px-2 rounded-md border border-border/60 flex items-center">
              <span className="text-[10px] font-mono text-muted-foreground">
                100%
              </span>
            </div>
            <div className="h-6 px-2 rounded-md bg-primary text-primary-foreground flex items-center gap-1">
              <Share2 className="size-3" />
              <span className="text-[10px] font-medium">Share</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="relative w-full max-w-2xl aspect-[16/9] bg-background rounded-lg border border-border/60 shadow-md overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-chart-2 to-primary/30" />

            <div className="h-full p-6 sm:p-10 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary">
                  Section · 03
                </div>
                <div className="text-lg sm:text-2xl font-semibold tracking-tight text-foreground leading-tight">
                  Why MyTopic compounds your team's{" "}
                  <span className="italic text-primary">narrative velocity</span>.
                </div>
                <div className="space-y-1.5 mt-3">
                  {[4, 3, 2.5].map((w, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="size-1 rounded-full bg-primary mt-1.5" />
                      <div
                        className="h-1.5 bg-foreground/15 rounded"
                        style={{ width: `${w * 18}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <div className="h-1 w-12 rounded bg-primary/40" />
                  <div className="h-1 w-8 rounded bg-foreground/10" />
                </div>
                <div className="font-mono text-[10px] text-muted-foreground/70">
                  03 / 12
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-3 border-t border-border/60 bg-background/40 overflow-hidden">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <div
              key={n}
              className={cn(
                "shrink-0 w-16 aspect-[16/9] rounded-md border bg-background flex flex-col justify-between p-1.5",
                n === 3
                  ? "border-primary ring-1 ring-primary/30"
                  : "border-border/60",
              )}
            >
              <div className="h-0.5 w-3/5 rounded-full bg-foreground/40" />
              <div className="font-mono text-[7px] text-muted-foreground">
                {String(n).padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */

const Eyebrow = ({
  children,
  invert,
}: {
  children: ReactNode;
  invert?: boolean;
}) => (
  <p
    className={cn(
      "font-mono text-[11px] uppercase tracking-[0.2em] font-semibold",
      invert ? "text-primary" : "text-primary",
    )}
  >
    {children}
  </p>
);

const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  invert,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  invert?: boolean;
}) => (
  <motion.div
    className="space-y-4 text-center mx-auto max-w-2xl"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-80px" }}
    variants={stagger}
  >
    {eyebrow && (
      <motion.div variants={fadeUp}>
        <Eyebrow invert={invert}>{eyebrow}</Eyebrow>
      </motion.div>
    )}
    <motion.h2
      variants={fadeUp}
      custom={1}
      className={cn(
        "text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.02em] leading-[1.1]",
        invert ? "text-background" : "text-foreground",
      )}
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p
        variants={fadeUp}
        custom={2}
        className={cn(
          "text-base sm:text-lg leading-relaxed",
          invert ? "text-background/70" : "text-muted-foreground",
        )}
      >
        {subtitle}
      </motion.p>
    )}
  </motion.div>
);

const LogoWordmark = ({ name }: { name: string }) => (
  <span className="text-[15px] font-semibold tracking-tight text-foreground/35 hover:text-foreground/80 transition-colors duration-300 whitespace-nowrap">
    {name}
  </span>
);

/* ─── FAQ Item ─── */
const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border/60 bg-card hover:border-border transition-colors">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
      >
        <span className="text-sm sm:text-base font-medium text-foreground">
          {q}
        </span>
        <Plus
          className={cn(
            "size-4 text-muted-foreground shrink-0 transition-transform duration-300",
            open && "rotate-45",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function HomePage() {
  const navigate = useNavigate();
  const [announceOpen, setAnnounceOpen] = useState(true);

  const logoNames = [
    "Stripe", "Linear", "Notion", "Vercel", "Figma", "Rippling",
    "Lattice", "BCG", "Loom", "Ramp", "Datadog", "Retool",
  ];

  const testimonials = [
    {
      q: "Nous sommes passés de 6 heures à 12 minutes pour préparer un deck hebdo. Les exports sont propres au point d'aller au comex.",
      n: "Sarah Chen",
      r: "Directrice Sales Enablement · Rippling",
    },
    {
      q: "Enfin un outil IA qui ne produit pas du n'importe quoi. La structure est vraiment éditoriale.",
      n: "Marc Faucher",
      r: "Senior Partner · BCG",
    },
    {
      q: "Nous utilisons MyTopic pour chaque update de levée. Les investisseurs croient qu'on a une équipe design.",
      n: "Yacine Benkirane",
      r: "CEO · Lattice",
    },
    {
      q: "Les 27 modèles couvrent 95% de ce qu'un consultant senior produit en un an.",
      n: "Priya Raman",
      r: "Engagement Manager · McKinsey",
    },
    {
      q: "J'ai livré mon deck Série B en un après-midi. On a closé trois semaines plus tard.",
      n: "Tomás Aguilar",
      r: "Fondateur · Mira",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      {/* ─────────── Announcement Bar ─────────── */}
      {announceOpen && (
        <div className="bg-accent text-accent-foreground border-b border-accent-foreground/10">
          <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between gap-4 text-[11px]">
            <div className="flex-1" />
            <div className="flex items-center gap-2 font-mono uppercase tracking-[0.18em]">
              <span className="px-1.5 py-0.5 rounded bg-accent-foreground/10 text-[10px]">
                NOUVEAU
              </span>
              <span className="hidden sm:inline">
                MyTopic v2 · Le Studio d'images IA est disponible
              </span>
              <span className="sm:hidden">v2 · Studio d'images IA</span>
              <a className="hidden sm:inline-flex items-center gap-1 ml-2 font-semibold hover:underline cursor-pointer">
                Lire l'annonce
                <ArrowRight className="size-3" />
              </a>
            </div>
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => setAnnounceOpen(false)}
                className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                aria-label="Dismiss"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────── Navbar ─────────── */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-10">
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/25">
                <Layers className="size-4.5 text-primary-foreground" />
              </div>
              <span className="text-[17px] font-bold tracking-tight">
                MyTopic
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-7">
              {[
                { label: "Fonctionnalités", id: "features" },
                { label: "Modèles", id: "features" },
                { label: "Tarifs", id: "pricing" },
                { label: "Clients", id: "customers" },
                { label: "Docs", id: "features" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    document
                      .getElementById(item.id)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hidden sm:inline-flex"
              onClick={() => navigate("/auth")}
            >
              Se connecter
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/auth")}
              className="rounded-lg px-3.5 h-9 shadow-sm shadow-primary/25 cursor-pointer font-semibold"
            >
              Commencer
              <ArrowRight className="size-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </nav>

      {/* ─────────── HERO — Dark + Background Boxes Aceternity ─────────── */}
      <section className="relative px-6 pt-12 pb-20 md:pt-16 md:pb-24 overflow-hidden bg-foreground text-background">
        {/* Background Boxes (grille skew 3D Aceternity, hover primary) */}
        <BackgroundBoxes />

        {/* Spotlight + Beams par-dessus */}
        <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" />
        <BackgroundBeams />

        {/* Ambient amber blurs (au-dessus des boxes pour adoucir) */}
        <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
          <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full bg-primary/[0.10] blur-[140px]" />
          <div className="absolute top-[20%] right-[5%] w-[400px] h-[400px] rounded-full bg-primary/[0.06] blur-[100px]" />
        </div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center space-y-5 md:space-y-6"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-background/5 border border-background/15 rounded-full text-background/80 backdrop-blur-sm">
              <Sparkles className="size-3.5 text-primary" />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] font-semibold">
                Studio d'images IA · v2.4
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-[32px] sm:text-[44px] lg:text-[56px] font-extrabold tracking-[-0.035em] leading-[1.08] max-w-3xl mx-auto text-background"
          >
            Votre <Highlight delay={0.5}>idée</Highlight> mérite
            <br />
            un <Highlight delay={1.0}>deck</Highlight> parfait.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-sm sm:text-base text-background/65 max-w-md mx-auto leading-relaxed"
          >
            Saisissez un sujet. L'IA structure, rédige et exporte.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="group relative h-12 px-7 rounded-xl text-sm font-semibold shadow-lg shadow-primary/40 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/50 hover:scale-[1.015]"
            >
              Commencer — c'est gratuit
              <ArrowRight className="size-4 ml-1.5 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <button className="group h-12 inline-flex items-center gap-2 px-5 rounded-xl border border-background/20 bg-background/5 backdrop-blur hover:bg-background/10 transition-colors cursor-pointer">
              <span className="relative size-7 rounded-full bg-primary/15 flex items-center justify-center">
                <PlayCircle className="size-4 text-primary" />
              </span>
              <span className="text-sm font-medium text-background">
                Voir la démo (90s)
              </span>
            </button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={4}
            className="flex items-center justify-center gap-2 text-sm text-background/60"
          >
            <CheckCircle2 className="size-4 text-primary" />
            Sans carte bancaire · Inscription email en 12 secondes
          </motion.div>
        </motion.div>

        <motion.div
          className="relative z-10 mt-16 md:mt-20 max-w-6xl mx-auto px-2"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease }}
        >
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-b from-primary/15 via-accent/30 to-transparent rounded-[32px] blur-3xl -z-10" />
            <HeroAppMockup />
          </div>
        </motion.div>
      </section>

      {/* ─────────── Logo Cloud (Infinite Moving Cards) ─────────── */}
      <section className="border-y border-border/40 py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 text-center mb-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            La confiance de 18 000+ équipes — du consultant indépendant aux Fortune 500
          </p>
        </div>
        <InfiniteMovingCards
          speed={50}
          items={logoNames.map((n) => (
            <LogoWordmark name={n} />
          ))}
        />
      </section>

      {/* ─────────── Bento Features Grid ─────────── */}
      <section id="features" className="px-6 py-24 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="LA PLATEFORME"
            title={
              <>
                Tout ce qu'il faut pour livrer un deck —{" "}
                <span className="italic font-serif font-medium text-primary">
                  et rien de superflu.
                </span>
              </>
            }
            subtitle="Un ensemble délibéré d'outils éditoriaux — génération, édition, partage, export — pensés pour rester calmes, rapides et fidèles à votre marque."
          />

          <motion.div
            className="mt-14 grid grid-cols-1 md:grid-cols-12 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            {/* Card 1 — large 7×2 */}
            <motion.div variants={fadeUp} className="md:col-span-7 md:row-span-2">
              <SpotlightCard className="p-8 h-full">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-5">
                  <Wand2 className="size-4.5" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight mb-2">
                  Une IA qui comprend vraiment la structure.
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-md">
                  Génération en mode plan d'abord. Titre, sections et
                  messages-clés sont construits avant le contenu — votre deck
                  se lit comme rédigé par un consultant senior.
                </p>
                <div className="rounded-xl border border-border/60 bg-muted/30 p-4 font-mono text-[12px] space-y-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                    <div className="flex gap-1.5">
                      <div className="size-2 rounded-full bg-muted-foreground/30" />
                      <div className="size-2 rounded-full bg-muted-foreground/30" />
                      <div className="size-2 rounded-full bg-muted-foreground/30" />
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      mytopic — génération
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    <span className="text-primary">›</span> générer{" "}
                    <span className="text-foreground">
                      "Récit de levée Série B"
                    </span>
                  </div>
                  <div className="text-muted-foreground/80">
                    <span className="text-primary">✓</span> Structuration des
                    sections{" "}
                    <span className="text-foreground">·</span> 12 slides
                  </div>
                  <div className="text-muted-foreground/80">
                    <span className="text-primary">✓</span> Sélection des
                    modèles{" "}
                    <span className="text-foreground">·</span> KPI · Roadmap ·
                    Citation
                  </div>
                  <div className="text-muted-foreground/80">
                    <span className="text-primary">✓</span> Rédaction des notes
                    du présentateur
                  </div>
                  <div className="text-foreground">
                    <span className="text-primary">↳</span> Terminé en{" "}
                    <span className="font-semibold">1,42s</span>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Card 2 — 5×1 — 27 templates */}
            <motion.div variants={fadeUp} custom={1} className="md:col-span-5">
              <SpotlightCard className="p-7">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <LayoutGrid className="size-4.5" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight mb-1.5">
                  27 modèles éditoriaux
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  Couverture, KPI, Chronologie, Matrice, Feuille de route,
                  Q&amp;R — sélectionnés automatiquement selon l'intention.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[16/10] rounded-md border border-border/60 bg-muted/30 p-2 flex flex-col justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="h-0.5 w-3/5 rounded-full bg-foreground/40" />
                        <div className="h-0.5 w-2/5 rounded-full bg-foreground/15" />
                      </div>
                      <div
                        className={cn(
                          "h-2 rounded",
                          i % 3 === 0 && "bg-primary/30",
                          i % 3 === 1 && "bg-foreground/15",
                          i % 3 === 2 && "bg-accent w-3/4",
                        )}
                      />
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Card 3 — 5×1 — Native PPTX & PDF */}
            <motion.div variants={fadeUp} custom={2} className="md:col-span-5">
              <SpotlightCard className="p-7">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Download className="size-4.5" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight mb-1.5">
                  Export natif PPTX &amp; PDF
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  Éditable, prêt à être marqué, utilisable hors-ligne. À
                  transmettre sans rien casser.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5 flex items-center gap-2">
                    <FileText className="size-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">
                      deck.pdf
                    </span>
                    <CheckCircle2 className="size-3.5 text-primary ml-auto" />
                  </div>
                  <div className="flex-1 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5 flex items-center gap-2">
                    <FileText className="size-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">
                      deck.pptx
                    </span>
                    <CheckCircle2 className="size-3.5 text-primary ml-auto" />
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Card 4 — 4×1 — AI Image Studio */}
            <motion.div variants={fadeUp} className="md:col-span-4">
              <SpotlightCard className="p-6">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <ImageIcon className="size-4.5" />
                </div>
                <h3 className="text-base font-semibold tracking-tight mb-1">
                  Studio d'images IA
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Générez exactement ce que vous avez en tête.
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    "from-chart-1/40 via-accent to-chart-3/30",
                    "from-chart-2/40 via-primary/20 to-chart-4/30",
                    "from-accent via-primary/15 to-chart-2/30",
                    "from-chart-3/40 via-accent/60 to-chart-5/40",
                  ].map((g, i) => (
                    <div
                      key={i}
                      className={cn(
                        "aspect-square rounded-md bg-gradient-to-br border border-border/60",
                        g,
                      )}
                    />
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Card 5 — 4×1 — Live canvas editor */}
            <motion.div variants={fadeUp} custom={1} className="md:col-span-4">
              <SpotlightCard className="p-6">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <PanelsTopLeft className="size-4.5" />
                </div>
                <h3 className="text-base font-semibold tracking-tight mb-1">
                  Éditeur canvas en direct
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Déplacez, redimensionnez, restylisez — l'expérience Figma.
                </p>
                <div className="space-y-1.5">
                  {[
                    { k: "⌘ C", v: "Copier l'élément" },
                    { k: "⌘ V", v: "Coller" },
                    { k: "↑ ↓", v: "Redimensionner" },
                  ].map((s) => (
                    <div
                      key={s.k}
                      className="flex items-center justify-between text-xs"
                    >
                      <kbd className="font-mono px-1.5 py-0.5 rounded bg-muted border border-border/60 text-[10px] text-foreground">
                        {s.k}
                      </kbd>
                      <span className="text-muted-foreground">{s.v}</span>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Card 6 — 4×1 — Public share */}
            <motion.div variants={fadeUp} custom={2} className="md:col-span-4">
              <SpotlightCard className="p-6">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Share2 className="size-4.5" />
                </div>
                <h3 className="text-base font-semibold tracking-tight mb-1">
                  Liens de partage publics
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Un lien. Toute audience.
                </p>
                <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex items-center gap-2">
                  <div className="size-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-mono text-[11px] text-foreground truncate">
                    mytopic.app/p/q4-strategy
                  </span>
                </div>
              </SpotlightCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─────────── The Editor — warm cream bg ─────────── */}
      <section className="relative px-6 py-24 md:py-32 bg-accent/30 border-y border-accent-foreground/10 overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full bg-primary/[0.06] blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="L'ÉDITEUR"
            title={
              <>
                Un canvas pensé pour les{" "}
                <span className="italic font-serif font-medium text-primary">
                  conteurs
                </span>
                , pas pour les designers.
              </>
            }
            subtitle="Modèles, éléments, uploads. Barre d'outils contextuelle flottante. Sauvegarde automatique. Notes du présentateur. Tout est là où vous l'attendez."
          />

          <motion.div
            className="mt-14 max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/[0.08] rounded-3xl blur-2xl -z-10" />
              <HeroAppMockup />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────── AI Engine + Image Studio (unified) ─────────── */}
      <section className="px-6 py-24 md:py-32 bg-background">
        <div className="max-w-6xl mx-auto space-y-24">
          {/* Block 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
              className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
            >
              <div className="space-y-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                  Plan IA · Généré
                </div>
                <div className="space-y-2.5">
                  {[
                    { n: "01", t: "Couverture · Récit Série B" },
                    { n: "02", t: "État des lieux · KPI T3" },
                    { n: "03", t: "Ce qui fonctionne · 3 preuves" },
                    { n: "04", t: "Feuille de route · 18 prochains mois" },
                    { n: "05", t: "La demande · 24M$ Série B" },
                    { n: "06", t: "Notes du présentateur · Générées" },
                  ].map((r, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center gap-3 py-2 border-b border-border/40 last:border-0",
                        i === 5 && "opacity-60",
                      )}
                    >
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {r.n}
                      </span>
                      <CheckCircle2 className="size-3.5 text-primary" />
                      <span className="text-sm text-foreground">{r.t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
              className="space-y-5"
            >
              <Eyebrow>MOTEUR IA</Eyebrow>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] leading-[1.1]">
                Entraînée sur la structure des{" "}
                <span className="italic font-serif font-medium text-primary">
                  grands decks.
                </span>
              </h2>
              <ul className="space-y-3 pt-2">
                {[
                  {
                    icon: ListChecks,
                    t: "Génération en mode plan",
                    d: "Titre, sections, messages-clés avant tout contenu.",
                  },
                  {
                    icon: LayoutGrid,
                    t: "Slides conscientes du format",
                    d: "Tableaux, comparaisons, KPI, chronologies auto-sélectionnés.",
                  },
                  {
                    icon: Type,
                    t: "Conservation de la voix",
                    d: "Les notes respectent votre ton et tempo.",
                  },
                ].map((r, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="shrink-0 size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mt-0.5">
                      <r.icon className="size-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        {r.t}
                      </div>
                      <div className="text-sm text-muted-foreground">{r.d}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Block 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
              className="space-y-5 order-2 lg:order-1"
            >
              <Eyebrow>STUDIO D'IMAGES IA</Eyebrow>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] leading-[1.1]">
                Arrêtez de chercher des stocks. Générez{" "}
                <span className="italic font-serif font-medium text-primary">
                  exactement
                </span>{" "}
                ce que vous voulez.
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Photographie éditoriale, schémas techniques, textures abstraites
                — générés en quelques secondes, sauvegardés en favoris, déposés
                sur une slide en un clic.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
              className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm order-1 lg:order-2"
            >
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3 mb-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
                  Prompt
                </div>
                <div className="text-sm text-foreground italic font-serif">
                  "Panneaux solaires sur un fjord norvégien, style photo éditoriale"
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "from-chart-1/40 via-accent to-chart-3/30",
                  "from-chart-2/40 via-primary/20 to-chart-4/30",
                  "from-accent via-primary/15 to-chart-2/30",
                  "from-chart-3/40 via-accent/60 to-chart-5/40",
                ].map((g, i) => (
                  <div
                    key={i}
                    className={cn(
                      "aspect-[4/3] rounded-lg bg-gradient-to-br border border-border/60 relative overflow-hidden",
                      g,
                    )}
                  >
                    <button className="absolute top-2 right-2 size-6 rounded-md bg-background/80 backdrop-blur flex items-center justify-center">
                      <Star className="size-3 text-primary fill-primary" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────── Workflow with Tracing Beam ─────────── */}
      <section className="relative px-6 py-24 md:py-32 bg-muted/30 border-y border-border/40 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="PARCOURS"
            title={
              <>
                De l'idée au deck investisseur —{" "}
                <span className="italic font-serif font-medium text-primary">
                  sans friction.
                </span>
              </>
            }
          />

          <div className="relative mt-14">
            <TracingBeam className="hidden lg:block" />
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              {[
                {
                  n: "01",
                  t: "Saisissez votre sujet",
                  d: "Quelques mots suffisent à l'IA.",
                  icon: Type,
                },
                {
                  n: "02",
                  t: "L'IA construit un plan",
                  d: "Sections, slides, notes du présentateur.",
                  icon: Sparkles,
                },
                {
                  n: "03",
                  t: "Éditez & personnalisez",
                  d: "Déplacez, restylisez, régénérez.",
                  icon: PanelsTopLeft,
                },
                {
                  n: "04",
                  t: "Partagez ou exportez",
                  d: "Lien public · PDF · PPTX.",
                  icon: Share2,
                },
              ].map((s, i) => (
                <motion.div key={s.n} variants={fadeUp} custom={i}>
                  <SpotlightCard className="p-6 h-full">
                    <div className="font-mono text-[11px] tracking-[0.2em] text-primary mb-4">
                      {s.n}
                    </div>
                    <div className="size-10 rounded-lg bg-accent/60 text-accent-foreground flex items-center justify-center mb-4">
                      <s.icon className="size-4.5" />
                    </div>
                    <h3 className="text-base font-semibold tracking-tight mb-1">
                      {s.t}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {s.d}
                    </p>
                  </SpotlightCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────── Performance Stats — DARK SECTION ─────────── */}
      <section className="relative px-6 py-20 md:py-24 bg-foreground text-background overflow-hidden">
        {/* Dark beams */}
        <div className="absolute inset-0 -z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-primary/[0.10] blur-[100px]" />
        </div>
        <div
          className="absolute inset-0 -z-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            color: "white",
            maskImage:
              "radial-gradient(ellipse 80% 50% at 50% 50%, black 30%, transparent 100%)",
          }}
        />

        <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { v: "1,4s", l: "Temps moyen de génération" },
            { v: "99,97%", l: "Disponibilité SLA" },
            { v: "27", l: "Modèles éditoriaux" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease }}
              className="space-y-2"
            >
              <div className="font-mono text-5xl sm:text-6xl font-extrabold tracking-tight text-primary">
                {s.v}
              </div>
              <div className="text-sm text-background/70">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─────────── Pricing ─────────── */}
      <section id="pricing" className="px-6 py-24 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="TARIFS"
            title={
              <>
                Simple. Honnête.{" "}
                <span className="italic font-serif font-medium text-primary">
                  Sans surprises.
                </span>
              </>
            }
            subtitle="Commencez gratuitement, à vie. Passez au supérieur uniquement quand votre équipe dépasse quelques decks."
          />

          <motion.div
            className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            {[
              {
                name: "Gratuit",
                price: "0€",
                cycle: "à vie",
                cta: "Démarrer gratuitement",
                ctaVariant: "outline" as const,
                features: [
                  "5 decks",
                  "Exports avec filigrane",
                  "50 images IA / mois",
                  "Liens de partage publics",
                  "Support communautaire",
                ],
                highlight: false,
              },
              {
                name: "Pro",
                price: "19€",
                cycle: "par mois",
                cta: "Essai 14 jours",
                ctaVariant: "default" as const,
                features: [
                  "Decks illimités",
                  "Exports marqués (PDF · PPTX)",
                  "Images IA illimitées",
                  "Génération des notes",
                  "Support prioritaire",
                ],
                highlight: true,
              },
              {
                name: "Entreprise",
                price: "Sur mesure",
                cycle: "annuel",
                cta: "Contacter les ventes",
                ctaVariant: "outline" as const,
                features: [
                  "Espaces personnalisés",
                  "CSM dédié",
                  "DPA · Contrats sur mesure",
                  "Modèles personnalisés",
                  "Infrastructure prioritaire",
                ],
                highlight: false,
              },
            ].map((p, i) => {
              const cardInner = (
                <div className="p-7 flex flex-col h-full">
                  {p.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-[0.18em] font-bold shadow-md shadow-primary/30">
                        <Sparkles className="size-3" />
                        Le plus populaire
                      </span>
                    </div>
                  )}
                  <div className="mb-5">
                    <div className="text-sm font-semibold text-foreground mb-2">
                      {p.name}
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-extrabold tracking-tight">
                        {p.price}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        / {p.cycle}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground/85">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={p.ctaVariant}
                    size="default"
                    className={cn(
                      "w-full h-10 rounded-xl font-semibold cursor-pointer",
                      p.highlight && "shadow-md shadow-primary/25",
                    )}
                    onClick={() => navigate("/auth")}
                  >
                    {p.cta}
                    <ArrowRight className="size-3.5 ml-1" />
                  </Button>
                </div>
              );

              return (
                <motion.div
                  key={p.name}
                  variants={fadeUp}
                  custom={i}
                  className="relative"
                >
                  {p.highlight ? (
                    <BackgroundGradient containerClassName="h-full">
                      {cardInner}
                    </BackgroundGradient>
                  ) : (
                    <div className="relative rounded-2xl border border-border/60 bg-card h-full">
                      {cardInner}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─────────── Testimonials — Infinite Moving Cards ─────────── */}
      <section
        id="customers"
        className="px-6 py-24 md:py-32 bg-muted/30 border-y border-border/40"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="ADOPTÉ PAR LES OPÉRATIONNELS"
            title={
              <>
                Ce que disent les{" "}
                <span className="italic font-serif font-medium text-primary">
                  équipes.
                </span>
              </>
            }
          />

          <div className="mt-14">
            <InfiniteMovingCards
              speed={60}
              items={testimonials.map((t) => (
                <div className="w-[340px] sm:w-[400px] rounded-2xl border border-border/60 bg-card p-6 border-l-2 border-l-primary/40 flex flex-col">
                  <Quote className="size-5 text-primary/30 mb-3" />
                  <p className="font-serif italic text-[15px] text-foreground leading-relaxed mb-5 flex-1">
                    "{t.q}"
                  </p>
                  <div className="pt-4 border-t border-border/40 flex items-center gap-3">
                    <div className="size-9 rounded-full bg-gradient-to-br from-primary/30 via-accent to-chart-3/30 flex items-center justify-center text-sm font-bold text-foreground">
                      {t.n[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate">
                        {t.n}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {t.r}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            />
          </div>
        </div>
      </section>

      {/* ─────────── FAQ ─────────── */}
      <section className="px-6 py-24 md:py-32 bg-background">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            eyebrow="FAQ"
            title={
              <>
                Vos questions,{" "}
                <span className="italic font-serif font-medium text-primary">
                  nos réponses.
                </span>
              </>
            }
          />
          <motion.div
            className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            {[
              {
                q: "En quoi MyTopic se distingue de Gamma ou Tome ?",
                a: "MyTopic est éditorial avant tout. Nous générons un plan structuré avant tout contenu, vos decks se lisent comme rédigés par un consultant senior.",
              },
              {
                q: "L'IA utilise-t-elle mes données pour s'entraîner ?",
                a: "Non. Nous utilisons les API OpenAI avec rétention désactivée, et nous n'utilisons jamais votre contenu pour entraîner un modèle — ni le nôtre, ni celui de quiconque.",
              },
              {
                q: "Puis-je exporter en PowerPoint et continuer à éditer ?",
                a: "Oui. Notre export PPTX produit des slides natives, entièrement éditables — chaque zone de texte, forme et image est accessible dans PowerPoint ou Keynote.",
              },
              {
                q: "Quelles langues l'IA supporte-t-elle ?",
                a: "Plus de 30 langues nativement, dont français, anglais, espagnol, allemand, italien, portugais, arabe, mandarin et japonais.",
              },
              {
                q: "Comment fonctionne le Studio d'images IA ?",
                a: "Saisissez un prompt, obtenez une image, sauvegardez-la en favori, déposez-la sur une slide — c'est aussi rapide qu'une recherche stock, mais sur mesure.",
              },
              {
                q: "Existe-t-il une offre gratuite ?",
                a: "Oui — 5 decks, 50 images IA par mois, exports avec filigrane. Aucune carte bancaire, jamais.",
              },
            ].map((f, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <FaqItem q={f.q} a={f.a} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─────────── Final CTA — Background Gradient ─────────── */}
      <section className="relative px-6 py-24 md:py-32 bg-accent/40 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.10] rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/60 rounded-full blur-[80px]" />
        </div>

        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
        >
          <BackgroundGradient containerClassName="rounded-3xl">
            <div className="rounded-3xl px-8 py-20 md:px-16 md:py-24 text-center bg-card">
              <div className="space-y-7">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05]">
                  Votre prochain deck est à{" "}
                  <span className="font-serif italic font-medium text-primary">
                    un prompt.
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Rejoignez 18 000+ équipes qui livrent des decks dont elles
                  sont fières.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Button
                    size="lg"
                    onClick={() => navigate("/auth")}
                    className="group h-12 px-8 rounded-xl text-sm font-semibold shadow-xl shadow-primary/30 cursor-pointer transition-all hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.015]"
                  >
                    Démarrer gratuitement
                    <ArrowRight className="size-4 ml-1.5 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                  <button className="h-12 inline-flex items-center gap-2 px-5 rounded-xl border border-border bg-background hover:bg-muted/50 transition-colors cursor-pointer text-sm font-medium text-foreground">
                    Réserver une démo (15min)
                    <ArrowUpRight className="size-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="size-4 text-primary" />
                  Sans carte bancaire · 5 decks gratuits à vie
                </div>
              </div>
            </div>
          </BackgroundGradient>
        </motion.div>
      </section>

      {/* ─────────── Footer — DARK GRAPHITE ─────────── */}
      <footer className="bg-foreground text-background px-6 pt-20 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
                  <Layers className="size-4.5 text-primary-foreground" />
                </div>
                <span className="text-base font-bold tracking-tight">
                  MyTopic
                </span>
              </div>
              <p className="text-sm text-background/60 leading-relaxed mb-5 max-w-xs">
                Studio IA éditorial pour les équipes modernes. Conçu avec intention.
              </p>
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-background/50">
                  Recevez les actualités produit
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3 h-10 rounded-lg border border-background/15 bg-background/5">
                    <Mail className="size-3.5 text-background/40" />
                    <input
                      type="email"
                      placeholder="vous@entreprise.com"
                      className="flex-1 bg-transparent text-sm outline-none text-background placeholder:text-background/30"
                    />
                  </div>
                  <Button
                    size="sm"
                    className="h-10 rounded-lg px-3 cursor-pointer"
                  >
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-5">
                {[
                  {
                    l: "Twitter",
                    svg: (
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-3.5"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    ),
                  },
                  {
                    l: "LinkedIn",
                    svg: (
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-3.5"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    ),
                  },
                  {
                    l: "GitHub",
                    svg: (
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-3.5"
                      >
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                    ),
                  },
                ].map(({ l, svg }) => (
                  <a
                    key={l}
                    aria-label={l}
                    className="size-9 rounded-lg border border-background/15 bg-background/5 flex items-center justify-center text-background/60 hover:text-primary hover:border-primary/30 transition-colors cursor-pointer"
                  >
                    {svg}
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                t: "Produit",
                links: ["Fonctionnalités", "Modèles", "Tarifs", "Changelog"],
              },
              {
                t: "Ressources",
                links: ["Documentation", "Centre d'aide", "API", "Statut"],
              },
              {
                t: "Entreprise",
                links: ["À propos", "Clients", "Carrières", "Presse"],
              },
            ].map((col) => (
              <div key={col.t}>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.18em] text-background font-semibold mb-4">
                  {col.t}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a className="text-sm text-background/60 hover:text-background transition-colors cursor-pointer">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-14 pt-7 border-t border-background/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-background/50">
              &copy; {new Date().getFullYear()} MyTopic, Inc. — Conçu avec
              intention à Paris &amp; Casablanca.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-background/60">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-primary" />
              </span>
              <Activity className="size-3" />
              Tous les systèmes opérationnels
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="font-mono text-[10px] tracking-[0.3em] text-background/30 uppercase">
              ─── MyTopic · Studio IA Éditorial · v2.4 ───
            </p>
          </div>
        </div>
      </footer>

      {/* Suppress unused-var warnings without using ESLint comments — Zap reference */}
      <span className="hidden">
        <Zap />
      </span>
    </div>
  );
}
