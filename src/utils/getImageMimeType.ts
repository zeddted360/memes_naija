
export const getImageMimeType = async (url: string) => {
    const res = await fetch(url, {
        method: 'HEAD',
    });
    return res.headers.get('Content-Type');
}