"use client";

import { useSearchParams } from "next/navigation";

export default function ErrorMessage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    if (!error) return null;

    const messages: Record<string, string> = {
        overlap: "❌ This resource is already booked for the selected time. Please choose a different time.",
        maintenance: "🔧 This resource is under maintenance during the selected time. Please choose a different time or resource.",
    };

    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {messages[error] ?? "Something went wrong. Please try again."}
        </div>
    );
}