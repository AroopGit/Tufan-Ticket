import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mountain } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Mountain className="h-6 w-6" />
          <span className="text-lg font-bold">EventPulse</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/event-ideas" className="text-sm font-medium hover:text-primary">
            Event Ideas
          </Link>
          <Link href="/ticket-prediction" className="text-sm font-medium hover:text-primary">
            Ticket Sales
          </Link>
          <Link href="/event-feedback" className="text-sm font-medium hover:text-primary">
            Event Feedback
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-primary">
            Pricing
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-primary">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="#" className="text-sm font-medium hover:text-primary hidden md:inline-block">
            Sign In
          </Link>
          <Button size="sm">Get Started</Button>
        </div>
      </div>
    </header>
  )
}

