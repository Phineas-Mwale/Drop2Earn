"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { RoleGate } from "@/components/role-gate";

type Receipt = {
  id: string;
  material: string;
  verified_weight: number | string | null;
  earnings: number | string | null;
  location: string | null;
  paid_at: string | null;
  created_at: string;
  payout_status: string;
};

type Profile = {
  full_name: string | null;
  phone: string | null;
};

function formatDate(value: string | null) {
  return value
    ? new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Not available";
}

export default function ReceiptPage() {
  const params = useParams<{ id: string }>();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadReceipt() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !params.id) {
        setErrorMessage("This receipt could not be loaded.");
        setLoading(false);
        return;
      }

      const [{ data: collection, error: collectionError }, { data: profileData }] =
        await Promise.all([
          supabase
            .from("collections")
            .select(
              "id, material, verified_weight, earnings, location, paid_at, created_at, payout_status"
            )
            .eq("id", params.id)
            .eq("collector_id", user.id)
            .eq("status", "verified")
            .single(),
          supabase
            .from("profiles")
            .select("full_name, phone")
            .eq("id", user.id)
            .single(),
        ]);

      if (collectionError || !collection || collection.payout_status !== "paid") {
        setErrorMessage("This receipt is only available after the payout is marked as paid.");
      } else {
        setReceipt(collection as Receipt);
        setProfile(profileData as Profile | null);
      }
      setLoading(false);
    }

    void loadReceipt();
  }, [params.id]);

  const receiptNumber = receipt
    ? `D2E-${receipt.id.slice(0, 8).toUpperCase()}`
    : "";

  return (
    <RoleGate allowedRoles={["collector"]}>
      <main className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 print:bg-white print:p-0">
        <div className="mx-auto max-w-3xl">
          <div className="mb-5 flex items-center justify-between print:hidden">
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              ← Back to dashboard
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              disabled={!receipt}
              className="rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
            >
              Download / print receipt
            </button>
          </div>

          {loading ? (
            <div className="rounded-3xl bg-white p-12 text-center text-gray-500 shadow-sm">
              Preparing your receipt...
            </div>
          ) : errorMessage ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-800">
              {errorMessage}
            </div>
          ) : receipt ? (
            <article className="overflow-hidden rounded-3xl bg-white shadow-sm print:rounded-none print:shadow-none">
              <div className="bg-green-700 px-8 py-8 text-white sm:px-12">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl font-bold text-green-700">
                        D
                      </span>
                      <span className="text-xl font-bold">Drop2Earn</span>
                    </div>
                    <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-green-100">
                      Payment receipt
                    </p>
                    <h1 className="mt-2 text-3xl font-bold">Thank you for your contribution</h1>
                  </div>
                  <div className="text-right text-sm text-green-100">
                    <p>Receipt reference</p>
                    <p className="mt-1 font-mono font-semibold text-white">{receiptNumber}</p>
                  </div>
                </div>
              </div>

              <div className="px-8 py-8 sm:px-12">
                <div className="grid gap-6 border-b border-gray-200 pb-8 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Paid to</p>
                    <p className="mt-2 text-lg font-bold text-gray-900">{profile?.full_name || "Drop2Earn collector"}</p>
                    <p className="mt-1 text-sm text-gray-600">{profile?.phone || "Phone number unavailable"}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Payment date</p>
                    <p className="mt-2 font-semibold text-gray-900">{formatDate(receipt.paid_at)}</p>
                    <span className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">PAID</span>
                  </div>
                </div>

                <div className="py-8">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Collection details</p>
                  <div className="mt-4 divide-y divide-gray-100 rounded-2xl border border-gray-200">
                    <div className="flex items-center justify-between gap-4 px-5 py-4">
                      <span className="text-sm text-gray-600">Material</span>
                      <span className="font-semibold text-gray-900">{receipt.material}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 px-5 py-4">
                      <span className="text-sm text-gray-600">Verified weight</span>
                      <span className="font-semibold text-gray-900">{Number(receipt.verified_weight || 0).toFixed(1)} kg</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 px-5 py-4">
                      <span className="text-sm text-gray-600">Collection point</span>
                      <span className="text-right font-semibold text-gray-900">{receipt.location || "Collection point"}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 px-5 py-4">
                      <span className="text-sm text-gray-600">Collection recorded</span>
                      <span className="text-right font-semibold text-gray-900">{formatDate(receipt.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-green-50 px-5 py-5">
                  <span className="font-semibold text-green-900">Amount paid</span>
                  <span className="text-2xl font-bold text-green-800">K{Number(receipt.earnings || 0).toFixed(2)}</span>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-6 text-xs leading-5 text-gray-500">
                  <p>This receipt confirms that Drop2Earn recorded the payout shown above.</p>
                  <p>Keep this reference for support. Your mobile-money provider statement remains the official record of the actual funds transfer.</p>
                </div>
              </div>
            </article>
          ) : null}
        </div>
      </main>
    </RoleGate>
  );
}
