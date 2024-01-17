export const getUser = (discordInfo: any) => {
    if (discordInfo.user) return discordInfo.user
    return "-1"
}