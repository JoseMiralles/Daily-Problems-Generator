import csv from "csv-parser";
import * as fs from "fs";

export interface IProblem {
    name: string;
    url: string;
    difficulty: 1 | 2 | 3;
    language?: string;
}

export interface IProblemSets {
    easy: IProblem[];
    medium: IProblem[];
    hard: IProblem[];
}

export const writeStringToFile = (content: string, file: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, content, () => {
            resolve();
        });
    });
}

/**
 * Loads the languages from languages.txt
 * @returns 
 */
export const getLanguagesAsync = (): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        fs.readFile("languages.txt", "utf-8", (err, data) => {
            resolve(data.split(" "));
        });
    });
}

/**
 * Loads all of the problems form problems.csv
 * @returns All the problems in arrays separated by difficulty.
 */
export const getProblemsAsync = (): Promise<IProblemSets> => {
    return new Promise((resolve, reject) => {
        const problems: IProblemSets = {
            easy: [], medium: [], hard: []
        };
        fs.createReadStream("problems.csv")
            .pipe(csv())
            .on("data", (data: IProblem) => {
                // console.log(`Loading ${getDifficulty(data.difficulty)} problem. Difficulty number: ${data.difficulty}.`)
                problems[getDifficulty(data.difficulty)].push({
                    name: data.name,
                    url: data.url,
                    difficulty: data.difficulty
                });
            }).on("end", ()=>{
                // console.log(`TOTALS:\n\tEASY:\t${problems.easy.length}\n\tMEDIUM:\t${problems.medium.length}\n\tHARD:\t${problems.hard.length}`);
                resolve(problems)
            });
    });
}

const difficulties: (keyof IProblemSets)[] = ["easy", "medium", "hard"]
/**
 * Converts a difficulty number to a difficulty key/string.
 * 
 * Ex: 2 => "medium"
 */
export const getDifficulty = (num: 1 | 2 | 3): keyof IProblemSets => {
    return difficulties[num - 1];
}
