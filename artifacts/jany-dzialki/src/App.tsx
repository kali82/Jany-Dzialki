import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ContactForm } from "@/components/ContactForm";
import { motion } from "framer-motion";
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
  Dumbbell, 
  Grape, 
  TentTree,
  Leaf
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
    transition: {
      staggerChildren: 0.15
    }
  }
};

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-white">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/plot.png" 
            alt="Lush green building plot in Jany" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background"></div>
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
              <Button data-testid="link-kontakt" size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-8 py-6 text-lg w-full sm:w-auto backdrop-blur-sm" onClick={() => document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' })}>
                Skontaktuj się
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
            <div className="w-1 h-3 bg-secondary rounded-full"></div>
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
            Działki (282/7 i 282/9) w strefie zabudowy jednorodzinnej, idealne pod wymarzony dom. Pozostało tylko 5 działek do wyboru!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="bg-card border border-card-border rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold font-serif">10 arów</h3>
              <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">POPULARNE</span>
            </div>
            <p className="text-muted-foreground mb-6">Wydzielona działka o powierzchni ok. 1070 m², idealna pod dom jednorodzinny z ogrodem.</p>
            <div className="mb-8">
              <span className="text-4xl font-bold text-foreground">180 000 zł</span>
              <span className="text-muted-foreground block text-sm mt-1">180 zł/m²</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3"><Check className="text-secondary w-5 h-5" /> <span>Gotowa do podziału</span></li>
              <li className="flex items-center gap-3"><Check className="text-secondary w-5 h-5" /> <span>Dostęp do mediów</span></li>
              <li className="flex items-center gap-3"><Check className="text-secondary w-5 h-5" /> <span>Strefa zabudowy jednorodzinnej</span></li>
            </ul>
            <Button data-testid="button-zapytaj-10" className="w-full" variant="outline" onClick={() => document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' })}>Zapytaj o tę opcję</Button>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="bg-primary text-primary-foreground rounded-2xl p-8 shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary rounded-bl-full -mr-10 -mt-10 opacity-20"></div>
            <h3 className="text-2xl font-bold font-serif mb-4 relative z-10">30 arów (całość)</h3>
            <p className="text-primary-foreground/80 mb-6 relative z-10">Pełna działka o powierzchni 3210 m² dla poszukujących przestrzeni lub jako inwestycja.</p>
            <div className="mb-8 relative z-10">
              <span className="text-4xl font-bold text-white">570 000 zł</span>
              <span className="text-primary-foreground/80 block text-sm mt-1">180 zł/m² • Możliwość podziału na 3 działki</span>
            </div>
            <ul className="space-y-3 mb-8 relative z-10 text-primary-foreground/90">
              <li className="flex items-center gap-3"><Check className="text-secondary w-5 h-5" /> <span>Pełna powierzchnia 3210 m²</span></li>
              <li className="flex items-center gap-3"><Check className="text-secondary w-5 h-5" /> <span>Gwarancja braku bezpośrednich sąsiadów na całej działce</span></li>
              <li className="flex items-center gap-3"><Check className="text-secondary w-5 h-5" /> <span>Świetna lokata kapitału</span></li>
            </ul>
            <Button data-testid="button-zapytaj-30" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground relative z-10" onClick={() => document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' })}>Wybieram tę opcję</Button>
          </motion.div>
        </div>
      </section>

      {/* Features & Infrastructure */}
      <section className="bg-muted py-24 px-6 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold font-serif mb-6 text-foreground">
                Media i infrastruktura gotowe pod budowę
              </motion.h2>
              <motion.p variants={fadeIn} className="text-lg text-muted-foreground mb-10">
                Wszystko, czego potrzebujesz do rozpoczęcia budowy, znajduje się w zasięgu ręki. Oferujemy działki z przygotowaną infrastrukturą techniczną.
              </motion.p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <motion.div variants={fadeIn} className="flex gap-4">
                  <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-border">
                    <Droplets className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Woda</h4>
                    <p className="text-sm text-muted-foreground">Dostępna bezpośrednio przy działce.</p>
                  </div>
                </motion.div>
                <motion.div variants={fadeIn} className="flex gap-4">
                  <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-border">
                    <Zap className="text-secondary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Prąd</h4>
                    <p className="text-sm text-muted-foreground">Przyłącze energetyczne przy granicy.</p>
                  </div>
                </motion.div>
                <motion.div variants={fadeIn} className="flex gap-4">
                  <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-border">
                    <Flame className="text-orange-500 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Gaz</h4>
                    <p className="text-sm text-muted-foreground">W bliskiej odległości, ok. 50 metrów.</p>
                  </div>
                </motion.div>
                <motion.div variants={fadeIn} className="flex gap-4">
                  <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-border">
                    <Bus className="text-blue-500 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Komunikacja MZK</h4>
                    <p className="text-sm text-muted-foreground">Przystanek oddalony zaledwie o 400 m. Bardzo dobry dojazd do centrum.</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden shadow-xl aspect-square lg:aspect-auto lg:h-[600px]"
            >
              <img src="/pergola.png" alt="Altanka w okolicy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <TentTree className="w-8 h-8 mb-3 text-secondary" />
                <h3 className="text-2xl font-bold font-serif mb-2">Altanka z miejscem na grilla</h3>
                <p className="text-white/80">Jedno z urokliwych miejsc w bezpośredniej okolicy działek.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Surroundings & Amenities */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6 text-foreground">Sąsiedztwo, które pokochasz</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dzielnica Jany to enklawa spokoju. Lasy, łąki i bogata infrastruktura rekreacyjna tworzą idealne miejsce do życia.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all h-64 md:h-80"
          >
            <img src="/sports-field.png" alt="Boisko" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white w-full">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-bold mb-1">Kompleks sportowy</h3>
                  <p className="text-sm text-white/80">Tylko 100 m od działki: piłka nożna, koszykówka, siatkówka.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all h-64 md:h-80"
          >
            <img src="/outdoor-gym.png" alt="Siłownia plenerowa" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white w-full">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-bold mb-1">Siłownia plenerowa i plac zabaw</h3>
                  <p className="text-sm text-white/80">Nowoczesne miejsca do rekreacji dla małych i dużych.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
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
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/10 rounded-full -ml-24 -mb-24 blur-2xl pointer-events-none"></div>
        
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
                      <a href="tel:+48530335264" className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
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

      {/* Footer */}
      <footer className="bg-background py-8 border-t border-border text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} Działki Jany. Ogłoszenie prywatne.</p>
      </footer>
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
