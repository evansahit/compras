const emailErrors = {
    empty: "Email is required",
    invalid: "Email is invalid",
};

const passwordErrors = {
    empty: "Password is required",
    noMatch: "Passwords need to match",
};

function validateEmail(email: string): string {
    if (email.trim().length === 0) {
        return emailErrors.empty;
    }
    if (!email.includes("@")) {
        return emailErrors.invalid;
    }
    if (email.split("@").length - 1 > 1) {
        return emailErrors.invalid;
    }

    const domain: string = email.split("@")[1];
    const domain_components: string[] = domain.split(".");
    if (domain_components.length > 1 && domain_components[1].length === 0) {
        return emailErrors.invalid;
    }
    if (!domain.includes(".")) {
        return emailErrors.invalid;
    }

    return "";
}

function validatePassword(password: string): string {
    if (password.trim().length === 0) {
        return passwordErrors.empty;
    }

    return "";
}

function validatePasswordsMatch(passwordA: string, passwordB: string): string {
    if (
        passwordA.length !== 0 &&
        passwordB.length !== 0 &&
        passwordA !== passwordB
    )
        return passwordErrors.noMatch;

    return "";
}

export { validateEmail, validatePassword, validatePasswordsMatch };
