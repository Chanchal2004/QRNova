
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Save,
  Zap,
  Server,
  ArrowRight,
  RotateCcw,
  Check,
  QrCode,
} from "lucide-react";

import { QR_TYPE_MAP, buildStudioPayload } from "../lib/qrTypes.js";
import {
  DEFAULT_DESIGN,
  designToOptions,
  normalizeDesign,
} from "../lib/design.js";
import { storage } from "../lib/storage.js";
import { useSession } from "../lib/session.jsx";
import { api } from "../lib/api.js";
import { DOCS_URL } from "../lib/config.js";

import {
  TypePicker,
  ContentForm,
} from "../components/studio/ContentForm.jsx";

import { DesignPanel } from "../components/studio/DesignPanel.jsx";
import { PreviewPanel } from "../components/studio/PreviewPanel.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Dialog, useToast } from "../components/ui/overlay.jsx";
import { Field, Input } from "../components/ui/Field.jsx";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

const DESIGN_KEY = "QRNova-studio-design";
const TYPE_KEY = "QRNova-studio-type";

const FREE_STATIC_LIMIT = 25;

function initialValues() {
  return Object.fromEntries(
    Object.values(QR_TYPE_MAP).map((t) => [
      t.id,
      { ...t.defaults },
    ])
  );
}

function SaveDialog({
  open,
  onClose,
  onSave,
  saving,
  defaultName,
}) {
  const [name, setName] = useState(defaultName);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Save Static QR Code"
      description="Save this Static QR Code to your QRNova dashboard."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="primary"
            loading={saving}
            onClick={() => onSave(name.trim())}
            disabled={!name.trim()}
          >
            <Save className="h-3.5 w-3.5" />
            Save QR Code
          </Button>
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (name.trim()) {
            onSave(name.trim());
          }
        }}
      >
        <Field label="QR Code Name">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={120}
            data-autofocus
          />
        </Field>
      </form>
    </Dialog>
  );
}

function StaticPlanInfo() {
  return (
    <section className="mb-6 overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/20">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />

            <h2 className="font-semibold text-emerald-800 dark:text-emerald-300">
              25 Free Static QR Codes
            </h2>
          </div>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-emerald-700 dark:text-emerald-400">
            Create permanent QR Codes for website links, Wi-Fi,
            contacts, email, phone numbers and more.
            No subscription required for local generation.
          </p>
        </div>

        <div className="shrink-0 rounded-lg border border-emerald-200 bg-white px-4 py-3 dark:border-emerald-900 dark:bg-zinc-950">
          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
            25 FREE
          </p>
          <p className="text-xs text-zinc-500">
            Saved Static QR limit
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-emerald-200 px-4 py-3 text-xs font-medium text-emerald-800 dark:border-emerald-900/60 dark:text-emerald-300">
        <span className="flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5" />
          PNG, SVG and PDF downloads
        </span>

        <span className="flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5" />
          Custom QR designs
        </span>

        <span className="flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5" />
          No expiry
        </span>
      </div>
    </section>
  );
}

function ServerActions({ type, payload, values, design }) {
  const { server, user } = useSession();
  const navigate = useNavigate();
  const toast = useToast();

  const [saveOpen, setSaveOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  if (server === undefined) {
    return null;
  }

  if (server === null) {
    return (
      <div className="flex items-start gap-2.5 rounded-lg bg-zinc-50 px-3 py-2.5 text-xs dark:bg-zinc-900/60">
        <Server className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" />

        <p className="muted leading-relaxed">
          Want editable QR Codes and scan analytics?{" "}
          <a
            href={DOCS_URL}
            className="font-medium text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100"
          >
            Self-host QRNova Server
          </a>
          .
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <Link
        to="/login?next=/studio"
        className="group flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2.5 text-xs dark:bg-zinc-900/60"
      >
        <span className="muted">
          Sign in to save Static QR Codes to your dashboard.
        </span>

        <ArrowRight className="h-3.5 w-3.5 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
      </Link>
    );
  }

  const save = async (name) => {
    setSaving(true);

    try {
      const qr = await api.post("/qrcodes", {
        name,
        kind: "static",
        qr_type: type,
        content: payload,
        form_data: values,
        design,
      });

      toast.success("Static QR Code saved successfully");

      setSaveOpen(false);

      navigate(`/app/codes/${qr.id}`);
    } catch (e) {
      toast.error("Couldn't save QR Code", {
        description: e.message,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={!payload}
          onClick={() => setSaveOpen(true)}
        >
          <Save className="h-3.5 w-3.5" />
          Save Static QR
        </Button>

        <Button
          variant="secondary"
          size="sm"
          disabled={!payload || type !== "url"}
          title={
            type === "url"
              ? "Create an editable, trackable Dynamic QR Code"
              : "Dynamic QR Codes redirect to a URL"
          }
          onClick={() =>
            navigate("/app/codes/new", {
              state: {
                destination: payload,
                design,
              },
            })
          }
        >
          <Zap className="h-3.5 w-3.5" />
          Make Dynamic
        </Button>
      </div>

      <SaveDialog
        key={saveOpen ? "open" : "closed"}
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        onSave={save}
        saving={saving}
        defaultName={`${QR_TYPE_MAP[type].label} code`}
      />
    </>
  );
}

export default function Studio() {
  useDocumentTitle("QR Studio");

  const toast = useToast();

  const [type, setType] = useState(() => {
    const savedType = storage.get(TYPE_KEY);
    return QR_TYPE_MAP[savedType] ? savedType : "url";
  });

  const [valuesByType, setValuesByType] = useState(initialValues);
  const [touched, setTouched] = useState({});

  const [design, setDesign] = useState(() =>
    normalizeDesign(
      storage.getJSON(DESIGN_KEY, DEFAULT_DESIGN)
    )
  );

  // Remember design and selected QR type.
  // Do not store sensitive QR content in local storage.
  useEffect(() => {
    storage.setJSON(DESIGN_KEY, design);
  }, [design]);

  useEffect(() => {
    storage.set(TYPE_KEY, type);
  }, [type]);

  const values = valuesByType[type];

  const { payload, error } = useMemo(
    () => buildStudioPayload(type, values),
    [type, values]
  );

  const options = useMemo(
    () => designToOptions(design),
    [design]
  );

  const hasInput = Object.entries(values).some(
    ([k, v]) =>
      typeof v === "string" &&
      v.trim() !== "" &&
      QR_TYPE_MAP[type].defaults[k] !== v
  );

  const visibleError =
    error && (hasInput || Object.keys(touched).length > 0)
      ? error
      : null;

  return (
    <div className="mx-auto max-w-[1240px] px-4 pt-8 pb-20 sm:px-6 lg:pt-10">

      {/* Page heading */}
      <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            QR Studio
          </h1>

          <p className="muted mt-1 text-sm">
            Create Static QR Codes for websites, Wi-Fi, contacts
            and more. Download instantly or save to your dashboard.
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setDesign({ ...DEFAULT_DESIGN });
            toast.info("Design reset");
          }}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset design
        </Button>
      </div>

      {/* Static QR Free Plan Information */}
      <StaticPlanInfo />

      {/* QR Generator */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">

        {/* Left side: Content and Design */}
        <div className="order-2 space-y-6 lg:order-1">

          {/* Content section */}
          <section
            className="surface p-5"
            aria-labelledby="content-heading"
          >
            <h2
              id="content-heading"
              className="mb-4 text-[13px] font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400"
            >
              Static QR Content
            </h2>

            <TypePicker
              value={type}
              onChange={(t) => {
                setType(t);
                setTouched({});
              }}
            />

            <div className="mt-5">
              <ContentForm
                key={type}
                type={type}
                values={values}
                onChange={(v) =>
                  setValuesByType((all) => ({
                    ...all,
                    [type]: v,
                  }))
                }
                error={visibleError}
                touched={touched}
                onBlur={(name) =>
                  setTouched((t) => ({
                    ...t,
                    [name]: true,
                  }))
                }
              />
            </div>
          </section>

          {/* Design section */}
          <section
            className="surface px-5 pt-1.5"
            aria-label="QR Design"
          >
            <DesignPanel
              design={design}
              onChange={setDesign}
              onNotice={(m) => toast.info(m)}
            />
          </section>
        </div>

        {/* Right side: Preview */}
        <aside className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-20">
            <PreviewPanel
              data={payload}
              options={options}
              error={visibleError}
              filename={`QRNova-${type}`}
              footer={
                <ServerActions
                  type={type}
                  payload={payload}
                  values={values}
                  design={design}
                />
              }
            />
          </div>
        </aside>
      </div>

      {/* Bottom information */}
      <div className="mt-8 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
        <h3 className="font-semibold">
          Static QR vs Dynamic QR
        </h3>

        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              Static QR Code
            </p>

            <p className="muted mt-1 text-sm leading-relaxed">
              Your information is stored directly inside the QR pattern.
              It does not need a redirect server. Once generated,
              its encoded content cannot be changed.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-ember-500">
              Dynamic QR Code
            </p>

            <p className="muted mt-1 text-sm leading-relaxed">
              Uses a QRNova short link. You can change the destination
              later and access scan tracking and other server features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
