import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/chalets', label: 'Chalets' },
    { href: '/mapa', label: 'Mapa' },
    { href: '/experiencias', label: 'Experiencias' },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/contacto', label: 'Contacto' },
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-0 py-0 max-h-[60px] flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/logo_vagar.svg"
              alt="Vagar"
              width={200}
              height={65}
              className="h-22 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-gray-600 text-sm hover:text-gray-800">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-800">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className='hidden'>menú</SheetTitle>
              <nav className="flex flex-col space-y-0 mx-8 mt-14">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg text-gray-600 hover:text-gray-800 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                    <Separator className="my-3" />

                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
