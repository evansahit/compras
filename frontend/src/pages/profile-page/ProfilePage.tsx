import useCurrentUserWithItemsAndProducts from "../../hooks/useCurrentUserWithItemsAndProducts";
import "./profile-page.css";

export default function ProfilePage() {
    const {
        data: currentUserWithItemsAndProducts,
        isLoading: isCurrentUserLoading,
        error: currentUserError,
        handleCreateNewItem,
        handleUpdateItem,
        handleDeleteItem,
    } = useCurrentUserWithItemsAndProducts();

    return <div className="profile-page">profile page</div>;
}
