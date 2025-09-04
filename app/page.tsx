import { LinkButton } from "@/components/ui/button";
import { FileText, Sparkles, UserCheck } from "lucide-react";

const featuresData = [
  {
    id: 3,
    icon: FileText,
    title: "Smart Parsing",
    description: "Paste job adverts and let Jayob extract key details automatically.",
  },
  {
    id: 2,
    icon: UserCheck,
    title: "Application Tracker",
    description: "Keep track of all your job applications and statuses in one place.",
  },
  {
    id: 1,
    icon: Sparkles,
    title: "AI Cover Letters",
    description: "Generate tailored cover letters instantly for every job application.",
  },
];

export default function Home() {
  return (
    <main className="flex w-screen flex-col items-center justify-center">
      <article className="relative w-full mt-0 md:mt-8 ">
        <div className="from-primary/10 via-primary/10 relative flex flex-col items-center justify-start rounded-none bg-gradient-to-b to-transparent sm:mx-4 sm:rounded-xl md:mx-8">
          <h1 className="text-secondary mt-8 px-4 text-center text-4xl font-extrabold md:text-6xl md:leading-20">
            AI-powered job applications
          </h1>
          <p className="text-secondary px-4 text-center text-4xl font-extrabold md:text-6xl md:leading-20">
            for <span className="text-primary">modern job seekers</span>
          </p>
          <p className="text-muted-foreground mt-4 mb-4 w-full px-6 text-center leading-6 sm:leading-7 md:mt-6 md:mb-8 md:px-16 md:text-base lg:w-[730px] lg:px-0">
            Jayob helps you track your applications, extract job details and create tailored cover letters using AI.
            Streamline your job search and land your next role faster.
          </p>
          <div className="mb-6 flex w-full flex-col items-center justify-center gap-3 px-4 sm:flex-row sm:gap-4">
            <LinkButton size="lg" href="/auth/sign-in" className="px-12">
              Get Started
            </LinkButton>
          </div>
        </div>
      </article>

      <section className="mt-12 mb-4 w-full px-4 text-center md:px-12 lg:px-24">
        <h2 className="text-secondary text-2xl font-bold md:text-3xl lg:text-4xl">Why Jayob Tracker?</h2>
        <p className="mx-auto max-w-[400px] px-2 text-gray-600 md:max-w-[500px] lg:max-w-[800px] lg:text-lg">
          Discover the features that make job hunting smarter and easier.
        </p>
      </section>

      <div className="mb-20 grid w-full grid-cols-1 gap-6 px-4 md:px-12 lg:grid-cols-3 lg:px-24">
        {featuresData.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <div key={feature.id} className="rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
              <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                <IconComponent className="text-primary" />
              </div>
              <h3 className="text-secondary mb-2 text-xl font-bold">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
