import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => twMerge(clsx(inputs));

export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", minimumFractionDigits: 2,
  }).format(amount);

export const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    year: "numeric", month: "short", day: "numeric",
  });