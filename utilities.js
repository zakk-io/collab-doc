const GetUserAvatar = function (seed) {
    return `https://robohash.org/${encodeURIComponent(seed)}?set=set1&size=80x80`;
}


module.exports = {
    GetUserAvatar
}