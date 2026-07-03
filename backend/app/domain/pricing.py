from app.models.product import Product


class PricingDomain:
    @staticmethod
    def line_total(product: Product, quantity: int) -> float:
        return round(float(product.price) * quantity, 2)

    @staticmethod
    def order_total(line_totals: list[float]) -> float:
        return round(sum(line_totals), 2)
