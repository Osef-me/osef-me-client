use rosu_memory_lib::reader::structs::State;
use rosu_memory_lib::reader::structs::StaticAddresses;
use rosu_mem::process::{Process, ProcessTraits};
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

    loop {
        attempts += 1;
        println!("Attempt {} to find osu! process...", attempts);

        match Process::initialize("osu!.exe", &EXCLUDE_WORDS) {
            Ok(p) => {
                println!("Found process, pid - {}", p.pid);

                println!("Reading static signatures...");
                match StaticAddresses::new(&p) {
                    Ok(v) => {
                        state.addresses = v;
                        println!("Static addresses read successfully");
                        return Ok((state, p));
                    }
                    Err(e) => {
                        match e {
                            Error::MemoryRead(msg) => {
                                if msg.contains("Process not found") {
                                    println!("Process not found, sleeping for {sleep_duration}ms");
                                    std::thread::sleep(Duration::from_millis(sleep_duration));
                                    continue;
                                }
                                #[cfg(target_os = "windows")]
                                if msg.contains("OS error") {
                                    println!("OS error, sleeping for {sleep_duration}ms");
                                    std::thread::sleep(Duration::from_millis(sleep_duration));
                                    continue;
                                }
                                println!("Unknown error, sleeping for {sleep_duration}ms");
                                std::thread::sleep(Duration::from_millis(sleep_duration));
                            }
                            _ => {
                                println!("Unknown error, sleeping for {sleep_duration}ms");
                                std::thread::sleep(Duration::from_millis(sleep_duration));
                            }
                        }
                        println!("Unknown error, sleeping for {sleep_duration}ms");
                        std::thread::sleep(Duration::from_millis(sleep_duration));
                    }
                }
            }
            Err(_) => {
                println!("could not find osu process, sleeping for {sleep_duration}ms");
                std::thread::sleep(Duration::from_millis(sleep_duration));
            }
        }

        // Arrêter après MAX_ATTEMPTS tentatives
        if attempts >= MAX_ATTEMPTS {
            println!("Failed to find osu! process after {} attempts. Giving up.", MAX_ATTEMPTS);
            return Err(Error::MemoryRead("could not find osu process".to_string()));
        }
    }
}
