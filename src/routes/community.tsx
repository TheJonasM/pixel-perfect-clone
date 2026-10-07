import { createFileRoute } from "@tanstack/react-router";
import { faHeart, faComment, faShareNodes, faImage, faVideo } from "@fortawesome/free-solid-svg-icons";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { POSTS } from "@/lib/data";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Rescue Community — PawFinds" },
      { name: "description", content: "Stories, updates and coordination from rescuers, volunteers and shelters." },
      { property: "og:title", content: "Rescue Community — PawFinds" },
      { property: "og:description", content: "The social feed of the global pet rescue network." },
    ],
  }),
  component: Community,
});

const GROUPS = [
  { name: "Rescuers", members: "24.1k" },
  { name: "Volunteers", members: "54.2k" },
  { name: "Shelters", members: "1.8k" },
];

function Community() {
  return (
    <AppShell>
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-5">
          <div className="rounded-3xl border bg-card p-4 shadow-soft">
            <div className="flex gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-primary-foreground dark:text-navy">YM</span>
              <input placeholder="Share an update with the network…" className="min-w-0 flex-1 rounded-2xl bg-muted px-4 outline-none" />
            </div>
            <div className="mt-3 flex gap-2 pl-13 text-sm text-muted-foreground">
              <button className="rounded-xl px-3 py-1.5 hover:bg-muted"><Icon icon={faImage} className="mr-1.5 text-mint" />Photo</button>
              <button className="rounded-xl px-3 py-1.5 hover:bg-muted"><Icon icon={faVideo} className="mr-1.5 text-coral" />Video</button>
            </div>
          </div>
          {POSTS.map((p) => (
            <article key={p.id} className="overflow-hidden rounded-3xl border bg-card shadow-soft">
              <div className="flex items-center gap-3 p-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-accent font-bold text-accent-foreground">{p.author[0]}</span>
                <div>
                  <div className="font-bold">{p.author}</div>
                  <div className="text-xs text-muted-foreground">{p.group} · {p.time}</div>
                </div>
              </div>
              <p className="px-4 pb-4">{p.text}</p>
              <img src={p.photo} alt="" loading="lazy" className="aspect-video w-full object-cover" />
              <div className="flex gap-1 p-2 text-sm font-semibold text-muted-foreground">
                <button className="rounded-xl px-3 py-2 hover:bg-muted hover:text-coral"><Icon icon={faHeart} className="mr-1.5" />{p.likes.toLocaleString()}</button>
                <button className="rounded-xl px-3 py-2 hover:bg-muted"><Icon icon={faComment} className="mr-1.5" />{p.comments}</button>
                <button className="ml-auto rounded-xl px-3 py-2 hover:bg-muted"><Icon icon={faShareNodes} /></button>
              </div>
            </article>
          ))}
        </div>
        <aside className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Groups</h2>
          {GROUPS.map((g) => (
            <div key={g.name} className="lift flex items-center justify-between rounded-2xl border bg-card p-4 shadow-soft">
              <div><div className="font-bold">{g.name}</div><div className="text-xs text-muted-foreground">{g.members} members</div></div>
              <button className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Join</button>
            </div>
          ))}
        </aside>
      </div>
    </AppShell>
  );
}
