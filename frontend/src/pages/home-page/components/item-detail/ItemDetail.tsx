import "./item-detail.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { ProductOutput } from "../../../../types";
import { getProductsForItemByItemId } from "../../../../api/item";
import { useNavigate, useLocation } from "react-router";
import BackIcon from "../../../../assets/icons/BackIcon";

// TODO: - keep working on item detail component.
//       - center svg within span of icon components.
export default function ItemDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const { itemId } = useParams();
    const itemWithProducts = location.state;
    const [products, setProducts] = useState<ProductOutput[]>(
        itemWithProducts.products
    );

    const [error, setError] = useState("");

    useEffect(() => {
        if (!itemId || itemId.length === 0) navigate("/home");

        async function getProducts(itemId: string) {
            try {
                const products: ProductOutput[] =
                    await getProductsForItemByItemId(itemId);
                setProducts(products);
                setError("");
            } catch (e) {
                setError(
                    e instanceof Error
                        ? e.message
                        : "Something went wrong retrieving the products."
                );
            }
        }

        if (!itemWithProducts) getProducts(itemId as string);
    }, [itemWithProducts, itemId, navigate]);

    return (
        <div id="products-container">
            <div id="products-header">
                <BackIcon
                    color="var(--primary-color)"
                    onClick={() => navigate("/home")}
                />
                <span id="header-title">{itemWithProducts.item.name}</span>
            </div>

            {error && <p>{error}</p>}
            <ul>
                {products &&
                    products.map((p) => (
                        <li key={p.id}>
                            {p.name} - {p.price} - {p.priceDiscounted}
                        </li>
                    ))}
            </ul>
        </div>
    );
}
