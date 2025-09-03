import Link from "next/link";
import { CircleUserRound } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import MobileMenu from "./mobileMenu";
import { LinkButton } from "../ui/button";

const navigationLinks = [
  {
    name: "View Jobs",
    href: "/view-jobs?page=1&sortBy=createdAt&sortOrder=desc&statusFilter=All",
    requiresAuth: true,
  },
  { name: "Add Job", href: "/add-job", requiresAuth: true },
  { name: "Log Out", href: "/auth/sign-out", requiresAuth: false, isMobileOnly: true },
];

export const NavigationBar = async () => {
  const { sessionId } = await auth();
  const isAuthenticated = !!sessionId;

  return (
    <nav className="h-12 md:h-16 flex items-center justify-between mx-0 md:mx-4 px-0 pl-4 md:px-4 relative border-b border-gray-300 gap-2">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 h-full">
        <img className="h-8 md:h-9 md:block" src="/jayob_logo_green.svg" alt="Jayob Logo" />
      </Link>

      {/* Desktop Links */}
      <div className="flex flex-row items-center gap-10">
        {navigationLinks.map((link) => {
          if (link.requiresAuth && !isAuthenticated) return null;
          if (link.isMobileOnly) return null;

          return (
            <Link
              key={link.name}
              href={link.href}
              className="hidden md:flex items-center gap-2 text-darkGrey w-fit h-full"
            >
              {link.name}
            </Link>
          );
        })}

        {<AuthButtons />}
      </div>

      {/* Mobile Burger Menu */}
      {isAuthenticated ? (
        <MobileMenu isAuthenticated={isAuthenticated} navigationLinks={navigationLinks} />
      ) : (
        <LinkButton href="/auth/sign-in" className="mr-4 md:mr-0 h-8">
          Sign in
        </LinkButton>
      )}
    </nav>
  );
};

export const AuthButtons = async () => {
  const { sessionId } = await auth();

  return (
    <div className="hidden md:block md:flexCol">
      {sessionId ? (
        <UserButton />
      ) : (
        <Link href="/auth/sign-in" className="flex items-center gap-2 text-white w-fit h-full">
          <CircleUserRound className="w-8 h-8 md:h-5 md:w-5" />
          <span className="hidden md:block">Sign In</span>
        </Link>
      )}
    </div>
  );
};
