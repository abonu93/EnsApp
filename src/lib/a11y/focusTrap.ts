// Trap focus dentro un elemento (es. modal): Tab/Shift-Tab wrappa,
// Escape opzionale, focus iniziale sul primo elemento focabile.

const FOCUSABLE = [
  "a[href]",
  "area[href]",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "iframe",
  "object",
  "embed",
  '[tabindex]:not([tabindex="-1"])',
  "[contenteditable=true]",
].join(",");

export interface FocusTrapOptions {
  onEscape?: () => void;
  initialFocus?: HTMLElement | null;
  returnFocus?: HTMLElement | null;
}

export function focusTrap(node: HTMLElement, options: FocusTrapOptions = {}) {
  const previouslyFocused =
    options.returnFocus ?? (document.activeElement as HTMLElement | null);

  function getFocusable(): HTMLElement[] {
    return Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
    );
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && options.onEscape) {
      e.preventDefault();
      options.onEscape();
      return;
    }
    if (e.key !== "Tab") return;
    const items = getFocusable();
    if (items.length === 0) {
      e.preventDefault();
      node.focus();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  node.addEventListener("keydown", onKeydown);
  const focusTarget = options.initialFocus ?? getFocusable()[0] ?? node;
  focusTarget.focus();

  return {
    destroy() {
      node.removeEventListener("keydown", onKeydown);
      previouslyFocused?.focus?.();
    },
  };
}
