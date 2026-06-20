/** Single source of truth for contact details (used by nav, call bar, contact, footer). */
export const CONTACT = {
  phone: "+420775222760",
  phoneDisplay: "+420 775 222 760",
  phoneHref: "tel:+420775222760",
  email: "info@umyjemefasadu.cz",
  emailHref: "mailto:info@umyjemefasadu.cz",
} as const;

/** Brand accent gradients (cyan "water" + magenta) used as image/photo tints. */
export const BRAND_GRADIENT = {
  blue: "linear-gradient(150deg, #1ba5e0 0%, #1488c4 100%)",
  pink: "linear-gradient(150deg, #e6007e 0%, #ff5fb0 100%)",
} as const;
