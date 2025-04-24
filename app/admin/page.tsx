'use client';

import Link from 'next/link';
import { FilePlusIcon, BookOpenIcon, SearchIcon } from 'lucide-react';

export default function AdminPage() {
  const links = [
    {
      href: '/admin/criar',
      label: 'Criar Paciente',
      icon: <FilePlusIcon className="w-6 h-6" />
    },
    {
      href: '/admin/material',
      label: 'Materiais / Apostilas',
      icon: <BookOpenIcon className="w-6 h-6" />
    },
    {
      href: '/admin/pesquisar',
      label: 'Pesquisar Paciente',
      icon: <SearchIcon className="w-6 h-6" />
    }
  ];

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Painel Administrativo</h1>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {links.map((link) => (
          <Link href={link.href} key={link.href}>
            <div className="border rounded-2xl p-5 hover:shadow-md transition cursor-pointer flex flex-col items-start gap-2">
              <div>{link.icon}</div>
              <div className="font-medium text-lg">{link.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
