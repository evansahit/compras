import "./shopping-list.css";
import type { ItemOutput, ItemWithProducts } from "../../../types";
import { useEffect, useState } from "react";
import ButtonPrimary from "../../../components/button/button-primary/ButtonPrimary";
import { createNewItem } from "../../../api/item";
import ButtonDanger from "../../../components/button/button-danger/ButtonDanger";
import { validateItemName } from "../../../utils/form-validation";

type ShoppingListProps = {
    userId: string;
    items: ItemWithProducts[] | [];
    itemsError: string;
    createItem: (newItem: ItemWithProducts) => void;
};

export default function ShoppingList(props: ShoppingListProps) {
    const [itemName, setItemName] = useState("");
    const [isInputTouched, setIsInputTouched] = useState(false);
    const [inputError, setInputError] = useState("");
    const items = props.items;

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    async function handleCreateNewItemOnSave() {
        setInputError(validateItemName(itemName));
        if (inputError.length > 0 || itemName.length === 0) {
            return;
        } else {
            setIsLoading(true);
            setInputError("");

            const newItem = await createNewItem({
                userId: props.userId,
                name: itemName,
            });

            props.createItem(newItem);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (isEditing) {
            setIsButtonDisabled(true);
            if (itemName.length >= 2) {
                setIsButtonDisabled(false);
                setInputError("");
            }

            if (inputError.length > 0) {
                setInputError(validateItemName(itemName));
                setIsButtonDisabled(
                    inputError.length > 0 || itemName.length === 0
                        ? true
                        : false
                );
            }

            if (isInputTouched) {
                setInputError(validateItemName(itemName));
                setIsButtonDisabled(
                    inputError.length > 0 || itemName.length === 0
                        ? true
                        : false
                );
            }
        }
    }, [inputError.length, isEditing, isInputTouched, itemName]);

    return (
        <div className="shopping-list">
            {items && items.length === 0 && !isEditing && (
                <span className="default-msg">
                    There are no items in your shopping list.
                </span>
            )}
            {items && items.length > 0 && (
                <ul>
                    {items.map((item: ItemWithProducts) => (
                        <li key={item.item.id}>{item.item.name}</li>
                    ))}
                </ul>
            )}

            {isEditing && (
                <form id="item-form" onSubmit={handleCreateNewItemOnSave}>
                    <input
                        className="input-new-item"
                        name="item"
                        placeholder="Type a new item here"
                        type="text"
                        autoComplete="off"
                        onBlur={() => {
                            setIsInputTouched(true);
                        }}
                        onChange={(e) => setItemName(e.target.value)}
                    />
                </form>
            )}

            {isLoading && (
                <span id="item-creation-loading">Working on it...</span>
            )}

            {isEditing && inputError.length > 0 && (
                <span id="input-error">{inputError}</span>
            )}

            <div className="button-row">
                {isEditing && (
                    <ButtonDanger
                        onClick={() => {
                            setIsEditing(false);
                            setIsButtonDisabled(false);
                            setIsInputTouched(false);
                            setInputError("");
                            setItemName("");
                        }}
                    >
                        Cancel
                    </ButtonDanger>
                )}

                <ButtonPrimary
                    className="btn-add-item"
                    onClick={() => {
                        if (!isEditing) {
                            setIsEditing(true);
                        } else {
                            handleCreateNewItemOnSave();
                        }
                    }}
                    disabled={isButtonDisabled}
                >
                    {isEditing ? "Save" : "Add item"}
                </ButtonPrimary>
            </div>
        </div>
    );
}
