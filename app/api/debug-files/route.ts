import { NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
import { join } from "path";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const uploadDir = join(process.cwd(), "public/uploads");

        // Cek apakah folder ada
        try {
            await stat(uploadDir);
        } catch {
            return NextResponse.json({
                status: "error",
                message: `Directory not found: ${uploadDir}`,
                cwd: process.cwd()
            });
        }

        const files = await readdir(uploadDir);

        // Ambil detail file (permissions, size)
        const fileDetails = await Promise.all(files.map(async (f) => {
            const stats = await stat(join(uploadDir, f));
            return {
                name: f,
                size: stats.size,
                mode: stats.mode.toString(8), // permission check
                uid: stats.uid,
                gid: stats.gid
            };
        }));

        return NextResponse.json({
            status: "success",
            cwd: process.cwd(),
            uploadDir,
            files: fileDetails
        });
    } catch (error) {
        return NextResponse.json({
            status: "error",
            message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
