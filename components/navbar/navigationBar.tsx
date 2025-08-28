import Link from 'next/link'
import { PlusCircle, CircleUserRound } from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'

const navigationLinks = [
  { name: 'Add Job', href: '/add-job', icon: PlusCircle, requiresAuth: true },
]

export const NavigationBar = async () => {
  const { sessionId } = await auth()
  const isAuthenticated = !!sessionId

  return (
    <nav className="bg-primary h-12 flex items-center justify-between px-4 relative">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 h-full">
        <img className="h-10" src="/jayob_logo_white.svg" alt="Jayob Logo" />
      </Link>

      <div className="flex flex-row items-center gap-4">
        {navigationLinks.map((link) => {
          if (link.requiresAuth && !isAuthenticated) return null

          return (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-2 text-white w-fit h-full"
            >
              <link.icon className="w-7.5 h-7.5 md:w-5 md:h-5" />
              <span className="hidden md:block">{link.name}</span>
            </Link>
          )
        })}

        {<AuthButtons />}
      </div>
    </nav>
  )
}

export const AuthButtons = async () => {
  const { sessionId } = await auth()

  return (
    <>
      {sessionId ? (
        <UserButton />
      ) : (
        <Link
          href="/auth/sign-in"
          className="flex items-center gap-2 text-white w-fit h-full"
        >
          <CircleUserRound className="w-8 h-8 md:h-5 md:w-5" />
          <span className="hidden md:block">Sign In</span>
        </Link>
      )}
    </>
  )
}
