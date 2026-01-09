"use client";

import { useEffect, useState } from "react";
import { CreditCard, Search, ChevronLeft, ChevronRight, Crown, Edit2, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { superadminApi } from "@/lib/api";

interface UserSubscription {
    user_id: number;
    user_email: string;
    user_name: string | null;
    role: string;
    tier: string;
    tier_name: string;
    valid_until: string | null;
    created_at: string;
}

interface TierDefinition {
    tier: string;
    tier_name: string;
    tier_description: string;
    features: any[];
    feature_count: number;
}

const TIER_COLORS: Record<string, string> = {
    PKG_0: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
    PKG_1: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    PKG_2: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    PKG_3: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    PKG_4: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    PKG_5: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    PKG_6: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    PKG_FULL: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
};

export default function SubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
    const [tiers, setTiers] = useState<TierDefinition[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [tierFilter, setTierFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserSubscription | null>(null);
    const [selectedTier, setSelectedTier] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchTiers();
    }, []);

    useEffect(() => {
        fetchSubscriptions();
    }, [page, tierFilter]);

    const fetchTiers = async () => {
        try {
            const data = await superadminApi.getTierDefinitions();
            setTiers(data);
        } catch (err) {
            console.error("Failed to fetch tiers", err);
        }
    };

    const fetchSubscriptions = async () => {
        setLoading(true);
        try {
            const data = await superadminApi.getSubscriptions({
                page,
                page_size: 15,
                tier: tierFilter !== "all" ? tierFilter : undefined,
                search: search || undefined,
            });
            setSubscriptions(data.items);
            setTotalPages(data.total_pages);
            setTotal(data.total);
        } catch (err) {
            console.error("Failed to fetch subscriptions", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchSubscriptions();
    };

    const openAssignModal = (user: UserSubscription) => {
        setSelectedUser(user);
        setSelectedTier(user.tier);
        setShowModal(true);
    };

    const handleAssign = async () => {
        if (!selectedUser || !selectedTier) return;
        setSaving(true);
        try {
            await superadminApi.assignUserSubscription(selectedUser.user_id, {
                tier: selectedTier,
            });
            setShowModal(false);
            fetchSubscriptions();
        } catch (err) {
            console.error("Failed to assign subscription", err);
            alert("Failed to assign subscription. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const getTierBadge = (tier: string, tierName: string) => {
        const color = TIER_COLORS[tier] || "bg-slate-100 text-slate-700";
        return (
            <Badge className={`${color} font-medium`}>
                {tier === "PKG_FULL" && <Crown className="h-3 w-3 mr-1" />}
                {tierName}
            </Badge>
        );
    };

    const getRoleBadge = (role: string) => {
        const colors: Record<string, string> = {
            DEVELOPER: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            BUYER: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
            ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
            VVB: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
            REGISTRY: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
        };
        return <Badge className={colors[role] || "bg-slate-100"}>{role}</Badge>;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-purple-500" />
                    Subscription Management
                </h1>
                <p className="text-slate-500 dark:text-slate-400">{total} users with subscriptions</p>
            </div>

            {/* Tier Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {tiers.map((tier) => (
                    <Card
                        key={tier.tier}
                        className={`cursor-pointer transition-all hover:scale-105 ${tierFilter === tier.tier ? 'ring-2 ring-purple-500' : ''} dark:bg-slate-800 dark:border-slate-700`}
                        onClick={() => { setTierFilter(tier.tier === tierFilter ? "all" : tier.tier); setPage(1); }}
                    >
                        <CardContent className="p-3 text-center">
                            <div className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-1 ${TIER_COLORS[tier.tier] || ''}`}>
                                {tier.tier.replace("PKG_", "")}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{tier.tier_name}</p>
                            <p className="text-xs text-slate-400">{tier.feature_count} features</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search & Filter */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardContent className="p-4">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search by email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 dark:bg-slate-700 dark:border-slate-600"
                            />
                        </div>
                        <Select value={tierFilter} onValueChange={(v) => { setTierFilter(v); setPage(1); }}>
                            <SelectTrigger className="w-full sm:w-48 dark:bg-slate-700 dark:border-slate-600">
                                <SelectValue placeholder="Filter by Tier" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Tiers</SelectItem>
                                {tiers.map((tier) => (
                                    <SelectItem key={tier.tier} value={tier.tier}>{tier.tier_name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Search</Button>
                    </form>
                </CardContent>
            </Card>

            {/* Subscriptions Table */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                        </div>
                    ) : subscriptions.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">No subscriptions found</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 dark:bg-slate-700/50">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">User</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Role</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Tier</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Valid Until</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {subscriptions.map((sub) => (
                                        <tr key={sub.user_id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">{sub.user_email}</p>
                                                    <p className="text-xs text-slate-500">{sub.user_name || `ID: ${sub.user_id}`}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{getRoleBadge(sub.role)}</td>
                                            <td className="px-6 py-4">{getTierBadge(sub.tier, sub.tier_name)}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {sub.valid_until ? new Date(sub.valid_until).toLocaleDateString() : "—"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openAssignModal(sub)}
                                                    className="text-purple-600 hover:text-purple-700"
                                                >
                                                    <Edit2 className="h-4 w-4 mr-1" />
                                                    Change Tier
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Assign Tier Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="dark:bg-slate-800">
                    <DialogHeader>
                        <DialogTitle>Change Subscription Tier</DialogTitle>
                        <DialogDescription>
                            Update subscription for {selectedUser?.user_email}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                            Select Tier
                        </label>
                        <Select value={selectedTier} onValueChange={setSelectedTier}>
                            <SelectTrigger className="w-full dark:bg-slate-700 dark:border-slate-600">
                                <SelectValue placeholder="Select a tier" />
                            </SelectTrigger>
                            <SelectContent>
                                {tiers.map((tier) => (
                                    <SelectItem key={tier.tier} value={tier.tier}>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${TIER_COLORS[tier.tier]}`}>
                                                {tier.tier.replace("PKG_", "")}
                                            </span>
                                            <span>{tier.tier_name}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedTier && tiers.find(t => t.tier === selectedTier) && (
                            <p className="text-sm text-slate-500 mt-2">
                                {tiers.find(t => t.tier === selectedTier)?.tier_description}
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowModal(false)} disabled={saving}>
                            <X className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                        <Button onClick={handleAssign} disabled={saving || !selectedTier} className="bg-purple-600 hover:bg-purple-700">
                            {saving ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            ) : (
                                <Check className="h-4 w-4 mr-1" />
                            )}
                            Assign Tier
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
