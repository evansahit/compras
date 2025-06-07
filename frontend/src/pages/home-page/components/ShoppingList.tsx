import "./shopping-list.css";
import type { ItemOutput } from "../../../types";
import React, { useRef, useState } from "react";
import ButtonSecondary from "../../../components/button/button-secondary/ButtonSecondary";
import { createNewItem } from "../../../api/item";

type ShoppingListProps = {
    userId: string;
    items: ItemOutput[] | [];
    itemsError: string;
};

export default function ShoppingList(props: ShoppingListProps) {
    const newItemInputRef = useRef<HTMLInputElement>(null);
    const [items, setItems] = useState(props.items);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleCreateNewItemOnEnter(
        e: React.KeyboardEvent<HTMLInputElement>
    ) {
        if (e.key.toLowerCase() === "enter") {
            setIsLoading(true);
            const newItem = await createNewItem({
                userId: props.userId,
                name: e.currentTarget.value,
            });

            console.log("new item:", newItem);
            setIsLoading(false);
        }
    }

    async function handleCreateNewItemOnSave() {
        setIsLoading(true);
        const newItemName = newItemInputRef?.current?.value;
        const newItem = await createNewItem({
            userId: props.userId,
            name: newItemName!,
        });

        console.log("new item:", newItem);
        setIsLoading(false);
    }

    return (
        <div className="shopping-list">
            {items && items.length === 0 && !isEditing && (
                <span className="default-msg">
                    There are no items in your shopping list.
                </span>
            )}
            {items && items.length > 0 && (
                <ul>
                    {items.map((item: ItemOutput) => (
                        <li key={item.id}></li>
                    ))}
                </ul>
            )}

            {isEditing && (
                <input
                    className="input-new-item"
                    name="item"
                    placeholder="Type a new item here"
                    ref={newItemInputRef}
                    onKeyDown={handleCreateNewItemOnEnter}
                />
            )}

            {isLoading && (
                <span className="item-creation-loading">Working on it...</span>
            )}

            <ButtonSecondary
                className="btn-add-item"
                onClick={
                    !isEditing
                        ? () => setIsEditing(true)
                        : () => handleCreateNewItemOnSave()
                }
            >
                {isEditing ? "Save" : "Add item"}
            </ButtonSecondary>
        </div>
    );
}
