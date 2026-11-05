
import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import {
  Menu as MenuIcon,
  X,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";

import { ButtonLink, Button } from "../ui/Button.jsx";
import { useSession } from "../../lib/session.jsx";
import { useTheme } from "../../lib/theme.jsx";
import { cx } from "../../lib/cx.js";

const LOGO = "/qrnova-logo.png";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const order = ["system", "light", "dark"];
  const next = order[(order.indexOf(theme) + 1) % order.length];

  const Icon =
    theme === "light"
      ? Sun
      : theme === "dark"
        ? Moon
        : Monitor;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${theme}. Switch to ${next}.`}
      title={`Theme: ${theme}`}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}

const linkClass = ({ isActive }) =>
  cx(
    "rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors",
    isActive
      ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
  );

export function SiteHeader() {
  const { server, user } = useSession();
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const [prevPath, setPrevPath] = useState(location.pathname);

  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/75">
      <div className="mx-auto flex h-14 max-w-[1240px] items-center gap-6 px-4 sm:px-6">

        <Link to="/" aria-label="QRNova home" className="flex items-center">
          <img
            src={LOGO}
            alt="QRNova"
            className="h-9 w-auto max-w-[150px] object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/studio" className={linkClass}>
            Studio
          </NavLink>

          <NavLink to="/docs" className={linkClass}>
            Docs
          </NavLink>

          {server && user && (
            <NavLink to="/app" className={linkClass}>
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />

          {server && !user && (
            <ButtonLink
              to="/login"
              variant="secondary"
              size="sm"
              className="hidden sm:inline-flex"
            >
              Sign in
            </ButtonLink>
          )}

          <ButtonLink
            to="/studio"
            variant="primary"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Create QR code
          </ButtonLink>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X className="h-4 w-4" />
            ) : (
              <MenuIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="animate-fade-in border-t border-zinc-200 px-4 py-3 md:hidden dark:border-zinc-800">
          <div className="flex flex-col gap-1">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>

            <NavLink to="/studio" className={linkClass}>
              QR Studio
            </NavLink>

            <NavLink to="/docs" className={linkClass}>
              Documentation
            </NavLink>

            {server && user && (
              <NavLink to="/app" className={linkClass}>
                Dashboard
              </NavLink>
            )}

            {server && !user && (
              <NavLink to="/login" className={linkClass}>
                Sign in
              </NavLink>
            )}

            <Link
              to="/studio"
              className="mt-2 flex items-center justify-center rounded-lg bg-ember-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ember-600"
            >
              Create QR Code
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800/60">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link to="/" className="inline-flex items-center">
          <img
            src={LOGO}
            alt="QRNova"
            className="h-8 w-auto max-w-[135px] object-contain"
          />
        </Link>

        <nav
          className="flex flex-wrap gap-x-5 gap-y-3 text-sm"
          aria-label="Footer"
        >
          <Link to="/" className="muted hover:text-zinc-100">
            Home
          </Link>

          <Link to="/studio" className="muted hover:text-zinc-100">
            Studio
          </Link>

          <Link to="/docs" className="muted hover:text-zinc-100">
            Documentation
          </Link>

          <Link to="/report" className="muted hover:text-zinc-100">
            Report abuse
          </Link>
        </nav>
      </div>

      <div className="border-t border-zinc-200 py-4 text-center dark:border-zinc-800">
        <p className="muted text-xs">
          © {new Date().getFullYear()} QRNova. Create. Connect. Grow.
        </p>
      </div>
    </footer>
  );
}
