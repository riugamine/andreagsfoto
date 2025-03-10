import Image from "next/image";
export default function About() {
  return (
    <section className="min-h-screen py-8">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-wider">
            Fotógrafa Profesional | Retratos, Beauty Shots y Bodas
          </h2>
          <p className="text-gray-600 text-justify">
            Soy licenciada en Artes por la Universidad de Margarita (UNIMAR) y
            desde mi estudio, Estudio 777, ubicado en Pampatar, Isla de
            Margarita, me especializo en retratos (especialmente beauty shots) y
            fotografía de bodas. Mi pasión es capturar emociones auténticas y
            momentos que perduren en el tiempo. Con un enfoque creativo y
            atención al detalle, he tenido el privilegio de trabajar con modelos
            de marca y clientes particulares, creando imágenes que cuentan
            historias y reflejan la esencia de cada persona. Además, colaboro
            con maquilladoras y estilistas independientes para ofrecerte una
            experiencia completa, donde cada profesional aporta lo mejor de sí.
            Para mí, la fotografía es más que un trabajo: es una forma de arte
            que me permite conectar con las personas y capturar momentos únicos.
            Si buscas imágenes profesionales y llenas de vida, ¡estoy aquí para
            ayudarte!
          </p>
        </div>
        <div className="relative h-[400px] md:h-[600px]">
          <Image
            src="/images/about.jpg"
            alt="Andrea GS"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            
            className="object-cover rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}
