
import { useState } from "react";
import {
  KeyRound,
  Plus,
  Trash2,
  Copy,
  Check,
  Globe,
  ShoppingBag,
  Workflow,
  ShieldCheck,
  Code2,
  AlertTriangle,
  ExternalLink,
  Terminal,
} from "lucide-react";

import { api } from "../../lib/api.js";
import { useAsync } from "../../hooks/useAsync.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import {
  formatDate,
  formatNumber,
  formatRelative,
} from "../../lib/format.js";

import { Button } from "../../components/ui/Button.jsx";
import { Field, Input } from "../../components/ui/Field.jsx";
import {
  Alert,
  EmptyState,
  PageHeader,
  Skeleton,
} from "../../components/ui/misc.jsx";
import {
  ConfirmDialog,
  Dialog,
  useToast,
} from "../../components/ui/overlay.jsx";

function InfoCard({ icon: Icon, title, children }) {
  return (
    <div className="surface rounded-xl p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ember-500/10 text-ember-600 dark:text-ember-400">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-4 text-sm font-semibold">{title}</h3>

      <p className="muted mt-2 text-sm leading-6">{children}</p>
    </div>
  );
}

export default function ApiKeys() {
  useDocumentTitle("API Keys");

  const toast = useToast();

  const {
    data,
    error,
    loading,
    reload,
  } = useAsync(() => api.get("/api-keys"), []);

  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const [secret, setSecret] = useState(null);
  const [copied, setCopied] = useState(false);

  const [revoking, setRevoking] = useState(null);

  const rows = data?.data ?? [];

  const create = async (e) => {
    e?.preventDefault();

    if (!name.trim()) {
      setCreateError("Please enter an application name.");
      return;
    }

    setCreating(true);
    setCreateError(null);

    try {
      const res = await api.post("/api-keys", {
        name: name.trim(),
      });

      if (!res?.key) {
        throw new Error("The server did not return an API key.");
      }

      setSecret(res.key);
      setCreateOpen(false);
      setName("");
      reload();

      toast.success("API key created successfully");
    } catch (err) {
      setCreateError(
        err.fields?.name ?? err.message ?? "Could not create API key."
      );
    } finally {
      setCreating(false);
    }
  };

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      toast.success("API key copied successfully");
    } catch {
      toast.error("Could not copy. Please select and copy the key manually.");
    }
  };

  const closeSecret = () => {
    setSecret(null);
    setCopied(false);
  };

  const revoke = async () => {
    if (!revoking) return;

    try {
      await api.del(`/api-keys/${revoking.id}`);
      toast.success("API key revoked successfully");
      setRevoking(null);
      reload();
    } catch (err) {
      toast.error("Could not revoke API key", {
        description: err.message,
      });
    }
  };

  const curlExample = `curl -X GET "${window.location.origin}/api/v1/qrcodes" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Accept: application/json"`;

  return (
    <div className="space-y-7">

      {/* Heading */}
      <PageHeader
        title="API Keys"
        description="Connect QRNova with your own website, ecommerce store, applications and business software."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setName("");
              setCreateError(null);
              setCreateOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            New key
          </Button>
        }
      />

      {/* Introduction */}
      <section className="relative overflow-hidden rounded-2xl border border-ember-500/20 bg-ember-500/[0.04] p-5 sm:p-7">
        <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-ember-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ember-500/10 text-ember-600 dark:text-ember-400">
            <KeyRound className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Use QRNova in your own applications.
            </h2>

            <p className="muted mt-3 max-w-3xl text-sm leading-7">
              API Keys allow your own software to communicate with QRNova
              through its REST API. Developers can integrate QR generation,
              supported QR management operations and other available
              API features into their existing applications.
            </p>

            <Button
              variant="primary"
              size="sm"
              className="mt-5"
              onClick={() => {
                setName("");
                setCreateError(null);
                setCreateOpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              Generate your API key
            </Button>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            What can you do with QRNova API?
          </h2>

          <p className="muted mt-1 text-sm">
            Connect your existing business tools instead of manually
            managing every QR code.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard icon={Globe} title="Your own website">
            Connect your website backend to QRNova and request QR codes
            directly from your application.
          </InfoCard>

          <InfoCard icon={ShoppingBag} title="Ecommerce integration">
            Generate QR codes for product pages, order pages and
            other supported ecommerce workflows.
          </InfoCard>

          <InfoCard icon={Workflow} title="Business automation">
            Connect QRNova with your software and automate supported
            QR creation and management tasks.
          </InfoCard>

          <InfoCard icon={Code2} title="Developer integration">
            Use authenticated REST API requests to integrate QRNova
            into your own backend.
          </InfoCard>
        </div>
      </section>

      {/* Examples */}
      <section className="surface rounded-xl p-5 sm:p-6">
        <h2 className="text-lg font-semibold">
          Real-world examples
        </h2>

        <div className="mt-5 grid gap-6 md:grid-cols-3">
          <div>
            <ShoppingBag className="h-5 w-5 text-ember-500" />
            <h3 className="mt-3 text-sm font-semibold">
              Online shopping store
            </h3>
            <p className="muted mt-2 text-sm leading-6">
              When a product is added to a store, its backend can
              request a QR code for the product page through QRNova.
            </p>
          </div>

          <div>
            <Globe className="h-5 w-5 text-ember-500" />
            <h3 className="mt-3 text-sm font-semibold">
              Restaurant website
            </h3>
            <p className="muted mt-2 text-sm leading-6">
              A restaurant application can integrate QRNova to
              generate supported links for digital menus.
            </p>
          </div>

          <div>
            <Workflow className="h-5 w-5 text-ember-500" />
            <h3 className="mt-3 text-sm font-semibold">
              Business software
            </h3>
            <p className="muted mt-2 text-sm leading-6">
              Internal applications can connect with QRNova to
              automate supported QR management operations.
            </p>
          </div>
        </div>
      </section>

      {/* API key list */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">
              Your API keys
            </h2>
            <p className="muted mt-1 text-sm">
              Manage the keys used by your connected applications.
            </p>
          </div>

          {data && (
            <span className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
              {rows.length} active keys
            </span>
          )}
        </div>

        {error && (
          <Alert tone="danger">
            {error.message}
          </Alert>
        )}

        {loading && !data ? (
          <Skeleton className="h-40" />
        ) : rows.length === 0 ? (
          <div className="surface rounded-xl">
            <EmptyState
              icon={KeyRound}
              title="No API keys yet"
              description="Create your first key to connect your website, ecommerce application or backend software with QRNova."
              action={
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setCreateOpen(true)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create your first key
                </Button>
              }
            />
          </div>
        ) : (
          <div className="surface overflow-x-auto rounded-xl">
            <table className="w-full min-w-[650px] text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                  <th className="px-4 py-3 font-medium">Application name</th>
                  <th className="px-3 py-3 font-medium">Key prefix</th>
                  <th className="px-3 py-3 text-right font-medium">Requests</th>
                  <th className="px-3 py-3 font-medium">Last used</th>
                  <th className="px-3 py-3 font-medium">Created</th>
                  <th className="px-3 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((key) => (
                  <tr
                    key={key.id}
                    className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/60"
                  >
                    <td className="px-4 py-3 font-medium">
                      {key.name}
                    </td>

                    <td className="px-3 py-3 font-mono text-xs">
                      {key.prefix}…
                    </td>

                    <td className="px-3 py-3 text-right tabular-nums">
                      {formatNumber(key.usage_count)}
                    </td>

                    <td className="muted px-3 py-3">
                      {formatRelative(key.last_used_at)}
                    </td>

                    <td className="muted px-3 py-3">
                      {formatDate(key.created_at)}
                    </td>

                    <td className="px-3 py-3 text-right">
                      <Button
                        size="icon-sm"
                        variant="danger-ghost"
                        aria-label={`Revoke ${key.name}`}
                        title="Revoke API key"
                        onClick={() => setRevoking(key)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Getting started */}
      <section className="surface rounded-xl p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ember-500/10 text-ember-600 dark:text-ember-400">
            <Terminal className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold">
              How to integrate QRNova
            </h2>
            <p className="muted text-sm">
              Follow these steps to connect your own application.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <p className="text-sm font-semibold">
              01. Generate an API key
            </p>
            <p className="muted mt-1 text-sm leading-6">
              Click New Key and enter an application name such as
              My Ecommerce Website.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold">
              02. Save your API key securely
            </p>
            <p className="muted mt-1 text-sm leading-6">
              Copy the complete key when it is generated. Store
              it in your own backend environment variables.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold">
              03. Authenticate API requests
            </p>
            <p className="muted mt-1 text-sm leading-6">
              Send the key in the Authorization header using
              Bearer authentication.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold">
              04. Connect your application
            </p>
            <p className="muted mt-1 text-sm leading-6">
              Use the documented QRNova API endpoints from your
              server-side application.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">
              Example: Read QR codes
            </p>

            <Button
              size="sm"
              variant="secondary"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(curlExample);
                  toast.success("Example copied");
                } catch {
                  toast.error("Could not copy example");
                }
              }}
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </Button>
          </div>

          <pre className="overflow-x-auto rounded-xl bg-zinc-950 p-4 font-mono text-xs leading-6 text-zinc-200">
            <code>{curlExample}</code>
          </pre>

          <p className="muted mt-3 text-xs leading-5">
            Replace YOUR_QRNOVA_DOMAIN with your deployed QRNova
            server address and YOUR_API_KEY with your generated key.
          </p>
        </div>

        <div className="mt-5 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

            <div>
              <p className="text-sm font-semibold">
                Keep your API key private
              </p>

              <p className="muted mt-1 text-xs leading-5">
                Never expose your API key in public frontend JavaScript,
                GitHub repositories or screenshots. Make authenticated
                requests from your own backend. Revoke a key immediately
                if it is exposed.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <a
            href="/api/v1/openapi.yaml"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-ember-600 hover:text-ember-700 dark:text-ember-400"
          >
            Open API specification
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>

      {/* Create dialog */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create an API key"
        description="Give your API key a name so you can identify the connected application."
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              loading={creating}
              disabled={!name.trim()}
              onClick={create}
            >
              <Plus className="h-3.5 w-3.5" />
              Create key
            </Button>
          </>
        }
      >
        <form onSubmit={create}>
          <Field
            label="Application name"
            hint='Example: "My Ecommerce Website" or "Restaurant Software".'
            error={createError}
          >
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setCreateError(null);
              }}
              placeholder="My Ecommerce Website"
              maxLength={80}
              data-autofocus
            />
          </Field>
        </form>
      </Dialog>

      {/* New key shown once */}
      <Dialog
        open={!!secret}
        onClose={closeSecret}
        title="Your new API key"
        description="Copy and securely save this key now. It will not be shown again."
        footer={
          <Button variant="primary" onClick={closeSecret}>
            Done
          </Button>
        }
      >
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <p className="text-xs font-semibold">
            Important security notice
          </p>
          <p className="muted mt-1 text-xs leading-5">
            Save the complete key before closing this window.
            You cannot retrieve the full key later.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-2 pl-3 dark:border-zinc-700 dark:bg-zinc-950">
          <code className="min-w-0 flex-1 break-all font-mono text-xs">
            {secret}
          </code>

          <Button
            size="sm"
            variant="secondary"
            onClick={copySecret}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </Dialog>

      {/* Revoke confirmation */}
      <ConfirmDialog
        open={!!revoking}
        onClose={() => setRevoking(null)}
        title={`Revoke "${revoking?.name}"?`}
        description="Applications using this key will immediately lose API access. This action cannot be undone."
        confirmLabel="Revoke key"
        onConfirm={revoke}
      />
    </div>
  );
}
