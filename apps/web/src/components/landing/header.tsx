"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Leaf, Building2, User, ArrowRight, Sparkles } from "lucide-react";

const navItems = [
    { label: "Features", href: "#features" },
    { label: "Roles", href: "#roles" },
    { label: "Docs", href: "#docs" },
];

export function LandingHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                                <Leaf className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                                CredoCarbon
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group"
                                >
                                    {item.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300" />
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop CTA */}
                        <div className="hidden md:flex items-center gap-4">
                            <Link href="/developer/login">
                                <Button
                                    variant="ghost"
                                    className="text-slate-400 hover:text-white hover:bg-white/5"
                                >
                                    Sign In
                                </Button>
                            </Link>
                            <Button
                                onClick={() => setShowRoleModal(true)}
                                className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all group"
                            >
                                Get Started
                                <Sparkles className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                            </Button>
                        </div>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden text-white"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/5 animate-fade-in">
                        <nav className="container mx-auto px-4 py-4">
                            {navItems.map((item, index) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="block py-3 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
                                <Link href="/developer/login" onClick={() => setIsOpen(false)}>
                                    <Button
                                        variant="ghost"
                                        className="w-full text-slate-400 hover:text-white"
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() => {
                                        setIsOpen(false);
                                        setShowRoleModal(true);
                                    }}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white"
                                >
                                    Get Started
                                </Button>
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* Role Selection Modal */}
            {showRoleModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in">
                    <div className="relative bg-gradient-to-br from-[#0f0f15] to-[#1a1a24] border border-white/10 rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl animate-scale-in">
                        {/* Close button */}
                        <button
                            onClick={() => setShowRoleModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Decorative elements */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />

                        {/* Content */}
                        <div className="relative z-10">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
                                    <Sparkles className="h-4 w-4" />
                                    <span>Choose Your Path</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                                    How would you like to join?
                                </h2>
                                <p className="text-slate-400 text-lg">
                                    Select your role to get started with CredoCarbon
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Developer Card */}
                                <Link
                                    href="/developer/signup"
                                    onClick={() => setShowRoleModal(false)}
                                    className="group"
                                >
                                    <div className="relative p-6 rounded-2xl border-2 border-white/10 hover:border-emerald-500/50 bg-gradient-to-br from-white/5 to-transparent hover:from-emerald-500/10 hover:to-emerald-500/5 transition-all duration-300 cursor-pointer overflow-hidden">
                                        {/* Hover glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-transparent transition-all duration-300" />

                                        <div className="relative z-10">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center group-hover:scale-110 group-hover:from-emerald-500/30 group-hover:to-emerald-600/30 transition-all duration-300 mb-4">
                                                <Building2 className="h-7 w-7 text-emerald-400" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                                                I'm a Developer
                                            </h3>
                                            <p className="text-sm text-slate-400 mb-4">
                                                Register and manage carbon credit projects across global registries
                                            </p>
                                            <div className="flex items-center text-emerald-400 text-sm font-medium group-hover:gap-2 transition-all">
                                                <span>Get Started</span>
                                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                {/* Buyer Card */}
                                <Link
                                    href="/buyer/signup"
                                    onClick={() => setShowRoleModal(false)}
                                    className="group"
                                >
                                    <div className="relative p-6 rounded-2xl border-2 border-white/10 hover:border-blue-500/50 bg-gradient-to-br from-white/5 to-transparent hover:from-blue-500/10 hover:to-blue-500/5 transition-all duration-300 cursor-pointer overflow-hidden">
                                        {/* Hover glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-transparent transition-all duration-300" />

                                        <div className="relative z-10">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center group-hover:scale-110 group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all duration-300 mb-4">
                                                <User className="h-7 w-7 text-blue-400" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                                I'm a Buyer
                                            </h3>
                                            <p className="text-sm text-slate-400 mb-4">
                                                Purchase verified carbon credits and track your sustainability impact
                                            </p>
                                            <div className="flex items-center text-blue-400 text-sm font-medium group-hover:gap-2 transition-all">
                                                <span>Get Started</span>
                                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Additional info */}
                            <div className="mt-6 text-center">
                                <p className="text-sm text-slate-500">
                                    Already have an account?{" "}
                                    <Link
                                        href="/developer/login"
                                        onClick={() => setShowRoleModal(false)}
                                        className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                                    >
                                        Sign in here
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
