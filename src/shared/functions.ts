import logger from 'jet-logger';


/**
 * Print an error object if it's truthy. Useful for testing.
 * 
 * @param err 
 */
export function pErr(err?: Error): void {
    if (!!err) {
        logger.err(err);
    }
}


/**
 * Get a random number between 1 and 1,000,000,000,000
 * 
 * @returns 
 */
export function getRandomInt(): number {
    return Math.floor(Math.random() * 1_000_000_000_000);
}

export function removeAscent (str: string) {
    let temp = str;
    if (temp === null || temp === undefined) return temp;
    temp = temp.toLowerCase();
    temp = temp.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    temp = temp.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    temp = temp.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    temp = temp.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    temp = temp.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    temp = temp.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    temp = temp.replace(/đ/g, "d");
    return temp;
  }


export function paginate(array: any[], page_size : number, page_number : number) {
// human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}

export function isWithInRangeTime(timeStamp: number, second: number) {
  const now = new Date().getTime();
  
  if (timeStamp + second < now) {
    return false;
  }
  return true;
}