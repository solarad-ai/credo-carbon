"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const typingPhrases = [
    "Registration",
    "Validation",
    "Verification",
    "Trading",
    "Retirement",
];

export function HeroSection() {
    const [currentPhrase, setCurrentPhrase] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const phrase = typingPhrases[currentPhrase];
        const timeout = setTimeout(
            () => {
                if (!isDeleting) {
                    if (displayText.length < phrase.length) {
                        setDisplayText(phrase.slice(0, displayText.length + 1));
                    } else {
                        setTimeout(() => setIsDeleting(true), 2000);
                    }
                } else {
                    if (displayText.length > 0) {
                        setDisplayText(displayText.slice(0, -1));
                    } else {
                        setIsDeleting(false);
                        setCurrentPhrase((prev) => (prev + 1) % typingPhrases.length);
                    }
                }
            },
            isDeleting ? 50 : 100
        );

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, currentPhrase]);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
            {/* Animated gradient orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] animate-float" />
                <div
                    className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/15 rounded-full blur-[120px] animate-float"
                    style={{ animationDelay: "1s" }}
                />
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] animate-float"
                    style={{ animationDelay: "2s" }}
                />
            </div>

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

            {/* Content */}
            <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-sm font-medium mb-8 animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>Unified MRV, Registry & Trading Stack</span>
                    </div>

                    {/* Headline */}
                    <h1
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 animate-fade-in-up"
                        style={{ animationDelay: "0.1s" }}
                    >
                        <span className="text-white">The Future of</span>
                        <br />
                        <span className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                            Carbon Credit
                        </span>
                        <br />
                        <span className="text-white">
                            {displayText}
                            <span className="inline-block w-[3px] h-[0.9em] bg-emerald-400 ml-1 animate-pulse" />
                        </span>
                    </h1>

                    {/* Sub-headline */}
                    <p
                        className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 animate-fade-in-up"
                        style={{ animationDelay: "0.2s" }}
                    >
                        Enterprise-grade platform for project developers, validators, registries,
                        and credit buyers. Streamline your entire carbon credit lifecycle.
                    </p>

                    {/* CTA Buttons */}
                    <div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
                        style={{ animationDelay: "0.3s" }}
                    >
                        <Link href="/developer/signup">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 transition-all"
                            >
                                Get Started
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="#docs">
                            <Button
                                size="lg"
                                variant="outline"
                                className="px-8 py-6 text-lg font-semibold rounded-xl border-2 border-white/20 text-white bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all"
                            >
                                View Documentation
                            </Button>
                        </Link>
                    </div>

                    {/* Role Pills */}
                    <div
                        className="flex flex-wrap items-center justify-center gap-3 mt-16 animate-fade-in-up"
                        style={{ animationDelay: "0.4s" }}
                    >
                        {[
                            { label: "Developers", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
                            { label: "Buyers", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
                            { label: "VVBs", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
                            { label: "Registries", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
                            { label: "SuperAdmins", color: "bg-red-500/20 text-red-400 border-red-500/30" },
                        ].map((role) => (
                            <span
                                key={role.label}
                                className={`px-4 py-2 rounded-full text-sm font-medium border ${role.color}`}
                            >
                                {role.label}
                            </span>
                        ))}
                    </div>

                    {/* Stats */}
                    <div
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-fade-in-up"
                        style={{ animationDelay: "0.5s" }}
                    >
                        {[
                            { value: "6+", label: "Global Registries" },
                            { value: "10+", label: "Project Types" },
                            { value: "100%", label: "Compliant" },
                            { value: "Real-time", label: "Dashboard" },
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-slate-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
        </section>
    );
}
