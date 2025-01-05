"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoSrc from "public/logopo.png";
import { cx } from "lib/cx";
import { createClient } from "lib/supabase/client";
import { useAuth } from "lib/context/AuthContext";

export const TopNavBar = () => {
  const pathName = usePathname();
  const isHomePage = pathName === "/";
  const { user, isLoading } = useAuth();
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const renderNavItems = () => {
    if (isLoading) return null;

    return user ? (
      <>
        <Link
          className="rounded-md px-1.5 py-2 text-gray-500 hover:bg-gray-100 focus-visible:bg-gray-100 lg:px-4"
          href="/dashboard"
        >
          Dashboard
        </Link>
        <button
          onClick={handleLogout}
          className="rounded-md px-1.5 py-2 text-gray-500 hover:bg-gray-100 focus-visible:bg-gray-100 lg:px-4"
        >
          Logout
        </button>
      </>
    ) : (
      <Link
        className="rounded-md px-1.5 py-2 text-gray-500 hover:bg-gray-100 focus-visible:bg-gray-100 lg:px-4"
        href="/auth/login"
      >
        Login
      </Link>
    );
  };

  return (
    <header
      aria-label="Site Header"
      className={cx(
        "flex h-[var(--top-nav-bar-height)] items-center border-b-2 border-gray-100 px-3 lg:px-12",
        isHomePage && "bg-dot"
      )}
    >
      <div className="flex h-10 w-full items-center justify-between">
        <Link href="/">
          <span className="sr-only">Prosper.cv</span>
          <Image src={logoSrc} alt="Prosper.cv Logo" className="h-8 w-full" priority />
        </Link>
        <nav aria-label="Site Nav Bar" className="flex items-center gap-2 text-sm font-medium">
          {renderNavItems()}
        </nav>
      </div>
    </header>
  );
};
