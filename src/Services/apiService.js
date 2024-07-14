import axios from 'axios';

const apiKey = '7c200c6ba076f7fbfaa64a22';

export const fetchCurrenciesBasedOnDate = async (base, chosenDate) => {

    const year = chosenDate.getFullYear();
    const month = chosenDate.getMonth() + 1;
    const day = chosenDate.getDate();

    try {
        const url = `https://v6.exchangerate-api.com/v6/${apiKey}/history/${base}/${year}/${month}/${day}`
        const apiResponse = await axios.get(url)
        return apiResponse.data
    } catch (err) {
        console.error(err)
    }
}


export const fetchSupportedCodes = async () => {
    try {
        const url = `https://v6.exchangerate-api.com/v6/${apiKey}/codes`
        const apiResponse = await axios.get(url)
        return apiResponse.data
    } catch (err) {
        console.error(err) 
    }

}

