import { createApi } from 'unsplash-js';

const unsplash = createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});


const getUrlForCoffeeStores = (latLong, query, limit) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}%20&ll=${latLong}&limit=${limit}`
}

const getListOfCoffeeStorePhoto = async () => {
    const photos = await unsplash.search.getPhotos({
        query: 'coffee shop',
        page: 1,
        perPage: 40,
    });

    const unsplashResults = photos.response.results
    return unsplashResults.map((result) => result.urls["small"]);
}

export const fetchCoffeeStores = async (latLong = "13.006708240341647,80.2472835488082", limit = 6) => {

    const photos = await getListOfCoffeeStorePhoto();

    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
        }
    };

    const response = await fetch(getUrlForCoffeeStores(latLong, "coffee", limit), options);



    const data = await response.json();
    console.log(data);
    return data.results.map((result, index) => {
        const neighborhood = result.location.neighborhood
        return {
            id: result.fsq_id,
            address: result.location.address ? result.location.address : "",
            name: result.name,
            neighborhood: neighborhood && neighborhood.length >= 0 ? neighborhood[0] : "",
            imgUrl: photos.length > 0 ? photos[index] : null,
        }
    });

}