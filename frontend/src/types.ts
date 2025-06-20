// users
export type UserInput = {
    first_name: string;
    last_name: string;
    email: string;
    plain_password: string;
};

export type UserOutput = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
};

// items
export type ItemInput = {
    userId: string;
    name: string;
};

export type ItemOutput = {
    id: string;
    userId: string;
    name: string;
    isCompleted: boolean;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type ItemUpdate = {
    id: string;
    name: string;
    isCompleted: boolean;
    isArchived: boolean;
};

// products
export type ProductOutput = {
    id: string;
    itemId: string;
    name: string;
    groceryStore: string;
    price: number;
    priceDiscounted: number;
    weight: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
};

// combination types
export type ItemWithProducts = {
    item: ItemOutput;
    products: ProductOutput[];
};
