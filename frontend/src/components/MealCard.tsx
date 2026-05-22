type MealCardProps = {
  title: string;
  meal: string;
  icon: string;
};

export default function MealCard({
  title,
  meal,
  icon,
}: MealCardProps) {

  return (

    <div
      className="
        bg-zinc-900/60
        border
        border-zinc-800
        rounded-[28px]
        p-5
        backdrop-blur-xl
        hover:border-green-500/40
        transition-all
      "
    >

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">

        <div
          className="
            w-12
            h-12
            rounded-2xl
            bg-green-500/10
            flex
            items-center
            justify-center
            text-2xl
          "
        >
          {icon}
        </div>

        <div>

          <h3
            className="
              text-xl
              font-semibold
            "
          >
            {title}
          </h3>

          <p className="text-zinc-500 text-sm">
            AI Personalized Meal
          </p>

        </div>
      </div>

      {/* MEAL CONTENT */}
      <div
        className="
          text-zinc-300
          leading-relaxed
        "
      >
        {meal}
      </div>

    </div>
  );
}