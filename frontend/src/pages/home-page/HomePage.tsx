import "./home-page.css";
import ShoppingList from "./components/shopping-list/ShoppingList";
import useCurrentUserWithItemsAndProducts from "../../hooks/useCurrentUserWithItemsAndProducts";
import Loading from "../../components/atoms/loading/Loading";
import Error from "../../components/atoms/error/Error";

export default function HomePage() {
    const {
        data: currentUserWithItemsAndProducts,
        isLoading: isCurrentUserLoading,
        error: currentUserError,
        handleCreateNewItem,
        handleUpdateItem,
        handleDeleteItem,
    } = useCurrentUserWithItemsAndProducts();

    return (
        <>
            {isCurrentUserLoading ? (
                <Loading />
            ) : (
                <>
                    {currentUserError ? (
                        <Error>{currentUserError}</Error>
                    ) : (
                        <>
                            <span id="greeting">
                                Hey{" "}
                                {currentUserWithItemsAndProducts
                                    ? currentUserWithItemsAndProducts.firstName
                                    : "Pal"}
                            </span>
                            <h1 id="home-page-title">Shopping list</h1>
                            <p id="home-page-message">
                                Products will be searched and matched based on
                                the names of your items, so these will need to
                                be written in Dutch.
                            </p>

                            {currentUserWithItemsAndProducts && (
                                <ShoppingList
                                    userId={currentUserWithItemsAndProducts.id}
                                    items={
                                        currentUserWithItemsAndProducts.itemsWithProducts
                                    }
                                    createItem={handleCreateNewItem}
                                    updateItem={handleUpdateItem}
                                    deleteItem={handleDeleteItem}
                                />
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
}
