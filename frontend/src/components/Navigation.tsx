"use client";

import Link from "next/link";
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
    { href: "/transfers", label: "Transfers", isActive: pathname === "/transfers" },
    { href: "/payouts", label: "Payouts", isActive: pathname === "/payouts" },
    { href: "/trading", label: "Trading", isActive: pathname === "/trading" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}