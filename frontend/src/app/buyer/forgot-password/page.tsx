"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://credocarbon-api-641001192587.asia-south2.run.app";

export default function BuyerForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setIsSubmitted(true);
            } else {
                // Even on error, show success to prevent email enumeration
                setIsSubmitted(true);
            }
        } catch (err) {
            // Show success anyway for security
            setIsSubmitted(true);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
                    <CardContent className="pt-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="h-8 w-8 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-white">Check Your Email</h2>
                        <p className="text-slate-400 mb-6">
                            If an account exists with <span className="font-medium text-white">{email}</span>,
                            we've sent a password reset link.
                        </p>
                        <p className="text-sm text-slate-500 mb-6">
                            Didn't receive the email? Check your spam folder or try again.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Button variant="outline" onClick={() => setIsSubmitted(false)} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                                Try Again
                            </Button>
                            <Link href="/buyer/login">
                                <Button variant="ghost" className="w-full text-blue-400 hover:text-blue-300">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Buyer Login
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
                <CardHeader className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                        <Mail className="h-6 w-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-2xl text-white">Reset Password</CardTitle>
                    <CardDescription className="text-slate-400">
                        Enter your buyer account email and we'll send you a link to reset your password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="buyer@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send Reset Link"
                            )}
                        </Button>

                        <div className="text-center">
                            <Link href="/buyer/login" className="text-sm text-slate-400 hover:text-blue-400">
                                <ArrowLeft className="inline-block mr-1 h-3 w-3" />
                                Back to Buyer Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
