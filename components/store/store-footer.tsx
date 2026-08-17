"use client";

interface StoreFooterProps {
  store: {
    name: string;
    description: string;
  };
}

export function StoreFooter({ store }: StoreFooterProps) {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{store.name}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {store.description}
          </p>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
