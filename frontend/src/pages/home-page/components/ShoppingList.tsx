import "./shopping-list.css";
import type { ItemUpdate, ItemOutput, ItemWithProducts } from "../../../types";
import { useEffect, useRef, useState } from "react";
import ButtonPrimary from "../../../components/button/button-primary/ButtonPrimary";
import { createNewItem } from "../../../api/item";
import ButtonDanger from "../../../components/button/button-danger/ButtonDanger";
import { validateItemName } from "../../../utils/form-validation";
import { findCheapestProductForItem } from "../../../utils/find-cheapest-product";
import BlankCheckBoxIcon from "../../../assets/icons/blank-check-box.png";
import CheckedCheckboxIcon from "../../../assets/icons/check-box.png";
import DeleteIcon from "../../../assets/icons/delete.png";
import { updateItem, deleteItem } from "../../../api/item";

type ShoppingListProps = {
    userId: string;
    items: ItemWithProducts[] | [];
    itemsError: string;
    createItem: (newItem: ItemWithProducts) => void;
    updateItem: (newItem: ItemOutput) => void;
    deleteItem: (itemId: string) => void;
};

export default function ShoppingList(props: ShoppingListProps) {
    const [itemName, setItemName] = useState("");
    const [isInputTouched, setIsInputTouched] = useState(false);
    const [error, setError] = useState("");
    const items = props.items;

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    function renderLowestPrice(item: ItemWithProducts): number | string {
        const cheapestProduct = findCheapestProductForItem(item);
        if (typeof cheapestProduct === "string") return cheapestProduct;
        if (cheapestProduct.priceDiscounted)
            return cheapestProduct.priceDiscounted;

        return cheapestProduct.price;
    }

    function renderGroceryStoreOfLowestPrice(item: ItemWithProducts): string {
        const cheapestProduct = findCheapestProductForItem(item);
        if (typeof cheapestProduct === "string") return cheapestProduct;

        return cheapestProduct.groceryStore;
    }

    async function handleCreateNewItem() {
        setError(validateItemName(itemName));
        if (error.length > 0 || itemName.length === 0) {
            return;
        } else {
            setIsLoading(true);
            setError("");

            try {
                const newItem = await createNewItem({
                    userId: props.userId,
                    name: itemName,
                });
                props.createItem(newItem);

                setItemName("");
                setIsInputTouched(false);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : `Something went wrong creating item ${itemName}.`
                );
            } finally {
                setIsLoading(false);
            }
        }
    }

    async function handleUpdateItem(newItem: ItemUpdate) {
        const itemToFind = items.find((i) => i.item.id === newItem.id);
        if (
            newItem.name.length >= 2 &&
            itemToFind?.item.name !== newItem.name
        ) {
            setError(validateItemName(itemName));
            if (error.length > 0 || itemName.length === 0) {
                return;
            } else {
                setIsLoading(true);
                setError("");
                setIsInputTouched(false);

                try {
                    const updatedItem: ItemOutput = await updateItem(newItem);
                    props.updateItem(updatedItem);
                    setItemName("");
                } catch (error) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : `Something went wrong updating item ${newItem.name}.`
                    );
                } finally {
                    setIsLoading(false);
                }
            }
        } else {
            setIsLoading(true);
            setError("");
            setIsInputTouched(false);
            try {
                const updatedItem = await updateItem(newItem);
                props.updateItem(updatedItem);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : `Something went wrong updating item ${newItem.name}.`
                );
            } finally {
                setIsLoading(false);
            }
        }
    }

    async function handleDeleteItem(itemId: string) {
        setIsLoading(true);

        try {
            await deleteItem(itemId);
            props.deleteItem(itemId);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : `Something went wrong deleting this item.`
            );
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();

            setIsButtonDisabled(true);
            if (itemName.length >= 2 && error.length === 0) {
                setIsButtonDisabled(false);
                setError("");
            }

            if (isInputTouched) {
                setError(validateItemName(itemName));
                setIsButtonDisabled(error.length > 0 || itemName.length === 0);
            }

            // setIsButtonDisabled(isLoading);
        }
    }, [error.length, isEditing, isInputTouched, isLoading, itemName]);

    return (
        <div id="shopping-list">
            {items && items.length === 0 && !isEditing && (
                <span id="default-msg">
                    There are no items in your shopping list.
                </span>
            )}

            {items && items.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th id="name-header">Name</th>
                            <th>Lowest price</th>
                            <th>Grocery store</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((i) => (
                            <tr
                                className={
                                    i.item.isCompleted
                                        ? "item-row completed"
                                        : "item-row"
                                }
                                key={i.item.id}
                            >
                                <td className="checkbox">
                                    <img
                                        src={
                                            i.item.isCompleted
                                                ? CheckedCheckboxIcon
                                                : BlankCheckBoxIcon
                                        }
                                        alt="Checkbox button."
                                        onClick={() =>
                                            handleUpdateItem({
                                                ...i.item,
                                                isCompleted:
                                                    !i.item.isCompleted,
                                            })
                                        }
                                    />
                                </td>
                                <td className="name">{i.item.name}</td>
                                <td className="price">
                                    €{renderLowestPrice(i)}
                                </td>
                                <td>{renderGroceryStoreOfLowestPrice(i)}</td>
                                <td className="delete">
                                    <img
                                        src={DeleteIcon}
                                        alt="Delete button."
                                        onClick={() =>
                                            handleDeleteItem(i.item.id)
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {isEditing && (
                <form id="item-form" onSubmit={handleCreateNewItem}>
                    <input
                        id="input-new-item"
                        name="item"
                        placeholder="Type a new item here"
                        type="text"
                        autoComplete="off"
                        ref={inputRef}
                        value={itemName}
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

            {error.length > 0 && <span id="input-error">{error}</span>}

            <div id="button-row">
                {isEditing && (
                    <ButtonDanger
                        onClick={() => {
                            setIsEditing(false);
                            setIsInputTouched(false);
                            setError("");
                            setItemName("");
                            setIsButtonDisabled(false);
                        }}
                    >
                        Cancel
                    </ButtonDanger>
                )}

                <ButtonPrimary
                    onClick={() => {
                        if (!isEditing) {
                            setIsEditing(true);
                            setError("");
                        } else {
                            handleCreateNewItem();
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
