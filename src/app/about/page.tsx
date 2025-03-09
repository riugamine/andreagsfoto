import Image from 'next/image'

export default function About() {
  return (
    <section className="min-h-screen py-8">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-wider">
            Fotógrafa en la isla de Margarita
          </h2>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae dolores deserunt ea doloremque natus error, rerum quas odio quaerat nam ex commodi hic, suscipit in a veritatis pariatur minus consequuntur.
          </p>
        </div>
        <div className="relative h-[400px] md:h-[600px]">
          <Image
            src="/images/about.jpg"
            alt="Andrea GS"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>
    </section>
  )
}