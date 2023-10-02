export const handleError = (e: unknown) => {
    if (e instanceof Error) return e.message
    return "Something Went Wrong"

}