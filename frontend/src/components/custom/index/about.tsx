import Image from "next/image";
import React from "react";

export const About = () => {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <section className="text-center">
        <h2 className="font-bold text-4xl mb-4">About</h2>
        <p className="text-lg leading-relaxed">
          <strong>DisCode</strong> is a web-based code editor built with Next.js
          (TypeScript) and FastAPI (Python). It allows you to write and run
          Discord bot scripts directly in your browser without installing any
          dependencies.
        </p>
      </section>

      <section className="mt-8 flex flex-col items-center">
        <Image
          src="/kino.png"
          alt="Kino profile picture"
          width={160}
          height={160}
          className="h-32 w-32 rounded-full object-cover"
        />
        <p className="mt-3 text-base italic">Developed by Kino</p>
      </section>

      <section className="mt-6 text-center">
        <p className="text-base">
          Interested in contributing?{" "}
          <a
            href="https://github.com/dregang1greml/discode-web"
            target="_blank"
            className="underline"
          >
            Get started here.
          </a>
        </p>
      </section>
    </main>
  );
};
