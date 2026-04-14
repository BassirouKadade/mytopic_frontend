import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FolderHeart, Layers, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserProfileMenu } from "@/components/auth/UserProfileMenu";
import { usePresentationStore } from "@/store/presentationStore";

export default function CollectionsPage() {
  const navigate = useNavigate();
  const { presentations, loading, refreshUserPresentations } =
    usePresentationStore();

  useEffect(() => {
    void refreshUserPresentations();
  }, [refreshUserPresentations]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="h-16 border-b border-border/40 bg-background/90 backdrop-blur-xl px-6 md:px-10 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="size-9 rounded-xl bg-primary flex items-center justify-center">
              <Layers className="size-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold italic tracking-tight">
              MyTopic
            </span>
          </div>
          <div className="h-5 w-px bg-border/40 hidden md:block" />
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <FolderHeart className="size-4" />
            Mes collections
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => navigate("/generate")}>
            <Plus className="size-4" />
            Nouvelle presentation
          </Button>
          <UserProfileMenu avatarOnly />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Toutes mes presentations
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ouvrez une presentation pour reprendre l'edition et la lecture.
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl border border-border/50 bg-card p-6 text-sm text-muted-foreground">
            Chargement des presentations...
          </div>
        ) : presentations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/70 bg-card/60 p-8 text-center">
            <p className="text-muted-foreground">
              Aucune presentation pour le moment.
            </p>
            <Button className="mt-4" onClick={() => navigate("/generate")}>
              Generer votre premiere presentation
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {presentations.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(`/presentation/${item.id}?slide=0`)}
                className="group rounded-xl border border-border/60 bg-card p-4 text-left transition-all hover:border-primary/40 hover:shadow-sm cursor-pointer"
              >
                <p className="font-semibold text-foreground truncate">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  MAJ: {new Date(item.updated_at).toLocaleString()}
                </p>
                <p className="mt-4 text-xs text-primary group-hover:underline">
                  Ouvrir la presentation
                </p>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
