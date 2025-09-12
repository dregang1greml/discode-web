import { FaDiscord, FaGithub } from "react-icons/fa6";
export const Nav = () => {
  return (
    <>
      <nav className="flex justify-evenly  w-full h-[5em] items-center">
        <h3 className="text-3xl font-bold">DisCode</h3>
        <section className="space-x-3.5 flex justify-center items-center">
          <h3 className="text-3xl font-bold">Join Us!</h3>
          <b>&#124;</b>
          <a
            href={"https://discord.gg/6JabZZc5EF"}
            target="_blank"
            title="Discord Server"
          >
            <FaDiscord size={30} />
          </a>
          <a href={""} target="_blank" title="Github Repo">
            <FaGithub size={30} />
          </a>
        </section>
      </nav>
    </>
  );
};
