import type { UserOutput, ItemOutput, ItemWithProducts } from "../types";

export function transformToUserOutput(data): UserOutput {
    return {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
    };
}

export function transformToItemOutput(data): ItemOutput {
    return {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        isCompleted: data.is_completed,
        isArchived: data.is_archived,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    };
}

export function transformToItemWithProducts(data): ItemWithProducts {
    return {
        item: {
            id: data.item.id,
            userId: data.item.user_id,
            name: data.item.name,
            isCompleted: data.item.is_completed,
            isArchived: data.item.is_archived,
            createdAt: new Date(data.item.created_at),
            updatedAt: new Date(data.item.updated_at),
        },
        products: data.products.map((p) => ({
            id: p.id,
            itemId: p.item_id,
            name: p.name,
            groceryStore: p.grocery_store,
            price: parseFloat(p.price),
            priceDiscounted: parseFloat(p.price_discounted),
            weight: p.weight,
            imageUrl: p.image_url,
            createdAt: new Date(p.created_at),
            updatedAt: new Date(p.updated_at),
        })),
    };
}
