import dotenv from 'dotenv';
// import Cron from 'cron';
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

const sendTweet = async () => {
  // 2022-01-26T01:30:00.000Z
  let fechaInicial = new Date( 2022, 0, 26, 7, 0, 0, 0 );
    
  // fecha actual menos 3 horas (hora del servidor)
  let fechaActual = new Date();

  fechaActual.setHours(fechaActual.getHours() - 3);

  console.log("fecha inicial", fechaInicial);
  console.log("fecha actual" , fechaActual);

  // meses de diferencia
  let diferenciaFechas = fechaActual.getTime() - fechaInicial.getTime();
  // meses y días en las diferencia de fechas
  let dias = Math.floor(diferenciaFechas / (1000 * 60 * 60 * 24));
  let meses = Math.floor(dias / 30);
  let diasRestantes = dias - (meses * 30);
  let horasRestantes = Math.floor((diferenciaFechas - (dias * 1000 * 60 * 60 * 24) ) / (1000 * 60 * 60))
  
  console.log('Sending tweet...');

  let otros_receptores = ''

  // se enviará a otros receptores solo los días lunes y jueves a las 8:30
  if (fechaActual.getDay() === 1 || fechaActual.getDay() === 4) {
    if (horasRestantes < 4) {
      otros_receptores = '@SERNAC @subtel_chile @entel_ayuda'
    }
  }

  let meses_name = 'meses'

  if (meses === 1) {
    meses_name = 'mes'
  }

  let dias_name = 'días'

  if (diasRestantes === 1) {
    dias_name = 'día'
  }

  let horas_name = 'horas'

  if (horasRestantes === 1) {
    horas_name = 'hora'
  }
  
  let tweet_movistar = `@MovistarChile @AyudaMovistarCL LLevo ${meses} ${meses_name}, ${diasRestantes} ${dias_name} y ${horasRestantes} ${horas_name} esperando que me instalen Internet. Publicitan sus planes con stand, ofrecen promociones y monopolizan nuestro edificio pero al final no cumplen con su palabra.(req. 3126201) ${otros_receptores}`;
  
  console.log(tweet_movistar);
  try {
    const tweet_response = await client.v2.tweet(tweet_movistar);
    console.log(tweet_response);
  } catch (error) {
    console.log(error);
  }
};


// solo envia el twitt de lunes a viernes
if (new Date().getDay() === 1 || new Date().getDay() === 2 || new Date().getDay() === 3 || new Date().getDay() === 4 || new Date().getDay() === 5) {
  sendTweet();
} else {
  console.log('No es día de trabajo');
}


