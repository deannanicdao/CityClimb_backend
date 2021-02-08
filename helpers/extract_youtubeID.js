// Returns the 11 character video ID from a youtube url 
const getYoutubeId = (url) => {

    let url_breakdown

    if (url.includes("?")) {
        if (url.includes('?vi=')) {
            url_breakdown = url.split('?vi=')
            url = url_breakdown[1].slice(0, 11)
        } else if (url.includes('?v=')) {
            url_breakdown = url.split('?v=')
            url = url_breakdown[1].slice(0, 11)
        } else {
            url_breakdown = url.split('?')
            url = url_breakdown[0]
        }
    }

    if (url.includes('&')) {
        url_breakdown = url.split('&', 2)
        url = url_breakdown[0]
    }

    if (url.includes('/v/')) {
        url_breakdown = url.split('/v/')
        url = url_breakdown[1].slice(0, 11)
    } else if (url.includes('/embed/')) {
        url_breakdown = url.split('/embed/')
        url = url_breakdown[1].slice(0, 11)
    } else  {
        url = url.slice(url.length - 11)
    }

    return url
}

export default getYoutubeId
