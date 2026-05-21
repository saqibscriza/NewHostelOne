import React from "react";

const DefaultTable = ({
    title = "No Data Found",
    description = "No records are available right now.",
    buttonText = "",
    onButtonClick,
    height = "500px",
}) => {
    return (
        <div
            style={{
                width: "100%",
                minHeight: height,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f8f9fb",
                borderRadius: "12px",
                padding: "20px",
            }}
        >
            <div
                style={{
                    textAlign: "center",
                    maxWidth: "450px",
                    width: "100%",
                }}
            >
                {/* ICON */}
                <div
                    style={{
                        width: "100px",
                        height: "100px",
                        border: "2px dashed #d1d5db",
                        borderRadius: "50%",
                        margin: "0 auto 24px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                        background: "#fff",
                    }}
                >
                    {/* FILE ICON */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="42"
                        height="42"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M8 3h8l3 3v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
                            stroke="#c4c4c4"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M9 9h6M9 13h6M9 17h4"
                            stroke="#c4c4c4"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                        />
                    </svg>

                    {/* SEARCH ICON */}
                    <div
                        style={{
                            position: "absolute",
                            right: "-6px",
                            bottom: "8px",
                            width: "34px",
                            height: "34px",
                            borderRadius: "50%",
                            background: "#fff",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                cx="11"
                                cy="11"
                                r="7"
                                stroke="#c4c4c4"
                                strokeWidth="2"
                            />
                            <path
                                d="M20 20L17 17"
                                stroke="#c4c4c4"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                </div>

                {/* TITLE */}
                <h2
                    style={{
                        fontSize: "32px",
                        fontWeight: "700",
                        color: "#111827",
                        marginBottom: "12px",
                    }}
                >
                    {title}
                </h2>

                {/* DESCRIPTION */}
                <p
                    style={{
                        fontSize: "18px",
                        lineHeight: "30px",
                        color: "#6b7280",
                        marginBottom: buttonText ? "35px" : "0px",
                    }}
                >
                    {description}
                </p>

                {/* BUTTON */}
                {buttonText && (
                    <button
                        onClick={onButtonClick}
                        style={{
                            background: "#d90429",
                            color: "#fff",
                            border: "none",
                            borderRadius: "14px",
                            padding: "10px 20px",
                            fontSize: "17px",
                            fontWeight: "600",
                            cursor: "pointer",
                            boxShadow: "0 8px 20px rgba(217,4,41,0.22)",
                            transition: "0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0px)";
                        }}
                    >
                        {buttonText}
                    </button>
                )}
            </div>
        </div>
    );
};

export default DefaultTable;