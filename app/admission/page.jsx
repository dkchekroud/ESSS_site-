export default async function AdmissionPage() {
  const res = await fetch("http://localhost:3000/api/contenus?slug=admission", {
    cache: "no-store",
  });
  const data = await res.json();

  return (
    <section className="px-8 py-12 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-teal-700 mb-4">
        {data?.titre || "Admission et Inscription"}
      </h1>
      <p className="text-gray-700 leading-relaxed">
        {data?.texte || "Les conditions d’admission seront publiées prochainement."}
      </p>
      {data?.image && (
        <img
          src={data.image}
          alt="Admission"
          className="mt-6 w-full max-w-3xl rounded-lg shadow-lg"
        />
      )}
    </section>
  );
}
