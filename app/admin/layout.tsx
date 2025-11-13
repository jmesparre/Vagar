"use client";

import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col">
        <div className="flex-1">
          <nav className="mt-2">
            <a
              href="/admin/dashboard"
              className="block px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
            >
              Dashboard
            </a>
            <a
              href="/admin/consultas"
              className="block px-6 py-2.5 mt-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
            >
              Consultas
            </a>
            <a
              href="/admin/disponibilidad"
              className="block px-6 py-2.5 mt-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
            >
              Disponibilidad
            </a>
            <a
              href="/admin/chalets"
              className="block px-6 py-2.5 mt-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
            >
              Chalets
            </a>
            <a
              href="/admin/chalets/new"
              className="block px-6 py-2.5 mt-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
            >
              Cargar Chalet
            </a>
            <a
              href="/admin/experiencias"
              className="block px-6 py-2.5 mt-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
            >
              Experiencias
            </a>
            <a
              href="/admin/galeria"
              className="block px-6 py-2.5 mt-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
            >
              Galería
            </a>
            <a
              href="/admin/testimonials"
              className="block px-6 py-2.5 mt-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
            >
              Testimonios
            </a>
          </nav>
        </div>
        <div className="p-4">
          <Button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full"
            variant="outline"
          >
            Cerrar Sesión
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
        <Toaster />
      </main>
    </div>
  );
}
