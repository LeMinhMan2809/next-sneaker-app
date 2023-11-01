import Nav from "@/components/Nav"
import { useSession, signIn, signOut } from "next-auth/react" // use google to sign in

export default function Layout({children}) {
   const { data: session } = useSession()
   if (!session) {
    return (
      <div className='bg-green-900 w-screen h-screen flex items-center'>
        <div className="w-full text-center">
          <button onClick={()=> signIn('google')} className="bg-white p-2 px-4 rounded-lg">Login with Google</button>
        </div>
      </div>
      // <div>Not Logged in</div>
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
