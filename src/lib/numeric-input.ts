"use client";

/**
 * Returns onKeyDown and onPaste handlers that restrict input to numeric values.
 * 
 * @param mode - "decimal" allows digits and one decimal point (for prices/weights).
 *             - "integer" allows only digits (for stock, quantities, days).
 */
export function numericInputHandlers(mode: "decimal" | "integer" = "decimal") {
  const allowedControlKeys = [
    "Backspace", "Delete", "Tab", "Escape", "Enter",
    "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
    "Home", "End",
  ];

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow control keys
    if (allowedControlKeys.includes(e.key)) return;
    // Allow Ctrl/Cmd + A, C, V, X, Z
    if ((e.ctrlKey || e.metaKey) && ["a", "c", "v", "x", "z"].includes(e.key.toLowerCase())) return;
    // Allow decimal point (only one)
    if (mode === "decimal" && e.key === ".") {
      if (e.currentTarget.value.includes(".")) {
        e.preventDefault();
      }
      return;
    }
    // Block anything that isn't a digit
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    const pattern = mode === "decimal" ? /^[0-9]*\.?[0-9]*$/ : /^[0-9]*$/;
    if (!pattern.test(pastedText)) {
      e.preventDefault();
    }
  };

  return { onKeyDown, onPaste };
}

/** Pre-built handler sets for convenience */
export const decimalInputHandlers = numericInputHandlers("decimal");
export const integerInputHandlers = numericInputHandlers("integer");
