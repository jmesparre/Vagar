"use client";

import { P } from '@/components/ui/typography';
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";

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

  // Animation Variants
  const heroTextVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2 }
    }
  };

  const carouselVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

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
        <motion.div
          className="relative z-10 flex w-full flex-col items-center justify-center px-4 text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants}
        >
          <motion.h1
            className="text-4xl font-bold text-white drop-shadow-md"
            variants={heroTextVariants}
          >
            Nosotros y nuestra historia
          </motion.h1>
          <motion.p
            className="mt-2 text-lg text-white drop-shadow-md"
            variants={heroTextVariants}
          >
            +25 años acompañando estadías en Merlo
          </motion.p>
        </motion.div>
      </div>

      <div className="container mx-auto px-10 pb-20">
        {/* Section 1: Creando recuerdos */}
        <div className="mb-20 pb-22 pt-11 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16">
          <motion.div
            className="flex flex-col justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainerVariants}
          >
            <motion.h2 className="text-4xl mb-6 font-semibold text-foreground" variants={fadeInUpVariants}>
              Creando recuerdos
            </motion.h2>
            <motion.div variants={fadeInUpVariants}>
              <P className="text-justify text-muted-foreground">
                VAGAR es una empresa de servicios inmobiliarios y turísticos cuyo titular es el Lic. en Adm. y M.C.P. Gabriel Barrera. Inicia sus actividades en 1997 como un servicio post-venta de CHUMAMAYA, empresa fundadora y constructora del Chumamaya Country Club, obra de Roberto y Celina Barrera. Como tal, VAGAR es la evolución natural de CHUMAMAYA.
              </P>
            </motion.div>
          </motion.div>
          <motion.div
            className="flex items-center justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={carouselVariants}
          >
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
          </motion.div>
        </div>

        {/* Section 2: La experiencia */}
        <div className="mb-20 pb-22 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16">
          <motion.div
            className="order-2 flex items-center justify-center md:order-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={carouselVariants}
          >
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
          </motion.div>
          <motion.div
            className="order-1 flex flex-col justify-center md:order-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainerVariants}
          >
            <motion.h2 className="text-4xl mb-6 font-semibold text-foreground" variants={fadeInUpVariants}>
              La experiencia de hospedarte diferente
            </motion.h2>
            <motion.div variants={fadeInUpVariants}>
              <P className="text-justify text-muted-foreground">
                Vagar consolida más de 25 años de trayectoria en la gestión de chalets y experiencias certeras, confiables y superadoras, acompañando a familias, parejas y amigos con una misma misión: convertir el tiempo vacacional en una experiencia ideal y alcanzar los mejores parámetros antes experimentados por el huésped, e incluso mejorarlos.
              </P>
            </motion.div>
            <motion.div variants={fadeInUpVariants}>
              <P className="text-justify text-muted-foreground">
                Creemos en una forma de trabajar basada en el compromiso, la honestidad y dar siempre más de lo esperado.
              </P>
            </motion.div>
          </motion.div>
        </div>

        {/* Section 3: Chumamaya */}
        <div className="grid pb-33 grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16">
          <motion.div
            className="flex flex-col justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainerVariants}
          >
            <motion.h2 className="text-4xl mb-6 font-semibold text-foreground" variants={fadeInUpVariants}>
              Chumamaya Country Club:
            </motion.h2>
            <motion.div variants={fadeInUpVariants}>
              <P className="text-justify text-muted-foreground">
                Un nombre que conecta con la historia y la naturaleza. Chumamaya proviene de la lengua camiare y significa “Río Bravo”. Así fue bautizado por la familia Barrera al crear el country en 1978.
              </P>
            </motion.div>
            <motion.div variants={fadeInUpVariants}>
              <P className="text-justify text-muted-foreground">
                Chumamaya tiene un marcado perfil ecosustentable, desarrollado sobre casi 400 hectáreas de montañas y naturaleza pura, de las cuales solo un 20% fue urbanizado con una arquitectura de jerarquía tanto en la zona deportiva como en el barrio residencial, logrando una sinergia positiva entre la intervención humana y el marco paisajístico único del lugar.
              </P>
            </motion.div>
          </motion.div>
          <motion.div
            className="flex items-center justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={carouselVariants}
          >
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
          </motion.div>
        </div >
      </div >
    </div >
  );
}
