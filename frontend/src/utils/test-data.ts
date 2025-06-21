import type { ItemWithProducts } from "../types";

export function generateTestData() {
    const itemNamesAndPrices = [
        { name: "Bananen", price: 1.55 },
        { name: "Melk", price: 0.99 },
        { name: "Basmati rijst", price: 2.59 },
        { name: "Kipdijfilet", price: 3.95 },
        { name: "Kaas plakken", price: 4.55 },
        // { name: "Bier", price: 0.99 },
        // { name: "Cottage cheese", price: 0.99 },
        // { name: "Arizona juice", price: 2.59 },
        // { name: "Salami", price: 1.49 },
        // { name: "Koffie capsules", price: 3.99 },
    ];
    const storeNames = ["Albert Heijn", "Jumbo"];
    const itemsWithProducts: ItemWithProducts[] = [];
    for (let i = 0; i < itemNamesAndPrices.length; i++) {
        const item = {
            item: {
                id: `${i + 1}`,
                userId: `${i + 1}`,
                name: itemNamesAndPrices[i].name,
                isCompleted: Math.random() > 0.7,
                isArchived: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            products: [
                {
                    id: `${i + 1}`,
                    itemId: `${i + 1}`,
                    name: itemNamesAndPrices[i].name,
                    groceryStore:
                        Math.random() > 0.5 ? storeNames[0] : storeNames[1],
                    price: itemNamesAndPrices[i].price,
                    priceDiscounted: 0,
                    weight: "0",
                    imageUrl: "",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
        };

        itemsWithProducts.push(item);
    }

    return itemsWithProducts;
}
