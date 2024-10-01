import  { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { generateFromSource } from './generateFromSource';
import fs from 'node:fs/promises';
import { resolve, join, basename } from 'node:path';


const testDir = resolve(__dirname, '..', 'fixtures');
const sourceDir = join(testDir, 'sourceDirTest');
const desTemplateDir = join(testDir, 'destDirTest');

async function clearDestinationDir() {
    try {
        await fs.rm(desTemplateDir, { recursive: true });
    } catch (error) {
        //
        console.error(error);
    }
}

afterEach(async () => {
    //clear dest
   await clearDestinationDir();
});

describe('Generate-template generator test', () => {
    it('should generate template from existing source', async () => {

        const filesGenerator = generateFromSource(sourceDir, desTemplateDir);
        assert.strictEqual((await filesGenerator.next()).value, join(desTemplateDir, 'README.md'));
        assert.strictEqual((await fs.readFile(join(desTemplateDir,'README.md'))).toString('utf-8'),'# HELLO WORLD');
        assert.strictEqual((await filesGenerator.next()).value, join(desTemplateDir, 'appSource/index.log'));
        assert.strictEqual((await filesGenerator.next()).value, join(desTemplateDir, 'appSource/subFolder/sub.log'));
        assert.strictEqual((await filesGenerator.next()).value, join(desTemplateDir, 'configSource/config.log'));
        assert.strictEqual((await filesGenerator.next()).value, undefined);
    });
    it('files should have the right content', async () => {
        const filesGenerator = generateFromSource(sourceDir, desTemplateDir);
        for await (const file of filesGenerator) {
            if (basename(file) === 'README.md') {
                assert.strictEqual((await fs.readFile(file)).toString('utf-8'), `# ${'Hello world'.toUpperCase()}`);
            } 
            return;
        }
    });

    it('must throw error if source dir doesnot exists', async () => {
        const fakeSourceDir = join(testDir, 'fake-source-dir-test');
        assert.rejects(async function() {
            for await(const file of generateFromSource(fakeSourceDir, desTemplateDir)) {
                //
            }
        },
        Error
    );
    });
});