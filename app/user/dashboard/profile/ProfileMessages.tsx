"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Messages() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const success = searchParams.get("success");

    if (success) {
        return (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                ✅ Profile updated successfully!
            </div>
        );
    }

    if (error === "email") {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                ❌ This email is already taken by another user.
            </div>
        );
    }

    if (error === "password") {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                ❌ Passwords do not match. Please try again.
            </div>
        );
    }

    return null;
}

export default function ProfileMessages() {
    return (
        <Suspense fallback={null}>
            <Messages />
        </Suspense>
    );
}