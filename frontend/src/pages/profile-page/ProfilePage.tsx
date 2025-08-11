import { useEffect, useState } from "react";
import useCurrentUserWithItemsAndProducts from "../../hooks/useCurrentUserWithItemsAndProducts";
import "./profile-page.css";
import Loading from "../../components/atoms/loading/Loading";
import Error from "../../components/atoms/error/Error";
import ButtonDanger from "../../components/atoms/button/button-danger/ButtonDanger";
import ButtonPrimary from "../../components/atoms/button/button-primary/ButtonPrimary";
import { validateEmail, validateFirstName } from "../../utils/form-validation";

export default function ProfilePage() {
    const {
        data: currentUserWithItemsAndProducts,
        isLoading,
        error,
        handleUpdateUser,
        handleClearError,
    } = useCurrentUserWithItemsAndProducts();

    const [isEditing, setIsEditing] = useState(false);
    const [editedUserInfo, setEditedUserInfo] = useState({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
    });
    // console.log("[debug] editedUserInfo:", editedUserInfo);
    const [firstNameError, setFirstNameError] = useState("");
    // console.log("[debug] firstNameError:", firstNameError);
    const [emailError, setEmailError] = useState("");
    // console.log("[debug] emailError:", emailError);
    const [isFirstNameTouched, setIsFirstNameTouched] = useState(false);
    const [isEmailTouched, setIsEmailTouched] = useState(false);
    const [isUserInfoSubmitButtonDisabled, setIsUserInfoSubmitButtonDisabled] =
        useState(false);
    // console.log(
    //     "[debug] isUserInfoSubmitButtonDisabled:",
    //     isUserInfoSubmitButtonDisabled
    // );

    function handleCancelUserUpdate() {
        setEditedUserInfo({
            id: currentUserWithItemsAndProducts?.id ?? "",
            firstName: currentUserWithItemsAndProducts?.firstName ?? "",
            lastName: currentUserWithItemsAndProducts?.lastName ?? "",
            email: currentUserWithItemsAndProducts?.email ?? "",
        });
        setFirstNameError("");
        setEmailError("");
        setIsEditing(false);
    }

    function handleUserUpdateSubmit() {
        handleUpdateUser(editedUserInfo);
        setIsEditing(false);
    }

    useEffect(() => {
        if (isEditing) {
            if (isFirstNameTouched)
                setFirstNameError(validateFirstName(editedUserInfo.firstName));
            if (isEmailTouched)
                setEmailError(validateEmail(editedUserInfo.email));

            if (firstNameError.length > 0 || emailError.length > 0)
                setIsUserInfoSubmitButtonDisabled(true);
            else setIsUserInfoSubmitButtonDisabled(false);
        } else {
            setEditedUserInfo((prev) => {
                if (!currentUserWithItemsAndProducts) return prev;

                return {
                    id: currentUserWithItemsAndProducts?.id,
                    firstName: currentUserWithItemsAndProducts?.firstName,
                    lastName: currentUserWithItemsAndProducts?.lastName,
                    email: currentUserWithItemsAndProducts?.email,
                };
            });
        }
    }, [
        currentUserWithItemsAndProducts,
        editedUserInfo.email,
        editedUserInfo.firstName,
        emailError,
        firstNameError,
        isEditing,
        isEmailTouched,
        isFirstNameTouched,
    ]);

    // TODO: error is blocking the whole page with no way of clicking it away.
    return (
        <div className="profile-card">
            {isLoading && <Loading />}
            {error && (
                <Error handleClearError={handleClearError}>{error}</Error>
            )}

            <h1>Profile</h1>
            <div className="profile-field-group">
                <span className="profile-field-group-title">Personal info</span>
                <div className="profile-input-group">
                    <label htmlFor="first-name">First name</label>
                    <input
                        type="text"
                        id="first-name"
                        value={editedUserInfo.firstName}
                        onChange={(e) => {
                            setIsEditing(true);
                            setEditedUserInfo((prev) => ({
                                ...prev,
                                firstName: e.target.value,
                            }));
                        }}
                        onBlur={() => setIsFirstNameTouched(true)}
                    />
                    <span className="input-error">{firstNameError}</span>
                </div>

                <div className="profile-input-group">
                    <label htmlFor="last-name">Last name</label>
                    <input
                        type="text"
                        id="last-name"
                        value={editedUserInfo.lastName}
                        onChange={(e) => {
                            setIsEditing(true);
                            setEditedUserInfo((prev) => ({
                                ...prev,
                                lastName: e.target.value,
                            }));
                        }}
                    />
                </div>

                <div className="profile-input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={editedUserInfo.email}
                        onChange={(e) => {
                            setIsEditing(true);
                            setEditedUserInfo((prev) => ({
                                ...prev,
                                email: e.target.value,
                            }));
                        }}
                        onBlur={() => setIsEmailTouched(true)}
                    />
                    <span className="input-error">{emailError}</span>
                </div>

                {isEditing && (
                    <div className="button-row">
                        <ButtonDanger
                            onClick={() => {
                                handleCancelUserUpdate();
                            }}
                        >
                            Cancel
                        </ButtonDanger>
                        <ButtonPrimary
                            onClick={() => handleUserUpdateSubmit()}
                            disabled={isUserInfoSubmitButtonDisabled}
                        >
                            Save
                        </ButtonPrimary>
                    </div>
                )}
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
