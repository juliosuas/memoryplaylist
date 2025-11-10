export interface TrackData {
  id: string;
  track_name: string;
  artist: string;
  album: string;
  album_cover: string;
  moods: string[];
  is_new_discovery?: boolean;
  youtubeId?: string;
}

// Catálogo estático de canciones
export const TRACK_CATALOG: TrackData[] = [
  // Arctic Monkeys
  { id: "am1", track_name: "Do I Wanna Know?", artist: "Arctic Monkeys", album: "AM", album_cover: "https://i.scdn.co/image/ab67616d0000b273eda3e91f6f8fdb8c82de68a", moods: ["nostálgico", "chill", "melancólico"], is_new_discovery: false, youtubeId: "bpOSxM0rNPM" },
  { id: "am2", track_name: "R U Mine?", artist: "Arctic Monkeys", album: "AM", album_cover: "https://i.scdn.co/image/ab67616d0000b273eda3e91f6f8fdb8c82de68a", moods: ["energético", "motivado"], is_new_discovery: true, youtubeId: "ngzC_8zqInk" },
  { id: "am3", track_name: "Why'd You Only Call Me When You're High?", artist: "Arctic Monkeys", album: "AM", album_cover: "https://i.scdn.co/image/ab67616d0000b273eda3e91f6f8fdb8c82de68a", moods: ["nostálgico", "triste"], is_new_discovery: true, youtubeId: "6366dxFf-Os" },
  { id: "am4", track_name: "Fluorescent Adolescent", artist: "Arctic Monkeys", album: "Favourite Worst Nightmare", album_cover: "https://i.scdn.co/image/ab67616d0000b273b1f8da74e20bc6c7e93589c3", moods: ["energético", "feliz"], is_new_discovery: true, youtubeId: "ma9I9VBKPiw" },
  
  // The Beatles
  { id: "tb1", track_name: "Here Comes The Sun", artist: "The Beatles", album: "Abbey Road", album_cover: "https://i.scdn.co/image/ab67616d0000b2734ce8b4e42588bf18182a1ad2", moods: ["feliz", "chill"], is_new_discovery: false, youtubeId: "KQetemT1sWc" },
  { id: "tb2", track_name: "Let It Be", artist: "The Beatles", album: "Let It Be", album_cover: "https://i.scdn.co/image/ab67616d0000b273dc30583ba717007b00cceb25", moods: ["nostálgico", "chill"], is_new_discovery: true, youtubeId: "QDYfEBY9NM4" },
  { id: "tb3", track_name: "Hey Jude", artist: "The Beatles", album: "Hey Jude", album_cover: "https://i.scdn.co/image/ab67616d0000b2734ba8e4b4f5fdd4c13186d0c2", moods: ["motivado", "feliz"], is_new_discovery: false, youtubeId: "A_MjCqQoLLA" },
  { id: "tb4", track_name: "Yesterday", artist: "The Beatles", album: "Help!", album_cover: "https://i.scdn.co/image/ab67616d0000b273e3e3b64cea45265469d4cafa", moods: ["nostálgico", "triste", "melancólico"], is_new_discovery: true, youtubeId: "wXTJBr9tt8Q" },
  
  // Queen
  { id: "q1", track_name: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", album_cover: "https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a", moods: ["energético", "motivado"], is_new_discovery: false, youtubeId: "fJ9rUzIMcZQ" },
  { id: "q2", track_name: "Don't Stop Me Now", artist: "Queen", album: "Jazz", album_cover: "https://i.scdn.co/image/ab67616d0000b273ea6f1b560d6cddf3fb62ec19", moods: ["feliz", "energético", "motivado"], is_new_discovery: true, youtubeId: "HgzGwKwLmgM" },
  { id: "q3", track_name: "Somebody To Love", artist: "Queen", album: "A Day at the Races", album_cover: "https://i.scdn.co/image/ab67616d0000b2735c7f3a0b8c65f2d73e1c6640", moods: ["enamorado", "energético"], is_new_discovery: true, youtubeId: "kijpcUv-b8M" },
  { id: "q4", track_name: "We Are The Champions", artist: "Queen", album: "News of the World", album_cover: "https://i.scdn.co/image/ab67616d0000b273a20a48c0ec1632969f68c61c", moods: ["motivado", "feliz"], is_new_discovery: false, youtubeId: "04854XqcfCY" },
  
  // Miles Davis
  { id: "md1", track_name: "So What", artist: "Miles Davis", album: "Kind of Blue", album_cover: "https://i.scdn.co/image/ab67616d0000b273c93aaae2c52b6b0e4dd7f8be", moods: ["chill", "melancólico"], is_new_discovery: true, youtubeId: "zqNTltOGh5c" },
  { id: "md2", track_name: "Blue in Green", artist: "Miles Davis", album: "Kind of Blue", album_cover: "https://i.scdn.co/image/ab67616d0000b273c93aaae2c52b6b0e4dd7f8be", moods: ["triste", "melancólico", "chill"], is_new_discovery: true, youtubeId: "PoPL7BExSQU" },
  { id: "md3", track_name: "Flamenco Sketches", artist: "Miles Davis", album: "Kind of Blue", album_cover: "https://i.scdn.co/image/ab67616d0000b273c93aaae2c52b6b0e4dd7f8be", moods: ["chill", "nostálgico"], is_new_discovery: true, youtubeId: "F3W_alUuHqg" },
  
  // Jinsang (Lo-fi)
  { id: "js1", track_name: "We'll Be Fine", artist: "Jinsang", album: "Solitude", album_cover: "https://i.scdn.co/image/ab67616d0000b273a91c89c3bbf6cc9d3e6fccbb", moods: ["chill", "nostálgico"], is_new_discovery: false, youtubeId: "sbH3gjbfJKs" },
  { id: "js2", track_name: "Affection", artist: "Jinsang", album: "Life", album_cover: "https://i.scdn.co/image/ab67616d0000b2732b27e4d5d1da5b5c309a6beb", moods: ["chill", "enamorado"], is_new_discovery: true, youtubeId: "5E4IzF3DY_Y" },
  { id: "js3", track_name: "Summer", artist: "Jinsang", album: "Life", album_cover: "https://i.scdn.co/image/ab67616d0000b2732b27e4d5d1da5b5c309a6beb", moods: ["feliz", "chill"], is_new_discovery: true, youtubeId: "VBs_WlWkEtY" },
  
  // Pharrell Williams
  { id: "pw1", track_name: "Happy", artist: "Pharrell Williams", album: "G I R L", album_cover: "https://i.scdn.co/image/ab67616d0000b273bf5b6dc3f7da49e6c22ffe85", moods: ["feliz", "energético"], is_new_discovery: false, youtubeId: "ZbZSe6N_BXs" },
  
  // Taylor Swift
  { id: "ts1", track_name: "Shake It Off", artist: "Taylor Swift", album: "1989", album_cover: "https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647", moods: ["feliz", "energético"], is_new_discovery: true, youtubeId: "nfWlot6h_JM" },
  { id: "ts2", track_name: "All Too Well", artist: "Taylor Swift", album: "Red", album_cover: "https://i.scdn.co/image/ab67616d0000b273318443aab3531a0558e79a4d", moods: ["triste", "nostálgico"], is_new_discovery: true, youtubeId: "tollGa3S0o8" },
  { id: "ts3", track_name: "Love Story", artist: "Taylor Swift", album: "Fearless", album_cover: "https://i.scdn.co/image/ab67616d0000b273904445d70d04eb24d6bb79ac", moods: ["enamorado", "feliz"], is_new_discovery: false, youtubeId: "8xg3vE8Ie_E" },
  
  // Dua Lipa
  { id: "dl1", track_name: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", album_cover: "https://i.scdn.co/image/ab67616d0000b27377fdcfda6535601aff081b6a", moods: ["feliz", "energético"], is_new_discovery: true, youtubeId: "TUVcZfQe-Kw" },
  { id: "dl2", track_name: "Don't Start Now", artist: "Dua Lipa", album: "Future Nostalgia", album_cover: "https://i.scdn.co/image/ab67616d0000b27377fdcfda6535601aff081b6a", moods: ["energético", "motivado"], is_new_discovery: true, youtubeId: "oygrmJFKYZY" },
  
  // MGMT
  { id: "mg1", track_name: "Electric Feel", artist: "MGMT", album: "Oracular Spectacular", album_cover: "https://i.scdn.co/image/ab67616d0000b2738b32b139981e79f2ebe005c0", moods: ["energético", "feliz"], is_new_discovery: false, youtubeId: "MmZexg8sxyk" },
  { id: "mg2", track_name: "Kids", artist: "MGMT", album: "Oracular Spectacular", album_cover: "https://i.scdn.co/image/ab67616d0000b2738b32b139981e79f2ebe005c0", moods: ["nostálgico", "energético"], is_new_discovery: true, youtubeId: "fe4EK4HSPkI" },
  
  // The 1975
  { id: "t751", track_name: "Somebody Else", artist: "The 1975", album: "I Like It When You Sleep", album_cover: "https://i.scdn.co/image/ab67616d0000b273b1c8b5e8f984c2c6bf49f8f1", moods: ["triste", "nostálgico"], is_new_discovery: false, youtubeId: "Bimd2nZirT4" },
  { id: "t752", track_name: "Love It If We Made It", artist: "The 1975", album: "A Brief Inquiry Into Online Relationships", album_cover: "https://i.scdn.co/image/ab67616d0000b2730c4fc0f8e2473fb1833be18a", moods: ["energético", "nervioso"], is_new_discovery: true, youtubeId: "1Wl1B7DPegc" },
  
  // Glass Animals
  { id: "ga1", track_name: "Heat Waves", artist: "Glass Animals", album: "Dreamland", album_cover: "https://i.scdn.co/image/ab67616d0000b2739e495fb707973f3390850eea", moods: ["nostálgico", "chill"], is_new_discovery: true, youtubeId: "mRD0-GxqHVo" },
  { id: "ga2", track_name: "Tokyo Drifting", artist: "Glass Animals", album: "Dreamland", album_cover: "https://i.scdn.co/image/ab67616d0000b2739e495fb707973f3390850eea", moods: ["energético", "motivado"], is_new_discovery: true, youtubeId: "ijw4fa75WQ0" },
  
  // Beach Boys
  { id: "bb1", track_name: "Good Vibrations", artist: "The Beach Boys", album: "Smiley Smile", album_cover: "https://picsum.photos/seed/bb1/300/300", moods: ["feliz", "chill"], is_new_discovery: false, youtubeId: "Eab_beh07HU" },
  { id: "bb2", track_name: "Wouldn't It Be Nice", artist: "The Beach Boys", album: "Pet Sounds", album_cover: "https://picsum.photos/seed/bb2/300/300", moods: ["feliz", "enamorado"], is_new_discovery: true, youtubeId: "nZBKFoeDKJo" },
  
  // Eagles
  { id: "e1", track_name: "Hotel California", artist: "Eagles", album: "Hotel California", album_cover: "https://i.scdn.co/image/ab67616d0000b2734637341b9f507521afa9a778", moods: ["nostálgico", "chill"], is_new_discovery: true, youtubeId: "09839DpTctU" },
  { id: "e2", track_name: "Take It Easy", artist: "Eagles", album: "Eagles", album_cover: "https://picsum.photos/seed/e2/300/300", moods: ["feliz", "chill"], is_new_discovery: false, youtubeId: "UI3F687SsoU" },
  
  // Billie Eilish
  { id: "be1", track_name: "bad guy", artist: "Billie Eilish", album: "WHEN WE ALL FALL ASLEEP", album_cover: "https://i.scdn.co/image/ab67616d0000b27350a3147b4edd7701a876c6ce", moods: ["energético", "nervioso"], is_new_discovery: true, youtubeId: "DyDfgMOUjCI" },
  { id: "be2", track_name: "when the party's over", artist: "Billie Eilish", album: "WHEN WE ALL FALL ASLEEP", album_cover: "https://i.scdn.co/image/ab67616d0000b27350a3147b4edd7701a876c6ce", moods: ["triste", "melancólico"], is_new_discovery: true, youtubeId: "pbMwTqkKSps" },
  
  // Coldplay
  { id: "cp1", track_name: "Yellow", artist: "Coldplay", album: "Parachutes", album_cover: "https://picsum.photos/seed/cp1/300/300", moods: ["nostálgico", "enamorado"], is_new_discovery: false, youtubeId: "yKNxeF4KMsY" },
  { id: "cp2", track_name: "Fix You", artist: "Coldplay", album: "X&Y", album_cover: "https://picsum.photos/seed/cp2/300/300", moods: ["triste", "motivado"], is_new_discovery: true, youtubeId: "k4V3Mo61fJM" },
  { id: "cp3", track_name: "Viva La Vida", artist: "Coldplay", album: "Viva la Vida", album_cover: "https://picsum.photos/seed/cp3/300/300", moods: ["energético", "motivado"], is_new_discovery: true, youtubeId: "dvgZkm1xWPE" },
  
  // Fleetwood Mac
  { id: "fm1", track_name: "Dreams", artist: "Fleetwood Mac", album: "Rumours", album_cover: "https://i.scdn.co/image/ab67616d0000b273e52a59a28eff4b73c01bf0b2", moods: ["nostálgico", "chill"], is_new_discovery: false, youtubeId: "mrZRURcb1cM" },
  { id: "fm2", track_name: "The Chain", artist: "Fleetwood Mac", album: "Rumours", album_cover: "https://i.scdn.co/image/ab67616d0000b273e52a59a28eff4b73c01bf0b2", moods: ["energético", "motivado"], is_new_discovery: true, youtubeId: "JDG2m5hN1vo" },
  
  // Adele
  { id: "ad1", track_name: "Someone Like You", artist: "Adele", album: "21", album_cover: "https://i.scdn.co/image/ab67616d0000b2732118bf9b198b05a95ded6300", moods: ["triste", "nostálgico"], is_new_discovery: false, youtubeId: "hLQl3WQQoQ0" },
  { id: "ad2", track_name: "Rolling in the Deep", artist: "Adele", album: "21", album_cover: "https://i.scdn.co/image/ab67616d0000b2732118bf9b198b05a95ded6300", moods: ["energético", "motivado"], is_new_discovery: true, youtubeId: "rYEDA3JcQqw" },
  
  // Frank Ocean
  { id: "fo1", track_name: "Thinkin Bout You", artist: "Frank Ocean", album: "channel ORANGE", album_cover: "https://picsum.photos/seed/fo1/300/300", moods: ["nostálgico", "enamorado"], is_new_discovery: true, youtubeId: "6JRhw_DM4I4" },
  { id: "fo2", track_name: "Nights", artist: "Frank Ocean", album: "Blonde", album_cover: "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526", moods: ["melancólico", "chill"], is_new_discovery: true, youtubeId: "r4l9bFqgMaQ" },
  
  // Radiohead
  { id: "rh1", track_name: "Creep", artist: "Radiohead", album: "Pablo Honey", album_cover: "https://picsum.photos/seed/rh1/300/300", moods: ["triste", "nervioso"], is_new_discovery: false, youtubeId: "XFkzRNyygfk" },
  { id: "rh2", track_name: "Karma Police", artist: "Radiohead", album: "OK Computer", album_cover: "https://picsum.photos/seed/rh2/300/300", moods: ["melancólico", "nostálgico"], is_new_discovery: true, youtubeId: "1uYWYWPc9HU" },
  
  // Bob Marley
  { id: "bm1", track_name: "Three Little Birds", artist: "Bob Marley & The Wailers", album: "Exodus", album_cover: "https://picsum.photos/seed/bm1/300/300", moods: ["feliz", "chill"], is_new_discovery: false, youtubeId: "zaGUr6wzyT8" },
  { id: "bm2", track_name: "One Love", artist: "Bob Marley & The Wailers", album: "Exodus", album_cover: "https://picsum.photos/seed/bm2/300/300", moods: ["enamorado", "chill"], is_new_discovery: true, youtubeId: "vdB-8eLEW8g" },
  
  // Guns N' Roses
  { id: "gnr1", track_name: "Sweet Child O' Mine", artist: "Guns N' Roses", album: "Appetite for Destruction", album_cover: "https://i.scdn.co/image/ab67616d0000b27321ebf49b3292c3f0f575f0f5", moods: ["energético", "enamorado"], is_new_discovery: false, youtubeId: "1w7OgIMMRc4" },
  { id: "gnr2", track_name: "November Rain", artist: "Guns N' Roses", album: "Use Your Illusion I", album_cover: "https://picsum.photos/seed/gnr2/300/300", moods: ["melancólico", "nostálgico"], is_new_discovery: true, youtubeId: "8SbUC-UaAxE" },
  
  // Nirvana
  { id: "n1", track_name: "Smells Like Teen Spirit", artist: "Nirvana", album: "Nevermind", album_cover: "https://picsum.photos/seed/n1/300/300", moods: ["energético", "nervioso"], is_new_discovery: false, youtubeId: "hTWKbfoikeg" },
  { id: "n2", track_name: "Come As You Are", artist: "Nirvana", album: "Nevermind", album_cover: "https://picsum.photos/seed/n2/300/300", moods: ["chill", "nostálgico"], is_new_discovery: true, youtubeId: "vabnZ9-ex7o" },
  
  // David Bowie
  { id: "db1", track_name: "Heroes", artist: "David Bowie", album: "Heroes", album_cover: "https://picsum.photos/seed/db1/300/300", moods: ["motivado", "energético"], is_new_discovery: false, youtubeId: "lXgkuM2NhYI" },
  { id: "db2", track_name: "Space Oddity", artist: "David Bowie", album: "David Bowie", album_cover: "https://picsum.photos/seed/db2/300/300", moods: ["nostálgico", "melancólico"], is_new_discovery: true, youtubeId: "iYYRH4apXDo" },
  
  // Bad Bunny
  { id: "bb3", track_name: "Tití Me Preguntó", artist: "Bad Bunny", album: "Un Verano Sin Ti", album_cover: "https://picsum.photos/seed/bb3/300/300", moods: ["feliz", "energético"], is_new_discovery: true, youtubeId: "aYbJXM66M_s" },
  { id: "bb4", track_name: "Me Porto Bonito", artist: "Bad Bunny", album: "Un Verano Sin Ti", album_cover: "https://picsum.photos/seed/bb4/300/300", moods: ["feliz", "enamorado"], is_new_discovery: true, youtubeId: "saGYMhApaH8" },
  { id: "bb5", track_name: "Yo Perreo Sola", artist: "Bad Bunny", album: "YHLQMDLG", album_cover: "https://picsum.photos/seed/bb5/300/300", moods: ["energético", "motivado"], is_new_discovery: false, youtubeId: "GtSRKwDCaZM" },
  { id: "bb6", track_name: "Callaita", artist: "Bad Bunny", album: "X 100PRE", album_cover: "https://picsum.photos/seed/bb6/300/300", moods: ["chill", "nostálgico"], is_new_discovery: true, youtubeId: "RgULjdsjiLQ" },
  
  // J Balvin
  { id: "jb1", track_name: "Mi Gente", artist: "J Balvin", album: "Vibras", album_cover: "https://picsum.photos/seed/jb1/300/300", moods: ["feliz", "energético"], is_new_discovery: false, youtubeId: "wnJ6LuUFpMo" },
  { id: "jb2", track_name: "Rojo", artist: "J Balvin", album: "Colores", album_cover: "https://picsum.photos/seed/jb2/300/300", moods: ["enamorado", "energético"], is_new_discovery: true, youtubeId: "glPOc-WW8rI" },
  { id: "jb3", track_name: "Ay Vamos", artist: "J Balvin", album: "Energía", album_cover: "https://picsum.photos/seed/jb3/300/300", moods: ["feliz", "motivado"], is_new_discovery: true, youtubeId: "hr4knvNNgtU" },
  
  // Karol G
  { id: "kg1", track_name: "Tusa", artist: "Karol G", album: "Ocean", album_cover: "https://picsum.photos/seed/kg1/300/300", moods: ["triste", "energético"], is_new_discovery: false, youtubeId: "tbneQDc2H3I" },
  { id: "kg2", track_name: "Bichota", artist: "Karol G", album: "KG0516", album_cover: "https://picsum.photos/seed/kg2/300/300", moods: ["motivado", "energético"], is_new_discovery: true, youtubeId: "QaXhVryxVBk" },
  { id: "kg3", track_name: "Cairo", artist: "Karol G", album: "Mañana Será Bonito", album_cover: "https://picsum.photos/seed/kg3/300/300", moods: ["feliz", "chill"], is_new_discovery: true, youtubeId: "jXJp_R0f0XY" },
  
  // The Weeknd
  { id: "tw1", track_name: "Blinding Lights", artist: "The Weeknd", album: "After Hours", album_cover: "https://picsum.photos/seed/tw1/300/300", moods: ["energético", "nostálgico"], is_new_discovery: false, youtubeId: "4NRXx6U8ABQ" },
  { id: "tw2", track_name: "Save Your Tears", artist: "The Weeknd", album: "After Hours", album_cover: "https://picsum.photos/seed/tw2/300/300", moods: ["triste", "nostálgico"], is_new_discovery: true, youtubeId: "XXYlFuWEuKI" },
  { id: "tw3", track_name: "Starboy", artist: "The Weeknd", album: "Starboy", album_cover: "https://picsum.photos/seed/tw3/300/300", moods: ["motivado", "energético"], is_new_discovery: true, youtubeId: "34Na4j8AVgA" },
  
  // Drake
  { id: "dr1", track_name: "One Dance", artist: "Drake", album: "Views", album_cover: "https://picsum.photos/seed/dr1/300/300", moods: ["chill", "enamorado"], is_new_discovery: false, youtubeId: "BSzSn-PRdtI" },
  { id: "dr2", track_name: "God's Plan", artist: "Drake", album: "Scorpion", album_cover: "https://picsum.photos/seed/dr2/300/300", moods: ["motivado", "feliz"], is_new_discovery: true, youtubeId: "xpVfcZ0ZcFM" },
  { id: "dr3", track_name: "Hotline Bling", artist: "Drake", album: "Views", album_cover: "https://picsum.photos/seed/dr3/300/300", moods: ["nostálgico", "chill"], is_new_discovery: true, youtubeId: "uxpDa-c-4Mc" },
  
  // Post Malone
  { id: "pm1", track_name: "Circles", artist: "Post Malone", album: "Hollywood's Bleeding", album_cover: "https://picsum.photos/seed/pm1/300/300", moods: ["melancólico", "chill"], is_new_discovery: false, youtubeId: "wXhTHyIgQ_U" },
  { id: "pm2", track_name: "Sunflower", artist: "Post Malone", album: "Spider-Man: Into the Spider-Verse", album_cover: "https://picsum.photos/seed/pm2/300/300", moods: ["feliz", "chill"], is_new_discovery: true, youtubeId: "ApXoWvfEYVU" },
  { id: "pm3", track_name: "Rockstar", artist: "Post Malone", album: "Beerbongs & Bentleys", album_cover: "https://picsum.photos/seed/pm3/300/300", moods: ["energético", "motivado"], is_new_discovery: true, youtubeId: "UceaB4D0jpo" },
  
  // Calvin Harris
  { id: "ch1", track_name: "Summer", artist: "Calvin Harris", album: "Motion", album_cover: "https://picsum.photos/seed/ch1/300/300", moods: ["feliz", "energético"], is_new_discovery: false, youtubeId: "ebXbLfLACGM" },
  { id: "ch2", track_name: "Feel So Close", artist: "Calvin Harris", album: "18 Months", album_cover: "https://picsum.photos/seed/ch2/300/300", moods: ["feliz", "enamorado"], is_new_discovery: true, youtubeId: "dGghkjpNCQ8" },
  { id: "ch3", track_name: "This Is What You Came For", artist: "Calvin Harris", album: "Single", album_cover: "https://picsum.photos/seed/ch3/300/300", moods: ["energético", "motivado"], is_new_discovery: true, youtubeId: "kOkQ4T5WO9E" },
  
  // Daft Punk
  { id: "dp1", track_name: "Get Lucky", artist: "Daft Punk", album: "Random Access Memories", album_cover: "https://picsum.photos/seed/dp1/300/300", moods: ["feliz", "chill"], is_new_discovery: false, youtubeId: "5NV6Rdv1a3I" },
  { id: "dp2", track_name: "One More Time", artist: "Daft Punk", album: "Discovery", album_cover: "https://picsum.photos/seed/dp2/300/300", moods: ["feliz", "energético"], is_new_discovery: true, youtubeId: "FGBhQbmPwH8" },
  { id: "dp3", track_name: "Instant Crush", artist: "Daft Punk", album: "Random Access Memories", album_cover: "https://picsum.photos/seed/dp3/300/300", moods: ["nostálgico", "enamorado"], is_new_discovery: true, youtubeId: "a5uQMwRMHcs" },
  
  // SZA
  { id: "sz1", track_name: "Kill Bill", artist: "SZA", album: "SOS", album_cover: "https://picsum.photos/seed/sz1/300/300", moods: ["triste", "energético"], is_new_discovery: false, youtubeId: "CJE8W4YkVlI" },
  { id: "sz2", track_name: "Good Days", artist: "SZA", album: "Single", album_cover: "https://picsum.photos/seed/sz2/300/300", moods: ["chill", "nostálgico"], is_new_discovery: true, youtubeId: "U5fJK2VQ8b0" },
  { id: "sz3", track_name: "The Weekend", artist: "SZA", album: "Ctrl", album_cover: "https://picsum.photos/seed/sz3/300/300", moods: ["enamorado", "triste"], is_new_discovery: true, youtubeId: "dU5EBw-ec7E" },
  
  // Bruno Mars
  { id: "brm1", track_name: "Uptown Funk", artist: "Bruno Mars", album: "Uptown Special", album_cover: "https://picsum.photos/seed/brm1/300/300", moods: ["feliz", "energético"], is_new_discovery: false, youtubeId: "OPf0YbXqDm0" },
  { id: "brm2", track_name: "Just The Way You Are", artist: "Bruno Mars", album: "Doo-Wops & Hooligans", album_cover: "https://picsum.photos/seed/brm2/300/300", moods: ["enamorado", "feliz"], is_new_discovery: true, youtubeId: "LjhCEhWiKXk" },
  { id: "brm3", track_name: "24K Magic", artist: "Bruno Mars", album: "24K Magic", album_cover: "https://picsum.photos/seed/brm3/300/300", moods: ["feliz", "energético"], is_new_discovery: true, youtubeId: "UqyT8IEBkvY" },
  
  // Ed Sheeran
  { id: "es1", track_name: "Shape of You", artist: "Ed Sheeran", album: "÷", album_cover: "https://picsum.photos/seed/es1/300/300", moods: ["enamorado", "energético"], is_new_discovery: false, youtubeId: "JGwWNGJdvx8" },
  { id: "es2", track_name: "Perfect", artist: "Ed Sheeran", album: "÷", album_cover: "https://picsum.photos/seed/es2/300/300", moods: ["enamorado", "feliz"], is_new_discovery: true, youtubeId: "2Vv-BfVoq4g" },
  { id: "es3", track_name: "Thinking Out Loud", artist: "Ed Sheeran", album: "x", album_cover: "https://picsum.photos/seed/es3/300/300", moods: ["enamorado", "chill"], is_new_discovery: true, youtubeId: "lp-EO5I60KA" },
  
  // Imagine Dragons
  { id: "id1", track_name: "Believer", artist: "Imagine Dragons", album: "Evolve", album_cover: "https://picsum.photos/seed/id1/300/300", moods: ["motivado", "energético"], is_new_discovery: false, youtubeId: "7wtfhZwyrcc" },
  { id: "id2", track_name: "Radioactive", artist: "Imagine Dragons", album: "Night Visions", album_cover: "https://picsum.photos/seed/id2/300/300", moods: ["energético", "motivado"], is_new_discovery: true, youtubeId: "ktvTqknDobU" },
  { id: "id3", track_name: "Thunder", artist: "Imagine Dragons", album: "Evolve", album_cover: "https://picsum.photos/seed/id3/300/300", moods: ["motivado", "feliz"], is_new_discovery: true, youtubeId: "fKopy74weus" },
  
  // Tame Impala
  { id: "ti1", track_name: "The Less I Know The Better", artist: "Tame Impala", album: "Currents", album_cover: "https://picsum.photos/seed/ti1/300/300", moods: ["nostálgico", "chill"], is_new_discovery: false, youtubeId: "sBzrzS1Ag_g" },
  { id: "ti2", track_name: "Let It Happen", artist: "Tame Impala", album: "Currents", album_cover: "https://picsum.photos/seed/ti2/300/300", moods: ["chill", "melancólico"], is_new_discovery: true, youtubeId: "pFptt7Cargc" },
  { id: "ti3", track_name: "Borderline", artist: "Tame Impala", album: "The Slow Rush", album_cover: "https://picsum.photos/seed/ti3/300/300", moods: ["nostálgico", "energético"], is_new_discovery: true, youtubeId: "2g5xkLqIElU" },
  
  // Red Hot Chili Peppers
  { id: "rhcp1", track_name: "Under The Bridge", artist: "Red Hot Chili Peppers", album: "Blood Sugar Sex Magik", album_cover: "https://picsum.photos/seed/rhcp1/300/300", moods: ["melancólico", "nostálgico"], is_new_discovery: false, youtubeId: "GLvohMXgcBo" },
  { id: "rhcp2", track_name: "Californication", artist: "Red Hot Chili Peppers", album: "Californication", album_cover: "https://picsum.photos/seed/rhcp2/300/300", moods: ["nostálgico", "chill"], is_new_discovery: true, youtubeId: "YlUKcNNmywk" },
  { id: "rhcp3", track_name: "Can't Stop", artist: "Red Hot Chili Peppers", album: "By The Way", album_cover: "https://picsum.photos/seed/rhcp3/300/300", moods: ["energético", "motivado"], is_new_discovery: true, youtubeId: "8DyziWtkfBw" },
  
  // Foo Fighters
  { id: "ff1", track_name: "Everlong", artist: "Foo Fighters", album: "The Colour and the Shape", album_cover: "https://picsum.photos/seed/ff1/300/300", moods: ["nostálgico", "energético"], is_new_discovery: false, youtubeId: "eBG7P-K-r1Y" },
  { id: "ff2", track_name: "Learn to Fly", artist: "Foo Fighters", album: "There Is Nothing Left to Lose", album_cover: "https://picsum.photos/seed/ff2/300/300", moods: ["motivado", "feliz"], is_new_discovery: true, youtubeId: "1VQ_3sBZEm0" },
  { id: "ff3", track_name: "Best of You", artist: "Foo Fighters", album: "In Your Honor", album_cover: "https://picsum.photos/seed/ff3/300/300", moods: ["motivado", "energético"], is_new_discovery: true, youtubeId: "h_L4Rixya64" },
  
  // Gorillaz
  { id: "gz1", track_name: "Feel Good Inc.", artist: "Gorillaz", album: "Demon Days", album_cover: "https://picsum.photos/seed/gz1/300/300", moods: ["energético", "chill"], is_new_discovery: false, youtubeId: "HyHNuVaZJ-k" },
  { id: "gz2", track_name: "Clint Eastwood", artist: "Gorillaz", album: "Gorillaz", album_cover: "https://picsum.photos/seed/gz2/300/300", moods: ["chill", "nostálgico"], is_new_discovery: true, youtubeId: "1V_xRb0x9aw" },
  { id: "gz3", track_name: "On Melancholy Hill", artist: "Gorillaz", album: "Plastic Beach", album_cover: "https://picsum.photos/seed/gz3/300/300", moods: ["melancólico", "chill"], is_new_discovery: true, youtubeId: "04mfKJWDSzI" },
  
  // Mac DeMarco
  { id: "md4", track_name: "Chamber of Reflection", artist: "Mac DeMarco", album: "Salad Days", album_cover: "https://picsum.photos/seed/md4/300/300", moods: ["melancólico", "chill"], is_new_discovery: false, youtubeId: "NY8IS0ssnXQ" },
  { id: "md5", track_name: "My Kind of Woman", artist: "Mac DeMarco", album: "2", album_cover: "https://picsum.photos/seed/md5/300/300", moods: ["enamorado", "chill"], is_new_discovery: true, youtubeId: "wIuBcb2T55Q" },
  { id: "md6", track_name: "Ode to Viceroy", artist: "Mac DeMarco", album: "2", album_cover: "https://picsum.photos/seed/md6/300/300", moods: ["chill", "feliz"], is_new_discovery: true, youtubeId: "6bfTTeZOrs4" },
  
  // Tyler, The Creator
  { id: "ttc1", track_name: "See You Again", artist: "Tyler, The Creator", album: "Flower Boy", album_cover: "https://picsum.photos/seed/ttc1/300/300", moods: ["nostálgico", "chill"], is_new_discovery: false, youtubeId: "Fb_nJVkEGX4" },
  { id: "ttc2", track_name: "EARFQUAKE", artist: "Tyler, The Creator", album: "IGOR", album_cover: "https://picsum.photos/seed/ttc2/300/300", moods: ["enamorado", "nervioso"], is_new_discovery: true, youtubeId: "HmAsUQEFYGI" },
  { id: "ttc3", track_name: "Yonkers", artist: "Tyler, The Creator", album: "Goblin", album_cover: "https://picsum.photos/seed/ttc3/300/300", moods: ["energético", "nervioso"], is_new_discovery: true, youtubeId: "XSbZidsgMfw" },
  
  // Kendrick Lamar
  { id: "kl1", track_name: "HUMBLE.", artist: "Kendrick Lamar", album: "DAMN.", album_cover: "https://picsum.photos/seed/kl1/300/300", moods: ["motivado", "energético"], is_new_discovery: false, youtubeId: "tvTRZJ-4EyI" },
  { id: "kl2", track_name: "Swimming Pools", artist: "Kendrick Lamar", album: "good kid, m.A.A.d city", album_cover: "https://picsum.photos/seed/kl2/300/300", moods: ["chill", "nostálgico"], is_new_discovery: true, youtubeId: "B5YNiCfWC3A" },
  { id: "kl3", track_name: "Alright", artist: "Kendrick Lamar", album: "To Pimp a Butterfly", album_cover: "https://picsum.photos/seed/kl3/300/300", moods: ["motivado", "feliz"], is_new_discovery: true, youtubeId: "Z-48u_uWMHY" },
  
  // Lana Del Rey
  { id: "ldr1", track_name: "Summertime Sadness", artist: "Lana Del Rey", album: "Born To Die", album_cover: "https://picsum.photos/seed/ldr1/300/300", moods: ["triste", "nostálgico"], is_new_discovery: false, youtubeId: "TdrL3QxjyVw" },
  { id: "ldr2", track_name: "Video Games", artist: "Lana Del Rey", album: "Born To Die", album_cover: "https://picsum.photos/seed/ldr2/300/300", moods: ["melancólico", "nostálgico"], is_new_discovery: true, youtubeId: "cE6wxDqdOV0" },
  { id: "ldr3", track_name: "Young and Beautiful", artist: "Lana Del Rey", album: "The Great Gatsby", album_cover: "https://picsum.photos/seed/ldr3/300/300", moods: ["enamorado", "triste"], is_new_discovery: true, youtubeId: "o_1aF54DO60" },
  
  // The Strokes
  { id: "ts4", track_name: "Someday", artist: "The Strokes", album: "Is This It", album_cover: "https://picsum.photos/seed/ts4/300/300", moods: ["nostálgico", "energético"], is_new_discovery: false, youtubeId: "knU9gRUWCno" },
  { id: "ts5", track_name: "Last Nite", artist: "The Strokes", album: "Is This It", album_cover: "https://picsum.photos/seed/ts5/300/300", moods: ["energético", "chill"], is_new_discovery: true, youtubeId: "TOypSnKFHrE" },
  { id: "ts6", track_name: "Reptilia", artist: "The Strokes", album: "Room on Fire", album_cover: "https://picsum.photos/seed/ts6/300/300", moods: ["energético", "motivado"], is_new_discovery: true, youtubeId: "b8-tXG8KrWs" },
  
  // Rosalía
  { id: "ros1", track_name: "Malamente", artist: "Rosalía", album: "El Mal Querer", album_cover: "https://picsum.photos/seed/ros1/300/300", moods: ["energético", "motivado"], is_new_discovery: false, youtubeId: "Rht7rBHuXW8" },
  { id: "ros2", track_name: "Con Altura", artist: "Rosalía", album: "Single", album_cover: "https://picsum.photos/seed/ros2/300/300", moods: ["feliz", "energético"], is_new_discovery: true, youtubeId: "p7bfOZek9t4" },
  { id: "ros3", track_name: "La Fama", artist: "Rosalía", album: "Motomami", album_cover: "https://picsum.photos/seed/ros3/300/300", moods: ["energético", "motivado"], is_new_discovery: true, youtubeId: "KD0rLh6vV3I" },
  
  // Shakira
  { id: "sh1", track_name: "Hips Don't Lie", artist: "Shakira", album: "Oral Fixation, Vol. 2", album_cover: "https://picsum.photos/seed/sh1/300/300", moods: ["feliz", "energético"], is_new_discovery: false, youtubeId: "DUT5rEU6pqM" },
  { id: "sh2", track_name: "Whenever, Wherever", artist: "Shakira", album: "Laundry Service", album_cover: "https://picsum.photos/seed/sh2/300/300", moods: ["feliz", "enamorado"], is_new_discovery: true, youtubeId: "weRHyjj34ZE" },
  { id: "sh3", track_name: "Waka Waka", artist: "Shakira", album: "Sale el Sol", album_cover: "https://picsum.photos/seed/sh3/300/300", moods: ["feliz", "motivado"], is_new_discovery: true, youtubeId: "pRpeEdMmmQ0" },
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
