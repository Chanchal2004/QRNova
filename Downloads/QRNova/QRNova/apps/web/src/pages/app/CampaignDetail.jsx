
import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Plus,
  Megaphone,
  QrCode,
  ChartColumn,
  Target,
  Tag,
  ArrowRight,
  Search,
  CalendarDays,
  Layers,
} from "lucide-react";

import { api } from "../../lib/api.js";
import { useAsync } from "../../hooks/useAsync.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { formatNumber, formatDate } from "../../lib/format.js";

import { Button } from "../../components/ui/Button.jsx";
import { Field, Input, Textarea } from "../../components/ui/Field.jsx";
import {
  Alert,
  EmptyState,
  PageHeader,
  Skeleton,
} from "../../components/ui/misc.jsx";
import { Dialog, useToast } from "../../components/ui/overlay.jsx";

const COLORS = [
  "#2a78d6",
  "#eb6834",
  "#1baf7a",
  "#eda100",
  "#e87ba4",
  "#008300",
  "#4a3aa7",
  "#e34948",
];

function InfoCard({ icon: Icon, title, children }) {
  return (
    <div className="surface rounded-xl p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ember-500/10 text-ember-600 dark:text-ember-400">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-4 text-sm font-semibold">
        {title}
      </h3>

      <p className="muted mt-2 text-sm leading-6">
        {children}
      </p>
    </div>
  );
}

/* Create and edit campaign dialog.
   Export is retained because CampaignDetail.jsx uses CampaignDialog. */
export function CampaignDialog({
  open,
  onClose,
  campaign,
  onSaved,
}) {
  const toast = useToast();

  const [form, setForm] = useState({
    name: campaign?.name ?? "",
    description: campaign?.description ?? "",
    color: campaign?.color ?? COLORS[0],
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e?.preventDefault();

    if (!form.name.trim()) {
      setErrors({
        name: "Please enter a campaign name.",
      });
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        description: form.description.trim(),
      };

      const saved = campaign
        ? await api.patch(`/campaigns/${campaign.id}`, payload)
        : await api.post("/campaigns", payload);

      toast.success(
        campaign
          ? "Campaign updated successfully"
          : "Campaign created successfully"
      );

      onSaved(saved);
      onClose();
    } catch (err) {
      setErrors(
        err.fields && Object.keys(err.fields).length
          ? err.fields
          : { name: err.message || "Could not save campaign." }
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={campaign ? "Edit campaign" : "Create a campaign"}
      description="Give your marketing project a name and organize related QR codes together."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="primary"
            loading={saving}
            disabled={!form.name.trim()}
            onClick={save}
          >
            {campaign ? "Save changes" : "Create campaign"}
          </Button>
        </>
      }
    >
      <form onSubmit={save} className="space-y-5">

        <Field
          label="Campaign name"
          hint="Example: Diwali Sale 2026, New Product Launch or Restaurant Menu."
          error={errors.name}
        >
          <Input
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            maxLength={120}
            placeholder="Diwali Sale 2026"
            data-autofocus
          />
        </Field>

        <Field
          label="Description"
          optional
          hint="Explain the purpose of this campaign so you can identify it easily."
          error={errors.description}
        >
          <Textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            maxLength={500}
            rows={3}
            placeholder="Organize QR codes for our Diwali promotion."
          />
        </Field>

        <fieldset>
          <legend className="mb-2 text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
            Campaign colour
          </legend>

          <p className="muted mb-3 text-xs">
            Choose a colour to identify this campaign in your dashboard.
          </p>

          <div className="flex flex-wrap gap-3">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`Choose colour ${color}`}
                aria-pressed={form.color === color}
                onClick={() =>
                  setForm({ ...form, color })
                }
                className="h-8 w-8 rounded-full ring-offset-2 ring-offset-white transition-shadow aria-pressed:ring-2 aria-pressed:ring-zinc-900 dark:ring-offset-zinc-900 dark:aria-pressed:ring-zinc-100"
                style={{ background: color }}
              />
            ))}
          </div>
        </fieldset>

        <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
          <p className="text-xs font-medium">
            What happens next?
          </p>

          <p className="muted mt-1 text-xs leading-5">
            After creating this campaign, you can select it while creating
            a QR code or assign existing QR codes through their settings.
          </p>
        </div>

      </form>
    </Dialog>
  );
}

export default function Campaigns() {
  useDocumentTitle("Campaigns");

  const {
    data,
    error,
    loading,
    reload,
  } = useAsync(
    () => api.get("/campaigns", { per_page: 100 }),
    []
  );

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const rows = data?.data ?? [];

  const filteredRows = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) return rows;

    return rows.filter((campaign) => {
      return (
        campaign.name?.toLowerCase().includes(search) ||
        campaign.description?.toLowerCase().includes(search)
      );
    });
  }, [rows, query]);

  const totalCodes = rows.reduce(
    (total, campaign) =>
      total + Number(campaign.qr_count || 0),
    0
  );

  const totalScans = rows.reduce(
    (total, campaign) =>
      total + Number(campaign.scan_count || 0),
    0
  );

  return (
    <div className="space-y-7">

      {/* Page heading */}
      <PageHeader
        title="Campaigns"
        description="Organize your QR codes into marketing projects, promotions, events and business activities."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Create campaign
          </Button>
        }
      />

      {/* Campaign introduction */}
      <section className="relative overflow-hidden rounded-2xl border border-ember-500/20 bg-ember-500/[0.04] p-5 sm:p-7">
        <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-ember-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ember-500/10 text-ember-600 dark:text-ember-400">
            <Megaphone className="h-6 w-6" />
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold">
              All your QR marketing projects in one place.
            </h2>

            <p className="muted mt-3 max-w-3xl text-sm leading-7">
              Think of a campaign as a folder for related QR codes.
              Create separate campaigns for product launches, seasonal
              sales, restaurant promotions, events or social media.
              Group related QR codes and understand their performance
              from one place.
            </p>

            <Button
              variant="primary"
              size="sm"
              className="mt-5"
              onClick={() => setOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              Start a new campaign
            </Button>
          </div>
        </div>
      </section>

      {/* How campaigns work */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            How campaigns work
          </h2>

          <p className="muted mt-1 text-sm">
            Organize different QR codes under one marketing activity.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

          <InfoCard icon={Target} title="1. Create a project">
            Name your campaign according to your promotion, event,
            product, business or marketing activity.
          </InfoCard>

          <InfoCard icon={QrCode} title="2. Add QR codes">
            Select this campaign while creating a QR code or assign
            an existing code from its settings.
          </InfoCard>

          <InfoCard icon={ChartColumn} title="3. Review performance">
            Open the campaign to see its associated QR codes and
            the available scan analytics for each code.
          </InfoCard>

        </div>
      </section>

      {/* Use cases */}
      <section className="surface rounded-xl p-5 sm:p-6">
        <h2 className="text-lg font-semibold">
          Campaign examples for your business
        </h2>

        <p className="muted mt-1 text-sm leading-6">
          Here are some ways you can organize QR codes using campaigns.
        </p>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          <div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ember-500/10 text-ember-600 dark:text-ember-400">
              <Tag className="h-4 w-4" />
            </div>

            <h3 className="mt-3 text-sm font-semibold">
              Diwali Sale 2026
            </h3>

            <p className="muted mt-1 text-xs leading-5">
              Group QR codes used on sale posters, discount offers,
              packaging and promotional pages.
            </p>
          </div>

          <div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ember-500/10 text-ember-600 dark:text-ember-400">
              <ShoppingBagIcon />
            </div>

            <h3 className="mt-3 text-sm font-semibold">
              Product Launch
            </h3>

            <p className="muted mt-1 text-xs leading-5">
              Organize QR codes printed on product labels, brochures
              and product information pages.
            </p>
          </div>

          <div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ember-500/10 text-ember-600 dark:text-ember-400">
              <Megaphone className="h-4 w-4" />
            </div>

            <h3 className="mt-3 text-sm font-semibold">
              Social Media Promotion
            </h3>

            <p className="muted mt-1 text-xs leading-5">
              Keep QR codes used across different promotional
              materials organized together.
            </p>
          </div>

          <div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ember-500/10 text-ember-600 dark:text-ember-400">
              <CalendarDays className="h-4 w-4" />
            </div>

            <h3 className="mt-3 text-sm font-semibold">
              Events and Weddings
            </h3>

            <p className="muted mt-1 text-xs leading-5">
              Organize QR codes for invitations, event information,
              registrations and digital pages.
            </p>
          </div>

        </div>
      </section>

      {/* Campaign statistics */}
      {data && rows.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Campaign overview
            </h2>

            <p className="muted mt-1 text-sm">
              A summary of the campaigns currently in your account.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">

            <div className="surface rounded-xl p-5">
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                <Layers className="h-4 w-4" />
                <span className="text-xs font-medium">
                  Total campaigns
                </span>
              </div>

              <p className="mt-3 text-3xl font-semibold tabular-nums">
                {formatNumber(rows.length)}
              </p>

              <p className="muted mt-1 text-xs">
                Marketing projects
              </p>
            </div>

            <div className="surface rounded-xl p-5">
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                <QrCode className="h-4 w-4" />
                <span className="text-xs font-medium">
                  Associated QR codes
                </span>
              </div>

              <p className="mt-3 text-3xl font-semibold tabular-nums">
                {formatNumber(totalCodes)}
              </p>

              <p className="muted mt-1 text-xs">
                Across the listed campaigns
              </p>
            </div>

            <div className="surface rounded-xl p-5">
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                <ChartColumn className="h-4 w-4" />
                <span className="text-xs font-medium">
                  Total scans
                </span>
              </div>

              <p className="mt-3 text-3xl font-semibold tabular-nums">
                {formatNumber(totalScans)}
              </p>

              <p className="muted mt-1 text-xs">
                Combined campaign scan counts
              </p>
            </div>

          </div>
        </section>
      )}

      {/* Campaign list */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">
              Your campaigns
            </h2>

            <p className="muted mt-1 text-sm">
              Open a campaign to manage its QR codes and view details.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            New campaign
          </Button>
        </div>

        {error && (
          <Alert tone="danger">
            {error.message}
          </Alert>
        )}

        {loading && !data ? (
          <Skeleton className="h-48" />
        ) : rows.length === 0 ? (
          <div className="surface rounded-xl">
            <EmptyState
              icon={Megaphone}
              title="No campaigns created yet"
              description="Create your first campaign for a promotion, product launch, restaurant menu or event. Then group related QR codes inside it."
              action={
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setOpen(true)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create your first campaign
                </Button>
              }
            />
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="mb-4 max-w-md">
              <Field label="Find a campaign">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by campaign name or description..."
                />
              </Field>
            </div>

            {filteredRows.length === 0 ? (
              <div className="surface rounded-xl">
                <EmptyState
                  icon={Search}
                  title="No matching campaigns"
                  description="Try another campaign name or description."
                  action={
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setQuery("")}
                    >
                      Clear search
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredRows.map((campaign) => (
                  <Link
                    key={campaign.id}
                    to={`/app/campaigns/${campaign.id}`}
                    className="surface group rounded-xl p-5 transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg dark:hover:border-zinc-700"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span
                          className="h-3 w-3 shrink-0 rounded-full"
                          style={{
                            background: campaign.color ?? "#71717a",
                          }}
                        />

                        <h3 className="truncate font-semibold group-hover:text-ember-600 dark:group-hover:text-ember-400">
                          {campaign.name}
                        </h3>
                      </div>

                      <ArrowRight className="h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-ember-500" />
                    </div>

                    <p className="muted mt-3 min-h-10 line-clamp-2 text-sm leading-5">
                      {campaign.description || "No description added yet."}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                      <div>
                        <p className="text-2xl font-semibold tabular-nums">
                          {formatNumber(campaign.qr_count)}
                        </p>

                        <p className="muted mt-1 text-xs">
                          QR codes
                        </p>
                      </div>

                      <div>
                        <p className="text-2xl font-semibold tabular-nums">
                          {formatNumber(campaign.scan_count)}
                        </p>

                        <p className="muted mt-1 text-xs">
                          Total scans
                        </p>
                      </div>
                    </div>

                    <div className="muted mt-4 flex items-center gap-1.5 text-xs">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Created {formatDate(campaign.created_at)}
                    </div>

                    <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-ember-600 dark:text-ember-400">
                      View campaign
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* How to add codes */}
      <section className="surface rounded-xl p-5 sm:p-6">
        <h2 className="text-lg font-semibold">
          How to add QR codes to a campaign
        </h2>

        <p className="muted mt-2 text-sm leading-6">
          You do not need to create QR codes from inside the campaign page.
          QRNova lets you connect them through the QR creation form or
          the settings of an existing code.
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold">
              When creating a new QR code
            </p>

            <p className="muted mt-2 text-sm leading-6">
              Open the QR Studio or Dynamic QR creation form. Select the
              desired campaign in the Campaign field before creating
              the code.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold">
              For an existing QR code
            </p>

            <p className="muted mt-2 text-sm leading-6">
              Open the QR code and go to its Settings. Select the
              campaign you want to associate with that code and save
              the changes.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <ButtonLink
            to="/app/codes/new"
            variant="secondary"
            size="sm"
          >
            Create a Dynamic QR code
            <ArrowRight className="h-3.5 w-3.5" />
          </ButtonLink>
        </div>
      </section>

      {/* Create campaign dialog */}
      <CampaignDialog
        key={open ? "open" : "closed"}
        open={open}
        onClose={() => setOpen(false)}
        onSaved={reload}
      />

    </div>
  );
}

/* Small icon used in the product-launch example. */
function ShoppingBagIcon() {
  return <Tag className="h-4 w-4" />;
}
