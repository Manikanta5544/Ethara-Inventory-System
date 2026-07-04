const MAP = { PENDING: "badge-yellow", COMPLETED: "badge-green", CANCELLED: "badge-gray" };
export const OrderStatusBadge = ({ status }) => (
  <span className={MAP[status] ?? "badge-gray"}>{status}</span>
);
