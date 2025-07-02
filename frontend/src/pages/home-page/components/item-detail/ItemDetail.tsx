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
import { sortProductsByPriceAscending } from "../../../../utils/sortProductsByPrice";

export default function ItemDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const { itemId } = useParams();
    const [itemWithProducts, setItemWithProducts] = useState<ItemWithProducts>(
        location.state
    );

    const [products, setProducts] = useState<ProductOutput[] | null>(
        (itemWithProducts && sortProductsByPriceAscending(itemWithProducts)) ||
            null
    );

    const [isEditing, setIsEditing] = useState(false);
    const [updatedItemName, setUpdatedItemName] = useState(
        (itemWithProducts && itemWithProducts.item.name) || ""
    );
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState("");

    async function handleUpdateItem() {
        setIsLoading(true);
        if (itemWithProducts.item.name === updatedItemName) {
            setIsEditing(false);
            setIsLoading(false);

            return;
        }

        const inputError = validateItemName(updatedItemName);
        setError(inputError);

        if (inputError.length === 0) {
            try {
                const updatedItem = {
                    ...itemWithProducts.item,
                    name: updatedItemName,
                };
                await updateItem(updatedItem);

                setItemWithProducts({
                    ...itemWithProducts,
                    item: updatedItem,
                });
                // set products to null to trigger a reload of products data in useEffect below
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
                            onChange={(e) => setUpdatedItemName(e.target.value)}
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
                                itemWithProducts.item.name || ""
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
                    <span className="product-description-heading">Weight</span>
                    <p>{product.weight}</p>
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
