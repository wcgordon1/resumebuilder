import Link from "next/link";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { AutoTypingResume } from "home/AutoTypingResume";

export const Hero = () => {
  return (
    <section className="lg:flex lg:h-[825px] lg:justify-center">
      <FlexboxSpacer maxWidth={75} minWidth={0} className="hidden lg:block" />
      <div className="mx-auto max-w-xl pt-8 text-center lg:mx-0 lg:grow lg:pt-32 lg:text-left">
        <h1 className="text-primary pb-2 text-3xl font-bold lg:text-6xl">
          Create a Professional
          <br />
          Resume in Seconds
        </h1>
        <p className="mt-3 text-lg lg:mt-5 lg:text-xl">
          Ditch your Indeed resume and increase your chances of getting hired with our ATS-friendly resume builder.
        </p>
        <Link href="/resume-import" className="btn-primary mt-8 lg:mt-14">
          Create Resume <span aria-hidden="true">→</span>
        </Link>
        {/* <p className="ml-6 mt-3 text-sm text-gray-600">No sign up required</p> */}
        <p className="mt-3 text-sm text-gray-600 mt-12 lg:mt-36">
          Already have a resume? Test its ATS readability with the{" "}
          <Link href="/resume-parser" className="underline underline-offset-2">
            resume parser
          </Link>
        </p>
      </div>
      <FlexboxSpacer maxWidth={100} minWidth={50} className="hidden lg:block" />
      <div className="mt-6 flex justify-center lg:mt-4 lg:block lg:grow">
        <AutoTypingResume />
      </div>
    </section>
  );
};
