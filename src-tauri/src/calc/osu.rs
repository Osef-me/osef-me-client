use crate::calc::etterna::{rating_new, Proportion};
use crate::models::react::Rating;
use std::str::FromStr;

pub fn create_osu_rating(osu_map: &str, proportions: &Proportion) -> Rating {
    let stars = get_star_rating(osu_map);
    rating_new("osu".to_string(), stars, proportions.clone())
}

pub fn get_star_rating(osu_map: &str) -> f64 {
    match rosu_pp::Beatmap::from_str(osu_map) {
        Ok(map) => {
            let diff_attrs = rosu_pp::Difficulty::new().calculate(&map);
            diff_attrs.stars()
        }
        Err(_) => 0.0,
    }
}
