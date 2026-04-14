import { Button } from "@/components/ui/button"
import { Compass, Home, Search } from 'lucide-react'
import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-500 to-amber-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold text-white tracking-tight sm:text-6xl">
            404
          </h1>
          <h2 className="text-3xl font-bold text-indigo-100">
            Lost in the Mythical Realm
          </h2>
          <p className="text-xl text-indigo-200">
            Oops! It seems you&apos;ve wandered into uncharted territory. 
            Even the gods are scratching their heads on this one.
          </p>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
            <Link to="/">
              <Home className="mr-2 h-5 w-5" />
              Return to Home
            </Link>
          </Button>
        </div>
        <div className="mt-8 flex justify-center">
          <Compass className="h-24 w-24 text-indigo-200 animate-spin-slow" />
        </div>
        <p className="mt-4 text-indigo-200">
        &quot;Not all those who wander are lost, but you might be.&quot; - Ancient Proverb
        </p>
      </div>
    </div>
  )
}

