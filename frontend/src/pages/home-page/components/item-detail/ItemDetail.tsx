import "./item-detail.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { ItemWithProducts, ProductOutput } from "../../../../types";
import { getProductsForItemByItemId } from "../../../../api/item";
import { useNavigate, useLocation } from "react-router";
import BackIcon from "../../../../assets/icons/BackIcon";
import EditIcon from "../../../../assets/icons/EditIcon";
import { validateItemName } from "../../../../utils/form-validation";
import CancelIcon from "../../../../assets/icons/CancelIcon";
import { updateItem } from "../../../../api/item";
import ButtonSecondary from "../../../../components/button/button-secondary/ButtonSecondary";

export default function ItemDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const { itemId } = useParams();
    const [itemWithProducts, setItemWithProducts] =
        useState<ItemWithProducts | null>(location.state);
    const [products, setProducts] = useState<ProductOutput[] | null>(
        itemWithProducts?.products || null
    );

    const [isEditing, setIsEditing] = useState(false);
    const [updatedItemName, setUpdatedItemName] = useState(
        itemWithProducts?.item.name || ""
    );
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState("");

    async function handleUpdateItem(updatedItemName: string) {
        setIsLoading(true);
        if (itemWithProducts?.item.name === updatedItemName) {
            setIsEditing(false);

            return;
        }

        const inputError = validateItemName(updatedItemName) || "";
        setError(inputError);

        if (inputError.length === 0 && itemWithProducts) {
            try {
                const updatedItem = {
                    ...itemWithProducts.item,
                    name: updatedItemName,
                };
                await updateItem(updatedItem);

                setItemWithProducts({
                    ...itemWithProducts,
                    item: {
                        ...itemWithProducts.item,
                        name: updatedItemName,
                    },
                });
                setProducts(null);
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
        if (!itemId || itemId.length === 0) navigate("/home");

        async function getProducts(itemId: string) {
            try {
                const products: ProductOutput[] =
                    await getProductsForItemByItemId(itemId);
                setProducts(products);
                setError("");
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong retrieving the products."
                );
            }
        }

        if (!products) getProducts(itemId as string);
    }, [products, itemId, navigate]);

    return (
        <div id="products-container">
            <div id="products-header">
                <BackIcon
                    id="back-icon"
                    color="var(--background-color)"
                    onClick={() => navigate("/home")}
                />
                {isEditing ? (
                    <span id="item-name-update">
                        <input
                            type="text"
                            value={updatedItemName}
                            onChange={(e) => setUpdatedItemName(e.target.value)}
                        />
                        <ButtonSecondary
                            id="item-edit-save-button"
                            onClick={() => {
                                handleUpdateItem(updatedItemName);
                            }}
                            isloading={isLoading}
                        >
                            Save
                        </ButtonSecondary>
                    </span>
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

            {products && products.length === 0 && (
                <span id="products-default-message">
                    No products found for this item.
                </span>
            )}

            {error && <p id="item-detail-error">{error}</p>}
            <ul id="product-cards-container">
                {products &&
                    products.map((p) => <ProductCard key={p.id} product={p} />)}
            </ul>
        </div>
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
                    <span className="product-description-heading">Price</span>
                    <p id={product.priceDiscounted > 0 ? "price-invalid" : ""}>
                        €{product.price}
                    </p>
                    {product.priceDiscounted > 0 && (
                        <>
                            <span className="product-description-heading">
                                Price after discount
                            </span>
                            <p>€{product.priceDiscounted}</p>
                        </>
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
