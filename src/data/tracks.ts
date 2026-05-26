export interface TrackData {
  id: string;
  track_name: string;
  artist: string;
  album: string;
  album_cover: string;
  moods: string[];
  moment_types?: string[];
  is_new_discovery?: boolean;
  youtubeId?: string;
  // Nuevos atributos para matching visual
  energy?: number;           // 1-10 scale
  visualScenes?: string[];   // beach, city, nature, sunset, party, night, etc.
  colorVibes?: string[];     // warm, cool, vibrant, muted, golden
  genres?: string[];         // rock, pop, indie, electronic, etc.
}

// Catálogo ampliado de canciones con moods que coinciden con el formulario
const RAW_TRACK_CATALOG: TrackData[] = [
  // ============ ENAMORADO ============
  { id: "e001", track_name: "Perfect", artist: "Ed Sheeran", album: "÷", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/15/e6/e8/15e6e8a4-4190-6a8b-86c3-ab4a51b88288/190295851286.jpg/300x300bb.jpg", moods: ["enamorado", "feliz"], moment_types: ["noche", "evento"], youtubeId: "2Vv-BfVoq4g" },
  { id: "e002", track_name: "All of Me", artist: "John Legend", album: "Love in the Future", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/22/71/b9/2271b906-85b3-06ee-e611-489b91df0b73/886444160742.jpg/300x300bb.jpg", moods: ["enamorado", "reflexivo"], moment_types: ["noche"], youtubeId: "450p7goxZqg" },
  { id: "e003", track_name: "Thinking Out Loud", artist: "Ed Sheeran", album: "x", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2d/36/f9/2d36f9a7-2c3e-ce0f-7fb6-036feecb221f/825646974450.jpg/300x300bb.jpg", moods: ["enamorado", "relajado"], moment_types: ["noche", "evento"], youtubeId: "lp-EO5I60KA" },
  { id: "e004", track_name: "Can't Help Falling in Love", artist: "Elvis Presley", album: "Blue Hawaii", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/10/53/1d/10531d93-d6d2-996d-516f-5ea58bc4dbfa/884977724691.jpg/300x300bb.jpg", moods: ["enamorado", "nostálgico"], moment_types: ["noche", "despedida"], youtubeId: "vGJTaP6anOU" },
  { id: "e005", track_name: "A Thousand Years", artist: "Christina Perri", album: "The Twilight Saga", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/f5/2e/83/f52e8357-9cf4-e644-c365-3c21839f85ac/mzi.staekbjw.jpg/300x300bb.jpg", moods: ["enamorado", "esperanzado"], moment_types: ["noche", "evento"], youtubeId: "rtOvBOTyX00" },
  { id: "e006", track_name: "Yellow", artist: "Coldplay", album: "Parachutes", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f5/93/8c/f5938c49-964c-31d1-4b33-78b634f71fb7/190295978075.jpg/300x300bb.jpg", moods: ["enamorado", "nostálgico"], moment_types: ["noche", "concierto"], youtubeId: "yKNxeF4KMsY" },
  { id: "e007", track_name: "Just The Way You Are", artist: "Bruno Mars", album: "Doo-Wops & Hooligans", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/98/ae/c2/98aec2e1-3be4-0311-1b44-69348fc87abb/075679956484.jpg/300x300bb.jpg", moods: ["enamorado", "feliz"], moment_types: ["fiesta", "noche"], youtubeId: "LjhCEhWiKXk" },
  { id: "e008", track_name: "Love Story", artist: "Taylor Swift", album: "Fearless", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c3/d0/1c/c3d01c88-73e7-187e-fd62-e1744de979a6/21UMGIM09915.rgb.jpg/300x300bb.jpg", moods: ["enamorado", "feliz", "esperanzado"], moment_types: ["noche"], youtubeId: "8xg3vE8Ie_E" },
  { id: "e009", track_name: "Unchained Melody", artist: "The Righteous Brothers", album: "Unchained Melody", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/be/95/6b/be956b6b-23e6-d27d-356e-c81b22216abf/00602527149899.rgb.jpg/300x300bb.jpg", moods: ["enamorado", "nostálgico"], moment_types: ["noche"], youtubeId: "qiiyq2xrSI0" },
  { id: "e010", track_name: "My Kind of Woman", artist: "Mac DeMarco", album: "2", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bf/73/f8/bf73f8c0-40c4-e9c7-2d6a-968c3533747e/ct164.jpg/300x300bb.jpg", moods: ["enamorado", "relajado"], moment_types: ["tranquilo", "noche"], youtubeId: "wIuBcb2T55Q" },
  { id: "e011", track_name: "Me Porto Bonito", artist: "Bad Bunny", album: "Un Verano Sin Ti", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/3e/04/eb/3e04ebf6-370f-f59d-ec84-2c2643db92f1/196626945068.jpg/300x300bb.jpg", moods: ["enamorado", "feliz"], moment_types: ["fiesta", "vacaciones"], youtubeId: "saGYMhApaH8" },
  { id: "e012", track_name: "Cuando Te Besé", artist: "Becky G & Paulo Londra", album: "Cuando Te Besé", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2b/65/69/2b6569c2-e825-cce3-f94a-c2cbe6e68c1f/886448075417.jpg/300x300bb.jpg", moods: ["enamorado", "feliz"], moment_types: ["fiesta"], youtubeId: "kH4KMb4HVSo" },
  { id: "e013", track_name: "EARFQUAKE", artist: "Tyler, The Creator", album: "IGOR", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/0c/06/05/0c060581-6242-6a2a-a677-20170f2cf8da/886447710180.jpg/300x300bb.jpg", moods: ["enamorado", "nervioso", "rapero"], moment_types: ["noche"], youtubeId: "HmAsUQEFYGI" },
  { id: "e014", track_name: "Sweet Child O' Mine", artist: "Guns N' Roses", album: "Appetite for Destruction", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/56/47/b7/5647b700-6b9d-9e72-ec9f-51140b6d4492/00602567673781.rgb.jpg/300x300bb.jpg", moods: ["enamorado", "motivado"], moment_types: ["concierto"], youtubeId: "1w7OgIMMRc4" },
  { id: "e015", track_name: "Somebody To Love", artist: "Queen", album: "A Day at the Races", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/4d/08/2a/4d082a9e-7898-1aa1-a02f-339810058d9e/14DMGIM05632.rgb.jpg/300x300bb.jpg", moods: ["enamorado", "motivado"], moment_types: ["concierto"], youtubeId: "kijpcUv-b8M" },
  
  // ============ NOSTÁLGICO ============
  { id: "n001", track_name: "The Night We Met", artist: "Lord Huron", album: "Strange Trails", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/55/41/4a/55414a18-861a-79d1-e575-5bf8cf205dbe/886445056839_Cover.jpg/300x300bb.jpg", moods: ["nostálgico", "triste"], moment_types: ["despedida", "tranquilo"], youtubeId: "KtlgYxa6BMU" },
  { id: "n002", track_name: "Yesterday", artist: "The Beatles", album: "Help!", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/1a/19/db/1a19db26-17ad-b986-11a9-f72ac7a6194b/18UMGIM31214.rgb.jpg/300x300bb.jpg", moods: ["nostálgico", "triste", "reflexivo"], moment_types: ["tranquilo", "despedida"], youtubeId: "wXTJBr9tt8Q" },
  { id: "n003", track_name: "Wonderwall", artist: "Oasis", album: "(What's the Story) Morning Glory?", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/04/92/e0/0492e08b-cbcc-9969-9ad6-8f5a0888068c/5051961007107.jpg/300x300bb.jpg", moods: ["nostálgico", "esperanzado"], moment_types: ["concierto", "fiesta"], youtubeId: "bx1Bh8ZvH84" },
  { id: "n004", track_name: "Dreams", artist: "Fleetwood Mac", album: "Rumours", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/d2/48/f4/d248f4ae-a7e4-a48e-1588-6617de3e8d76/mzi.izeorbmm.jpg/300x300bb.jpg", moods: ["nostálgico", "relajado"], moment_types: ["tranquilo", "vacaciones"], youtubeId: "mrZRURcb1cM" },
  { id: "n005", track_name: "Hotel California", artist: "Eagles", album: "Hotel California", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/88/16/2c/88162c3d-46db-8321-61f3-3a47404cfe76/075596050920.jpg/300x300bb.jpg", moods: ["nostálgico", "reflexivo"], moment_types: ["vacaciones", "noche"], youtubeId: "09839DpTctU" },
  { id: "n006", track_name: "Heat Waves", artist: "Glass Animals", album: "Dreamland", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/da/8b/77/da8b7731-6f4f-eacf-5e74-8b23389eefa1/20UMGIM03371.rgb.jpg/300x300bb.jpg", moods: ["nostálgico", "relajado"], moment_types: ["vacaciones", "noche"], youtubeId: "mRD0-GxqHVo" },
  { id: "n007", track_name: "Do I Wanna Know?", artist: "Arctic Monkeys", album: "AM", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/cc/0f/2d/cc0f2d02-5ff1-10e7-eea2-76863a55dbad/887828031795.png/300x300bb.jpg", moods: ["nostálgico", "relajado"], moment_types: ["noche"], youtubeId: "bpOSxM0rNPM" },
  { id: "n008", track_name: "Photograph", artist: "Ed Sheeran", album: "x", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2d/36/f9/2d36f9a7-2c3e-ce0f-7fb6-036feecb221f/825646974450.jpg/300x300bb.jpg", moods: ["nostálgico", "enamorado"], moment_types: ["evento", "despedida"], youtubeId: "nSDgHBxUbVQ" },
  { id: "n009", track_name: "Karma Police", artist: "Radiohead", album: "OK Computer", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/300x300bb.jpg", moods: ["nostálgico", "reflexivo"], moment_types: ["tranquilo"], youtubeId: "1uYWYWPc9HU" },
  { id: "n010", track_name: "Let It Be", artist: "The Beatles", album: "Let It Be", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/ae/98/4c/ae984c7a-cd06-a7cd-e8bf-32cb15ba698d/00602567705475.rgb.jpg/300x300bb.jpg", moods: ["nostálgico", "relajado", "esperanzado"], moment_types: ["despedida", "tranquilo"], youtubeId: "QDYfEBY9NM4" },
  { id: "n011", track_name: "Blinding Lights", artist: "The Weeknd", album: "After Hours", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/a6/6e/bf/a66ebf79-5008-8948-b352-a790fc87446b/19UM1IM04638.rgb.jpg/300x300bb.jpg", moods: ["nostálgico", "motivado"], moment_types: ["fiesta", "noche"], youtubeId: "4NRXx6U8ABQ" },
  { id: "n012", track_name: "Instant Crush", artist: "Daft Punk", album: "Random Access Memories", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e8/43/5f/e8435ffa-b6b9-b171-40ab-4ff3959ab661/886443919266.jpg/300x300bb.jpg", moods: ["nostálgico", "enamorado"], moment_types: ["noche"], youtubeId: "a5uQMwRMHcs" },
  { id: "n013", track_name: "See You Again", artist: "Tyler, The Creator", album: "Flower Boy", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b6/ef/ee/b6efeefa-fc99-37d1-ad21-0d769b2a4958/196872796971.jpg/300x300bb.jpg", moods: ["nostálgico", "relajado", "rapero"], moment_types: ["tranquilo"], youtubeId: "Fb_nJVkEGX4" },
  { id: "n014", track_name: "Summertime Sadness", artist: "Lana Del Rey", album: "Born To Die", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/f2/06/d5/f206d5d7-8bd4-7622-c98d-cf39344b098e/00602537489985.rgb.jpg/300x300bb.jpg", moods: ["nostálgico", "triste"], moment_types: ["vacaciones", "despedida"], youtubeId: "TdrL3QxjyVw" },
  { id: "n015", track_name: "November Rain", artist: "Guns N' Roses", album: "Use Your Illusion I", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/6a/e2/1f/6ae21fa9-c897-3be1-2967-50eefae22b93/06UMGIM05041.rgb.jpg/300x300bb.jpg", moods: ["nostálgico", "reflexivo"], moment_types: ["despedida"], youtubeId: "8SbUC-UaAxE" },
  { id: "n016", track_name: "The Less I Know The Better", artist: "Tame Impala", album: "Currents", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/a9/a2/81/a9a281f3-12ba-eb91-2d58-e535b306125c/artwork.jpg/300x300bb.jpg", moods: ["nostálgico", "relajado"], moment_types: ["noche"], youtubeId: "sBzrzS1Ag_g" },
  { id: "n017", track_name: "Callaita", artist: "Bad Bunny", album: "X 100PRE", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/8c/0f/81/8c0f81f2-9f10-5e3d-b9de-5961a73e8e52/195081078724.jpg/300x300bb.jpg", moods: ["nostálgico", "relajado"], moment_types: ["vacaciones", "noche"], youtubeId: "RgULjdsjiLQ" },
  
  // ============ FELIZ ============
  { id: "f001", track_name: "Happy", artist: "Pharrell Williams", album: "G I R L", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/76/ff/5e/76ff5ee0-7ab4-2ac2-2598-486a9ccc06e1/886444516877.jpg/300x300bb.jpg", moods: ["feliz", "motivado"], moment_types: ["fiesta", "vacaciones"], youtubeId: "ZbZSe6N_BXs" },
  { id: "f002", track_name: "Here Comes The Sun", artist: "The Beatles", album: "Abbey Road", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/df/db/61/dfdb615d-47f8-06e9-9533-b96daccc029f/18UMGIM31076.rgb.jpg/300x300bb.jpg", moods: ["feliz", "esperanzado", "relajado"], moment_types: ["vacaciones", "tranquilo"], youtubeId: "KQetemT1sWc" },
  { id: "f003", track_name: "Don't Stop Me Now", artist: "Queen", album: "Jazz", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/4d/08/2a/4d082a9e-7898-1aa1-a02f-339810058d9e/14DMGIM05632.rgb.jpg/300x300bb.jpg", moods: ["feliz", "motivado", "libre"], moment_types: ["fiesta", "concierto"], youtubeId: "HgzGwKwLmgM" },
  { id: "f004", track_name: "Uptown Funk", artist: "Bruno Mars", album: "Uptown Special", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/7e/30/c5/7e30c572-aa47-5f7b-c6fd-42d50cd2c56d/886444959797.jpg/300x300bb.jpg", moods: ["feliz", "motivado"], moment_types: ["fiesta"], youtubeId: "OPf0YbXqDm0" },
  { id: "f005", track_name: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/e1/39/40/e13940d5-e6ab-b815-13e7-f81b0b7a62e7/20UMGIM12176.rgb.jpg/300x300bb.jpg", moods: ["feliz", "motivado"], moment_types: ["fiesta"], youtubeId: "TUVcZfQe-Kw" },
  { id: "f006", track_name: "Shake It Off", artist: "Taylor Swift", album: "1989", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a7/98/d8/a798d867-344d-2bf2-fbfe-d2d1412dcef8/14UMDIM03793.rgb.jpg/300x300bb.jpg", moods: ["feliz", "motivado"], moment_types: ["fiesta"], youtubeId: "nfWlot6h_JM" },
  { id: "f007", track_name: "Good Vibrations", artist: "The Beach Boys", album: "Smiley Smile", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/94/62/6c/94626c44-4657-739e-e639-39ae55e6d2cc/13UABIM03827.rgb.jpg/300x300bb.jpg", moods: ["feliz", "relajado"], moment_types: ["vacaciones"], youtubeId: "Eab_beh07HU" },
  { id: "f008", track_name: "Walking on Sunshine", artist: "Katrina & The Waves", album: "Walking on Sunshine", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/cc/0b/bd/cc0bbd86-f930-2f01-1e7d-47574fc36723/13ULAIM49572.rgb.jpg/300x300bb.jpg", moods: ["feliz", "motivado", "libre"], moment_types: ["vacaciones"], youtubeId: "iPUmE-tne5U" },
  { id: "f009", track_name: "24K Magic", artist: "Bruno Mars", album: "24K Magic", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/68/6d/a5/686da561-b5b6-e36c-f888-a02a3b225447/00075679913364.rgb.jpg/300x300bb.jpg", moods: ["feliz", "motivado"], moment_types: ["fiesta", "noche"], youtubeId: "UqyT8IEBkvY" },
  { id: "f010", track_name: "One More Time", artist: "Daft Punk", album: "Discovery", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fd/4a/77/fd4a77db-0ebc-d043-41a2-f32fa1bb0fb4/dj.qrikkdwj.jpg/300x300bb.jpg", moods: ["feliz", "motivado"], moment_types: ["fiesta"], youtubeId: "FGBhQbmPwH8" },
  { id: "f011", track_name: "Get Lucky", artist: "Daft Punk", album: "Random Access Memories", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e8/43/5f/e8435ffa-b6b9-b171-40ab-4ff3959ab661/886443919266.jpg/300x300bb.jpg", moods: ["feliz", "relajado"], moment_types: ["fiesta", "vacaciones"], youtubeId: "5NV6Rdv1a3I" },
  { id: "f012", track_name: "Tití Me Preguntó", artist: "Bad Bunny", album: "Un Verano Sin Ti", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/3e/04/eb/3e04ebf6-370f-f59d-ec84-2c2643db92f1/196626945068.jpg/300x300bb.jpg", moods: ["feliz", "motivado"], moment_types: ["fiesta", "vacaciones"], youtubeId: "aYbJXM66M_s" },
  { id: "f013", track_name: "Summer", artist: "Calvin Harris", album: "Motion", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music4/v4/f4/b0/e7/f4b0e76f-3f2a-1b8f-6ba0-e03e3a1a6849/886444925372.jpg/300x300bb.jpg", moods: ["feliz", "libre"], moment_types: ["vacaciones", "fiesta"], youtubeId: "ebXbLfLACGM" },
  { id: "f014", track_name: "Con Altura", artist: "Rosalía", album: "Single", album_cover: "https://cdn-images.dzcdn.net/images/cover/0a6b457530fcf0bfa2eff233cb584e29/500x500-000000-80-0-0.jpg", moods: ["feliz", "motivado"], moment_types: ["fiesta"], youtubeId: "p7bfOZek9t4" },
  { id: "f015", track_name: "Mi Gente", artist: "J Balvin", album: "Vibras", album_cover: "https://cdn-images.dzcdn.net/images/cover/46df5f5da9e9d3da13099f94473b053b/500x500-000000-80-0-0.jpg", moods: ["feliz", "motivado"], moment_types: ["fiesta"], youtubeId: "wnJ6LuUFpMo" },
  { id: "f016", track_name: "Hips Don't Lie", artist: "Shakira", album: "Oral Fixation, Vol. 2", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/0d/b5/8a/0db58a8b-7b17-dd53-3464-116a415d0f49/196872648836.jpg/300x300bb.jpg", moods: ["feliz", "motivado"], moment_types: ["fiesta"], youtubeId: "DUT5rEU6pqM" },
  { id: "f017", track_name: "Electric Feel", artist: "MGMT", album: "Oracular Spectacular", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/66/d8/08/66d808c0-24c9-9223-5692-7e4759ab207d/196871101424.jpg/300x300bb.jpg", moods: ["feliz", "libre"], moment_types: ["fiesta", "concierto"], youtubeId: "MmZexg8sxyk" },
  { id: "f018", track_name: "Cairo", artist: "Karol G", album: "Mañana Será Bonito", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Video122/v4/27/38/24/273824b2-061e-8943-152c-28936cee8604/22UM1IM24941.crop.jpg/300x300bb.jpg", moods: ["feliz", "relajado"], moment_types: ["vacaciones"], youtubeId: "jXJp_R0f0XY" },
  
  // ============ RELAJADO ============
  { id: "r001", track_name: "Weightless", artist: "Marconi Union", album: "Weightless", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c3/3a/d6/c33ad6a3-ec91-62e4-0912-d4a873d4fed0/cover.jpg/300x300bb.jpg", moods: ["relajado"], moment_types: ["tranquilo"], youtubeId: "UfcAVejslrU" },
  { id: "r002", track_name: "So What", artist: "Miles Davis", album: "Kind of Blue", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music/7f/9f/d6/mzi.vtnaewef.jpg/300x300bb.jpg", moods: ["relajado", "reflexivo"], moment_types: ["tranquilo", "inspiracion"], youtubeId: "zqNTltOGh5c" },
  { id: "r003", track_name: "Blue in Green", artist: "Miles Davis", album: "Kind of Blue", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music/7f/9f/d6/mzi.vtnaewef.jpg/300x300bb.jpg", moods: ["relajado", "reflexivo", "triste"], moment_types: ["tranquilo"], youtubeId: "PoPL7BExSQU" },
  { id: "r004", track_name: "We'll Be Fine", artist: "Jinsang", album: "Solitude", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/33/a5/2f/33a52fc2-d77b-9408-6d5b-af389ee28c43/cover_4018939360092.jpg/300x300bb.jpg", moods: ["relajado", "nostálgico"], moment_types: ["tranquilo", "inspiracion"], youtubeId: "sbH3gjbfJKs" },
  { id: "r005", track_name: "Affection", artist: "Jinsang", album: "Life", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/33/a5/2f/33a52fc2-d77b-9408-6d5b-af389ee28c43/cover_4018939360092.jpg/300x300bb.jpg", moods: ["relajado", "enamorado"], moment_types: ["tranquilo"], youtubeId: "5E4IzF3DY_Y" },
  { id: "r006", track_name: "Take It Easy", artist: "Eagles", album: "Eagles", album_cover: "https://cdn-images.dzcdn.net/images/cover/caff1be8c69e55e1b5ea8ac4eefa05fb/500x500-000000-80-0-0.jpg", moods: ["relajado", "feliz"], moment_types: ["vacaciones", "tranquilo"], youtubeId: "UI3F687SsoU" },
  { id: "r007", track_name: "Circles", artist: "Post Malone", album: "Hollywood's Bleeding", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/41/28/39/412839e4-e26e-8f5e-1e32-24e5bdf9a12a/19UMGIM68425.rgb.jpg/300x300bb.jpg", moods: ["relajado", "reflexivo"], moment_types: ["tranquilo"], youtubeId: "wXhTHyIgQ_U" },
  { id: "r008", track_name: "Sunflower", artist: "Post Malone", album: "Spider-Man: Into the Spider-Verse", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/89/a7/dd/89a7dd9b-060c-6ff5-8a52-6d67a2b09bfb/18UMGIM62398.rgb.jpg/300x300bb.jpg", moods: ["relajado", "feliz"], moment_types: ["tranquilo", "vacaciones"], youtubeId: "ApXoWvfEYVU" },
  { id: "r009", track_name: "Come As You Are", artist: "Nirvana", album: "Nevermind", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/95/fd/b9/95fdb9b2-6d2b-92a6-97f2-51c1a6d77f1a/00602527874609.rgb.jpg/300x300bb.jpg", moods: ["relajado", "nostálgico"], moment_types: ["tranquilo"], youtubeId: "vabnZ9-ex7o" },
  { id: "r010", track_name: "Clint Eastwood", artist: "Gorillaz", album: "Gorillaz", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/76/fc/e7/76fce783-7be6-2dcd-7b54-1306c7d872ea/825646264261.jpg/300x300bb.jpg", moods: ["relajado", "reflexivo"], moment_types: ["tranquilo"], youtubeId: "1V_xRb0x9aw" },
  { id: "r011", track_name: "Hotline Bling", artist: "Drake", album: "Views", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/95/dd/f4/95ddf40e-e95e-5a6e-e27f-4aee315392e4/00602547870711.rgb.jpg/300x300bb.jpg", moods: ["relajado", "nostálgico"], moment_types: ["noche"], youtubeId: "uxpDa-c-4Mc" },
  { id: "r012", track_name: "Good Days", artist: "SZA", album: "Single", album_cover: "https://cdn-images.dzcdn.net/images/cover/8aafccd5fc82acdebc88372bd1bef371/500x500-000000-80-0-0.jpg", moods: ["relajado", "esperanzado"], moment_types: ["tranquilo"], youtubeId: "U5fJK2VQ8b0" },
  { id: "r013", track_name: "One Dance", artist: "Drake", album: "Views", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/95/dd/f4/95ddf40e-e95e-5a6e-e27f-4aee315392e4/00602547870711.rgb.jpg/300x300bb.jpg", moods: ["relajado", "feliz"], moment_types: ["fiesta", "vacaciones"], youtubeId: "BSzSn-PRdtI" },
  { id: "r014", track_name: "Chamber of Reflection", artist: "Mac DeMarco", album: "Salad Days", album_cover: "https://cdn-images.dzcdn.net/images/cover/96f16ccb3da4d231b72bc5de25a16202/500x500-000000-80-0-0.jpg", moods: ["relajado", "reflexivo"], moment_types: ["tranquilo", "noche"], youtubeId: "NY8IS0ssnXQ" },
  { id: "r015", track_name: "Three Little Birds", artist: "Bob Marley & The Wailers", album: "Exodus", album_cover: "https://cdn-images.dzcdn.net/images/cover/c43e3b1d83e0107dfff7e4238096fe5b/500x500-000000-80-0-0.jpg", moods: ["relajado", "feliz", "esperanzado"], moment_types: ["vacaciones", "tranquilo"], youtubeId: "zaGUr6wzyT8" },
  { id: "r016", track_name: "On Melancholy Hill", artist: "Gorillaz", album: "Plastic Beach", album_cover: "https://cdn-images.dzcdn.net/images/cover/4ddf15e6d4fa3cf61fdc8271cdec4815/500x500-000000-80-0-0.jpg", moods: ["relajado", "reflexivo"], moment_types: ["tranquilo"], youtubeId: "04mfKJWDSzI" },
  
  // ============ NERVIOSO ============
  { id: "nv001", track_name: "Smells Like Teen Spirit", artist: "Nirvana", album: "Nevermind", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/95/fd/b9/95fdb9b2-6d2b-92a6-97f2-51c1a6d77f1a/00602527874609.rgb.jpg/300x300bb.jpg", moods: ["nervioso", "motivado"], moment_types: ["concierto"], youtubeId: "hTWKbfoikeg" },
  { id: "nv002", track_name: "bad guy", artist: "Billie Eilish", album: "WHEN WE ALL FALL ASLEEP", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/c0/eb/43/c0eb4379-0b1e-aaa6-a2b8-5bb75eb53ca5/19UMGIM17513.rgb.jpg/300x300bb.jpg", moods: ["nervioso", "motivado"], moment_types: ["fiesta", "noche"], youtubeId: "DyDfgMOUjCI" },
  { id: "nv003", track_name: "Creep", artist: "Radiohead", album: "Pablo Honey", album_cover: "https://cdn-images.dzcdn.net/images/cover/1dd56fd8824492e1a5106c99a00a85ec/500x500-000000-80-0-0.jpg", moods: ["nervioso", "triste"], moment_types: ["tranquilo"], youtubeId: "XFkzRNyygfk" },
  { id: "nv004", track_name: "Love It If We Made It", artist: "The 1975", album: "A Brief Inquiry Into Online Relationships", album_cover: "https://cdn-images.dzcdn.net/images/cover/bb46fb170ee3b428e14e2b247bc0a23c/500x500-000000-80-0-0.jpg", moods: ["nervioso", "motivado"], moment_types: ["concierto"], youtubeId: "1Wl1B7DPegc" },
  { id: "nv005", track_name: "Yonkers", artist: "Tyler, The Creator", album: "Goblin", album_cover: "https://cdn-images.dzcdn.net/images/cover/65d4a36d03918097176d42f8f55900af/500x500-000000-80-0-0.jpg", moods: ["nervioso", "motivado", "rapero"], moment_types: ["concierto"], youtubeId: "XSbZidsgMfw" },
  { id: "nv006", track_name: "Paranoid", artist: "Black Sabbath", album: "Paranoid", album_cover: "https://cdn-images.dzcdn.net/images/cover/bb3b4d0378c91d2fca5204bac48f5e71/500x500-000000-80-0-0.jpg", moods: ["nervioso", "motivado"], moment_types: ["concierto"], youtubeId: "uk_wUT1CvWM" },
  { id: "nv007", track_name: "Hysteria", artist: "Muse", album: "Absolution", album_cover: "https://cdn-images.dzcdn.net/images/cover/fc1237878aab62be8ff624f575961e68/500x500-000000-80-0-0.jpg", moods: ["nervioso", "motivado"], moment_types: ["concierto"], youtubeId: "3dm_5qWWDV8" },
  { id: "nv008", track_name: "Psycho Killer", artist: "Talking Heads", album: "77", album_cover: "https://cdn-images.dzcdn.net/images/cover/8c00dcb9a1eae464bc5e5336fd86608f/500x500-000000-80-0-0.jpg", moods: ["nervioso"], moment_types: ["concierto", "noche"], youtubeId: "O52jAYa4Pm8" },
  
  // ============ TRISTE ============
  { id: "t001", track_name: "Someone Like You", artist: "Adele", album: "21", album_cover: "https://cdn-images.dzcdn.net/images/cover/dc1ce848d830ecc93521be5a78350364/500x500-000000-80-0-0.jpg", moods: ["triste", "nostálgico"], moment_types: ["despedida", "tranquilo"], youtubeId: "hLQl3WQQoQ0" },
  { id: "t002", track_name: "when the party's over", artist: "Billie Eilish", album: "WHEN WE ALL FALL ASLEEP", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/c0/eb/43/c0eb4379-0b1e-aaa6-a2b8-5bb75eb53ca5/19UMGIM17513.rgb.jpg/300x300bb.jpg", moods: ["triste", "reflexivo"], moment_types: ["despedida", "tranquilo"], youtubeId: "pbMwTqkKSps" },
  { id: "t003", track_name: "All Too Well", artist: "Taylor Swift", album: "Red", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/15/38/9b/15389bf4-8074-06c3-11ee-655b5453af68/21UM1IM25046.rgb.jpg/300x300bb.jpg", moods: ["triste", "nostálgico"], moment_types: ["despedida"], youtubeId: "tollGa3S0o8" },
  { id: "t004", track_name: "Hurt", artist: "Johnny Cash", album: "American IV", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/9f/b0/3c/9fb03c5a-28f5-9609-a5fa-8471b6b32fc1/00602498613351.rgb.jpg/300x300bb.jpg", moods: ["triste", "reflexivo"], moment_types: ["despedida"], youtubeId: "8AHCfZTRGiI" },
  { id: "t005", track_name: "Mad World", artist: "Gary Jules", album: "Trading Snakeoil", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/9b/85/d1/9b85d149-a6da-ca8e-ce29-352a7e4ebfd7/751937180227.png/300x300bb.jpg", moods: ["triste", "reflexivo"], moment_types: ["tranquilo"], youtubeId: "4N3N1MlvVc4" },
  { id: "t006", track_name: "Tears in Heaven", artist: "Eric Clapton", album: "Unplugged", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/b4/a8/99/b4a89922-4b67-104e-f85c-d6d478303e65/93624755364.jpg/300x300bb.jpg", moods: ["triste", "nostálgico"], moment_types: ["despedida"], youtubeId: "JxPj3GAYYZ0" },
  { id: "t007", track_name: "Somebody Else", artist: "The 1975", album: "I Like It When You Sleep", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/1b/8e/3e/1b8e3e4f-33ed-f5a8-c485-f40faba6f71e/artwork.jpg/300x300bb.jpg", moods: ["triste", "nostálgico"], moment_types: ["despedida", "noche"], youtubeId: "Bimd2nZirT4" },
  { id: "t008", track_name: "Save Your Tears", artist: "The Weeknd", album: "After Hours", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/a6/6e/bf/a66ebf79-5008-8948-b352-a790fc87446b/19UM1IM04638.rgb.jpg/300x300bb.jpg", moods: ["triste", "nostálgico"], moment_types: ["despedida"], youtubeId: "XXYlFuWEuKI" },
  { id: "t009", track_name: "Kill Bill", artist: "SZA", album: "SOS", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/bd/3b/a9/bd3ba9fb-9609-144f-bcfe-ead67b5f6ab3/196589564931.jpg/300x300bb.jpg", moods: ["triste", "nervioso"], moment_types: ["despedida"], youtubeId: "CJE8W4YkVlI" },
  { id: "t010", track_name: "Tusa", artist: "Karol G", album: "Ocean", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Video123/v4/44/3f/0a/443f0aaa-81c3-3ad6-b901-d70e009bae88/19UMGIM93547.crop.jpg/300x300bb.jpg", moods: ["triste", "motivado"], moment_types: ["fiesta", "despedida"], youtubeId: "tbneQDc2H3I" },
  { id: "t011", track_name: "Video Games", artist: "Lana Del Rey", album: "Born To Die", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/f2/06/d5/f206d5d7-8bd4-7622-c98d-cf39344b098e/00602537489985.rgb.jpg/300x300bb.jpg", moods: ["triste", "nostálgico"], moment_types: ["tranquilo"], youtubeId: "cE6wxDqdOV0" },
  { id: "t012", track_name: "The Weekend", artist: "SZA", album: "Ctrl", album_cover: "https://cdn-images.dzcdn.net/images/cover/a1a3326c5d9176c763fc3fd847b86681/500x500-000000-80-0-0.jpg", moods: ["triste", "enamorado"], moment_types: ["noche"], youtubeId: "dU5EBw-ec7E" },
  { id: "t013", track_name: "Young and Beautiful", artist: "Lana Del Rey", album: "The Great Gatsby", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/e3/e3/13/e3e31393-abf5-e9b1-edc4-20ede35d0c75/13UMGIM43701.rgb.jpg/300x300bb.jpg", moods: ["triste", "enamorado"], moment_types: ["noche"], youtubeId: "o_1aF54DO60" },
  { id: "t014", track_name: "Why'd You Only Call Me When You're High?", artist: "Arctic Monkeys", album: "AM", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/cc/0f/2d/cc0f2d02-5ff1-10e7-eea2-76863a55dbad/887828031795.png/300x300bb.jpg", moods: ["triste", "nostálgico"], moment_types: ["noche"], youtubeId: "6366dxFf-Os" },
  
  // ============ REFLEXIVO ============
  { id: "rf001", track_name: "The Sound of Silence", artist: "Simon & Garfunkel", album: "Sounds of Silence", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/f9/8c/fa/f98cfa9e-282b-8a4f-33bd-ff3de9269963/074640926921.jpg/300x300bb.jpg", moods: ["reflexivo", "triste"], moment_types: ["tranquilo"], youtubeId: "4fWyzwo1xg0" },
  { id: "rf002", track_name: "Space Oddity", artist: "David Bowie", album: "David Bowie", album_cover: "https://cdn-images.dzcdn.net/images/cover/8bd4a046f3d8c8895d9aff00a3b7c2df/500x500-000000-80-0-0.jpg", moods: ["reflexivo", "nostálgico"], moment_types: ["tranquilo", "inspiracion"], youtubeId: "iYYRH4apXDo" },
  { id: "rf003", track_name: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", album_cover: "https://cdn-images.dzcdn.net/images/cover/6706f1154083f461a348508c28030a30/500x500-000000-80-0-0.jpg", moods: ["reflexivo", "motivado"], moment_types: ["concierto"], youtubeId: "fJ9rUzIMcZQ" },
  { id: "rf004", track_name: "Nights", artist: "Frank Ocean", album: "Blonde", album_cover: "https://cdn-images.dzcdn.net/images/cover/f798a866107715dd6dc1049e498ce21f/500x500-000000-80-0-0.jpg", moods: ["reflexivo", "nostálgico"], moment_types: ["noche", "tranquilo"], youtubeId: "r4l9bFqgMaQ" },
  { id: "rf005", track_name: "Let It Happen", artist: "Tame Impala", album: "Currents", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/a9/a2/81/a9a281f3-12ba-eb91-2d58-e535b306125c/artwork.jpg/300x300bb.jpg", moods: ["reflexivo", "relajado"], moment_types: ["tranquilo", "inspiracion"], youtubeId: "pFptt7Cargc" },
  { id: "rf006", track_name: "Swimming Pools", artist: "Kendrick Lamar", album: "good kid, m.A.A.d city", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/36/86/ec/3686ec99-dec4-0a01-8b74-2d8a9a0263a7/12UMGIM52988.rgb.jpg/300x300bb.jpg", moods: ["reflexivo", "relajado", "rapero"], moment_types: ["fiesta", "tranquilo"], youtubeId: "B5YNiCfWC3A" },
  { id: "rf007", track_name: "Thinkin Bout You", artist: "Frank Ocean", album: "channel ORANGE", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/04/f8/63/04f863fc-2852-604f-c910-a97ac069506b/12UMGIM40339.rgb.jpg/300x300bb.jpg", moods: ["reflexivo", "enamorado"], moment_types: ["tranquilo", "noche"], youtubeId: "6JRhw_DM4I4" },
  { id: "rf008", track_name: "Flamenco Sketches", artist: "Miles Davis", album: "Kind of Blue", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music/7f/9f/d6/mzi.vtnaewef.jpg/300x300bb.jpg", moods: ["reflexivo", "relajado"], moment_types: ["tranquilo", "inspiracion"], youtubeId: "F3W_alUuHqg" },
  
  // ============ MOTIVADO ============
  { id: "m001", track_name: "Eye of the Tiger", artist: "Survivor", album: "Eye of the Tiger", album_cover: "https://cdn-images.dzcdn.net/images/cover/e66b5d3a40f69690c1633afb73cc590c/500x500-000000-80-0-0.jpg", moods: ["motivado", "nervioso"], moment_types: ["concierto", "evento"], youtubeId: "btPJPFnesV4" },
  { id: "m002", track_name: "Lose Yourself", artist: "Eminem", album: "8 Mile", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/08/23/fc/0823fcd9-cb44-695b-32bf-b3bf51d9f800/00606949351229.rgb.jpg/300x300bb.jpg", moods: ["motivado", "nervioso", "rapero"], moment_types: ["evento", "inspiracion"], youtubeId: "_Yhyp-_hX2s" },
  { id: "m003", track_name: "We Will Rock You", artist: "Queen", album: "News of the World", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/4d/08/2a/4d082a9e-7898-1aa1-a02f-339810058d9e/14DMGIM05632.rgb.jpg/300x300bb.jpg", moods: ["motivado", "feliz"], moment_types: ["concierto", "evento"], youtubeId: "-tJYN-eG1zk" },
  { id: "m004", track_name: "Stronger", artist: "Kanye West", album: "Graduation", album_cover: "https://cdn-images.dzcdn.net/images/cover/15012d974c6263aec95e52e6d86cba23/500x500-000000-80-0-0.jpg", moods: ["motivado", "nervioso", "rapero"], moment_types: ["evento", "fiesta"], youtubeId: "PsO6ZnUZI0g" },
  { id: "m005", track_name: "Believer", artist: "Imagine Dragons", album: "Evolve", album_cover: "https://cdn-images.dzcdn.net/images/cover/247b228179aea3b083eef43522b78b45/500x500-000000-80-0-0.jpg", moods: ["motivado", "nervioso"], moment_types: ["evento", "inspiracion"], youtubeId: "7wtfhZwyrcc" },
  { id: "m006", track_name: "Radioactive", artist: "Imagine Dragons", album: "Night Visions", album_cover: "https://cdn-images.dzcdn.net/images/cover/7e8314f4280cffde363547a495a260bc/500x500-000000-80-0-0.jpg", moods: ["motivado", "nervioso"], moment_types: ["evento"], youtubeId: "ktvTqknDobU" },
  { id: "m007", track_name: "Thunder", artist: "Imagine Dragons", album: "Evolve", album_cover: "https://cdn-images.dzcdn.net/images/cover/247b228179aea3b083eef43522b78b45/500x500-000000-80-0-0.jpg", moods: ["motivado", "feliz"], moment_types: ["evento"], youtubeId: "fKopy74weus" },
  { id: "m008", track_name: "Viva La Vida", artist: "Coldplay", album: "Viva la Vida", album_cover: "https://cdn-images.dzcdn.net/images/cover/eede3cd0dc3a5a87c7a5b1085b022e2d/500x500-000000-80-0-0.jpg", moods: ["motivado", "esperanzado"], moment_types: ["concierto", "evento"], youtubeId: "dvgZkm1xWPE" },
  { id: "m009", track_name: "Rolling in the Deep", artist: "Adele", album: "21", album_cover: "https://cdn-images.dzcdn.net/images/cover/dc1ce848d830ecc93521be5a78350364/500x500-000000-80-0-0.jpg", moods: ["motivado", "nervioso"], moment_types: ["concierto"], youtubeId: "rYEDA3JcQqw" },
  { id: "m010", track_name: "Heroes", artist: "David Bowie", album: "Heroes", album_cover: "https://cdn-images.dzcdn.net/images/cover/5fb91018679f65199308256be3c584ab/500x500-000000-80-0-0.jpg", moods: ["motivado", "esperanzado"], moment_types: ["evento", "inspiracion"], youtubeId: "lXgkuM2NhYI" },
  { id: "m011", track_name: "Fix You", artist: "Coldplay", album: "X&Y", album_cover: "https://cdn-images.dzcdn.net/images/cover/8a1a3e7c5e46b5f763328d95431ac19a/500x500-000000-80-0-0.jpg", moods: ["motivado", "triste", "esperanzado"], moment_types: ["despedida", "concierto"], youtubeId: "k4V3Mo61fJM" },
  { id: "m012", track_name: "HUMBLE.", artist: "Kendrick Lamar", album: "DAMN.", album_cover: "https://cdn-images.dzcdn.net/images/cover/7ce6b8452fae425557067db6e6a1cad5/500x500-000000-80-0-0.jpg", moods: ["motivado", "rapero"], moment_types: ["fiesta", "evento"], youtubeId: "tvTRZJ-4EyI" },
  { id: "m013", track_name: "God's Plan", artist: "Drake", album: "Scorpion", album_cover: "https://cdn-images.dzcdn.net/images/cover/b69d3bcbd130ad4cc9259de543889e30/500x500-000000-80-0-0.jpg", moods: ["motivado", "feliz", "rapero"], moment_types: ["fiesta"], youtubeId: "xpVfcZ0ZcFM" },
  { id: "m014", track_name: "Bichota", artist: "Karol G", album: "KG0516", album_cover: "https://cdn-images.dzcdn.net/images/cover/16d30e071f24a845d5005aef4660defc/500x500-000000-80-0-0.jpg", moods: ["motivado", "libre"], moment_types: ["fiesta"], youtubeId: "QaXhVryxVBk" },
  { id: "m015", track_name: "Starboy", artist: "The Weeknd", album: "Starboy", album_cover: "https://cdn-images.dzcdn.net/images/cover/134778e4c4f19ea71c82408300925a9a/500x500-000000-80-0-0.jpg", moods: ["motivado"], moment_types: ["fiesta", "noche"], youtubeId: "34Na4j8AVgA" },
  { id: "m016", track_name: "The Chain", artist: "Fleetwood Mac", album: "Rumours", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/d2/48/f4/d248f4ae-a7e4-a48e-1588-6617de3e8d76/mzi.izeorbmm.jpg/300x300bb.jpg", moods: ["motivado", "nervioso"], moment_types: ["concierto"], youtubeId: "JDG2m5hN1vo" },
  { id: "m017", track_name: "Can't Stop", artist: "Red Hot Chili Peppers", album: "By The Way", album_cover: "https://cdn-images.dzcdn.net/images/cover/49b073f55550d41055e02c493f9a7d39/500x500-000000-80-0-0.jpg", moods: ["motivado", "libre"], moment_types: ["concierto", "vacaciones"], youtubeId: "8DyziWtkfBw" },
  { id: "m018", track_name: "Rockstar", artist: "Post Malone", album: "Beerbongs & Bentleys", album_cover: "https://cdn-images.dzcdn.net/images/cover/c000a4d39f31f3716bf3f11aa5fab080/500x500-000000-80-0-0.jpg", moods: ["motivado", "rapero"], moment_types: ["fiesta"], youtubeId: "UceaB4D0jpo" },
  { id: "m019", track_name: "Malamente", artist: "Rosalía", album: "El Mal Querer", album_cover: "https://cdn-images.dzcdn.net/images/cover/10440b4fc8b5b8f3392702a2ef213ab1/500x500-000000-80-0-0.jpg", moods: ["motivado", "nervioso"], moment_types: ["concierto", "fiesta"], youtubeId: "Rht7rBHuXW8" },
  { id: "m020", track_name: "Alright", artist: "Kendrick Lamar", album: "To Pimp a Butterfly", album_cover: "https://cdn-images.dzcdn.net/images/cover/00dd0da365a94b1829302d6b7fec70e6/500x500-000000-80-0-0.jpg", moods: ["motivado", "esperanzado", "rapero"], moment_types: ["evento"], youtubeId: "Z-48u_uWMHY" },
  
  // ============ ESPERANZADO ============
  { id: "es002", track_name: "Don't Worry Be Happy", artist: "Bobby McFerrin", album: "Simple Pleasures", album_cover: "https://cdn-images.dzcdn.net/images/cover/121ed33882c127248831b9aacfe5220b/500x500-000000-80-0-0.jpg", moods: ["esperanzado", "feliz"], moment_types: ["vacaciones", "tranquilo"], youtubeId: "d-diB65scQU" },
  { id: "es003", track_name: "Beautiful Day", artist: "U2", album: "All That You Can't Leave Behind", album_cover: "https://cdn-images.dzcdn.net/images/cover/b37725cd9d9771d7674df22fafdcc0a2/500x500-000000-80-0-0.jpg", moods: ["esperanzado", "motivado"], moment_types: ["evento", "vacaciones"], youtubeId: "co6WMzDOh1o" },
  { id: "es004", track_name: "I Gotta Feeling", artist: "The Black Eyed Peas", album: "The E.N.D.", album_cover: "https://cdn-images.dzcdn.net/images/cover/ea30377840f4ef9ac62406c5e16e9c4b/500x500-000000-80-0-0.jpg", moods: ["esperanzado", "feliz"], moment_types: ["fiesta", "evento"], youtubeId: "uSD4vsh1zDA" },
  { id: "es005", track_name: "Roar", artist: "Katy Perry", album: "Prism", album_cover: "https://cdn-images.dzcdn.net/images/cover/fe781ecd9879a82beed80f6d3e80745b/500x500-000000-80-0-0.jpg", moods: ["esperanzado", "motivado"], moment_types: ["evento"], youtubeId: "CevxZvSJLk8" },
  { id: "es006", track_name: "Firework", artist: "Katy Perry", album: "Teenage Dream", album_cover: "https://cdn-images.dzcdn.net/images/cover/99578b0bb8c838383c414a5b62b5e15d/500x500-000000-80-0-0.jpg", moods: ["esperanzado", "motivado"], moment_types: ["evento", "fiesta"], youtubeId: "QGJuMBdaqIw" },
  { id: "es007", track_name: "Hall of Fame", artist: "The Script", album: "#3", album_cover: "https://cdn-images.dzcdn.net/images/cover/049dca48d45587b1bc5d2c47d7b875e8/500x500-000000-80-0-0.jpg", moods: ["esperanzado", "motivado"], moment_types: ["evento"], youtubeId: "mk48xRzuNvA" },
  { id: "es008", track_name: "Titanium", artist: "David Guetta ft. Sia", album: "Nothing but the Beat", album_cover: "https://cdn-images.dzcdn.net/images/cover/52330286cb5008805253fd77c7111d3f/500x500-000000-80-0-0.jpg", moods: ["esperanzado", "motivado"], moment_types: ["evento", "fiesta"], youtubeId: "JRfuAukYTKg" },
  
  // ============ LIBRE / AVENTURERO ============
  { id: "l001", track_name: "Born to Run", artist: "Bruce Springsteen", album: "Born to Run", album_cover: "https://cdn-images.dzcdn.net/images/cover/c071343c0d0e73ceec13218e08f28aae/500x500-000000-80-0-0.jpg", moods: ["libre", "motivado"], moment_types: ["vacaciones", "concierto"], youtubeId: "IxuThNgl3YA" },
  { id: "l002", track_name: "Life is a Highway", artist: "Tom Cochrane", album: "Mad Mad World", album_cover: "https://cdn-images.dzcdn.net/images/cover/ec3b9b0bd11bc4e869dd3f6b053b8ba4/500x500-000000-80-0-0.jpg", moods: ["libre", "feliz"], moment_types: ["vacaciones"], youtubeId: "U3sMjm9Eloo" },
  { id: "l003", track_name: "Go Your Own Way", artist: "Fleetwood Mac", album: "Rumours", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/d2/48/f4/d248f4ae-a7e4-a48e-1588-6617de3e8d76/mzi.izeorbmm.jpg/300x300bb.jpg", moods: ["libre", "motivado"], moment_types: ["despedida", "vacaciones"], youtubeId: "6ul-cZyuYw4" },
  { id: "l004", track_name: "Free Fallin'", artist: "Tom Petty", album: "Full Moon Fever", album_cover: "https://cdn-images.dzcdn.net/images/cover/6e9c12e4095a8642b8d5ccfa25087e4b/500x500-000000-80-0-0.jpg", moods: ["libre", "nostálgico"], moment_types: ["vacaciones"], youtubeId: "1lWJXDG2i0A" },
  { id: "l005", track_name: "Kids", artist: "MGMT", album: "Oracular Spectacular", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/66/d8/08/66d808c0-24c9-9223-5692-7e4759ab207d/196871101424.jpg/300x300bb.jpg", moods: ["libre", "nostálgico"], moment_types: ["fiesta", "vacaciones"], youtubeId: "fe4EK4HSPkI" },
  { id: "l006", track_name: "Yo Perreo Sola", artist: "Bad Bunny", album: "YHLQMDLG", album_cover: "https://cdn-images.dzcdn.net/images/cover/0a6f32569d4785c5ef82f581086f4302/500x500-000000-80-0-0.jpg", moods: ["libre", "motivado"], moment_types: ["fiesta"], youtubeId: "GtSRKwDCaZM" },
  { id: "l007", track_name: "Californication", artist: "Red Hot Chili Peppers", album: "Californication", album_cover: "https://cdn-images.dzcdn.net/images/cover/5e61e8290a4d1d64ca58920656c9602d/500x500-000000-80-0-0.jpg", moods: ["libre", "nostálgico"], moment_types: ["vacaciones"], youtubeId: "YlUKcNNmywk" },
  { id: "l008", track_name: "Wouldn't It Be Nice", artist: "The Beach Boys", album: "Pet Sounds", album_cover: "https://cdn-images.dzcdn.net/images/cover/ab113555b056cb808b050dff43a9590a/500x500-000000-80-0-0.jpg", moods: ["libre", "enamorado", "esperanzado"], moment_types: ["vacaciones"], youtubeId: "nZBKFoeDKJo" },
  { id: "l009", track_name: "Under The Bridge", artist: "Red Hot Chili Peppers", album: "Blood Sugar Sex Magik", album_cover: "https://cdn-images.dzcdn.net/images/cover/e3f1bee87b1d5d1313641762f375a3fb/500x500-000000-80-0-0.jpg", moods: ["libre", "reflexivo", "nostálgico"], moment_types: ["vacaciones", "tranquilo"], youtubeId: "GLvohMXgcBo" },
  { id: "l010", track_name: "Feel Good Inc.", artist: "Gorillaz", album: "Demon Days", album_cover: "https://cdn-images.dzcdn.net/images/cover/3dc29a565149240729afc08e1f251b46/500x500-000000-80-0-0.jpg", moods: ["libre", "relajado"], moment_types: ["fiesta", "vacaciones"], youtubeId: "HyHNuVaZJ-k" },
  
  // ============ MÁS CLÁSICOS Y MEMORABLES ============
  { id: "c001", track_name: "Stayin' Alive", artist: "Bee Gees", album: "Saturday Night Fever", album_cover: "https://cdn-images.dzcdn.net/images/cover/abf272cffad9fb2b1552421ac6fac9c2/500x500-000000-80-0-0.jpg", moods: ["feliz", "motivado"], moment_types: ["fiesta"], youtubeId: "fNFzfwLM72c" },
  { id: "c002", track_name: "Billie Jean", artist: "Michael Jackson", album: "Thriller", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/08/79/a1/0879a161-d2c0-8c90-58d2-1f0caef6b723/074643811224.jpg/300x300bb.jpg", moods: ["motivado", "nervioso"], moment_types: ["fiesta", "concierto"], youtubeId: "Zi_XLOBDo_Y" },
  { id: "c003", track_name: "Beat It", artist: "Michael Jackson", album: "Thriller", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/08/79/a1/0879a161-d2c0-8c90-58d2-1f0caef6b723/074643811224.jpg/300x300bb.jpg", moods: ["motivado", "nervioso"], moment_types: ["fiesta", "concierto"], youtubeId: "oRdxUFDoQe0" },
  { id: "c004", track_name: "Thriller", artist: "Michael Jackson", album: "Thriller", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/08/79/a1/0879a161-d2c0-8c90-58d2-1f0caef6b723/074643811224.jpg/300x300bb.jpg", moods: ["nervioso", "feliz"], moment_types: ["fiesta"], youtubeId: "sOnqjkJTMaA" },
  { id: "c005", track_name: "Dancing Queen", artist: "ABBA", album: "Arrival", album_cover: "https://cdn-images.dzcdn.net/images/cover/b8b70d474b7a8f27799e0d665e9b737e/500x500-000000-80-0-0.jpg", moods: ["feliz", "libre"], moment_types: ["fiesta"], youtubeId: "xFrGuyw1V8s" },
  { id: "c006", track_name: "Mamma Mia", artist: "ABBA", album: "ABBA", album_cover: "https://cdn-images.dzcdn.net/images/cover/b8b70d474b7a8f27799e0d665e9b737e/500x500-000000-80-0-0.jpg", moods: ["feliz", "nostálgico"], moment_types: ["fiesta"], youtubeId: "unfzfe8f9NI" },
  { id: "c007", track_name: "I Will Survive", artist: "Gloria Gaynor", album: "Love Tracks", album_cover: "https://cdn-images.dzcdn.net/images/cover/9087e3caed31dabf7d60cb07bb18354c/500x500-000000-80-0-0.jpg", moods: ["motivado", "libre"], moment_types: ["fiesta", "despedida"], youtubeId: "ARt9HV9T0w8" },
  { id: "c008", track_name: "Respect", artist: "Aretha Franklin", album: "I Never Loved a Man", album_cover: "https://cdn-images.dzcdn.net/images/cover/9e9ba9115d0fb62879d1bb672ee67c07/500x500-000000-80-0-0.jpg", moods: ["motivado", "libre"], moment_types: ["fiesta"], youtubeId: "6FOUqQt3Kg0" },
  { id: "c009", track_name: "Superstition", artist: "Stevie Wonder", album: "Talking Book", album_cover: "https://cdn-images.dzcdn.net/images/cover/dc11aaf0240dbaf1548639e1c5df8db8/500x500-000000-80-0-0.jpg", moods: ["feliz", "motivado"], moment_types: ["fiesta", "concierto"], youtubeId: "wDZFf0pm0SE" },
  { id: "c010", track_name: "Livin' on a Prayer", artist: "Bon Jovi", album: "Slippery When Wet", album_cover: "https://cdn-images.dzcdn.net/images/cover/1f0365311a9d03c267f175e0ef79f40c/500x500-000000-80-0-0.jpg", moods: ["motivado", "esperanzado"], moment_types: ["concierto", "fiesta"], youtubeId: "lDK9QqIzhwk" },
  { id: "c011", track_name: "Take On Me", artist: "a-ha", album: "Hunting High and Low", album_cover: "https://cdn-images.dzcdn.net/images/cover/e0ce8977ab98d73bcea00fc838ece034/500x500-000000-80-0-0.jpg", moods: ["feliz", "nostálgico"], moment_types: ["fiesta"], youtubeId: "djV11Xbc914" },
  { id: "c012", track_name: "Every Breath You Take", artist: "The Police", album: "Synchronicity", album_cover: "https://cdn-images.dzcdn.net/images/cover/316afdaed93c4a18cf730389648d03d6/500x500-000000-80-0-0.jpg", moods: ["enamorado", "nostálgico"], moment_types: ["noche"], youtubeId: "OMOGaugKpzs" },
  { id: "c013", track_name: "Africa", artist: "Toto", album: "Toto IV", album_cover: "https://cdn-images.dzcdn.net/images/cover/153332e88a14255a8c3d5959a5a21882/500x500-000000-80-0-0.jpg", moods: ["nostálgico", "libre"], moment_types: ["vacaciones"], youtubeId: "FTQbiNvZqaY" },
  { id: "c014", track_name: "September", artist: "Earth, Wind & Fire", album: "The Best of Earth, Wind & Fire", album_cover: "https://cdn-images.dzcdn.net/images/cover/18f41ecd3781fb96bffa2b0b49955db5/500x500-000000-80-0-0.jpg", moods: ["feliz", "motivado"], moment_types: ["fiesta"], youtubeId: "Gs069dndIYk" },
  { id: "c015", track_name: "Mr. Brightside", artist: "The Killers", album: "Hot Fuss", album_cover: "https://cdn-images.dzcdn.net/images/cover/ecff532dd84c6538099b58baefccb8fb/500x500-000000-80-0-0.jpg", moods: ["nervioso", "nostálgico"], moment_types: ["fiesta", "concierto"], youtubeId: "gGdGFtwCNBE" },
  { id: "c016", track_name: "Everlong", artist: "Foo Fighters", album: "The Colour and the Shape", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/68/f5/86/68f586ca-a375-9965-a864-9e227e77ef5b/884977570328.jpg/300x300bb.jpg", moods: ["nostálgico", "motivado"], moment_types: ["concierto"], youtubeId: "eBG7P-K-r1Y" },
  { id: "c017", track_name: "Learn to Fly", artist: "Foo Fighters", album: "There Is Nothing Left to Lose", album_cover: "https://cdn-images.dzcdn.net/images/cover/266f01f1c7a04843d11cd08f9c07d11f/500x500-000000-80-0-0.jpg", moods: ["motivado", "feliz"], moment_types: ["concierto"], youtubeId: "1VQ_3sBZEm0" },
  { id: "c018", track_name: "Best of You", artist: "Foo Fighters", album: "In Your Honor", album_cover: "https://cdn-images.dzcdn.net/images/cover/266f01f1c7a04843d11cd08f9c07d11f/500x500-000000-80-0-0.jpg", moods: ["motivado", "nervioso"], moment_types: ["concierto"], youtubeId: "h_L4Rixya64" },
  { id: "c019", track_name: "Fluorescent Adolescent", artist: "Arctic Monkeys", album: "Favourite Worst Nightmare", album_cover: "https://cdn-images.dzcdn.net/images/cover/d7a4f9f1af8736457de34f28d50ef496/500x500-000000-80-0-0.jpg", moods: ["nostálgico", "feliz"], moment_types: ["fiesta", "concierto"], youtubeId: "ma9I9VBKPiw" },
  { id: "c020", track_name: "R U Mine?", artist: "Arctic Monkeys", album: "AM", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/cc/0f/2d/cc0f2d02-5ff1-10e7-eea2-76863a55dbad/887828031795.png/300x300bb.jpg", moods: ["motivado", "nervioso"], moment_types: ["concierto"], youtubeId: "ngzC_8zqInk" },
  { id: "c021", track_name: "Hey Jude", artist: "The Beatles", album: "Hey Jude", album_cover: "https://cdn-images.dzcdn.net/images/cover/c65b3bd84e81056e060be144381c06c8/500x500-000000-80-0-0.jpg", moods: ["esperanzado", "nostálgico"], moment_types: ["concierto", "despedida"], youtubeId: "A_MjCqQoLLA" },
  { id: "c022", track_name: "One Love", artist: "Bob Marley & The Wailers", album: "Exodus", album_cover: "https://cdn-images.dzcdn.net/images/cover/c43e3b1d83e0107dfff7e4238096fe5b/500x500-000000-80-0-0.jpg", moods: ["enamorado", "relajado", "esperanzado"], moment_types: ["vacaciones"], youtubeId: "vdB-8eLEW8g" },
  { id: "c023", track_name: "Shape of You", artist: "Ed Sheeran", album: "÷", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/15/e6/e8/15e6e8a4-4190-6a8b-86c3-ab4a51b88288/190295851286.jpg/300x300bb.jpg", moods: ["enamorado", "feliz"], moment_types: ["fiesta"], youtubeId: "JGwWNGJdvx8" },
  { id: "c024", track_name: "Feel So Close", artist: "Calvin Harris", album: "18 Months", album_cover: "https://cdn-images.dzcdn.net/images/cover/d45400b10f16a8433f85b5ddef3bfafb/500x500-000000-80-0-0.jpg", moods: ["feliz", "enamorado"], moment_types: ["fiesta"], youtubeId: "dGghkjpNCQ8" },
  { id: "c025", track_name: "This Is What You Came For", artist: "Calvin Harris", album: "Single", album_cover: "https://cdn-images.dzcdn.net/images/cover/b8af7ff13a47e2775307299843da9b36/500x500-000000-80-0-0.jpg", moods: ["motivado", "feliz"], moment_types: ["fiesta"], youtubeId: "kOkQ4T5WO9E" },
  { id: "c026", track_name: "Don't Start Now", artist: "Dua Lipa", album: "Future Nostalgia", album_cover: "https://cdn-images.dzcdn.net/images/cover/f8364f090ba04f1b19b381ec0390f3e4/500x500-000000-80-0-0.jpg", moods: ["motivado", "libre"], moment_types: ["fiesta"], youtubeId: "oygrmJFKYZY" },
  { id: "c027", track_name: "Waka Waka", artist: "Shakira", album: "Sale el Sol", album_cover: "https://cdn-images.dzcdn.net/images/cover/f32ed89fa129b1da7e2b5bb6cdec6980/500x500-000000-80-0-0.jpg", moods: ["feliz", "motivado"], moment_types: ["fiesta", "evento"], youtubeId: "pRpeEdMmmQ0" },
  { id: "c028", track_name: "Whenever, Wherever", artist: "Shakira", album: "Laundry Service", album_cover: "https://cdn-images.dzcdn.net/images/cover/3c50690401eed099df05e72f5080af1b/500x500-000000-80-0-0.jpg", moods: ["feliz", "enamorado"], moment_types: ["fiesta", "vacaciones"], youtubeId: "weRHyjj34ZE" },
  { id: "c029", track_name: "Rojo", artist: "J Balvin", album: "Colores", album_cover: "https://cdn-images.dzcdn.net/images/cover/e0caa0f2460297d66b1133ae3e833c49/500x500-000000-80-0-0.jpg", moods: ["enamorado", "motivado"], moment_types: ["fiesta"], youtubeId: "glPOc-WW8rI" },
  { id: "c030", track_name: "Ay Vamos", artist: "J Balvin", album: "Energía", album_cover: "https://cdn-images.dzcdn.net/images/cover/989999970efbd01232b370df921710d9/500x500-000000-80-0-0.jpg", moods: ["feliz", "motivado"], moment_types: ["fiesta", "vacaciones"], youtubeId: "hr4knvNNgtU" },
  { id: "c031", track_name: "La Fama", artist: "Rosalía", album: "Motomami", album_cover: "https://cdn-images.dzcdn.net/images/cover/66ae12120936d9660d3e30a7db7627b8/500x500-000000-80-0-0.jpg", moods: ["motivado", "nervioso"], moment_types: ["fiesta"], youtubeId: "KD0rLh6vV3I" },
  { id: "c032", track_name: "Someday", artist: "The Strokes", album: "Is This It", album_cover: "https://cdn-images.dzcdn.net/images/cover/700f0375d5ac8570f16a2c7eb128303f/500x500-000000-80-0-0.jpg", moods: ["nostálgico", "motivado"], moment_types: ["concierto"], youtubeId: "knU9gRUWCno" },
  { id: "c033", track_name: "Last Nite", artist: "The Strokes", album: "Is This It", album_cover: "https://cdn-images.dzcdn.net/images/cover/700f0375d5ac8570f16a2c7eb128303f/500x500-000000-80-0-0.jpg", moods: ["motivado", "relajado"], moment_types: ["concierto", "fiesta"], youtubeId: "TOypSnKFHrE" },
  { id: "c034", track_name: "Reptilia", artist: "The Strokes", album: "Room on Fire", album_cover: "https://cdn-images.dzcdn.net/images/cover/3d1246b483aefa9bd0bcd07dfc926be8/500x500-000000-80-0-0.jpg", moods: ["motivado", "nervioso"], moment_types: ["concierto"], youtubeId: "b8-tXG8KrWs" },
  { id: "c035", track_name: "Borderline", artist: "Tame Impala", album: "The Slow Rush", album_cover: "https://cdn-images.dzcdn.net/images/cover/d8eb61bd4becf79a602a75b69eebde7d/500x500-000000-80-0-0.jpg", moods: ["nostálgico", "motivado"], moment_types: ["fiesta"], youtubeId: "2g5xkLqIElU" },
  { id: "c036", track_name: "Tokyo Drifting", artist: "Glass Animals", album: "Dreamland", album_cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/da/8b/77/da8b7731-6f4f-eacf-5e74-8b23389eefa1/20UMGIM03371.rgb.jpg/300x300bb.jpg", moods: ["motivado", "libre"], moment_types: ["fiesta"], youtubeId: "ijw4fa75WQ0" },

  // ============ LATAM, INDIE Y POP PARA LANZAMIENTO ============
  { id: "mx001", track_name: "Soñé", artist: "Zoé", album: "Rocanlover", album_cover: "", moods: ["nostálgico", "enamorado", "reflexivo"], moment_types: ["noche", "concierto"], genres: ["rock", "indie"] },
  { id: "mx002", track_name: "Labios Rotos", artist: "Zoé", album: "Música de Fondo", album_cover: "", moods: ["enamorado", "nostálgico"], moment_types: ["noche", "concierto"], genres: ["rock", "indie"] },
  { id: "mx003", track_name: "No Dejes Que...", artist: "Caifanes", album: "El Silencio", album_cover: "", moods: ["nostálgico", "motivado"], moment_types: ["concierto", "noche"], genres: ["rock"] },
  { id: "mx004", track_name: "Afuera", artist: "Caifanes", album: "El Nervio del Volcán", album_cover: "", moods: ["libre", "motivado", "nostálgico"], moment_types: ["concierto"], genres: ["rock"] },
  { id: "mx005", track_name: "De Música Ligera", artist: "Soda Stereo", album: "Canción Animal", album_cover: "", moods: ["motivado", "nostálgico"], moment_types: ["concierto", "fiesta"], genres: ["rock"] },
  { id: "mx006", track_name: "Persiana Americana", artist: "Soda Stereo", album: "Signos", album_cover: "", moods: ["nervioso", "motivado"], moment_types: ["noche", "concierto"], genres: ["rock"] },
  { id: "mx007", track_name: "Día de Enero", artist: "Shakira", album: "Fijación Oral, Vol. 1", album_cover: "", moods: ["enamorado", "relajado"], moment_types: ["noche", "tranquilo"], genres: ["pop"] },
  { id: "mx008", track_name: "Antología", artist: "Shakira", album: "Pies Descalzos", album_cover: "", moods: ["enamorado", "nostálgico"], moment_types: ["despedida", "noche"], genres: ["pop"] },
  { id: "mx009", track_name: "Hasta la Raíz", artist: "Natalia Lafourcade", album: "Hasta la Raíz", album_cover: "", moods: ["nostálgico", "reflexivo", "esperanzado"], moment_types: ["tranquilo", "despedida"], genres: ["folk", "pop"] },
  { id: "mx010", track_name: "Tú Sí Sabes Quererme", artist: "Natalia Lafourcade", album: "Musas", album_cover: "", moods: ["enamorado", "feliz", "relajado"], moment_types: ["tranquilo", "noche"], genres: ["folk", "pop"] },
  { id: "mx011", track_name: "Ahora Te Puedes Marchar", artist: "Luis Miguel", album: "Soy Como Quiero Ser", album_cover: "", moods: ["libre", "feliz", "nostálgico"], moment_types: ["fiesta", "despedida"], genres: ["pop"] },
  { id: "mx012", track_name: "La Incondicional", artist: "Luis Miguel", album: "Busca Una Mujer", album_cover: "", moods: ["enamorado", "nostálgico"], moment_types: ["noche"], genres: ["pop"] },
  { id: "mx013", track_name: "Querida", artist: "Juan Gabriel", album: "Recuerdos II", album_cover: "", moods: ["enamorado", "triste", "nostálgico"], moment_types: ["despedida", "concierto"], genres: ["pop"] },
  { id: "mx014", track_name: "Amor Eterno", artist: "Juan Gabriel", album: "Recuerdos", album_cover: "", moods: ["triste", "nostálgico", "reflexivo"], moment_types: ["despedida"], genres: ["pop"] },
  { id: "mx015", track_name: "Nunca Es Suficiente", artist: "Los Ángeles Azules & Natalia Lafourcade", album: "De Plaza en Plaza", album_cover: "", moods: ["enamorado", "nostálgico", "feliz"], moment_types: ["fiesta", "noche"], genres: ["cumbia", "pop"] },
  { id: "mx016", track_name: "El Listón de Tu Pelo", artist: "Los Ángeles Azules", album: "Inolvidables", album_cover: "", moods: ["feliz", "enamorado"], moment_types: ["fiesta"], genres: ["cumbia"] },
  { id: "mx017", track_name: "Eres", artist: "Café Tacvba", album: "Cuatro Caminos", album_cover: "", moods: ["enamorado", "nostálgico"], moment_types: ["noche", "tranquilo"], genres: ["rock", "indie"] },
  { id: "mx018", track_name: "Quiero Ver", artist: "Café Tacvba", album: "Sino", album_cover: "", moods: ["feliz", "enamorado"], moment_types: ["tranquilo", "fiesta"], genres: ["rock", "indie"] },
  { id: "mx019", track_name: "Lucha de Gigantes", artist: "Nacha Pop", album: "El Momento", album_cover: "", moods: ["reflexivo", "nostálgico", "triste"], moment_types: ["noche", "despedida"], genres: ["rock"] },
  { id: "mx020", track_name: "Rayando el Sol", artist: "Maná", album: "Falta Amor", album_cover: "", moods: ["enamorado", "nostálgico"], moment_types: ["concierto", "despedida"], genres: ["rock", "pop"] },
  { id: "mx021", track_name: "Sweet Disposition", artist: "The Temper Trap", album: "Conditions", album_cover: "", moods: ["libre", "esperanzado", "nostálgico"], moment_types: ["vacaciones", "concierto"], genres: ["indie"] },
  { id: "mx022", track_name: "Dog Days Are Over", artist: "Florence + The Machine", album: "Lungs", album_cover: "", moods: ["libre", "feliz", "motivado"], moment_types: ["concierto", "evento"], genres: ["indie", "pop"] },
  { id: "mx023", track_name: "Somewhere Only We Know", artist: "Keane", album: "Hopes and Fears", album_cover: "", moods: ["nostálgico", "esperanzado"], moment_types: ["despedida", "tranquilo"], genres: ["pop", "rock"] },
  { id: "mx024", track_name: "Young Folks", artist: "Peter Bjorn and John", album: "Writer's Block", album_cover: "", moods: ["feliz", "relajado", "nostálgico"], moment_types: ["fiesta", "vacaciones"], genres: ["indie"] },
  { id: "mx025", track_name: "Home", artist: "Edward Sharpe & The Magnetic Zeros", album: "Up From Below", album_cover: "", moods: ["feliz", "enamorado", "libre"], moment_types: ["vacaciones", "evento"], genres: ["folk", "indie"] },
  { id: "mx026", track_name: "Pink + White", artist: "Frank Ocean", album: "Blonde", album_cover: "", moods: ["relajado", "nostálgico", "enamorado"], moment_types: ["noche", "tranquilo"], genres: ["r&b"] },
  { id: "mx027", track_name: "telepatía", artist: "Kali Uchis", album: "Sin Miedo", album_cover: "", moods: ["enamorado", "relajado"], moment_types: ["noche", "vacaciones"], genres: ["r&b", "pop"] },
  { id: "mx028", track_name: "After the Storm", artist: "Kali Uchis", album: "Isolation", album_cover: "", moods: ["esperanzado", "relajado", "feliz"], moment_types: ["tranquilo", "vacaciones"], genres: ["r&b", "pop"] },
  { id: "mx029", track_name: "Safaera", artist: "Bad Bunny", album: "YHLQMDLG", album_cover: "", moods: ["feliz", "motivado", "libre"], moment_types: ["fiesta"], genres: ["reggaeton"] },
  { id: "mx030", track_name: "Ojitos Lindos", artist: "Bad Bunny & Bomba Estéreo", album: "Un Verano Sin Ti", album_cover: "", moods: ["enamorado", "relajado", "feliz"], moment_types: ["vacaciones", "noche"], genres: ["reggaeton", "pop"] },
  { id: "mx031", track_name: "Ella Baila Sola", artist: "Eslabon Armado & Peso Pluma", album: "Desvelado", album_cover: "", moods: ["feliz", "motivado"], moment_types: ["fiesta"], genres: ["regional"] },
  { id: "mx032", track_name: "PRC", artist: "Peso Pluma & Natanael Cano", album: "Génesis", album_cover: "", moods: ["motivado", "libre"], moment_types: ["fiesta", "noche"], genres: ["regional"] },
  { id: "mx033", track_name: "Lady Mi Amor", artist: "Tornillo", album: "Lady Mi Amor", album_cover: "", moods: ["enamorado", "relajado"], moment_types: ["noche"], genres: ["rap", "regional"] },
  { id: "mx034", track_name: "Amor Tumbado", artist: "Natanael Cano", album: "Todo Es Diferente", album_cover: "", moods: ["enamorado", "nostálgico"], moment_types: ["noche", "despedida"], genres: ["regional"] },
  { id: "mx035", track_name: "300 Noches", artist: "Belinda & Natanael Cano", album: "300 Noches", album_cover: "", moods: ["enamorado", "nostálgico"], moment_types: ["noche"], genres: ["regional", "pop"] },
  { id: "mx036", track_name: "Fin de Semana", artist: "Junior H & Oscar Maydon", album: "Fin de Semana", album_cover: "", moods: ["feliz", "motivado", "libre"], moment_types: ["fiesta", "noche"], genres: ["regional"] },
  { id: "mx037", track_name: "TQM", artist: "Fuerza Regida", album: "Pa Las Baby's y Belikeada", album_cover: "", moods: ["motivado", "libre"], moment_types: ["fiesta"], genres: ["regional"] },
  { id: "mx038", track_name: "Dákiti", artist: "Bad Bunny & Jhay Cortez", album: "El Último Tour del Mundo", album_cover: "", moods: ["enamorado", "nervioso", "relajado"], moment_types: ["noche", "fiesta"], genres: ["reggaeton"] },
  { id: "mx039", track_name: "LALA", artist: "Myke Towers", album: "LALA", album_cover: "", moods: ["feliz", "motivado"], moment_types: ["fiesta"], genres: ["reggaeton"] },
  { id: "mx040", track_name: "Classy 101", artist: "Feid & Young Miko", album: "Classy 101", album_cover: "", moods: ["motivado", "nervioso"], moment_types: ["fiesta", "noche"], genres: ["reggaeton", "rap"] },
  { id: "mx041", track_name: "BZRP Music Sessions, Vol. 52", artist: "Bizarrap & Quevedo", album: "BZRP Music Sessions", album_cover: "", moods: ["feliz", "motivado", "libre"], moment_types: ["fiesta"], genres: ["pop", "electronic"] },
  { id: "mx042", track_name: "Mamiii", artist: "Becky G & Karol G", album: "Mamiii", album_cover: "", moods: ["libre", "motivado"], moment_types: ["fiesta", "despedida"], genres: ["reggaeton", "pop"] },
  { id: "mx043", track_name: "Despechá", artist: "Rosalía", album: "Despechá", album_cover: "", moods: ["libre", "feliz"], moment_types: ["fiesta", "vacaciones"], genres: ["pop"] },
  { id: "mx044", track_name: "La Bachata", artist: "Manuel Turizo", album: "2000", album_cover: "", moods: ["enamorado", "nostálgico"], moment_types: ["noche", "fiesta"], genres: ["bachata", "pop"] },
  { id: "mx045", track_name: "Propuesta Indecente", artist: "Romeo Santos", album: "Formula, Vol. 2", album_cover: "", moods: ["enamorado", "nervioso"], moment_types: ["noche", "fiesta"], genres: ["bachata"] },
  { id: "mx046", track_name: "Bachata en Fukuoka", artist: "Juan Luis Guerra", album: "A Son de Guerra", album_cover: "", moods: ["feliz", "enamorado", "relajado"], moment_types: ["vacaciones", "fiesta"], genres: ["bachata"] },
  { id: "mx047", track_name: "Suavemente", artist: "Elvis Crespo", album: "Suavemente", album_cover: "", moods: ["feliz", "motivado"], moment_types: ["fiesta"], genres: ["merengue"] },
  { id: "mx048", track_name: "La Bilirrubina", artist: "Juan Luis Guerra 4.40", album: "Bachata Rosa", album_cover: "", moods: ["feliz", "enamorado"], moment_types: ["fiesta"], genres: ["merengue"] },
  { id: "mx049", track_name: "Vivir Mi Vida", artist: "Marc Anthony", album: "3.0", album_cover: "", moods: ["feliz", "motivado", "libre"], moment_types: ["fiesta", "evento"], genres: ["salsa"] },
  { id: "mx050", track_name: "Llorarás", artist: "Oscar D'León", album: "Con Bajo y Todo", album_cover: "", moods: ["libre", "nostálgico"], moment_types: ["fiesta", "despedida"], genres: ["salsa"] },
  { id: "mx051", track_name: "Periódico de Ayer", artist: "Héctor Lavoe", album: "De Ti Depende", album_cover: "", moods: ["nostálgico", "triste"], moment_types: ["despedida", "fiesta"], genres: ["salsa"] },
  { id: "mx052", track_name: "Rebelión", artist: "Joe Arroyo", album: "Rebelión", album_cover: "", moods: ["motivado", "libre"], moment_types: ["fiesta"], genres: ["salsa"] },
  { id: "mx053", track_name: "Chan Chan", artist: "Buena Vista Social Club", album: "Buena Vista Social Club", album_cover: "", moods: ["nostálgico", "relajado"], moment_types: ["tranquilo", "vacaciones"], genres: ["latin"] },
  { id: "mx054", track_name: "Eres para Mí", artist: "Julieta Venegas & Ana Tijoux", album: "Limón y Sal", album_cover: "", moods: ["enamorado", "feliz"], moment_types: ["fiesta", "noche"], genres: ["pop", "rap"] },
  { id: "mx055", track_name: "A Dios Le Pido", artist: "Juanes", album: "Un Día Normal", album_cover: "", moods: ["esperanzado", "feliz"], moment_types: ["evento", "concierto"], genres: ["rock", "pop"] },
  { id: "mx056", track_name: "Flaca", artist: "Andrés Calamaro", album: "Alta Suciedad", album_cover: "", moods: ["enamorado", "nostálgico"], moment_types: ["noche"], genres: ["rock"] },
  { id: "mx057", track_name: "La Flaca", artist: "Jarabe de Palo", album: "La Flaca", album_cover: "", moods: ["enamorado", "feliz"], moment_types: ["vacaciones", "fiesta"], genres: ["rock", "latin"] },
  { id: "mx058", track_name: "Ya No Sé Qué Hacer Conmigo", artist: "El Cuarteto de Nos", album: "Raro", album_cover: "", moods: ["nervioso", "reflexivo", "libre"], moment_types: ["concierto", "noche"], genres: ["rock", "latin"] },
  { id: "mx059", track_name: "El Mató a un Policía Motorizado", artist: "El Mató a un Policía Motorizado", album: "La Dinastía Scorpio", album_cover: "", moods: ["nostálgico", "relajado", "reflexivo"], moment_types: ["concierto", "noche"], genres: ["indie", "rock", "latin"] },
  { id: "mx060", track_name: "Moscow Mule", artist: "Bad Bunny", album: "Un Verano Sin Ti", album_cover: "", moods: ["feliz", "relajado", "libre"], moment_types: ["vacaciones", "fiesta"], genres: ["reggaeton", "latin"] },
  { id: "mx061", track_name: "Argentina", artist: "Trueno, Nathy Peluso", album: "Argentina", album_cover: "", moods: ["motivado", "rapero", "libre"], moment_types: ["fiesta", "concierto"], genres: ["rap", "latin"] },
];

const moodEnergy: Record<string, number> = {
  triste: 3,
  relajado: 4,
  reflexivo: 4,
  nostálgico: 4,
  enamorado: 5,
  esperanzado: 6,
  feliz: 7,
  libre: 7,
  rapero: 8,
  motivado: 8,
  nervioso: 8,
};

const momentScenes: Record<string, string[]> = {
  vacaciones: ["beach", "nature", "road"],
  tranquilo: ["cafe", "indoor", "nature"],
  noche: ["night", "city", "indoor"],
  fiesta: ["party", "night", "city"],
  concierto: ["concert", "night"],
  despedida: ["sunset", "road", "indoor"],
  evento: ["party", "city"],
  inspiracion: ["cafe", "nature"],
};

const genreByArtistHints: Array<[string, string[]]> = [
  ["bad bunny", ["reggaeton", "latin"]],
  ["peso pluma", ["regional", "latin"]],
  ["natanael", ["regional", "latin"]],
  ["junior h", ["regional", "latin"]],
  ["fuerza regida", ["regional", "latin"]],
  ["romeo santos", ["bachata", "latin"]],
  ["juan luis guerra", ["bachata", "merengue", "latin"]],
  ["marc anthony", ["salsa", "latin"]],
  ["lavoe", ["salsa", "latin"]],
  ["zoé", ["rock", "indie", "latin"]],
  ["caifanes", ["rock", "latin"]],
  ["soda stereo", ["rock", "latin"]],
  ["café tacvba", ["rock", "indie", "latin"]],
  ["frank ocean", ["r&b"]],
  ["sza", ["r&b"]],
  ["kali uchis", ["r&b", "pop", "latin"]],
  ["tyler", ["rap", "r&b"]],
  ["drake", ["rap", "r&b"]],
  ["kendrick", ["rap"]],
  ["daft punk", ["electronic", "pop"]],
  ["tame impala", ["indie", "rock"]],
  ["arctic monkeys", ["rock", "indie"]],
];

function inferGenres(track: TrackData) {
  if (track.genres?.length) return track.genres;
  const artist = track.artist.toLowerCase();
  const hit = genreByArtistHints.find(([needle]) => artist.includes(needle));
  if (hit) return hit[1];
  if (track.moods.includes("rapero")) return ["rap"];
  if (track.moment_types?.includes("concierto")) return ["rock", "pop"];
  if (track.moment_types?.includes("fiesta")) return ["pop", "dance"];
  return ["pop"];
}

function inferEnergy(track: TrackData) {
  if (track.energy) return track.energy;
  const values = track.moods.map((mood) => moodEnergy[mood]).filter(Boolean);
  const average = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 5;
  return Math.max(1, Math.min(10, Math.round(average)));
}

function inferScenes(track: TrackData) {
  if (track.visualScenes?.length) return track.visualScenes;
  const scenes = new Set<string>();
  track.moment_types?.forEach((moment) => momentScenes[moment]?.forEach((scene) => scenes.add(scene)));
  if (!scenes.size) scenes.add(track.moods.includes("relajado") ? "cafe" : "city");
  return Array.from(scenes).slice(0, 4);
}

function inferColorVibes(track: TrackData) {
  if (track.colorVibes?.length) return track.colorVibes;
  const vibes = new Set<string>();
  if (track.moods.some((mood) => ["feliz", "motivado", "libre"].includes(mood))) vibes.add("vibrant");
  if (track.moods.some((mood) => ["nostálgico", "enamorado", "esperanzado"].includes(mood))) vibes.add("golden");
  if (track.moods.some((mood) => ["triste", "reflexivo", "relajado"].includes(mood))) vibes.add("muted");
  if (track.moment_types?.includes("noche")) vibes.add("cool");
  if (!vibes.size) vibes.add("warm");
  return Array.from(vibes);
}

export const TRACK_CATALOG: TrackData[] = RAW_TRACK_CATALOG.map((track) => ({
  ...track,
  genres: inferGenres(track),
  energy: inferEnergy(track),
  visualScenes: inferScenes(track),
  colorVibes: inferColorVibes(track),
}));

// Artistas únicos para autocompletar
export const ARTISTS = Array.from(new Set(TRACK_CATALOG.map(t => t.artist))).sort();

// Canciones únicas para autocompletar
export const SONGS = TRACK_CATALOG.map(t => ({
  value: t.id,
  label: `${t.track_name} - ${t.artist}`,
  track_name: t.track_name,
  artist: t.artist,
})).sort((a, b) => a.label.localeCompare(b.label));
