import "./shopping-list.css";
import type { ItemUpdate, ItemWithProducts } from "../../../../types";
import { useEffect, useRef, useState } from "react";
import ButtonPrimary from "../../../../components/button/button-primary/ButtonPrimary";
import ButtonDanger from "../../../../components/button/button-danger/ButtonDanger";
import { validateItemName } from "../../../../utils/form-validation";
import { findCheapestProductForItem } from "../../../../utils/find-cheapest-product";
import CheckedCheckBox from "../../../../assets/icons/CheckedCheckBox";
import BlankCheckBoxIcon from "../../../../assets/icons/BlankCheckBoxIcon";
import DeleteIcon from "../../../../assets/icons/DeleteIcon";
import { deleteItem } from "../../../../api/item";
import { useNavigate } from "react-router";
import { MIN_ITEM_NAME_LENGTH } from "../../../../constants";

type ShoppingListProps = {
    userId: string;
    items: ItemWithProducts[];
    createItem: (userId: string, itemName: string) => Promise<void>;
    updateItem: (newItem: ItemUpdate) => Promise<void>;
    deleteItem: (itemId: string) => void;
    demoMode?: boolean;
};

export default function ShoppingList(props: ShoppingListProps) {
    const navigate = useNavigate();

    const [itemName, setItemName] = useState("");
    const [isInputTouched, setIsInputTouched] = useState(false);
    const [error, setError] = useState("");
    const items = props.items;

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const cancelledRef = useRef(false);

    function renderLowestPrice(item: ItemWithProducts): number | string {
        const cheapestProduct = findCheapestProductForItem(item);
        if (typeof cheapestProduct === "string") return cheapestProduct;
        if (cheapestProduct.priceDiscounted)
            return `€${cheapestProduct.priceDiscounted}`;

        return `€${cheapestProduct.price}`;
    }

    function renderGroceryStoreOfLowestPrice(item: ItemWithProducts): string {
        const cheapestProduct = findCheapestProductForItem(item);
        if (typeof cheapestProduct === "string") return cheapestProduct;

        return `${cheapestProduct.groceryStore}`;
    }

    async function handleCreateNewItem() {
        setError(validateItemName(itemName));
        if (error.length > 0 || itemName.length === 0) {
            return;
        } else {
            setIsLoading(true);
            setError("");

            try {
                await props.createItem(props.userId, itemName);

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

    async function handleUpdateItem(item: ItemUpdate) {
        const itemToFind = items.find((i) => i.item.id === item.id);
        // for when an item's name is updated
        const isItemNameUpdated: boolean =
            item.name.length >= MIN_ITEM_NAME_LENGTH &&
            itemToFind?.item.name !== item.name;

        if (isItemNameUpdated) {
            setError(validateItemName(itemName));
            if (error.length > 0 || itemName.length === 0) {
                return;
            } else {
                setIsLoading(true);
                setError("");
                setIsInputTouched(false);

                try {
                    props.updateItem(item);
                    setItemName("");
                } catch (error) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : `Something went wrong updating item ${item.name}.`
                    );
                } finally {
                    setIsLoading(false);
                }
            }
            // for when "isCompleted" is edited on an item
        } else {
            setIsLoading(true);
            setError("");
            setIsInputTouched(false);
            try {
                props.updateItem(item);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : `Something went wrong updating item ${item.name}.`
                );
            } finally {
                setIsLoading(false);
            }
        }
    }

    async function handleDeleteItem(itemId: string) {
        setIsLoading(true);

        try {
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
        }
    }, [error, isEditing, isInputTouched, isLoading, itemName]);

    useEffect(() => {
        if (!isEditing) {
            cancelledRef.current = false;
        }
    }, [isEditing]);

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
                                <td
                                    id="checkbox"
                                    onClick={
                                        props.demoMode
                                            ? () => null
                                            : () =>
                                                  handleUpdateItem({
                                                      ...i.item,
                                                      isCompleted:
                                                          !i.item.isCompleted,
                                                  })
                                    }
                                >
                                    {i.item.isCompleted ? (
                                        <CheckedCheckBox color="var(--primary-color)" />
                                    ) : (
                                        <BlankCheckBoxIcon color="var(--primary-color)" />
                                    )}
                                </td>
                                <td
                                    className="name"
                                    onClick={
                                        props.demoMode
                                            ? () => null
                                            : () =>
                                                  navigate(
                                                      `/home/items/${i.item.id}`,
                                                      { state: i }
                                                  )
                                    }
                                >
                                    {i.item.name}
                                </td>
                                <td
                                    className="price"
                                    onClick={
                                        props.demoMode
                                            ? () => null
                                            : () =>
                                                  navigate(
                                                      `/home/items/${i.item.id}`,
                                                      { state: i }
                                                  )
                                    }
                                >
                                    {renderLowestPrice(i)}
                                </td>
                                <td
                                    className="grocery-store"
                                    onClick={
                                        props.demoMode
                                            ? () => null
                                            : () =>
                                                  navigate(
                                                      `/home/items/${i.item.id}`,
                                                      { state: i }
                                                  )
                                    }
                                >
                                    {renderGroceryStoreOfLowestPrice(i)}
                                </td>
                                <td
                                    id="delete"
                                    onClick={
                                        props.demoMode
                                            ? () => null
                                            : () => handleDeleteItem(i.item.id)
                                    }
                                >
                                    <DeleteIcon color="var(--danger-color)" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {isEditing && (
                <form
                    id="item-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateNewItem();
                    }}
                >
                    <input
                        id="input-new-item"
                        name="item"
                        placeholder="Add a new item here"
                        type="text"
                        autoComplete="off"
                        ref={inputRef}
                        value={itemName}
                        onBlur={() => {
                            if (!cancelledRef.current) {
                                setIsInputTouched(true);
                            }
                        }}
                        onChange={(e) => setItemName(e.target.value)}
                    />
                </form>
            )}

            {error.length > 0 && <span id="input-error">{error}</span>}

            <div id="button-row">
                {isEditing && (
                    <ButtonDanger
                        onMouseDown={() => {
                            cancelledRef.current = true;
                        }}
                        onClick={
                            props.demoMode
                                ? () => null
                                : () => {
                                      setIsEditing(false);
                                      setIsInputTouched(false);
                                      setError("");
                                      setItemName("");
                                      setIsButtonDisabled(false);
                                  }
                        }
                    >
                        Cancel
                    </ButtonDanger>
                )}

                <ButtonPrimary
                    onClick={
                        props.demoMode
                            ? () => null
                            : () => {
                                  if (!isEditing) {
                                      setIsEditing(true);
                                      setError("");
                                  } else {
                                      handleCreateNewItem();
                                  }
                              }
                    }
                    disabled={isButtonDisabled}
                    isloading={isLoading}
                >
                    {isEditing ? "Save" : "Add item"}
                </ButtonPrimary>
            </div>
        </div>
    );
}
