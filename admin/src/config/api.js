/**
 * API Configuration
 * Manages API base URL for both local development and production environments
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default API_URL;

/**
 * Usage in components:
 *
 * import API_URL from '@/config/api';
 *
 * const fetchProducts = async () => {
 *   const response = await fetch(`${API_URL}/api/admin/products`);
 *   return response.json();
 * };
 */
