import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';

const Header = () => {
  const navLinks = [
    { href: '/chalets', label: 'Chalets' },
    { href: '/mapa', label: 'Mapa' },
    { href: '/experiencias', label: 'Experiencias' },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/contacto', label: 'Contacto' },
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">
          <Link href="/">Vagar</Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-gray-600 hover:text-gray-800">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-800">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="text-left mb-4">Menú</SheetTitle>
              <nav className="flex flex-col space-y-4 mt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg text-gray-600 hover:text-gray-800 font-medium"
                  >
                    {link.label}
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
