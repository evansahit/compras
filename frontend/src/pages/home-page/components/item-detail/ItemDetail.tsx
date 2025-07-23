import "./item-detail.css";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import type { ItemUpdate, ProductOutput } from "../../../../types";
import { useNavigate } from "react-router";
import BackIcon from "../../../../assets/icons/BackIcon";
import EditIcon from "../../../../assets/icons/EditIcon";
import { validateItemName } from "../../../../utils/form-validation";
import CancelIcon from "../../../../assets/icons/CancelIcon";
import ButtonSecondary from "../../../../components/button/button-secondary/ButtonSecondary";
import { sortProductsByPriceAscending } from "../../../../utils/sortProductsByPrice";
import useCurrentUserWithItemsAndProducts from "../../../../hooks/useCurrentUserWithItemsAndProducts";
import Loading from "../../../../components/atoms/loading/Loading";

export default function ItemDetail() {
    const navigate = useNavigate();
    const {
        data: userWithItemsAndProducts,
        handleUpdateItem: updateItemFunction,
        isLoading: isDataLoading,
        refreshData,
    } = useCurrentUserWithItemsAndProducts();

    const { itemId } = useParams();
    const itemWithProducts = useMemo(() => {
        return userWithItemsAndProducts?.itemsWithProducts.find(
            (i) => i.item.id === itemId
        );
    }, [userWithItemsAndProducts, itemId]);

    const sortedProducts = useMemo(() => {
        return itemWithProducts
            ? sortProductsByPriceAscending(itemWithProducts)
            : null;
    }, [itemWithProducts]);

    const [updatedItemName, setUpdatedItemName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleUpdateItem() {
        setIsLoading(true);
        if (itemWithProducts?.item.name === updatedItemName) {
            setIsEditing(false);
            setIsLoading(false);

            return;
        }

        const inputError = validateItemName(updatedItemName || "");
        setError(inputError);
        if (inputError.length === 0) {
            try {
                const updatedItem: ItemUpdate = {
                    id: itemWithProducts?.item.id as string,
                    isCompleted: itemWithProducts?.item.isCompleted as boolean,
                    isArchived: itemWithProducts?.item.isArchived as boolean,
                    name: updatedItemName as string,
                };

                await updateItemFunction(updatedItem);
                await refreshData();
                setIsEditing(false);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : `Something went updating this item.`
                );
            } finally {
                setIsLoading(false);
            }
        }
    }

    useEffect(() => {
        if (itemWithProducts) {
            setUpdatedItemName(itemWithProducts.item.name);
        }
    }, [itemWithProducts]);

    useEffect(() => {
        if (!itemId || itemId.length === 0) navigate("/home");
    }, [sortedProducts, itemId, navigate]);

    return (
        <>
            {isDataLoading ? (
                <Loading />
            ) : (
                <div id="products-container">
                    <div id="products-header">
                        <BackIcon
                            id="back-icon"
                            color="var(--background-color)"
                            onClick={() => navigate("/home")}
                        />
                        {isEditing ? (
                            <form
                                id="item-name-update"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleUpdateItem();
                                }}
                            >
                                <input
                                    type="text"
                                    value={updatedItemName}
                                    onChange={(e) =>
                                        setUpdatedItemName(e.target.value)
                                    }
                                />
                                <ButtonSecondary
                                    id="item-edit-save-button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleUpdateItem();
                                    }}
                                    isloading={isLoading}
                                >
                                    Save
                                </ButtonSecondary>
                            </form>
                        ) : (
                            <span id="products-header-title">
                                {itemWithProducts && itemWithProducts.item.name}
                            </span>
                        )}

                        {isEditing ? (
                            <CancelIcon
                                id="cancel-icon"
                                color="var(--background-color)"
                                onClick={() => {
                                    setIsEditing(false);
                                    setUpdatedItemName(
                                        itemWithProducts?.item.name || ""
                                    );
                                }}
                            />
                        ) : (
                            <EditIcon
                                id="edit-icon"
                                color="var(--background-color)"
                                onClick={() => {
                                    setIsEditing(true);
                                }}
                            />
                        )}
                    </div>

                    {error && <p id="item-detail-error">{error}</p>}

                    <ul id="product-cards-container">
                        {sortedProducts ? (
                            sortedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))
                        ) : (
                            <span id="products-default-message">
                                No products found for this item.
                            </span>
                        )}
                    </ul>
                </div>
            )}
        </>
    );
}

function ProductCard({ product }: { product: ProductOutput }) {
    return (
        <div id="product-card">
            <div id="product-description">
                <div className="product-description-field">
                    <span className="product-description-heading">Name</span>
                    <p>{product.name}</p>
                </div>
                <div className="product-description-field">
                    <span className="product-description-heading">
                        Grocery store
                    </span>
                    <p>{product.groceryStore}</p>
                </div>
                <div className="product-description-field">
                    <span className="product-description-heading">Weight</span>
                    <p>{product.weight || "No weight information found."}</p>
                </div>
                <div className="product-description-field">
                    <span className="product-description-heading">Price</span>
                    <p id={product.priceDiscounted > 0 ? "price-invalid" : ""}>
                        €{product.price}
                    </p>
                    {product.priceDiscounted > 0 && (
                        <p>€{product.priceDiscounted}</p>
                    )}
                </div>
            </div>
            <img
                id="product-image"
                src={product.imageUrl}
                alt={`Image of ${product.name}`}
            />
        </div>
    );
}
