import { getLanguagesAsync, getProblemsAsync, IProblem, IProblemSets, writeStringToFile } from "./data";

export default class Generator {

    total = 10;
    languages: string[] = [];

    constructor () {}

    public async Generate () {

        this.languages = await getLanguagesAsync();
        console.log(`Languages: ${this.languages}`)
        this.total = Math.max(this.total, this.languages.length);

        let created = 0;
        const problemsArray = await getProblemsAsync();
        const problemsUsed: Set<string> = new Set();
        const problemsResult: IProblemSets = {easy: [], medium: [], hard: []}
        const totalHardProblems = Math.floor(this.total * 0.1) // 10% of problems will be hard
        const totalMedProblems = Math.floor(this.total * 0.2) // 20% of  problems will be medium
        const totalEasyProblems = this.total - totalHardProblems - totalMedProblems;

        while (problemsResult.easy.length < totalEasyProblems) {
            const idx = Math.floor(Math.random() * problemsArray.easy.length);
            const current = problemsArray.easy[ idx ];
            if (!problemsUsed.has(current.name)) {
                current.language = this.getLang();
                problemsResult.easy.push(current);
            }
        }

        while (problemsResult.medium.length < totalMedProblems) {
            const idx = Math.floor(Math.random() * problemsArray.medium.length);
            const current = problemsArray.medium[ idx ];
            if (!problemsUsed.has(current.name)) {
                current.language = this.getLang();
                problemsResult.medium.push(current);
            }
        }

        while (problemsResult.hard.length < totalHardProblems) {
            const idx = Math.floor(Math.random() * problemsArray.hard.length);
            const current = problemsArray.hard[ idx ];
            if (!problemsUsed.has(current.name)) {
                current.language = this.getLang();
                problemsResult.hard.push(current);
            }
        }

        // console.log(problemsResult)
        await this.writeResultsToFile(problemsResult);
    }

    private async writeResultsToFile (probs: IProblemSets) {
        let res = "";
        (Object.keys(probs) as Array<keyof typeof probs>).forEach((difficulty => {
            res += `# ${difficulty.toUpperCase()}\n\n`
            probs[difficulty].forEach(p => {
                res+=`### ${p.name}\n- Language: ${p.language}\n- Link: ${p.url}\n\n<br>\n\n`
            });
            res += "\n\n"
        }));
        writeStringToFile(res, "PROBLEMS.md");
    }

    /**
     * @returns A random item from the languages array.
     */
    private getLang (): string {
        const idx = Math.floor(Math.random() * this.languages.length);
        return this.languages[idx];
    }
}