import type { ItemWithProducts, ProductOutput } from "../types";
import { sortProductsByPriceAscending } from "./sortProductsByPrice";

export function findCheapestProductForItem(
    item: ItemWithProducts
): ProductOutput | string {
    if (item.products.length === 0 || !item.products)
        return "No products found.";

    return sortProductsByPriceAscending(item)[0];
}
