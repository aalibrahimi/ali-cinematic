"use client";

import Spline from "@splinetool/react-spline";
import { Component, useEffect, useState, type ReactNode } from "react";

/**
 * Hero3D — Spline scene with pre-flight URL check + error boundary.
 *
 * The Spline runtime has a known issue where invalid scene URLs
 * cause it to throw a synchronous "Data read, but end of buffer not
 * reached" error when it tries to parse a 403/404 HTML response as
 * binary. That error escapes the component's onError prop and
 * crashes the React tree.
 *
 * We solve this two ways:
 *   1. Pre-flight HEAD fetch — verify the scene URL returns 200
 *      before mounting <Spline>. If non-200, render our own error UI
 *      and never mount the runtime.
 *   2. Class-based error boundary — backup safety net if the runtime
 *      crashes for any other reason.
 *
 * IMPORTANT — the SCENE_URL below is the community file ID raw,
 * which Spline returns 403 for. Community files don't auto-serve
 * .splinecode — you have to clone the file into your account and
 * export from THERE to get a working URL.
 *
 * Workflow to get a working URL:
 *
 *   1. Open https://app.spline.design — sign in (free)
 *   2. Open the source community file:
 *      https://app.spline.design/community/file/bdbc84fd-3666-4d9e-8cad-b843bf5660ee
 *   3. Top-right → click "Save a copy" or "Remix" — this creates a
 *      copy in YOUR account under a new hash
 *   4. (Optional) Re-theme materials to your brand color
 *   5. Top-right → "Export" → tab "Code" → choose "React"
 *   6. Copy the URL Spline shows in the snippet — looks like:
 *      https://prod.spline.design/{NEW_HASH}/scene.splinecode
 *   7. Paste it into SCENE_URL below
 *
 * Until that's done, the hero will show a clear error message
 * pointing you back to this workflow.
 */

const SCENE_URL =
  "https://prod.spline.design/ZnnI99UDOV8ynRJ8/scene.splinecode";

export function Hero3D() {
  const [status, setStatus] = useState<"checking" | "ok" | "fail">(
    "checking"
  );

  // Pre-flight — verify the URL is reachable before letting Spline
  // try to parse it. HEAD avoids downloading the full scene just
  // for the check.
  useEffect(() => {
    let cancelled = false;
    fetch(SCENE_URL, { method: "HEAD" })
      .then((r) => {
        if (cancelled) return;
        setStatus(r.ok ? "ok" : "fail");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("fail");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {status === "checking" && <CheckingState />}
      {status === "fail" && <FailState />}
      {status === "ok" && (
        <SplineErrorBoundary fallback={<FailState />}>
          <Spline
            scene={SCENE_URL}
            style={{ width: "100%", height: "100%" }}
          />
        </SplineErrorBoundary>
      )}
    </div>
  );
}

/* ─── Loading state ──────────────────────────────────────────── */

function CheckingState() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <p className="text-xs font-mono text-[var(--color-ink-3)] tracking-widest opacity-50">
        VERIFYING SCENE URL…
      </p>
    </div>
  );
}

/* ─── Error state ────────────────────────────────────────────── */

function FailState() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-10">
      <div className="max-w-md text-center px-6 py-8 rounded-2xl bg-[var(--color-surface)]/80 border border-red-500/30 backdrop-blur-md">
        <p className="text-xs font-mono text-red-400 tracking-widest mb-3">
          · SCENE URL INVALID
        </p>
        <p className="text-sm text-[var(--color-ink-2)] leading-relaxed mb-4">
          The Spline placeholder URL returns 403. To get a working
          one:
        </p>
        <ol className="text-xs text-[var(--color-ink-2)] text-left space-y-2 leading-relaxed">
          <li>
            <span className="text-[var(--color-accent)] font-mono mr-2">
              01
            </span>
            Sign into{" "}
            <a
              href="https://app.spline.design"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] underline"
            >
              app.spline.design
            </a>
          </li>
          <li>
            <span className="text-[var(--color-accent)] font-mono mr-2">
              02
            </span>
            Open the community scene, click{" "}
            <span className="font-mono text-[var(--color-ink)]">
              Save a copy
            </span>
          </li>
          <li>
            <span className="text-[var(--color-accent)] font-mono mr-2">
              03
            </span>
            Top-right →{" "}
            <span className="font-mono text-[var(--color-ink)]">
              Export
            </span>{" "}
            → Code → React
          </li>
          <li>
            <span className="text-[var(--color-accent)] font-mono mr-2">
              04
            </span>
            Copy the URL, paste into{" "}
            <span className="font-mono text-[var(--color-ink)]">
              SCENE_URL
            </span>{" "}
            in Hero3D.tsx
          </li>
        </ol>
      </div>
    </div>
  );
}

/* ─── Error boundary ─────────────────────────────────────────── */

interface BoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface BoundaryState {
  hasError: boolean;
}

class SplineErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false };

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("[Hero3D] Spline runtime crashed:", error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
