import { useState } from "preact/hooks";
import type { TeamsProps } from "@/types";

const Teams = ({
  teams,
  translations,
  lang,
}: Readonly<TeamsProps>) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const getNextMember = () => {
    setCurrentIndex((prev) => (prev + 1) % teams.length);
  };

  const getPrevMember = () => {
    setCurrentIndex((prev) => (prev - 1 < 0 ? teams.length - 1 : prev - 1));
  };

  const currentMember = teams[currentIndex];

  return (
    <section className="bg-white dark:bg-non-photo-blue-600 dark:text-black py-20 md:py-20 xl:py-30 px-4 xl:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="uppercase text-4xl md:text-5xl xl:text-7xl font-bold text-federal-blue-600">
          {translations.title}
        </h2>

        <p className="text-xl font-medium text-honolulu-blue-500">
          {translations.subtitle}
        </p>

        <main className="relative z-20 w-full mt-8 md:flex md:items-center xl:mt-12">
          <div className="absolute w-full bg-federal-blue-700 -z-10 md:h-96 rounded-2xl"></div>

          <div className="w-full p-6 bg-federal-blue-700 md:flex md:items-center rounded-2xl md:bg-transparent md:p-0 lg:px-12 md:justify-evenly">
            <img
              className="h-24 w-24 md:mx-6 rounded-full object-cover shadow-md md:h-[32rem] md:w-70 lg:h-[36rem] lg:w-[20rem] md:rounded-2xl transition-all duration-300"
              src={`/assets/img/teams/${currentMember.img}`}
              alt={`${currentMember.name} - ${currentMember.position[lang]}`}
            />

            <div className="mt-2 md:mx-6">
              <div>
                <p className="text-xl font-medium tracking-tight text-white">
                  {currentMember.name}
                </p>
                <p className="text-blue-200">{currentMember.position[lang]}</p>
              </div>

              <p className="mt-4 text-lg leading-relaxed text-white md:text-xl">
                "{currentMember.bio[lang]}"
              </p>

              <div className="flex items-center justify-between mt-6 md:justify-start">
                <button
                  name="prevTeamMember"
                  title="Previous member"
                  className="p-2 text-white transition-colors duration-300 border rounded-full rtl:-scale-x-100 hover:bg-blue-400"
                  onClick={getPrevMember}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  title="Next member"
                  className="p-2 text-white transition-colors duration-300 border rounded-full rtl:-scale-x-100 md:mx-6 hover:bg-blue-400"
                  onClick={getNextMember}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Teams;
