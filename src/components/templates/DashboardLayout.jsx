export function DashboardLayout({ sidebar, header, children }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {header}
      <div className="flex flex-1 overflow-hidden">
        {sidebar}
        <main className="flex-1 flex flex-col min-w-0 bg-bg">
          {children}
        </main>
      </div>
    </div>
  );
}
