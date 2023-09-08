function slugify(text="") {
    return text
        .toString() // Make sure it's a string
        .toLowerCase() // Convert to lowercase
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/&/g, "and")
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}
export default slugify;