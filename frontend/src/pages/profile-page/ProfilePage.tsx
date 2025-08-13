import { useEffect, useState } from "react";
import useCurrentUserWithItemsAndProducts from "../../hooks/useCurrentUserWithItemsAndProducts";
import "./profile-page.css";
import Loading from "../../components/atoms/loading/Loading";
import Error from "../../components/atoms/error/Error";
import ButtonDanger from "../../components/atoms/button/button-danger/ButtonDanger";
import ButtonPrimary from "../../components/atoms/button/button-primary/ButtonPrimary";
import {
    validateEmail,
    validateFirstName,
    validatePassword,
    validatePasswordsMatch,
} from "../../utils/form-validation";

export default function ProfilePage() {
    const {
        data: currentUserWithItemsAndProducts,
        isLoading,
        error,
        handleUpdateUser,
        handlePasswordUpdate,
        handleClearError,
        handleSetError,
    } = useCurrentUserWithItemsAndProducts();

    const [userInfoUpdateState, setUserInfoUpdateState] = useState({
        isEditing: false,

        id: "",

        firstName: "",
        firstNameError: "",
        isFirstNameTouched: false,

        lastName: "",

        email: "",
        emailError: "",
        isEmailTouched: false,

        isSubmitButtonDisabled: false,
    });

    const [passwordUpdateState, setPasswordUpdateState] = useState({
        isEditing: false,

        oldPassword: "",
        isOldPasswordTouched: false,
        oldPasswordError: "",

        newPassword: "",
        isNewPasswordTouched: false,
        newPasswordError: "",

        confirmNewPassword: "",
        isConfirmPasswordTouched: false,
        confirmPasswordError: "",

        isSubmitButtonDisabled: false,
    });

    function handleCancelUserInfoUpdate() {
        setUserInfoUpdateState((prev) => {
            return {
                ...prev,
                firstName: currentUserWithItemsAndProducts?.firstName ?? "",
                firstNameError: "",
                isFirstNameTouched: false,
                lastName: currentUserWithItemsAndProducts?.lastName ?? "",
                email: currentUserWithItemsAndProducts?.email ?? "",
                emailError: "",
                isEmailTouched: false,
                isEditing: false,
                isSubmitButtonDisabled: false,
            };
        });
    }

    async function handleUserInfoUpdateSubmit() {
        if (!currentUserWithItemsAndProducts) {
            handleSetError(
                "Something went wrong updating your information. Please try again."
            );
            return;
        }

        const userInfoData = {
            firstName: userInfoUpdateState.firstName,
            lastName: userInfoUpdateState.lastName,
            email: userInfoUpdateState.email,
        };

        await handleUpdateUser(
            currentUserWithItemsAndProducts?.id,
            userInfoData
        );
        setUserInfoUpdateState((prev) => ({ ...prev, isEditing: false }));
    }

    function handleCancelPasswordUpdate() {
        setPasswordUpdateState({
            isEditing: false,

            oldPassword: "",
            isOldPasswordTouched: false,
            oldPasswordError: "",

            newPassword: "",
            isNewPasswordTouched: false,
            newPasswordError: "",

            confirmNewPassword: "",
            isConfirmPasswordTouched: false,
            confirmPasswordError: "",
            isSubmitButtonDisabled: false,
        });
    }

    async function handlePasswordUpdateSubmit() {
        if (!currentUserWithItemsAndProducts) {
            handleSetError(
                "Something went wrong changing your password. Please try again."
            );
            return;
        }

        await handlePasswordUpdate(
            currentUserWithItemsAndProducts?.id,
            passwordUpdateState.oldPassword,
            passwordUpdateState.newPassword
        );

        setPasswordUpdateState((prev) => ({
            ...prev,
            isEditing: false,
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
            newPasswordError: "",
            oldPasswordError: "",
            confirmPasswordError: "",
            isOldPasswordTouched: false,
            isNewPasswordTouched: false,
            isConfirmPasswordTouched: false,
        }));
    }

    useEffect(() => {
        // form validation for personal info
        if (userInfoUpdateState.isEditing) {
            if (userInfoUpdateState.isFirstNameTouched)
                setUserInfoUpdateState((prev) => ({
                    ...prev,
                    firstNameError: validateFirstName(
                        userInfoUpdateState.firstName
                    ),
                }));
            if (userInfoUpdateState.isEmailTouched)
                setUserInfoUpdateState((prev) => ({
                    ...prev,
                    emailError: validateEmail(userInfoUpdateState.email),
                }));

            if (
                userInfoUpdateState.firstNameError.length > 0 ||
                userInfoUpdateState.emailError.length > 0
            )
                setUserInfoUpdateState((prev) => ({
                    ...prev,
                    isSubmitButtonDisabled: true,
                }));
            else
                setUserInfoUpdateState((prev) => ({
                    ...prev,
                    isSubmitButtonDisabled: false,
                }));
        } else {
            setUserInfoUpdateState((prev) => {
                if (!currentUserWithItemsAndProducts) return prev;

                return {
                    ...prev,
                    id: currentUserWithItemsAndProducts?.id,
                    firstName: currentUserWithItemsAndProducts?.firstName,
                    lastName: currentUserWithItemsAndProducts?.lastName,
                    email: currentUserWithItemsAndProducts?.email,
                };
            });
        }

        // form validation for password change
        if (passwordUpdateState.isEditing) {
            if (passwordUpdateState.isOldPasswordTouched) {
                setPasswordUpdateState((prev) => ({
                    ...prev,
                    oldPasswordError: validatePassword(
                        passwordUpdateState.oldPassword
                    ),
                }));
            }

            if (passwordUpdateState.isNewPasswordTouched) {
                setPasswordUpdateState((prev) => ({
                    ...prev,
                    newPasswordError: validatePassword(
                        passwordUpdateState.newPassword
                    ),
                }));
            }

            if (
                passwordUpdateState.isOldPasswordTouched &&
                passwordUpdateState.isNewPasswordTouched
            ) {
                if (
                    passwordUpdateState.oldPassword ===
                    passwordUpdateState.newPassword
                ) {
                    setPasswordUpdateState((prev) => ({
                        ...prev,
                        newPasswordError:
                            "Your new password must be different from your old password",
                    }));
                }
            }

            if (passwordUpdateState.isConfirmPasswordTouched) {
                setPasswordUpdateState((prev) => ({
                    ...prev,
                    confirmPasswordError: validatePassword(
                        passwordUpdateState.confirmNewPassword
                    ),
                }));
            }

            if (
                passwordUpdateState.isNewPasswordTouched &&
                passwordUpdateState.isConfirmPasswordTouched
            ) {
                setPasswordUpdateState((prev) => ({
                    ...prev,
                    confirmPasswordError: validatePasswordsMatch(
                        passwordUpdateState.newPassword,
                        passwordUpdateState.confirmNewPassword
                    ),
                }));
            }
        }
    }, [
        currentUserWithItemsAndProducts,
        passwordUpdateState.confirmNewPassword,
        passwordUpdateState.isConfirmPasswordTouched,
        passwordUpdateState.isEditing,
        passwordUpdateState.isNewPasswordTouched,
        passwordUpdateState.isOldPasswordTouched,
        passwordUpdateState.newPassword,
        passwordUpdateState.oldPassword,
        userInfoUpdateState.email,
        userInfoUpdateState.emailError.length,
        userInfoUpdateState.firstName,
        userInfoUpdateState.firstNameError.length,
        userInfoUpdateState.isEditing,
        userInfoUpdateState.isEmailTouched,
        userInfoUpdateState.isFirstNameTouched,
    ]);

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
                        value={userInfoUpdateState.firstName}
                        onChange={(e) => {
                            setUserInfoUpdateState((prev) => {
                                const newValue = e.target.value;
                                if (!newValue) return prev;

                                return {
                                    ...prev,
                                    isEditing: true,
                                    firstName: newValue,
                                };
                            });
                        }}
                        onBlur={() =>
                            setUserInfoUpdateState((prev) => ({
                                ...prev,
                                isFirstNameTouched: true,
                            }))
                        }
                    />
                    <span className="input-error">
                        {userInfoUpdateState.firstNameError}
                    </span>
                </div>

                <div className="profile-input-group">
                    <label htmlFor="last-name">Last name</label>
                    <input
                        type="text"
                        id="last-name"
                        value={userInfoUpdateState.lastName}
                        onChange={(e) => {
                            setUserInfoUpdateState((prev) => {
                                return {
                                    ...prev,
                                    lastName: e.target.value,
                                    isEditing: true,
                                };
                            });
                        }}
                    />
                </div>

                <div className="profile-input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={userInfoUpdateState.email}
                        onChange={(e) => {
                            setUserInfoUpdateState((prev) => {
                                const newValue = e.target.value;
                                if (!newValue) return prev;

                                return {
                                    ...prev,
                                    email: newValue,
                                    isEditing: true,
                                };
                            });
                        }}
                        onBlur={() =>
                            setUserInfoUpdateState((prev) => ({
                                ...prev,
                                isEmailTouched: true,
                            }))
                        }
                    />
                    <span className="input-error">
                        {userInfoUpdateState.emailError}
                    </span>
                </div>

                {userInfoUpdateState.isEditing && (
                    <div className="button-row">
                        <ButtonDanger
                            onClick={() => {
                                handleCancelUserInfoUpdate();
                            }}
                        >
                            Cancel
                        </ButtonDanger>
                        <ButtonPrimary
                            onClick={() => handleUserInfoUpdateSubmit()}
                            disabled={
                                userInfoUpdateState.isSubmitButtonDisabled
                            }
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
                    <input
                        type="password"
                        id="old-password"
                        value={passwordUpdateState.oldPassword}
                        onChange={(e) => {
                            setPasswordUpdateState((prev) => ({
                                ...prev,
                                isEditing: true,
                                oldPassword: e.target.value,
                            }));
                        }}
                        onBlur={() => {
                            setPasswordUpdateState((prev) => ({
                                ...prev,
                                isOldPasswordTouched: true,
                            }));
                        }}
                    />
                    <span className="input-error">
                        {passwordUpdateState.oldPasswordError}
                    </span>
                </div>
                <div className="profile-input-group">
                    <label htmlFor="new-password">New password</label>
                    <input
                        type="password"
                        id="new-password"
                        value={passwordUpdateState.newPassword}
                        onChange={(e) => {
                            setPasswordUpdateState((prev) => ({
                                ...prev,
                                isEditing: true,
                                newPassword: e.target.value,
                            }));
                        }}
                        onBlur={() => {
                            setPasswordUpdateState((prev) => ({
                                ...prev,
                                isNewPasswordTouched: true,
                            }));
                        }}
                    />
                    <span className="input-error">
                        {passwordUpdateState.newPasswordError}
                    </span>
                </div>
                <div className="profile-input-group">
                    <label htmlFor="confirm-new-password">
                        Confirm new password
                    </label>
                    <input
                        type="password"
                        id="confirm-new-password"
                        value={passwordUpdateState.confirmNewPassword}
                        onChange={(e) => {
                            setPasswordUpdateState((prev) => ({
                                ...prev,
                                isEditing: true,
                                confirmNewPassword: e.target.value,
                            }));
                        }}
                        onBlur={() => {
                            setPasswordUpdateState((prev) => ({
                                ...prev,
                                isConfirmPasswordTouched: true,
                            }));
                        }}
                    />
                    <span className="input-error">
                        {passwordUpdateState.confirmPasswordError}
                    </span>
                </div>

                {passwordUpdateState.isEditing && (
                    <div className="button-row">
                        <ButtonDanger
                            onClick={() => {
                                handleCancelPasswordUpdate();
                            }}
                        >
                            Cancel
                        </ButtonDanger>
                        <ButtonPrimary
                            onClick={() => handlePasswordUpdateSubmit()}
                            disabled={
                                passwordUpdateState.isSubmitButtonDisabled
                            }
                        >
                            Save
                        </ButtonPrimary>
                    </div>
                )}
            </div>
        </div>
    );
}
