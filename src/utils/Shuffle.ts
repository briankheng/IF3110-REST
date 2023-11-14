type Album = {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
};

type Video = {
    id: number;
    title: string;
    description: string;
    url: string;
    thumbnail: string;
    views: number;
    is_premium: boolean;
    album_id: number;
};
  
type Rating = {
    id: number;
    score: number;
    user_id: number;
    album_id: number;
};
  
type Category = {
    id: number;
    name: string;
};

type AlbumResponse = Album & {
    videos: Video[];
    ratings: Rating[];
    categories: Category[];
};

const shuffleAlbum = (array : AlbumResponse[]) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
};

export default shuffleAlbum;