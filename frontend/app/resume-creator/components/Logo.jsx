import React from 'react';

const ResumyLogo = ({ className = '', size = 24, showText = true, textColor = 'text-stone-900' }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div
                className="flex items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-200"
                style={{ width: size, height: size }}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: size * 0.6, height: size * 0.6 }}
                >
                    <path
                        d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M7 7H17"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M7 12H17"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M7 17H13"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            {showText && (
                <span className={`font-black tracking-tighter ${textColor}`} style={{ fontSize: size * 0.8 }}>
                    Resumy
                </span>
            )}
        </div>
    );
};

export default ResumyLogo;
