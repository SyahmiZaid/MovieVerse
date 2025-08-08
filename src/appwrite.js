// const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
// const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
// const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

import { Client, Databases, ID, Query } from "appwrite";

const DATABASE_ID = '6895437900156c2ddb7d';
const COLLECTION_ID = '689543ca001d51fe57fe';
const PROJECT_ID = '6895426c00100e7f457b';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
    .setProject(PROJECT_ID); // Your Appwrite Project ID

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    try {
        const result = await database.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.equal('searchTerm', searchTerm),]
        )

        if(result.documents.length > 0) {
            const doc = result.documents[0];

            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1,
            })
        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            })
        }
    } catch (error) {
        console.error(error);
    }
}

export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID,[
            Query.limit(5),
            Query.orderDesc("count")
        ])

        return result.documents;
    } catch (error) {
        console.error(error);
    }
}