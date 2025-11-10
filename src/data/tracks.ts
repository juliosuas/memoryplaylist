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
