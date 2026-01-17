export const CACHE_TTL = {
  HOME_PRODUCTS: Number(process.env.HOME_PRODUCTS_TTL) || 60 * 60,
  FEATURED_PRODUCTS: Number(process.env.FEATURED_PRODUCTS_TTL) || 60 * 60,
  BANNERS: Number(process.env.BANNER_LIST_TTL) || 60 * 10,
};
