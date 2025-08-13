import { useEffect, useState } from "react";
import type { UserOutput } from "../types";
import { getCurrentUser } from "../api/user";
import { handleDefaultErrors } from "../api/utils";
import { useNavigate } from "react-router";

export default function useGetCurrentUser() {
    const navigate = useNavigate();
    const [data, setData] = useState<UserOutput>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const res = await getCurrentUser();
                setData(res);
            } catch (error) {
                setError(handleDefaultErrors(error));
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    return { data, isLoading, error };
}
