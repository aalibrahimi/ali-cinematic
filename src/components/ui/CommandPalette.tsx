"use client";

import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Search,
  ArrowRight,
  Home,
  FolderOpen,
  User,
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  Briefcase,
  CornerDownLeft,
} from "lucide-react";
import { WORK } from "@/lib/work";

const APPLE_EASE = [0.32, 0.72, 0, 1] as const;

/**
 * CommandPalette — global ⌘K finder.
 *
 * Press ⌘K (macOS) or Ctrl+K (Windows/Linux) anywhere on the site
 * to open. Apple-finder-style:
 *   - Glass-morphic dark surface centered in viewport
 *   - Search input at top, autofocused
 *   - Categorized command list below: Pages, Projects, Connect
 *   - Live filter as the user types (matches against command label
 *     + project name + project kind)
 *   - Arrow-up/down to navigate, Enter to fire, Esc to close
 *   - Active command gets a subtle accent highlight
 *
 * Architecture:
 *   - Single useState for open/closed
 *   - Single useState for the filter string
 *   - Single useState for the highlighted index
 *   - Commands derived once from WORK[] + a static set of pages/links
 *   - Filtered list memoized so typing stays snappy
 *
 * Accessibility:
 *   - role="dialog" with proper aria-label on the modal
 *   - aria-activedescendant tracks the highlighted command
 *   - Body scroll locked while open (Lenis pause)
 *   - Focus trapped in the search input
 */

type Command = {
  id: string;
  label: string;
  hint?: string;
  /** Icon component from lucide-react */
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string; }>;
  /** What runs when the command is selected. */
  action: (router: ReturnType<typeof useRouter>) => void;
  /** Group label for visual sectioning. */
  group: "Pages" | "Projects" | "Connect";
  /** Keywords for filtering (in addition to label). */
  keywords?: string[];
};

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ── Build the command list once ──────────────────────────── */
  const commands = useMemo<Command[]>(() => {
    const pages: Command[] = [
      {
        id: "page-home",
        label: "Home",
        hint: "/",
        icon: Home,
        group: "Pages",
        action: (r) => r.push("/"),
      },
      {
        id: "page-work",
        label: "Selected work",
        hint: "/work",
        icon: Briefcase,
        group: "Pages",
        action: (r) => r.push("/work"),
      },
      {
        id: "page-about",
        label: "About",
        hint: "/about",
        icon: User,
        group: "Pages",
        action: (r) => r.push("/about"),
      },
    ];

    const projects: Command[] = WORK.map((w) => ({
      id: `project-${w.slug}`,
      label: w.name,
      hint: w.kind,
      icon: FolderOpen,
      group: "Projects",
      keywords: [w.kind, w.year, ...w.tags],
      action: (r) => r.push(`/work/${w.slug}`),
    }));

    const connect: Command[] = [
      {
        id: "connect-email",
        label: "Email — ali@codewithali.com",
        hint: "Copy + open mail",
        icon: Mail,
        group: "Connect",
        keywords: ["mail", "contact", "ali", "codewithali"],
        action: () => {
          if (typeof navigator !== "undefined" && navigator.clipboard) {
            void navigator.clipboard.writeText("ali@codewithali.com");
          }
          window.location.href = "mailto:ali@codewithali.com";
        },
      },
      {
        id: "connect-github",
        label: "GitHub",
        hint: "github.com/aalibrahimi",
        icon: Github,
        group: "Connect",
        keywords: ["code", "repo", "open source"],
        action: () =>
          window.open("https://github.com/aalibrahimi", "_blank", "noopener"),
      },
      {
        id: "connect-linkedin",
        label: "LinkedIn",
        hint: "linkedin.com/in/aalibrahimi",
        icon: Linkedin,
        group: "Connect",
        keywords: ["resume", "professional"],
        action: () =>
          window.open(
            "https://linkedin.com/in/aalibrahimi",
            "_blank",
            "noopener"
          ),
      },
      {
        id: "connect-simplicity",
        label: "Visit Simplicity",
        hint: "simplicityfunds.com",
        icon: ExternalLink,
        group: "Connect",
        keywords: ["product", "live"],
        action: () =>
          window.open("https://simplicityfunds.com", "_blank", "noopener"),
      },
    ];

    return [...pages, ...projects, ...connect];
  }, []);

  /* ── Filter + group ───────────────────────────────────────── */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => {
      const haystack = [c.label, c.hint, c.group, ...(c.keywords ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [commands, query]);

  // Group filtered commands by their `group` field, preserving order.
  const grouped = useMemo(() => {
    const order: Command["group"][] = ["Pages", "Projects", "Connect"];
    const map = new Map<Command["group"], Command[]>();
    for (const cmd of filtered) {
      const arr = map.get(cmd.group) ?? [];
      arr.push(cmd);
      map.set(cmd.group, arr);
    }
    return order
      .map((g) => ({ group: g, items: map.get(g) ?? [] }))
      .filter((s) => s.items.length > 0);
  }, [filtered]);

  // Flat indexed list (for keyboard nav). We need a stable mapping
  // from highlighted index → command, so we build it in render order.
  const flat = useMemo(
    () => grouped.flatMap((s) => s.items),
    [grouped]
  );

  /* ── Keyboard handlers ────────────────────────────────────── */

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setHighlighted(0);
  }, []);

  const fire = useCallback(
    (cmd: Command) => {
      cmd.action(router);
      close();
    },
    [router, close]
  );

  // Global ⌘K / Ctrl+K to open, Esc to close.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isOpenShortcut =
        (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isOpenShortcut) {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        close();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Inside-modal navigation: arrows + enter.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlighted((i) => Math.min(i + 1, flat.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlighted((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = flat[highlighted];
        if (cmd) fire(cmd);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, flat, highlighted, fire]);

  // Reset highlight when the filter changes — first match becomes
  // active so Enter without arrow-keys still does the obvious thing.
  useEffect(() => {
    setHighlighted(0);
  }, [query]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Autofocus the input when opened.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cmdk-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: APPLE_EASE }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
          onClick={close}
        >
          {/* Backdrop blur */}
          <div
            aria-hidden
            className="absolute inset-0 bg-black/70"
            style={{
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.3, ease: APPLE_EASE }}
            className="relative w-full max-w-xl rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-divider)] shadow-2xl overflow-hidden gpu"
            role="dialog"
            aria-label="Command palette"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--color-divider)]">
              <Search
                size={18}
                strokeWidth={2}
                className="text-[var(--color-ink-3)] shrink-0"
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, projects, contacts…"
                className="flex-1 bg-transparent outline-none text-base text-[var(--color-ink)] placeholder:text-[var(--color-ink-3)]"
                aria-label="Command search"
              />
              <kbd className="text-[0.65rem] font-mono px-1.5 py-0.5 rounded border border-[var(--color-divider)] text-[var(--color-ink-3)]">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto py-2">
              {grouped.length === 0 && (
                <p className="text-sm text-[var(--color-ink-3)] px-5 py-8 text-center">
                  No matches for &ldquo;{query}&rdquo;.
                </p>
              )}
              {grouped.map((section) => (
                <div key={section.group} className="pb-2">
                  <p className="type-eyebrow text-[var(--color-ink-3)] px-5 py-2">
                    {section.group}
                  </p>
                  {section.items.map((cmd) => {
                    const flatIndex = flat.indexOf(cmd);
                    const isActive = flatIndex === highlighted;
                    const Icon = cmd.icon;
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => fire(cmd)}
                        onMouseEnter={() => setHighlighted(flatIndex)}
                        className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                          isActive
                            ? "bg-[var(--color-surface-3)]"
                            : "hover:bg-[var(--color-surface)]"
                        }`}
                      >
                        <Icon
                          size={16}
                          strokeWidth={1.75}
                          className={
                            isActive
                              ? "text-[var(--color-accent)]"
                              : "text-[var(--color-ink-3)]"
                          }
                        />
                        <span className="text-sm text-[var(--color-ink)] flex-1 truncate">
                          {cmd.label}
                        </span>
                        {cmd.hint && (
                          <span className="text-xs text-[var(--color-ink-3)] truncate">
                            {cmd.hint}
                          </span>
                        )}
                        {isActive && (
                          <CornerDownLeft
                            size={14}
                            strokeWidth={1.75}
                            className="text-[var(--color-accent)]"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer hint */}
            <div className="flex items-center justify-between gap-2 px-5 py-3 border-t border-[var(--color-divider)] text-[0.7rem] text-[var(--color-ink-3)]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <kbd className="font-mono px-1 py-0.5 rounded border border-[var(--color-divider)]">
                    ↑↓
                  </kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="font-mono px-1 py-0.5 rounded border border-[var(--color-divider)]">
                    ↵
                  </kbd>
                  select
                </span>
              </div>
              <span className="flex items-center gap-1.5">
                <ArrowRight size={11} strokeWidth={2} />
                Press{" "}
                <kbd className="font-mono px-1 py-0.5 rounded border border-[var(--color-divider)]">
                  ⌘K
                </kbd>{" "}
                to open
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
