import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation, useNavigate, useSearch } from "@tanstack/react-router";

import type { RecipeSearch } from "@/models/content";
import { checkAppVersion } from "@/lib/versioning";
import { ensureSearchIndex } from "@/lib/search/search-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ThemeMode = "warm" | "warm-noir";

export const SiteLayout = (props: Readonly<{ children: ReactNode }>) => {
  const search = useSearch({
    from: "/recipes/",
    shouldThrow: false,
  }) as RecipeSearch;

  const [query, setQuery] = useState(search?.search ?? "");
  const [theme, setTheme] = useState<ThemeMode>("warm");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setQuery(search?.search ?? "");
  }, [search?.search]);

  useEffect(() => {
    void ensureSearchIndex();
  }, []);

  useEffect(() => {
    const nextPath = `${location.pathname}${location.searchStr ?? ""}`;
    void checkAppVersion(nextPath);
  }, [location.pathname, location.searchStr]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedTheme = window.localStorage.getItem("website-theme");
    if (storedTheme === "warm" || storedTheme === "warm-noir") {
      setTheme(storedTheme);
      return;
    }

    setTheme("warm");
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    window.localStorage.setItem("website-theme", theme);
  }, [theme]);

  const debouncedNavigate = useMemo(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return (value: string) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        const trimmed = value.trim();

        if (!trimmed) {
          void navigate({
            to: "/recipes",
            search: () => ({}),
            replace: Boolean(search?.search),
          });
          return;
        }

        void navigate({
          to: "/recipes",
          search: () => ({
            search: trimmed,
          }),
          replace: Boolean(search?.search),
        });
      }, 150);
    };
  }, [navigate, search?.search]);

  const toggleTheme = () => {
    setTheme((value) => (value === "warm" ? "warm-noir" : "warm"));
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-[2000px] pb-12">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[color:var(--color-border)]/35 bg-[color:var(--color-background)]/75 px-[5%] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1400px] items-center gap-4 py-4">
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight text-[color:var(--color-primary)]"
            activeProps={{
              className: "text-2xl font-bold tracking-tight text-[color:var(--color-primary)]",
            }}
          >
            Wizard Food
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              to="/"
              activeProps={{
                className:
                  "border-b-2 border-[color:var(--color-primary)] pb-1 text-[color:var(--color-primary)]",
              }}
              className="text-sm font-medium text-[color:var(--color-foreground)]/85 transition-colors hover:text-[color:var(--color-primary)]"
            >
              Home
            </Link>
            <Link
              to="/recipes"
              activeProps={{
                className:
                  "border-b-2 border-[color:var(--color-primary)] pb-1 text-[color:var(--color-primary)]",
              }}
              className="text-sm font-medium text-[color:var(--color-foreground)]/85 transition-colors hover:text-[color:var(--color-primary)]"
            >
              Recipes
            </Link>
          </nav>

          <div className="ml-auto flex w-full max-w-[430px] items-center gap-2 sm:w-auto">
            <Input
              value={query}
              onChange={(event) => {
                const value = event.target.value;
                setQuery(value);
                debouncedNavigate(value);
              }}
              placeholder="Search recipes..."
              aria-label="Search recipes"
              className="bg-[color:var(--color-surface)]/90 pl-4"
            />
            <Button
              type="button"
              variant="ghost"
              size="small"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="shrink-0 rounded-full border border-[color:var(--color-border)]/60"
            >
              {theme === "warm" ? "Noir" : "Warm"}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1400px] px-[5%] pt-28">{props.children}</main>
    </div>
  );
};
