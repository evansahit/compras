import "./shopping-list.css";
import type { ItemUpdate, ItemOutput, ItemWithProducts } from "../../../types";
import { useEffect, useState } from "react";
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
                setItemName("");
            }
        }
    }

    async function handleUpdateItem(newItem: ItemUpdate) {
        if (isEditing) {
            setError(validateItemName(itemName));
            if (error.length > 0 || itemName.length === 0) {
                return;
            } else {
                setIsLoading(true);
                setError("");

                try {
                    const updatedItem: ItemOutput = await updateItem(newItem);
                    props.updateItem(updatedItem);
                } catch (error) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : `Something went wrong updating item ${newItem.name}.`
                    );
                }

                setIsLoading(false);
                setItemName("");
            }
        } else {
            setIsLoading(true);

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
            setIsButtonDisabled(true);
            if (itemName.length >= 2) {
                setIsButtonDisabled(false);
                setError("");
            }

            // if (error.length > 0) {
            //     setError(validateItemName(itemName));
            //     setIsButtonDisabled(
            //         error.length > 0 || itemName.length === 0 ? true : false
            //     );
            // }

            if (isInputTouched) {
                setError(validateItemName(itemName));
                setIsButtonDisabled(
                    error.length > 0 || itemName.length === 0 ? true : false
                );
            }
        }
    }, [error.length, isEditing, isInputTouched, itemName]);

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
                                    i.item.isCompleted ? "completed" : ""
                                }
                                key={i.item.id}
                            >
                                <td id="checkbox">
                                    <img
                                        src={
                                            i.item.isCompleted
                                                ? CheckedCheckboxIcon
                                                : BlankCheckBoxIcon
                                        }
                                        alt="Checkbox button."
                                        width={20}
                                        onClick={() =>
                                            handleUpdateItem({
                                                ...i.item,
                                                isCompleted:
                                                    !i.item.isCompleted,
                                            })
                                        }
                                    />
                                </td>
                                <td id="name">{i.item.name}</td>
                                <td id="price">€{renderLowestPrice(i)}</td>
                                <td>{renderGroceryStoreOfLowestPrice(i)}</td>
                                <td id="delete">
                                    <img
                                        src={DeleteIcon}
                                        alt="Delete button."
                                        width={20}
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
                            setIsButtonDisabled(false);
                            setIsInputTouched(false);
                            setError("");
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
