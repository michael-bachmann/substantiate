import { capitalize } from "remeda";

/** Title-case a single word (relies on remeda's `capitalize`). */
export function titleWord(word: string): string {
  return capitalize(word.toLowerCase());
}

/** Title-case every whitespace-separated word in a phrase. */
export function titleCase(phrase: string): string {
  return phrase
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0)
    .map(titleWord)
    .join(" ");
}
