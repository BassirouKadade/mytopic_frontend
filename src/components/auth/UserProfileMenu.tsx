import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/authStore";

function getInitials(displayName: string, email: string): string {
  const source = displayName.trim() || email.trim();
  if (!source) return "U";
  const clean = source.includes("@") ? source.split("@")[0] : source;
  const parts = clean.split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

interface UserProfileMenuProps {
  avatarOnly?: boolean;
}

export function UserProfileMenu({ avatarOnly = false }: UserProfileMenuProps) {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { user, signOut } = useAuthStore();

  const displayName = useMemo(() => {
    if (!user) return "Utilisateur";
    const fromApi = user.display_name?.trim();
    if (fromApi) return fromApi;
    return user.email.split("@")[0] || "Utilisateur";
  }, [user]);

  if (!user) return null;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      navigate("/auth", { replace: true });
    } finally {
      setIsSigningOut(false);
      setIsDialogOpen(false);
    }
  };

  const initials = getInitials(displayName, user.email);

  return (
    <>
      <Menubar
        className={
          avatarOnly
            ? "h-auto border-0 bg-transparent p-0 shadow-none"
            : "h-auto border-border/60 bg-background p-0 shadow-none"
        }
      >
        <MenubarMenu>
          <MenubarTrigger
            className={
              avatarOnly
                ? "rounded-full p-0.5 border border-border/70 bg-background hover:bg-muted/40 focus:bg-muted/40 data-[state=open]:bg-muted/40 cursor-pointer"
                : "rounded-lg px-2 py-1.5 hover:bg-muted/70 cursor-pointer"
            }
          >
            <div className="flex items-center gap-2">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={displayName}
                  className={
                    avatarOnly
                      ? "size-9 rounded-full object-cover"
                      : "size-8 rounded-full object-cover"
                  }
                />
              ) : (
                <div
                  className={
                    avatarOnly
                      ? "flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-semibold"
                      : "flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-semibold"
                  }
                >
                  {initials}
                </div>
              )}
              {!avatarOnly ? (
                <div className="hidden sm:block text-left leading-tight">
                  <p className="text-xs font-semibold text-foreground truncate max-w-36">
                    {displayName}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate max-w-36">
                    {user.email}
                  </p>
                </div>
              ) : null}
            </div>
          </MenubarTrigger>
          <MenubarContent align="end" className="min-w-44">
            <MenubarItem
              variant="destructive"
              onClick={() => setIsDialogOpen(true)}
              className="cursor-pointer"
            >
              <LogOut className="size-4" />
              Se deconnecter
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la deconnexion</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment vous deconnecter de votre session MyTopic ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSigningOut}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner className="size-4" />
                  Deconnexion...
                </span>
              ) : (
                "Se deconnecter"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
