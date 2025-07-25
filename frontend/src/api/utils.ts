import type {
    UserOutput,
    ItemOutput,
    ItemWithProducts,
    ProductOutput,
    UserWithItemsAndProducts,
} from "../types";

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

export function transformToUserWithItemsAndProducts(
    data
): UserWithItemsAndProducts {
    return {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        itemsWithProducts: data.items_with_products.map((item) =>
            transformToItemWithProducts(item)
        ),
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

export function transformToProductOutput(data): ProductOutput {
    return {
        id: data.id,
        itemId: data.item_id,
        name: data.name,
        groceryStore: data.grocery_store,
        price: parseFloat(data.price),
        priceDiscounted: parseFloat(data.price_discounted),
        weight: data.weight,
        imageUrl: data.image_url,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
    };
}

export function handleDefaultErrors(error) {
    let errorMessage = "Iets is misgegaan";

    if (error instanceof Error) {
        if (
            error.message === "Failed to fetch" ||
            error.message.includes("fetch") ||
            error.message.includes("NetworkError")
        ) {
            errorMessage = "Kon geen verbinding maken met de server";
        } else {
            errorMessage = error.message;
        }
    }

    return errorMessage;
}
