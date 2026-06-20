import { TopNav } from "@/components/app/top-nav";

// App embutido como iframe no CRM — navegação por abas superiores (padrão
// FORGE/GoHighLevel), sem sidebar. O CRM autentica o usuário.
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="animate-rise">{children}</div>
      </main>
    </div>
  );
}
