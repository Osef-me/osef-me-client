use rosu_mem::process::Process;
use rosu_memory_lib::reader::structs::State;
use rosu_memory_lib::Error;
use rosu_memory_lib::reader::beatmap::common::BeatmapInfo;

pub fn detect_current_beatmap(
    process: &Process,
    state: &mut State,
) -> Result<BeatmapInfo, Error> {
    use rosu_memory_lib::reader::beatmap::stable::memory::*;
    info(process, state)
}
