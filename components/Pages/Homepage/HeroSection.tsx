import { Link } from "@/components/Common";
import { MainLayout } from "@/components/Layouts";

export function HeroSection() {
  return (
    <MainLayout>
      <main className="h-screen flex flex-grow items-center justify-center">
        <div className="flex gap-16 text-xl">
          <div>
            <Link href={"/stake"}>Stake on existing pools</Link>
          </div>

          <div>
            <Link href={"/createPool"}>Create Staking pool</Link>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
