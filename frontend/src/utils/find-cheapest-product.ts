import type { ItemWithProducts, ProductOutput } from "../types";

export function findCheapestProductForItem(item: ItemWithProducts) {
    if (item.products.length === 0 || !item.products)
        return "No products found.";

    let cheapestProduct: ProductOutput = item.products[0];

    for (const product of item.products) {
        if (
            product.priceDiscounted &&
            cheapestProduct.priceDiscounted &&
            product.priceDiscounted < cheapestProduct.priceDiscounted
        )
            cheapestProduct = product;

        if (
            cheapestProduct.priceDiscounted &&
            product.price < cheapestProduct.priceDiscounted
        )
            cheapestProduct = product;

        if (
            product.priceDiscounted &&
            product.priceDiscounted < cheapestProduct.price
        )
            cheapestProduct = product;

        if (product.price < cheapestProduct.price) cheapestProduct = product;
    }

    return cheapestProduct;
}
