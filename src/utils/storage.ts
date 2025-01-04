export const storeData = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const getData = (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};
