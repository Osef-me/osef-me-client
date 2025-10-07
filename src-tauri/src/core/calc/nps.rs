use rosu_map::Beatmap as RmBeatmap;

pub fn calculate_nps_graph(beatmap: &RmBeatmap) -> (Vec<f64>, f64) {
    if beatmap.hit_objects.is_empty() {
        return (vec![0.0; 100], 0.0);
    }

    let first_note_time = beatmap.hit_objects.first().unwrap().start_time as f64 / 1000.0;
    let last_note_time = beatmap.hit_objects.last().unwrap().start_time as f64 / 1000.0;

    let drain_time = last_note_time - first_note_time;

    if drain_time <= 0.0 {
        return (vec![0.0; 100], 0.0);
    }

    let section_duration = drain_time / 100.0;
    let mut nps_data = vec![0.0; 100];

    for hit_object in &beatmap.hit_objects {
        let time = hit_object.start_time as f64 / 1000.0 - first_note_time;
        let section_index = ((time / drain_time) * 100.0).floor() as usize;

        if section_index < 100 {
            nps_data[section_index] += 1.0;
        }
    }

    for nps in &mut nps_data {
        *nps = *nps / section_duration;
    }

    (nps_data, drain_time)
}
