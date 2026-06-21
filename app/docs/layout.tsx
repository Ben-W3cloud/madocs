import type { ReactNode } from "react";
import DocsHeader from "@/components/docs/DocsHeader";
import DocsSidebar from "@/components/docs/DocsSidebar";
import OnPageNav from "@/components/docs/OnPageNav";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-primary">
      <DocsHeader />
      <div className="mx-auto flex max-w-[1400px] gap-8 px-5 lg:px-8">
        <aside className="hidden w-[260px] shrink-0 lg:block">
          <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            <DocsSidebar />
          </div>
        </aside>
        <main className="min-w-0 flex-1 py-10 lg:py-14">
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-[minmax(0,740px)_220px]">
            <div className="min-w-0 max-w-[740px]">{children}</div>
            <OnPageNav />
          </div>
        </main>
      </div>
    </div>
  );
}
