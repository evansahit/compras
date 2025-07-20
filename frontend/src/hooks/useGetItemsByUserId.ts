import { useEffect, useState } from "react";
import type { ItemWithProducts } from "../types";
import { getItemsByUserId } from "../api/user";
import { handleDefaultErrors } from "../api/utils";
import { logout } from "../api/auth";
import { useNavigate } from "react-router";

export default function useGetItemsByUserId(userId: string) {
    const navigate = useNavigate();
    const [data, setData] = useState<ItemWithProducts[]>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const res = await getItemsByUserId(userId);
                setData(res);
            } catch (error) {
                setError(handleDefaultErrors(error));
                logout(navigate);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [navigate, userId]);

    return { data, isLoading, error };
}
