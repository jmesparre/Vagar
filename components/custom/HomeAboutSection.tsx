"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { H2, P } from "@/components/ui/typography";

const HomeAboutSection = () => {
    return (
        <div className="relative w-full h-[500px] flex items-center justify-center">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('/home-nosotros.webp')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
                <H2 className="text-white mb-4">Sobre Nosotros</H2>
                <P className="text-white/90 mb-8 text-lg">
                    En Vagar Vacaciones, nos dedicamos a crear experiencias inolvidables.
                    Descubre nuestra historia, nuestra misión y el equipo apasionado que hace posible tus mejores vacaciones.
                </P>
                <Link href="/nosotros">
                    <Button size="lg" className="bg-white text-black hover:bg-white/90 border-none">
                        Conoce Más
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default HomeAboutSection;
