export default function ServiceCard({ service }) {
  const Icon = service.icon;

  return (
    <div className="group h-[280px] w-full [perspective:1200px]">
      <div
        className="
          relative h-full w-full
          transition-transform duration-700
          [transform-style:preserve-3d]
          group-hover:[transform:rotateY(180deg)]
        "
      >
        {/* FRONT */}
        <article
          className="
            absolute inset-0
            glass rounded-2xl p-6
            border border-slate-200
            shadow-lg
            [backface-visibility:hidden]
            dark:border-slate-800
          "
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-4xl font-black text-slate-200 dark:text-slate-800">
              0{service.id || ''}
            </span>

            {Icon && (
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-100">
                <Icon size={28} />
              </div>
            )}
          </div>

          <h3 className="text-xl font-bold text-slate-950 dark:text-white">
            {service.title}
          </h3>

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Hover to explore →
          </p>

          <div className="absolute bottom-6">
            <p className="font-bold text-coral">
              {service.price}
            </p>
          </div>
        </article>

        {/* BACK */}
        <article
          className="
            absolute inset-0
            rounded-2xl
            bg-slate-950
            p-6
            text-white
            shadow-2xl
            [transform:rotateY(180deg)]
            [backface-visibility:hidden]
          "
        >
          <div className="flex h-full flex-col">
            <h3 className="text-xl font-bold">
              {service.title}
            </h3>

            <p className="mt-4 flex-1 text-sm leading-7 text-slate-300">
              {service.description}
            </p>

            <div className="border-t border-slate-800 pt-4">
              <p className="font-bold text-brand-300">
                {service.price}
              </p>

              <button className="mt-4 w-full rounded-lg bg-brand-600 px-4 py-3 font-semibold text-white transition hover:bg-brand-700">
                Learn More
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}