export function escapeRegexCharacters(str:string) {
    return str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
  }