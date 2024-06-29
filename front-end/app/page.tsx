import Image from "next/image";
import MainView from "./components/main-view";

export default function Home() {
  return (
   <main className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 pt-8">
    
    
    <div className="max-w-[1100px] mx-auto pb-4">
    <MainView/>
    </div>

   </main>
  )
}
