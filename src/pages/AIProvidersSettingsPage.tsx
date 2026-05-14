import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  FlaskConical,
  Plus,
  Save,
  Server,
  Settings2,
  ShieldCheck,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { AppLogo } from "@/components/AppLogo";
import { UserProfileMenu } from "@/components/auth/UserProfileMenu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  createAIProvider,
  deleteAIProvider,
  listAIProviders,
  setDefaultAIProvider,
  testAIProvider,
  updateAIProvider,
  type AIProviderConfig,
  type AIProviderConfigPayload,
  type ProviderType,
} from "@/services/api";

const providerLabels: Record<ProviderType, string> = {
  openai: "OpenAI",
  ollama: "Ollama",
  openai_compatible: "OpenAI compatible",
  custom: "Custom self-hosted",
};

const emptyForm: AIProviderConfigPayload = {
  providerName: "",
  providerType: "openai_compatible",
  baseUrl: "",
  apiKey: "",
  modelName: "",
  temperature: 0.85,
  maxTokens: 5000,
  timeoutMs: 90000,
  isActive: true,
};

function toForm(config: AIProviderConfig): AIProviderConfigPayload {
  return {
    providerName: config.providerName,
    providerType: config.providerType,
    baseUrl: config.baseUrl,
    apiKey: "",
    modelName: config.modelName,
    temperature: config.temperature,
    maxTokens: config.maxTokens,
    timeoutMs: config.timeoutMs,
    isActive: config.isActive,
    isDefault: config.isDefault,
  };
}

export default function AIProvidersSettingsPage() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<AIProviderConfig[]>([]);
  const [form, setForm] = useState<AIProviderConfigPayload>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const editingProvider = useMemo(
    () => providers.find((item) => item.id === editingId) ?? null,
    [editingId, providers],
  );

  async function refresh() {
    setLoading(true);
    try {
      setProviders(await listAIProviders());
    } catch {
      toast.error("Impossible de charger les providers IA.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  function updateForm<K extends keyof AIProviderConfigPayload>(
    key: K,
    value: AIProviderConfigPayload[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit(config: AIProviderConfig) {
    setEditingId(config.id);
    setForm(toForm(config));
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        baseUrl:
          form.providerType === "openai" && !form.baseUrl
            ? undefined
            : form.baseUrl,
        apiKey: form.apiKey?.trim() || undefined,
      };
      if (editingId) {
        await updateAIProvider(editingId, payload);
        toast.success("Provider mis a jour.");
      } else {
        await createAIProvider(payload);
        toast.success("Provider ajoute.");
      }
      resetForm();
      await refresh();
    } catch (err: unknown) {
      const message =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { detail?: string } } }).response
          ?.data?.detail === "string"
          ? (err as { response: { data: { detail: string } } }).response.data
              .detail
          : "Verifier les champs du formulaire.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleTest(config: AIProviderConfig) {
    setBusyId(config.id);
    try {
      const result = await testAIProvider(config.id);
      toast.success(result.message);
      await refresh();
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { message?: string } } })
        .response?.data;
      toast.error(data?.message || "Le test de connexion a echoue.");
      await refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function handleDefault(config: AIProviderConfig) {
    setBusyId(config.id);
    try {
      await setDefaultAIProvider(config.id);
      toast.success("Provider defini par defaut.");
      await refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(config: AIProviderConfig) {
    setBusyId(config.id);
    try {
      await deleteAIProvider(config.id);
      if (editingId === config.id) resetForm();
      toast.success("Provider supprime.");
      await refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/50 bg-background/90 px-6 backdrop-blur-xl md:px-10">
        <button
          onClick={() => navigate("/generate")}
          className="flex items-center"
        >
          <AppLogo />
        </button>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate("/generate")}>
            Retour
          </Button>
          <UserProfileMenu />
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_420px]">
        <section className="space-y-5">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Settings2 className="size-4" />
              Settings
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              AI Providers
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Configurez OpenAI, Ollama, LM Studio ou toute API compatible
              OpenAI. Les cles sont chiffrees cote serveur et ne sont jamais
              renvoyees au navigateur.
            </p>
          </div>

          <Alert className="border-amber-200 bg-amber-50 text-amber-950">
            <Server className="size-4" />
            <AlertTitle>Ollama, LM Studio et localhost</AlertTitle>
            <AlertDescription className="text-amber-900">
              Sur Vercel ou tout hebergeur distant, localhost designe le
              serveur, pas la machine de l'utilisateur. Fournissez une URL
              reseau accessible par le serveur, par exemple
              http://10.0.0.45:11434, ou deployez l'app dans le reseau client.
            </AlertDescription>
          </Alert>

          {loading ? (
            <div className="flex h-56 items-center justify-center rounded-lg border border-border/60">
              <Spinner className="size-5" />
            </div>
          ) : providers.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/70 p-10 text-center">
              <Server className="mx-auto mb-3 size-8 text-muted-foreground/50" />
              <p className="font-medium">Aucun provider configure.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Ajoutez votre premier provider pour activer le mode Private AI.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {providers.map((config) => (
                <article
                  key={config.id}
                  className="rounded-lg border border-border/70 bg-card p-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <button
                      onClick={() => startEdit(config)}
                      className="min-w-0 text-left"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-base font-semibold">
                          {config.providerName}
                        </h2>
                        {config.isActive ? (
                          <Badge variant="secondary">
                            <CheckCircle2 className="size-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                        {config.isDefault && (
                          <Badge>
                            <Star className="size-3" />
                            Default
                          </Badge>
                        )}
                        {config.lastError && (
                          <Badge variant="destructive">
                            <XCircle className="size-3" />
                            Error
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                        <span>{providerLabels[config.providerType]}</span>
                        <span>{config.modelName}</span>
                        <span>{config.baseUrl || "OpenAI default URL"}</span>
                        <span>
                          Key {config.hasApiKey ? "configured" : "not set"}
                        </span>
                      </div>
                      {config.lastError && (
                        <p className="mt-2 text-xs text-destructive">
                          {config.lastError}
                        </p>
                      )}
                    </button>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTest(config)}
                        disabled={busyId === config.id}
                      >
                        {busyId === config.id ? (
                          <Spinner className="size-4" />
                        ) : (
                          <FlaskConical className="size-4" />
                        )}
                        Test
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDefault(config)}
                        disabled={busyId === config.id || config.isDefault}
                      >
                        <Star className="size-4" />
                        Set default
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(config)}
                        disabled={busyId === config.id}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-border/70 bg-card p-5"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">
                  {editingProvider ? "Modifier le provider" : "Add provider"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {editingProvider
                    ? "Laissez la cle vide pour conserver la cle actuelle."
                    : "Ajoutez une configuration LLM utilisable par defaut."}
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                <Plus className="size-4" />
                New
              </Button>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="providerName">Provider name</Label>
                <Input
                  id="providerName"
                  value={form.providerName}
                  onChange={(event) =>
                    updateForm("providerName", event.target.value)
                  }
                  required
                  placeholder="Acme Private LLM"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="providerType">Provider type</Label>
                <select
                  id="providerType"
                  value={form.providerType}
                  onChange={(event) =>
                    updateForm("providerType", event.target.value as ProviderType)
                  }
                  className="h-10 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  {Object.entries(providerLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="baseUrl">Base URL</Label>
                <Input
                  id="baseUrl"
                  value={form.baseUrl || ""}
                  onChange={(event) => updateForm("baseUrl", event.target.value)}
                  placeholder={
                    form.providerType === "ollama"
                      ? "http://10.0.0.45:11434"
                      : "https://api.example.com"
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="apiKey">API key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={form.apiKey || ""}
                  onChange={(event) => updateForm("apiKey", event.target.value)}
                  placeholder={
                    editingProvider?.hasApiKey ? "Key already configured" : "sk-..."
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="modelName">Model name</Label>
                <Input
                  id="modelName"
                  value={form.modelName}
                  onChange={(event) => updateForm("modelName", event.target.value)}
                  required
                  placeholder={
                    form.providerType === "ollama" ? "llama3" : "gpt-4.1"
                  }
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    type="number"
                    min="0"
                    max="2"
                    step="0.05"
                    value={form.temperature}
                    onChange={(event) =>
                      updateForm("temperature", Number(event.target.value))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maxTokens">Max tokens</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    min="1"
                    value={form.maxTokens}
                    onChange={(event) =>
                      updateForm("maxTokens", Number(event.target.value))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timeoutMs">Timeout ms</Label>
                  <Input
                    id="timeoutMs"
                    type="number"
                    min="1000"
                    value={form.timeoutMs}
                    onChange={(event) =>
                      updateForm("timeoutMs", Number(event.target.value))
                    }
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(form.isActive)}
                  onChange={(event) => updateForm("isActive", event.target.checked)}
                  className="size-4"
                />
                Active
              </label>

              <Button type="submit" disabled={saving} className="w-full">
                {saving ? <Spinner className="size-4" /> : <Save className="size-4" />}
                {editingProvider ? "Save changes" : "Add provider"}
              </Button>

              <div className="flex items-start gap-2 rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                Les prompts et cles API ne sont pas logs. Le backend journalise
                uniquement l'identifiant provider, le type et le statut.
              </div>
            </div>
          </form>
        </aside>
      </main>
    </div>
  );
}
