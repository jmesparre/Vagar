import { H1, H4, P, Small } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Columna Izquierda: Información de Contacto */}
        <div className="space-y-8">
          <div>
            
            <Small className="text-muted-foreground">/ ponte en contacto /</Small>
            <H1>Siempre estamos listos para ayudarte y responder tus preguntas</H1>
            <P className="text-muted-foreground mt-4">
              Completa el formulario o utiliza nuestros canales de contacto directo. Nuestro equipo está disponible para asistirte con cualquier consulta que tengas.
            </P>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <H4>Atención Telefónica</H4>
              <div className="flex items-center mt-4 text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                <span>800 100 975 20 54</span>
              </div>
              <div className="flex items-center mt-2 text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                <span>(123) 1800-234-5678</span>
              </div>
            </div>
            <div>
              <H4>Nuestra Ubicación</H4>
              <P className="mt-4 text-muted-foreground">USA, New York - 1060</P>
              <P className="text-muted-foreground">Str. First Avenue 1</P>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <H4>Email</H4>
              <div className="flex items-center mt-4 text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                <span>neuros@mail.co</span>
              </div>
            </div>
            <div>
              <H4>Redes Sociales</H4>
              <div className="flex items-center space-x-4 mt-4">
                <Facebook className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
                <Twitter className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
                <Instagram className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
                <Linkedin className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Formulario de Contacto */}
        <div>
          <Card className="bg-gray-50 border-none shadow-lg">
            <CardHeader>
              <CardTitle>Ponte en Contacto</CardTitle>
              <P className="text-muted-foreground pt-2">
                Completa el formulario y nos pondremos en contacto contigo a la brevedad.
              </P>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <Input placeholder="Nombre completo" />
                <Input type="email" placeholder="Correo electrónico" />
                <Input placeholder="Asunto" />
                <Textarea placeholder="Mensaje" rows={5} />
                <Button type="submit" className="w-full">
                  Enviar Mensaje
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Placeholder para el Mapa */}
      <div className="mt-16 text-center bg-gray-100 p-16 rounded-lg">
        <H4>Sección del Mapa</H4>
        <P className="text-muted-foreground mt-2">
          El mapa interactivo se implementará aquí en una futura actualización.
        </P>
      </div>
    </div>
  );
}
