const API_URL = "http://localhost:8081";

export async function testBackend(): Promise<string> {
    const response = await fetch(`${API_URL}/api/test`);

    if (!response.ok) {
        throw new Error("Failed to connect to backend");
    }

    return await response.text();
}