import { BrandRow, Button } from "@substantiate/ui";
import { titleCase } from "@/lib/format";

/** Placeholder side-panel shell. Replaced as real features land. */
export default function Panel() {
  return (
    <div className="min-h-screen bg-bg p-5">
      <BrandRow size={24} />
      <p className="mt-4 text-sm text-muted">{titleCase("ready to substantiate")}</p>
      <div className="mt-4">
        <Button variant="primary" sm>
          Get started
        </Button>
      </div>
    </div>
  );
}
