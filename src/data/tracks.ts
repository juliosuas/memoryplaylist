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
}

// Catálogo ampliado de canciones con moods que coinciden con el formulario
export const TRACK_CATALOG: TrackData[] = [
  // ============ ENAMORADO ============
  { id: "e001", track_name: "Perfect", artist: "Ed Sheeran", album: "÷", album_cover: "https://picsum.photos/seed/es2/300/300", moods: ["enamorado", "feliz"], moment_types: ["noche", "evento"], youtubeId: "2Vv-BfVoq4g" },
  { id: "e002", track_name: "All of Me", artist: "John Legend", album: "Love in the Future", album_cover: "https://picsum.photos/seed/jl1/300/300", moods: ["enamorado", "reflexivo"], moment_types: ["noche"], youtubeId: "450p7goxZqg" },
  { id: "e003", track_name: "Thinking Out Loud", artist: "Ed Sheeran", album: "x", album_cover: "https://picsum.photos/seed/es3/300/300", moods: ["enamorado", "relajado"], moment_types: ["noche", "evento"], youtubeId: "lp-EO5I60KA" },
  { id: "e004", track_name: "Can't Help Falling in Love", artist: "Elvis Presley", album: "Blue Hawaii", album_cover: "https://picsum.photos/seed/ep1/300/300", moods: ["enamorado", "nostálgico"], moment_types: ["noche", "despedida"], youtubeId: "vGJTaP6anOU" },
  { id: "e005", track_name: "A Thousand Years", artist: "Christina Perri", album: "The Twilight Saga", album_cover: "https://picsum.photos/seed/cp4/300/300", moods: ["enamorado", "esperanzado"], moment_types: ["noche", "evento"], youtubeId: "rtOvBOTyX00" },
  { id: "e006", track_name: "Yellow", artist: "Coldplay", album: "Parachutes", album_cover: "https://picsum.photos/seed/cp1/300/300", moods: ["enamorado", "nostálgico"], moment_types: ["noche", "concierto"], youtubeId: "yKNxeF4KMsY" },
  { id: "e007", track_name: "Just The Way You Are", artist: "Bruno Mars", album: "Doo-Wops & Hooligans", album_cover: "https://picsum.photos/seed/brm2/300/300", moods: ["enamorado", "feliz"], moment_types: ["fiesta", "noche"], youtubeId: "LjhCEhWiKXk" },
  { id: "e008", track_name: "Love Story", artist: "Taylor Swift", album: "Fearless", album_cover: "https://picsum.photos/seed/ts3/300/300", moods: ["enamorado", "feliz", "esperanzado"], moment_types: ["noche"], youtubeId: "8xg3vE8Ie_E" },
  { id: "e009", track_name: "Unchained Melody", artist: "The Righteous Brothers", album: "Unchained Melody", album_cover: "https://picsum.photos/seed/rb1/300/300", moods: ["enamorado", "nostálgico"], moment_types: ["noche"], youtubeId: "qiiyq2xrSI0" },
  { id: "e010", track_name: "My Kind of Woman", artist: "Mac DeMarco", album: "2", album_cover: "https://picsum.photos/seed/md5/300/300", moods: ["enamorado", "relajado"], moment_types: ["tranquilo", "noche"], youtubeId: "wIuBcb2T55Q" },
  { id: "e011", track_name: "Me Porto Bonito", artist: "Bad Bunny", album: "Un Verano Sin Ti", album_cover: "https://picsum.photos/seed/bb4/300/300", moods: ["enamorado", "feliz"], moment_types: ["fiesta", "vacaciones"], youtubeId: "saGYMhApaH8" },
  { id: "e012", track_name: "Cuando Te Besé", artist: "Becky G & Paulo Londra", album: "Cuando Te Besé", album_cover: "https://picsum.photos/seed/bg1/300/300", moods: ["enamorado", "feliz"], moment_types: ["fiesta"], youtubeId: "kH4KMb4HVSo" },
  { id: "e013", track_name: "EARFQUAKE", artist: "Tyler, The Creator", album: "IGOR", album_cover: "https://picsum.photos/seed/ttc2/300/300", moods: ["enamorado", "nervioso"], moment_types: ["noche"], youtubeId: "HmAsUQEFYGI" },
  { id: "e014", track_name: "Sweet Child O' Mine", artist: "Guns N' Roses", album: "Appetite for Destruction", album_cover: "https://picsum.photos/seed/gnr1/300/300", moods: ["enamorado", "motivado"], moment_types: ["concierto"], youtubeId: "1w7OgIMMRc4" },
  { id: "e015", track_name: "Somebody To Love", artist: "Queen", album: "A Day at the Races", album_cover: "https://picsum.photos/seed/q3/300/300", moods: ["enamorado", "motivado"], moment_types: ["concierto"], youtubeId: "kijpcUv-b8M" },
  
  // ============ NOSTÁLGICO ============
  { id: "n001", track_name: "The Night We Met", artist: "Lord Huron", album: "Strange Trails", album_cover: "https://picsum.photos/seed/lh1/300/300", moods: ["nostálgico", "triste"], moment_types: ["despedida", "tranquilo"], youtubeId: "KtlgYxa6BMU" },
  { id: "n002", track_name: "Yesterday", artist: "The Beatles", album: "Help!", album_cover: "https://picsum.photos/seed/tb4/300/300", moods: ["nostálgico", "triste", "reflexivo"], moment_types: ["tranquilo", "despedida"], youtubeId: "wXTJBr9tt8Q" },
  { id: "n003", track_name: "Wonderwall", artist: "Oasis", album: "(What's the Story) Morning Glory?", album_cover: "https://picsum.photos/seed/oa1/300/300", moods: ["nostálgico", "esperanzado"], moment_types: ["concierto", "fiesta"], youtubeId: "bx1Bh8ZvH84" },
  { id: "n004", track_name: "Dreams", artist: "Fleetwood Mac", album: "Rumours", album_cover: "https://picsum.photos/seed/fm1/300/300", moods: ["nostálgico", "relajado"], moment_types: ["tranquilo", "vacaciones"], youtubeId: "mrZRURcb1cM" },
  { id: "n005", track_name: "Hotel California", artist: "Eagles", album: "Hotel California", album_cover: "https://picsum.photos/seed/e1/300/300", moods: ["nostálgico", "reflexivo"], moment_types: ["vacaciones", "noche"], youtubeId: "09839DpTctU" },
  { id: "n006", track_name: "Heat Waves", artist: "Glass Animals", album: "Dreamland", album_cover: "https://picsum.photos/seed/ga1/300/300", moods: ["nostálgico", "relajado"], moment_types: ["vacaciones", "noche"], youtubeId: "mRD0-GxqHVo" },
  { id: "n007", track_name: "Do I Wanna Know?", artist: "Arctic Monkeys", album: "AM", album_cover: "https://picsum.photos/seed/am1/300/300", moods: ["nostálgico", "relajado"], moment_types: ["noche"], youtubeId: "bpOSxM0rNPM" },
  { id: "n008", track_name: "Photograph", artist: "Ed Sheeran", album: "x", album_cover: "https://picsum.photos/seed/es4/300/300", moods: ["nostálgico", "enamorado"], moment_types: ["evento", "despedida"], youtubeId: "nSDgHBxUbVQ" },
  { id: "n009", track_name: "Karma Police", artist: "Radiohead", album: "OK Computer", album_cover: "https://picsum.photos/seed/rh2/300/300", moods: ["nostálgico", "reflexivo"], moment_types: ["tranquilo"], youtubeId: "1uYWYWPc9HU" },
  { id: "n010", track_name: "Let It Be", artist: "The Beatles", album: "Let It Be", album_cover: "https://picsum.photos/seed/tb2/300/300", moods: ["nostálgico", "relajado", "esperanzado"], moment_types: ["despedida", "tranquilo"], youtubeId: "QDYfEBY9NM4" },
  { id: "n011", track_name: "Blinding Lights", artist: "The Weeknd", album: "After Hours", album_cover: "https://picsum.photos/seed/tw1/300/300", moods: ["nostálgico", "motivado"], moment_types: ["fiesta", "noche"], youtubeId: "4NRXx6U8ABQ" },
  { id: "n012", track_name: "Instant Crush", artist: "Daft Punk", album: "Random Access Memories", album_cover: "https://picsum.photos/seed/dp3/300/300", moods: ["nostálgico", "enamorado"], moment_types: ["noche"], youtubeId: "a5uQMwRMHcs" },
  { id: "n013", track_name: "See You Again", artist: "Tyler, The Creator", album: "Flower Boy", album_cover: "https://picsum.photos/seed/ttc1/300/300", moods: ["nostálgico", "relajado"], moment_types: ["tranquilo"], youtubeId: "Fb_nJVkEGX4" },
  { id: "n014", track_name: "Summertime Sadness", artist: "Lana Del Rey", album: "Born To Die", album_cover: "https://picsum.photos/seed/ldr1/300/300", moods: ["nostálgico", "triste"], moment_types: ["vacaciones", "despedida"], youtubeId: "TdrL3QxjyVw" },
  { id: "n015", track_name: "November Rain", artist: "Guns N' Roses", album: "Use Your Illusion I", album_cover: "https://picsum.photos/seed/gnr2/300/300", moods: ["nostálgico", "reflexivo"], moment_types: ["despedida"], youtubeId: "8SbUC-UaAxE" },
  { id: "n016", track_name: "The Less I Know The Better", artist: "Tame Impala", album: "Currents", album_cover: "https://picsum.photos/seed/ti1/300/300", moods: ["nostálgico", "relajado"], moment_types: ["noche"], youtubeId: "sBzrzS1Ag_g" },
  { id: "n017", track_name: "Callaita", artist: "Bad Bunny", album: "X 100PRE", album_cover: "https://picsum.photos/seed/bb6/300/300", moods: ["nostálgico", "relajado"], moment_types: ["vacaciones", "noche"], youtubeId: "RgULjdsjiLQ" },
  
  // ============ FELIZ ============
  { id: "f001", track_name: "Happy", artist: "Pharrell Williams", album: "G I R L", album_cover: "https://picsum.photos/seed/pw1/300/300", moods: ["feliz", "motivado"], moment_types: ["fiesta", "vacaciones"], youtubeId: "ZbZSe6N_BXs" },
  { id: "f002", track_name: "Here Comes The Sun", artist: "The Beatles", album: "Abbey Road", album_cover: "https://picsum.photos/seed/tb1/300/300", moods: ["feliz", "esperanzado", "relajado"], moment_types: ["vacaciones", "tranquilo"], youtubeId: "KQetemT1sWc" },
  { id: "f003", track_name: "Don't Stop Me Now", artist: "Queen", album: "Jazz", album_cover: "https://picsum.photos/seed/q2/300/300", moods: ["feliz", "motivado", "libre"], moment_types: ["fiesta", "concierto"], youtubeId: "HgzGwKwLmgM" },
  { id: "f004", track_name: "Uptown Funk", artist: "Bruno Mars", album: "Uptown Special", album_cover: "https://picsum.photos/seed/brm1/300/300", moods: ["feliz", "motivado"], moment_types: ["fiesta"], youtubeId: "OPf0YbXqDm0" },
  { id: "f005", track_name: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", album_cover: "https://picsum.photos/seed/dl1/300/300", moods: ["feliz", "motivado"], moment_types: ["fiesta"], youtubeId: "TUVcZfQe-Kw" },
  { id: "f006", track_name: "Shake It Off", artist: "Taylor Swift", album: "1989", album_cover: "https://picsum.photos/seed/ts1/300/300", moods: ["feliz", "motivado"], moment_types: ["fiesta"], youtubeId: "nfWlot6h_JM" },
  { id: "f007", track_name: "Good Vibrations", artist: "The Beach Boys", album: "Smiley Smile", album_cover: "https://picsum.photos/seed/bb1/300/300", moods: ["feliz", "relajado"], moment_types: ["vacaciones"], youtubeId: "Eab_beh07HU" },
  { id: "f008", track_name: "Walking on Sunshine", artist: "Katrina & The Waves", album: "Walking on Sunshine", album_cover: "https://picsum.photos/seed/kw1/300/300", moods: ["feliz", "motivado", "libre"], moment_types: ["vacaciones"], youtubeId: "iPUmE-tne5U" },
  { id: "f009", track_name: "24K Magic", artist: "Bruno Mars", album: "24K Magic", album_cover: "https://picsum.photos/seed/brm3/300/300", moods: ["feliz", "motivado"], moment_types: ["fiesta", "noche"], youtubeId: "UqyT8IEBkvY" },
  { id: "f010", track_name: "One More Time", artist: "Daft Punk", album: "Discovery", album_cover: "https://picsum.photos/seed/dp2/300/300", moods: ["feliz", "motivado"], moment_types: ["fiesta"], youtubeId: "FGBhQbmPwH8" },
  { id: "f011", track_name: "Get Lucky", artist: "Daft Punk", album: "Random Access Memories", album_cover: "https://picsum.photos/seed/dp1/300/300", moods: ["feliz", "relajado"], moment_types: ["fiesta", "vacaciones"], youtubeId: "5NV6Rdv1a3I" },
  { id: "f012", track_name: "Tití Me Preguntó", artist: "Bad Bunny", album: "Un Verano Sin Ti", album_cover: "https://picsum.photos/seed/bb3/300/300", moods: ["feliz", "motivado"], moment_types: ["fiesta", "vacaciones"], youtubeId: "aYbJXM66M_s" },
  { id: "f013", track_name: "Summer", artist: "Calvin Harris", album: "Motion", album_cover: "https://picsum.photos/seed/ch1/300/300", moods: ["feliz", "libre"], moment_types: ["vacaciones", "fiesta"], youtubeId: "ebXbLfLACGM" },
  { id: "f014", track_name: "Con Altura", artist: "Rosalía", album: "Single", album_cover: "https://picsum.photos/seed/ros2/300/300", moods: ["feliz", "motivado"], moment_types: ["fiesta"], youtubeId: "p7bfOZek9t4" },
  { id: "f015", track_name: "Mi Gente", artist: "J Balvin", album: "Vibras", album_cover: "https://picsum.photos/seed/jb1/300/300", moods: ["feliz", "motivado"], moment_types: ["fiesta"], youtubeId: "wnJ6LuUFpMo" },
  { id: "f016", track_name: "Hips Don't Lie", artist: "Shakira", album: "Oral Fixation, Vol. 2", album_cover: "https://picsum.photos/seed/sh1/300/300", moods: ["feliz", "motivado"], moment_types: ["fiesta"], youtubeId: "DUT5rEU6pqM" },
  { id: "f017", track_name: "Electric Feel", artist: "MGMT", album: "Oracular Spectacular", album_cover: "https://picsum.photos/seed/mg1/300/300", moods: ["feliz", "libre"], moment_types: ["fiesta", "concierto"], youtubeId: "MmZexg8sxyk" },
  { id: "f018", track_name: "Cairo", artist: "Karol G", album: "Mañana Será Bonito", album_cover: "https://picsum.photos/seed/kg3/300/300", moods: ["feliz", "relajado"], moment_types: ["vacaciones"], youtubeId: "jXJp_R0f0XY" },
  
  // ============ RELAJADO ============
  { id: "r001", track_name: "Weightless", artist: "Marconi Union", album: "Weightless", album_cover: "https://picsum.photos/seed/mu1/300/300", moods: ["relajado"], moment_types: ["tranquilo"], youtubeId: "UfcAVejslrU" },
  { id: "r002", track_name: "So What", artist: "Miles Davis", album: "Kind of Blue", album_cover: "https://picsum.photos/seed/md1/300/300", moods: ["relajado", "reflexivo"], moment_types: ["tranquilo", "inspiracion"], youtubeId: "zqNTltOGh5c" },
  { id: "r003", track_name: "Blue in Green", artist: "Miles Davis", album: "Kind of Blue", album_cover: "https://picsum.photos/seed/md2/300/300", moods: ["relajado", "reflexivo", "triste"], moment_types: ["tranquilo"], youtubeId: "PoPL7BExSQU" },
  { id: "r004", track_name: "We'll Be Fine", artist: "Jinsang", album: "Solitude", album_cover: "https://picsum.photos/seed/js1/300/300", moods: ["relajado", "nostálgico"], moment_types: ["tranquilo", "inspiracion"], youtubeId: "sbH3gjbfJKs" },
  { id: "r005", track_name: "Affection", artist: "Jinsang", album: "Life", album_cover: "https://picsum.photos/seed/js2/300/300", moods: ["relajado", "enamorado"], moment_types: ["tranquilo"], youtubeId: "5E4IzF3DY_Y" },
  { id: "r006", track_name: "Take It Easy", artist: "Eagles", album: "Eagles", album_cover: "https://picsum.photos/seed/e2/300/300", moods: ["relajado", "feliz"], moment_types: ["vacaciones", "tranquilo"], youtubeId: "UI3F687SsoU" },
  { id: "r007", track_name: "Circles", artist: "Post Malone", album: "Hollywood's Bleeding", album_cover: "https://picsum.photos/seed/pm1/300/300", moods: ["relajado", "reflexivo"], moment_types: ["tranquilo"], youtubeId: "wXhTHyIgQ_U" },
  { id: "r008", track_name: "Sunflower", artist: "Post Malone", album: "Spider-Man: Into the Spider-Verse", album_cover: "https://picsum.photos/seed/pm2/300/300", moods: ["relajado", "feliz"], moment_types: ["tranquilo", "vacaciones"], youtubeId: "ApXoWvfEYVU" },
  { id: "r009", track_name: "Come As You Are", artist: "Nirvana", album: "Nevermind", album_cover: "https://picsum.photos/seed/n2/300/300", moods: ["relajado", "nostálgico"], moment_types: ["tranquilo"], youtubeId: "vabnZ9-ex7o" },
  { id: "r010", track_name: "Clint Eastwood", artist: "Gorillaz", album: "Gorillaz", album_cover: "https://picsum.photos/seed/gz2/300/300", moods: ["relajado", "reflexivo"], moment_types: ["tranquilo"], youtubeId: "1V_xRb0x9aw" },
  { id: "r011", track_name: "Hotline Bling", artist: "Drake", album: "Views", album_cover: "https://picsum.photos/seed/dr3/300/300", moods: ["relajado", "nostálgico"], moment_types: ["noche"], youtubeId: "uxpDa-c-4Mc" },
  { id: "r012", track_name: "Good Days", artist: "SZA", album: "Single", album_cover: "https://picsum.photos/seed/sz2/300/300", moods: ["relajado", "esperanzado"], moment_types: ["tranquilo"], youtubeId: "U5fJK2VQ8b0" },
  { id: "r013", track_name: "One Dance", artist: "Drake", album: "Views", album_cover: "https://picsum.photos/seed/dr1/300/300", moods: ["relajado", "feliz"], moment_types: ["fiesta", "vacaciones"], youtubeId: "BSzSn-PRdtI" },
  { id: "r014", track_name: "Chamber of Reflection", artist: "Mac DeMarco", album: "Salad Days", album_cover: "https://picsum.photos/seed/md4/300/300", moods: ["relajado", "reflexivo"], moment_types: ["tranquilo", "noche"], youtubeId: "NY8IS0ssnXQ" },
  { id: "r015", track_name: "Three Little Birds", artist: "Bob Marley & The Wailers", album: "Exodus", album_cover: "https://picsum.photos/seed/bm1/300/300", moods: ["relajado", "feliz", "esperanzado"], moment_types: ["vacaciones", "tranquilo"], youtubeId: "zaGUr6wzyT8" },
  { id: "r016", track_name: "On Melancholy Hill", artist: "Gorillaz", album: "Plastic Beach", album_cover: "https://picsum.photos/seed/gz3/300/300", moods: ["relajado", "reflexivo"], moment_types: ["tranquilo"], youtubeId: "04mfKJWDSzI" },
  
  // ============ NERVIOSO ============
  { id: "nv001", track_name: "Smells Like Teen Spirit", artist: "Nirvana", album: "Nevermind", album_cover: "https://picsum.photos/seed/n1/300/300", moods: ["nervioso", "motivado"], moment_types: ["concierto"], youtubeId: "hTWKbfoikeg" },
  { id: "nv002", track_name: "bad guy", artist: "Billie Eilish", album: "WHEN WE ALL FALL ASLEEP", album_cover: "https://picsum.photos/seed/be1/300/300", moods: ["nervioso", "motivado"], moment_types: ["fiesta", "noche"], youtubeId: "DyDfgMOUjCI" },
  { id: "nv003", track_name: "Creep", artist: "Radiohead", album: "Pablo Honey", album_cover: "https://picsum.photos/seed/rh1/300/300", moods: ["nervioso", "triste"], moment_types: ["tranquilo"], youtubeId: "XFkzRNyygfk" },
  { id: "nv004", track_name: "Love It If We Made It", artist: "The 1975", album: "A Brief Inquiry Into Online Relationships", album_cover: "https://picsum.photos/seed/t752/300/300", moods: ["nervioso", "motivado"], moment_types: ["concierto"], youtubeId: "1Wl1B7DPegc" },
  { id: "nv005", track_name: "Yonkers", artist: "Tyler, The Creator", album: "Goblin", album_cover: "https://picsum.photos/seed/ttc3/300/300", moods: ["nervioso", "motivado"], moment_types: ["concierto"], youtubeId: "XSbZidsgMfw" },
  { id: "nv006", track_name: "Paranoid", artist: "Black Sabbath", album: "Paranoid", album_cover: "https://picsum.photos/seed/bs1/300/300", moods: ["nervioso", "motivado"], moment_types: ["concierto"], youtubeId: "uk_wUT1CvWM" },
  { id: "nv007", track_name: "Hysteria", artist: "Muse", album: "Absolution", album_cover: "https://picsum.photos/seed/ms1/300/300", moods: ["nervioso", "motivado"], moment_types: ["concierto"], youtubeId: "3dm_5qWWDV8" },
  { id: "nv008", track_name: "Psycho Killer", artist: "Talking Heads", album: "77", album_cover: "https://picsum.photos/seed/th1/300/300", moods: ["nervioso"], moment_types: ["concierto", "noche"], youtubeId: "O52jAYa4Pm8" },
  
  // ============ TRISTE ============
  { id: "t001", track_name: "Someone Like You", artist: "Adele", album: "21", album_cover: "https://picsum.photos/seed/ad1/300/300", moods: ["triste", "nostálgico"], moment_types: ["despedida", "tranquilo"], youtubeId: "hLQl3WQQoQ0" },
  { id: "t002", track_name: "when the party's over", artist: "Billie Eilish", album: "WHEN WE ALL FALL ASLEEP", album_cover: "https://picsum.photos/seed/be2/300/300", moods: ["triste", "reflexivo"], moment_types: ["despedida", "tranquilo"], youtubeId: "pbMwTqkKSps" },
  { id: "t003", track_name: "All Too Well", artist: "Taylor Swift", album: "Red", album_cover: "https://picsum.photos/seed/ts2/300/300", moods: ["triste", "nostálgico"], moment_types: ["despedida"], youtubeId: "tollGa3S0o8" },
  { id: "t004", track_name: "Hurt", artist: "Johnny Cash", album: "American IV", album_cover: "https://picsum.photos/seed/jc1/300/300", moods: ["triste", "reflexivo"], moment_types: ["despedida"], youtubeId: "8AHCfZTRGiI" },
  { id: "t005", track_name: "Mad World", artist: "Gary Jules", album: "Trading Snakeoil", album_cover: "https://picsum.photos/seed/gj1/300/300", moods: ["triste", "reflexivo"], moment_types: ["tranquilo"], youtubeId: "4N3N1MlvVc4" },
  { id: "t006", track_name: "Tears in Heaven", artist: "Eric Clapton", album: "Unplugged", album_cover: "https://picsum.photos/seed/ec1/300/300", moods: ["triste", "nostálgico"], moment_types: ["despedida"], youtubeId: "JxPj3GAYYZ0" },
  { id: "t007", track_name: "Somebody Else", artist: "The 1975", album: "I Like It When You Sleep", album_cover: "https://picsum.photos/seed/t751/300/300", moods: ["triste", "nostálgico"], moment_types: ["despedida", "noche"], youtubeId: "Bimd2nZirT4" },
  { id: "t008", track_name: "Save Your Tears", artist: "The Weeknd", album: "After Hours", album_cover: "https://picsum.photos/seed/tw2/300/300", moods: ["triste", "nostálgico"], moment_types: ["despedida"], youtubeId: "XXYlFuWEuKI" },
  { id: "t009", track_name: "Kill Bill", artist: "SZA", album: "SOS", album_cover: "https://picsum.photos/seed/sz1/300/300", moods: ["triste", "nervioso"], moment_types: ["despedida"], youtubeId: "CJE8W4YkVlI" },
  { id: "t010", track_name: "Tusa", artist: "Karol G", album: "Ocean", album_cover: "https://picsum.photos/seed/kg1/300/300", moods: ["triste", "motivado"], moment_types: ["fiesta", "despedida"], youtubeId: "tbneQDc2H3I" },
  { id: "t011", track_name: "Video Games", artist: "Lana Del Rey", album: "Born To Die", album_cover: "https://picsum.photos/seed/ldr2/300/300", moods: ["triste", "nostálgico"], moment_types: ["tranquilo"], youtubeId: "cE6wxDqdOV0" },
  { id: "t012", track_name: "The Weekend", artist: "SZA", album: "Ctrl", album_cover: "https://picsum.photos/seed/sz3/300/300", moods: ["triste", "enamorado"], moment_types: ["noche"], youtubeId: "dU5EBw-ec7E" },
  { id: "t013", track_name: "Young and Beautiful", artist: "Lana Del Rey", album: "The Great Gatsby", album_cover: "https://picsum.photos/seed/ldr3/300/300", moods: ["triste", "enamorado"], moment_types: ["noche"], youtubeId: "o_1aF54DO60" },
  { id: "t014", track_name: "Why'd You Only Call Me When You're High?", artist: "Arctic Monkeys", album: "AM", album_cover: "https://picsum.photos/seed/am3/300/300", moods: ["triste", "nostálgico"], moment_types: ["noche"], youtubeId: "6366dxFf-Os" },
  
  // ============ REFLEXIVO ============
  { id: "rf001", track_name: "The Sound of Silence", artist: "Simon & Garfunkel", album: "Sounds of Silence", album_cover: "https://picsum.photos/seed/sg1/300/300", moods: ["reflexivo", "triste"], moment_types: ["tranquilo"], youtubeId: "4fWyzwo1xg0" },
  { id: "rf002", track_name: "Space Oddity", artist: "David Bowie", album: "David Bowie", album_cover: "https://picsum.photos/seed/db2/300/300", moods: ["reflexivo", "nostálgico"], moment_types: ["tranquilo", "inspiracion"], youtubeId: "iYYRH4apXDo" },
  { id: "rf003", track_name: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", album_cover: "https://picsum.photos/seed/q1/300/300", moods: ["reflexivo", "motivado"], moment_types: ["concierto"], youtubeId: "fJ9rUzIMcZQ" },
  { id: "rf004", track_name: "Nights", artist: "Frank Ocean", album: "Blonde", album_cover: "https://picsum.photos/seed/fo2/300/300", moods: ["reflexivo", "nostálgico"], moment_types: ["noche", "tranquilo"], youtubeId: "r4l9bFqgMaQ" },
  { id: "rf005", track_name: "Let It Happen", artist: "Tame Impala", album: "Currents", album_cover: "https://picsum.photos/seed/ti2/300/300", moods: ["reflexivo", "relajado"], moment_types: ["tranquilo", "inspiracion"], youtubeId: "pFptt7Cargc" },
  { id: "rf006", track_name: "Swimming Pools", artist: "Kendrick Lamar", album: "good kid, m.A.A.d city", album_cover: "https://picsum.photos/seed/kl2/300/300", moods: ["reflexivo", "relajado"], moment_types: ["fiesta", "tranquilo"], youtubeId: "B5YNiCfWC3A" },
  { id: "rf007", track_name: "Thinkin Bout You", artist: "Frank Ocean", album: "channel ORANGE", album_cover: "https://picsum.photos/seed/fo1/300/300", moods: ["reflexivo", "enamorado"], moment_types: ["tranquilo", "noche"], youtubeId: "6JRhw_DM4I4" },
  { id: "rf008", track_name: "Flamenco Sketches", artist: "Miles Davis", album: "Kind of Blue", album_cover: "https://picsum.photos/seed/md3/300/300", moods: ["reflexivo", "relajado"], moment_types: ["tranquilo", "inspiracion"], youtubeId: "F3W_alUuHqg" },
  
  // ============ MOTIVADO ============
  { id: "m001", track_name: "Eye of the Tiger", artist: "Survivor", album: "Eye of the Tiger", album_cover: "https://picsum.photos/seed/sv1/300/300", moods: ["motivado", "nervioso"], moment_types: ["concierto", "evento"], youtubeId: "btPJPFnesV4" },
  { id: "m002", track_name: "Lose Yourself", artist: "Eminem", album: "8 Mile", album_cover: "https://picsum.photos/seed/em1/300/300", moods: ["motivado", "nervioso"], moment_types: ["evento", "inspiracion"], youtubeId: "_Yhyp-_hX2s" },
  { id: "m003", track_name: "We Will Rock You", artist: "Queen", album: "News of the World", album_cover: "https://picsum.photos/seed/q4/300/300", moods: ["motivado", "feliz"], moment_types: ["concierto", "evento"], youtubeId: "-tJYN-eG1zk" },
  { id: "m004", track_name: "Stronger", artist: "Kanye West", album: "Graduation", album_cover: "https://picsum.photos/seed/kw2/300/300", moods: ["motivado", "nervioso"], moment_types: ["evento", "fiesta"], youtubeId: "PsO6ZnUZI0g" },
  { id: "m005", track_name: "Believer", artist: "Imagine Dragons", album: "Evolve", album_cover: "https://picsum.photos/seed/id1/300/300", moods: ["motivado", "nervioso"], moment_types: ["evento", "inspiracion"], youtubeId: "7wtfhZwyrcc" },
  { id: "m006", track_name: "Radioactive", artist: "Imagine Dragons", album: "Night Visions", album_cover: "https://picsum.photos/seed/id2/300/300", moods: ["motivado", "nervioso"], moment_types: ["evento"], youtubeId: "ktvTqknDobU" },
  { id: "m007", track_name: "Thunder", artist: "Imagine Dragons", album: "Evolve", album_cover: "https://picsum.photos/seed/id3/300/300", moods: ["motivado", "feliz"], moment_types: ["evento"], youtubeId: "fKopy74weus" },
  { id: "m008", track_name: "Viva La Vida", artist: "Coldplay", album: "Viva la Vida", album_cover: "https://picsum.photos/seed/cp3/300/300", moods: ["motivado", "esperanzado"], moment_types: ["concierto", "evento"], youtubeId: "dvgZkm1xWPE" },
  { id: "m009", track_name: "Rolling in the Deep", artist: "Adele", album: "21", album_cover: "https://picsum.photos/seed/ad2/300/300", moods: ["motivado", "nervioso"], moment_types: ["concierto"], youtubeId: "rYEDA3JcQqw" },
  { id: "m010", track_name: "Heroes", artist: "David Bowie", album: "Heroes", album_cover: "https://picsum.photos/seed/db1/300/300", moods: ["motivado", "esperanzado"], moment_types: ["evento", "inspiracion"], youtubeId: "lXgkuM2NhYI" },
  { id: "m011", track_name: "Fix You", artist: "Coldplay", album: "X&Y", album_cover: "https://picsum.photos/seed/cp2/300/300", moods: ["motivado", "triste", "esperanzado"], moment_types: ["despedida", "concierto"], youtubeId: "k4V3Mo61fJM" },
  { id: "m012", track_name: "HUMBLE.", artist: "Kendrick Lamar", album: "DAMN.", album_cover: "https://picsum.photos/seed/kl1/300/300", moods: ["motivado"], moment_types: ["fiesta", "evento"], youtubeId: "tvTRZJ-4EyI" },
  { id: "m013", track_name: "God's Plan", artist: "Drake", album: "Scorpion", album_cover: "https://picsum.photos/seed/dr2/300/300", moods: ["motivado", "feliz"], moment_types: ["fiesta"], youtubeId: "xpVfcZ0ZcFM" },
  { id: "m014", track_name: "Bichota", artist: "Karol G", album: "KG0516", album_cover: "https://picsum.photos/seed/kg2/300/300", moods: ["motivado", "libre"], moment_types: ["fiesta"], youtubeId: "QaXhVryxVBk" },
  { id: "m015", track_name: "Starboy", artist: "The Weeknd", album: "Starboy", album_cover: "https://picsum.photos/seed/tw3/300/300", moods: ["motivado"], moment_types: ["fiesta", "noche"], youtubeId: "34Na4j8AVgA" },
  { id: "m016", track_name: "The Chain", artist: "Fleetwood Mac", album: "Rumours", album_cover: "https://picsum.photos/seed/fm2/300/300", moods: ["motivado", "nervioso"], moment_types: ["concierto"], youtubeId: "JDG2m5hN1vo" },
  { id: "m017", track_name: "Can't Stop", artist: "Red Hot Chili Peppers", album: "By The Way", album_cover: "https://picsum.photos/seed/rhcp3/300/300", moods: ["motivado", "libre"], moment_types: ["concierto", "vacaciones"], youtubeId: "8DyziWtkfBw" },
  { id: "m018", track_name: "Rockstar", artist: "Post Malone", album: "Beerbongs & Bentleys", album_cover: "https://picsum.photos/seed/pm3/300/300", moods: ["motivado"], moment_types: ["fiesta"], youtubeId: "UceaB4D0jpo" },
  { id: "m019", track_name: "Malamente", artist: "Rosalía", album: "El Mal Querer", album_cover: "https://picsum.photos/seed/ros1/300/300", moods: ["motivado", "nervioso"], moment_types: ["concierto", "fiesta"], youtubeId: "Rht7rBHuXW8" },
  { id: "m020", track_name: "Alright", artist: "Kendrick Lamar", album: "To Pimp a Butterfly", album_cover: "https://picsum.photos/seed/kl3/300/300", moods: ["motivado", "esperanzado"], moment_types: ["evento"], youtubeId: "Z-48u_uWMHY" },
  
  // ============ ESPERANZADO ============
  { id: "es001", track_name: "Here Comes The Sun", artist: "The Beatles", album: "Abbey Road", album_cover: "https://picsum.photos/seed/tb1/300/300", moods: ["esperanzado", "feliz"], moment_types: ["vacaciones", "tranquilo"], youtubeId: "KQetemT1sWc" },
  { id: "es002", track_name: "Don't Worry Be Happy", artist: "Bobby McFerrin", album: "Simple Pleasures", album_cover: "https://picsum.photos/seed/bmf1/300/300", moods: ["esperanzado", "feliz"], moment_types: ["vacaciones", "tranquilo"], youtubeId: "d-diB65scQU" },
  { id: "es003", track_name: "Beautiful Day", artist: "U2", album: "All That You Can't Leave Behind", album_cover: "https://picsum.photos/seed/u21/300/300", moods: ["esperanzado", "motivado"], moment_types: ["evento", "vacaciones"], youtubeId: "co6WMzDOh1o" },
  { id: "es004", track_name: "I Gotta Feeling", artist: "The Black Eyed Peas", album: "The E.N.D.", album_cover: "https://picsum.photos/seed/bep1/300/300", moods: ["esperanzado", "feliz"], moment_types: ["fiesta", "evento"], youtubeId: "uSD4vsh1zDA" },
  { id: "es005", track_name: "Roar", artist: "Katy Perry", album: "Prism", album_cover: "https://picsum.photos/seed/kp1/300/300", moods: ["esperanzado", "motivado"], moment_types: ["evento"], youtubeId: "CevxZvSJLk8" },
  { id: "es006", track_name: "Firework", artist: "Katy Perry", album: "Teenage Dream", album_cover: "https://picsum.photos/seed/kp2/300/300", moods: ["esperanzado", "motivado"], moment_types: ["evento", "fiesta"], youtubeId: "QGJuMBdaqIw" },
  { id: "es007", track_name: "Hall of Fame", artist: "The Script", album: "#3", album_cover: "https://picsum.photos/seed/sc1/300/300", moods: ["esperanzado", "motivado"], moment_types: ["evento"], youtubeId: "mk48xRzuNvA" },
  { id: "es008", track_name: "Titanium", artist: "David Guetta ft. Sia", album: "Nothing but the Beat", album_cover: "https://picsum.photos/seed/dg1/300/300", moods: ["esperanzado", "motivado"], moment_types: ["evento", "fiesta"], youtubeId: "JRfuAukYTKg" },
  
  // ============ LIBRE / AVENTURERO ============
  { id: "l001", track_name: "Born to Run", artist: "Bruce Springsteen", album: "Born to Run", album_cover: "https://picsum.photos/seed/bs2/300/300", moods: ["libre", "motivado"], moment_types: ["vacaciones", "concierto"], youtubeId: "IxuThNgl3YA" },
  { id: "l002", track_name: "Life is a Highway", artist: "Tom Cochrane", album: "Mad Mad World", album_cover: "https://picsum.photos/seed/tc1/300/300", moods: ["libre", "feliz"], moment_types: ["vacaciones"], youtubeId: "U3sMjm9Eloo" },
  { id: "l003", track_name: "Go Your Own Way", artist: "Fleetwood Mac", album: "Rumours", album_cover: "https://picsum.photos/seed/fm3/300/300", moods: ["libre", "motivado"], moment_types: ["despedida", "vacaciones"], youtubeId: "6ul-cZyuYw4" },
  { id: "l004", track_name: "Free Fallin'", artist: "Tom Petty", album: "Full Moon Fever", album_cover: "https://picsum.photos/seed/tp1/300/300", moods: ["libre", "nostálgico"], moment_types: ["vacaciones"], youtubeId: "1lWJXDG2i0A" },
  { id: "l005", track_name: "Kids", artist: "MGMT", album: "Oracular Spectacular", album_cover: "https://picsum.photos/seed/mg2/300/300", moods: ["libre", "nostálgico"], moment_types: ["fiesta", "vacaciones"], youtubeId: "fe4EK4HSPkI" },
  { id: "l006", track_name: "Yo Perreo Sola", artist: "Bad Bunny", album: "YHLQMDLG", album_cover: "https://picsum.photos/seed/bb5/300/300", moods: ["libre", "motivado"], moment_types: ["fiesta"], youtubeId: "GtSRKwDCaZM" },
  { id: "l007", track_name: "Californication", artist: "Red Hot Chili Peppers", album: "Californication", album_cover: "https://picsum.photos/seed/rhcp2/300/300", moods: ["libre", "nostálgico"], moment_types: ["vacaciones"], youtubeId: "YlUKcNNmywk" },
  { id: "l008", track_name: "Wouldn't It Be Nice", artist: "The Beach Boys", album: "Pet Sounds", album_cover: "https://picsum.photos/seed/bb2/300/300", moods: ["libre", "enamorado", "esperanzado"], moment_types: ["vacaciones"], youtubeId: "nZBKFoeDKJo" },
  { id: "l009", track_name: "Under The Bridge", artist: "Red Hot Chili Peppers", album: "Blood Sugar Sex Magik", album_cover: "https://picsum.photos/seed/rhcp1/300/300", moods: ["libre", "reflexivo", "nostálgico"], moment_types: ["vacaciones", "tranquilo"], youtubeId: "GLvohMXgcBo" },
  { id: "l010", track_name: "Feel Good Inc.", artist: "Gorillaz", album: "Demon Days", album_cover: "https://picsum.photos/seed/gz1/300/300", moods: ["libre", "relajado"], moment_types: ["fiesta", "vacaciones"], youtubeId: "HyHNuVaZJ-k" },
  
  // ============ MÁS CLÁSICOS Y MEMORABLES ============
  { id: "c001", track_name: "Stayin' Alive", artist: "Bee Gees", album: "Saturday Night Fever", album_cover: "https://picsum.photos/seed/bgs1/300/300", moods: ["feliz", "motivado"], moment_types: ["fiesta"], youtubeId: "fNFzfwLM72c" },
  { id: "c002", track_name: "Billie Jean", artist: "Michael Jackson", album: "Thriller", album_cover: "https://picsum.photos/seed/mj1/300/300", moods: ["motivado", "nervioso"], moment_types: ["fiesta", "concierto"], youtubeId: "Zi_XLOBDo_Y" },
  { id: "c003", track_name: "Beat It", artist: "Michael Jackson", album: "Thriller", album_cover: "https://picsum.photos/seed/mj2/300/300", moods: ["motivado", "nervioso"], moment_types: ["fiesta", "concierto"], youtubeId: "oRdxUFDoQe0" },
  { id: "c004", track_name: "Thriller", artist: "Michael Jackson", album: "Thriller", album_cover: "https://picsum.photos/seed/mj3/300/300", moods: ["nervioso", "feliz"], moment_types: ["fiesta"], youtubeId: "sOnqjkJTMaA" },
  { id: "c005", track_name: "Dancing Queen", artist: "ABBA", album: "Arrival", album_cover: "https://picsum.photos/seed/ab1/300/300", moods: ["feliz", "libre"], moment_types: ["fiesta"], youtubeId: "xFrGuyw1V8s" },
  { id: "c006", track_name: "Mamma Mia", artist: "ABBA", album: "ABBA", album_cover: "https://picsum.photos/seed/ab2/300/300", moods: ["feliz", "nostálgico"], moment_types: ["fiesta"], youtubeId: "unfzfe8f9NI" },
  { id: "c007", track_name: "I Will Survive", artist: "Gloria Gaynor", album: "Love Tracks", album_cover: "https://picsum.photos/seed/gg1/300/300", moods: ["motivado", "libre"], moment_types: ["fiesta", "despedida"], youtubeId: "ARt9HV9T0w8" },
  { id: "c008", track_name: "Respect", artist: "Aretha Franklin", album: "I Never Loved a Man", album_cover: "https://picsum.photos/seed/af1/300/300", moods: ["motivado", "libre"], moment_types: ["fiesta"], youtubeId: "6FOUqQt3Kg0" },
  { id: "c009", track_name: "Superstition", artist: "Stevie Wonder", album: "Talking Book", album_cover: "https://picsum.photos/seed/sw1/300/300", moods: ["feliz", "motivado"], moment_types: ["fiesta", "concierto"], youtubeId: "wDZFf0pm0SE" },
  { id: "c010", track_name: "Livin' on a Prayer", artist: "Bon Jovi", album: "Slippery When Wet", album_cover: "https://picsum.photos/seed/bj1/300/300", moods: ["motivado", "esperanzado"], moment_types: ["concierto", "fiesta"], youtubeId: "lDK9QqIzhwk" },
  { id: "c011", track_name: "Take On Me", artist: "a-ha", album: "Hunting High and Low", album_cover: "https://picsum.photos/seed/aha1/300/300", moods: ["feliz", "nostálgico"], moment_types: ["fiesta"], youtubeId: "djV11Xbc914" },
  { id: "c012", track_name: "Every Breath You Take", artist: "The Police", album: "Synchronicity", album_cover: "https://picsum.photos/seed/pol1/300/300", moods: ["enamorado", "nostálgico"], moment_types: ["noche"], youtubeId: "OMOGaugKpzs" },
  { id: "c013", track_name: "Africa", artist: "Toto", album: "Toto IV", album_cover: "https://picsum.photos/seed/tot1/300/300", moods: ["nostálgico", "libre"], moment_types: ["vacaciones"], youtubeId: "FTQbiNvZqaY" },
  { id: "c014", track_name: "September", artist: "Earth, Wind & Fire", album: "The Best of Earth, Wind & Fire", album_cover: "https://picsum.photos/seed/ewf1/300/300", moods: ["feliz", "motivado"], moment_types: ["fiesta"], youtubeId: "Gs069dndIYk" },
  { id: "c015", track_name: "Mr. Brightside", artist: "The Killers", album: "Hot Fuss", album_cover: "https://picsum.photos/seed/kil1/300/300", moods: ["nervioso", "nostálgico"], moment_types: ["fiesta", "concierto"], youtubeId: "gGdGFtwCNBE" },
  { id: "c016", track_name: "Everlong", artist: "Foo Fighters", album: "The Colour and the Shape", album_cover: "https://picsum.photos/seed/ff1/300/300", moods: ["nostálgico", "motivado"], moment_types: ["concierto"], youtubeId: "eBG7P-K-r1Y" },
  { id: "c017", track_name: "Learn to Fly", artist: "Foo Fighters", album: "There Is Nothing Left to Lose", album_cover: "https://picsum.photos/seed/ff2/300/300", moods: ["motivado", "feliz"], moment_types: ["concierto"], youtubeId: "1VQ_3sBZEm0" },
  { id: "c018", track_name: "Best of You", artist: "Foo Fighters", album: "In Your Honor", album_cover: "https://picsum.photos/seed/ff3/300/300", moods: ["motivado", "nervioso"], moment_types: ["concierto"], youtubeId: "h_L4Rixya64" },
  { id: "c019", track_name: "Fluorescent Adolescent", artist: "Arctic Monkeys", album: "Favourite Worst Nightmare", album_cover: "https://picsum.photos/seed/am4/300/300", moods: ["nostálgico", "feliz"], moment_types: ["fiesta", "concierto"], youtubeId: "ma9I9VBKPiw" },
  { id: "c020", track_name: "R U Mine?", artist: "Arctic Monkeys", album: "AM", album_cover: "https://picsum.photos/seed/am2/300/300", moods: ["motivado", "nervioso"], moment_types: ["concierto"], youtubeId: "ngzC_8zqInk" },
  { id: "c021", track_name: "Hey Jude", artist: "The Beatles", album: "Hey Jude", album_cover: "https://picsum.photos/seed/tb3/300/300", moods: ["esperanzado", "nostálgico"], moment_types: ["concierto", "despedida"], youtubeId: "A_MjCqQoLLA" },
  { id: "c022", track_name: "One Love", artist: "Bob Marley & The Wailers", album: "Exodus", album_cover: "https://picsum.photos/seed/bm2/300/300", moods: ["enamorado", "relajado", "esperanzado"], moment_types: ["vacaciones"], youtubeId: "vdB-8eLEW8g" },
  { id: "c023", track_name: "Shape of You", artist: "Ed Sheeran", album: "÷", album_cover: "https://picsum.photos/seed/es1/300/300", moods: ["enamorado", "feliz"], moment_types: ["fiesta"], youtubeId: "JGwWNGJdvx8" },
  { id: "c024", track_name: "Feel So Close", artist: "Calvin Harris", album: "18 Months", album_cover: "https://picsum.photos/seed/ch2/300/300", moods: ["feliz", "enamorado"], moment_types: ["fiesta"], youtubeId: "dGghkjpNCQ8" },
  { id: "c025", track_name: "This Is What You Came For", artist: "Calvin Harris", album: "Single", album_cover: "https://picsum.photos/seed/ch3/300/300", moods: ["motivado", "feliz"], moment_types: ["fiesta"], youtubeId: "kOkQ4T5WO9E" },
  { id: "c026", track_name: "Don't Start Now", artist: "Dua Lipa", album: "Future Nostalgia", album_cover: "https://picsum.photos/seed/dl2/300/300", moods: ["motivado", "libre"], moment_types: ["fiesta"], youtubeId: "oygrmJFKYZY" },
  { id: "c027", track_name: "Waka Waka", artist: "Shakira", album: "Sale el Sol", album_cover: "https://picsum.photos/seed/sh3/300/300", moods: ["feliz", "motivado"], moment_types: ["fiesta", "evento"], youtubeId: "pRpeEdMmmQ0" },
  { id: "c028", track_name: "Whenever, Wherever", artist: "Shakira", album: "Laundry Service", album_cover: "https://picsum.photos/seed/sh2/300/300", moods: ["feliz", "enamorado"], moment_types: ["fiesta", "vacaciones"], youtubeId: "weRHyjj34ZE" },
  { id: "c029", track_name: "Rojo", artist: "J Balvin", album: "Colores", album_cover: "https://picsum.photos/seed/jb2/300/300", moods: ["enamorado", "motivado"], moment_types: ["fiesta"], youtubeId: "glPOc-WW8rI" },
  { id: "c030", track_name: "Ay Vamos", artist: "J Balvin", album: "Energía", album_cover: "https://picsum.photos/seed/jb3/300/300", moods: ["feliz", "motivado"], moment_types: ["fiesta", "vacaciones"], youtubeId: "hr4knvNNgtU" },
  { id: "c031", track_name: "La Fama", artist: "Rosalía", album: "Motomami", album_cover: "https://picsum.photos/seed/ros3/300/300", moods: ["motivado", "nervioso"], moment_types: ["fiesta"], youtubeId: "KD0rLh6vV3I" },
  { id: "c032", track_name: "Someday", artist: "The Strokes", album: "Is This It", album_cover: "https://picsum.photos/seed/ts4/300/300", moods: ["nostálgico", "motivado"], moment_types: ["concierto"], youtubeId: "knU9gRUWCno" },
  { id: "c033", track_name: "Last Nite", artist: "The Strokes", album: "Is This It", album_cover: "https://picsum.photos/seed/ts5/300/300", moods: ["motivado", "relajado"], moment_types: ["concierto", "fiesta"], youtubeId: "TOypSnKFHrE" },
  { id: "c034", track_name: "Reptilia", artist: "The Strokes", album: "Room on Fire", album_cover: "https://picsum.photos/seed/ts6/300/300", moods: ["motivado", "nervioso"], moment_types: ["concierto"], youtubeId: "b8-tXG8KrWs" },
  { id: "c035", track_name: "Borderline", artist: "Tame Impala", album: "The Slow Rush", album_cover: "https://picsum.photos/seed/ti3/300/300", moods: ["nostálgico", "motivado"], moment_types: ["fiesta"], youtubeId: "2g5xkLqIElU" },
  { id: "c036", track_name: "Tokyo Drifting", artist: "Glass Animals", album: "Dreamland", album_cover: "https://picsum.photos/seed/ga2/300/300", moods: ["motivado", "libre"], moment_types: ["fiesta"], youtubeId: "ijw4fa75WQ0" },
];

// Artistas únicos para autocompletar
export const ARTISTS = Array.from(new Set(TRACK_CATALOG.map(t => t.artist))).sort();

// Canciones únicas para autocompletar
export const SONGS = TRACK_CATALOG.map(t => ({
  value: t.id,
  label: `${t.track_name} - ${t.artist}`,
  track_name: t.track_name,
  artist: t.artist,
})).sort((a, b) => a.label.localeCompare(b.label));
