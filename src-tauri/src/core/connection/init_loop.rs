use rosu_mem::process::{Process, ProcessTraits};
use rosu_memory_lib::reader::structs::State;
use rosu_memory_lib::reader::structs::StaticAddresses;
use rosu_memory_lib::Error;
use std::time::Duration;

static EXCLUDE_WORDS: [&str; 2] = ["umu-run", "waitforexitandrun"];

#[allow(dead_code)]
pub fn init_loop(sleep_duration: u64) -> Result<(State, Process), Error> {
    let mut state = State {
        addresses: StaticAddresses::default(),
    };

    let mut attempts = 0;
    const MAX_ATTEMPTS: u32 = 3; // Arrêter après 10 tentatives

    fn sleep_ms(ms: u64) {
        std::thread::sleep(Duration::from_millis(ms));
    }

    fn read_static_addresses(p: &Process) -> Result<StaticAddresses, Error> {
        StaticAddresses::new(p)
    }

    fn handle_error(e: Error, sleep_duration: u64) {
        if let Error::MemoryRead(msg) = e {
            if msg.contains("Process not found") {
                std::thread::sleep(Duration::from_millis(sleep_duration));
                return;
            }
            #[cfg(target_os = "windows")]
            if msg.contains("OS error") {
                std::thread::sleep(Duration::from_millis(sleep_duration));
                return;
            }
        }
        std::thread::sleep(Duration::from_millis(sleep_duration));
    }

    fn try_initialize_process() -> Option<Process> {
        Process::initialize("osu!.exe", &EXCLUDE_WORDS).ok()
    }

    fn try_read_addresses(p: &Process, sleep_duration: u64) -> Option<StaticAddresses> {
        match read_static_addresses(p) {
            Ok(v) => Some(v),
            Err(e) => {
                handle_error(e, sleep_duration);
                None
            }
        }
    }

    loop {
        attempts += 1;

        if let Some(p) = try_initialize_process() {
            if let Some(v) = try_read_addresses(&p, sleep_duration) {
                state.addresses = v;
                return Ok((state, p));
            }
        }

        sleep_ms(sleep_duration);

        if attempts >= MAX_ATTEMPTS {
            return Err(Error::MemoryRead("could not find osu process".to_string()));
        }
    }
}
