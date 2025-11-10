export interface TrackData {
  id: string;
  track_name: string;
  artist: string;
  album: string;
  album_cover: string;
  moods: string[];
  is_new_discovery?: boolean;
}

// Catálogo estático de canciones
export const TRACK_CATALOG: TrackData[] = [
  // Arctic Monkeys
  { id: "am1", track_name: "Do I Wanna Know?", artist: "Arctic Monkeys", album: "AM", album_cover: "https://i.scdn.co/image/ab67616d0000b273eda3e91f6f8fdb8c82de68a", moods: ["nostálgico", "chill", "melancólico"], is_new_discovery: false },
  { id: "am2", track_name: "R U Mine?", artist: "Arctic Monkeys", album: "AM", album_cover: "https://i.scdn.co/image/ab67616d0000b273eda3e91f6f8fdb8c82de68a", moods: ["energético", "motivado"], is_new_discovery: true },
  { id: "am3", track_name: "Why'd You Only Call Me When You're High?", artist: "Arctic Monkeys", album: "AM", album_cover: "https://i.scdn.co/image/ab67616d0000b273eda3e91f6f8fdb8c82de68a", moods: ["nostálgico", "triste"], is_new_discovery: true },
  { id: "am4", track_name: "Fluorescent Adolescent", artist: "Arctic Monkeys", album: "Favourite Worst Nightmare", album_cover: "https://i.scdn.co/image/ab67616d0000b273b1f8da74e20bc6c7e93589c3", moods: ["energético", "feliz"], is_new_discovery: true },
  
  // The Beatles
  { id: "tb1", track_name: "Here Comes The Sun", artist: "The Beatles", album: "Abbey Road", album_cover: "https://i.scdn.co/image/ab67616d0000b2734ce8b4e42588bf18182a1ad2", moods: ["feliz", "chill"], is_new_discovery: false },
  { id: "tb2", track_name: "Let It Be", artist: "The Beatles", album: "Let It Be", album_cover: "https://i.scdn.co/image/ab67616d0000b273dc30583ba717007b00cceb25", moods: ["nostálgico", "chill"], is_new_discovery: true },
  { id: "tb3", track_name: "Hey Jude", artist: "The Beatles", album: "Hey Jude", album_cover: "https://i.scdn.co/image/ab67616d0000b2734ba8e4b4f5fdd4c13186d0c2", moods: ["motivado", "feliz"], is_new_discovery: false },
  { id: "tb4", track_name: "Yesterday", artist: "The Beatles", album: "Help!", album_cover: "https://i.scdn.co/image/ab67616d0000b273e3e3b64cea45265469d4cafa", moods: ["nostálgico", "triste", "melancólico"], is_new_discovery: true },
  
  // Queen
  { id: "q1", track_name: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", album_cover: "https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a", moods: ["energético", "motivado"], is_new_discovery: false },
  { id: "q2", track_name: "Don't Stop Me Now", artist: "Queen", album: "Jazz", album_cover: "https://i.scdn.co/image/ab67616d0000b273ea6f1b560d6cddf3fb62ec19", moods: ["feliz", "energético", "motivado"], is_new_discovery: true },
  { id: "q3", track_name: "Somebody To Love", artist: "Queen", album: "A Day at the Races", album_cover: "https://i.scdn.co/image/ab67616d0000b2735c7f3a0b8c65f2d73e1c6640", moods: ["enamorado", "energético"], is_new_discovery: true },
  { id: "q4", track_name: "We Are The Champions", artist: "Queen", album: "News of the World", album_cover: "https://i.scdn.co/image/ab67616d0000b273a20a48c0ec1632969f68c61c", moods: ["motivado", "feliz"], is_new_discovery: false },
  
  // Miles Davis
  { id: "md1", track_name: "So What", artist: "Miles Davis", album: "Kind of Blue", album_cover: "https://i.scdn.co/image/ab67616d0000b273c93aaae2c52b6b0e4dd7f8be", moods: ["chill", "melancólico"], is_new_discovery: true },
  { id: "md2", track_name: "Blue in Green", artist: "Miles Davis", album: "Kind of Blue", album_cover: "https://i.scdn.co/image/ab67616d0000b273c93aaae2c52b6b0e4dd7f8be", moods: ["triste", "melancólico", "chill"], is_new_discovery: true },
  { id: "md3", track_name: "Flamenco Sketches", artist: "Miles Davis", album: "Kind of Blue", album_cover: "https://i.scdn.co/image/ab67616d0000b273c93aaae2c52b6b0e4dd7f8be", moods: ["chill", "nostálgico"], is_new_discovery: true },
  
  // Jinsang (Lo-fi)
  { id: "js1", track_name: "We'll Be Fine", artist: "Jinsang", album: "Solitude", album_cover: "https://i.scdn.co/image/ab67616d0000b273a91c89c3bbf6cc9d3e6fccbb", moods: ["chill", "nostálgico"], is_new_discovery: false },
  { id: "js2", track_name: "Affection", artist: "Jinsang", album: "Life", album_cover: "https://i.scdn.co/image/ab67616d0000b2732b27e4d5d1da5b5c309a6beb", moods: ["chill", "enamorado"], is_new_discovery: true },
  { id: "js3", track_name: "Summer", artist: "Jinsang", album: "Life", album_cover: "https://i.scdn.co/image/ab67616d0000b2732b27e4d5d1da5b5c309a6beb", moods: ["feliz", "chill"], is_new_discovery: true },
  
  // Pharrell Williams
  { id: "pw1", track_name: "Happy", artist: "Pharrell Williams", album: "G I R L", album_cover: "https://i.scdn.co/image/ab67616d0000b273bf5b6dc3f7da49e6c22ffe85", moods: ["feliz", "energético"], is_new_discovery: false },
  
  // Taylor Swift
  { id: "ts1", track_name: "Shake It Off", artist: "Taylor Swift", album: "1989", album_cover: "https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647", moods: ["feliz", "energético"], is_new_discovery: true },
  { id: "ts2", track_name: "All Too Well", artist: "Taylor Swift", album: "Red", album_cover: "https://i.scdn.co/image/ab67616d0000b273318443aab3531a0558e79a4d", moods: ["triste", "nostálgico"], is_new_discovery: true },
  { id: "ts3", track_name: "Love Story", artist: "Taylor Swift", album: "Fearless", album_cover: "https://i.scdn.co/image/ab67616d0000b273904445d70d04eb24d6bb79ac", moods: ["enamorado", "feliz"], is_new_discovery: false },
  
  // Dua Lipa
  { id: "dl1", track_name: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", album_cover: "https://i.scdn.co/image/ab67616d0000b27377fdcfda6535601aff081b6a", moods: ["feliz", "energético"], is_new_discovery: true },
  { id: "dl2", track_name: "Don't Start Now", artist: "Dua Lipa", album: "Future Nostalgia", album_cover: "https://i.scdn.co/image/ab67616d0000b27377fdcfda6535601aff081b6a", moods: ["energético", "motivado"], is_new_discovery: true },
  
  // MGMT
  { id: "mg1", track_name: "Electric Feel", artist: "MGMT", album: "Oracular Spectacular", album_cover: "https://i.scdn.co/image/ab67616d0000b2738b32b139981e79f2ebe005c0", moods: ["energético", "feliz"], is_new_discovery: false },
  { id: "mg2", track_name: "Kids", artist: "MGMT", album: "Oracular Spectacular", album_cover: "https://i.scdn.co/image/ab67616d0000b2738b32b139981e79f2ebe005c0", moods: ["nostálgico", "energético"], is_new_discovery: true },
  
  // The 1975
  { id: "t751", track_name: "Somebody Else", artist: "The 1975", album: "I Like It When You Sleep", album_cover: "https://i.scdn.co/image/ab67616d0000b273b1c8b5e8f984c2c6bf49f8f1", moods: ["triste", "nostálgico"], is_new_discovery: false },
  { id: "t752", track_name: "Love It If We Made It", artist: "The 1975", album: "A Brief Inquiry Into Online Relationships", album_cover: "https://i.scdn.co/image/ab67616d0000b2730c4fc0f8e2473fb1833be18a", moods: ["energético", "nervioso"], is_new_discovery: true },
  
  // Glass Animals
  { id: "ga1", track_name: "Heat Waves", artist: "Glass Animals", album: "Dreamland", album_cover: "https://i.scdn.co/image/ab67616d0000b2739e495fb707973f3390850eea", moods: ["nostálgico", "chill"], is_new_discovery: true },
  { id: "ga2", track_name: "Tokyo Drifting", artist: "Glass Animals", album: "Dreamland", album_cover: "https://i.scdn.co/image/ab67616d0000b2739e495fb707973f3390850eea", moods: ["energético", "motivado"], is_new_discovery: true },
  
  // Beach Boys
  { id: "bb1", track_name: "Good Vibrations", artist: "The Beach Boys", album: "Smiley Smile", album_cover: "https://picsum.photos/seed/bb1/300/300", moods: ["feliz", "chill"], is_new_discovery: false },
  { id: "bb2", track_name: "Wouldn't It Be Nice", artist: "The Beach Boys", album: "Pet Sounds", album_cover: "https://picsum.photos/seed/bb2/300/300", moods: ["feliz", "enamorado"], is_new_discovery: true },
  
  // Eagles
  { id: "e1", track_name: "Hotel California", artist: "Eagles", album: "Hotel California", album_cover: "https://i.scdn.co/image/ab67616d0000b2734637341b9f507521afa9a778", moods: ["nostálgico", "chill"], is_new_discovery: true },
  { id: "e2", track_name: "Take It Easy", artist: "Eagles", album: "Eagles", album_cover: "https://picsum.photos/seed/e2/300/300", moods: ["feliz", "chill"], is_new_discovery: false },
  
  // Billie Eilish
  { id: "be1", track_name: "bad guy", artist: "Billie Eilish", album: "WHEN WE ALL FALL ASLEEP", album_cover: "https://i.scdn.co/image/ab67616d0000b27350a3147b4edd7701a876c6ce", moods: ["energético", "nervioso"], is_new_discovery: true },
  { id: "be2", track_name: "when the party's over", artist: "Billie Eilish", album: "WHEN WE ALL FALL ASLEEP", album_cover: "https://i.scdn.co/image/ab67616d0000b27350a3147b4edd7701a876c6ce", moods: ["triste", "melancólico"], is_new_discovery: true },
  
  // Coldplay
  { id: "cp1", track_name: "Yellow", artist: "Coldplay", album: "Parachutes", album_cover: "https://picsum.photos/seed/cp1/300/300", moods: ["nostálgico", "enamorado"], is_new_discovery: false },
  { id: "cp2", track_name: "Fix You", artist: "Coldplay", album: "X&Y", album_cover: "https://picsum.photos/seed/cp2/300/300", moods: ["triste", "motivado"], is_new_discovery: true },
  { id: "cp3", track_name: "Viva La Vida", artist: "Coldplay", album: "Viva la Vida", album_cover: "https://picsum.photos/seed/cp3/300/300", moods: ["energético", "motivado"], is_new_discovery: true },
  
  // Fleetwood Mac
  { id: "fm1", track_name: "Dreams", artist: "Fleetwood Mac", album: "Rumours", album_cover: "https://i.scdn.co/image/ab67616d0000b273e52a59a28eff4b73c01bf0b2", moods: ["nostálgico", "chill"], is_new_discovery: false },
  { id: "fm2", track_name: "The Chain", artist: "Fleetwood Mac", album: "Rumours", album_cover: "https://i.scdn.co/image/ab67616d0000b273e52a59a28eff4b73c01bf0b2", moods: ["energético", "motivado"], is_new_discovery: true },
  
  // Adele
  { id: "ad1", track_name: "Someone Like You", artist: "Adele", album: "21", album_cover: "https://i.scdn.co/image/ab67616d0000b2732118bf9b198b05a95ded6300", moods: ["triste", "nostálgico"], is_new_discovery: false },
  { id: "ad2", track_name: "Rolling in the Deep", artist: "Adele", album: "21", album_cover: "https://i.scdn.co/image/ab67616d0000b2732118bf9b198b05a95ded6300", moods: ["energético", "motivado"], is_new_discovery: true },
  
  // Frank Ocean
  { id: "fo1", track_name: "Thinkin Bout You", artist: "Frank Ocean", album: "channel ORANGE", album_cover: "https://picsum.photos/seed/fo1/300/300", moods: ["nostálgico", "enamorado"], is_new_discovery: true },
  { id: "fo2", track_name: "Nights", artist: "Frank Ocean", album: "Blonde", album_cover: "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526", moods: ["melancólico", "chill"], is_new_discovery: true },
  
  // Radiohead
  { id: "rh1", track_name: "Creep", artist: "Radiohead", album: "Pablo Honey", album_cover: "https://picsum.photos/seed/rh1/300/300", moods: ["triste", "nervioso"], is_new_discovery: false },
  { id: "rh2", track_name: "Karma Police", artist: "Radiohead", album: "OK Computer", album_cover: "https://picsum.photos/seed/rh2/300/300", moods: ["melancólico", "nostálgico"], is_new_discovery: true },
  
  // Bob Marley
  { id: "bm1", track_name: "Three Little Birds", artist: "Bob Marley & The Wailers", album: "Exodus", album_cover: "https://picsum.photos/seed/bm1/300/300", moods: ["feliz", "chill"], is_new_discovery: false },
  { id: "bm2", track_name: "One Love", artist: "Bob Marley & The Wailers", album: "Exodus", album_cover: "https://picsum.photos/seed/bm2/300/300", moods: ["enamorado", "chill"], is_new_discovery: true },
  
  // Guns N' Roses
  { id: "gnr1", track_name: "Sweet Child O' Mine", artist: "Guns N' Roses", album: "Appetite for Destruction", album_cover: "https://i.scdn.co/image/ab67616d0000b27321ebf49b3292c3f0f575f0f5", moods: ["energético", "enamorado"], is_new_discovery: false },
  { id: "gnr2", track_name: "November Rain", artist: "Guns N' Roses", album: "Use Your Illusion I", album_cover: "https://picsum.photos/seed/gnr2/300/300", moods: ["melancólico", "nostálgico"], is_new_discovery: true },
  
  // Nirvana
  { id: "n1", track_name: "Smells Like Teen Spirit", artist: "Nirvana", album: "Nevermind", album_cover: "https://picsum.photos/seed/n1/300/300", moods: ["energético", "nervioso"], is_new_discovery: false },
  { id: "n2", track_name: "Come As You Are", artist: "Nirvana", album: "Nevermind", album_cover: "https://picsum.photos/seed/n2/300/300", moods: ["chill", "nostálgico"], is_new_discovery: true },
  
  // David Bowie
  { id: "db1", track_name: "Heroes", artist: "David Bowie", album: "Heroes", album_cover: "https://picsum.photos/seed/db1/300/300", moods: ["motivado", "energético"], is_new_discovery: false },
  { id: "db2", track_name: "Space Oddity", artist: "David Bowie", album: "David Bowie", album_cover: "https://picsum.photos/seed/db2/300/300", moods: ["nostálgico", "melancólico"], is_new_discovery: true },
  
  // Bad Bunny
  { id: "bb3", track_name: "Tití Me Preguntó", artist: "Bad Bunny", album: "Un Verano Sin Ti", album_cover: "https://picsum.photos/seed/bb3/300/300", moods: ["feliz", "energético"], is_new_discovery: true },
  { id: "bb4", track_name: "Me Porto Bonito", artist: "Bad Bunny", album: "Un Verano Sin Ti", album_cover: "https://picsum.photos/seed/bb4/300/300", moods: ["feliz", "enamorado"], is_new_discovery: true },
  { id: "bb5", track_name: "Yo Perreo Sola", artist: "Bad Bunny", album: "YHLQMDLG", album_cover: "https://picsum.photos/seed/bb5/300/300", moods: ["energético", "motivado"], is_new_discovery: false },
  { id: "bb6", track_name: "Callaita", artist: "Bad Bunny", album: "X 100PRE", album_cover: "https://picsum.photos/seed/bb6/300/300", moods: ["chill", "nostálgico"], is_new_discovery: true },
  
  // J Balvin
  { id: "jb1", track_name: "Mi Gente", artist: "J Balvin", album: "Vibras", album_cover: "https://picsum.photos/seed/jb1/300/300", moods: ["feliz", "energético"], is_new_discovery: false },
  { id: "jb2", track_name: "Rojo", artist: "J Balvin", album: "Colores", album_cover: "https://picsum.photos/seed/jb2/300/300", moods: ["enamorado", "energético"], is_new_discovery: true },
  { id: "jb3", track_name: "Ay Vamos", artist: "J Balvin", album: "Energía", album_cover: "https://picsum.photos/seed/jb3/300/300", moods: ["feliz", "motivado"], is_new_discovery: true },
  
  // Karol G
  { id: "kg1", track_name: "Tusa", artist: "Karol G", album: "Ocean", album_cover: "https://picsum.photos/seed/kg1/300/300", moods: ["triste", "energético"], is_new_discovery: false },
  { id: "kg2", track_name: "Bichota", artist: "Karol G", album: "KG0516", album_cover: "https://picsum.photos/seed/kg2/300/300", moods: ["motivado", "energético"], is_new_discovery: true },
  { id: "kg3", track_name: "Cairo", artist: "Karol G", album: "Mañana Será Bonito", album_cover: "https://picsum.photos/seed/kg3/300/300", moods: ["feliz", "chill"], is_new_discovery: true },
  
  // The Weeknd
  { id: "tw1", track_name: "Blinding Lights", artist: "The Weeknd", album: "After Hours", album_cover: "https://picsum.photos/seed/tw1/300/300", moods: ["energético", "nostálgico"], is_new_discovery: false },
  { id: "tw2", track_name: "Save Your Tears", artist: "The Weeknd", album: "After Hours", album_cover: "https://picsum.photos/seed/tw2/300/300", moods: ["triste", "nostálgico"], is_new_discovery: true },
  { id: "tw3", track_name: "Starboy", artist: "The Weeknd", album: "Starboy", album_cover: "https://picsum.photos/seed/tw3/300/300", moods: ["motivado", "energético"], is_new_discovery: true },
  
  // Drake
  { id: "dr1", track_name: "One Dance", artist: "Drake", album: "Views", album_cover: "https://picsum.photos/seed/dr1/300/300", moods: ["chill", "enamorado"], is_new_discovery: false },
  { id: "dr2", track_name: "God's Plan", artist: "Drake", album: "Scorpion", album_cover: "https://picsum.photos/seed/dr2/300/300", moods: ["motivado", "feliz"], is_new_discovery: true },
  { id: "dr3", track_name: "Hotline Bling", artist: "Drake", album: "Views", album_cover: "https://picsum.photos/seed/dr3/300/300", moods: ["nostálgico", "chill"], is_new_discovery: true },
  
  // Post Malone
  { id: "pm1", track_name: "Circles", artist: "Post Malone", album: "Hollywood's Bleeding", album_cover: "https://picsum.photos/seed/pm1/300/300", moods: ["melancólico", "chill"], is_new_discovery: false },
  { id: "pm2", track_name: "Sunflower", artist: "Post Malone", album: "Spider-Man: Into the Spider-Verse", album_cover: "https://picsum.photos/seed/pm2/300/300", moods: ["feliz", "chill"], is_new_discovery: true },
  { id: "pm3", track_name: "Rockstar", artist: "Post Malone", album: "Beerbongs & Bentleys", album_cover: "https://picsum.photos/seed/pm3/300/300", moods: ["energético", "motivado"], is_new_discovery: true },
  
  // Calvin Harris
  { id: "ch1", track_name: "Summer", artist: "Calvin Harris", album: "Motion", album_cover: "https://picsum.photos/seed/ch1/300/300", moods: ["feliz", "energético"], is_new_discovery: false },
  { id: "ch2", track_name: "Feel So Close", artist: "Calvin Harris", album: "18 Months", album_cover: "https://picsum.photos/seed/ch2/300/300", moods: ["feliz", "enamorado"], is_new_discovery: true },
  { id: "ch3", track_name: "This Is What You Came For", artist: "Calvin Harris", album: "Single", album_cover: "https://picsum.photos/seed/ch3/300/300", moods: ["energético", "motivado"], is_new_discovery: true },
  
  // Daft Punk
  { id: "dp1", track_name: "Get Lucky", artist: "Daft Punk", album: "Random Access Memories", album_cover: "https://picsum.photos/seed/dp1/300/300", moods: ["feliz", "chill"], is_new_discovery: false },
  { id: "dp2", track_name: "One More Time", artist: "Daft Punk", album: "Discovery", album_cover: "https://picsum.photos/seed/dp2/300/300", moods: ["feliz", "energético"], is_new_discovery: true },
  { id: "dp3", track_name: "Instant Crush", artist: "Daft Punk", album: "Random Access Memories", album_cover: "https://picsum.photos/seed/dp3/300/300", moods: ["nostálgico", "enamorado"], is_new_discovery: true },
  
  // SZA
  { id: "sz1", track_name: "Kill Bill", artist: "SZA", album: "SOS", album_cover: "https://picsum.photos/seed/sz1/300/300", moods: ["triste", "energético"], is_new_discovery: false },
  { id: "sz2", track_name: "Good Days", artist: "SZA", album: "Single", album_cover: "https://picsum.photos/seed/sz2/300/300", moods: ["chill", "nostálgico"], is_new_discovery: true },
  { id: "sz3", track_name: "The Weekend", artist: "SZA", album: "Ctrl", album_cover: "https://picsum.photos/seed/sz3/300/300", moods: ["enamorado", "triste"], is_new_discovery: true },
  
  // Bruno Mars
  { id: "brm1", track_name: "Uptown Funk", artist: "Bruno Mars", album: "Uptown Special", album_cover: "https://picsum.photos/seed/brm1/300/300", moods: ["feliz", "energético"], is_new_discovery: false },
  { id: "brm2", track_name: "Just The Way You Are", artist: "Bruno Mars", album: "Doo-Wops & Hooligans", album_cover: "https://picsum.photos/seed/brm2/300/300", moods: ["enamorado", "feliz"], is_new_discovery: true },
  { id: "brm3", track_name: "24K Magic", artist: "Bruno Mars", album: "24K Magic", album_cover: "https://picsum.photos/seed/brm3/300/300", moods: ["feliz", "energético"], is_new_discovery: true },
  
  // Ed Sheeran
  { id: "es1", track_name: "Shape of You", artist: "Ed Sheeran", album: "÷", album_cover: "https://picsum.photos/seed/es1/300/300", moods: ["enamorado", "energético"], is_new_discovery: false },
  { id: "es2", track_name: "Perfect", artist: "Ed Sheeran", album: "÷", album_cover: "https://picsum.photos/seed/es2/300/300", moods: ["enamorado", "feliz"], is_new_discovery: true },
  { id: "es3", track_name: "Thinking Out Loud", artist: "Ed Sheeran", album: "x", album_cover: "https://picsum.photos/seed/es3/300/300", moods: ["enamorado", "chill"], is_new_discovery: true },
  
  // Imagine Dragons
  { id: "id1", track_name: "Believer", artist: "Imagine Dragons", album: "Evolve", album_cover: "https://picsum.photos/seed/id1/300/300", moods: ["motivado", "energético"], is_new_discovery: false },
  { id: "id2", track_name: "Radioactive", artist: "Imagine Dragons", album: "Night Visions", album_cover: "https://picsum.photos/seed/id2/300/300", moods: ["energético", "motivado"], is_new_discovery: true },
  { id: "id3", track_name: "Thunder", artist: "Imagine Dragons", album: "Evolve", album_cover: "https://picsum.photos/seed/id3/300/300", moods: ["motivado", "feliz"], is_new_discovery: true },
  
  // Tame Impala
  { id: "ti1", track_name: "The Less I Know The Better", artist: "Tame Impala", album: "Currents", album_cover: "https://picsum.photos/seed/ti1/300/300", moods: ["nostálgico", "chill"], is_new_discovery: false },
  { id: "ti2", track_name: "Let It Happen", artist: "Tame Impala", album: "Currents", album_cover: "https://picsum.photos/seed/ti2/300/300", moods: ["chill", "melancólico"], is_new_discovery: true },
  { id: "ti3", track_name: "Borderline", artist: "Tame Impala", album: "The Slow Rush", album_cover: "https://picsum.photos/seed/ti3/300/300", moods: ["nostálgico", "energético"], is_new_discovery: true },
  
  // Red Hot Chili Peppers
  { id: "rhcp1", track_name: "Under The Bridge", artist: "Red Hot Chili Peppers", album: "Blood Sugar Sex Magik", album_cover: "https://picsum.photos/seed/rhcp1/300/300", moods: ["melancólico", "nostálgico"], is_new_discovery: false },
  { id: "rhcp2", track_name: "Californication", artist: "Red Hot Chili Peppers", album: "Californication", album_cover: "https://picsum.photos/seed/rhcp2/300/300", moods: ["nostálgico", "chill"], is_new_discovery: true },
  { id: "rhcp3", track_name: "Can't Stop", artist: "Red Hot Chili Peppers", album: "By The Way", album_cover: "https://picsum.photos/seed/rhcp3/300/300", moods: ["energético", "motivado"], is_new_discovery: true },
  
  // Foo Fighters
  { id: "ff1", track_name: "Everlong", artist: "Foo Fighters", album: "The Colour and the Shape", album_cover: "https://picsum.photos/seed/ff1/300/300", moods: ["nostálgico", "energético"], is_new_discovery: false },
  { id: "ff2", track_name: "Learn to Fly", artist: "Foo Fighters", album: "There Is Nothing Left to Lose", album_cover: "https://picsum.photos/seed/ff2/300/300", moods: ["motivado", "feliz"], is_new_discovery: true },
  { id: "ff3", track_name: "Best of You", artist: "Foo Fighters", album: "In Your Honor", album_cover: "https://picsum.photos/seed/ff3/300/300", moods: ["motivado", "energético"], is_new_discovery: true },
  
  // Gorillaz
  { id: "gz1", track_name: "Feel Good Inc.", artist: "Gorillaz", album: "Demon Days", album_cover: "https://picsum.photos/seed/gz1/300/300", moods: ["energético", "chill"], is_new_discovery: false },
  { id: "gz2", track_name: "Clint Eastwood", artist: "Gorillaz", album: "Gorillaz", album_cover: "https://picsum.photos/seed/gz2/300/300", moods: ["chill", "nostálgico"], is_new_discovery: true },
  { id: "gz3", track_name: "On Melancholy Hill", artist: "Gorillaz", album: "Plastic Beach", album_cover: "https://picsum.photos/seed/gz3/300/300", moods: ["melancólico", "chill"], is_new_discovery: true },
  
  // Mac DeMarco
  { id: "md4", track_name: "Chamber of Reflection", artist: "Mac DeMarco", album: "Salad Days", album_cover: "https://picsum.photos/seed/md4/300/300", moods: ["melancólico", "chill"], is_new_discovery: false },
  { id: "md5", track_name: "My Kind of Woman", artist: "Mac DeMarco", album: "2", album_cover: "https://picsum.photos/seed/md5/300/300", moods: ["enamorado", "chill"], is_new_discovery: true },
  { id: "md6", track_name: "Ode to Viceroy", artist: "Mac DeMarco", album: "2", album_cover: "https://picsum.photos/seed/md6/300/300", moods: ["chill", "feliz"], is_new_discovery: true },
  
  // Tyler, The Creator
  { id: "ttc1", track_name: "See You Again", artist: "Tyler, The Creator", album: "Flower Boy", album_cover: "https://picsum.photos/seed/ttc1/300/300", moods: ["nostálgico", "chill"], is_new_discovery: false },
  { id: "ttc2", track_name: "EARFQUAKE", artist: "Tyler, The Creator", album: "IGOR", album_cover: "https://picsum.photos/seed/ttc2/300/300", moods: ["enamorado", "nervioso"], is_new_discovery: true },
  { id: "ttc3", track_name: "Yonkers", artist: "Tyler, The Creator", album: "Goblin", album_cover: "https://picsum.photos/seed/ttc3/300/300", moods: ["energético", "nervioso"], is_new_discovery: true },
  
  // Kendrick Lamar
  { id: "kl1", track_name: "HUMBLE.", artist: "Kendrick Lamar", album: "DAMN.", album_cover: "https://picsum.photos/seed/kl1/300/300", moods: ["motivado", "energético"], is_new_discovery: false },
  { id: "kl2", track_name: "Swimming Pools", artist: "Kendrick Lamar", album: "good kid, m.A.A.d city", album_cover: "https://picsum.photos/seed/kl2/300/300", moods: ["chill", "nostálgico"], is_new_discovery: true },
  { id: "kl3", track_name: "Alright", artist: "Kendrick Lamar", album: "To Pimp a Butterfly", album_cover: "https://picsum.photos/seed/kl3/300/300", moods: ["motivado", "feliz"], is_new_discovery: true },
  
  // Lana Del Rey
  { id: "ldr1", track_name: "Summertime Sadness", artist: "Lana Del Rey", album: "Born To Die", album_cover: "https://picsum.photos/seed/ldr1/300/300", moods: ["triste", "nostálgico"], is_new_discovery: false },
  { id: "ldr2", track_name: "Video Games", artist: "Lana Del Rey", album: "Born To Die", album_cover: "https://picsum.photos/seed/ldr2/300/300", moods: ["melancólico", "nostálgico"], is_new_discovery: true },
  { id: "ldr3", track_name: "Young and Beautiful", artist: "Lana Del Rey", album: "The Great Gatsby", album_cover: "https://picsum.photos/seed/ldr3/300/300", moods: ["enamorado", "triste"], is_new_discovery: true },
  
  // The Strokes
  { id: "ts4", track_name: "Someday", artist: "The Strokes", album: "Is This It", album_cover: "https://picsum.photos/seed/ts4/300/300", moods: ["nostálgico", "energético"], is_new_discovery: false },
  { id: "ts5", track_name: "Last Nite", artist: "The Strokes", album: "Is This It", album_cover: "https://picsum.photos/seed/ts5/300/300", moods: ["energético", "chill"], is_new_discovery: true },
  { id: "ts6", track_name: "Reptilia", artist: "The Strokes", album: "Room on Fire", album_cover: "https://picsum.photos/seed/ts6/300/300", moods: ["energético", "motivado"], is_new_discovery: true },
  
  // Rosalía
  { id: "ros1", track_name: "Malamente", artist: "Rosalía", album: "El Mal Querer", album_cover: "https://picsum.photos/seed/ros1/300/300", moods: ["energético", "motivado"], is_new_discovery: false },
  { id: "ros2", track_name: "Con Altura", artist: "Rosalía", album: "Single", album_cover: "https://picsum.photos/seed/ros2/300/300", moods: ["feliz", "energético"], is_new_discovery: true },
  { id: "ros3", track_name: "La Fama", artist: "Rosalía", album: "Motomami", album_cover: "https://picsum.photos/seed/ros3/300/300", moods: ["energético", "motivado"], is_new_discovery: true },
  
  // Shakira
  { id: "sh1", track_name: "Hips Don't Lie", artist: "Shakira", album: "Oral Fixation, Vol. 2", album_cover: "https://picsum.photos/seed/sh1/300/300", moods: ["feliz", "energético"], is_new_discovery: false },
  { id: "sh2", track_name: "Whenever, Wherever", artist: "Shakira", album: "Laundry Service", album_cover: "https://picsum.photos/seed/sh2/300/300", moods: ["feliz", "enamorado"], is_new_discovery: true },
  { id: "sh3", track_name: "Waka Waka", artist: "Shakira", album: "Sale el Sol", album_cover: "https://picsum.photos/seed/sh3/300/300", moods: ["feliz", "motivado"], is_new_discovery: true },
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
