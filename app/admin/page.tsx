'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FilePlusIcon, BookOpenIcon, SearchIcon, LogOutIcon } from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebases';

export default function AdminPage() {
  const router = useRouter();
  const { autenticado, carregando } = useAdminAuth();

  if (carregando) return <p className="p-6">Carregando...</p>;
  if (!autenticado && !carregando) {
    return <p className="p-6 text-red-600">Você não tem permissão para acessar esta página.</p>;
  }

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

  const fazerLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <main className="p-6 space-y-6 relative">
      {/* Botão de logout no canto superior direito */}
      <button
        onClick={fazerLogout}
        className="absolute top-4 right-4 flex items-center gap-2 text-sm text-red-600 font-semibold hover:underline"
      >
        <LogOutIcon className="w-5 h-5" />
        Sair
      </button>

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
