import * as dotenv from 'dotenv';
dotenv.config();

interface Config {
    TOKEN: string;
    CLIENT_ID: string;
    SECRET: string;
  }
  
  function getTokens(): Config {
    const { TOKEN, CLIENT_ID, SECRET } = process.env;
  
    if (!TOKEN || !CLIENT_ID || !SECRET) { throw new Error('Required environment variables are missing. (.env)'); }
  
    return { TOKEN, CLIENT_ID, SECRET } as Config;
  }
  
export default getTokens;