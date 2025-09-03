"use client";

import { useTransition, useState } from "react";
import { ApplicationStatus } from "@prisma/client";
import updateJobStatus from "@/app/job/updateJobStatus";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useRouter } from "next/navigation";

type JobStatusSelectProps = {
  jobId: number;
  currentStatus: ApplicationStatus;
};

const statusOptions: { value: ApplicationStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

const unknownError = "Server Error. Unable to update application status.";

const JobStatusSelect = ({ jobId, currentStatus }: JobStatusSelectProps) => {
  const [selected, setSelected] = useState<ApplicationStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (value: ApplicationStatus) => {
    setSelected(value);
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("jobId", String(jobId));
      formData.append("status", value);

      const result = await updateJobStatus(formData);
      if (!result.success) setError(result.error || unknownError);

      router.refresh();
    });
  };

  return (
    <div className="w-full px-4 md:px-6 mt-4">
      <label htmlFor="job-status" className="block font-bold text-sm text-muted-foreground pl-1 mb-1">
        Update Application Status:
      </label>
      <Select value={selected} onValueChange={handleChange} disabled={isPending}>
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className=" text-center text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default JobStatusSelect;
