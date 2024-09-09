export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-full p-4">
      <div className="h-full w-full rounded-md border border-zinc-700 max-h-full">
        {children}
      </div>
    </div>
  );
}
