import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

// Field fill, hairline border that turns terracotta on focus, muted placeholder.
const FIELD =
  "w-full box-border bg-field border border-rule rounded-control px-3 py-[11px] text-[13px] font-medium text-ink outline-none transition-colors placeholder:text-ink3 focus:border-terra";

type FieldProps =
  | ({ multiline?: false } & InputHTMLAttributes<HTMLInputElement>)
  | ({ multiline: true } & TextareaHTMLAttributes<HTMLTextAreaElement>);

/**
 * The shared input / textarea. `multiline` switches to a non-resizing textarea
 * (default 3 rows). Controlled-friendly thin wrapper; forwards native attributes
 * (value/onChange/placeholder/type/aria-label…) and merges `className`.
 */
export function Field(props: FieldProps) {
  if (props.multiline) {
    const { multiline, className = "", rows = 3, ...rest } = props;
    return (
      <textarea
        rows={rows}
        className={`${FIELD} resize-none leading-[1.5] ${className}`}
        {...rest}
      />
    );
  }
  const { multiline, className = "", ...rest } = props;
  return <input className={`${FIELD} ${className}`} {...rest} />;
}
