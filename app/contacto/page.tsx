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
            <Small className="text-muted-foreground">/ get in touch /</Small>
            <H1>We are always ready to help you and answer your questions</H1>
            <P className="text-muted-foreground mt-4">
              Pacific hake false trevally queen parrotfish black prickleback mosshead warbonnet sweetlips. Greenling sleeper.
            </P>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <H4>Call Center</H4>
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
              <H4>Our Location</H4>
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
              <H4>Social network</H4>
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
              <CardTitle>Get in Touch</CardTitle>
              <P className="text-muted-foreground pt-2">
                Define your goals and identify areas where AI can add value to your business.
              </P>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <Input placeholder="Full name" />
                <Input type="email" placeholder="Email" />
                <Input placeholder="Subject" />
                <Textarea placeholder="Message" rows={5} />
                <Button type="submit" className="w-full">
                  Send a message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Placeholder para el Mapa */}
      <div className="mt-16 text-center bg-gray-100 p-16 rounded-lg">
        <H4>Map Section</H4>
        <P className="text-muted-foreground mt-2">
          The interactive map will be implemented here in a future update.
        </P>
      </div>
    </div>
  );
}
