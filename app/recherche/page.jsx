export default async function RecherchePage() {
  const res = await fetch("http://localhost:3000/api/contenus?slug=recherche", {
    cache: "no-store",
  });
  const data = await res.json();

  return (
    <section className="px-8 py-12 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-teal-700 mb-4">
        {data?.titre || "Activités de Recherche"}
      </h1>
      <p className="text-gray-700 leading-relaxed">
        {data?.texte || "Informations sur la recherche à venir..."}
      </p>
      {data?.image && (
        <img
          src={data.image}
          alt="Recherche"
          className="mt-6 w-full max-w-3xl rounded-lg shadow-lg"
        />
      )}
    </section>
  );
}
