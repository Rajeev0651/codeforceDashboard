import fs from 'fs/promises';
import path from 'path';
import ChartIndexBar from './ChartIndexBar';
import ChartTagBar from './ChartTagBar';
import ChartIndexTagStackedBar from './ChartIndexTagStackedBar'; // new chart


export default async function ChartPage() {
    const filePath = path.join(process.cwd(), 'data', 'problems.json');
    const fileData = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(fileData);

    const problems = jsonData.result.problems;

    const indexFrequency = {};
    const tagFrequency = {};
    const indexTagCount = {};

    for (const p of problems) {
        // chart 1
        indexFrequency[p.index] = (indexFrequency[p.index] || 0) + 1;

        // chart 2
        for (const tag of p.tags) {
            tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
        }

        // chart 3: count number of tags per index (accumulate)
        indexTagCount[p.index] = (indexTagCount[p.index] || 0) + p.tags.length;
    }

    const tagIndexMatrix = {}; // tag -> index -> count

    for (const p of problems) {
        const idx = p.index;

        for (const tag of p.tags) {
            if (!tagIndexMatrix[tag]) tagIndexMatrix[tag] = {};
            tagIndexMatrix[tag][idx] = (tagIndexMatrix[tag][idx] || 0) + 1;
        }
    }

    return (
        <div style={{ padding: '2rem 4rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Codeforces Problem Visualizer</h1>

            <div style={{ marginBottom: '10rem' }}>
                <ChartIndexBar indexFrequency={indexFrequency} />
            </div>

            <div style={{ marginBottom: '10rem' }}>
                <ChartTagBar tagFrequency={tagFrequency} />
            </div>

            <div style={{ marginBottom: '10rem' }}>
                <ChartIndexTagStackedBar tagIndexMatrix={tagIndexMatrix} />
            </div>
        </div>
    );

}
