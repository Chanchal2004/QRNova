
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
  ShoppingBag,
  Utensils,
  Ticket,
  X,
} from "lucide-react";

import { api } from "../../lib/api.js";
import { useAsync } from "../../hooks/useAsync.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { formatNumber, formatDate } from "../../lib/format.js";

import { Button } from "../../components/ui/Button.jsx";
import { Field, Input } from "../../components/ui/Field.jsx";
import {
  Alert,
  EmptyState,
  PageHeader,
  Skeleton,
} from "../../components/ui/misc.jsx";
import {
  Dialog,
  useToast,
} from "../../components/ui/overlay.jsx";

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
    <div className="surface rounded-xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
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

function ExampleCard({ icon: Icon, title, description, examples }) {
  return (
    <div className="surface rounded-xl p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ember-500/10 text-ember-600 dark:text-ember-400">
          <Icon className="h-5 w-5" />
        </div>

        <h3 className="text-sm font-semibold">
          {title}
        </h3>
      </div>

      <p className="muted mt-3 text-sm leading-6">
        {description}
      </p>

      <div className="mt-4 border-t border-zinc-200 pt-3 dark:border-zinc-800">
        <p className="text-xs font-medium text-zinc-500">
          Example QR codes
        </p>

        <ul className="mt-2 space-y-2">
          {examples.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400"
            >
              <QrCode className="h-3.5 w-3.5 text-ember-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/*
  Shared campaign create/edit dialog.

  CampaignDetail.jsx also imports CampaignDialog from this file.
  Keep this named export intact.
*/
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
        name: form.name.trim(),
        description: form.description.trim(),
        color: form.color,
      };

      const saved = campaign
        ? await api.patch(`/campaigns/${campaign.id}`, payload)
        : await api.post("/campaigns", payload);

      toast.success(
        campaign
          ? "Campaign updated successfully"
          : "Campaign created successfully"
      );

      onSaved?.(saved);
      onClose();
    } catch (err) {
      setErrors(
        err.fields && Object.keys(err.fields).length
          ? err.fields
          : {
              name: err.message || "Could not save campaign.",
            }
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
      description="Organize related QR codes under one marketing project."
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={saving}
          >
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
            onChange={(e) => {
              setForm({
                ...form,
                name: e.target.value,
              });

              setErrors({});
            }}
            maxLength={120}
            placeholder="Diwali Sale 2026"
            data-autofocus
          />
        </Field>

        <Field
          label="Description"
          optional
          hint="Describe what this campaign is about."
          error={errors.description}
        >
          <textarea
            value={form.description}
            onChange={(e) => {
              setForm({
                ...form,
                description: e.target.value,
              });
            }}
            maxLength={500}
            rows={3}
            placeholder="Example: QR codes for our Diwali promotion."
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-ember-500 focus:ring-2 focus:ring-ember-500/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </Field>

        <fieldset>
          <legend className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
            Campaign colour
          </legend>

          <p className="muted mb-3 mt-1 text-xs">
            Use a colour to identify your campaign in the dashboard.
          </p>

          <div className="flex flex-wrap gap-3">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`Choose colour ${color}`}
                aria-pressed={form.color === color}
                onClick={() => {
                  setForm({
                    ...form,
                    color,
                  });
                }}
                className="h-8 w-8 rounded-full ring-offset-2 ring-offset-white transition-shadow aria-pressed:ring-2 aria-pressed:ring-zinc-900 dark:ring-offset-zinc-900 dark:aria-pressed:ring-zinc-100"
                style={{
                  background: color,
                }}
              />
            ))}
          </div>
        </fieldset>

        <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
          <p className="text-xs font-semibold">
            What happens after creating a campaign?
          </p>

          <p className="muted mt-1 text-xs leading-5">
            You can select this campaign when creating a QR code
            or associate an existing QR code through its settings.
            The linked codes will be organized under this campaign.
          </p>
        </div>
      </form>
    </Dialog>
  );
}

export default function Campaigns() {
  useDocumentTitle("Campaigns");

  const toast = useToast();

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
    <div className="space-y-8">

      {/* Campaign heading */}
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
            New campaign
          </Button>
        }
      />

      {/* Campaign introduction */}
      <section className="relative overflow-hidden rounded-2xl border border-ember-500/20 bg-ember-500/[0.04] p-5 sm:p-7">
        <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-ember-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ember-500/10 text-ember-600 dark:text-ember-400">
            <Megaphone className="h-6 w-6" />
          </div>

          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-ember-600 dark:text-ember-400">
              QR marketing management
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Manage all your QR campaigns in one place.
            </h2>

            <p className="muted mt-3 max-w-3xl text-sm leading-7">
              A campaign is a group of related QR codes created for
              one marketing activity. For example, a Diwali Sale
              campaign can contain QR codes for your website, discount
              offers, product pages and promotional materials.
            </p>

            <p className="muted mt-2 max-w-3xl text-sm leading-7">
              Instead of managing every QR code separately, organize
              them into campaigns and open each campaign to manage
              its associated codes and review available scan activity.
            </p>

            <Button
              variant="primary"
              size="sm"
              className="mt-5"
              onClick={() => setOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              Create your first campaign
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
            Three simple steps to organize your marketing QR codes.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <InfoCard
            icon={Target}
            title="1. Create a campaign"
          >
            Give your project a name such as Diwali Sale 2026,
            Restaurant Promotion or New Product Launch.
          </InfoCard>

          <InfoCard
            icon={QrCode}
            title="2. Add QR codes"
          >
            Select the campaign while creating a new code,
            or assign an existing QR code through its settings.
          </InfoCard>

          <InfoCard
            icon={ChartColumn}
            title="3. Review performance"
          >
            Open the campaign to see its associated QR codes
            and available scan statistics.
          </InfoCard>
        </div>
      </section>

      {/* Example campaigns */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            What can you use campaigns for?
          </h2>

          <p className="muted mt-1 text-sm">
            Some practical examples for different types of businesses.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <ExampleCard
            icon={Tag}
            title="Diwali Sale"
            description="Organize QR codes used in your seasonal sales campaign."
            examples={[
              "Sale landing page",
              "Discount coupon",
              "Product catalogue",
            ]}
          />

          <ExampleCard
            icon={ShoppingBag}
            title="Product Launch"
            description="Keep all QR codes related to a new product together."
            examples={[
              "Product information",
              "Product demonstration",
              "Shopping page",
            ]}
          />

          <ExampleCard
            icon={Utensils}
            title="Restaurant Promotion"
            description="Group QR codes used in restaurant marketing."
            examples={[
              "Digital menu",
              "Special offers",
              "Feedback page",
            ]}
          />

          <ExampleCard
            icon={Ticket}
            title="Events and Weddings"
            description="Organize QR codes used for event information and promotions."
            examples={[
              "Invitation page",
              "Event information",
              "Registration page",
            ]}
          />

        </div>
      </section>

      {/* Statistics */}
      {data && rows.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Campaign overview
            </h2>

            <p className="muted mt-1 text-sm">
              Summary of campaigns currently in your account.
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
                Across listed campaigns
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
              Open any campaign to manage its QR codes and view details.
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Create campaign
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
              description="Create your first campaign for a product launch, Diwali sale, restaurant promotion or event. You can then organize related QR codes under it."
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
            <div className="mb-4 max-w-md">
              <Field label="Search campaigns">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by campaign name..."
                  />

                </div>
              </Field>

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="muted mt-2 inline-flex items-center gap-1 text-xs hover:text-zinc-950 dark:hover:text-zinc-100"
                >
                  <X className="h-3 w-3" />
                  Clear search
                </button>
              )}
            </div>

            {filteredRows.length === 0 ? (
              <div className="surface rounded-xl">
                <EmptyState
                  icon={Search}
                  title="No matching campaigns"
                  description="Try searching with a different campaign name."
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

                        <h3 className="truncate text-sm font-semibold group-hover:text-ember-600 dark:group-hover:text-ember-400">
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
                      Created{" "}
                      {campaign.created_at
                        ? formatDate(campaign.created_at)
                        : "Date unavailable"}
                    </div>

                    <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-ember-600 dark:text-ember-400">
                      View campaign details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* Assign QR codes guide */}
      <section className="surface rounded-xl p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ember-500/10 text-ember-600 dark:text-ember-400">
            <QrCode className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              How to add QR codes to a campaign
            </h2>

            <p className="muted mt-1 text-sm">
              Connect your existing or newly created QR codes to a marketing project.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold">
              When creating a new QR code
            </p>

            <p className="muted mt-2 text-sm leading-6">
              Open the QR creation form and select your campaign in
              the Campaign field, where available, before creating
              the QR code.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold">
              For an existing QR code
            </p>

            <p className="muted mt-2 text-sm leading-6">
              Open the code's details and use its Settings to select
              a campaign, if the assignment option is available.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Link
            to="/app/codes/new"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Create a Dynamic QR code
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* Campaign dialog */}
      <CampaignDialog
        key={open ? "create-open" : "create-closed"}
        open={open}
        onClose={() => setOpen(false)}
        onSaved={() => reload()}
      />

    </div>
  );
}
