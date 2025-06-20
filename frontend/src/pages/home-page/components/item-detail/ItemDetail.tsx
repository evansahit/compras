// import type { ItemWithProducts } from "../../../../types";
import { useEffect, useState } from "react";
import "./item-detail.css";
import { useParams } from "react-router";
import type { ProductOutput } from "../../../../types";
import { getProductsForItemByItemId } from "../../../../api/item";
import { useNavigate } from "react-router";
import BackIcon from "../../../../assets/icons/BackIcon";

export default function ItemDetail() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<ProductOutput[]>();
    const { itemId } = useParams();

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

        getProducts(itemId as string);
    }, [itemId, navigate]);

    return (
        <div className="item-container">
            <BackIcon color="var(--primary-color)" />
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
