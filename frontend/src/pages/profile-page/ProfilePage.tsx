import { data } from "react-router";
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

    return (
        <div className="profile-card">
            <h1>Profile</h1>
            <div className="profile-field-group">
                <div className="profile-input-group">
                    <label htmlFor="first-name">First name</label>
                    <input
                        type="text"
                        id="first-name"
                        defaultValue={
                            currentUserWithItemsAndProducts?.firstName
                        }
                    />
                </div>

                <div className="profile-input-group">
                    <label htmlFor="last-name">Last name</label>
                    <input
                        type="text"
                        id="last-name"
                        defaultValue={currentUserWithItemsAndProducts?.lastName}
                    />
                </div>

                <div className="profile-input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        defaultValue={currentUserWithItemsAndProducts?.email}
                    />
                </div>
            </div>

            <div className="profile-field-group">
                <span className="profile-field-group-title">
                    Change password
                </span>
                <div className="profile-input-group">
                    <label htmlFor="old-password">Old password</label>
                    <input type="password" id="old-password" />
                </div>
                <div className="profile-input-group">
                    <label htmlFor="new-password">New password</label>
                    <input type="password" id="new-password" />
                </div>
            </div>
        </div>
    );
}
