import dotenv from 'dotenv';
import Cron from 'cron';
import { TwitterApi } from 'twitter-api-v2';

dotenv.config({ path: './config.env' });

const client = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY,
  appSecret: process.env.TWITTER_CONSUMER_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  // bearer_token: process.env.TWITTER_BEARER_TOKEN
});


console.log('Starting the bot...');
console.log('running a task every day at 8:30 and 16:30');
console.log(`Chilean time: ${new Date().toLocaleString('es-CL')}`);

// envia un twit a las 8:30 y a las 16:30 hrs todos los dias de habiles de la semana en la hora de Chile
const sendTweet = async () => {
  // fecha inicial 26/01/2022
  let fechaInicial = new Date(2022, 0, 26, 8, 30, 0, 0);   // 2022-01-26T08:30:00.000Z
  let fechaActual = new Date();

  // meses de diferencia
  let diferenciaFechas = fechaActual.getTime() - fechaInicial.getTime();
  console.log(`diferencia de fechas: ${diferenciaFechas}`);
  
  // meses y días en las diferencia de fechas
  let dias = Math.floor(diferenciaFechas / (1000 * 60 * 60 * 24));
  let meses = Math.floor(dias / 30);
  let diasRestantes = dias - (meses * 30);
  
  console.log(`meses: ${meses} y dias: ${diasRestantes}`);
  
  console.log('Sending tweet...');

  let otros_receptores = ''

  // se enviará a otros receptores solo los días lunes y jueves
  if (fechaActual.getDay() === 1 || fechaActual.getDay() === 4) {
    otros_receptores = '@SERNAC @subtel_chile @entel_ayuda'
  }

  let tweet_movistar = `@MovistarChile @AyudaMovistarCL LLevo ${meses} mes(es) y ${diasRestantes} días esperando que me instalen Internet. Publicitan sus planes con stand, ofrecen promociones, monopolizan nuestro edificio pero al final no cumplen con su palabra.(req. 3126201) ${otros_receptores}`;
  console.log(tweet_movistar);
  try {
    const tweet_response = await client.v2.tweet(tweet_movistar);
    console.log(tweet_response);
  } catch (error) {
    console.log(error);
  }
};

new Cron.CronJob('00 30 8,16 * * 1-5', function() {
  sendTweet();
}, null, true, 'America/Santiago');

