import { BrandRow } from "@substantiate/ui";

export default function Privacy() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <BrandRow size={24} />
      <h1 className="mt-8 text-2xl font-bold tracking-[-0.02em] text-text">Privacy Policy</h1>
      <p className="mt-4 text-muted">
        The privacy policy lands here. (Placeholder — filled in when the extension ships.)
      </p>
    </main>
  );
}
