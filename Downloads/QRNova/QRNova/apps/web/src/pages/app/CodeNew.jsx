
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import { ArrowLeft, Crown, ExternalLink } from "lucide-react";
import { api } from "../../lib/api.js";
import { useSession } from "../../lib/session.jsx";
import {
  DEFAULT_DESIGN,
  designToOptions,
  normalizeDesign,
} from "../../lib/design.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import {
  CodeForm,
  codeFormToBody,
  initialCodeForm,
} from "../../components/CodeForm.jsx";
import { DesignPanel } from "../../components/studio/DesignPanel.jsx";
import { PreviewPanel } from "../../components/studio/PreviewPanel.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Alert, PageHeader } from "../../components/ui/misc.jsx";
import { useToast } from "../../components/ui/overlay.jsx";

const RAZORPAY_PAYMENT_LINK = "https://rzp.io/rzp/NDMhrFi4";

export default function CodeNew() {
  useDocumentTitle("New dynamic code");

  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { server } = useSession();

  const upgradeButtonRef = useRef(null);

  const [form, setForm] = useState(() =>
    initialCodeForm(
      {},
      {
        destination: location.state?.destination ?? "",
      }
    )
  );

  const [design, setDesign] = useState(() =>
    normalizeDesign(location.state?.design ?? DEFAULT_DESIGN)
  );

  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [limitReached, setLimitReached] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (limitReached && upgradeButtonRef.current) {
      upgradeButtonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      upgradeButtonRef.current.focus({
        preventScroll: true,
      });
    }
  }, [limitReached]);

  const previewUrl = `${
    (server?.base_url ?? window.location.origin).replace(/\/$/, "")
  }/r/${form.slug.trim() || "xxxxxxx"}`;

  const options = useMemo(
    () => designToOptions(design),
    [design]
  );

  const submit = async (e) => {
    e?.preventDefault();

    setSaving(true);
    setErrors({});
    setError(null);
    setLimitReached(false);

    try {
      const body = codeFormToBody(form, { isNew: true });

      if (!body.name) {
        if (form.target === "file") {
          body.name = form.file?.name ?? "File";
        } else {
          body.name = form.destination
            ? new URL(form.destination).host
            : "Dynamic code";
        }
      }

      const qr = await api.post("/qrcodes", {
        ...body,
        design,
      });

      toast.success("Dynamic code created", {
        description: qr.redirect_url,
      });

      navigate(`/app/codes/${qr.id}`);
    } catch (err) {
      if (err instanceof TypeError) {
        setErrors({
          destination: "Enter a valid URL, starting with https://",
        });
      } else {
        const errorMessage = err?.message ?? "";

        const isLimitError =
          err?.code === "limit_reached" ||
          err?.data?.code === "limit_reached" ||
          /limit_reached|dynamic qr limit|reached your dynamic qr limit/i.test(
            errorMessage
          );

        if (isLimitError) {
          setLimitReached(true);
          setError(
            "You have reached your Dynamic QR limit. Upgrade to Pro for more QR codes."
          );
        } else {
          setErrors(err.fields ?? {});

          if (!err.fields || !Object.keys(err.fields).length) {
            setError(errorMessage || "Something went wrong. Please try again.");
          }
        }
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Link
        to="/app/codes"
        className="muted mb-4 inline-flex items-center gap-1 text-sm hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        QR codes
      </Link>

      <PageHeader
        title="New dynamic code"
        description="A short link you can re-point at any time — print once, update forever."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <form
            className="surface space-y-5 p-5"
            onSubmit={submit}
            noValidate
          >
            {error && (
              <Alert tone="danger">
                <div className="space-y-3">
                  <p>{error}</p>

                  {limitReached && (
                    <a
                      ref={upgradeButtonRef}
                      href={RAZORPAY_PAYMENT_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={0}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-300 dark:focus:ring-violet-800"
                    >
                      <Crown className="h-4 w-4" />
                      Upgrade to Pro
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </Alert>
            )}

            <CodeForm
              form={form}
              setForm={setForm}
              errors={errors}
              isNew
            />

            <div className="flex justify-end gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <Button
                variant="secondary"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                loading={saving}
                disabled={
                  form.target === "file"
                    ? !form.file
                    : !form.destination.trim()
                }
              >
                Create code
              </Button>
            </div>
          </form>

          <section
            className="surface px-5 pt-1.5"
            aria-label="Design"
          >
            <DesignPanel
              design={design}
              onChange={setDesign}
              onNotice={(m) => toast.info(m)}
            />
          </section>
        </div>

        <aside>
          <div className="lg:sticky lg:top-8">
            <PreviewPanel
              data={previewUrl}
              options={options}
              compact
              exportable={false}
              footer={
                <p className="muted text-center text-xs">
                  Preview · the final link is assigned when you create the code.
                </p>
              }
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
