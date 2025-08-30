import { getJobs } from "./getJobs";
import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import ErrorCard from "@/components/ui/errorCard";

type SearchParams = {
  searchParams?: { page?: string };
};

const statusClass = {
  applied: "bg-primary text-white",
  rejected: "bg-destructive text-white",
  interview: "bg-secondary text-white",
  offer: "bg-secondary text-white",
  new: "bg-secondary text-white",
  default: "bg-secondary text-white",
};

export default async function JobsPage({ searchParams }: SearchParams) {
  const page = searchParams?.page ? Number(searchParams.page) : 1;
  const jobsResponse = await getJobs({ page });

  if (!jobsResponse.success) return <ErrorCard message={jobsResponse.error} />;

  const { jobs, totalPages } = jobsResponse.data;
  const firstPage = page === 1;
  const lastPage = page === totalPages;

  return (
    <div className="w-11/12 mt-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Title</TableHead>
            <TableHead className="w-1/3">Company</TableHead>
            <TableHead className="w-1/6">Status</TableHead>
            <TableHead className="w-1/6 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id} className="hover:bg-muted transition">
              <TableCell>{job.title}</TableCell>

              <TableCell>{job.company}</TableCell>

              <TableCell>
                <span className={`px-2 py-1 rounded text-xs ${statusClass[job.status] ?? statusClass["default"]}`}>
                  {job.status}
                </span>
              </TableCell>

              <TableCell className="text-right flex gap-2 justify-end">
                <Link
                  href={`/jobs/${job.id}`}
                  className="px-2 py-1 rounded bg-primary text-white hover:bg-primary/80 text-xs"
                >
                  View
                </Link>
                <form action={`/jobs/${job.id}/delete`} method="post">
                  <button
                    type="submit"
                    className="px-2 py-1 rounded bg-destructive text-white hover:bg-destructive/80 text-xs"
                  >
                    Delete
                  </button>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <Link
          href={`?page=${Math.max(1, page - 1)}`}
          className={`px-3 py-1 rounded bg-secondary text-white ${firstPage ? "opacity-50 pointer-events-none" : ""}`}
        >
          Previous
        </Link>

        <span className="text-sm text-secondary">{`Page ${page} of ${totalPages}`}</span>

        <Link
          href={`?page=${Math.min(totalPages, page + 1)}`}
          className={`px-3 py-1 rounded bg-secondary text-white ${lastPage ? "opacity-50 pointer-events-none" : ""}`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
