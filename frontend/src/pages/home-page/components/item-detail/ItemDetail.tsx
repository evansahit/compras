// import type { ItemWithProducts } from "../../../../types";
import "./item-detail.css";
import { useParams } from "react-router";

type ItemDetailProps = {};

export default function ItemDetail(props: ItemDetailProps) {
    const { itemId } = useParams();

    return <div className="item-container">Item id: {itemId}</div>;
}
