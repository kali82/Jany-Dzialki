import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ContactForm } from "@/components/ContactForm";
import { motion, AnimatePresence, type Variants } from "framer-motion";
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

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const galleryImages = [
  {
    src: "/lokalizacja-ulica.png",
    title: "Widok z drogi – działki zaznaczone strzałkami",
    desc: "Widok z ulicy na działki 282/7 i 282/9 – strzałkami zaznaczono ich granice. Otwarta przestrzeń z doskonałym dojazdem.",
    width: 1534,
    height: 618,
  },
  {
    src: "/mapa-dzialki.png",
    title: "Widok lotniczy okolicy",
    desc: "Lotniczy widok dzielnicy Jany – strzałkami zaznaczono lokalizację obu działek pośród spokojnej zabudowy jednorodzinnej",
    width: 1288,
    height: 572,
  },
  {
    src: "/wizualizacja-osiedla.png",
    title: "Wizualizacja zabudowy",
    desc: "Przykład zagospodarowania: 3 domy na każdej działce, po 10 arów każdy",
    width: 1408,
    height: 768,
  },
  {
    src: "/boisko-silownia.png",
    title: "Kompleks sportowy i siłownia",
    desc: "Boisko Orlik z boiskami do piłki nożnej, koszykówki i siatkówki oraz siłownia plenerowa – zaledwie 100 m od działek",
    width: 1603,
    height: 621,
  },
  {
    src: "/plac-zabaw.png",
    title: "Nowoczesny plac zabaw",
    desc: "Duży, dobrze wyposażony plac zabaw w sąsiedztwie",
    width: 1231,
    height: 609,
  },
  {
    src: "/pole-golfowe.png",
    title: "Pole golfowe Przytok",
    desc: "Profesjonalne pole golfowe w Przytoku – zaledwie 2 km od działek",
    width: 1200,
    height: 628,
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
        aria-label="Zamknij galerię"
        className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
        onClick={onClose}
      >
        <X className="w-8 h-8" />
      </button>
      <button
        data-testid="button-lightbox-prev"
        aria-label="Poprzednie zdjęcie"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 bg-black/30 rounded-full p-2"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        data-testid="button-lightbox-next"
        aria-label="Następne zdjęcie"
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
            width={images[index].width}
            height={images[index].height}
            loading="eager"
            decoding="async"
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
    width: 1603,
    height: 621,
  },
  {
    src: "/plac-zabaw.png",
    label: "Nowoczesny plac zabaw",
    sub: "Tuż za rogiem",
    icon: Baby,
    width: 1231,
    height: 609,
  },
  {
    src: "/pole-golfowe.png",
    label: "Pole golfowe Przytok",
    sub: "Zaledwie 2 km",
    icon: Flag,
    width: 1200,
    height: 628,
  },
];

const faqItems = [
  {
    question: "Czy to są działki budowlane przy Zielonej Górze?",
    answer: "Tak. Działki 282/7 i 282/9 znajdują się w Janach przy Zielonej Górze, w spokojnej lokalizacji z dojazdem do miasta.",
  },
  {
    question: "Jakie działki są dostępne na sprzedaż?",
    answer: "Dostępne są działki po około 10 arów oraz działka 30 arów. Możliwy jest zakup mniejszej działki pod dom albo większego terenu jako inwestycji.",
  },
  {
    question: "Jakie media są przy działce?",
    answer: "Woda jest dostępna bezpośrednio przy działce, prąd przy granicy działki, a gaz w odległości około 50 metrów.",
  },
  {
    question: "Ile kosztuje działka budowlana w Janach?",
    answer: "Działka około 1070 m² kosztuje 180 000 zł, czyli 180 zł/m². Działka 30 arów kosztuje 520 000 zł.",
  },
  {
    question: "Czy lokalizacja nadaje się pod dom jednorodzinny?",
    answer: "Tak. Teren jest przeznaczony pod zabudowę jednorodzinną, a okolica ma lasy, łąki, plac zabaw, Orlik i pole golfowe w pobliżu.",
  },
  {
    question: "Jak umówić oglądanie działki?",
    answer: "Najprościej zadzwonić pod numer 530 335 264 albo wysłać wiadomość przez formularz kontaktowy na stronie.",
  },
  {
    question: "Czy można kupić działkę około 10 arów?",
    answer: "Tak. Działki 30 arów można kupić w całości albo jako mniejsze części po około 10 arów, zależnie od dostępności i uzgodnień z właścicielem.",
  },
  {
    question: "Czy działki mają dobry dojazd do Zielonej Góry?",
    answer: "Tak. Lokalizacja w Janach pozwala zachować spokojne otoczenie, a jednocześnie korzystać z dojazdu do Zielonej Góry i komunikacji MZK w pobliżu.",
  },
  {
    question: "Czy to sprzedaż bez pośredników?",
    answer: "Tak. To prywatna sprzedaż działek, dlatego pytania o cenę, dostępność i oględziny trafiają bezpośrednio do właściciela.",
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
          width={slideshowItems[current].width}
          height={slideshowItems[current].height}
          loading="lazy"
          decoding="async"
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
        aria-label="Poprzednie zdjęcie"
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        data-testid="button-slideshow-next"
        aria-label="Następne zdjęcie"
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
            aria-label={`Pokaż zdjęcie ${i + 1}`}
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
    <>
      <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-white">

      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <header className="absolute top-0 left-0 right-0 z-20 px-6 py-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <a href="/" className="inline-flex items-center gap-3 text-white drop-shadow-md" aria-label="Działki Jany - strona główna">
              <span className="w-10 h-10 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-sm">
                <Home className="w-5 h-5" />
              </span>
              <span className="font-bold text-lg md:text-xl">Działki Jany</span>
            </a>
            <button
              type="button"
              className="hidden sm:inline-flex text-sm font-bold text-white hover:text-secondary transition-colors"
              onClick={() => document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Kontakt z właścicielem
            </button>
          </div>
        </header>
        <div className="absolute inset-0 z-0">
          <img
            src="/plot.png"
            alt="Działki budowlane Jany Zielona Góra"
            width={1408}
            height={768}
            fetchPriority="high"
            decoding="async"
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
              Działki budowlane<br />
              <span className="text-secondary font-light italic">Jany, Zielona Góra</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-100 mb-10 max-w-2xl mx-auto font-light drop-shadow">
              Prywatna sprzedaż działek budowlanych 10-30 arów w Janach przy Zielonej Górze. Zbuduj dom w otoczeniu lasów i łąk.
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
          <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6 text-foreground">Działki Jany - oferta i cennik</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Działki budowlane w Janach przy Zielonej Górze (282/7 i 282/9) w strefie zabudowy jednorodzinnej. Możliwość zakupu całości lub podziału na mniejsze części. Pozostało <strong>5 działek</strong> do wyboru!
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
              <span className="text-4xl font-bold text-white">520 000 zł</span>
              <span className="text-primary-foreground/80 block text-sm mt-1">ok. 162 zł/m² • 20 000 zł taniej niż 3 działki po 10 arów</span>
            </div>
            <ul className="space-y-3 mb-8 relative z-10 text-primary-foreground/90">
              <li className="flex items-center gap-3"><Check className="text-secondary w-5 h-5" /><span>Pełna powierzchnia 3210 m²</span></li>
              <li className="flex items-center gap-3"><Check className="text-secondary w-5 h-5" /><span>Możliwość budowy do 3 domów</span></li>
              <li className="flex items-center gap-3"><Check className="text-secondary w-5 h-5" /><span>Świetna lokata kapitału</span></li>
              <li className="flex items-center gap-3"><Check className="text-secondary w-5 h-5" /><span>Niższa cena przy zakupie całości</span></li>
            </ul>
            <Button data-testid="button-zapytaj-30" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground relative z-10" onClick={() => document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' })}>
              Wybieram tę opcję
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Local Search Section */}
      <section id="dzialki-zielona-gora" className="py-20 px-6 border-y border-border bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-start"
          >
            <div>
              <motion.span variants={fadeIn} className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wider mb-4">
                DZIAŁKI ZIELONA GÓRA
              </motion.span>
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold font-serif mb-6 text-foreground">
                Działka budowlana Zielona Góra - Jany
              </motion.h2>
              <motion.p variants={fadeIn} className="text-lg text-muted-foreground mb-5">
                Jeśli szukasz działki budowlanej w Zielonej Górze lub terenu pod dom blisko miasta, Jany dają spokojniejsze otoczenie bez rezygnowania z dojazdu i infrastruktury.
              </motion.p>
              <motion.p variants={fadeIn} className="text-lg text-muted-foreground">
                Oferta obejmuje działki 282/7 i 282/9: mniejsze części po około 10 arów albo pełne 30 arów pod dom jednorodzinny, ogród lub zakup inwestycyjny. To prywatna sprzedaż, więc kontakt trafia bezpośrednio do właściciela.
              </motion.p>
            </div>

            <motion.div variants={staggerContainer} className="grid sm:grid-cols-2 gap-3">
              {[
                { label: "Lokalizacja", value: "Jany przy Zielonej Górze" },
                { label: "Powierzchnia", value: "10-30 arów" },
                { label: "Cena od", value: "180 000 zł" },
                { label: "Numery działek", value: "282/7 i 282/9" },
              ].map((item) => (
                <motion.div key={item.label} variants={fadeIn} className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-2">{item.label}</p>
                  <p className="text-lg font-bold text-foreground">{item.value}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Search Intent Section */}
      <section className="py-20 px-6 bg-muted border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-foreground">
              Działki budowlane pod dom i inwestycję
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Oferta jest przygotowana dla osób, które szukają działki pod budowę domu w okolicy Zielonej Góry, ale chcą mieć więcej zieleni, ciszy i przestrzeni niż przy typowej miejskiej zabudowie.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              {
                title: "Działka z mediami",
                text: "Woda przy działce, prąd przy granicy i gaz około 50 m od terenu ułatwiają planowanie budowy.",
              },
              {
                title: "Około 10 arów",
                text: "Mniejsza parcela pasuje pod dom jednorodzinny z ogrodem i rozsądnym budżetem zakupu.",
              },
              {
                title: "30 arów inwestycyjnie",
                text: "Pełna działka 3210 m² daje więcej przestrzeni i możliwość zaplanowania kilku domów.",
              },
              {
                title: "Sprzedaż prywatna",
                text: "Kontaktujesz się bezpośrednio z właścicielem, bez przebijania się przez ogłoszenia portali.",
              },
            ].map((item) => (
              <motion.article key={item.title} variants={fadeIn} className="bg-background rounded-xl p-6 border border-border shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.text}</p>
              </motion.article>
            ))}
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
              Działki 282/7 i 282/9 – zaznaczone strzałkami na zdjęciach. Każda po 30 arów, z możliwością podziału na 3 części po 10 arów z drogą dojazdową.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden shadow-2xl cursor-zoom-in group"
              onClick={() => setLightboxIndex(0)}
            >
              <img
                src="/lokalizacja-ulica.png"
                alt="Widok z drogi na działki Jany"
                width={1534}
                height={618}
                loading="lazy"
                decoding="async"
                className="w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="font-bold text-base mb-0.5">Widok z drogi dojazdowej</p>
                <p className="text-white/70 text-sm">Strzałki wskazują lokalizację działek</p>
                <p className="text-white/40 text-xs mt-1">Kliknij, aby powiększyć</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden shadow-2xl cursor-zoom-in group"
              onClick={() => setLightboxIndex(1)}
            >
              <img
                src="/mapa-dzialki.png"
                alt="Widok lotniczy działek Jany Zielona Góra"
                width={1288}
                height={572}
                loading="lazy"
                decoding="async"
                className="w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="font-bold text-base mb-0.5">Widok lotniczy okolicy</p>
                <p className="text-white/70 text-sm">Strzałki wskazują lokalizację obu działek</p>
                <p className="text-white/40 text-xs mt-1">Kliknij, aby powiększyć</p>
              </div>
            </motion.div>
          </div>
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
              Każda z działek po podziale na 3 części daje miejsce na 3 domy jednorodzinne z przestronnymi ogrodami. Łącznie obie działki to 6 działek po 10 arów – idealne dla rodziny lub grupy znajomych chcących zamieszkać po sąsiedzku.
            </motion.p>
            <motion.div variants={fadeIn} className="space-y-3">
              <div className="flex items-center gap-3"><Check className="text-secondary w-5 h-5 shrink-0" /><span>Droga dojazdowa wzdłuż działki po prawej stronie</span></div>
              <div className="flex items-center gap-3"><Check className="text-secondary w-5 h-5 shrink-0" /><span>6 działek łącznie – po 3 z każdej działki 30a</span></div>
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
                width={1408}
                height={768}
                loading="lazy"
                decoding="async"
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
                  width={img.width}
                  height={img.height}
                  loading="lazy"
                  decoding="async"
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

      {/* FAQ Section */}
      <section id="faq" className="bg-muted py-20 px-6 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-foreground">Najczęstsze pytania o działki</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Konkretne informacje dla osób szukających działki budowlanej w Zielonej Górze i spokojnego terenu pod dom w Janach.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-4"
          >
            {faqItems.map((item) => (
              <motion.article key={item.question} variants={fadeIn} className="bg-background rounded-xl p-6 border border-border shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-3">{item.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
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

      </main>

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
    </>
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
