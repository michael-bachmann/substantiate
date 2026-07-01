// Framework-agnostic Web3Forms submit helper. Shared by the landing's
// ContactForm and (later) the extension's inline Request/Report disclosures.
//
// Until a real access key is wired via VITE_WEB3FORMS_KEY, this runs in DEMO
// mode: it waits a beat and resolves (simulated success) so the whole flow —
// busy label, SENT confirmation — is exercisable without a live endpoint.

export interface Web3FormsPayload {
  subject: string;
  from_name: string;
  email?: string;
  message?: string;
  // Extra string fields (e.g. the extension's `retailer` on a retailer request).
  [extra: string]: string | undefined;
}

const ENDPOINT = "https://api.web3forms.com/submit";
const DEMO_MS = 950;

// A key is "configured" only when present and not the `YOUR…` placeholder.
function isConfigured(key: string | undefined): key is string {
  return !!key && !/^YOUR/i.test(key);
}

/**
 * Submit a payload to Web3Forms. Resolves on success, rejects on failure — so
 * callers can `try/catch`. Key resolution: `opts.accessKey`, else
 * `import.meta.env.VITE_WEB3FORMS_KEY`. When no real key is configured, resolves
 * after a short simulated delay (override via `opts.simulateMs`).
 */
export async function submitWeb3Forms(
  payload: Web3FormsPayload,
  opts?: { accessKey?: string; simulateMs?: number },
): Promise<void> {
  const key = opts?.accessKey ?? import.meta.env.VITE_WEB3FORMS_KEY;

  if (!isConfigured(key)) {
    await new Promise((resolve) => setTimeout(resolve, opts?.simulateMs ?? DEMO_MS));
    return;
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ access_key: key, ...payload }),
  });
  const data = (await res.json()) as { success?: boolean };
  if (!data.success) throw new Error("Web3Forms submission failed");
}
