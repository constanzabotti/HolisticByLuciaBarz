import React, { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

/* ── real photos ── */
import imgLuciaTedx from "@assets/1000080902_1778203288485.jpeg";
import imgSesion1   from "@assets/1000084325_1778203288485.jpeg";
import imgSesion2   from "@assets/1000084340_1778203288485.jpeg";
import imgSesion3   from "@assets/1000084328_1778203288485.jpeg";
import imgGrupo     from "@assets/35757ea1-cda7-4bd3-bb1b-d6fd4e7a50d9_1778203288485.jpeg";
import imgPersonal  from "@assets/507b2d83-4442-4ee3-b44e-7242f376f33e_1778203304673.jpeg";

/* ── contact ── */
const PHONE     = "+54 2664 327008";
const PHONE_RAW = "+542664327008";
const EMAIL     = "joyasenergeticasbarz@gmail.com";

/* ── palette ── */
const V = {
  deep:   "hsl(268,50%,28%)",
  mid:    "hsl(268,45%,38%)",
  light:  "hsl(268,38%,58%)",
  pale:   "hsl(268,22%,93%)",
  linen:  "hsl(272,20%,97%)",
  dark:   "hsl(268,50%,9%)",
  ink:    "hsl(268,45%,8%)",
  body:   "hsl(268,35%,18%)",
  muted:  "hsl(268,22%,30%)",
  border: "hsl(268,15%,78%)",
  gold:   "hsl(40,62%,42%)",
  goldlt: "hsl(40,72%,65%)",
};

/* ── backgrounds ── */
const BG = {
  hero:       "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
  hawaii:     "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
  stones:     "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80",
  lotus:      "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?w=1200&q=80",
  forest:     "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80",
  meditation: "https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?w=900&q=80",
};

/* ── motion ── */
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.95, ease: [0.25, 0.1, 0.25, 1] } },
};
const stagger: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.14 } },
};
const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.3 } },
};

/* ── form ── */
const formSchema = z.object({
  name:    z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email:   z.string().email("Correo electrónico inválido"),
  phone:   z.string().min(6, "Número de teléfono inválido"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

/* ════════════════════
   SHARED COMPONENTS
════════════════════ */

const Star = ({ size = 12, color = V.gold }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden>
    <path d="M6 0L7.12 4.88L12 6L7.12 7.12L6 12L4.88 7.12L0 6L4.88 4.88L6 0Z" fill={color} />
  </svg>
);

const Divider = () => (
  <div className="flex items-center justify-center gap-5 py-16">
    <div className="h-px w-20" style={{ background: V.border }} />
    <Star size={9} color={V.mid} />
    <div className="h-px w-20" style={{ background: V.border }} />
  </div>
);

const Label = ({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) => (
  <p className="font-sans font-light tracking-[0.34em] uppercase mb-5"
     style={{ fontSize: "10px", color: onDark ? V.goldlt : V.mid }}>
    {children}
  </p>
);

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg width="16" height="10" viewBox="0 0 16 10" fill="none" className={className} aria-hidden>
    <path d="M1 5H15M15 5L11 1M15 5L11 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GoldBtn = ({ children, onClick, type = "button", full = false }: {
  children: React.ReactNode; onClick?: () => void; type?: "button" | "submit"; full?: boolean;
}) => (
  <button type={type} onClick={onClick}
    className={`${full ? "w-full" : ""} group inline-flex items-center justify-center gap-3 px-10 py-4 font-sans font-light tracking-[0.28em] uppercase transition-all duration-400`}
    style={{ fontSize: "11px", background: V.gold, color: "#faf8f2" }}
    onMouseEnter={e => (e.currentTarget.style.background = "hsl(40,60%,33%)")}
    onMouseLeave={e => (e.currentTarget.style.background = V.gold)}>
    <span>{children}</span>
    <Arrow className="transition-transform duration-400 group-hover:translate-x-1" />
  </button>
);

const OutlineBtn = ({ children, onClick, gold = false }: {
  children: React.ReactNode; onClick?: () => void; gold?: boolean;
}) => {
  const bc = gold ? V.goldlt : V.light;
  const tc = gold ? V.goldlt : V.light;
  return (
    <button onClick={onClick}
      className="group inline-flex items-center gap-3 px-10 py-4 font-sans font-light tracking-[0.28em] uppercase border transition-all duration-400"
      style={{ fontSize: "11px", borderColor: bc, color: tc }}
      onMouseEnter={e => { e.currentTarget.style.background = gold ? V.gold : V.deep; e.currentTarget.style.color = "#faf8f2"; e.currentTarget.style.borderColor = gold ? V.gold : V.deep; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = tc; e.currentTarget.style.borderColor = bc; }}>
      {children}
      <Arrow className="transition-transform duration-400 group-hover:translate-x-1" />
    </button>
  );
};

/* ── shared scroll helper — works from any component ── */
function navScrollTo(id: string) {
  if (id === "inicio") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 68;
  window.scrollTo({ top: y, behavior: "smooth" });
}

/* ── nav links ── */
const NAV_LINKS = [
  { label: "Inicio",       id: "inicio" },
  { label: "El Sistema",   id: "el-sistema" },
  { label: "Sobre Lucía",  id: "sobre-lucia" },
  { label: "Sesiones",     id: "sesiones" },
  { label: "Contacto",     id: "contacto" },
];

/* ════════════════════
   NAV COMPONENT
════════════════════ */
function Nav() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => { setMobileOpen(false); navScrollTo(id); };

  const navBg    = scrolled ? "rgba(14,8,28,0.95)"  : "rgba(14,8,28,0.55)";
  const navBdr   = scrolled ? "1px solid hsl(268,30%,18%)" : "1px solid rgba(255,255,255,0.06)";
  const linkClr  = "rgba(255,255,255,0.88)";

  return (
    <header
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{ background: navBg, borderBottom: navBdr, backdropFilter: "blur(14px)" }}>

      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-[60px]">

        {/* Logo */}
        <button
          onClick={() => go("inicio")}
          className="font-serif font-light text-xl tracking-wide"
          style={{ color: "#fff" }}>
          Lucía Barz
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(l => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="font-sans font-light tracking-[0.22em] uppercase transition-opacity duration-200 hover:opacity-60"
              style={{ fontSize: "10px", color: linkClr }}>
              {l.label}
            </button>
          ))}
          <button
            onClick={() => go("contacto")}
            className="font-sans font-light tracking-[0.22em] uppercase px-5 py-2 border transition-all duration-200 hover:opacity-80"
            style={{ fontSize: "10px", borderColor: V.goldlt, color: V.goldlt }}>
            Reunión gratuita
          </button>
        </nav>

        {/* Hamburger — always visible on mobile */}
        <button
          type="button"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMobileOpen(o => !o)}
          style={{ display: "flex", flexDirection: "column", gap: "5px",
                   padding: "8px", cursor: "pointer", background: "none", border: "none" }}
          className="md:hidden">
          <span style={{
            display: "block", width: "22px", height: "1.5px", background: "#fff",
            transition: "transform 0.25s",
            transform: mobileOpen ? "rotate(45deg) translate(0px, 6.5px)" : "none",
          }} />
          <span style={{
            display: "block", width: "22px", height: "1.5px", background: "#fff",
            transition: "opacity 0.25s",
            opacity: mobileOpen ? 0 : 1,
          }} />
          <span style={{
            display: "block", width: "22px", height: "1.5px", background: "#fff",
            transition: "transform 0.25s",
            transform: mobileOpen ? "rotate(-45deg) translate(0px, -6.5px)" : "none",
          }} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{ background: "rgba(14,8,28,0.98)", borderTop: "1px solid hsl(268,28%,18%)" }}>
          <div style={{ display: "flex", flexDirection: "column", padding: "20px 24px", gap: "0" }}>
            {NAV_LINKS.map(l => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                style={{
                  textAlign: "left", background: "none", border: "none", cursor: "pointer",
                  fontFamily: "inherit", fontWeight: 300,
                  letterSpacing: "0.28em", textTransform: "uppercase",
                  fontSize: "11px", color: "rgba(255,255,255,0.85)",
                  padding: "14px 0",
                  borderBottom: "1px solid hsl(268,25%,16%)",
                }}>
                {l.label}
              </button>
            ))}
            <button
              onClick={() => go("contacto")}
              style={{
                marginTop: "20px", alignSelf: "flex-start", background: "none",
                cursor: "pointer", fontFamily: "inherit", fontWeight: 300,
                letterSpacing: "0.28em", textTransform: "uppercase",
                fontSize: "11px", color: V.goldlt,
                padding: "12px 24px", border: `1px solid ${V.goldlt}`,
              }}>
              Reunión gratuita
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

/* ── programme data ── */
const week1 = [
  { day: "Día 1–2", tema: "La Valía Personal",       desc: "El origen de la voz que dice que no eres suficiente. La rastreamos hasta su primera letra." },
  { day: "Día 3–4", tema: "Los Vínculos Familiares",  desc: "Los patrones que heredaste sin pedirlos y que gobiernan tu vida en silencio." },
  { day: "Día 5–6", tema: "El Amor y los Límites",    desc: "Por qué das lo que no tienes y recibes lo que no quieres. La arquitectura del apego." },
  { day: "Día 7",   tema: "La Prosperidad",            desc: "Tu relación con el dinero, el merecimiento y la abundancia como estado de ser." },
];
const week2 = [
  { day: "Día 8–9",   tema: "La Sombra",       desc: "Todo lo que rechazas de ti mismo se convierte en tu destino. Hoy lo iluminamos." },
  { day: "Día 10–11", tema: "El Propósito",     desc: "No es un trabajo ni un talento. Es una dirección del alma que has estado evitando." },
  { day: "Día 12–13", tema: "El Servicio",      desc: "Cuando te sanas, tu manera de estar en el mundo transforma lo que te rodea." },
  { day: "Día 14",    tema: "La Integración",   desc: "El cierre ritual. Lo amargo se vuelve medicina. Lo dulce, un nuevo punto de partida." },
];

/* ════════════════════
   PAGE
════════════════════ */
export default function Home() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  const scrollTo = navScrollTo;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const subject = encodeURIComponent(`Solicitud de reunión gratuita — ${values.name}`);
    const body = encodeURIComponent(
      `Nombre: ${values.name}\nTeléfono: ${values.phone}\nCorreo: ${values.email}\n\n${values.message}`
    );
    window.open(`mailto:${EMAIL}?subject=${subject}&body=${body}`, "_blank");
    setSubmitted(true);
    toast({ title: "Solicitud lista", description: "Se abrirá tu cliente de correo para enviar el mensaje a Lucía." });
    form.reset();
  };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: V.linen, color: V.ink }}>

      <Nav />

      {/* ══ BANNER ══ */}
      <div data-testid="banner-hawaii"
        className="w-full text-center py-3 px-4 font-sans font-light tracking-[0.28em] uppercase"
        style={{ fontSize: "10px", background: V.dark, color: V.goldlt }}>
        ✦ &nbsp; Mayo y Junio 2026 — Lucía Barz en Hawái &nbsp;·&nbsp; Sesiones presenciales · Cupos limitados &nbsp; ✦
      </div>

      {/* ══ HERO ══ */}
      <section id="inicio" className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={BG.hero} alt="Montañas zen en la niebla" className="w-full h-full object-cover object-center" />
          {/* Strong dark overlay so all text is clearly legible */}
          <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, hsl(268,55%,7%) 0%, hsl(268,50%,12%) 45%, hsl(268,55%,7%) 100%)`, opacity: 0.78 }} />
        </div>

        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 opacity-40">
          <div className="w-px h-12" style={{ background: V.goldlt }} />
        </div>

        <motion.div initial="hidden" animate="visible" variants={stagger}
          className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">

          <motion.div variants={fadeUp}><Label onDark>Una oportunidad singular · Hawái, Mayo y Junio 2026</Label></motion.div>

          <motion.h1 variants={fadeUp}
            className="font-serif font-light leading-[1.02] tracking-[-0.01em] mb-5"
            style={{ fontSize: "clamp(3.6rem,11vw,8rem)", color: "#f8f5ff" }}>
            Lucía Barz
          </motion.h1>

          {/* Subtitle — white so it's always readable */}
          <motion.p variants={fadeUp}
            className="font-sans font-light tracking-[0.28em] uppercase mb-12"
            style={{ fontSize: "11px", color: "rgba(255,255,255,0.82)" }}>
            Terapeuta Holística &nbsp;·&nbsp; Aromaterapeuta &nbsp;·&nbsp; Maestra en Curación Pránica
          </motion.p>

          <motion.p variants={fadeUp}
            className="font-serif italic font-light leading-relaxed mb-6 max-w-2xl"
            style={{ fontSize: "clamp(1.2rem,2.8vw,1.8rem)", color: "rgba(245,240,255,0.93)" }}>
            "Hay un hambre que no se sacia con logros, con amor humano ni con bienestar material. Es el hambre del alma que reclama su verdad."
          </motion.p>

          <motion.p variants={fadeUp}
            className="font-sans font-light text-sm md:text-base leading-relaxed max-w-xl mb-14"
            style={{ color: "rgba(230,220,255,0.82)" }}>
            Por primera vez en Hawái, Lucía abre un espacio de transformación profunda para quienes están listos para mirar sin miedo todo lo que los ha limitado.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 items-center">
            <GoldBtn onClick={() => scrollTo("contacto")} data-testid="button-hero-cta">
              Solicita tu reunión gratuita
            </GoldBtn>
            <OutlineBtn onClick={() => scrollTo("el-sistema")} gold>
              Conoce el sistema
            </OutlineBtn>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 opacity-30">
          <div className="w-px h-12" style={{ background: V.goldlt }} />
        </div>
      </section>

      <Divider />

      {/* ══ EL HAMBRE ══ */}
      <section className="py-24 px-6 max-w-3xl mx-auto text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
          <motion.div variants={fadeUp}><Label>¿Reconoces esto?</Label></motion.div>
          <motion.h2 variants={fadeUp}
            className="font-serif font-light leading-tight mb-10"
            style={{ fontSize: "clamp(2rem,5vw,3.2rem)", color: V.ink }}>
            Existe un tipo de vacío que lo material no puede llenar
          </motion.h2>
          <motion.div variants={fadeUp} className="space-y-6 font-serif font-light leading-relaxed"
            style={{ fontSize: "clamp(1.05rem,2vw,1.2rem)", color: V.body }}>
            <p>Has construido una vida. Quizás incluso una vida que otros admiran. Y sin embargo, hay algo —difícil de nombrar— que no cierra. Una inquietud antigua que regresa en los momentos de silencio.</p>
            <p>No es depresión. No es ingratitud. Es el espíritu exigiendo una conversación que llevas años postergando.</p>
            <p className="italic" style={{ color: V.deep, fontStyle: "italic" }}>Este trabajo es para ti.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* strip — stones */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
        className="w-full overflow-hidden" style={{ height: "300px" }}>
        <img src={BG.stones} alt="Piedras en equilibrio" className="w-full h-full object-cover object-center" />
      </motion.div>

      {/* ══ DARK QUOTE ══ */}
      <section className="py-20 px-6 relative overflow-hidden" style={{ background: V.dark }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          className="max-w-4xl mx-auto text-center">
          <p className="font-serif italic font-light leading-relaxed mb-8"
            style={{ fontSize: "clamp(1.3rem,3vw,2rem)", color: "rgba(245,240,255,0.95)" }}>
            "Este sistema no deja ningún lugar de la mente ni del espíritu sin analizar. Saca a la luz los traumas dormidos, los patrones heredados y las lealtades invisibles que gobiernan tu vida desde las sombras."
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 opacity-30" style={{ background: V.gold }} />
            <Star size={9} color={V.gold} />
            <p className="font-sans font-light tracking-[0.3em] uppercase" style={{ fontSize: "10px", color: V.goldlt }}>— Lucía Barz</p>
            <Star size={9} color={V.gold} />
            <div className="h-px w-16 opacity-30" style={{ background: V.gold }} />
          </div>
        </motion.div>
      </section>

      <Divider />

      {/* ══ EL SISTEMA ══ */}
      <section id="el-sistema" className="py-24 px-6 max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-20">
          <motion.div variants={fadeUp}><Label>La metodología</Label></motion.div>
          <motion.h2 variants={fadeUp}
            className="font-serif font-light leading-tight mb-8"
            style={{ fontSize: "clamp(2rem,5vw,3.2rem)", color: V.ink }}>
            El Sistema
          </motion.h2>
          <motion.p variants={fadeUp}
            className="font-sans font-light text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: V.muted }}>
            Un proceso intensivo de mínimo dos semanas. Clases y sesiones diarias que atraviesan, sin piedad y sin prisa, cada dimensión del ser.
          </motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="grid md:grid-cols-3 gap-14 text-center">
          {[
            { num: "I",   title: "La Mente",
              body: "Tus creencias no son tuyas. Son herencias recibidas sin consentimiento. Las identificamos, las estudiamos y decidimos —por primera vez con plena conciencia— qué conservar y qué soltar." },
            { num: "II",  title: "El Corazón",
              body: "El dolor emocional sin procesar no desaparece: se instala. Aprenderás a sentir lo dulce del reconocimiento, lo amargo de lo que se perdió y lo ácido de la verdad que libera." },
            { num: "III", title: "El Espíritu",
              body: "Más allá de la psicología, existe una arquitectura energética que sostiene tu realidad. La limpiamos, la restauramos y la alineamos con tu propósito esencial." },
          ].map(item => (
            <motion.div key={item.num} variants={fadeUp} className="flex flex-col items-center">
              <p className="font-serif font-light text-5xl mb-5 opacity-25" style={{ color: V.deep }}>{item.num}</p>
              <h3 className="font-serif font-semibold text-2xl mb-4" style={{ color: V.ink }}>{item.title}</h3>
              <p className="font-sans font-light text-sm md:text-base leading-relaxed" style={{ color: V.muted }}>{item.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* strip — meditation */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
        className="w-full relative overflow-hidden" style={{ height: "360px" }}>
        <img src={BG.meditation} alt="Meditación en naturaleza" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${V.dark}55 0%, transparent 50%, ${V.dark}55 100%)` }} />
      </motion.div>

      <Divider />

      {/* ══ LAS DOS SEMANAS ══ */}
      <section className="py-24 px-6" style={{ background: V.pale }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-20">
            <motion.div variants={fadeUp}><Label>El programa</Label></motion.div>
            <motion.h2 variants={fadeUp}
              className="font-serif font-light leading-tight mb-6"
              style={{ fontSize: "clamp(2rem,5vw,3.2rem)", color: V.ink }}>
              Catorce días. Nada queda sin revisar.
            </motion.h2>
            <motion.p variants={fadeUp}
              className="font-sans font-light text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
              style={{ color: V.muted }}>
              Cada tema tiene su momento. Cada emoción, su espacio. La disciplina de este viaje te entregará un tesoro de posibilidades que hoy no puedes imaginar.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-8">
            {[
              { label: "Primera Semana", items: week1, accent: V.light },
              { label: "Segunda Semana", items: week2, accent: V.deep },
            ].map(wk => (
              <motion.div key={wk.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1" style={{ background: V.border }} />
                  <p className="font-sans tracking-[0.3em] uppercase font-light" style={{ fontSize: "10px", color: V.mid }}>{wk.label}</p>
                  <div className="h-px flex-1" style={{ background: V.border }} />
                </div>
                <div className="space-y-3">
                  {wk.items.map(item => (
                    <motion.div key={item.day} variants={fadeUp}
                      className="p-6 border-l-2" style={{ background: V.linen, borderColor: wk.accent }}>
                      <p className="font-sans tracking-[0.25em] uppercase mb-2 font-light" style={{ fontSize: "9px", color: V.mid }}>{item.day}</p>
                      <h4 className="font-serif font-semibold text-xl mb-2" style={{ color: V.ink }}>{item.tema}</h4>
                      <p className="font-sans font-light text-sm leading-relaxed" style={{ color: V.muted }}>{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ══ SOBRE LUCÍA ══ */}
      <section id="sobre-lucia" className="py-24 px-6 max-w-6xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="grid md:grid-cols-2 gap-16 items-center">

          {/* Photo block */}
          <motion.div variants={fadeUp} className="relative">
            <div className="relative overflow-hidden" style={{ aspectRatio: "3/4", maxHeight: "580px" }}>
              <img src={imgLuciaTedx} alt="Lucía Barz en TEDx JuanaKoslay Women"
                className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: `linear-gradient(to top, ${V.dark}40 0%, transparent 55%)` }} />
            </div>
            <div className="absolute -bottom-5 -right-3 md:-right-7 w-40 h-40 md:w-48 md:h-48 overflow-hidden border-4"
              style={{ borderColor: V.linen }}>
              <img src={imgPersonal} alt="Lucía Barz" className="w-full h-full object-cover object-top" />
            </div>
            <div className="absolute top-4 left-4 px-3 py-1.5 font-sans font-light tracking-[0.22em] uppercase"
              style={{ fontSize: "9px", background: V.dark, color: V.goldlt }}>
              TEDx Speaker
            </div>
          </motion.div>

          {/* Bio text */}
          <motion.div variants={fadeUp} className="md:pl-4 pb-10 md:pb-0">
            <Label>Sobre Lucía</Label>
            <h2 className="font-serif font-light leading-tight mb-8"
              style={{ fontSize: "clamp(2rem,4.5vw,2.9rem)", color: V.ink }}>
              Una maestra que conoce el camino<br />
              <em style={{ color: V.deep }}>porque lo ha recorrido</em>
            </h2>
            <div className="space-y-5 font-sans font-light text-base leading-relaxed" style={{ color: V.body }}>
              <p>Lucía Barz es terapeuta holística, aromaterapeuta y Maestra en Curación Pránica con más de veinte años de práctica continua. Su trayectoria la ha llevado desde las comunidades de San Luis, Argentina, hasta conferencias internacionales y encuentros privados con figuras de alto perfil.</p>
              <p>Oradora en <strong style={{ color: V.ink, fontWeight: 600 }}>TEDx JuanaKoslay Women</strong>, ha sido convocada por personas en posiciones de poder —líderes políticos, artistas de renombre, ejecutivos— que buscan lo que ningún otro proceso pudo darles: una transformación que llega al origen.</p>
              <p>Su método combina psicología profunda, tradiciones energéticas orientales y más de dos décadas de observación del comportamiento humano. El resultado es un sistema que no deja ninguna capa del ser sin revisar.</p>
              <p>Madre, mentora, buscadora. Lucía no enseña lo que aprendió en un libro. Enseña lo que encontró en el camino hacia su propio despertar.</p>
            </div>
            <div className="mt-10 pt-8 border-t" style={{ borderColor: V.border }}>
              <p className="font-serif italic font-light text-lg leading-relaxed" style={{ color: V.deep }}>
                "El despertar no es un destino. Es aprender a sentir de una manera diferente para siempre."
              </p>
              <p className="font-sans font-light tracking-[0.25em] uppercase mt-3" style={{ fontSize: "10px", color: V.mid }}>
                — Lucía Barz
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <Divider />

      {/* ══ TESTIMONIOS ══ */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
          <motion.div variants={fadeUp}><Label>Quienes la buscan</Label></motion.div>
          <motion.h2 variants={fadeUp}
            className="font-serif font-light leading-tight"
            style={{ fontSize: "clamp(1.9rem,4.5vw,3rem)", color: V.ink }}>
            Su guía es requerida por quienes lo tienen todo<br />
            <em style={{ color: V.deep }}>y aún sienten que falta algo</em>
          </motion.h2>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="grid md:grid-cols-3 gap-6">
          {[
            { quote: "Fui a Lucía cuando ya no sabía qué más hacer. Tenía el cargo, el reconocimiento, la familia. Y una soledad inexplicable. En dos semanas, entendí de dónde venía todo.", attr: "Figura política de primer nivel, América Latina" },
            { quote: "Me habían enviado al mejor psicólogo, al mejor coach. Nada llegaba tan hondo. Lucía fue hasta donde nadie más se había atrevido a ir.", attr: "Artista de trayectoria internacional" },
            { quote: "Aprendes a sentir de otra manera. No solo los dolores se transforman: tu manera de recibir el bien también cambia. Es un despertar que no tiene reversa.", attr: "Ejecutiva del sector financiero" },
          ].map((t, i) => (
            <motion.div key={i} variants={fadeUp}
              className="flex flex-col justify-between p-8 border"
              style={{ borderColor: V.border, background: V.linen }}>
              <p className="font-serif italic font-light text-lg leading-relaxed mb-8" style={{ color: V.body }}>"{t.quote}"</p>
              <p className="font-sans font-light tracking-[0.25em] uppercase" style={{ fontSize: "9px", color: V.mid }}>— {t.attr}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ══ HAWÁI ══ */}
      <section className="relative overflow-hidden" style={{ minHeight: "560px" }}>
        <img src={BG.hawaii} alt="Playa de Hawái" className="absolute inset-0 w-full h-full object-cover object-center" />
        {/* Very dark overlay so all text is fully readable */}
        <div className="absolute inset-0" style={{ background: "rgba(14,8,28,0.88)" }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 py-28">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-col items-center">
            <motion.div variants={fadeUp}><Label onDark>Oportunidad única</Label></motion.div>
            <motion.h2 variants={fadeUp}
              className="font-serif font-light leading-[1.05] mb-6"
              style={{ fontSize: "clamp(2.8rem,8vw,5.5rem)", color: "#ffffff" }}>
              Presencia en Hawái
            </motion.h2>
            <motion.p variants={fadeUp}
              className="font-serif italic font-light leading-relaxed mb-10 max-w-2xl"
              style={{ fontSize: "clamp(1.1rem,2.5vw,1.5rem)", color: "rgba(255,255,255,0.92)" }}>
              "El entorno no es decorado. Es parte de la medicina."
            </motion.p>
            <motion.p variants={fadeUp}
              className="font-sans font-light text-base md:text-lg leading-relaxed max-w-2xl mb-14"
              style={{ color: "rgba(255,255,255,0.78)" }}>
              Durante <span style={{ color: V.goldlt }}>Mayo y Junio de 2026</span>, Lucía estará en Hawái disponible para encuentros presenciales. El archipiélago —tierra de volcanes, océano eterno y silencio sagrado— amplifica el trabajo interior de una manera que pocas geografías permiten.
            </motion.p>
            <motion.div variants={fadeUp}>
              <OutlineBtn onClick={() => scrollTo("contacto")} gold>Consultar disponibilidad</OutlineBtn>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ SESIONES PASADAS ══ */}
      <section id="sesiones" className="py-24 px-6" style={{ background: V.pale }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.div variants={fadeUp}><Label>El trabajo en acción</Label></motion.div>
            <motion.h2 variants={fadeUp}
              className="font-serif font-light leading-tight mb-6"
              style={{ fontSize: "clamp(2rem,5vw,3.2rem)", color: V.ink }}>
              Sesiones y encuentros pasados
            </motion.h2>
            <motion.p variants={fadeUp}
              className="font-sans font-light text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
              style={{ color: V.muted }}>
              Grupos, talleres y espacios de transformación que Lucía ha facilitado a lo largo de su trayectoria. Cada encuentro, único.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">

            {/* Large main photo */}
            <motion.div variants={fadeUp}
              className="col-span-2 row-span-2 relative overflow-hidden group cursor-pointer"
              style={{ minHeight: "360px" }}>
              <img src={imgSesion1} alt="Sesión grupal de Curación Pránica"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6"
                style={{ background: `linear-gradient(to top, ${V.dark}d5, transparent)` }}>
                <p className="font-serif italic font-light text-white text-lg">Sesión grupal · Curación Pránica</p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="relative overflow-hidden group cursor-pointer" style={{ minHeight: "175px" }}>
              <img src={imgSesion2} alt="Actividad grupal energética"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4"
                style={{ background: `linear-gradient(to top, ${V.dark}cc, transparent)` }}>
                <p className="font-sans font-light text-white text-xs tracking-wide">Actividad dinámica</p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="relative overflow-hidden group cursor-pointer" style={{ minHeight: "175px" }}>
              <img src={imgGrupo} alt="Foto grupal tras sesión"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4"
                style={{ background: `linear-gradient(to top, ${V.dark}cc, transparent)` }}>
                <p className="font-sans font-light text-white text-xs tracking-wide">Cierre de proceso grupal</p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="relative overflow-hidden group cursor-pointer" style={{ minHeight: "175px" }}>
              <img src={imgSesion3} alt="Círculo energético"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4"
                style={{ background: `linear-gradient(to top, ${V.dark}cc, transparent)` }}>
                <p className="font-sans font-light text-white text-xs tracking-wide">Círculo de integración</p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}
              className="col-span-2 relative overflow-hidden group cursor-pointer"
              style={{ minHeight: "210px" }}>
              <img src={imgLuciaTedx} alt="Lucía Barz en TEDx JuanaKoslay Women"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6"
                style={{ background: `linear-gradient(to top, ${V.dark}cc, transparent)` }}>
                <p className="font-serif italic font-light text-white text-base">TEDx JuanaKoslay Women · San Luis</p>
              </div>
              <div className="absolute top-4 left-4 px-3 py-1 font-sans font-light tracking-[0.22em] uppercase"
                style={{ fontSize: "9px", background: V.dark, color: V.goldlt }}>TEDx Speaker</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* lotus strip */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
        className="w-full overflow-hidden" style={{ height: "240px" }}>
        <img src={BG.lotus} alt="Flor de loto" className="w-full h-full object-cover object-bottom" />
      </motion.div>

      <Divider />

      {/* ══ LA INVERSIÓN ══ */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="grid md:grid-cols-2 gap-16 items-start">

          <motion.div variants={fadeUp}>
            <Label>Cómo funciona</Label>
            <h2 className="font-serif font-light leading-tight mb-10"
              style={{ fontSize: "clamp(1.9rem,4vw,2.8rem)", color: V.ink }}>
              Un despertar amable.<br />Una inversión real.
            </h2>
            <div className="space-y-8">
              {[
                { n: "01", t: "Reunión virtual gratuita",
                  d: "Un primer encuentro para conocernos. Sin compromiso. El proceso solo comienza si ambas partes sienten que hay resonancia." },
                { n: "02", t: "El proceso de dos semanas",
                  d: "Clases y sesiones diarias, en profundidad. Puede ser virtual o culminar presencialmente. El ritmo y el formato se acuerdan en la reunión inicial." },
                { n: "03", t: "La inversión logística",
                  d: "Los honorarios de Lucía y todos los gastos de traslado y hospedaje para los encuentros presenciales son responsabilidad del consultante." },
              ].map(step => (
                <div key={step.n} className="flex gap-6">
                  <p className="font-serif font-light text-3xl flex-shrink-0 leading-none" style={{ color: V.border }}>{step.n}</p>
                  <div>
                    <h4 className="font-serif font-semibold text-xl mb-2" style={{ color: V.ink }}>{step.t}</h4>
                    <p className="font-sans font-light text-sm leading-relaxed" style={{ color: V.muted }}>{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-6">
            <div className="p-8 border" style={{ background: V.pale, borderColor: V.border }}>
              <h3 className="font-serif font-semibold text-2xl mb-6" style={{ color: V.ink }}>Condiciones del proceso</h3>
              <ul className="space-y-5">
                {[
                  "El servicio es exclusivamente en español. No se ofrecen sesiones en ningún otro idioma.",
                  "Los cupos para Hawái en mayo y junio son limitados y se asignan por criterio de resonancia mutua.",
                  "La puntualidad y el compromiso diario son parte del trabajo, no opcionales.",
                  "La confidencialidad es absoluta. La privacidad de cada consultante es sagrada.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <Arrow className="flex-shrink-0 mt-[3px]" />
                    <p className="font-sans font-light text-sm leading-relaxed" style={{ color: V.muted }}>{item}</p>
                  </li>
                ))}
              </ul>
            </div>
            <p className="font-serif italic font-light text-base leading-relaxed pl-5"
               style={{ color: V.body, borderLeft: `2px solid ${V.light}` }}>
              "Lo que se transforma en este proceso no es tu circunstancia. Es tu forma de sentir para siempre."
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contacto" className="py-28 px-6 relative overflow-hidden" style={{ background: V.dark }}>
        <div className="absolute inset-0 z-0 opacity-[0.07]">
          <img src={BG.forest} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0" style={{ background: `${V.dark}e0` }} />

        <div className="max-w-2xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="text-center mb-14">
            <motion.div variants={fadeUp}><Label onDark>El primer paso</Label></motion.div>
            <motion.h2 variants={fadeUp}
              className="font-serif font-light leading-tight mb-4"
              style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: "rgba(250,246,255,0.97)" }}>
              Agenda tu reunión<br />
              <em style={{ color: V.goldlt }}>virtual y gratuita</em>
            </motion.h2>
            <motion.p variants={fadeUp}
              className="font-sans font-light text-sm md:text-base leading-relaxed"
              style={{ color: "rgba(220,210,245,0.78)" }}>
              No hay compromiso. Solo un encuentro para conocernos y evaluar si este proceso es lo que necesitas ahora.
            </motion.p>

            {/* Contact chips */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <a href={`tel:${PHONE_RAW}`}
                className="inline-flex items-center gap-3 px-5 py-3 border font-sans font-light tracking-wide transition-colors duration-300"
                style={{ fontSize: "13px", borderColor: "hsl(268,28%,32%)", color: "rgba(240,235,255,0.92)" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = V.goldlt)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "hsl(268,28%,32%)")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.01 2.22 2 2 0 012 .04h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
                </svg>
                {PHONE}
              </a>
              <a href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-3 px-5 py-3 border font-sans font-light tracking-wide transition-colors duration-300"
                style={{ fontSize: "13px", borderColor: "hsl(268,28%,32%)", color: "rgba(240,235,255,0.92)" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = V.goldlt)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "hsl(268,28%,32%)")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                {EMAIL}
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-4">
              <a href={`https://wa.me/${PHONE_RAW.replace("+", "")}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-sans font-light tracking-[0.22em] uppercase transition-opacity hover:opacity-60"
                style={{ fontSize: "10px", color: "hsl(140,52%,58%)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Escribir por WhatsApp
              </a>
            </motion.div>
          </motion.div>

          {submitted ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
              <Star size={18} color={V.gold} />
              <p className="font-serif italic font-light text-2xl mt-6 mb-3" style={{ color: "rgba(250,246,255,0.97)" }}>
                Gracias por tu confianza.
              </p>
              <p className="font-sans font-light text-sm" style={{ color: "rgba(220,210,245,0.72)" }}>
                Tu mensaje se ha preparado para enviarse a {EMAIL}.<br />Lucía se pondrá en contacto contigo personalmente.
              </p>
            </motion.div>
          ) : (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {(["name", "email"] as const).map((f, i) => (
                      <FormField key={f} control={form.control} name={f} render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans font-light tracking-[0.25em] uppercase block mb-2"
                            style={{ fontSize: "10px", color: "rgba(220,210,245,0.75)" }}>
                            {i === 0 ? "Nombre" : "Correo"}
                          </FormLabel>
                          <FormControl>
                            <Input className="rounded-none border-0 border-b bg-transparent focus-visible:ring-0 px-0 pb-3 font-sans font-light text-base"
                              style={{ borderColor: "hsl(268,28%,30%)", color: "rgba(250,246,255,0.95)" } as React.CSSProperties}
                              placeholder={i === 0 ? "Tu nombre completo" : "tu@email.com"} {...field} />
                          </FormControl>
                          <FormMessage style={{ color: V.goldlt, fontSize: "12px" }} />
                        </FormItem>
                      )} />
                    ))}
                  </div>

                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-sans font-light tracking-[0.25em] uppercase block mb-2"
                        style={{ fontSize: "10px", color: "rgba(220,210,245,0.75)" }}>Teléfono</FormLabel>
                      <FormControl>
                        <Input className="rounded-none border-0 border-b bg-transparent focus-visible:ring-0 px-0 pb-3 font-sans font-light text-base"
                          style={{ borderColor: "hsl(268,28%,30%)", color: "rgba(250,246,255,0.95)" } as React.CSSProperties}
                          placeholder="+1 234 567 8900" {...field} />
                      </FormControl>
                      <FormMessage style={{ color: V.goldlt, fontSize: "12px" }} />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-sans font-light tracking-[0.25em] uppercase block mb-2"
                        style={{ fontSize: "10px", color: "rgba(220,210,245,0.75)" }}>¿Qué te trae aquí?</FormLabel>
                      <FormControl>
                        <Textarea className="rounded-none border bg-transparent focus-visible:ring-0 p-4 font-sans font-light text-base resize-none"
                          style={{ borderColor: "hsl(268,28%,26%)", color: "rgba(250,246,255,0.95)" } as React.CSSProperties}
                          placeholder="Cuéntame brevemente lo que estás viviendo y qué te impulsa a buscar este proceso..."
                          rows={5} {...field} />
                      </FormControl>
                      <FormMessage style={{ color: V.goldlt, fontSize: "12px" }} />
                    </FormItem>
                  )} />

                  <div className="pt-2">
                    <GoldBtn type="submit" full data-testid="button-submit-contact">
                      Enviar solicitud
                    </GoldBtn>
                    <p className="font-sans font-light tracking-[0.2em] uppercase text-center mt-5"
                       style={{ fontSize: "9px", color: "rgba(200,185,235,0.55)" }}>
                      Servicio exclusivo en español &nbsp;·&nbsp; Respuesta personal de Lucía
                    </p>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="py-20 px-6 text-center border-t" style={{ background: V.linen, borderColor: V.border }}>
        <div className="flex flex-col items-center gap-5">
          <Star size={13} color={V.mid} />
          <h4 className="font-serif font-light text-4xl" style={{ color: V.ink }}>Lucía Barz</h4>
          <p className="font-sans font-light tracking-[0.32em] uppercase" style={{ fontSize: "10px", color: V.muted }}>
            Terapeuta Holística &nbsp;·&nbsp; Maestra en Curación Pránica
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <a href={`tel:${PHONE_RAW}`}
              className="font-sans font-light text-sm transition-opacity hover:opacity-60" style={{ color: V.muted }}>{PHONE}</a>
            <span className="hidden sm:block" style={{ color: V.border }}>·</span>
            <a href={`mailto:${EMAIL}`}
              className="font-sans font-light text-sm transition-opacity hover:opacity-60" style={{ color: V.muted }}>{EMAIL}</a>
          </div>
          <div className="h-px w-14" style={{ background: V.border }} />
          <p className="font-sans font-light" style={{ fontSize: "10px", color: "hsl(268,12%,56%)" }}>
            © {new Date().getFullYear()} Lucía Barz — Todos los derechos reservados
          </p>
        </div>
      </footer>

    </div>
  );
}
