export function OriginSection() {
  return (
    <section className="py-[88px]">
      <div className="max-w-content mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <span className="inline-block font-display font-bold text-[0.8rem] tracking-[0.08em] uppercase text-[#8A6300] mb-3">
              Por qué nació Chamo Amiga
            </span>
            <h2 className="text-[clamp(1.6rem,3.4vw,2.4rem)] font-extrabold mb-5">
              Una respuesta nacida desde adentro
            </h2>
            <div className="space-y-4 text-texto-suave text-[1rem] leading-relaxed">
              <p>
                Cuando el terremoto del 24 de junio sacudió a Venezuela, miles de personas se encontraron sin saber a dónde acudir: sin psicólogo para el trauma, sin abogado para recuperar documentos, sin ingeniero que dijera si era seguro quedarse en casa.
              </p>
              <p>
                Chamo Amiga nació de la misma comunidad venezolana — la de adentro y la diáspora — para responder esa pregunta: <em className="not-italic font-semibold text-azul-dark">«¿A quién llamo?»</em>
              </p>
              <p>
                No somos una institución. Somos una red de personas que creen que la ayuda llega más rápido cuando está bien organizada.
              </p>
            </div>
          </div>

          {/* Visual card */}
          <div className="bg-azul-dark rounded-[var(--radius-lg)] p-8 text-white">
            <div className="space-y-5">
              {[
                { emoji: '🧠', text: 'Apoyo psicológico para quienes no podían dormir después del sismo.' },
                { emoji: '⚖️', text: 'Orientación legal para reponer documentos perdidos entre escombros.' },
                { emoji: '🏗️', text: 'Ingenieros que evaluaron si las casas seguían siendo habitables.' },
                { emoji: '🎁', text: 'Redes de donación organizadas cuando más se necesitaban.' },
              ].map((item) => (
                <div key={item.emoji} className="flex gap-4 items-start">
                  <span className="text-2xl flex-none mt-0.5" aria-hidden>{item.emoji}</span>
                  <p className="text-[#DCE6F3] text-[0.95rem] leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-7 pt-6 border-t border-white/10 text-[#9FB2CB] text-sm">
              Cada historia detrás de esta plataforma es real. Gracias a quienes se sumaron desde el primer día.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
