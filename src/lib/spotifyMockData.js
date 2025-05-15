
export const mockPlaylists = [
  {
    id: "1",
    name: "Cosmic Drift",
    description: "Ambient soundscapes for interstellar travel",
    images: [{ url: "https://source.unsplash.com/random/300x300?galaxy" }],
    tracks: { total: 30 },
    owner: { display_name: "Star Voyager" },
  },
  {
    id: "2",
    name: "Neon Nights",
    description: "Synthwave beats for late-night drives",
    images: [{ url: "https://source.unsplash.com/random/300x300?cyberpunk" }],
    tracks: { total: 25 },
    owner: { display_name: "RetroWave FM" },
  },
  {
    id: "3",
    name: "Jungle Rhythms",
    description: "Energetic tracks for urban exploration",
    images: [{ url: "https://source.unsplash.com/random/300x300?jungle" }],
    tracks: { total: 40 },
    owner: { display_name: "Urban Beats" },
  },
  {
    id: "4",
    name: "Zen Garden",
    description: "Calming melodies for meditation and focus",
    images: [{ url: "https://source.unsplash.com/random/300x300?zen" }],
    tracks: { total: 35 },
    owner: { display_name: "Mindful Music" },
  },
  {
    id: "5",
    name: "Future Funk",
    description: "Groovy tunes from tomorrow's dance floor",
    images: [{ url: "https://source.unsplash.com/random/300x300?futurefunk" }],
    tracks: { total: 50 },
    owner: { display_name: "Groove Galaxy" },
  },
];

export const mockTracks = [
  {
    id: "t1",
    name: "Starlight Echoes",
    album: {
      name: "Celestial Journey",
      images: [{ url: "https://source.unsplash.com/random/300x300?stars" }],
    },
    artists: [{ name: "Orion Nebula" }],
    duration_ms: 220000,
    preview_url: "https://p.scdn.co/mp3-preview/2c5d8964b2113ee40c0d8200820a5597c2a00d00", 
  },
  {
    id: "t2",
    name: "Chrome Dreams",
    album: {
      name: "Digital Sunset",
      images: [{ url: "https://source.unsplash.com/random/300x300?chrome" }],
    },
    artists: [{ name: "Vector Seven" }],
    duration_ms: 195000,
    preview_url: "https://p.scdn.co/mp3-preview/3e79f8510833ced0417df230126909303889500b",
  },
  {
    id: "t3",
    name: "Urban Bloom",
    album: {
      name: "Concrete Paradise",
      images: [{ url: "https://source.unsplash.com/random/300x300?cityscape" }],
    },
    artists: [{ name: "The Concrete Collective" }],
    duration_ms: 180000,
    preview_url: "https://p.scdn.co/mp3-preview/4d0519f18a7b16f0f0b0a9c5f5d7829072df003b",
  },
  {
    id: "t4",
    name: "Silent Waterfalls",
    album: {
      name: "Tranquil Moments",
      images: [{ url: "https://source.unsplash.com/random/300x300?waterfall" }],
    },
    artists: [{ name: "Serene Sounds" }],
    duration_ms: 240000,
    preview_url: "https://p.scdn.co/mp3-preview/cb7c0659ac7e039c8100e00c3f03e0c5a0d01c2f",
  },
  {
    id: "t5",
    name: "Galactic Groove",
    album: {
      name: "Interstellar Party",
      images: [{ url: "https://source.unsplash.com/random/300x300?spaceparty" }],
    },
    artists: [{ name: "DJ Cosmos" }],
    duration_ms: 210000,
    preview_url: "https://p.scdn.co/mp3-preview/9f09f32e62f8a0f0a9b0f0c0e0d0c0b0a0f0e0d0",
  },
  {
    id: "t6",
    name: "Midnight Haze",
    album: {
      name: "Nocturne",
      images: [{ url: "https://source.unsplash.com/random/300x300?night" }],
    },
    artists: [{ name: "Luna Shadows" }],
    duration_ms: 200000,
    preview_url: "https://p.scdn.co/mp3-preview/ab12cd34ef56gh78ij90kl12mn34op56qr78st90",
  },
  {
    id: "t7",
    name: "Sunrise Overdrive",
    album: {
      name: "New Dawn",
      images: [{ url: "https://source.unsplash.com/random/300x300?sunrise" }],
    },
    artists: [{ name: "Aura Pulse" }],
    duration_ms: 190000,
    preview_url: "https://p.scdn.co/mp3-preview/1234abcd5678efgh9012ijkl3456mnop7890qrst",
  },
  {
    id: "t8",
    name: "Crystal Caves",
    album: {
      name: "Gemstone Harmonies",
      images: [{ url: "https://source.unsplash.com/random/300x300?crystal" }],
    },
    artists: [{ name: "GeoSonics" }],
    duration_ms: 230000,
    preview_url: "https://p.scdn.co/mp3-preview/zyxw9876vuts5432rqpo2109nmkl8765jihg4321fedc",
  },
];

export const mockNewReleases = [
  {
    id: "r1",
    name: "Quantum Leap",
    artists: [{ name: "Dimension Shifters" }],
    images: [{ url: "https://source.unsplash.com/random/300x300?quantum" }],
    release_date: "2025-05-10",
    tracks: { items: mockTracks.slice(0,2).map(track => ({track}))}
  },
  {
    id: "r2",
    name: "Echoes of Tomorrow",
    artists: [{ name: "Future Sound Architects" }],
    images: [{ url: "https://source.unsplash.com/random/300x300?future" }],
    release_date: "2025-04-28",
    tracks: { items: mockTracks.slice(2,4).map(track => ({track}))}
  },
  {
    id: "r3",
    name: "Bio-Rhythms",
    artists: [{ name: "Organic Pulse" }],
    images: [{ url: "https://source.unsplash.com/random/300x300?organic" }],
    release_date: "2025-04-15",
    tracks: { items: mockTracks.slice(4,6).map(track => ({track}))}
  },
  {
    id: "r4",
    name: "Chromatic Dreams",
    artists: [{ name: "Colorwave" }],
    images: [{ url: "https://source.unsplash.com/random/300x300?colorful" }],
    release_date: "2025-05-01",
    tracks: { items: mockTracks.slice(1,3).map(track => ({track}))}
  },
  {
    id: "r5",
    name: "Lunar Tides",
    artists: [{ name: "Moonlit Sonatas" }],
    images: [{ url: "https://source.unsplash.com/random/300x300?moon" }],
    release_date: "2025-03-20",
    tracks: { items: mockTracks.slice(3,5).map(track => ({track}))}
  },
];

export const mockCategories = [
  {
    id: "c1",
    name: "Ambient",
    icons: [{ url: "https://source.unsplash.com/random/300x300?ambient" }],
  },
  {
    id: "c2",
    name: "Synthwave",
    icons: [{ url: "https://source.unsplash.com/random/300x300?synthwave" }],
  },
  {
    id: "c3",
    name: "Lo-Fi",
    icons: [{ url: "https://source.unsplash.com/random/300x300?lofi" }],
  },
  {
    id: "c4",
    name: "Electronic",
    icons: [{ url: "https://source.unsplash.com/random/300x300?electronicmusic" }],
  },
  {
    id: "c5",
    name: "Chillhop",
    icons: [{ url: "https://source.unsplash.com/random/300x300?chillhop" }],
  },
];

export const mockFeaturedPlaylists = [
  {
    id: "fp1",
    name: "Galaxy's Edge Radio",
    description: "Tunes from the outer rim",
    images: [{ url: "https://source.unsplash.com/random/300x300?nebula" }],
    tracks: { total: 50, items: mockTracks.slice(0,5).map(track => ({track})) },
    owner: { display_name: "Cosmic DJ" },
  },
  {
    id: "fp2",
    name: "Retro Future Vibes",
    description: "Nostalgic sounds of tomorrow",
    images: [{ url: "https://source.unsplash.com/random/300x300?retrofuturism" }],
    tracks: { total: 50, items: mockTracks.slice(1,6).map(track => ({track})) },
    owner: { display_name: "Time Traveler Tunes" },
  },
  {
    id: "fp3",
    name: "Deep Focus Beats",
    description: "Instrumental tracks for concentration",
    images: [{ url: "https://source.unsplash.com/random/300x300?studymusic" }],
    tracks: { total: 50, items: mockTracks.slice(2,7).map(track => ({track})) },
    owner: { display_name: "FocusFlow" },
  },
  {
    id: "fp4",
    name: "Sunset Chill",
    description: "Relax and unwind with these mellow tracks",
    images: [{ url: "https://source.unsplash.com/random/300x300?sunsetvibes" }],
    tracks: { total: 50, items: mockTracks.slice(3,8).map(track => ({track})) },
    owner: { display_name: "Evening Calm" },
  },
  {
    id: "fp5",
    name: "Cybernetic Pulse",
    description: "High-energy electronic for the digital age",
    images: [{ url: "https://source.unsplash.com/random/300x300?circuit" }],
    tracks: { total: 50, items: mockTracks.slice(0,3).map(track => ({track})) },
    owner: { display_name: "System Sounds" },
  },
];
