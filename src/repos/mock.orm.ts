import jsonfile from 'jsonfile';


const dbFilePath = '@repos/database.json';


/**
 * Fetch the json from the file.
 * 
 * @returns 
 */
function openDb(): Promise<Record<string, any>> {
    return jsonfile.readFile(dbFilePath) as Promise<Record<string, any>>;
}


/**
 * Update the file.
 * 
 * @param db 
 * @returns 
 */
function saveDb(db: Record<string, any>): Promise<void> {
    return jsonfile.writeFile(dbFilePath, db);
}


// Export default
export default {
    openDb,
    saveDb,
} as const;
