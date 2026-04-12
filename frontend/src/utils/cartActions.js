import { emitCartUpdated } from "./cartEvents";
import { showToast } from "./toast";

export function getProductId(product) {
  if (!product || typeof product !== "object") return null;
  const id = product.id ?? product.product_id;
  if (id === undefined || id === null || id === "") return null;
  return id;
}

/**
 * @param {object} product
 * @param {number} [quantity]
 * @param {{ skipToast?: boolean, navigate?: (path: string) => void }} [options]
 */
export async function addProductToCart(product, quantity = 1, options = {}) {
  const { skipToast = false, navigate } = options;

  const product_id = getProductId(product);
  if (product_id == null) {
    showToast("Could not add this product. Try opening its details page.", "error");
    return { ok: false };
  }

  const token = localStorage.getItem("customerToken");
  if (!token) {
    if (!skipToast) {
      showToast("Please log in to add items to your cart.");
    } else {
      showToast("Please log in before making a purchase.");
    }
    const goLogin = () => {
      if (navigate) navigate("/login");
      else window.location.href = "/login";
    };
    if (skipToast) goLogin();
    else setTimeout(goLogin, 900);
    return { ok: false, needLogin: true };
  }

  try {
    const response = await fetch("http://localhost:5000/api/customer/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: Number(product_id) || product_id,
        quantity,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add to cart");
    }

    const name = product?.name?.trim() || "Product";
    if (!skipToast) {
      showToast(`${name} added to cart!`);
    }

    const badgeDelayMs = skipToast ? 0 : 220;
    setTimeout(() => emitCartUpdated(), badgeDelayMs);

    return { ok: true };
  } catch {
    showToast("Could not add to cart. Please try again.", "error");
    return { ok: false };
  }
}
