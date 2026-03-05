import { Map, Utensils, Compass, Truck } from "lucide-react";

export default function History() {
  return (
    <section className="bg-white py-24 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* HERO SECTION */}
        <div className="relative mb-24 text-center">
          <span className="text-red-600 font-black uppercase tracking-[0.4em] text-xs">
            The Origin Story
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-stone-900 mt-4 mb-8">
            How RHF <span className="text-stone-300">Started</span>
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed italic">
            "Traveling expands a person’s vision, and sharing a good meal
            connects us all."
          </p>
          {/* Decorative background element */}
          <div className="absolute -top-10 -left-20 text-[150px] font-black text-stone-50 -z-10 select-none">
            HISTORY
          </div>
        </div>

        {/* THE PROBLEM CHAPTER */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <div className="order-2 md:order-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-red-600" />
              <span className="text-sm font-bold uppercase tracking-widest text-stone-400">
                The Dilemma
              </span>
            </div>
            <h2 className="text-3xl font-bold text-stone-900 mb-6">
              The Search for Authenticity
            </h2>
            <div className="space-y-4 text-stone-600 leading-loose">
              <p>
                It becomes difficult for travelers and locals alike to find the
                true major attractions and heritage food of a new destination.
                The issue is most pinching in metropolitan cities.
              </p>
              <p>
                Amongst a sea of fast-food points, traditional heritage food is
                often hidden. Even food streets can be overwhelming with zero
                familiarity of where the actual quality lies.
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2 bg-stone-50 rounded-[3rem] p-12 relative">
            <div className="absolute top-0 right-0 p-8 text-stone-200">
              <Compass size={120} strokeWidth={1} />
            </div>
            <blockquote className="relative z-10 text-2xl   italic text-stone-800">
              "Finding a good meal shouldn't be a matter of luck; it should be a
              matter of heritage."
            </blockquote>
          </div>
        </div>

        {/* THE FOUNDER CHAPTER */}
        <div className="bg-stone-900 rounded-[4rem] p-8 md:p-20 text-white mb-32 relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center">
                <Utensils size={24} />
              </div>
              <h2 className="text-3xl md:text-4xl   italic">
                Enter Irfan Chaudhary
              </h2>
            </div>
            <div className="space-y-6 text-stone-300 text-lg leading-relaxed">
              <p>
                Mr. Chaudhary, a passionate traveler and heritage food
                enthusiast, founded RHF based on his personal experiences. He
                believed that traveling to famous heritage spots allowed him to
                explore diverse cultures and hidden traditions.
              </p>
              <p>
                He realized that diversity in cultures introduced him to the
                hidden beauty of Pakistan. His urge to make people familiar with
                authentic information led to the development of this platform.
              </p>
            </div>
          </div>
          {/* Subtle Accent */}
          <div className="absolute bottom-12 right-12 opacity-10">
            <Map size={200} />
          </div>
        </div>

        {/* THE SPECIALTIES CHAPTER */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-4xl   italic text-stone-900 mb-8">
              Expanding the <span className="text-red-600">Vision</span>
            </h2>
            <div className="columns-1 md:columns-2 gap-8 space-y-8 text-stone-600 leading-relaxed">
              <p>
                One unique focus was{" "}
                <span className="font-bold text-stone-900">
                  ‘Highway Food.’
                </span>{" "}
                Satisfying the taste buds of a foodie traveler on long routes
                where population is sparse and authentic info is needed most.
              </p>
              <p>
                RHF has now expanded into a total information hub. From regional
                traveling places to daily health concerns and professional chef
                recipes, we bring everything to your table.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-red-50 rounded-3xl border border-red-100 flex items-start gap-4">
              <Truck className="text-red-600 shrink-0" />
              <div>
                <h4 className="font-bold text-stone-900">Highway Guide</h4>
                <p className="text-xs text-stone-600 mt-1">
                  Never miss a delicious stop on long routes.
                </p>
              </div>
            </div>
            <div className="p-6 bg-stone-50 rounded-3xl border border-stone-100 flex items-start gap-4">
              <Map className="text-stone-900 shrink-0" />
              <div>
                <h4 className="font-bold text-stone-900">Culture & Travel</h4>
                <p className="text-xs text-stone-600 mt-1">
                  Exploring the hidden beauty of Pakistan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
