"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    FileSearch,
    Search,
    Clock,
    CheckCircle,
    AlertCircle,
    ChevronRight,
    Loader2,
    FileText,
    Calendar,
    XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface RegistryReview {
    id: number;
    project_id: number;
    registry_user_id: number;
    status: string;
    assigned_at: string;
    started_at: string | null;
    completed_at: string | null;
    review_notes: string | null;
    decision: string | null;
    project_name?: string;
    project_type?: string;
    developer_name?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://credocarbon-api-641001192587.asia-south2.run.app";

const statusColors: Record<string, string> = {
    ASSIGNED: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    IN_PROGRESS: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    COMPLETED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    APPROVED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    REJECTED: "bg-red-500/10 text-red-600 border-red-500/20",
    UNDER_REVIEW: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

const statusLabels: Record<string, string> = {
    ASSIGNED: "Pending Review",
    IN_PROGRESS: "Under Review",
    UNDER_REVIEW: "Under Review",
    COMPLETED: "Completed",
    APPROVED: "Approved",
    REJECTED: "Rejected",
};

export default function RegistryReviewsPage() {
    const [reviews, setReviews] = useState<RegistryReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_BASE_URL}/api/registry/reviews`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            } else {
                setReviews([]);
                setError("Failed to load reviews");
            }
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
            setReviews([]);
            setError("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    const filteredReviews = reviews.filter((review) => {
        const matchesSearch =
            (review.project_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (review.developer_name || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || review.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Stats
    const pendingReviews = reviews.filter((r) => r.status === "ASSIGNED").length;
    const inProgressReviews = reviews.filter((r) => ["IN_PROGRESS", "UNDER_REVIEW"].includes(r.status)).length;
    const approvedReviews = reviews.filter((r) => ["COMPLETED", "APPROVED"].includes(r.status)).length;
    const rejectedReviews = reviews.filter((r) => r.status === "REJECTED").length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                    <p className="text-slate-500">Loading reviews...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <FileSearch className="h-7 w-7 text-blue-500" />
                        Project Reviews
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Review and approve project submissions for registration
                    </p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-slate-200 dark:border-slate-700">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-500/10 rounded-xl">
                                <Clock className="h-6 w-6 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Pending</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {pendingReviews}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 dark:border-slate-700">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-xl">
                                <FileText className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">In Review</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {inProgressReviews}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 dark:border-slate-700">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 rounded-xl">
                                <CheckCircle className="h-6 w-6 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Approved</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {approvedReviews}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 dark:border-slate-700">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-500/10 rounded-xl">
                                <XCircle className="h-6 w-6 text-red-500" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Rejected</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {rejectedReviews}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search by project or developer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button
                        variant={filterStatus === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterStatus("all")}
                        className={filterStatus === "all" ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                        All
                    </Button>
                    <Button
                        variant={filterStatus === "ASSIGNED" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterStatus("ASSIGNED")}
                        className={filterStatus === "ASSIGNED" ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                        Pending
                    </Button>
                    <Button
                        variant={filterStatus === "IN_PROGRESS" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterStatus("IN_PROGRESS")}
                        className={filterStatus === "IN_PROGRESS" ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                        In Review
                    </Button>
                    <Button
                        variant={filterStatus === "APPROVED" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterStatus("APPROVED")}
                        className={filterStatus === "APPROVED" ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                        Approved
                    </Button>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {error && (
                    <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                        <CardContent className="py-4 flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <span className="text-red-600 dark:text-red-400">{error}</span>
                        </CardContent>
                    </Card>
                )}

                {filteredReviews.length === 0 && !error ? (
                    <Card className="border-slate-200 dark:border-slate-700">
                        <CardContent className="py-12 text-center">
                            <FileSearch className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                                No reviews found
                            </h3>
                            <p className="text-slate-500 mt-1">
                                {searchTerm
                                    ? "Try adjusting your search terms"
                                    : "No project reviews have been assigned yet"}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredReviews.map((review) => (
                        <Link href={`/registry/dashboard/reviews/${review.id}`} key={review.id}>
                            <Card className="border-slate-200 dark:border-slate-700 hover:border-blue-500/50 transition-colors cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                                    {review.project_name || `Project #${review.project_id}`}
                                                </h3>
                                                <Badge className={statusColors[review.status] || statusColors.ASSIGNED}>
                                                    {statusLabels[review.status] || review.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                {review.project_type && (
                                                    <span className="flex items-center gap-1">
                                                        <FileText className="h-4 w-4" />
                                                        {review.project_type}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    Assigned: {new Date(review.assigned_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {review.developer_name && (
                                                <p className="text-sm text-slate-500 mt-1">
                                                    Developer: {review.developer_name}
                                                </p>
                                            )}
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-slate-400" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
