import { getJobs } from "./getJobs";
import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import ErrorCard from "@/components/ui/errorCard";
import { ApplicationStatus, Job } from "@prisma/client";
import { ArrowRight, ArrowUpDown, ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { jobStatusStyle } from "@/ts/jobStatusStyle";
import JobsFilterSelect from "./jobFilterSelect";

type JobsPageProps = {
  searchParams: Promise<{
    page: string;
    sortBy: keyof Job;
    sortOrder: "asc" | "desc";
    statusFilter: ApplicationStatus;
  }>;
};

type JobListProps = {
  jobs: Job[];
  page: number;
  totalPages: number;
  sortedBy: keyof Job;
  sortOrder: string;
  statusFilter: ApplicationStatus | "All";
};

type PaginationProps = {
  page: number;
  totalPages: number;
  sortedBy: keyof Job;
  sortOrder: "asc" | "desc";
  statusFilter: ApplicationStatus | "All";
};

const JobsPage = async (props: JobsPageProps) => {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page);
  const sortedBy = searchParams?.sortBy;
  const sortOrder = searchParams?.sortOrder;
  const statusFilter = searchParams?.statusFilter;
  const jobsResponse = await getJobs({ page, sortBy: sortedBy, sortOrder, statusFilter });

  if (!jobsResponse.success) return <ErrorCard message={jobsResponse.error} />;

  const { jobs, totalPages } = jobsResponse.data;
  const jobListProps = { jobs, page, totalPages, sortedBy, sortOrder, statusFilter };
  const paginationProps = { page, totalPages, sortedBy, sortOrder, statusFilter };

  return (
    <div className="w-11/12 mt-4 flexCol">
      {/* Pagination Controls */}
      <PaginationControls {...paginationProps} />

      {/* Mobile view */}
      <MobileJobsList {...jobListProps} />

      {/* Desktop view */}
      <DesktopJobsList {...jobListProps} />
    </div>
  );
};

export default JobsPage;

const MobileJobsList = ({ jobs }: JobListProps) => {
  return (
    <Table className="table md:hidden">
      <TableHeader>
        <TableRow className="bg-neutral-100">
          <TableHead className="w-14">
            <div className="w-12-h-12 bg-secondary rounded mx-auto">
              <ArrowRight strokeWidth={3} className="text-white p-1" />
            </div>
          </TableHead>

          <TableHead className="w-full">Company</TableHead>

          <TableHead className="w-24">Status</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job.id} className="hover:bg-muted transition">
            <TableCell>
              <Link href={`/job/${job.id}`} className="flexCol">
                <div className="w-[25px] h-[25px] bg-primary rounded">
                  <ArrowRight strokeWidth={3} className="text-white p-1" />
                </div>
              </Link>
            </TableCell>

            <TableCell>{job.company}</TableCell>

            <TableCell className="w-24">
              <p className={`px-2 py-1 rounded text-xs w-20 text-center ${jobStatusStyle[job.status]}`}>{job.status}</p>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const DesktopJobsList = ({ jobs, sortedBy, sortOrder, statusFilter }: JobListProps) => {
  const nextSortOrder = sortOrder === "asc" ? "desc" : "asc";

  return (
    <Table className="hidden md:table">
      <TableHeader>
        <TableRow className="bg-neutral-100">
          <TableHead className="w-16">
            <div className="w-12-h-12 bg-secondary rounded mx-auto">
              <ArrowRight strokeWidth={3} className="text-white p-1" />
            </div>
          </TableHead>

          <TableHead className="3/12">
            <Link
              href={`/view-jobs?page=1&sortBy=company&sortOrder=${nextSortOrder}&statusFilter=${statusFilter}`}
              className="flex items-center"
            >
              Company
              <ChevronsUpDown className="w-4 h-4 ml-2" />
              {sortedBy === "company" && <ArrowUpDown className="text-primary w-4 h-4 ml-2" />}
            </Link>
          </TableHead>

          <TableHead className="w-4/12">
            <Link
              href={`/view-jobs?page=1&sortBy=title&sortOrder=${nextSortOrder}&statusFilter=${statusFilter}`}
              className="flex items-center"
            >
              Job Title
              <ChevronsUpDown className="w-4 h-4 ml-2" />
              {sortedBy === "title" && <ArrowUpDown className="text-primary w-4 h-4 ml-2" />}
            </Link>
          </TableHead>

          <TableHead className="w-40">
            <Link
              href={`/view-jobs?page=1&sortBy=createdAt&sortOrder=${nextSortOrder}&statusFilter=${statusFilter}`}
              className="flex items-center"
            >
              Date Added
              <ChevronsUpDown className="`w-4 h-4 ml-2 text-inherit" />
              {sortedBy === "createdAt" && <ArrowUpDown className="text-primary w-4 h-4 ml-2" />}
            </Link>
          </TableHead>

          <TableHead className="w-36">
            Status
            <ChevronsUpDown className="w-4 h-4 ml-2" />
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job.id} className="hover:bg-muted transition">
            <TableCell className="w-16">
              <Link href={`/job/${job.id}`} className="flexCol">
                <div className="w-[25px] h-[25px] bg-primary rounded">
                  <ArrowRight strokeWidth={3} className="text-white p-1" />
                </div>
              </Link>
            </TableCell>

            <TableCell>{job.company}</TableCell>

            <TableCell>{job.title}</TableCell>

            <TableCell> {new Date(job.createdAt).toLocaleDateString("en-GB")}</TableCell>

            <TableCell className="w-36">
              <p className={`mx-auto px-2 py-1 rounded text-xs w-20 text-center ${jobStatusStyle[job.status]}`}>
                {job.status}
              </p>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const PaginationControls = ({ page, totalPages, sortedBy, sortOrder, statusFilter }: PaginationProps) => {
  const firstPage = page === 1;
  const lastPage = page === totalPages;
  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-end w-full mb-4">
      <JobsFilterSelect currentFilter={statusFilter} />

      <div className="flex flex-row-reverse md:flex-row justify-between md:items-end md:justify-end gap-8 w-full">
        <div className="flex justify-center items-center gap-4 ">
          <Link
            href={`?page=${prevPage}&sortBy=${sortedBy}&sortOrder=${sortOrder}&statusFilter=${statusFilter}`}
            className={`w-8 h-8 rounded flexCol ${firstPage ? "bg-neutral-200 pointer-events-none" : "bg-primary"}`}
          >
            <ChevronLeft className="text-white" />
          </Link>

          <span className="text-sm text-secondary">{`Page ${page} of ${totalPages}`}</span>

          <Link
            href={`?page=${nextPage}&sortBy=${sortedBy}&sortOrder=${sortOrder}&statusFilter=${statusFilter}`}
            className={`w-8 h-8 rounded flexCol ${lastPage ? "bg-neutral-200 pointer-events-none" : "bg-primary"}`}
          >
            <ChevronRight className="text-white" />
          </Link>
        </div>

        <LinkButton href="/add-job" className="h-8">
          Add Job
        </LinkButton>
      </div>
    </div>
  );
};
