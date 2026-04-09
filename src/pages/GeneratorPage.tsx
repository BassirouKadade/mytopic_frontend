import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePresentationStore } from "../store/presentationStore";
import { ArrowLeft, Layers, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GeneratorPage() {
  const [topic, setTopic] = useState("");
  const navigate = useNavigate();
  const { loading, error, generate } = usePresentationStore();

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    await generate(topic.trim());
    const { presentation } = usePresentationStore.getState();
    if (presentation) {
      navigate("/presentation");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="size-4" />
            Retour
          </Button>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <Layers className="size-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">MyTopic</span>
          </div>
          <div className="w-20" />
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="w-full max-w-xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold tracking-tight">
              Quel est votre sujet ?
            </h1>
            <p className="text-sm text-muted-foreground">
              Decrivez votre sujet et notre IA generera vos slides automatiquement.
            </p>
          </div>

          {/* Input card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-lg space-y-5">
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ex : L'intelligence artificielle dans la sante..."
              rows={4}
              disabled={loading}
              className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary/50 transition-all disabled:opacity-50"
            />

            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="w-full py-6 rounded-xl text-sm shadow-md shadow-primary/20 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Generation en cours...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Generer la presentation
                </>
              )}
            </Button>

            {error && (
              <div className="px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-xl">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>

          {/* Hints */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Le changement climatique",
              "Introduction au Machine Learning",
              "Strategie marketing digital",
            ].map((hint) => (
              <button
                key={hint}
                onClick={() => setTopic(hint)}
                disabled={loading}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-50 cursor-pointer"
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
