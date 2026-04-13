import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Layers, Lock, Mail } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/authStore";

type AuthMode = "sign-in" | "sign-up";

interface LocationState {
  from?: string;
}

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn, signUp, loading } = useAuthStore();

  const redirectPath = useMemo(() => {
    const state = location.state as LocationState | null;
    return state?.from || "/generate";
  }, [location.state]);

  const isSignUp = mode === "sign-up";

  const validateForm = (): boolean => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error("Veuillez saisir votre email.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      toast.error("Format d'email invalide.");
      return false;
    }

    if (!password.trim()) {
      toast.error("Veuillez saisir votre mot de passe.");
      return false;
    }

    if (isSignUp && password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caracteres.");
      return false;
    }

    return true;
  };

  const getAuthErrorMessage = (error: unknown): string => {
    if (!axios.isAxiosError(error)) {
      return "Une erreur inattendue est survenue. Veuillez reessayer.";
    }

    if (!error.response) {
      return "Impossible de contacter le serveur. Verifiez votre connexion.";
    }

    const detail = error.response.data?.detail;
    if (typeof detail === "string" && detail.trim()) {
      return detail;
    }

    const status = error.response.status;
    if (status === 400 || status === 401) {
      return "Identifiants invalides. Verifiez votre email et votre mot de passe.";
    }
    if (status === 403) {
      return "Acces refuse pour ce compte.";
    }
    if (status === 429) {
      return "Trop de tentatives. Merci de reessayer dans quelques instants.";
    }
    if (status >= 500) {
      return "Erreur serveur. Merci de reessayer plus tard.";
    }

    return "Connexion impossible. Merci de reessayer.";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      if (isSignUp) {
        await signUp({ email: email.trim(), password });
      } else {
        await signIn({ email: email.trim(), password });
      }
      navigate(redirectPath, { replace: true });
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-5 py-8 sm:px-6">
        <Card className="w-full border-border bg-card shadow-none">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary text-primary-foreground">
                <Layers className="size-4" />
              </div>
              <p className="text-xl font-semibold tracking-tight">MyTopic</p>
            </div>

            <div className="flex gap-2 rounded-lg border border-border bg-muted/40 p-1">
              <Button
                type="button"
                variant={isSignUp ? "ghost" : "default"}
                className="flex-1"
                onClick={() => setMode("sign-in")}
              >
                Sign In
              </Button>
              <Button
                type="button"
                variant={isSignUp ? "default" : "ghost"}
                className="flex-1"
                onClick={() => setMode("sign-up")}
              >
                Sign Up
              </Button>
            </div>

            <div className="space-y-1">
              <CardTitle>
                {isSignUp ? "Creer un compte" : "Connexion"}
              </CardTitle>
              <CardDescription>
                {isSignUp
                  ? "Inscription rapide avec email et mot de passe."
                  : "Connectez-vous pour acceder a votre espace."}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className="pl-10 shadow-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete={
                      isSignUp ? "new-password" : "current-password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 caracteres"
                    className="pl-10 shadow-none"
                    minLength={8}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="h-10 w-full" disabled={loading}>
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner className="size-4" />
                    Traitement...
                  </span>
                ) : isSignUp ? (
                  "Creer mon compte"
                ) : (
                  "Se connecter"
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Retour a l'accueil{" "}
                <Link to="/" className="text-primary hover:underline">
                  MyTopic
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
