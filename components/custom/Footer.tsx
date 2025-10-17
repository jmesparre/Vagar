const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto px-4 py-6 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} Vagar Vacaciones. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
