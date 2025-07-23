import type { NavigateFunction } from "react-router";

export function redirectUserIfNotAuthed(navigate: NavigateFunction) {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) navigate("/signup-or-login");
}
