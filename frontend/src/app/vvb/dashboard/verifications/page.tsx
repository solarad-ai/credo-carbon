"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ShieldCheck,
    Search,
    Clock,
    CheckCircle,
    AlertCircle,
    ChevronRight,
    Loader2,
    FileText,
    Calendar,
    BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface VerificationTask {
    id: number;
    project_id: number;
    vvb_user_id: number;
    status: string;
    monitoring_period_start: string | null;
    monitoring_period_end: string | null;
    assigned_at: string;
    started_at: string | null;
    completed_at: string | null;
    verification_report_url: string | null;
    findings: string | null;
    credits_verified: number | null;
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
};

const statusLabels: Record<string, string> = {
    ASSIGNED: "Pending Review",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    APPROVED: "Approved",
    REJECTED: "Rejected",
};

export default function VVBVerificationsPage() {
    const [tasks, setTasks] = useState<VerificationTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    useEffect(() => {
        fetchVerificationTasks();
    }, []);

    const fetchVerificationTasks = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_BASE_URL}/api/vvb/verifications`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            } else {
                setTasks([]);
                setError("Failed to load verification tasks");
            }
        } catch (err) {
            console.error("Failed to fetch verification tasks:", err);
            setTasks([]);
            setError("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            (task.project_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.developer_name || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || task.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Stats
    const assignedTasks = tasks.filter((t) => t.status === "ASSIGNED").length;
    const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const completedTasks = tasks.filter((t) => ["COMPLETED", "APPROVED"].includes(t.status)).length;
    const totalCreditsVerified = tasks.reduce((sum, t) => sum + (t.credits_verified || 0), 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
                    <p className="text-slate-500">Loading verification tasks...</p>
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
                        <ShieldCheck className="h-7 w-7 text-emerald-500" />
                        Verification Tasks
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Verify emission reductions and credit generation
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
                                    {assignedTasks}
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
                                <p className="text-sm text-slate-500">In Progress</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {inProgressTasks}
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
                                <p className="text-sm text-slate-500">Completed</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {completedTasks}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 dark:border-slate-700">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/10 rounded-xl">
                                <BarChart3 className="h-6 w-6 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Credits Verified</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {totalCreditsVerified.toLocaleString()}
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
                        className={filterStatus === "all" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                    >
                        All
                    </Button>
                    <Button
                        variant={filterStatus === "ASSIGNED" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterStatus("ASSIGNED")}
                        className={filterStatus === "ASSIGNED" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                    >
                        Pending
                    </Button>
                    <Button
                        variant={filterStatus === "IN_PROGRESS" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterStatus("IN_PROGRESS")}
                        className={filterStatus === "IN_PROGRESS" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                    >
                        In Progress
                    </Button>
                    <Button
                        variant={filterStatus === "COMPLETED" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterStatus("COMPLETED")}
                        className={filterStatus === "COMPLETED" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                    >
                        Completed
                    </Button>
                </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
                {error && (
                    <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                        <CardContent className="py-4 flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <span className="text-red-600 dark:text-red-400">{error}</span>
                        </CardContent>
                    </Card>
                )}

                {filteredTasks.length === 0 && !error ? (
                    <Card className="border-slate-200 dark:border-slate-700">
                        <CardContent className="py-12 text-center">
                            <ShieldCheck className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                                No verification tasks found
                            </h3>
                            <p className="text-slate-500 mt-1">
                                {searchTerm
                                    ? "Try adjusting your search terms"
                                    : "No verification tasks have been assigned yet"}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredTasks.map((task) => (
                        <Link href={`/vvb/dashboard/verifications/${task.id}`} key={task.id}>
                            <Card className="border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 transition-colors cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                                    {task.project_name || `Project #${task.project_id}`}
                                                </h3>
                                                <Badge className={statusColors[task.status] || statusColors.ASSIGNED}>
                                                    {statusLabels[task.status] || task.status}
                                                </Badge>
                                                {task.credits_verified && task.credits_verified > 0 && (
                                                    <Badge variant="outline" className="text-emerald-600">
                                                        {task.credits_verified.toLocaleString()} tCO₂e
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                {task.project_type && (
                                                    <span className="flex items-center gap-1">
                                                        <FileText className="h-4 w-4" />
                                                        {task.project_type}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    Assigned: {new Date(task.assigned_at).toLocaleDateString()}
                                                </span>
                                                {task.monitoring_period_start && task.monitoring_period_end && (
                                                    <span className="text-xs">
                                                        Period: {new Date(task.monitoring_period_start).toLocaleDateString()} - {new Date(task.monitoring_period_end).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                            {task.developer_name && (
                                                <p className="text-sm text-slate-500 mt-1">
                                                    Developer: {task.developer_name}
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
