import { Link } from "@/components/Common";
import { MainLayout } from "@/components/Layouts";

export function HeroSection() {
  return (
    <MainLayout>
      <main className="h-screen flex flex-col items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-5xl font-bold">WELCOME TO BUTTERFLY AI!</h1>
          <p className="text-xl mt-4 font-medium">
            First of its kind Proof Of Wallet Ownership dApp, powered by $FLY
          </p>
        </div>

        <div className="mt-12 flex gap-8">
          <button className="bg-white text-black text-lg font-extrabold py-4 px-8 rounded-lg">
            <Link href={"/pools"}>Stake Now</Link>
          </button>
          <button className="bg-white text-black text-lg font-extrabold py-4 px-8 rounded-lg">
            <Link href={"/pools/create"}>Tutorial</Link>
          </button>
        </div>

        <div className="mt-16 bg-cyan-400 py-4 w-full md:w-1/2 mx-auto text-center text-black font-extrabold rounded-lg">
          <h2 className="text-lg">FOR DEVELOPERS</h2>
          <div className="flex justify-center gap-2 md:gap-8 mt-4 md:text-lg">
            <Link
              className="bg-pink-600 py-2 md:py-4 px-4 md:px-8 rounded-full whitespace-nowrap"
              href={"/pools/create"}
            >
              Create a Pool
            </Link>

            <Link
              className="bg-pink-600 py-2 md:py-4 px-4 md:px-8 rounded-full whitespace-nowrap"
              href={"/docs"}
            >
              Documentation
            </Link>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
