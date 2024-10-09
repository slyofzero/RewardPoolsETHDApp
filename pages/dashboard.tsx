import { MainLayout } from "@/components";
import { Dashboard } from "@/components/Pages/Dashboard";
import Head from "next/head";

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <MainLayout>
        <Dashboard />
      </MainLayout>
    </>
  );
}
