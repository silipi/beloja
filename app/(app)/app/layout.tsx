import Link from 'next/link';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/app/dashboard"
            className="font-display text-2xl tracking-tight"
          >
            B<span className="italic font-light text-primary">e</span>loja
          </Link>
        </div>
      </header>
      <div>{children}</div>
    </div>
  );
}
