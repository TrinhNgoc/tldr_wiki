import { useState, useEffect } from 'react';
import axios from 'axios';

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export default function wikiData() {
  const [randomUrl, setRandomUrl] = useState<string | null>(null);
  const [tldr, setTldr] = useState<string>('');
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    // Return early if data has already been fetched
    if (dataFetched) return;

    const fetchRandomUrl = async () => {
      try {
        const response = await axios.get('https://en.wikipedia.org/w/api.php', {
          params: {
            action: 'query',
            generator: 'random',
            grnnamespace: 0,
            grnlimit: 1,
            prop: 'info',
            inprop: 'url',
            format: 'json',
            origin: '*'
          }
        });

        const pages = response.data.query.pages;
        const pageId = Object.keys(pages)[0];
        const randomPage = pages[pageId];
        const url = randomPage.fullurl;

        // Fetch the content of the random page
        const content = await fetchPageContent(randomPage.title);
        // Generate a TL;DR for the content
        // const summary = await generateTldr(content);


        // set state only once you have both url and content
        setRandomUrl(url);
        setTldr(content);
        
      } catch (error) {
        console.error(error);
      }
    };

    const fetchPageContent = async (title: string) => {
      try {
        const response = await axios.get('https://en.wikipedia.org/w/api.php', {
          params: {
            action: 'query',
            titles: title,
            prop: 'extracts',
            exintro: true,
            format: 'json',
            origin: '*'
          }
        });

        const pages = response.data.query.pages;
        const pageId = Object.keys(pages)[0];
        const content = pages[pageId].extract;

        // Remove HTML tags from the content
        const strippedContent = content.replace(/<(?:.|\n)*?>/gm, '');
        console.log(strippedContent, 'strippedContent');

        return strippedContent;
      } catch (error) {
        console.error(error);
      }
    };

    // const generateTldr = async (content: string) => {
    //   try {
    //     // Set the prompt to ask the AI to generate a TL;DR based on the content of the page
    //     const prompt = `Please write a short and funny 1 sentence TLDR about ${content}`;

    //     // Call the OpenAI API
    //     const response = await axios.post(
    //       'https://api.openai.com/v1/engines/davinci/completions',
    //       {
    //         prompt: prompt,
    //         max_tokens: 100, 
    //         temperature: 0.7 
    //       },
    //       {
    //         headers: {
    //           'Content-Type': 'application/json',
    //           'Authorization': `Bearer ${OPENAI_API_KEY}`
    //         }
    //       }
    //     );

    //     console.log(response, 'response')

    //     // The generated TL;DR will be in the 'choices' property of the response.
    //     const tldrResponse = response.data.choices[0].text.trim();
    //     return tldrResponse;
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };

    fetchRandomUrl();
    // Set dataFetched to true after the data has been fetched
    setDataFetched(true);
  }, [dataFetched]);  // Add dataFetched as a dependency

  return { randomUrl, tldr };
}
