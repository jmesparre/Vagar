import { P } from '@/components/ui/typography';
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function NosotrosPage() {
  const images = [
    "/nosotros/Galeria_1/creando_recuerdos_01.webp",
    "/nosotros/Galeria_1/creando_recuerdos_02.webp",
    "/nosotros/Galeria_1/creando_recuerdos_03.webp",
  ];

  const imagesExperience = [
    "/nosotros/Galeria_2/Nosotros_experiencia_01.webp",
    "/nosotros/Galeria_2/Nosotros_experiencia_02.webp",
    "/nosotros/Galeria_2/Nosotros_experiencia_03.webp",
  ];

  const imagesChumamaya = [
    "/nosotros/Galeria_3/Chumamaya_01.webp",
    "/nosotros/Galeria_3/Chumamaya_02.webp",
    "/nosotros/Galeria_3/Chumamaya_03.webp",
    "/nosotros/Galeria_3/Chumamaya_04.webp",
  ];

  return (
    <div className="w-full">
      <div className="relative mb-16 flex h-[250px] w-full items-center justify-center">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/Banner-search.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 flex w-full flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-md">
            Nosotros y nuestra historia
          </h1>
          <p className="mt-2 text-lg text-white drop-shadow-md">
            +25 años acompañando estadías en Merlo
          </p>
        </div>
      </div>

      <div className="container mx-auto px-10 pb-20">
        <div className="mb-20 pb-22 pt-11 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-semibold text-foreground">Creando recuerdos</h2>
            <P className="text-justify text-muted-foreground">
              VAGAR es una empresa de servicios inmobiliarios y turísticos cuyo titular es el Lic. en Adm. y M.C.P. Gabriel Barrera. Inicia sus actividades en 1997 como un servicio post-venta de CHUMAMAYA, empresa fundadora y constructora del Chumamaya Country Club, obra de Roberto y Celina Barrera. Como tal, VAGAR es la evolución natural de CHUMAMAYA.
            </P>
          </div>
          <div className="flex items-center justify-center">
            <Carousel className="w-full max-w-lg">
              <CarouselContent>
                {images.map((src, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                      <Image
                        src={src}
                        alt={`Galería nosotros imagen ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <CarouselPrevious className="static translate-y-0" />
                <CarouselNext className="static translate-y-0" />
              </div>
            </Carousel>
          </div>
        </div>

        <div className="mb-20 pb-22 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16">
          <div className="order-2 flex items-center justify-center md:order-1">
            <Carousel className="w-full max-w-lg">
              <CarouselContent>
                {imagesExperience.map((src, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                      <Image
                        src={src}
                        alt={`Galería experiencia imagen ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <CarouselPrevious className="static translate-y-0" />
                <CarouselNext className="static translate-y-0" />
              </div>
            </Carousel>
          </div>
          <div className="order-1 flex flex-col justify-center md:order-2">
            <h2 className="text-4xl font-semibold text-foreground">
              La experiencia de hospedarte diferente
            </h2>
            <P className="text-justify text-muted-foreground">
              Vagar consolida más de 25 años de trayectoria en la gestión de chalets y experiencias certeras, confiables y superadoras, acompañando a familias, parejas y amigos con una misma misión: convertir el tiempo vacacional en una experiencia ideal y alcanzar los mejores parámetros antes experimentados por el huésped, e incluso mejorarlos.
            </P>
            <P className="text-justify text-muted-foreground">
              Creemos en una forma de trabajar basada en el compromiso, la honestidad y dar siempre más de lo esperado.
            </P>
          </div>
        </div>

        <div className="grid pb-33 grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-semibold text-foreground">
              Chumamaya Country Club:
            </h2>
            <P className="text-justify text-muted-foreground">
              Un nombre que conecta con la historia y la naturaleza. Chumamaya proviene de la lengua camiare y significa “Río Bravo”. Así fue bautizado por la familia Barrera al crear el country en 1978.
            </P>
            <P className="text-justify text-muted-foreground">
              Chumamaya tiene un marcado perfil ecosustentable, desarrollado sobre casi 400 hectáreas de montañas y naturaleza pura, de las cuales solo un 20% fue urbanizado con una arquitectura de jerarquía tanto en la zona deportiva como en el barrio residencial, logrando una sinergia positiva entre la intervención humana y el marco paisajístico único del lugar.
            </P>
          </div>
          <div className="flex items-center justify-center">
            <Carousel className="w-full max-w-lg">
              <CarouselContent>
                {imagesChumamaya.map((src, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                      <Image
                        src={src}
                        alt={`Galería Chumamaya imagen ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <CarouselPrevious className="static translate-y-0" />
                <CarouselNext className="static translate-y-0" />
              </div>
            </Carousel>
          </div>
        </div >
      </div >
    </div >
  );
}
