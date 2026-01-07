"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  isActive: boolean;
}

export default function Navigation() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: "/", label: "Dashboard", isActive: pathname === "/" },
    {
      href: "/transfers",
      label: "Transfers",
      isActive: pathname === "/transfers",
    },
    { href: "/payouts", label: "Payouts", isActive: pathname === "/payouts" },
    { href: "/trading", label: "Trading", isActive: pathname === "/trading" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="/bitnob-logo.svg"
              alt="Bitnob Logo"
              width={32}
              height={32}
              className="transition-transform group-hover:scale-105"
            />
            <span className="text-xl font-semibold tracking-tight text-black">
              Bitnob
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  item.isActive
                    ? "bg-black text-white"
                    : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
