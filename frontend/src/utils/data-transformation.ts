import type { UserOutput } from "../types";
import type { ItemOutput } from "../types";

export function convertToUserOutput(data): UserOutput {
    return {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    };
}

export function convertToItemOutput(data): ItemOutput {
    return {
        id: data.id,
        name: data.name,
        groceryStore: data.groceryStore,
        lowestPrice: data.lowestPrice,
        isCompleted: data.isCompleted,
        isArchived: data.isArchived,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    };
}
