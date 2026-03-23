"use client";

import { startTransition, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SubmissionRecord } from "@/lib/submissions";

type DashboardClientProps = {
  initialSubmissions: SubmissionRecord[];
  storageLabel: string;
  initialError: string;
};

type ToastState = {
  tone: "success" | "error";
  message: string;
} | null;

function getSubmittedLabel(value: string) {
  return new Date(value).toLocaleString("en-IN");
}

export function DashboardClient({ initialSubmissions, storageLabel, initialError }: DashboardClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [query, setQuery] = useState("");
  const [conditionFilter, setConditionFilter] = useState("All");
  const [deleteId, setDeleteId] = useState("");
  const [toast, setToast] = useState<ToastState>(initialError ? { tone: "error", message: initialError } : null);

  useEffect(() => {
    setSubmissions(initialSubmissions);
  }, [initialSubmissions]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToast(null);
      if (searchParams.toString()) {
        router.replace(pathname, { scroll: false });
      }
    }, 2600);

    return () => window.clearTimeout(timeout);
  }, [toast, pathname, router, searchParams]);

  const normalizedQuery = query.trim().toLowerCase();
  const conditionOptions = ["All", ...Array.from(new Set(submissions.map((item) => item.condition)))];
  const filteredSubmissions = submissions.filter((item) => {
    const matchesCondition = conditionFilter === "All" || item.condition === conditionFilter;
    const matchesQuery =
      !normalizedQuery ||
      [
        item.name,
        item.email,
        item.phone,
        item.country,
        item.condition,
        item.batchType,
        item.goal,
        item.notes
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);

    return matchesCondition && matchesQuery;
  });

  const totalLeads = submissions.length;
  const recentLeads = submissions.filter((item) => Date.now() - new Date(item.createdAt).getTime() <= 1000 * 60 * 60 * 24 * 7).length;
  const topCondition = submissions.reduce(
    (best, item, _, array) => {
      const count = array.filter((entry) => entry.condition === item.condition).length;
      return count > best.count ? { label: item.condition, count } : best;
    },
    { label: "No submissions", count: 0 }
  );
  const topBatch = submissions.reduce(
    (best, item, _, array) => {
      const count = array.filter((entry) => entry.batchType === item.batchType).length;
      return count > best.count ? { label: item.batchType, count } : best;
    },
    { label: "No submissions", count: 0 }
  );

  const newestLead = filteredSubmissions[0] ?? null;

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this submission permanently? This will remove it from the dashboard and database.");
    if (!confirmed) {
      return;
    }

    setDeleteId(id);

    try {
      const formData = new FormData();
      formData.append("id", id);

      const response = await fetch("/api/admin/submissions/delete", {
        method: "POST",
        body: formData
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Unable to delete the submission right now.");
      }

      setSubmissions((current) => current.filter((item) => item.id !== id));
      setToast({ tone: "success", message: result.message || "Submission deleted successfully." });
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      setToast({
        tone: "error",
        message: error instanceof Error ? error.message : "Unable to delete the submission right now."
      });
    } finally {
      setDeleteId("");
    }
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <p className="eyebrow">Client dashboard</p>
          <h1>Lead pipeline</h1>
          <p className="admin-copy">
            Search leads, spot demand patterns, review the newest inquiry, and remove records without leaving the dashboard.
          </p>
        </div>
        <div className="admin-actions">
          <span className="entity-chip">Storage: {storageLabel}</span>
          <form action="/api/admin/logout" method="post">
            <button className="button button-secondary" type="submit">
              Log out
            </button>
          </form>
        </div>
      </div>

      {toast ? <p className={`form-status form-status-${toast.tone}`}>{toast.message}</p> : null}

      <section className="admin-summary-grid">
        <article className="admin-insight-card">
          <p className="admin-kicker">Total leads</p>
          <strong>{totalLeads}</strong>
          <span>All inquiry records currently stored.</span>
        </article>
        <article className="admin-insight-card">
          <p className="admin-kicker">Last 7 days</p>
          <strong>{recentLeads}</strong>
          <span>Recent inquiries that still need quick follow-up.</span>
        </article>
        <article className="admin-insight-card">
          <p className="admin-kicker">Top condition</p>
          <strong>{topCondition.label}</strong>
          <span>{topCondition.count} inquiries around this concern.</span>
        </article>
        <article className="admin-insight-card">
          <p className="admin-kicker">Preferred batch</p>
          <strong>{topBatch.label}</strong>
          <span>{topBatch.count} leads asked for this format.</span>
        </article>
      </section>

      <section className="admin-control-panel">
        <div className="admin-search-shell">
          <label htmlFor="lead-search">Search leads</label>
          <input
            id="lead-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, email, phone, condition, goal, or notes"
          />
        </div>
        <div className="admin-filter-row">
          {conditionOptions.map((option) => (
            <button
              key={option}
              className={`filter-chip ${conditionFilter === option ? "active-filter" : ""}`}
              type="button"
              onClick={() => setConditionFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <section className="admin-crm-grid">
        <article className="admin-spotlight-card">
          <p className="admin-kicker">Newest matching lead</p>
          {newestLead ? (
            <div className="admin-spotlight-copy">
              <h2>{newestLead.name}</h2>
              <p>
                {newestLead.condition} in {newestLead.country} asking for {newestLead.batchType.toLowerCase()}.
              </p>
              <div className="admin-spotlight-meta">
                <span>{newestLead.email}</span>
                <span>{newestLead.phone}</span>
                <span>{getSubmittedLabel(newestLead.createdAt)}</span>
              </div>
              <div className="admin-pill-row">
                <span>{newestLead.bloodGroup}</span>
                <span>{newestLead.goal}</span>
              </div>
              <p className="admin-notes-preview">{newestLead.notes || "No extra notes from this lead."}</p>
            </div>
          ) : (
            <p className="admin-copy">No lead matches the current search and filter state.</p>
          )}
        </article>

        <article className="admin-feed-card">
          <p className="admin-kicker">Relationship view</p>
          <div className="admin-lead-stack">
            {filteredSubmissions.slice(0, 5).map((item) => (
              <div className="admin-lead-item" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <p>
                    {item.condition} • {item.goal}
                  </p>
                </div>
                <span>{getSubmittedLabel(item.createdAt)}</span>
              </div>
            ))}
            {!filteredSubmissions.length ? <p className="admin-copy">No leads available in this filtered view.</p> : null}
          </div>
        </article>
      </section>

      <div className="admin-table-shell">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Country</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Blood group</th>
              <th>Condition</th>
              <th>Batch</th>
              <th>Goal</th>
              <th>Notes</th>
              <th>Submitted</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.length ? (
              filteredSubmissions.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    {item.country} ({item.countryCode})
                  </td>
                  <td>{item.phone}</td>
                  <td>{item.email}</td>
                  <td>{item.bloodGroup}</td>
                  <td>{item.condition}</td>
                  <td>{item.batchType}</td>
                  <td>{item.goal}</td>
                  <td>{item.notes || "-"}</td>
                  <td>{getSubmittedLabel(item.createdAt)}</td>
                  <td>
                    <button
                      className="button button-secondary button-small"
                      type="button"
                      disabled={deleteId === item.id}
                      onClick={() => handleDelete(item.id)}
                    >
                      {deleteId === item.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11}>No submissions match the current filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
