import cache from "memory-cache";

class CacheHandler {
    private readonly EXPIRATION_TIME = 15000;

    public put(key: any, value: unknown) {
        return cache.put(key, value, this.EXPIRATION_TIME);
    }

    public get(key: any) {
        return cache.get(key);
    }

    public async handle(key: any, callback: () => any) {
        console.log("Checking cache");
        const cached = this.get(key);
        if (cached) {
            console.log("Cache found!");
            return cached;
        }
        console.log("Cach not found :( call the function");

        const result = await callback();
        this.put(key, result);

        console.log("Cache added!");

        return result;
    }
}

export default new CacheHandler();