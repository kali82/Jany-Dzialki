import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ContactForm } from "@/components/ContactForm";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Trees,
  Home,
  Phone,
  Check,
  Droplets,
  Zap,
  Flame,
  Bus,
  Grape,
  TentTree,
  Leaf,
  ChevronLeft,
  ChevronRight,
  X,
  Flag,
  Dumbbell,
  Baby,
} from "lucide-react";
import { Button } from "./components/ui/button";

const queryClient = new QueryClient();

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const galleryImages = [
  {
    src: "/mapa-dzialki.png",
    title: "Widok z lotu ptaka",
    desc: "Czerwonymi ramkami zaznaczono dwie działki (282/7 i 282/9) – każda po 30 arów"
  },
  {
    src: "/wizualizacja-osiedla.png",
    title: "Wizualizacja zabudowy",
    desc: "Przykład zagospodarowania: 3 domy na każdej działce, po 10 arów każdy"
  },
  {
    src: "/boisko-silownia.png",
    title: "Kompleks sportowy i siłownia",
    desc: "Boisko Orlik z boiskami do piłki nożnej, koszykówki i siatkówki oraz siłownia plenerowa – zaledwie 100 m od działek"
  },
  {
    src: "/plac-zabaw.png",
    title: "Nowoczesny plac zabaw",
    desc: "Duży, dobrze wyposażony plac zabaw w sąsiedztwie"
  },
  {
    src: "/pole-golfowe.png",
    title: "Pole golfowe Przytok",
    desc: "Profesjonalne pole golfowe w Przytoku – zaledwie 2 km od działek"
  },
];

function Lightbox({ images, index, onClose, onPrev, onNext }: {
  images: typeof galleryImages;
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        data-testid="button-lightbox-close"
        className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
        onClick={onClose}
      >
        <X className="w-8 h-8" />
      </button>
      <button
        data-testid="button-lightbox-prev"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 bg-black/30 rounded-full p-2"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        data-testid="button-lightbox-next"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 bg-black/30 rounded-full p-2"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
      >
        <ChevronRight className="w-8 h-8" />
      </button>
      <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={images[index].src}
            alt={images[index].title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="w-full max-h-[75vh] object-contain rounded-xl"
          />
        </AnimatePresence>
        <div className="text-center mt-4">
          <p className="text-white font-bold text-lg">{images[index].title}</p>
          <p className="text-white/70 text-sm mt-1">{images[index].desc}</p>
          <p className="text-white/40 text-xs mt-2">{index + 1} / {images.length}</p>
        </div>
      </div>
    </motion.div>
  );
}

const slideshowItems = [
  {
    src: "/boisko-silownia.png",
    label: "Kompleks sportowy Orlik",
    sub: "100 m od działki",
    icon: Dumbbell,
  },
  {
    src: "/plac-zabaw.png",
    label: "Nowoczesny plac zabaw",
    sub: "Tuż za rogiem",
    icon: Baby,
  },
  {
    src: "/pole-golfowe.png",
    label: "Pole golfowe Przytok",
    sub: "Zaledwie 2 km",
    icon: Flag,
  },
];

function Slideshow() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + slideshowItems.length) % slideshowItems.length);
  const next = () => setCurrent((c) => (c + 1) % slideshowItems.length);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={slideshowItems[current].src}
          alt={slideshowItems[current].label}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full h-full object-cover absolute inset-0"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <AnimatePresence mode="wait">
        <motion.div
          key={current + "-label"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="absolute bottom-0 left-0 p-6 text-white"
        >
          <div className="flex items-center gap-2 mb-1">
            {(() => {
              const Icon = slideshowItems[current].icon;
              return <Icon className="w-5 h-5 text-secondary" />;
            })()}
            <span className="text-secondary text-sm font-semibold uppercase tracking-wider">
              {slideshowItems[current].sub}
            </span>
          </div>
          <h3 className="text-2xl font-bold font-serif">{slideshowItems[current].label}</h3>
        </motion.div>
      </AnimatePresence>
      <button
        data-testid="button-slideshow-prev"
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        data-testid="button-slideshow-next"
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      <div className="absolute bottom-4 right-4 flex gap-1.5">
        {slideshowItems.map((_, i) => (
          <button
            key={i}
            data-testid={`button-slide-dot-${i}`}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-secondary w-5" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}

function LandingPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-white">

      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/plot.png"
            alt="Działki budowlane Jany Zielona Góra"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white mt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-secondary/90 text-secondary-foreground text-sm font-semibold tracking-wider mb-6 shadow-sm backdrop-blur-sm">
              OGŁOSZENIE PRYWATNE
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif mb-6 leading-tight text-white drop-shadow-md">
              Twoje miejsce na ziemi.<br />
              <span className="text-secondary font-light italic">Jany, Zielona Góra</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-100 mb-10 max-w-2xl mx-auto font-light drop-shadow">
              Prywatna sprzedaż działek budowlanych na cichych, zielonych obrzeżach miasta. Zbuduj dom w otoczeniu lasów i łąk.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button data-testid="link-oferta" size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-6 text-lg w-full sm:w-auto shadow-lg" onClick={() => document.getElementById('oferta')?.scrollIntoView({ behavior: 'smooth' })}>
                Zobacz ofertę
              </Button>
              <Button data-testid="link-galeria" size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-8 py-6 text-lg w-full sm:w-auto backdrop-blur-sm" onClick={() => document.getElementById('galeria')?.scrollIntoView({ behavior: 'smooth' })}>
                Galeria zdjęć
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-[30px] h-[50px] rounded-full border-2 border-white/50 flex justify-center p-2">
            <div className="w-1 h-3 bg-secondary rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Offer Section */}
      <section id="oferta" className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6 text-foreground">Oferta i cennik</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Działki (282/7 i 282/9) w strefie zabudowy jednorodzinnej. Możliwość zakupu całości lub podziału na mniejsze parcele. Pozostało <strong>5 działek</strong> do wyboru!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="bg-card border border-card-border rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold font-serif">10 arów</h3>
              <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">POPULARNE</span>
            </div>
            <p className="text-muted-foreground mb-6">Wydzielona działka ok. 1070 m² z drogą dojazdową wzdłuż prawej strony. Idealna pod dom jednorodzinny z ogrodem.</p>
            <div className="mb-8">
              <span className="text-4xl font-bold text-foreground">180 000 zł</span>
              <span className="text-muted-foreground block text-sm mt-1">180 zł/m²</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3"><Check className="text-secondary w-5 h-5" /><span>Gotowa do zabudowy</span></li>
              <li className="flex items-center gap-3"><Check className="text-secondary w-5 h-5" /><span>Dostęp do mediów</span></li>
              <li className="flex items-center gap-3"><Check className="text-secondary w-5 h-5" /><span>Strefa zabudowy jednorodzinnej (MPZP)</span></li>
              <li className="flex items-center gap-3"><Check className="text-secondary w-5 h-5" /><span>Droga dojazdowa wzdłuż działki</span></li>
            </ul>
            <Button data-testid="button-zapytaj-10" className="w-full" variant="outline" onClick={() => document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' })}>
              Zapytaj o tę opcję
            </Button>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="bg-primary text-primary-foreground rounded-2xl p-8 shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary rounded-bl-full -mr-10 -mt-10 opacity-20" />
            <h3 className="text-2xl font-bold font-serif mb-4 relative z-10">30 arów (całość)</h3>
            <p className="text-primary-foreground/80 mb-6 relative z-10">Pełna działka 3210 m² – dla szukających przestrzeni lub jako inwestycja deweloperska.</p>
            <div className="mb-8 relative z-10">
              <span className="text-4xl font-bold text-white">570 000 zł</span>
              <span className="text-primary-foreground/80 block text-sm mt-1">180 zł/m² • Możliwość podziału na 3 działki po 10 arów</span>
            </div>
            <ul className="space-y-3 mb-8 relative z-10 text-primary-foreground/90">
              <li className="flex items-center gap-3"><Check className="text-secondary w-5 h-5" /><span>Pełna powierzchnia 3210 m²</span></li>
              <li className="flex items-center gap-3"><Check className="text-secondary w-5 h-5" /><span>Możliwość budowy do 3 domów</span></li>
              <li className="flex items-center gap-3"><Check className="text-secondary w-5 h-5" /><span>Świetna lokata kapitału</span></li>
              <li className="flex items-center gap-3"><Check className="text-secondary w-5 h-5" /><span>Negocjacja ceny przy całości</span></li>
            </ul>
            <Button data-testid="button-zapytaj-30" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground relative z-10" onClick={() => document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' })}>
              Wybieram tę opcję
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Aerial Map Section */}
      <section className="bg-muted py-20 px-6 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-foreground">Lokalizacja działek</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Widok satelitarny – dwie działki (282/7 i 282/9) zaznaczone na czerwono. Każda po 30 arów, z możliwością podziału na 3 parcele po 10 arów z drogą dojazdową.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden shadow-2xl cursor-zoom-in"
            onClick={() => setLightboxIndex(0)}
          >
            <img
              src="/mapa-dzialki.png"
              alt="Mapa satelitarna działek Jany Zielona Góra"
              className="w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-red-500 bg-red-500/20 rounded-sm" />
                <span className="text-sm font-medium">Działka 282/7</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-red-500 bg-red-500/20 rounded-sm" />
                <span className="text-sm font-medium">Działka 282/9</span>
              </div>
              <span className="text-white/60 text-sm ml-auto">Kliknij, aby powiększyć</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visualization Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          >
            <motion.span variants={fadeIn} className="inline-block py-1 px-3 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-bold tracking-wider mb-4">
              WIZUALIZACJA
            </motion.span>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold font-serif mb-6 text-foreground">
              Jak może wyglądać Twoje nowe osiedle?
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-muted-foreground mb-8">
              Każda z działek po podziale na 3 parcele daje miejsce na 3 domy jednorodzinne z przestronnymi ogrodami. Łącznie obie działki to 6 działek po 10 arów – idealne dla rodziny lub grupy znajomych chcących zamieszkać po sąsiedzku.
            </motion.p>
            <motion.div variants={fadeIn} className="space-y-3">
              <div className="flex items-center gap-3"><Check className="text-secondary w-5 h-5 shrink-0" /><span>Droga dojazdowa wzdłuż działki po prawej stronie</span></div>
              <div className="flex items-center gap-3"><Check className="text-secondary w-5 h-5 shrink-0" /><span>6 działek łącznie – po 3 z każdej parceli 30a</span></div>
              <div className="flex items-center gap-3"><Check className="text-secondary w-5 h-5 shrink-0" /><span>Strefa zabudowy jednorodzinnej wg. planu ogólnego</span></div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="cursor-zoom-in"
            onClick={() => setLightboxIndex(1)}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/wizualizacja-osiedla.png"
                alt="Wizualizacja zabudowy na działkach"
                className="w-full object-cover"
              />
              <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                Wizualizacja poglądowa
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="galeria" className="bg-muted py-24 px-6 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6 text-foreground">Galeria</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Prawdziwe zdjęcia okolicy – działki, boisko Orlik, plac zabaw i pole golfowe w Przytoku.
            </p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 gap-3"
          >
            {galleryImages.map((img, idx) => (
              <motion.div
                key={idx}
                variants={fadeIn}
                className={`group relative rounded-xl overflow-hidden cursor-zoom-in shadow-sm hover:shadow-xl transition-all duration-300 ${idx === 0 || idx === 1 ? "col-span-2 md:col-span-1" : ""} ${idx === 2 ? "md:col-span-2" : ""}`}
                style={{ aspectRatio: idx === 2 ? "16/7" : "4/3" }}
                onClick={() => setLightboxIndex(idx)}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 p-4 text-white translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="font-bold text-sm">{img.title}</p>
                  <p className="text-white/70 text-xs mt-0.5">{img.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Surroundings Slideshow Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold font-serif mb-6 text-foreground">
              Sąsiedztwo, które pokochasz
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-muted-foreground mb-10">
              Dzielnica Jany to enklawa spokoju z bogatą infrastrukturą rekreacyjną. Lasy, łąki i aktywny wypoczynek – wszystko na wyciągnięcie ręki.
            </motion.p>
            <motion.div variants={staggerContainer} className="space-y-5">
              {[
                { icon: Dumbbell, title: "Boisko Orlik i siłownia plenerowa", sub: "100 m – piłka nożna, koszykówka, siatkówka, urządzenia fitness" },
                { icon: Baby, title: "Nowoczesny plac zabaw", sub: "Tuż w pobliżu, idealny dla dzieci w każdym wieku" },
                { icon: Flag, title: "Pole golfowe w Przytoku", sub: "Tylko 2 km – profesjonalne pole, atrakcja dla całej okolicy" },
                { icon: TentTree, title: "Winnica i altanka z ogniskiem", sub: "Urokliwe miejsca na rodzinne chwile" },
                { icon: Trees, title: "Lasy, łąki i grzyby", sub: "Bezpośrednio przy działce – przestrzeń do oddychania" },
                { icon: Grape, title: "Winnica", sub: "Lokalna winnica w niedalekiej okolicy" },
              ].map((item, idx) => (
                <motion.div key={idx} variants={fadeIn} className="flex gap-4 items-start">
                  <div className="bg-primary/10 w-11 h-11 rounded-full flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.sub}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Slideshow />
            <p className="text-center text-sm text-muted-foreground mt-3">Prawdziwe zdjęcia z okolicy działek</p>
          </motion.div>
        </div>
      </section>

      {/* Infrastructure Section */}
      <section className="bg-muted py-20 px-6 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-foreground">Media i infrastruktura</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Wszystko, czego potrzebujesz do rozpoczęcia budowy, jest na miejscu lub w bliskiej odległości.</p>
          </motion.div>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid sm:grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { icon: Droplets, color: "text-blue-500", title: "Woda", sub: "Dostępna bezpośrednio przy działce" },
              { icon: Zap, color: "text-secondary", title: "Prąd", sub: "Przyłącze przy granicy działki" },
              { icon: Flame, color: "text-orange-500", title: "Gaz", sub: "W odległości ok. 50 metrów" },
              { icon: Bus, color: "text-primary", title: "MZK – 400 m", sub: "Szybki dojazd do centrum miasta" },
            ].map((item, idx) => (
              <motion.div key={idx} variants={fadeIn} className="bg-background rounded-xl p-6 flex flex-col items-center text-center shadow-sm border border-border">
                <div className="bg-muted w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <item.icon className={`w-7 h-7 ${item.color}`} />
                </div>
                <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Nature Features */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="grid sm:grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: Trees, text: "Lasy i łąki w bezpośrednim sąsiedztwie" },
            { icon: Leaf, text: "Wiele grzybów w pobliskich lasach" },
            { icon: Grape, text: "Winnica w niedalekiej okolicy" },
            { icon: Home, text: "Cicha, spokojna okolica" },
          ].map((item, idx) => (
            <motion.div key={idx} variants={fadeIn} className="bg-card p-6 rounded-xl border border-card-border flex flex-col items-center text-center shadow-sm">
              <item.icon className="w-10 h-10 text-primary mb-4" />
              <p className="font-medium text-foreground">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="kontakt" className="bg-primary py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/10 rounded-full -ml-24 -mb-24 blur-2xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 bg-card rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-10 md:p-12 text-card-foreground flex flex-col justify-between">
              <div>
                <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wider mb-6">
                  KONTAKT
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6">Porozmawiajmy o Twojej działce</h2>
                <p className="text-muted-foreground mb-10">
                  Ogłoszenie prywatne. Chętnie odpowiem na wszystkie pytania i umówię się na pokazanie działek na żywo.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Zadzwoń bezpośrednio</p>
                      <a href="tel:+48530335264" data-testid="link-telefon" className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
                        530 335 264
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Lokalizacja</p>
                      <p className="font-medium text-foreground">Jany, Zielona Góra</p>
                      <p className="text-sm text-muted-foreground">Działki nr 282/7 i 282/9</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-muted p-10 md:p-12 border-l border-border">
              <h3 className="text-2xl font-bold font-serif mb-6 text-foreground">Napisz wiadomość</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-background py-8 border-t border-border text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} Działki Jany. Ogłoszenie prywatne.</p>
      </footer>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={galleryImages}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={() => setLightboxIndex((i) => ((i ?? 0) - 1 + galleryImages.length) % galleryImages.length)}
            onNext={() => setLightboxIndex((i) => ((i ?? 0) + 1) % galleryImages.length)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LandingPage />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
