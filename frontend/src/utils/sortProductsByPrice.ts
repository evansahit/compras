import type { ItemWithProducts, ProductOutput } from "../types";

export function sortProductsByPriceAscending(
    itemWithProducts: ItemWithProducts
): ProductOutput[] {
    function getEffectivePrice(product: ProductOutput) {
        return Number.isFinite(product.priceDiscounted)
            ? product.priceDiscounted
            : product.price;
    }

    return itemWithProducts.products.toSorted((a, b) => {
        const priceA = getEffectivePrice(a);
        const priceB = getEffectivePrice(b);

        return priceA - priceB;
    });
}
