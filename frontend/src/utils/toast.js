export const TOAST_EVENT = "hyperplay-toast";

/**
 * @param {string} message
 * @param {"success" | "error"} [variant]
 */
export function showToast(message, variant = "success") {
  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, { detail: { message, variant } }),
  );
}
