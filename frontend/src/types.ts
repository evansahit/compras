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
export type ItemOutput = {
    id: string;
    name: string;
    groceryStore: string;
    lowestPrice: number;
    isCompleted: boolean;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
};
