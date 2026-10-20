import type { ReactNode } from "react";
import { faPaw, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "./Icon";

export function CardSkeletons({ n = 4 }: { n?: number }) {
  return (
    <>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-3xl border bg-card shadow-soft">
          <div className="aspect-[4/3] animate-pulse bg-muted" />
          <div className="space-y-2 p-4"><div className="h-5 w-1/2 animate-pulse rounded bg-muted" /><div className="h-4 w-1/3 animate-pulse rounded bg-muted" /></div>
        </div>
      ))}
    </>
  );
}

export function StateBox({ kind, title, text, action }: { kind: "empty" | "error"; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="col-span-full rounded-3xl border bg-card p-10 text-center shadow-soft">
      <span className={`mx-auto grid h-12 w-12 place-items-center rounded-2xl ${kind === "error" ? "bg-destructive/15 text-destructive" : "bg-accent text-accent-foreground"}`}>
        <Icon icon={kind === "error" ? faTriangleExclamation : faPaw} />
      </span>
      <h3 className="mt-4 text-lg font-extrabold">{title}</h3>
      {text && <p className="mt-1 text-sm text-muted-foreground">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
