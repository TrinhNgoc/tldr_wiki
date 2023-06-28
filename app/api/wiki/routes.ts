import { useState, useEffect } from 'react';
import axios from 'axios';
import { Configuration, OpenAIApi } from "openai";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
delete configuration.baseOptions.headers['User-Agent'];
const openai = new OpenAIApi(configuration);

export default function wikiData() {
  const [randomUrl, setRandomUrl] = useState<string | null>(null);
  const [tldr, setTldr] = useState<string>('');
  const [refreshCount, setRefreshCount] = useState(0);
  const [title, setTitle] = useState<string>('');
  const [isLoadingTldr, setIsLoadingTldr] = useState(false);

  useEffect(() => {
    const fetchRandomUrl = async () => {
      try {
        setIsLoadingTldr(true);
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
        const title = randomPage.title;

        const content = await fetchPageContent(title);
        const summary = await generateTldr(content);

        if (!content) {
          console.error('No content fetched');
          return;
        }

        if (!summary) {
          console.error('No summary generated');
          return;
        }
    
        // set state only once you have both url and content
        setRandomUrl(url);
        setTldr(summary);
        setTitle(title);
        setIsLoadingTldr(false);
    
      } catch (error) {
        setIsLoadingTldr(false);
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

        return strippedContent;
      } catch (error) {
        console.error(error);
      }
    };

    const generateTldr = async (content: string) => {
      try {
        // Set the prompt to ask the AI to generate a TLDR based on the content of the page
        const prompt = `Please write a funny 1 sentence TLDR about ${content}.`;

        // Call the OpenAI API
        const response = await openai.createCompletion(
          {
            model: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 500, 
            temperature: 0.7, 
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
          }
        );

      // The generated TL;DR will be in the 'choices' property of the response.
        const tldrResponse = response.data?.choices?.[0]?.text?.trim();
        return tldrResponse || '';
      } catch (error) {
        console.error(error);
      }
    };

    fetchRandomUrl();
  }, [refreshCount]);

  const handleRefreshClick = () => {
    setRefreshCount(prevCount => prevCount + 1);
  }

  return { randomUrl, tldr, title, handleRefreshClick, isLoadingTldr };
}
