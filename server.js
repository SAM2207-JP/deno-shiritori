import { serve } from "https://deno.land/std@0.138.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";

const word_list = [];
const randomWord = ["りんご","もも","いちご","ぶどう"];
const no = Math.floor(Math.random() * randomWord.length);
let previousWord = randomWord[no];

word_list.push(previousWord);

console.log("Listening on http://localhost:8000");

serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);
  

  if (req.method === "GET" && pathname === "/shiritori") {
    return new Response(previousWord);
  }
  
  if (req.method === "POST" && pathname === "/shiritori") {

    const requestJson = await req.json();
    const nextWord = requestJson.nextWord;
    let endWord = nextWord.slice(-1);

    if (endWord == 'ん'){
      return new Response("んは使わないでください。失敗", { status: 400 });
    }

    if (str.match(/^[ぁ-んー　]*$/)) {
      return new Response("ひらがなをにゅうりょくしてください", { status: 400 });
    }

    if (nextWord.length > 0 && previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0)) {
      // previousWord = word_list[0];
      // console.log(previousWord);
      word_list.splice(0)
     
      return new Response("前の単語に続いていません。最初から", { status: 400 });
    }
    
    if(word_list.indexOf(nextWord) !== -1){
      previousWord = word_list[0];
      word_list.splice(0)
     
      return new Response("同じ単語を使わないでください。最初から",{ status: 400});
    }
    
    word_list.push(nextWord);
    console.log(word_list)
    previousWord = nextWord;
    
    return new Response(previousWord);
  }
  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,

  });

});
