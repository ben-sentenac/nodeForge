# nodeForge


## generateFromSource: File Generator from Source Directory

## Overview

This project provides a utility function, `generateFromSource`, which recursively reads the contents of a source directory and copies all files to a specified destination directory. The function is implemented as an `AsyncGenerator`, allowing for file generation and streaming.

## Features

- **Recursive Directory Copying:** Copies all files from the source directory to the destination.
- **Optional Logging:** Prints success messages for each file copied when enabled.
- **Error Handling:** Catches and logs errors, ensuring the program doesn't crash unexpectedly.
- **AsyncGenerator Support:** Allows streaming of copied file paths as they are processed.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/ben-sentenac/nodeForge.git
    ```
2. Install dependencies (if any):
    ```bash
    npm install
    npm run build
    ```

## Usage

### Function Signature
```ts
async function * generateFromSource(source: string, destination?: string,log?:boolean):AsyncGenerator<string>
```
```javascript
for await (const file of generateFromSource(source: string, destination?: string, log?: boolean)) {
   console.log(file);
}
```
