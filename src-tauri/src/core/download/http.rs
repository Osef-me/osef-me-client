use reqwest::{Client, Response};

const USER_AGENT: &str = "osef-me-downloader/1.0";

/// Create HTTP client with proper headers
pub fn create_client() -> Client {
    Client::new()
}

/// Download file from URL
pub async fn fetch_beatmap(url: &str) -> Result<Response, String> {
    let client = create_client();

    let response = client
        .get(url)
        .header("User-Agent", USER_AGENT)
        .header("Accept", "*/*")
        .send()
        .await
        .map_err(|e| format!("HTTP request failed: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("HTTP {}", response.status()));
    }

    Ok(response)
}
