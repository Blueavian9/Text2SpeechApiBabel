import dotenv from 'dotenv';
import cors from 'cors';
import { Polly } from "@aws-sdk/client-polly";
import { getSynthesizeSpeechUrl } from "@aws-sdk/polly-request-presigner";
import path from 'path';
import express from 'express';

dotenv.config();
const app = express();
const port = process.env.PORT || 3333;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const client = new Polly({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

/**
* Generate a speech URL using AWS Polly
* @param {string} voice - The voice ID to use for speech synthesis
* @param {string} text - The text to convert to speech
* @returns {Promise<string>} The URL of the synthesized speech
* @throws {Error} If speech URL generation fails
*/
const speakText = async (voice, text) => {
  const speechParams = {
    OutputFormat: "mp3",
    Text: "Hello From Polly",
    TextType: "text",
    VoiceId: "Matthew",
  };

    try {
      let params = { ...speechParams, Text: text, VoiceId: voice };
      let url = await getSynthesizeSpeechUrl({
        client,
        params,
      });
      return url;
    } catch (err) {
      throw new Error("Failed to generate speech URL");
    }
  };

  app.post('/api/synthesize', async (req, res) => {
    const { voice, text } = req.body;
    try {
      const url = await speakText(voice, text);
      console.log(url);
      res.json({ "audioUrl": url });
    } catch (err) {
      res.status(500).send("An error occurred while generating the speech URL.");
    }
  });
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });