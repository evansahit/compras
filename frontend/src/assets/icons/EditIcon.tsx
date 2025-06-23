type EditIconProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    color?: string;
};

export default function EditIcon({ color, ...rest }: EditIconProps) {
    return (
        <span {...rest} style={{ display: "flex" }}>
            <svg
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                fill="var(--primary-color)"
            >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                    <path
                        stroke={color}
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3.8 12.963L2 18l4.8-.63L18.11 6.58a2.612 2.612 0 00-3.601-3.785L3.8 12.963z"
                    ></path>
                </g>
            </svg>
        </span>
    );
}
