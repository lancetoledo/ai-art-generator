import { readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
    // const jsonFilePath = join(process.cwd(), "public", "JSON", "sps.json");
    const jsonContent = await readFile(jsonFilePath, "utf-8");
    const jsonData = JSON.parse(jsonContent);

    return new Response(
        JSON.stringify({
            data: jsonData
        })
    );
}
