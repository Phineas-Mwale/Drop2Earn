"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { RoleGate } from "@/components/role-gate";
import { ResponsiveHeader } from "@/components/responsive-header";

type Transaction = {
  id: string;
  material: string;
  declaredWeight: number;
  verifiedWeight: number;
  earnings: number;
  date: string;
  location: string;
  status: string;
  payoutStatus: string;
  paidAt: string | null;
};

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [collectorName, setCollectorName] = useState<string>("Collector");
  const [initials, setInitials] = useState<string>("PM");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadDashboardData() {
      // 1. Get current logged-in user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // 2. Get user's profile details
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (profile?.full_name) {
        const name = profile.full_name;
        setCollectorName(name.split(" ")[0] || name);

        const nameParts = name.trim().split(" ");
        if (nameParts.length >= 2) {
          setInitials(`${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase());
        } else if (nameParts[0]) {
          setInitials(nameParts[0].slice(0, 2).toUpperCase());
        }
      }

      // 3. Fetch collections for this logged-in user
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .eq("collector_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const formattedTransactions: Transaction[] = data.map((col) => {
          const formattedDate = new Date(col.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });

          return {
            id: col.id,
            material: col.material,
            declaredWeight: Number(col.declared_weight) || 0,
            verifiedWeight: Number(col.verified_weight) || 0,
            earnings: Number(col.earnings) || 0,
            date: formattedDate,
            location: col.location || "Collection Point",
            status: col.status === "verified" ? "Verified" : "Pending",
            payoutStatus: col.payout_status || "pending",
            paidAt: col.paid_at || null,
          };
        });

        setTransactions(formattedTransactions);
      }

      setLoading(false);
    }

    loadDashboardData();
  }, []);

  const verifiedTransactions = useMemo(() => {
    return transactions.filter(
      (transaction) => transaction.status === "Verified"
    );
  }, [transactions]);

  const totalVerifiedWeight = useMemo(() => {
    return verifiedTransactions.reduce(
      (total, transaction) => total + transaction.verifiedWeight,
      0
    );
  }, [verifiedTransactions]);

  const totalEarnings = useMemo(() => {
    return verifiedTransactions.reduce(
      (total, transaction) => total + transaction.earnings,
      0
    );
  }, [verifiedTransactions]);

  return (
    <RoleGate allowedRoles={["collector"]}>
      <main className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <ResponsiveHeader
        initials={initials}
        showLogout
        links={[
          { href: "/dashboard", label: "Dashboard", active: true },
          { href: "/dashboard/collections/new", label: "Record Collection" },
        ]}
      />

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* WELCOME */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
            COLLECTOR DASHBOARD
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Welcome back, {collectorName}
          </h1>

          <p className="mt-2 max-w-2xl text-gray-600">
            Track your verified recyclable collections, earnings and
            transaction history.
          </p>
        </div>

        {/* MAIN STATS */}
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {/* RECOVERED */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Verified recovered
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {totalVerifiedWeight.toFixed(1)} kg
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-xl">
                ♻️
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-500">
              Total material verified
            </p>
          </div>

          {/* EARNINGS */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total earnings
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  K{totalEarnings.toFixed(2)}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-xl font-bold text-green-700">
                K
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-500">
              From verified collections
            </p>
          </div>

          {/* COLLECTIONS */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Collections
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {transactions.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-xl font-bold text-green-700">
                ✓
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-500">
              Recorded transactions
            </p>
          </div>
        </div>

        {/* NEW COLLECTION CTA */}
        <div className="mt-8 overflow-hidden rounded-3xl bg-green-700 p-8 text-white">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-green-200">
                READY TO COLLECT?
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Record a new recyclable collection
              </h2>

              <p className="mt-2 max-w-xl text-green-100">
                Record the material and estimated weight. A collection point
                will verify the actual weight before your earnings are
                calculated.
              </p>
            </div>

            <Link
              href="/dashboard/collections/new"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-6 py-3.5 font-semibold text-green-700 transition hover:bg-green-50"
            >
              Record collection
            </Link>
          </div>
        </div>

        {/* TRANSACTIONS */}
        <div className="mt-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Transaction history
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Your recorded recyclable collections and verified earnings.
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {/* DESKTOP HEADER */}
            <div className="hidden grid-cols-12 gap-4 border-b border-gray-200 bg-gray-50 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 md:grid">
              <div className="col-span-3">Material</div>
              <div className="col-span-2">Weight</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-3 text-right">Earnings</div>
            </div>

            {/* TRANSACTION ROWS */}
            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  Loading collections...
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div key={transaction.id}>
                    {/* DESKTOP */}
                    <div className="hidden grid-cols-12 items-center gap-4 px-6 py-5 md:grid">
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-lg">
                          ♻️
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            {transaction.material}
                          </p>

                          <p className="text-xs text-gray-500">
                            {transaction.location}
                          </p>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <p className="font-semibold text-gray-900">
                          {transaction.verifiedWeight > 0 ? `${transaction.verifiedWeight.toFixed(1)} kg` : "—"}
                        </p>

                        <p className="text-xs text-gray-500">
                          Declared {transaction.declaredWeight} kg
                        </p>
                      </div>

                      <div className="col-span-2 text-sm text-gray-600">
                        {transaction.date}
                      </div>

                      <div className="col-span-2">
                        {transaction.status === "Verified" ? (
                          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                            Pending
                          </span>
                        )}
                      </div>

                      <div className="col-span-3 text-right">
                        {transaction.status === "Verified" ? (
                          <div>
                            <p className="font-bold text-gray-900">
                              K{transaction.earnings.toFixed(2)}
                            </p>
                            <p className="mt-1 text-xs font-medium text-green-700">
                              {transaction.payoutStatus === "paid"
                                ? "Paid"
                                : "Pending payout"}
                            </p>
                            {transaction.payoutStatus === "paid" && (
                              <Link
                                href={`/dashboard/receipts/${transaction.id}`}
                                className="mt-2 inline-flex text-xs font-semibold text-green-700 hover:underline"
                              >
                                View receipt
                              </Link>
                            )}
                          </div>
                        ) : (
                          <p className="font-medium text-gray-400">
                            —
                          </p>
                        )}
                      </div>
                    </div>

                    {/* MOBILE */}
                    <div className="p-5 md:hidden">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-lg">
                            ♻️
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900">
                              {transaction.material}
                            </p>

                            <p className="text-xs text-gray-500">
                              {transaction.date}
                            </p>
                          </div>
                        </div>

                        {transaction.status === "Verified" ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Verified
                          </span>
                        ) : (
                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                            Pending
                          </span>
                        )}
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-4">
                        <div className="rounded-xl bg-gray-50 p-4">
                          <p className="text-xs font-medium text-gray-500">
                            Verified weight
                          </p>

                          <p className="mt-1 font-bold text-gray-900">
                            {transaction.verifiedWeight > 0 ? `${transaction.verifiedWeight.toFixed(1)} kg` : "—"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                          <p className="text-xs font-medium text-gray-500">
                            Earnings
                          </p>

                          <p className="mt-1 font-bold text-gray-900">
                            {transaction.status === "Verified"
                              ? `K${transaction.earnings.toFixed(2)}`
                              : "—"}
                          </p>
                          {transaction.status === "Verified" && (
                            <p className="mt-1 text-xs font-medium text-green-700">
                              {transaction.payoutStatus === "paid"
                                ? "Paid"
                                : "Pending payout"}
                            </p>
                          )}
                          {transaction.payoutStatus === "paid" && (
                            <Link
                              href={`/dashboard/receipts/${transaction.id}`}
                              className="mt-2 inline-flex text-xs font-semibold text-green-700 hover:underline"
                            >
                              View receipt
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {!loading && transactions.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className="font-semibold text-gray-900">
                    No collections yet
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Your recorded collections will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 font-bold text-green-700">
              1
            </div>

            <h3 className="mt-4 font-bold text-gray-900">
              Collect
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Collect recyclable material from your community and record the
              estimated quantity.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 font-bold text-green-700">
              2
            </div>

            <h3 className="mt-4 font-bold text-gray-900">
              Verify
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              A registered collection point weighs and verifies the material.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 font-bold text-green-700">
              3
            </div>

            <h3 className="mt-4 font-bold text-gray-900">
              Earn
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Verified weight is used to calculate your earnings and record the
              transaction.
            </p>
          </div>
        </div>

        {/* DEMO NOTICE */}
        <div className="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
          <div className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-500 text-sm font-bold text-white">
              i
            </div>

            <div>
              <p className="font-semibold text-yellow-900">
                MVP demonstration
              </p>

              <p className="mt-1 text-sm leading-6 text-yellow-800">
                Earnings shown in this prototype use demonstration payout rates
                to illustrate the Drop2Earn transaction flow. They are not
                presented as actual market prices.
              </p>
            </div>
          </div>
        </div>
      </div>
      </main>
    </RoleGate>
  );
}