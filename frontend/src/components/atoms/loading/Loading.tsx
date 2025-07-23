import "./loading.css";

interface LoadingProps {
    className?: string;
}

export default function Loading({ className }: LoadingProps) {
    return (
        <h1 id="loading" className={`${className}`}>
            Loading...
        </h1>
    );
}
