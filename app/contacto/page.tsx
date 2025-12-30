'use client';

import { H1, P, H4 } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { FacebookIcon, InstagramIcon, YoutubeIcon, WhatsappIcon } from '@/components/social-icons';
import { sendContactEmail } from '@/app/actions/contact';
import { useToast } from '@/components/ui/use-toast';
import { useState, useTransition } from 'react';

export default function ContactPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await sendContactEmail(formData);

      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      } else {
        setSuccess(true);
        toast({
          title: 'Mensaje enviado',
          description: 'Hemos recibido tu mensaje correctamente. Te contactaremos pronto.',
        });
      }
    });
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Columna Izquierda: Información de Contacto */}
        <div className="space-y-8">
          <div>
            <H1>Siempre listos para ayudarte a planificar tu próxima estadía</H1>
            <P className="text-muted-foreground mt-4">
              Completá el formulario y nos pondremos en contacto a la brevedad. Queremos que tu próxima estadía en las sierras de Merlo, San Luis, sea tan perfecta como la imaginás.
            </P>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
            <div>
              <H4>Nuestra Ubicación</H4>
              <P className="mt-4 text-muted-foreground">Chumamaya 2100, Merlo, San Luis,
                Argentina</P>
            </div>
            <div>
              <H4>Atención Telefónica</H4>
              <div className="flex items-center mt-4  text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                <span>02656 - 476500</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <H4>Email</H4>
              <div className="flex items-center mt-4 text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                <span>reservas@vagar.com.ar</span>
              </div>
            </div>
            <div>
              <H4>Redes Sociales</H4>
              <div className="flex items-center space-x-4 mt-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FacebookIcon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <InstagramIcon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <YoutubeIcon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
                </a>
                <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <WhatsappIcon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Formulario de Contacto */}
        <div>
          <Card className="py-10 bg-gray-50 border-none shadow-lg">
            <CardHeader>
              <CardTitle>Ponte en Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center animate-in fade-in zoom-in duration-300">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <H4>¡Mensaje enviado!</H4>
                    <P className="text-muted-foreground">
                      Hemos recibido tu mensaje correctamente. Nuestro equipo te contactará pronto.
                    </P>
                  </div>
                  <Button
                    variant="default"
                    onClick={() => setSuccess(false)}
                    className="mt-4"
                  >
                    Enviar otro mensaje
                  </Button>
                </div>
              ) : (
                <form action={handleSubmit} className="space-y-6">
                  <Input name="name" placeholder="Nombre completo" required />
                  <Input name="email" type="email" placeholder="Correo electrónico" required />
                  <Input name="subject" placeholder="Asunto" required />
                  <Textarea name="message" placeholder="Mensaje" rows={5} required />
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      'Enviar Mensaje'
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Placeholder para el Mapa */}
      <div className="mt-16 text-center bg-gray-100 p-16 rounded-lg">
        <H4>Sección del Mapa</H4>
        <P className="text-muted-foreground mt-2">
          El mapa.
        </P>
      </div>
    </div>
  );
}
