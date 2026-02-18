import axios, { CanceledError }from "axios";

export default axios.create({
    baseURL: 'http://localhost:80/api',
    // headers:{'api-key':''}
});

export { CanceledError }