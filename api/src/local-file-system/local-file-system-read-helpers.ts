import { readFile as readFileNode, writeFile as writeFileNode, mkdir, rmdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { exec } from "node:child_process";

export async function readFile(path: string, throwErrorIfNotFound = true) {
    try {
        // Todo: remove the options here
        const data = await readFileNode(path, { encoding: "hex" });
        return Uint8Array.from(Buffer.from(data, 'hex'));
    } catch (err) {
        if (throwErrorIfNotFound) {
            console.error(err);
        }
    }
}

export async function writeFile(path: string, content: string) {
    try {
        const data = await writeFileNode(path, content);
    } catch (err) {
        console.error(err);
    }
}

export function findDirectory(path: string): boolean {
    return existsSync(path);
}

export async function deleteDirectory(path: string, throwErrorIfNotFound = true): Promise<void> {
    try {
        await rmdir(path);
    } catch (err) {
        if (throwErrorIfNotFound) {
            console.error(err);
        }
    }
}

export async function createDirectory(path: string, folderName: string) {
    try {
        const fullPath = `${path}/${folderName}`;
        await mkdir(fullPath);
    } catch (err) {
        console.error(err);
    }
}

export function shellCommand(command: string) {
    return new Promise<void>((res) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            res();
        });
    });

}
