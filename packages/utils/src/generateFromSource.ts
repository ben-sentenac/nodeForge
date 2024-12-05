import fs from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';
import process from 'node:process';

//TODO get the copy stats progression 

export async function * generateFromSource(source: string, destination?: string,log?:boolean):AsyncGenerator<string> {
    if(!source || typeof source !== 'string') {
        throw new TypeError('source argument must be a string');
    }
    if(typeof destination === 'boolean') {
        log = destination;
        destination = process.cwd();
    }
    const _destination = !destination || typeof destination !== 'string' ?  process.cwd() : destination;
    const _log = log || false;

    try {
        //create destination
        await fs.mkdir(_destination, { recursive: true });
        //readir from source
        const files = await fs.readdir(source);
        for (const file of files) {
            const srcPath = path.join(source, file);
            const destPath = path.join(_destination, file);
            const fileStat = await fs.stat(srcPath);
            if(_log) {
                //TODO improve loggin using winston or pino
                console.log(`file ${destPath} succefully created!`);
            }
            if (fileStat.isDirectory()) {
                yield* generateFromSource(srcPath, destPath,log);
            } else {
                yield copyFile(srcPath, destPath);
            }
        }

    } catch (error) {
        //log error;
        throw error;
    } 
}
//TODO 
async function copyFile(source:string, target:string) {
    const sourceStream = createReadStream(source);
    const targetStream = createWriteStream(target);

    sourceStream.on('error', (err) => { throw err });
    targetStream.on('error', (err) => { throw err });

    targetStream.on('finish', () => true);

    await pipeline(
        sourceStream,
        targetStream
    );

    return target;
}

