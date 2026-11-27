//Display submitted requests
import { useState } from "react";
import { Link } from "react-router";
import { Plus, Search, FileText } from "lucide-react";
import ApprovalHistory from "@/features/approvals/ApprovalHistory";
import { Input } from "@/components/ui/input";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { getRequests } from "./requestService";

const statusColors: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  PENDING_APPROVAL: "bg-amber-100 text-amber-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  CANCELLED: "bg-slate-100 text-slate-700",
};

export default function RequestsPage() {
  const [result] = useState(() => {
    try {
      return { requests: getRequests(), error: "" };
    } catch {
      return {
        requests: [],
        error: "Unable to read saved requests.",
      };
    }
  });

  const requests = result.requests;

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const filteredRequests = requests.filter((request) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      request.title.toLowerCase().includes(query) ||
      request.id.toLowerCase().includes(query) ||
      request.category.toLowerCase().includes(query);

    const matchesStatus = status === "ALL" || request.status === status;

    return matchesSearch && matchesStatus;
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedRequest = requests.find((request) => request.id === selectedId);
  const pendingCount = requests.filter(
    (request) => request.status === "PENDING_APPROVAL",
  ).length;

  return (
    <div className="space-y-6">
      {/* Page heading */}

      <div
        className="flex flex-wrap items-center
                      justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Requests</h1>

          <p className="text-sm text-slate-500">
            Manage and track your expenditure requests.
          </p>
        </div>

        <Link
          to="/requests/new"
          className="inline-flex items-center gap-2 rounded-md
                     bg-blue-600 px-4 py-2 text-sm font-medium
                     text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Request
        </Link>
      </div>

      {/* Summary cards */}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Total Requests</p>
            <p className="mt-2 text-3xl font-bold">{requests.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Pending Approval</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">
              {pendingCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and table */}

      <Card>
        <CardHeader>
          <CardTitle>Spend Requests</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-3
                                 h-4 w-4 text-slate-400"
              />

              <Input
                aria-label="Search requests"
                placeholder="Search requests..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>

            <select
              aria-label="Filter by request status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-md border bg-white px-3 py-2
                         text-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="DRAFT">Draft</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {result.error ? (
            <p role="alert" className="text-sm text-red-600">
              {result.error}
            </p>
          ) : filteredRequests.length === 0 ? (
            <div className="py-12 text-center">
              <FileText
                className="mx-auto mb-3
                                   h-12 w-12 text-slate-300"
              />

              <p className="font-medium text-slate-700">No requests found</p>

              <p className="mt-1 text-sm text-slate-500">
                Create a spend request or change your filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead
                  className="border-b bg-slate-50
                                  text-slate-500"
                >
                  <tr>
                    <th className="p-3">Request ID</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-slate-50">
                      <td
                        className="p-3 font-medium text-blue-600"
                        title={request.id}
                      >
                        {request.id.slice(0, 12).toUpperCase()}
                      </td>

                      <td className="p-3">
                        <button
                          type="button"
                          className="font-medium text-blue-600 hover:underline"
                          onClick={() => setSelectedId(request.id)}
                        >
                          {request.title}
                        </button>
                      </td>

                      <td className="p-3">{request.category}</td>

                      <td className="whitespace-nowrap p-3 font-medium">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: request.currency,
                        }).format(request.amount)}
                      </td>

                      <td className="whitespace-nowrap p-3">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>

                      <td className="whitespace-nowrap p-3">
                        <span
                          className={`rounded-full px-3 py-1
                                         text-xs font-medium
                                         ${statusColors[request.status]}`}
                        >
                          {request.status.replaceAll("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedRequest && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{selectedRequest.title} — Approval History</CardTitle>

              <button
                type="button"
                className="text-sm text-blue-600"
                onClick={() => setSelectedId(null)}
              >
                Close
              </button>
            </div>
          </CardHeader>

          <CardContent>
            <ApprovalHistory request={selectedRequest} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
