import Link from "next/link";
import { FaDiscord, FaGithub } from "react-icons/fa6";
export const Nav = () => {
  return (
    <>
      <nav className="flex justify-evenly  w-full h-[5em] items-center">
        <h3 className="text-3xl font-bold">DisCode</h3>
        <section className="space-x-3.5 flex justify-center items-center">
          <Link href={"https://discord.gg/foenems"} title="Discord Server">
            <FaDiscord size={30} />
          </Link>
          <Link href={""} title="Github Repo">
            <FaGithub size={30} />
          </Link>
        </section>
      </nav>
    </>
  );
};
