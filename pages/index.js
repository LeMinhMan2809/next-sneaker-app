// import Image from 'next/image'
// import { Inter } from 'next/font/google'
import { useSession } from "next-auth/react"
// const inter = Inter({ subsets: ['latin'] })
import Layout from "@/components/Layout"
import HomeStats from "@/components/HomeStats"

export default function Home() {
   const { data: session } = useSession()
   return (
      <Layout>
         <div className="flex text-black-500 justify-between ">
            <h2>Welcome back, <b className="text-green-500">{session?.user?.name}</b></h2>

            <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden" >
               <img className="w-6 h-6" src={session?.user?.image} />
               <span className="px-2">{session?.user?.email}</span>
            </div>
         </div>
         <HomeStats />
      </Layout>
   )
}
