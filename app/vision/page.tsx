import { Target, Eye, MapPin, Heart, ShieldCheck } from "lucide-react";

export default function Vision() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER SECTION */}
        <div className="text-center mb-20">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-red-600 mb-4">
            Our Purpose
          </h2>
          <h1 className="text-4xl md:text-6xl text-stone-900">
            Heritage, Taste & Discovery
          </h1>
          <div className="h-1 w-20 bg-red-600 mx-auto mt-8" />
        </div>

        {/* VISION & MISSION CARDS */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <div className="group p-10 bg-stone-50 rounded-[3rem] border border-stone-100 transition-all hover:bg-white hover:shadow-2xl hover:shadow-stone-200/50">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
              <Eye className="text-red-600" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-4">
              Our Vision
            </h3>
            <p className="text-stone-600 leading-relaxed">
              To discover heritage dishes, quality food spots, and regional
              hosts in every corner of the country. We aim to share the
              diversity in taste and style, preserving unique inherited
              traditions while exploring the world's most beautiful travel
              sites.
            </p>
          </div>

          <div className="group p-10 bg-stone-900 rounded-[3rem] text-white transition-all hover:-translate-y-2 shadow-xl shadow-stone-200">
            <div className="w-14 h-14 bg-stone-800 rounded-2xl flex items-center justify-center mb-6 group-hover:-rotate-6 transition-transform">
              <Target className="text-red-500" size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-stone-300 leading-relaxed">
              To promote cultural heritage food, famous chefs, and hidden travel
              gems. We empower home-based chefs and local food points to help
              develop a healthy, productive, and culturally connected society.
            </p>
          </div>
        </div>

        {/* THE "WHY RHF" SECTION */}
        <div className="relative rounded-[4rem] overflow-hidden bg-stone-50 border border-stone-100 p-8 md:p-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif italic text-stone-900 mb-6">
                Your Guide to the <br />
                <span className="text-red-600">Unexplored & Delicious</span>
              </h2>
              <p className="text-stone-600 text-lg leading-relaxed mb-8">
                Planning a visit to historical sites or northern highlands but
                don't know where to eat or stay? RHF is your digital compass for
                travel attractions, regional hosts, and authentic recipes.
              </p>

              <div className="space-y-4">
                {[
                  {
                    icon: <MapPin size={18} />,
                    text: "Curated Travel & Food Spots",
                  },
                  {
                    icon: <Heart size={18} />,
                    text: "Health-Conscious Dietary Tips",
                  },
                  {
                    icon: <ShieldCheck size={18} />,
                    text: "Trusted Regional Host Network",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 text-stone-800 font-bold text-sm uppercase tracking-wider"
                  >
                    <span className="text-red-600">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-inner border border-stone-200/50">
              <p className="text-stone-600 leading-loose text-justify font-medium">
                For the "foody traveler," RHF is a treasure trove of
                information. We provide an insight into regional hosts, making
                it easy to socialize and touch diverse cultures. Beyond travel,
                we address daily health concerns for the conscious explorer,
                allowing you to enjoy meals through our recipes by preparing
                delicious heritage items on your own.
                <br />
                <br />
                We aim to share the unique beauty of Pakistan without
                compromising the enjoyment of the journey—from highway food to
                high-altitude hospitality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
