export const CART_UPDATED_EVENT = "hyperplay-cart-updated";

export function emitCartUpdated() {
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}
