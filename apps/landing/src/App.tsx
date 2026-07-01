import { Logo, Button } from "@substantiate/ui";

export default function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo />
      <h1 className="text-3xl font-bold tracking-[-0.02em] text-ink">
        substantiate
      </h1>
      <p className="max-w-md text-ink2">
        Browser extension and companion site. The landing page lands here.
      </p>
      <Button href="#" variant="primary" sm>
        Get the extension
      </Button>
    </main>
  );
}
