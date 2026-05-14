import { spawn, spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { problems } from "@/data/problems";

const LANGUAGE_MAP = {
  javascript: { ext: ".js", command: "node" },
  python: { ext: ".py", command: "python3" },
  cpp: { ext: ".cpp", command: "g++", compile: true },
};

export async function POST(req) {
  const body = await req.json();
  const { code, language, problemId } = body;

  if (!code) {
    return Response.json({ error: "No code provided", status: "error" }, { status: 400 });
  }

  const problem = problems.find(p => p.id === problemId);
  if (!problem) {
    return Response.json({ error: "Problem not found", status: "error" }, { status: 404 });
  }

  const functionName = problem.functionName || "solve";
  const testInputs = problem.testInputs || [];

  let finalCode = code;
  if (language === "javascript" && testInputs.length > 0) {
    const testCasesCode = `
\n// Test execution logic
const testInputs = ${JSON.stringify(testInputs)};
if (typeof ${functionName} === 'function') {
  testInputs.forEach((input) => {
    try {
      const result = ${functionName}(...input);
      console.log(JSON.stringify(result));
    } catch (e) {
      console.error(e.message);
    }
  });
}`;
    finalCode += testCasesCode;
  } else if (language === "python" && testInputs.length > 0) {
    const testCasesCode = `
\n# Test execution logic
import json
if '${functionName}' in globals():
    test_inputs = ${JSON.stringify(testInputs)}
    for test_input in test_inputs:
        try:
            result = ${functionName}(*test_input)
            print(json.dumps(result))
        except Exception as e:
            print(str(e), file=sys.stderr)`;
    finalCode = "import sys\n" + finalCode + testCasesCode;
  }

  const langConfig = LANGUAGE_MAP[language] || LANGUAGE_MAP.javascript;
  const id = crypto.randomUUID();
  const fileName = `temp-${id}${langConfig.ext}`;
  const filePath = path.join(process.cwd(), fileName);
  const binaryPath = path.join(process.cwd(), `temp-${id}.out`);

  try {
    // 1. Write the code to a temporary file
    fs.writeFileSync(filePath, finalCode);

    // 2. Handle Compilation (if required, e.g., C++)
    if (langConfig.compile) {
      const compilation = spawnSync("g++", [filePath, "-o", binaryPath]);
      if (compilation.status !== 0) {
        return Response.json({
          stdout: "",
          stderr: compilation.stderr.toString().replace(new RegExp(filePath, "g"), "solution.cpp"),
          error: "Compilation Error",
          status: "error"
        });
      }
    }

    // 3. Execute the code with a timeout
    const result = await new Promise((resolve) => {
      const cmd = langConfig.compile ? binaryPath : langConfig.command;
      const args = langConfig.compile ? [] : [filePath];

      const child = spawn(cmd, args);
      let stdout = "";
      let stderr = "";

      // Timeout logic
      const timeout = setTimeout(() => {
        child.kill();
        resolve({
          stdout,
          stderr: stderr + "\nExecution Timed Out (5s limit)",
          error: "Time Limit Exceeded",
          status: "error"
        });
      }, 5000);



      child.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      child.on("close", (exitCode) => {
        clearTimeout(timeout);
        const cleanedStderr = stderr.replace(new RegExp(filePath, "g"), `solution${langConfig.ext}`);

        resolve({
          stdout,
          stderr: cleanedStderr,
          error: exitCode !== 0 ? `Process exited with code ${exitCode}` : null,
          status: exitCode === 0 ? "success" : "error"
        });
      });

      child.on("error", (err) => {
        clearTimeout(timeout);
        resolve({
          stdout: "",
          stderr: err.message,
          error: "Failed to start process",
          status: "error"
        });
      });
    });

    return Response.json(result);

  } catch (err) {
    console.error("Execution error:", err);
    return Response.json(
      { error: "Internal server error", message: err.message, status: "error" },
      { status: 500 }
    );
  } finally {
    // 4. Cleanup
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      if (fs.existsSync(binaryPath)) fs.unlinkSync(binaryPath);
    } catch (e) {
      console.error("Cleanup error:", e);
    }
  }
}