"use client";

import { FormEvent, useState } from "react";

import { validateUrl } from "@/lib/humblebundle";

export default function Home() {
  const [errorMessage, setErrorMessage] = useState("");
  const [inputValue, setInputValue] = useState("");

  const onSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!validateUrl(inputValue)) {
      setErrorMessage("Provide a valid HumbleBundle link");
      return;
    }

    const url = new URL(inputValue);
    const bundle = url.pathname.split("/").at(-1);

    window.history.pushState(null, "", `/${bundle}`);
    window.location.reload();
  };

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="bundleUrl" className="text-xl block mb-2">
        Paste HumbleBundle link
      </label>
      <div className="flex flex-row gap-x-2">
        <input
          type="text"
          name="bundleUrl"
          id="bundleUrl"
          placeholder="https://www.humblebundle.com/books/example-bundle"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={`text-black w-full border-2 px-4 py-2 rounded-md border-cyan-300 ${errorMessage && "border-red-500"}`}
        />
        <button type="submit" className="rounded-md bg-blue-600 px-4 py-2">
          Submit
        </button>
      </div>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </form>
  );
}
