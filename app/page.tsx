'use client'

// import { useChat } from 'ai/react'
import React, { useState, useEffect } from "react";
import wikiData from "./api/wiki/routes"

export default function Chat() {
  const { randomUrl, tldr } = wikiData();

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">

      {randomUrl ? (
        <div>
          <p>Random Wikipedia URL: <a href={randomUrl} target="_blank" rel="noopener noreferrer">{randomUrl}</a></p>
          {tldr ? (
            <div>
              <p>TL;DR:</p>
              <p>{tldr}</p>
            </div>
          ) : (
            <p>Loading TL;DR...</p>
          )}
        </div>
      ) : (
        <p>Loading random URL...</p>
      )}
    </div>
  )
}
