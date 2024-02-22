import validUrl from 'valid-url'

export function checkUrl(url: string):boolean {
    return !!validUrl.isWebUri(url)
}
