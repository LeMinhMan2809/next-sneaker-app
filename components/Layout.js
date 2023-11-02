import Nav from "@/components/Nav"
import { useSession, signIn, signOut } from "next-auth/react" // use google to sign in
import Image from "next/image"

export default function Layout({ children }) {
  const { data: session } = useSession()
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <div className="mt-8 space-y-6">
            <div>
              <button onClick={() => signIn('google')} className="group text-base items-center gap-3 relative w-full flex justify-center py-2 px-4 border border-transparent font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <img src="/images/google.png" alt="Google" className="w-8 h-8" /> Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div >
    )
  }
  return (
    <div className="bg-green-900 min-h-screen flex">
      <Nav />
      <div className="bg-white flex-grow mt-2 mr-2 rouded-lg p-4">
        {children}
      </div>
    </div>
  )
}
