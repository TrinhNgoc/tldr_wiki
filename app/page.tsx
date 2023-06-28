'use client'

import React, { useState, useEffect } from "react";
import wikiData from "./api/wiki/routes"

export default function Chat() {
  const [isLoadingTldr, setIsLoadingTldr] = useState(true);
  const {
    randomUrl,
    tldr,
    title,
    handleRefreshClick,
    isLoadingTldr: apiIsLoadingTldr,
  } = wikiData();

  useEffect(() => {
    setIsLoadingTldr(apiIsLoadingTldr);
  }, [apiIsLoadingTldr]);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">

      <h1
        className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl mb-10"
      >
        TLDR Wikipedia
      </h1>

      {randomUrl ? (
        <div className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
          <span
            className={`absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 ${
              isLoadingTldr ? "animate-gradient" : ""
            }`}
          ></span>
    
          <div className="sm:flex sm:justify-between sm:gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                <a href={randomUrl} target="_blank" rel="noopener noreferrer">{title}</a>
              </h3>
            </div>
          </div>
    
          <div className="mt-4">
            {isLoadingTldr ? (
              <p className="max-w-[40ch] text-sm text-gray-500">
                Loading TLDR...
              </p>
            ) : (
              <p className="max-w-[40ch] text-sm text-gray-500">
                {tldr}
              </p>
            )}
          </div>
    
          <dl className="mt-6 flex gap-4 sm:gap-6 justify-between">
            <div>
              <button
                  className="group relative inline-flex items-center overflow-hidden rounded bg-indigo-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500">
                    <a href={randomUrl || undefined} target="_blank" rel="noopener noreferrer">
                      <span className="text-sm font-medium">
                        Read More
                      </span>
                    </a>
              </button>
            </div>
    
            <div className="flex">
              <button
                className="group relative inline-flex items-center overflow-hidden rounded bg-indigo-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500"
                onClick={handleRefreshClick}
              >
                <span className="absolute -end-full transition-all group-hover:end-4">
                  <svg
                    className="h-5 w-5 rtl:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>

                <span className="text-sm font-medium transition-all group-hover:me-4">
                  Next
                </span>
              </button>
            </div>
          </dl>
        </div>
      ) : (
        <p>Loading random URL...</p>
      )}
    </div>
  );
}

