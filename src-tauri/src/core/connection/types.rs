use serde::Serialize;

/// Connection status sent to frontend
#[derive(Clone, Serialize)]
pub struct ConnectionStatus {
    pub connected: bool,
    pub error: Option<String>,
}

impl ConnectionStatus {
    pub fn connected() -> Self {
        Self {
            connected: true,
            error: None,
        }
    }

    pub fn disconnected(error: String) -> Self {
        Self {
            connected: false,
            error: Some(error),
        }
    }

    pub fn reconnecting() -> Self {
        Self {
            connected: false,
            error: Some("Reconnecting...".to_string()),
        }
    }
}
